import { Breadcrumb } from "../../components/ui/Breadcrumb";
import { Badge } from "../../components/ui/Badge";
import { useRole } from "../../context/RoleContext";
import { certifications } from "../../mock/academyData";
import { Award } from "lucide-react";

const statusConfig = { valid: { variant: "active", label: "Valid" }, expiring: { variant: "review", label: "Expiring Soon" }, expired: { variant: "delayed", label: "Expired" } };

export default function CertificationTracker() {
    const { roleConfig } = useRole();

    return (
        <div className="flex flex-col gap-6">
            <Breadcrumb items={["ADHI DASHBOARD", roleConfig.perspectiveLabel, "CERTIFICATIONS"]} />
            <div>
                <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Certification Tracker</h2>
                <p className="text-sm text-gray-500 mt-1">Track certifications, expiry dates, and renewals.</p>
            </div>

            <div className="space-y-4">
                {certifications.map(cert => {
                    const cfg = statusConfig[cert.status] || statusConfig.valid;
                    return (
                        <div key={cert.id} className="bg-white rounded-2xl border border-gray-100 p-6 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-adhi-surface rounded-xl flex items-center justify-center">
                                    <Award className="w-6 h-6 text-adhi-primary" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">{cert.traineeName}</h3>
                                    <p className="text-sm text-gray-500 mt-0.5">{cert.level} • {cert.region}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-6">
                                <div className="text-right">
                                    <p className="text-xs text-gray-400 font-medium">Issued: {cert.issuedAt}</p>
                                    <p className="text-xs text-gray-400 font-medium">Expires: {cert.expiresAt}</p>
                                </div>
                                <Badge label={cfg.label} variant={cfg.variant} />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
