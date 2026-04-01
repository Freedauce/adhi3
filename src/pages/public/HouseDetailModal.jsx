import { useState, useMemo } from "react";
import { X } from "lucide-react";
import { Link } from "react-router-dom";
import { generatePreviewBOQ } from "../../services/boqEngine";
import { components, regions } from "../../mock/houseTypes";

export default function HouseDetailModal({ house, onClose }) {
    const [roofType, setRoofType] = useState("flat");
    const [finishingGrade, setFinishingGrade] = useState("standard");
    const [bathrooms, setBathrooms] = useState(house.defaultBathrooms);
    const [regionCode, setRegionCode] = useState("RW");

    const config = useMemo(() => ({
        houseType: `${house.defaultBedrooms}BR`,
        bedrooms: house.defaultBedrooms,
        bathrooms,
        floorAreaM2: house.defaultFloorAreaM2,
        roofType,
        finishingGrade,
        regionCode,
    }), [house, bathrooms, roofType, finishingGrade, regionCode]);

    const boq = useMemo(() => generatePreviewBOQ(config), [config]);
    const activeRegion = regions.find(r => r.code === regionCode) || regions[0];

    return (
        <div className="fixed inset-0 z-[100] flex items-start justify-center bg-black/60 backdrop-blur-sm overflow-y-auto py-10 px-4" onClick={onClose}>
            <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl relative" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className="relative h-56 rounded-t-2xl overflow-hidden">
                    <img src={house.imageUrl} alt={house.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <button onClick={onClose} className="absolute top-4 right-4 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors">
                        <X size={18} className="text-gray-700" />
                    </button>
                    <div className="absolute bottom-6 left-6 text-white">
                        <h2 className="text-3xl font-extrabold">{house.name}</h2>
                        <p className="text-white/80 mt-1">{house.description}</p>
                    </div>
                </div>

                <div className="p-8">
                    {/* Configurator */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Roof Type</label>
                            <select value={roofType} onChange={e => setRoofType(e.target.value)} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-adhi-primary/20 focus:border-adhi-primary bg-white">
                                <option value="flat">Flat</option>
                                <option value="pitched">Pitched</option>
                                <option value="hip">Hip</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Finishing</label>
                            <select value={finishingGrade} onChange={e => setFinishingGrade(e.target.value)} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-adhi-primary/20 focus:border-adhi-primary bg-white">
                                <option value="standard">Standard</option>
                                <option value="premium">Premium</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Bathrooms</label>
                            <select value={bathrooms} onChange={e => setBathrooms(Number(e.target.value))} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-adhi-primary/20 focus:border-adhi-primary bg-white">
                                <option value={1}>1</option>
                                <option value={2}>2</option>
                                <option value={3}>3</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Region</label>
                            <select value={regionCode} onChange={e => setRegionCode(e.target.value)} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-adhi-primary/20 focus:border-adhi-primary bg-white">
                                {regions.filter(r => r.active).map(r => <option key={r.code} value={r.code}>{r.label}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* BOQ Preview Table */}
                    <div className="mb-8">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Estimated Bill of Quantities</h3>
                        <div className="overflow-x-auto border border-gray-100 rounded-xl">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="bg-gray-50">
                                        <th className="px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-widest">Component</th>
                                        <th className="px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Qty</th>
                                        <th className="px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-widest">Unit</th>
                                        <th className="px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Unit Cost</th>
                                        <th className="px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {boq.lineItems.map(item => (
                                        <tr key={item.lineId} className="border-t border-gray-50">
                                            <td className="px-4 py-3 font-medium text-gray-900">{item.description}</td>
                                            <td className="px-4 py-3 text-right text-gray-700">{item.qty}</td>
                                            <td className="px-4 py-3 text-gray-500">{item.unit}</td>
                                            <td className="px-4 py-3 text-right text-gray-700">{item.unitCost.toLocaleString()}</td>
                                            <td className="px-4 py-3 text-right font-semibold text-gray-900">{item.totalCost.toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="bg-gray-50 rounded-xl p-6 mb-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            {Object.entries(boq.summary.categorySubtotals).map(([cat, amount]) => (
                                <div key={cat}>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{cat}</p>
                                    <p className="text-lg font-bold text-gray-900">{amount.toLocaleString()} <span className="text-xs text-gray-400">{boq.currency}</span></p>
                                </div>
                            ))}
                        </div>
                        <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">{activeRegion.taxLabel} ({activeRegion.taxRatePct}%): <span className="font-semibold text-gray-700">{boq.summary.taxAmount.toLocaleString()} {boq.currency}</span></p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Grand Total</p>
                                <p className="text-2xl font-extrabold text-adhi-primary">{boq.summary.grandTotalLocal.toLocaleString()} {boq.currency}</p>
                                <p className="text-sm text-gray-500 font-medium">≈ ${boq.summary.grandTotalUsd.toLocaleString()} USD</p>
                            </div>
                        </div>
                    </div>

                    {/* CTA */}
                    <Link
                        to="/login"
                        className="block w-full bg-adhi-primary text-white py-4 rounded-2xl font-semibold text-center text-[15px] hover:bg-adhi-dark transition-colors"
                    >
                        Purchase This House →
                    </Link>
                </div>
            </div>
        </div>
    );
}
