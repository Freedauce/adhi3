import { useState, useEffect } from "react";
import { Breadcrumb } from "../../components/ui/Breadcrumb";
import { useRole } from "../../context/RoleContext";
import { financialSummary } from "../../mock/accountantData";
import { getPendingPayments, confirmPayment } from "../../mock/paymentStore";
import { CheckCircle, XCircle, Download, DollarSign, X } from "lucide-react";

export default function PendingPayments() {
    const { roleConfig } = useRole();
    const [payments, setPayments] = useState([]);
    const [viewingProof, setViewingProof] = useState(null);

    const loadPayments = () => setPayments(getPendingPayments());
    
    useEffect(() => {
        loadPayments();
    }, []);

    const handleConfirm = (orderId) => {
        confirmPayment(orderId, "Acc. Admin");
        loadPayments();
    };

    const handleReject = (orderId) => {
        alert(`Payment for ${orderId} rejected. Franchisee notified. (Mock)`);
        // In a real app we'd also update the status to REJECTED in the store
    };

    return (
        <div className="flex flex-col gap-6">
            <Breadcrumb items={["ADHI DASHBOARD", roleConfig.perspectiveLabel, "PENDING PAYMENTS"]} />
            <div>
                <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Pending Payments</h2>
                <p className="text-sm text-gray-500 mt-1">Review and confirm payment proofs to release orders.</p>
            </div>

            {/* Summary Strip */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: "Total Confirmed", value: financialSummary.totalConfirmed, color: "text-adhi-primary" },
                    { label: "Total Pending", value: financialSummary.totalPending, color: "text-amber-600" },
                    { label: "Total Processed", value: financialSummary.totalProcessed, color: "text-gray-900" },
                    { label: "Orders This Month", value: String(financialSummary.ordersThisMonth), color: "text-gray-900" },
                ].map((stat, idx) => (
                    <div key={idx} className="bg-white rounded-xl border border-gray-100 p-5">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                        <p className={`text-2xl font-extrabold ${stat.color}`}>{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Queue */}
            {payments.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                    <DollarSign className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-gray-900">All caught up!</h3>
                    <p className="text-sm text-gray-500 mt-1">No pending payments to review.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {payments.map(payment => (
                        <div key={payment.orderId} className="bg-white rounded-2xl border border-gray-100 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h3 className="font-bold text-gray-900 text-lg">{payment.franchiseeName}</h3>
                                    <p className="text-sm text-gray-500">{payment.orderId} • {payment.houseType} • {payment.region}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xl font-extrabold text-gray-900">{payment.totalUsd}</p>
                                    <p className="text-xs text-gray-400">{payment.totalAmount}</p>
                                </div>
                            </div>
                            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                    <span>Submitted: {payment.submittedAt}</span>
                                    <span>Method: {payment.paymentMethod.replace(/_/g, " ")}</span>
                                    <button onClick={() => setViewingProof(payment.proofUrl)} className="text-adhi-primary font-semibold hover:underline flex items-center gap-1">
                                        <Download size={14} /> View Proof
                                    </button>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => handleReject(payment.orderId)} className="px-4 py-2 rounded-xl border border-red-200 text-red-600 text-sm font-semibold hover:bg-red-50 transition-colors flex items-center gap-1.5">
                                        <XCircle size={14} /> Reject
                                    </button>
                                    <button onClick={() => handleConfirm(payment.orderId)} className="px-4 py-2 rounded-xl bg-adhi-primary text-white text-sm font-semibold hover:bg-adhi-dark transition-colors flex items-center gap-1.5">
                                        <CheckCircle size={14} /> Confirm Payment
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* PROOF VIEW MODAL */}
            {viewingProof && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[150] flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-[800px] overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50 shrink-0">
                            <h3 className="font-bold text-gray-900">Proof of Payment</h3>
                            <button onClick={() => setViewingProof(null)} className="text-gray-400 hover:text-gray-600">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6 overflow-auto flex-1 flex items-center justify-center bg-gray-100">
                            {viewingProof.startsWith("data:") || viewingProof.startsWith("http") || viewingProof.startsWith("blob:") ? (
                                <img src={viewingProof} alt="Proof of Payment" className="max-w-full max-h-full rounded shadow" />
                            ) : (
                                <div className="text-center text-gray-500 p-12">
                                    <p>File type cannot be previewed.</p>
                                    <a href={viewingProof} download className="text-adhi-primary font-semibold hover:underline mt-2 inline-block">Download File</a>
                                </div>
                            )}
                        </div>
                        <div className="p-4 border-t border-gray-100 bg-white shrink-0 flex justify-end">
                            <button onClick={() => setViewingProof(null)} className="bg-gray-100 text-gray-700 font-semibold px-6 py-2.5 rounded-xl hover:bg-gray-200">Close Viewer</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
