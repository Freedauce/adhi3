# ADHI Platform X Odoo Integration Contract

This document provides a clear breakdown of the system architecture boundaries between the ADHI internal back-office (Spring Boot / PostgreSQL) and the Odoo ERP system. Use this to align Odoo engineering partners with the ADHI technical requirements.

## 1. What lives in ADHI PostgreSQL?
The ADHI Platform is the **Master System**. Operations that happen *before* manufacturing and *after* delivery are handled purely inside the ADHI platform.

Odoo has **NO involvement** in the following processes. Our Spring Boot backend securely stores this data in PostgreSQL:
* **Authentication and Roles:** User profiles (Franchisees, Investors, Accountants, Admins) and encrypted passwords.
* **KYC & Applications:** Signed non-disclosure agreements, business incorporation files, and the application approval logic.
* **House Blueprints & Rules Engine:** The complex formulas determining that a "Model M" house generates exactly 1,234 wall panels based on the square footage. ADHI builds the Bill of Quantities (BOQ).

---

## 2. Where ADHI talks to Odoo (API Boundaries)

Odoo is utilized strictly as the **Fulfillment Engine**. When ADHI has done all the heavy lifting and an order is confirmed, we pass control to Odoo.

### Integration Point A: Order Confirmation (ADHI ➔ Odoo)
* **Trigger:** An ADHI Accountant reviews a Franchisee's uploaded bank receipt in the ADHI React App and clicks "Confirm Payment".
* **Action:** The ADHI Spring Boot Backend transforms the BOQ into an Odoo-compliant JSON payload and makes an external `POST` request to Odoo.
* **Odoo Requirement:** The Odoo team must expose a single API endpoint (e.g. `/api/v1/mrp.production/create`) that receives the JSON payload.
* **Payload Structure:** See `odoo-payload.json` file in this directory.

### Integration Point B: Component Sync (ADHI ➔ Odoo/ADHI)
* **Trigger:** An ADHI Admin adds a new physical material (e.g., "Solar Panel Kit") to the ADHI Component Registry.
* **Action:** ADHI will prompt the Admin to input the exact `Odoo SKU` for that item.
* **Odoo Requirement:** The Odoo team must expose an API where ADHI can ping an SKU (e.g. `SLR-KIT-100`) and receive the current physical stock quantity across regional warehouses.

### Integration Point C: Delivery Webhook (Odoo ➔ ADHI)
* **Trigger:** Factory workers packing the house kits in Odoo scan a barcode changing the order status to "SHIPPED".
* **Action:** Odoo fires a webhook out to the ADHI Platform.
* **ADHI Requirement:** ADHI exposes exactly one open webhook `POST https://api.adhi.rw/api/v1/webhooks/odoo/shipment-status`.
* **Payload Structure:** See `odoo-payload.json` file in this directory.

---
## Summary for Odoo Engineers
ADHI computes the structural engineering, applies the mathematical pricing formulas, handles the customer logic, and collects the money. You will receive a clean, final JSON list of products along with the quantity required to be dispatched from the warehouse.
