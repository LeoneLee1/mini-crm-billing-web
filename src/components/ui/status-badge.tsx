import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  activeLabel?: string;
  inactiveLabel?: string;
}

export function StatusBadge({ status, activeLabel = "Active", inactiveLabel = "Inactive" }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap",
        status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
      )}
    >
      {status === "active" ? activeLabel : inactiveLabel}
    </span>
  );
}
