# Admin Pages Overview

This directory (`src/pages/admin`) contains the React functional components that formulate the "**Admin**" perspective of the ADHI Dashboard. These pages are designed to provide high-level administrative oversight, data visualizations, and operational controls across various domains of the ADHI platform.

All pages consistently utilize:
- **`useRole` Context**: To dynamically adapt breadcrumbs and labels based on the user's role.
- **`recharts`**: For rendering responsive, dynamic charts.
- **`lucide-react`**: For consistent iconography.
- **Mock Data**: Imported from `../../mock/adminData` to populate stats, charts, and tables.

Here is an explanation of each page in this directory:

## 1. `AdminOverview.jsx`
The central dashboard landing page for administrators. It gives a 10,000-foot view of the entire platform's status.
*   **Stats Row**: Displays top-level key performance indicators (KPIs) using `StatCard` components.
*   **Global Platform Health**: An area chart visualizing the overall health and performance of the platform over time.
*   **System Alerts**: A list of critical or warning notifications that require administrative attention.

## 2. `AdminAcademy.jsx`
Focuses on the educational, training, and franchise expansion branches of ADHI.
*   **Training & Certification**: Displays metrics on decentralized delivery capacity and certified personnel.
*   **House Kit Visualizer**: A visual grid showcasing different modular house kits (e.g., Model S Studio, Model M 2-Bed, Model X Duplex) available in the system.
*   **Franchise Performance**: Tracks the ROI, progress, and status of various regional franchises, including a call-to-action to apply for a franchise.

## 3. `AdminClimate.jsx`
Dedicated to monitoring and managing the platform's environmental impact and sustainability goals.
*   **Decarbonization Roadmap**: An area chart plotting CO2 reduction progress against Net Zero targets.
*   **Environmental Impact**: A pie chart breaking down sustainability efforts (e.g., usage of Solar Energy vs. Recycled Materials vs. Water Management) alongside a centralized Sustainability Score.
*   **Carbon Credits Generated**: A list tracking the generation, transactions, and status of carbon credits tied to specific operations.

## 4. `AdminHousing.jsx`
Provides deep-dive metrics into the physical construction and housing unit deployment across active phases.
*   **Project Progress Overview**: A stacked bar chart giving real-time monitoring of housing units partitioned by their status (completed, in progress, planned) over time.
*   **Regional Distribution**: Tracks housing unit deployments and their on-track/delayed statuses organized by city or region.
*   **Role Intelligence**: Summary blocks detailing specific operational metrics like total Units Delivered, Active Nodes, and System Health.

## 5. `AdminProcurement.jsx`
Manages the supply chain, inventory tracking, and vendor relationships essential for "House-in-a-Kit" delivery.
*   **Supply Chain Control**: A multi-line chart tracking the pipeline from RFQ (Request for Quotation) through to Delivery against target thresholds.
*   **Active Vendors**: A tabulated view of current suppliers, their contract values, categories, and operational statuses.
*   **Inventory Management**: Displays overall in-stock rates and visual progress bars highlighting low stock alerts to prevent bottlenecks.
