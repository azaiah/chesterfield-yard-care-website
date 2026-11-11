"""Kie AI batch generator for Chesterfield Yard Care.

Usage:
  python3 kie.py submit     # create tasks for any asset without a task or output
  python3 kie.py poll       # poll until done, download results
Key is read from KIE_API_KEY. State is kept in state.json so reruns never re-bill.
"""
import json, os, sys, time, urllib.request, urllib.error

BASE = "https://api.kie.ai/api/v1"
KEY = os.environ["KIE_API_KEY"]
HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "..", "generated", "raw")
STATE = os.path.join(HERE, "state.json")
os.makedirs(OUT, exist_ok=True)

cfg = json.load(open(os.path.join(HERE, "assets.json")))
state = json.load(open(STATE)) if os.path.exists(STATE) else {}


def save():
    json.dump(state, open(STATE, "w"), indent=2)


def call(method, path, body=None):
    req = urllib.request.Request(BASE + path, method=method,
        data=json.dumps(body).encode() if body else None,
        headers={"Authorization": f"Bearer {KEY}", "Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=60) as r:
        return json.load(r)


def full_prompt(a):
    style = cfg.get("style_" + a["style"], "")
    return f"{a['prompt']} {style}".strip()


def submit():
    for a in cfg["images"]:
        s = state.get(a["id"], {})
        if s.get("file") or (s.get("task") and s.get("status") != "fail"):
            continue
        r = call("POST", "/jobs/createTask", {"model": "nano-banana-pro", "input": {
            "prompt": full_prompt(a), "aspect_ratio": a["aspect_ratio"],
            "resolution": a["resolution"], "output_format": "png"}})
        tries = 0
        while r.get("code") == 429 and tries < 8:
            time.sleep(20); tries += 1
            r = call("POST", "/jobs/createTask", {"model": "nano-banana-pro", "input": {
                "prompt": full_prompt(a), "aspect_ratio": a["aspect_ratio"],
                "resolution": a["resolution"], "output_format": "png"}})
        if r.get("code") != 200:
            print("submit fail", a["id"], r); continue
        time.sleep(4)
        state[a["id"]] = {"task": r["data"]["taskId"], "kind": "image", "status": "queued"}
        print("submitted", a["id"]); save()
    for v in cfg["videos"]:
        s = state.get(v["id"], {})
        if s.get("file") or (s.get("task") and s.get("status") != "fail"):
            continue
        r = call("POST", "/veo/generate", {"prompt": v["prompt"], "model": "veo3_fast",
            "generationType": "TEXT_2_VIDEO", "aspect_ratio": v["aspect_ratio"], "enableTranslation": False})
        if r.get("code") != 200:
            print("submit fail", v["id"], r); continue
        state[v["id"]] = {"task": r["data"]["taskId"], "kind": "video", "status": "queued"}
        print("submitted", v["id"]); save()


def download(url, path):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=120) as r, open(path, "wb") as f:
        f.write(r.read())


def poll_once():
    pending = 0
    for aid, s in state.items():
        if s.get("file") or s.get("status") == "fail":
            continue
        try:
            if s["kind"] == "image":
                d = call("GET", f"/jobs/recordInfo?taskId={s['task']}")["data"]
                st = d["state"]
                if st == "success":
                    urls = json.loads(d["resultJson"])["resultUrls"]
                    s["url"] = urls[0]
                elif st == "fail":
                    s["status"] = "fail"; s["err"] = d.get("failMsg"); print("FAIL", aid, s["err"]); continue
            else:
                d = call("GET", f"/veo/record-info?taskId={s['task']}")["data"]
                flag = d.get("successFlag")
                if flag == 1:
                    s["url"] = d["response"]["resultUrls"][0]
                elif flag in (2, 3):
                    s["status"] = "fail"; s["err"] = d.get("errorMessage"); print("FAIL", aid, s["err"]); continue
            if s.get("url"):
                ext = ".mp4" if s["kind"] == "video" else ".png"
                path = os.path.join(OUT, aid + ext)
                try:
                    download(s["url"], path); s["file"] = path; s["status"] = "done"; print("done", aid)
                except Exception as e:
                    s["status"] = "url-ready"; s["dl_err"] = str(e); print("download blocked", aid, e)
                    continue
            else:
                pending += 1
        except Exception as e:
            print("poll err", aid, e); pending += 1
    save()
    return pending


if __name__ == "__main__":
    if sys.argv[1] == "submit":
        submit()
    elif sys.argv[1] == "poll":
        deadline = time.time() + float(sys.argv[2] if len(sys.argv) > 2 else 3000)
        while time.time() < deadline:
            p = poll_once()
            print(time.strftime("%H:%M:%S"), "pending", p, flush=True)
            if p == 0:
                break
            time.sleep(15)
