import { cn } from "@/lib/utils";

function InfoRow({
  label,
  value,
  className,
}: {
  label: string;
  value?: string | number | null;
  className?: string;
}) {
  const text =
    value == null || (typeof value === "string" && value.trim() === "")
      ? "—"
      : String(value);

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
      <span className="text-base font-medium text-card-foreground wrap-break-word">
        {text}
      </span>
    </div>
  );
}

export default InfoRow;
