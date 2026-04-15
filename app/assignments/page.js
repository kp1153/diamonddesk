"use client";
import { useEffect, useState } from "react";

export default function Assignments() {
  const [rows, setRows] = useState([]);
  const [karigars, setKarigars] = useState([]);
  const [lots, setLots] = useState([]);
  const [show, setShow] = useState(false);
  const [returnShow, setReturnShow] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ karigarId: "", lotId: "", issuedWeight: "", stage: "आरी" });
  const [returnForm, setReturnForm] = useState({ returnedWeight: "", wages: "" });

  const safeFetch = (url) => fetch(url).then(r => {
    if (r.status === 401) { window.location.href = "/"; return null; }
    return r.json();
  });

  const load = () => safeFetch("/api/assignments").then(data => { if (data && Array.isArray(data)) setRows(data); });
  const loadKarigars = () => safeFetch("/api/karigars").then(data => { if (data && Array.isArray(data)) setKarigars(data); });
  const loadLots = () => safeFetch("/api/lots").then(data => { if (data && Array.isArray(data)) setLots(data); });

  useEffect(() => { load(); loadKarigars(); loadLots(); }, []);

  const submit = async () => {
    await fetch("/api/assignments", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setShow(false);
    setForm({ karigarId: "", lotId: "", issuedWeight: "", stage: "आरी" });
    load();
  };

  const submitReturn = async () => {
    await fetch("/api/assignments", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: selected.id, ...returnForm }) });
    setReturnShow(false);
    setSelected(null);
    setReturnForm({ returnedWeight: "", wages: "" });
    load();
  };

  const del = async (id) => {
    if (!confirm("हटाएं?")) return;
    await fetch("/api/assignments", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-extrabold text-stone-900">काम सौंपें</h1>
        <button onClick={() => setShow(true)} className="bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold px-4 py-2 rounded-lg">+ काम सौंपें</button>
      </div>

      {show && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md space-y-4 shadow-xl">
            <h2 className="text-lg font-bold text-stone-900">काम सौंपें</h2>
            <select value={form.karigarId} onChange={e => setForm({...form, karigarId: e.target.value})}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-base outline-none focus:border-amber-400">
              <option value="">कारीगर चुनें</option>
              {karigars.map(k => <option key={k.id} value={k.id}>{k.name}</option>)}
            </select>
            <select value={form.lotId} onChange={e => setForm({...form, lotId: e.target.value})}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-base outline-none focus:border-amber-400">
              <option value="">लॉट चुनें</option>
              {lots.map(l => <option key={l.id} value={l.id}>{l.lotNo} ({l.roughWeight} कैरेट)</option>)}
            </select>
            <input placeholder="वजन (कैरेट)" value={form.issuedWeight} onChange={e => setForm({...form, issuedWeight: e.target.value})}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-base outline-none focus:border-amber-400" />
            <select value={form.stage} onChange={e => setForm({...form, stage: e.target.value})}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-base outline-none focus:border-amber-400">
              {["आरी","घिसाई","पॉलिश","जाँच"].map(s => <option key={s}>{s}</option>)}
            </select>
            <div className="flex gap-3 pt-2">
              <button onClick={submit} className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 rounded-lg text-base">सेव करें</button>
              <button onClick={() => setShow(false)} className="flex-1 border border-gray-200 text-stone-600 font-semibold py-3 rounded-lg text-base">रद्द करें</button>
            </div>
          </div>
        </div>
      )}

      {returnShow && selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md space-y-4 shadow-xl">
            <h2 className="text-lg font-bold text-stone-900">काम वापस लें — {selected.karigarName}</h2>
            <input placeholder="वापस वजन (कैरेट)" value={returnForm.returnedWeight} onChange={e => setReturnForm({...returnForm, returnedWeight: e.target.value})}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-base outline-none focus:border-amber-400" />
            <input placeholder="मजदूरी (₹)" value={returnForm.wages} onChange={e => setReturnForm({...returnForm, wages: e.target.value})}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-base outline-none focus:border-amber-400" />
            <div className="flex gap-3 pt-2">
              <button onClick={submitReturn} className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 rounded-lg text-base">सेव करें</button>
              <button onClick={() => setReturnShow(false)} className="flex-1 border border-gray-200 text-stone-600 font-semibold py-3 rounded-lg text-base">रद्द करें</button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile card view */}
      <div className="md:hidden space-y-3">
        {rows.length === 0 ? (
          <p className="text-center text-stone-400 py-8">कोई काम नहीं</p>
        ) : rows.map(row => (
          <div key={row.id} className="bg-white border border-gray-200 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <p className="font-extrabold text-stone-800 text-lg">{row.karigarName}</p>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${row.status === "लंबित" ? "bg-orange-100 text-orange-600" : "bg-green-100 text-green-600"}`}>{row.status}</span>
            </div>
            <p className="text-stone-500 text-sm">लॉट: {row.lotNo} | काम: {row.stage}</p>
            <p className="text-stone-500 text-sm">दिया: {row.issuedWeight} कैरेट | वापस: {row.returnedWeight ? `${row.returnedWeight} कैरेट` : "—"}</p>
            <p className="text-stone-500 text-sm">मजदूरी: {row.wages ? `₹${row.wages}` : "—"}</p>
            <div className="flex gap-3 pt-1">
              {row.status === "लंबित" && (
                <button onClick={() => { setSelected(row); setReturnShow(true); }} className="text-amber-500 text-sm font-semibold">वापस लें</button>
              )}
              <button onClick={() => del(row.id)} className="text-red-400 text-sm font-semibold">हटाएं</button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {["कारीगर","लॉट","काम","दिया वजन","वापस वजन","मजदूरी","स्थिति",""].map(h => (
                <th key={h} className="px-5 py-3 text-left text-xs font-bold text-stone-500 uppercase tracking-widest">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr><td colSpan={8} className="px-5 py-8 text-center text-stone-400">कोई काम नहीं</td></tr>
            ) : rows.map(row => (
              <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-5 py-3 font-semibold text-stone-700">{row.karigarName}</td>
                <td className="px-5 py-3 text-stone-600">{row.lotNo}</td>
                <td className="px-5 py-3 text-stone-600">{row.stage}</td>
                <td className="px-5 py-3 text-stone-600">{row.issuedWeight} कैरेट</td>
                <td className="px-5 py-3 text-stone-600">{row.returnedWeight ? `${row.returnedWeight} कैरेट` : "—"}</td>
                <td className="px-5 py-3 text-stone-600">{row.wages ? `₹${row.wages}` : "—"}</td>
                <td className="px-5 py-3 text-stone-600">{row.status}</td>
                <td className="px-5 py-3 flex gap-2">
                  {row.status === "लंबित" && (
                    <button onClick={() => { setSelected(row); setReturnShow(true); }} className="text-amber-500 hover:text-amber-700 text-xs font-semibold">वापस लें</button>
                  )}
                  <button onClick={() => del(row.id)} className="text-red-400 hover:text-red-600 text-xs font-semibold">हटाएं</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}