"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const RATES = {
  super: 0.12,
  sickLeave: 0.038,
  annualLeave: 0.077,
  payrollTax: 0.0475,
};

function formatCurrency(value: number) {
  return value.toLocaleString("en-AU", { style: "currency", currency: "AUD", maximumFractionDigits: 0 });
}

function InfoTooltip({ text }: { text: string }) {
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setVisible(true);
  };
  const hide = () => {
    timeoutRef.current = setTimeout(() => setVisible(false), 100);
  };
  const toggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setVisible((v) => !v);
  };

  return (
    <span className="relative inline-flex items-center">
      <button
        type="button"
        aria-label="More information"
        onMouseEnter={show}
        onMouseLeave={hide}
        onClick={toggle}
        className="flex h-4 w-4 items-center justify-center rounded-full bg-gray-200 text-[10px] font-bold text-gray-500 transition hover:bg-gray-300"
      >
        i
      </button>
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15 }}
            onMouseEnter={show}
            onMouseLeave={hide}
            className="absolute bottom-full left-1/2 z-10 mb-2 w-52 -translate-x-1/2 rounded-lg bg-[#1a1a1a] px-3 py-2 text-xs text-white shadow-lg"
          >
            {text}
            <span className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-[#1a1a1a]" />
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
}

function Checkbox({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <label className="flex shrink-0 cursor-pointer items-center">
      <input type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
      <div
        className={`flex h-4 w-4 items-center justify-center rounded border-2 transition-all ${
          checked ? "border-[#2248F3] bg-[#2248F3]" : "border-gray-300 bg-white"
        }`}
      >
        {checked && (
          <svg width="8" height="6" viewBox="0 0 10 8" fill="none">
            <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </div>
    </label>
  );
}

export function HiringCalculatorModal({ isOpen, onClose }: Props) {
  const [grossSalary, setGrossSalary] = useState("150,000");
  const [includeSuper, setIncludeSuper] = useState(true);
  const [includeSickLeave, setIncludeSickLeave] = useState(true);
  const [includeAnnualLeave, setIncludeAnnualLeave] = useState(true);
  const [includePayrollTax, setIncludePayrollTax] = useState(true);

  const salary = parseFloat(grossSalary.replace(/,/g, "")) || 0;
  const superAmount = includeSuper ? salary * RATES.super : 0;
  const sickLeaveAmount = includeSickLeave ? salary * RATES.sickLeave : 0;
  const annualLeaveAmount = includeAnnualLeave ? salary * RATES.annualLeave : 0;
  const payrollTaxAmount = includePayrollTax ? salary * RATES.payrollTax : 0;
  const grandTotal = salary + superAmount + sickLeaveAmount + annualLeaveAmount + payrollTaxAmount;

  const tableRows = [
    { label: "Superannuation (12%)", amount: superAmount, checked: includeSuper, onChange: () => setIncludeSuper(v => !v) },
    { label: "Accrued Sick Leave (3.8%)", amount: sickLeaveAmount, checked: includeSickLeave, onChange: () => setIncludeSickLeave(v => !v), tooltip: "The paid sick leave that you need to put aside." },
    { label: "Accrued Annual Leave (7.7%)", amount: annualLeaveAmount, checked: includeAnnualLeave, onChange: () => setIncludeAnnualLeave(v => !v), tooltip: "The paid annual leave that you need to put aside." },
    { label: "Payroll Tax (4.75%)", amount: payrollTaxAmount, checked: includePayrollTax, onChange: () => setIncludePayrollTax(v => !v), tooltip: "If your company's wage exceeds a certain amount, you need to pay additional tax." },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

          {/* Modal */}
          <motion.div
            className="relative z-10 w-full overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:max-w-lg sm:rounded-2xl"
            initial={{ scale: 0.95, opacity: 0, y: 16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 16 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <div>
                <h2 className="text-lg font-semibold text-[#1a1a1a]">True Cost of A Local Senior Developer</h2>
                <p className="text-sm text-[#888]">Australia — annual cost estimate</p>
              </div>
              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition hover:bg-gray-200"
                aria-label="Close"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            <div className="px-6 py-6 space-y-5">
              {/* Combined table */}
              <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 space-y-2.5">
                {/* Gross Annual Salary row — inline input */}
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-4 shrink-0" />
                  <span className="flex-1 text-[#666]">
                    Gross Annual Salary
                  </span>
                  <div className="relative">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-medium text-[#888]">A$</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="120,000"
                      value={grossSalary}
                      onChange={(e) => {
                        const raw = e.target.value.replace(/[^0-9]/g, "");
                        setGrossSalary(raw ? Number(raw).toLocaleString("en-AU") : "");
                      }}
                      className="w-32 rounded-lg border border-gray-200 bg-white py-1.5 pl-8 pr-2 text-right text-sm font-medium text-[#1a1a1a] outline-none focus:border-[#2248F3] focus:ring-2 focus:ring-[#2248F3]/10"
                    />
                  </div>
                </div>

                {tableRows.map(({ label, amount, checked, onChange, tooltip }) => (
                  <div key={label} className={`flex items-center gap-2 text-sm ${checked === false ? "opacity-40" : ""}`}>
                    {onChange ? (
                      <Checkbox checked={checked!} onChange={onChange} />
                    ) : (
                      <div className="w-4 shrink-0" />
                    )}
                    <span className="flex flex-1 items-center gap-1.5 text-[#666]">
                      {label}
                      {tooltip && <InfoTooltip text={tooltip} />}
                    </span>
                    <span className="pr-2 font-medium text-[#1a1a1a]">{formatCurrency(amount)}</span>
                  </div>
                ))}
                <div className="border-t border-gray-200 pt-3 space-y-1.5">
                  <div className="flex justify-between">
                    <span className="flex items-center gap-1.5 font-semibold text-[#1a1a1a]">Grand Annual Total <InfoTooltip text="This is an estimation only and should not be used as an official financial or legal calculation. Actual costs may vary." /></span>
                    <span className="pr-2 font-bold text-red-500 text-base">{formatCurrency(grandTotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-[#888]">
                    <span>Monthly cost</span>
                    <span className="pr-2 font-medium text-red-500">{formatCurrency(grandTotal / 12)}</span>
                  </div>
                </div>
              </div>
              {/* Our package */}
              <div className="rounded-xl border-2 border-[#2248F3] bg-[#f0f4ff] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-[#2248F3]">Upscalix Senior Pod</p>
                    <p className="mt-0.5 text-xs text-[#555]">3 senior devs, 2 additional staff, fully embedded</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-base font-bold text-[#2248F3]">{formatCurrency(18000)}<span className="text-xs font-normal text-[#555]">/mo</span></p>
                  </div>
                </div>
                {grandTotal > 0 && (
                  <p className="mt-3 text-xs font-medium text-[#2248F3]">
                    <span className="text-base font-bold">x5</span> Productivity, with the cost of one local hire
                  </p>
                )}
              </div>
            </div>

            {/* CTA */}
            <div className="border-t border-gray-100 px-6 py-4">
              <button
                onClick={() => window.open("https://links.cornerstoneandcompass.com/widget/bookings/turbo-team", "_blank")}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-[#1a1a1a] px-8 py-4 text-base font-medium text-white transition-all hover:bg-black hover:shadow-xl hover:scale-[1.02]"
              >
                Book a 15-minute Technical Fit Call
                <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                  <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
