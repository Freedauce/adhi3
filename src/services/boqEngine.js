// ADHI Client-Side BOQ Engine — Implements RULE-001 to RULE-010
// Uses BASE / ADJUSTMENT / GUARD pattern per v1.1 Fix 2
import { components, componentRegionPricing, regions } from "../mock/houseTypes";

/**
 * Generate a preview BOQ (not stored — for configurator real-time estimates)
 * @param {Object} config - { houseType, bedrooms, bathrooms, floorAreaM2, roofType, finishingGrade, regionCode }
 * @returns {Object} BOQ with line items, subtotals, and grand total
 */
export function generatePreviewBOQ(config) {
  const region = regions.find(r => r.code === config.regionCode) || regions[0];
  const pricing = componentRegionPricing[region.code] || componentRegionPricing.RW;

  const lineItems = [];
  let lineId = 1;

  // Helper to add a line item
  const addLine = (compId, qty, rulesApplied, costMultiplier = 1) => {
    const comp = components.find(c => c.id === compId);
    const price = pricing[compId];
    if (!comp || !price) return;
    const unitCost = Math.round(price.unitCost * costMultiplier);
    lineItems.push({
      lineId: `LN-${String(lineId++).padStart(3, "0")}`,
      compId,
      description: comp.name,
      category: comp.category,
      rulesApplied,
      qty,
      unit: comp.unit,
      unitCost,
      totalCost: unitCost * qty,
    });
  };

  // ── COMP-001: Foundation (Fixed — 1 set per house) ──
  addLine("COMP-001", 1, ["FIXED"]);

  // ── COMP-002: Wall Panels (RULE-001 + RULE-002 + RULE-002b) ──
  const bedroomCount = config.bedrooms ?? 2;
  // Layer 1: BASE from house type
  let baseCount;
  if (bedroomCount === 0) baseCount = 12;
  else if (bedroomCount === 1) baseCount = 16;
  else if (bedroomCount === 2) baseCount = 24;
  else if (bedroomCount === 3) baseCount = 32;
  else baseCount = 32 + (bedroomCount - 3) * 8;

  // Layer 2: ADJUSTMENT from floor area
  let adjCount = baseCount;
  const floorArea = config.floorAreaM2;
  if (floorArea && floorArea > 0) {
    const side = Math.sqrt(floorArea);
    const perimeter = 4 * side;
    adjCount = Math.ceil(perimeter / 0.6);
  }

  // Layer 3: GUARD — never below structural minimum
  const finalPanelCount = Math.max(baseCount, adjCount);
  addLine("COMP-002", finalPanelCount, ["RULE-001", "RULE-002", "RULE-002b"]);

  // ── COMP-003: Roof Structure (RULE-003) ──
  const roofType = config.roofType || "flat";
  let roofPieces;
  if (roofType === "pitched") roofPieces = 10; // 2 ridge + 8 rafters
  else if (roofType === "hip") roofPieces = 14; // 2 ridge + 8 rafters + 4 hip beams
  else roofPieces = 6; // flat: 6 structural beams
  addLine("COMP-003", roofPieces, ["RULE-003"]);

  // ── COMP-004: Internal Partitions (RULE-008) ──
  const rooms = bedroomCount + 2; // bedrooms + kitchen + living
  const partitions = Math.max(rooms - 1, 1);
  addLine("COMP-004", partitions, ["RULE-008"]);

  // ── COMP-005: Doors (RULE-004) ──
  const doors = bedroomCount + 2; // bedrooms + 2 common areas
  addLine("COMP-005", doors, ["RULE-004"]);

  // ── COMP-006: Windows (RULE-005) ──
  const windows = (bedroomCount * 2) + 2; // 2 per bedroom + 2 living
  addLine("COMP-006", windows, ["RULE-005"]);

  // ── COMP-007: Electrical System (Fixed — 1 set) ──
  addLine("COMP-007", 1, ["FIXED"]);

  // ── COMP-008: Plumbing Fixtures (RULE-006) ──
  const bathrooms = config.bathrooms ?? 1;
  const plumbingFixtures = bathrooms * 3; // WC + basin + shower per bathroom
  addLine("COMP-008", plumbingFixtures, ["RULE-006"]);

  // ── COMP-009: Roofing Sheets ──
  const roofSheets = Math.ceil((floorArea || 55) / 3.5); // ~3.5m2 coverage per sheet
  addLine("COMP-009", roofSheets, ["CALC"]);

  // ── COMP-010: Interior Finishes (RULE-007) ──
  const finishingGrade = config.finishingGrade || "standard";
  const finishMultiplier = finishingGrade === "premium" ? 1.4 : 1.0;
  const finishArea = floorArea || 55;
  addLine("COMP-010", finishArea, ["RULE-007"], finishMultiplier);

  // ── COMP-011: Joinery (1 set) ──
  addLine("COMP-011", 1, ["FIXED"]);

  // ── Apply regional override (RULE-009, RULE-010) ──
  const regionRule = region.code === "RW" ? "RULE-009" : region.code === "KE" ? "RULE-010" : `RULE-REGION-${region.code}`;

  // ── Calculate subtotals by category ──
  const categories = {};
  lineItems.forEach(item => {
    if (!categories[item.category]) categories[item.category] = 0;
    categories[item.category] += item.totalCost;
  });

  const subtotalLocal = lineItems.reduce((sum, i) => sum + i.totalCost, 0);
  const taxAmount = Math.round(subtotalLocal * (region.taxRatePct / 100));
  const grandTotalLocal = subtotalLocal + taxAmount;
  const grandTotalUsd = Math.round(grandTotalLocal / region.fxRateToUsd);

  return {
    boqId: `BOQ-PREVIEW-${Date.now()}`,
    configId: null,
    generatedAt: new Date().toISOString(),
    status: "PREVIEW",
    region: region.code,
    currency: region.currency,
    regionRule,
    lineItems,
    summary: {
      categorySubtotals: categories,
      subtotalLocal,
      taxLabel: region.taxLabel,
      taxRatePct: region.taxRatePct,
      taxAmount,
      grandTotalLocal,
      grandTotalUsd,
      fxRate: region.fxRateToUsd,
    },
  };
}

/**
 * Build Procurement JSON from a BOQ (for Odoo display)
 */
export function buildProcurementJSON(boq, orderId, franchiseeId) {
  const pricing = componentRegionPricing[boq.region] || componentRegionPricing.RW;

  const groups = {};
  boq.lineItems.forEach(item => {
    const comp = components.find(c => c.id === item.compId);
    const cat = comp?.category || "Other";
    if (!groups[cat]) groups[cat] = { category: cat, supplierTag: `${cat.toLowerCase()}_supplier`, items: [] };
    const price = pricing[item.compId];
    groups[cat].items.push({
      comp_id: item.compId,
      odoo_sku: price?.odooSku || "UNKNOWN",
      description: item.description,
      qty: item.qty,
      unit: item.unit,
      unit_cost: item.unitCost,
      total_cost: item.totalCost,
      qty_locked: true,
      sku_locked: true,
      cost_locked: false,
    });
  });

  return {
    procurement_id: `PROC-${orderId}`,
    boq_id: boq.boqId,
    order_id: orderId,
    generated_at: new Date().toISOString(),
    region: boq.region,
    currency: boq.currency,
    franchisee_id: franchiseeId,
    delivery_region: `${(regions.find(r => r.code === boq.region) || {}).label || boq.region}`,
    groups: Object.values(groups),
  };
}
