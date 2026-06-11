"use client";

import { Toaster } from "sonner";

export function ToasterProvider() {
  return (
    <Toaster
      position="top-center"
      dir="rtl"
      richColors
      closeButton
      toastOptions={{
        classNames: {
          toast: "font-sans text-sm",
          title: "font-bold",
        },
      }}
    />
  );
}
