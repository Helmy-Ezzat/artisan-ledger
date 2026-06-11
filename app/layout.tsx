import type { Metadata, Viewport } from "next";
import { Tajawal } from "next/font/google";
import { ToasterProvider } from "@/components/providers/ToasterProvider";
import "./globals.css";

// Dev-only touch debugger (no-op in production)
let TouchDebug: any = null;
if (process.env.NODE_ENV === "development") {
  // import dynamically to keep layout as server component in prod
  // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-unsafe-assignment
  TouchDebug = require("@/components/dev/TouchDebug").default;
}

const tajawal = Tajawal({
  variable: "--font-tajawal",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "700", "800"],
});

export const metadata: Metadata = {
  title: "دفتر حسابات الصنايعي",
  description: "تطبيق لمتابعة أيام العمل والمدفوعات وحساب الرصيد المتبقي للصنايعية والفنيين.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "دفتر الصنايعي",
  },
};

export const viewport: Viewport = {
  themeColor: "#0d9488",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${tajawal.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans text-slate-900">
        {children}
        <ToasterProvider />
        {TouchDebug ? <TouchDebug /> : null}
      </body>
    </html>
  );
}
