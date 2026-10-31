import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export default function Breadcrumbs({ items = [] }) {
  return (
    <nav aria-label="Breadcrumb" className="my-3">
      <ol className="flex flex-wrap items-center gap-1.5 text-xs text-slate-400">
        <li>
          <Link
            href="/"
            className="flex items-center gap-1 text-slate-400 hover:text-emerald-400 transition-colors py-1 min-h-[36px] sm:min-h-0"
          >
            <Home className="h-3.5 w-3.5" />
            <span>Home</span>
          </Link>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.label || index} className="flex items-center gap-1.5">
              <ChevronRight className="h-3 w-3 text-slate-400 flex-shrink-0" />
              {isLast || !item.href ? (
                <span className="font-semibold text-white truncate max-w-[170px] sm:max-w-none">
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="hover:text-emerald-400 transition-colors py-1 min-h-[36px] sm:min-h-0 inline-flex items-center"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
