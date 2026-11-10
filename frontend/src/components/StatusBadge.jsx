import React from "react";

const styles = {
  APPROVED: "bg-mint/10 text-mint",
  PENDING: "bg-amber/10 text-amber",
  REJECTED: "bg-red-100 text-red-700",
  CONFIRMED: "bg-mint/10 text-mint",
  PENDING_PAYMENT: "bg-amber/10 text-amber",
  CANCELLED: "bg-slate-100 text-slate-600",
  PAYMENT_FAILED: "bg-red-100 text-red-700",
  ACTIVE: "bg-mint/10 text-mint",
  BLOCKED: "bg-red-100 text-red-700"
};

export default function StatusBadge({ value }) {
  return <span className={`rounded-full px-3 py-1 text-xs font-bold ${styles[value] || "bg-slate-100 text-slate-600"}`}>{value}</span>;
}
