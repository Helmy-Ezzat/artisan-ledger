"use client";

import { useMemo, useState } from "react";
import type { SharedClientData } from "@/app/actions/share";
import { calculateTotalEarned, calculateTotalReceived, calculateRemainingBalance, getDayEarning, calculateTotalWorkDays } from "@/lib/calculations";
import { formatDateNumeric } from "@/lib/format";
import { CurrencyText } from "@/components/ui/CurrencyText";
import { STATUS_LABELS, STATUS_COLORS, PAYMENT_METHOD_LABELS } from "@/lib/constants";
import { CalendarDays, Coins, Receipt, ShieldCheck, ChevronDown, ChevronUp } from "lucide-react";
import type { ArtisanDayRow, ArtisanPaymentRow } from "@/lib/database.types";

const MONTH_NAMES = ["يناير","فبراير","مارس","أبريل","مايو","يونيو","يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"];

function mkKey(dateStr: string) {
  const d = new Date(`${dateStr.slice(0,10)}T12:00:00+03:00`);
  return { key: `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`, label: `${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}` };
}

function groupDaysByMonth(days: ArtisanDayRow[]) {
  const map = new Map<string,{key:string;label:string;days:ArtisanDayRow[];total:number}>();
  for (const d of days) {
    const {key,label} = mkKey(d.date);
    if (!map.has(key)) map.set(key,{key,label,days:[],total:0});
    const g = map.get(key)!; g.days.push(d); g.total += getDayEarning(d);
  }
  return Array.from(map.entries()).sort((a,b)=>b[0].localeCompare(a[0])).map(([,v])=>v);
}

function groupPaymentsByMonth(payments: ArtisanPaymentRow[]) {
  const map = new Map<string,{key:string;label:string;payments:ArtisanPaymentRow[];total:number}>();
  for (const p of payments) {
    const {key,label} = mkKey(p.date);
    if (!map.has(key)) map.set(key,{key,label,payments:[],total:0});
    const g = map.get(key)!; g.payments.push(p); g.total += p.amount;
  }
  return Array.from(map.entries()).sort((a,b)=>b[0].localeCompare(a[0])).map(([,v])=>v);
}

