import { CheckCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export function SwipeBackground({
  isRight,
  passed,
  visible,
}: {
  isRight: boolean;
  passed: boolean;
  visible: boolean;
}) {
  return (
    <div
      className={cn(
        "absolute inset-0 flex items-center px-4 transition-colors",
        isRight ? "justify-start" : "justify-end",
        isRight
          ? passed
            ? "bg-green-600"
            : "bg-green-500/60"
          : passed
            ? "bg-blue-600"
            : "bg-blue-500/60",
      )}
      style={{ opacity: visible ? 1 : 0 }}
    >
      <CheckCheck
        className={cn(
          "h-5 w-5 text-white transition-transform",
          passed ? "scale-125" : "scale-90",
        )}
      />
    </div>
  );
}
