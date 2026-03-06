"use client";
import { useEffect, useState } from "react";

export default function GST() {
  const [rows, setRows] = useState([]);
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ invoice_no: "", party: "", date: "", taxable_amount: "", gst_percent: "1.5", gst_amount: "", total: "" });

  const load = () => fetch("/api/gst").then(r => r.json()).then(setRows);
  useEffect(() => { load(); }, []);

  const calcGST = (f) => {
    const taxable = parseFloat(f.taxable_amount) || 0;
    const pct = parseFloat(f.gst_percent) || 0;
    const gst = parseFloat((taxable * pct / 100).toFixed(2));
    const total = parseFloat((taxable + gst).toFixed(2));
    return { ...f, gst_amount: gst, total };
  };

  const submit = async () => {
    const final = calcGST(form);
    await fetch("/api/gst", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(final) });
    setShow(false);
    setForm({ invoice_no: "", party: "", date: "", taxable_amount: "", gst_percent: "1.5", gst_amount: "", total: "" });
    load();
  };

  const del = async (id) => {
    if (!confirm("हटाएं?")) return;
    await fetch("/api/gst", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    load();
  };

  const preview = calcGST(form);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight">GST</h1>
        <button onClick={() => setShow(true)} className="bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">+ Add Entry</button>
      </div>

      {show && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md space-y-4 shadow-xl">
            <h2 className="text-lg font-bold text-stone-900">नई GST एंट्री</h2>
            {[["invoice_no","Invoice No."],["party","Party"],["date","Date (YYYY-MM-DD)"],["taxable_amount","Taxable Amount (₹)"]].map(([k,l]) => (
              <input key={k} placeholder={l} value={form[k]} onChange={e => setForm({...form,[k]:e.target.value})}
                className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm outline-none focus:border-amber-400" />
            ))}
            <select value={form.gst_percent} onChange={e => setForm({...form, gst_percent: e.target.value})}
              className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm outline-none focus:border-amber-400">
              {["0.25","1.5","3","5","12","18"].map(s => <option key={s} value={s}>GST {s}%</option>)}
            </select>
            {form.taxable_amount && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-sm text-stone-700 space-y-1">
                <div className="flex justify-between"><span>GST ({form.gst_percent}%)</span><span>₹{preview.gst_amount}</span></div>
                <div className="flex justify-between font-bold"><span>Total</span><span>₹{preview.total}</span></div>
              </div>
            )}
            <div className="flex gap-3 pt-2">
              <button onClick={submit} className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 rounded-lg text-sm">Save</button>
              <button onClick={() => setShow(false)} className="flex-1 border border-gray-200 text-stone-600 font-semibold py-2 rounded-lg text-sm">Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {["Invoice No.","Party","Date","Taxable","GST %","GST Amt","Total",""].map(h => (
                <th key={h} className="px-5 py-3 text-left text-xs font-bold text-stone-500 uppercase tracking-widest">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr><td colSpan={8} className="px-5 py-8 text-center text-stone-400 font-medium">कोई रिकॉर्ड नहीं</td></tr>
            ) : rows.map(row => (
              <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-5 py-3 font-semibold text-stone-700">{row.invoice_no}</td>
                <td className="px-5 py-3 text-stone-600">{row.party}</td>
                <td className="px-5 py-3 text-stone-600">{row.date}</td>
                <td className="px-5 py-3 text-stone-600">₹{row.taxable_amount}</td>
                <td className="px-5 py-3 text-stone-600">{row.gst_percent}%</td>
                <td className="px-5 py-3 text-stone-600">₹{row.gst_amount}</td>
                <td className="px-5 py-3 font-semibold text-stone-700">₹{row.total}</td>
                <td className="px-5 py-3"><button onClick={() => del(row.id)} className="text-red-400 hover:text-red-600 text-xs font-semibold">हटाएं</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}