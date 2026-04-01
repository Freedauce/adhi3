import { cn } from "../../lib/utils";

const VARIANTS = {
    active: "bg-green-100 text-green-700",
    verified: "bg-green-100 text-green-700",
    exceeding: "bg-green-100 text-green-700",
    growing: "bg-green-100 text-green-700",
    review: "bg-yellow-100 text-yellow-700",
    delayed: "bg-yellow-100 text-yellow-700",
    pending: "bg-orange-100 text-orange-700",
    ontrack: "bg-gray-100 text-gray-600",
    baseline: "bg-gray-100 text-gray-600",
    processing: "bg-[#DBEAFE] text-blue-700",
    planning: "bg-[#DBEAFE] text-blue-700",
    intransit: "bg-[#DBEAFE] text-blue-700",
};

export function Badge({ label, variant = "ontrack" }) {
    const variantClass = VARIANTS[variant.toLowerCase()] || VARIANTS.ontrack;

    return (
        <span className={cn("px-3 py-1 rounded-full text-xs font-medium", variantClass)}>
            {label}
        </span>
    );
}
