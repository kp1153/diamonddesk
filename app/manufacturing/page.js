"use client";
import { useEffect, useState } from "react";

export default function Manufacturing() {
  const [rows, setRows] = useState([]);
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ lot_no: "", worker: "", stage: "Sawing", rough_weight: "", polish_weight: "", status: "Pending" });

  const load = () => fetch("/api/manufacturing").then(r => r.json()).then(setRows);
  useEffect(() => { load(); }, []);

  const submit = async () => {
    await fetch("/api/manufacturing", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setShow(false);
    setForm({ lot_no: "", worker: "", stage: "Sawing", rough_weight: "", polish_weight: "", status: "Pending" });
    load();
  };

  const del = async (id) => {
    if (!confirm("हटाएं?")) return;
    await fetch("/api/manufacturing", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight">Manufacturing</h1>
        <button onClick={() => setShow(true)} className="bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">+ Add Job</button>
      </div>

      {show && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md space-y-4 shadow-xl">
            <h2 className="text-lg font-bold text-stone-900">नया जॉब जोड़ें</h2>
            {[["lot_no","Lot No."],["worker","Worker"],["rough_weight","Rough Weight (Ct)"],["polish_weight","Polish Weight (Ct)"]].map(([k,l]) => (
              <input key={k} placeholder={l} value={form[k]} onChange={e => setForm({...form,[k]:e.target.value})}
                className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm outline-none focus:border-amber-400" />
            ))}
            <select value={form.stage} onChange={e => setForm({...form, stage: e.target.value})}
              className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm outline-none focus:border-amber-400">
              {["Sawing","Bruting","Polishing","Grading"].map(s => <option key={s}>{s}</option>)}
            </select>
            <select value={form.status} onChange={e => setForm({...form, status: e.target.value})}
              className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm outline-none focus:border-amber-400">
              {["Pending","In Process","Done"].map(s => <option key={s}>{s}</option>)}
            </select>
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
              {["Lot No.","Worker","Stage","Rough Wt","Polish Wt","Status",""].map(h => (
                <th key={h} className="px-5 py-3 text-left text-xs font-bold text-stone-500 uppercase tracking-widest">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr><td colSpan={7} className="px-5 py-8 text-center text-stone-400 font-medium">कोई रिकॉर्ड नहीं</td></tr>
            ) : rows.map(row => (
              <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-5 py-3 font-semibold text-stone-700">{row.lot_no}</td>
                <td className="px-5 py-3 text-stone-600">{row.worker}</td>
                <td className="px-5 py-3 text-stone-600">{row.stage}</td>
                <td className="px-5 py-3 text-stone-600">{row.rough_weight}</td>
                <td className="px-5 py-3 text-stone-600">{row.polish_weight}</td>
                <td className="px-5 py-3 text-stone-600">{row.status}</td>
                <td className="px-5 py-3"><button onClick={() => del(row.id)} className="text-red-400 hover:text-red-600 text-xs font-semibold">हटाएं</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}