function DayMonthAccordion({ group, defaultOpen }: { group: ReturnType<typeof groupDaysByMonth>[number]; defaultOpen: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-xl border border-slate-200 overflow-hidden">
      <button type="button" onClick={() => setOpen(o => !o)}
        className="flex w-full items-center justify-between bg-slate-50 px-3 py-2.5 active:bg-slate-100">
        <div className="flex items-center gap-2">
          {open ? <ChevronUp className="h-4 w-4 text-slate-400"/> : <ChevronDown className="h-4 w-4 text-slate-400"/>}
          <span className="text-sm font-bold text-slate-700">{group.label}</span>
          <span className="text-xs text-slate-500">({calculateTotalWorkDays(group.days)} يوم)</span>
        </div>
        <span className="text-xs bg-sky-50 rounded-lg px-2 py-0.5">
          <CurrencyText amount={group.total} numberClass="text-sky-700 font-semibold" symbolClass="text-sky-400" />
        </span>
      </button>
      {open && (
        <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
          {group.days.map(day => {
            const colors = STATUS_COLORS[day.status];
            return (
              <div key={day.id} className="flex items-center justify-between bg-white px-3 py-2">
                <div className="flex items-center gap-2.5">
                  <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${colors.dot}`}/>
                  <div>
                    <p className="text-sm font-medium text-slate-800">{formatDateNumeric(day.date)}</p>
                    <p className={`text-xs ${colors.text}`}>{STATUS_LABELS[day.status]}</p>
                  </div>
                </div>
                <CurrencyText amount={getDayEarning(day)} numberClass="text-slate-900 font-bold text-sm" symbolClass="text-slate-400 text-xs" />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function PaymentMonthAccordion({ group, defaultOpen }: { group: ReturnType<typeof groupPaymentsByMonth>[number]; defaultOpen: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-xl border border-slate-200 overflow-hidden">
      <button type="button" onClick={() => setOpen(o => !o)}
        className="flex w-full items-center justify-between bg-slate-50 px-3 py-2.5 active:bg-slate-100">
        <div className="flex items-center gap-2">
          {open ? <ChevronUp className="h-4 w-4 text-slate-400"/> : <ChevronDown className="h-4 w-4 text-slate-400"/>}
          <span className="text-sm font-bold text-slate-700">{group.label}</span>
          <span className="text-xs text-slate-500">({group.payments.length} دفعة)</span>
        </div>
        <span className="text-xs bg-emerald-50 rounded-lg px-2 py-0.5">
          <CurrencyText amount={group.total} numberClass="text-emerald-700 font-semibold" symbolClass="text-emerald-400" />
        </span>
      </button>
      {open && (
        <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
          {group.payments.map(p => (
            <div key={p.id} className="flex items-center justify-between bg-white px-3 py-2.5">
              <div>
                <p className="text-sm font-semibold text-slate-900">{formatDateNumeric(p.date)}</p>
                {p.location && <p className="text-xs font-medium text-slate-600">📍 {p.location}</p>}
                <p className="text-xs text-slate-500">{PAYMENT_METHOD_LABELS[p.payment_method]}</p>
              </div>
              <CurrencyText amount={p.amount} numberClass="text-slate-900 font-bold text-sm" symbolClass="text-slate-400 text-xs" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function SharedClientView({ data }: { data: SharedClientData }) {
  const { clientName, artisanName, days, payments, expiresAt } = data;

  const totalEarned   = calculateTotalEarned(days);
  const totalReceived = calculateTotalReceived(payments);
  const remaining     = calculateRemainingBalance(totalEarned, totalReceived);
  const totalWorkDays = calculateTotalWorkDays(days);

  const groupedDays     = useMemo(() => groupDaysByMonth(days),        [days]);
  const groupedPayments = useMemo(() => groupPaymentsByMonth(payments), [payments]);

  const expiryDate = new Date(expiresAt).toLocaleDateString("ar-EG", { year:"numeric", month:"long", day:"numeric" });

  return (
    <div className="min-h-screen bg-slate-50" dir="rtl">
      <header className="bg-teal-600 px-4 py-5 text-white">
        <div className="mx-auto max-w-lg">
          <div className="mb-1 flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 opacity-80"/>
            <span className="text-sm font-medium opacity-80">عرض للقراءة فقط</span>
          </div>
          <h1 className="text-xl font-bold">كشف حساب</h1>
          <p className="mt-0.5 text-sm text-teal-100">المقاول: <span className="font-semibold text-white">{clientName}</span></p>
          {artisanName && <p className="text-sm text-teal-100">الصنايعي: <span className="font-semibold text-white">{artisanName}</span></p>}
          <p className="mt-2 text-xs text-teal-200">صالح حتى: {expiryDate}</p>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 py-4 pb-8 space-y-4">
        {/* ملخص */}
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Coins className="h-5 w-5 text-emerald-600"/>
            <h2 className="text-base font-semibold text-slate-900">ملخص الحساب</h2>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-xl bg-sky-50 px-2 py-3 text-center">
              <p className="text-[11px] font-bold text-sky-600">المستحقات</p>
              <p className="mt-1 text-sm font-extrabold">
                <CurrencyText amount={totalEarned} numberClass="text-slate-900 font-extrabold" symbolClass="text-slate-400" />
              </p>
            </div>
            <div className="rounded-xl bg-emerald-50 px-2 py-3 text-center">
              <p className="text-[11px] font-bold text-emerald-600">وصلني</p>
              <p className="mt-1 text-sm font-extrabold">
                <CurrencyText amount={totalReceived} numberClass="text-slate-900 font-extrabold" symbolClass="text-slate-400" />
              </p>
            </div>
            <div className="rounded-xl bg-amber-50 px-2 py-3 text-center">
              <p className="text-[11px] font-bold text-amber-600">باقي</p>
              <p className="mt-1 text-sm font-extrabold">
                <CurrencyText
                  amount={Math.abs(remaining)}
                  numberClass={`font-extrabold ${remaining>0?"text-emerald-700":remaining<0?"text-rose-700":"text-slate-900"}`}
                  symbolClass="text-slate-400"
                />
                {remaining < 0 && <span className="text-rose-700 text-xs"> زائد</span>}
              </p>
            </div>
          </div>
        </section>

        {/* أيام العمل */}
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <CalendarDays className="h-5 w-5 text-sky-600"/>
            <h2 className="text-base font-semibold text-slate-900">أيام العمل ({totalWorkDays})</h2>
          </div>
          {days.length === 0
            ? <p className="py-4 text-center text-sm text-slate-500">لا توجد أيام عمل مسجّلة.</p>
            : <div className="space-y-2">{groupedDays.map((g,i) => <DayMonthAccordion key={g.key} group={g} defaultOpen={i===0}/>)}</div>
          }
        </section>

        {/* المدفوعات */}
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Receipt className="h-5 w-5 text-emerald-600"/>
            <h2 className="text-base font-semibold text-slate-900">المدفوعات ({payments.length})</h2>
          </div>
          {payments.length === 0
            ? <p className="py-4 text-center text-sm text-slate-500">لا توجد مدفوعات مسجّلة.</p>
            : <div className="space-y-2">{groupedPayments.map((g,i) => <PaymentMonthAccordion key={g.key} group={g} defaultOpen={i===0}/>)}</div>
          }
        </section>

        <p className="pt-2 text-center text-xs text-slate-400">هذه البيانات للعرض فقط ولا يمكن تعديلها عبر هذا الرابط.</p>
      </main>
    </div>
  );
}
