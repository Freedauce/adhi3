# Odoo Alignment Meeting - Speaker Notes

*Tip: Read the bolded text naturally. Use the bullet points as cues for pausing and transitioning.*

## 1. Introduction & Objective (2 mins)
"Hi Ahmed, good evening and thanks for joining. 

The main objective for our meeting today is to give you a clear picture of the ADHI platform's structure and, more importantly, to align on **exactly how Odoo will integrate with it**. 

To be clear, we aren't looking to do the technical implementation right now. Today is just about establishing the system boundaries and making sure we have shared expectations."

---

## 2. What We Have Built: The Frontend (3 mins)
"First, let me give you a high-level overview of what our team has already built.

We have a fully functional frontend application handling all user interactions. Within this, we've developed dedicated dashboards for different areas: Housing, Procurement, Academy, and Climate. 

The system is highly visual, role-based, and includes logic that adapts based on the region. Right now, we are relying on mock data to validate these user flows."

---

## 3. The Core: 'House-in-a-Kit' Logic (5 mins)
"Now, the most critical part of our system is what we call the **'House-in-a-Kit' logic**. Think of this as our digital construction brain.

Inside the ADHI platform, we manage all the complex logic for building components—things like panels, blocks, and roofs. 

Our system takes various user inputs, and we have a **custom-built internal rules engine** that processes these inputs to calculate the exact structural quantities needed. 

The final output of all this logic is a complete **Bill of Quantities (BOQ)**, generated as a clean, structured JSON file. **This generation process is entirely owned and executed by the ADHI platform.**"

---

## 4. The Role of Odoo (5 mins)
"This brings us to Odoo's role in the ecosystem. 

We are bringing Odoo in **strictly to handle backend operations**. This means managing procurement, tracking suppliers, handling inventory, and managing those subsequent workflows. 

For our integration, this means Odoo will simply **receive the final, structured BOQ data** from us. It will *not* receive the raw user inputs. 

The most important takeaway here is that **Odoo should not calculate any quantities**, nor should it try to replicate our 'House-in-a-Kit' logic. Odoo's job is to consume the structured data our system produces."

---

## 5. Summary & Key Principles (2 mins)
"To quickly summarize our core principles so we are on the same page:

1. **The ADHI frontend** handles all user interface and interactions.
2. **The ADHI rules engine** handles all calculations, rules, and construction logic.
3. **Odoo** handles the operational execution—procurement and inventory.

Our goal is to keep these system layers strictly separated."

---

## 6. Next Steps (3 mins)
"Ahmed, before we wrap up, I want to make sure we are both in agreement on this separation of roles. Does this make sense from your side?

*(Wait for response)*

Great. Because we are aligned on this, our next step will be mapping out the actual integration approach—figuring out if we want to use direct APIs or webhooks to pass that JSON data over to you. We can schedule a follow-up to define that technical architecture."
