# Turning on text alerts (A2P 10DLC)

US carriers block business texts from unregistered numbers. Until registration is approved, the site keeps `SMS_ENABLED=false`:
leads still save and email alerts still go out, but no texts are sent.

1. In Twilio, buy a local 804 number for the business.
2. Messaging → Regulatory Compliance → register the **Brand** (business legal name, EIN if any; a sole proprietor can use the Sole Proprietor brand type).
3. Register a **Campaign**: use case "Customer Care" / "Mixed". Sample messages:
   - "Got it! Chesterfield Yard Care will reach out shortly. Want a faster quote? Reply with a photo of your yard. Reply STOP to opt out."
   - "New quote request: Jane D · 804-555-0100 · 123 Main St, Midlothian"
   - Opt-in description: "Customers request a quote on chesterfieldyardcare.com and agree to be texted about it. Privacy policy at /privacy."
4. Attach the number to the campaign's Messaging Service.
5. Once approved (usually days to a few weeks), set `TWILIO_*`, `OWNER_ALERT_PHONE` and `SMS_ENABLED=true` in Netlify.
