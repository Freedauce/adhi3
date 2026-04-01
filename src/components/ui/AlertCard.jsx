import { AlertCircle, CheckCircle } from "lucide-react";

export function AlertCard({ type = "error", message }) {
    const isError = type === "error";

    return (
        <div
            className={`p-4 rounded-xl flex items-start space-x-3 mb-3 ${isError ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"
                }`}
        >
            {isError ? (
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            ) : (
                <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            )}
            <p className="text-sm font-medium leading-snug">{message}</p>
        </div>
    );
}
