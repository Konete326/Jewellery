import { Component } from "@/components/ui/luma-spin";

export default function LumaSpinDemo() {
  return (
    <div className="p-8 flex flex-col items-center justify-center gap-6 bg-neutral-900 text-white min-h-[200px] rounded-xl">
      <Component />
      <Component variant="amber" size={50} />
    </div>
  );
}
