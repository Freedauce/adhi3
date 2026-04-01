import { ChevronRight } from "lucide-react";

export function Breadcrumb({ items = [] }) {
    if (!items || items.length === 0) return null;

    return (
        <nav className="flex items-center space-x-2 text-xs uppercase tracking-wide mb-6">
            {items.map((item, index) => {
                const isLast = index === items.length - 1;

                return (
                    <div key={item} className="flex items-center">
                        <span className={isLast ? "font-bold text-gray-900" : "text-gray-400"}>
                            {item}
                        </span>
                        {!isLast && <ChevronRight className="w-3 h-3 text-gray-300 ml-2" />}
                    </div>
                );
            })}
        </nav>
    );
}
