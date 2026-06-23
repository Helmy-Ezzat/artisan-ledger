import { LinkIcon } from "lucide-react";

export default function ShareNotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm text-center max-w-sm w-full">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-rose-100">
          <LinkIcon className="h-7 w-7 text-rose-500" />
        </div>
        <h1 className="text-xl font-bold text-slate-900 mb-2">الرابط غير صالح</h1>
        <p className="text-sm text-slate-500">هذا الرابط انتهت صلاحيته أو تم إلغاؤه.</p>
      </div>
    </div>
  );
}
