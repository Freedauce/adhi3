import { useState } from "react";
import { Breadcrumb } from "../../components/ui/Breadcrumb";
import { useRole } from "../../context/RoleContext";
import { houseTypes, regions } from "../../mock/houseTypes";
import { generatePreviewBOQ, buildProcurementJSON } from "../../services/boqEngine";
import { ChevronDown, ChevronUp, ShoppingCart, Upload, CheckCircle2, X } from "lucide-react";
import { addPayment } from "../../mock/paymentStore";

export default function HouseCatalog() {
    const { roleConfig } = useRole();
    const [selected, setSelected] = useState(null);
    const [config, setConfig] = useState({ roofType: "flat", finishingGrade: "standard", bathrooms: 1, regionCode: "RW" });
    const [showBOQ, setShowBOQ] = useState(false);
    const [showProcJSON, setShowProcJSON] = useState(false);
    
    // Payment Modal State
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [proofFile, setProofFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [toast, setToast] = useState('');

    const updateConfig = (k, v) => setConfig(prev => ({ ...prev, [k]: v }));

    const selectHouse = (house) => {
        setSelected(house);
        setConfig(prev => ({ ...prev, bathrooms: house.defaultBathrooms }));
        setShowBOQ(false);
        setShowProcJSON(false);
    };

    const boq = selected ? generatePreviewBOQ({
        houseType: `${selected.defaultBedrooms}BR`,
        bedrooms: selected.defaultBedrooms,
        bathrooms: config.bathrooms,
        floorAreaM2: selected.defaultFloorAreaM2,
        ...config,
    }) : null;

    const procJSON = boq ? buildProcurementJSON(boq, `ORD-DRAFT-${Date.now()}`, "USR-789") : null;

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            // Mock file URL creation using a local blob
            setProofFile(URL.createObjectURL(file));
        }
    };

    const handleSubmitOrder = () => {
        if (!proofFile) {
            alert("Please upload standard proof of payment.");
            return;
        }
        setIsSubmitting(true);
        setTimeout(() => {
            addPayment({
                franchiseeName: "Client User", // Can use the actual user context
                houseType: selected.name,
                region: config.regionCode,
                totalAmount: `${boq.summary.grandTotalLocal.toLocaleString()} ${boq.currency}`,
                totalUsd: `$${boq.summary.grandTotalUsd.toLocaleString()}`,
                paymentMethod: "BANK_TRANSFER",
                proofUrl: proofFile, 
            });
            setIsSubmitting(false);
            setShowPaymentModal(false);
            setProofFile(null);
            
            setToast('Order submitted successfully! Awaiting accountant verification.');
            setTimeout(() => setToast(''), 4000);
            
            setSelected(null); // Reset
        }, 1000);
    };

    return (
        <div className="flex flex-col gap-6">
            <Breadcrumb items={["ADHI DASHBOARD", roleConfig.perspectiveLabel, "HOUSE CATALOG"]} />
            <div>
                <h2 className="text-3xl font-bold text-gray-900 tracking-tight">House Catalog</h2>
                <p className="text-sm text-gray-500 mt-1">Browse, configure, and purchase house kits.</p>
            </div>
            
            {toast && (
                <div className="bg-emerald-500 text-white px-6 py-3 rounded-xl flex items-center gap-3 font-semibold shadow-lg fixed top-6 right-6 z-[200]">
                    <CheckCircle2 size={18} /> {toast}
                </div>
            )}

            {!selected ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {houseTypes.filter(h => h.status === "ACTIVE").map(house => (
                        <div key={house.id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-md transition-shadow cursor-pointer group" onClick={() => selectHouse(house)}>
                            <div className="relative aspect-[16/11] overflow-hidden">
                                <img src={house.imageUrl} alt={house.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                <div className="absolute top-3 right-3 bg-white/95 text-gray-900 text-[11px] px-2.5 py-1 rounded-full font-bold">{house.tag}</div>
                            </div>
                            <div className="p-5">
                                <h3 className="font-bold text-gray-900">{house.name}</h3>
                                <p className="text-sm text-gray-500 mt-1">{house.defaultBedrooms > 0 ? `${house.defaultBedrooms} Bed` : "Studio"} • {house.defaultFloorAreaM2}m² • {house.assemblyWeeks} wk</p>
                                <p className="text-lg font-bold text-adhi-primary mt-3">${house.basePriceUsd.toLocaleString()} <span className="text-xs text-gray-400 font-normal">USD</span></p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="space-y-6">
                    <button onClick={() => setSelected(null)} className="text-sm text-adhi-primary font-semibold hover:underline">← Back to Catalog</button>

                    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                        <div className="relative h-52">
                            <img src={selected.imageUrl} alt={selected.name} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                            <div className="absolute bottom-5 left-6 text-white">
                                <h2 className="text-2xl font-extrabold">{selected.name}</h2>
                                <p className="text-white/80 text-sm">{selected.description}</p>
                            </div>
                        </div>

                        <div className="p-6">
                            {/* Configurator */}
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Configure Your Kit</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Roof Type</label>
                                    <select value={config.roofType} onChange={e => updateConfig("roofType", e.target.value)} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-adhi-primary/20 focus:border-adhi-primary bg-white">
                                        <option value="flat">Flat</option><option value="pitched">Pitched</option><option value="hip">Hip</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Finishing</label>
                                    <select value={config.finishingGrade} onChange={e => updateConfig("finishingGrade", e.target.value)} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-adhi-primary/20 focus:border-adhi-primary bg-white">
                                        <option value="standard">Standard</option><option value="premium">Premium (+40%)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Bathrooms</label>
                                    <select value={config.bathrooms} onChange={e => updateConfig("bathrooms", Number(e.target.value))} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-adhi-primary/20 focus:border-adhi-primary bg-white">
                                        <option value={1}>1</option><option value={2}>2</option><option value={3}>3</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Region</label>
                                    <select value={config.regionCode} onChange={e => updateConfig("regionCode", e.target.value)} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-adhi-primary/20 focus:border-adhi-primary bg-white">
                                        {regions.filter(r => r.active).map(r => <option key={r.code} value={r.code}>{r.label}</option>)}
                                    </select>
                                </div>
                            </div>

                            <button onClick={() => setShowBOQ(true)} className="bg-adhi-primary text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-adhi-dark transition-colors flex items-center gap-2">
                                <ShoppingCart size={16} /> Generate BOQ & Review
                            </button>
                        </div>
                    </div>

                    {showBOQ && boq && (
                        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6">
                            <h3 className="text-lg font-bold text-gray-900">Bill of Quantities — Review</h3>
                            <div className="overflow-x-auto border border-gray-100 rounded-xl">
                                <table className="w-full text-left text-sm">
                                    <thead>
                                        <tr className="bg-gray-50">
                                            <th className="px-4 py-3 text-xs font-bold text-gray-400 uppercase">Component</th>
                                            <th className="px-4 py-3 text-xs font-bold text-gray-400 uppercase">Category</th>
                                            <th className="px-4 py-3 text-xs font-bold text-gray-400 uppercase text-right">Qty</th>
                                            <th className="px-4 py-3 text-xs font-bold text-gray-400 uppercase">Unit</th>
                                            <th className="px-4 py-3 text-xs font-bold text-gray-400 uppercase text-right">Unit Cost</th>
                                            <th className="px-4 py-3 text-xs font-bold text-gray-400 uppercase text-right">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {boq.lineItems.map(item => (
                                            <tr key={item.lineId} className="border-t border-gray-50">
                                                <td className="px-4 py-3 font-medium text-gray-900">{item.description}</td>
                                                <td className="px-4 py-3 text-gray-500">{item.category}</td>
                                                <td className="px-4 py-3 text-right text-gray-700 font-semibold">{item.qty}</td>
                                                <td className="px-4 py-3 text-gray-500">{item.unit}</td>
                                                <td className="px-4 py-3 text-right text-gray-700">{item.unitCost.toLocaleString()}</td>
                                                <td className="px-4 py-3 text-right font-bold text-gray-900">{item.totalCost.toLocaleString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Summary */}
                            <div className="bg-adhi-surface rounded-xl p-6">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-sm text-gray-600">Subtotal</span>
                                    <span className="font-bold text-gray-900">{boq.summary.subtotalLocal.toLocaleString()} {boq.currency}</span>
                                </div>
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-sm text-gray-600">{boq.summary.taxLabel} ({boq.summary.taxRatePct}%)</span>
                                    <span className="font-bold text-gray-700">{boq.summary.taxAmount.toLocaleString()} {boq.currency}</span>
                                </div>
                                <div className="border-t border-adhi-primary/20 pt-3 flex items-center justify-between">
                                    <span className="font-bold text-gray-900">Grand Total</span>
                                    <div className="text-right">
                                        <p className="text-2xl font-extrabold text-adhi-primary">{boq.summary.grandTotalLocal.toLocaleString()} {boq.currency}</p>
                                        <p className="text-sm text-gray-500">≈ ${boq.summary.grandTotalUsd.toLocaleString()} USD</p>
                                    </div>
                                </div>
                            </div>

                            {/* Odoo JSON (collapsible) */}
                            <div className="border border-gray-200 rounded-xl overflow-hidden">
                                <button onClick={() => setShowProcJSON(!showProcJSON)} className="w-full px-4 py-3 bg-gray-50 flex items-center justify-between text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors">
                                    <span>Procurement Data → Odoo</span>
                                    {showProcJSON ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                </button>
                                {showProcJSON && (
                                    <div className="p-4 bg-gray-900 text-green-400 text-xs font-mono overflow-x-auto max-h-80 overflow-y-auto">
                                        <pre>{JSON.stringify(procJSON, null, 2)}</pre>
                                    </div>
                                )}
                                <p className="px-4 py-2 text-xs text-gray-400 bg-gray-50 border-t border-gray-200">
                                    This data is sent automatically to Odoo when your payment is confirmed.
                                </p>
                            </div>

                            <button className="w-full bg-adhi-primary text-white py-4 rounded-2xl font-semibold text-[15px] hover:bg-adhi-dark transition-colors" onClick={() => setShowPaymentModal(true)}>
                                Submit Purchase Order
                            </button>
                        </div>
                    )}
                </div>
            )}
            
            {/* PAYMENT MODAL */}
            {showPaymentModal && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[150] flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-[500px] overflow-hidden">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                            <h3 className="font-bold text-gray-900">Upload Proof of Payment</h3>
                            <button onClick={() => setShowPaymentModal(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={20} />
                            </button>
                        </div>
                        
                        <div className="p-6">
                            <div className="bg-blue-50 text-blue-800 text-sm px-4 py-3 rounded-lg mb-6 border border-blue-100">
                                <strong>Amount Due:</strong> {boq.summary.grandTotalLocal.toLocaleString()} {boq.currency} <br />
                                <strong>Reference:</strong> Bank transfer to ADHI Accounts.
                            </div>
                            
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Upload Receipt (PDF, PNG, JPG)</label>
                            
                            {!proofFile ? (
                                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer relative">
                                    <Upload size={32} className="text-adhi-primary mb-3" />
                                    <p className="text-sm font-semibold text-gray-700">Click to upload or drag and drop</p>
                                    <p className="text-xs text-gray-500 mt-1">PNG, JPG, PDF up to 5MB</p>
                                    <input 
                                        type="file" 
                                        accept=".png, .jpg, .jpeg, .pdf"
                                        onChange={handleFileChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                </div>
                            ) : (
                                <div className="border border-emerald-200 bg-emerald-50 rounded-xl p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center">
                                            <CheckCircle2 size={20} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-emerald-800">File attached successfully</p>
                                            <p className="text-xs text-emerald-600">Ready to submit order.</p>
                                        </div>
                                    </div>
                                    <button onClick={() => setProofFile(null)} className="text-sm text-red-500 hover:underline">Remove</button>
                                </div>
                            )}
                            
                            <div className="mt-8 flex justify-end gap-3">
                                <button onClick={() => setShowPaymentModal(false)} className="px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl">Cancel</button>
                                <button 
                                    onClick={handleSubmitOrder} 
                                    disabled={!proofFile || isSubmitting}
                                    className="bg-adhi-primary text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow hover:bg-adhi-dark disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {isSubmitting ? "Submitting..." : "Confirm & Submit Order"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
