"use client";
import { useEffect, useState } from "react";

export default function Reports() {
  const [data, setData] = useState(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/inventory").then(r => r.json()),
      fetch("/api/sales").then(r => r.json()),
      fetch("/api/labour").then(r => r.json()),
      fetch("/api/gst").then(r => r.json()),
      fetch("/api/manufacturing").then(r => r.json()),
    ]).then(([inv, sal, lab, gst, mfg]) => setData({ inv, sal, lab, gst, mfg }));
  }, []);

  if (!data) return <div className="text-stone-400 text-sm">लोड हो रहा है...</div>;

  const totalSales = data.sal.reduce((s, r) => s + (parseFloat(r.amount) || 0), 0);
  const totalGST = data.gst.reduce((s, r) => s + (parseFloat(r.gst_amount) || 0), 0);
  const totalWages = data.lab.reduce((s, r) => s + (parseFloat(r.wages) || 0), 0);
  const presentWorkers = data.lab.filter(r => r.attendance === "Present").length;

  const cards = [
    { label: "कुल स्टॉक", value: data.inv.length + " stones", color: "text-blue-600", bg: "bg-blue-50 border-blue-200" },
    { label: "कुल बिक्री", value: "₹" + totalSales.toLocaleString("en-IN"), color: "text-green-600", bg: "bg-green-50 border-green-200" },
    { label: "कुल GST", value: "₹" + totalGST.toLocaleString("en-IN"), color: "text-orange-600", bg: "bg-orange-50 border-orange-200" },
    { label: "कुल मज़दूरी", value: "₹" + totalWages.toLocaleString("en-IN"), color: "text-purple-600", bg: "bg-purple-50 border-purple-200" },
    { label: "हाज़िर कारीगर", value: presentWorkers, color: "text-amber-600", bg: "bg-amber-50 border-amber-200" },
    { label: "Manufacturing Jobs", value: data.mfg.length, color: "text-stone-600", bg: "bg-gray-50 border-gray-200" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight">Reports</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {cards.map(({ label, value, color, bg }) => (
          <div key={label} className={`border rounded-xl p-5 ${bg}`}>
            <p className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-2">{label}</p>
            <p className={`text-2xl font-extrabold ${color}`}>{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}