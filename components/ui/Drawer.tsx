"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Drawer({ isOpen, onClose, title, children }: DrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        ref={drawerRef}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-white rounded-t-2xl shadow-2xl max-h-[90vh] overflow-y-auto animate-slide-up"
      >
        <div className="sticky top-0 z-10 bg-white border-b border-slate-200 px-4 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">{title}</h2>
            <button
              onClick={onClose}
              className="h-10 w-10 flex items-center justify-center rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 transition active:scale-95"
              aria-label="إغلاق"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>,
    document.body
  );
}
