"use client";
import * as React from "react";
import { Command } from "cmdk";
import { useRouter } from "next/navigation";

export default function CommandBar() {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  React.useEffect(() => {
    const onKeydown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKeydown);
    return () => window.removeEventListener("keydown", onKeydown);
  }, []);
  return (
    <div hidden={!open} className="fixed inset-0 z-50 bg-black/50 p-4" onClick={() => setOpen(false)}>
      <Command
        onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
        onClick={(e) => e.stopPropagation()}
        className="mx-auto w-full max-w-xl rounded-xl bg-neutral-900 text-white shadow-lg"
      >
        <Command.Input autoFocus placeholder="Ask Recall… e.g., blockchain from last month" className="w-full bg-transparent px-4 py-3 outline-none" />
        <Command.List className="px-2 pb-2">
          <Command.Empty className="px-3 py-2 text-neutral-400">Type to search…</Command.Empty>
          <Command.Item
            onSelect={() => {
              setOpen(false);
              router.push("/search");
            }}
            className="px-3 py-2 rounded data-[selected=true]:bg-white/10"
          >
            Search
          </Command.Item>
          <Command.Item
            onSelect={() => {
              setOpen(false);
              router.push("/import");
            }}
            className="px-3 py-2 rounded data-[selected=true]:bg-white/10"
          >
            Import
          </Command.Item>
        </Command.List>
      </Command>
    </div>
  );
}

