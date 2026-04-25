"use client";
import { useEffect, useState } from "react";

const EMPTY = { lotNo: "", roughWeight: "", polishWeight: "", shape: "", quality: "", color: "", status: "लंबित" };

export default function Lots() {
  const [rows, setRows] = useState([]);
  const [show, setShow] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);

  const load = () =>
    fetch("/api/lots").then(r => {
      if (r.status === 401) { window.location.href = "/"; return; }
      return r.json();
    }).then(data => { if (Array.isArray(data)) setRows(data); });

  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditRow(null); setForm(EMPTY); setShow(true); };

  const openEdit = (row) => {
    setEditRow(row);
    setForm({
      lotNo: row.lotNo || "",
      roughWeight: row.roughWeight ?? "",
      polishWeight: row.polishWeight ?? "",
      shape: row.shape || "",
      quality: row.quality || "",
      color: row.color || "",
      status: row.status || "लंबित",
    });
    setShow(true);
  };

  const submit = async () => {
    if (!form.lotNo.trim() || !form.roughWeight) return;
    setLoading(true);
    const method = editRow ? "PUT" : "POST";
    const body = editRow ? { ...form, id: editRow.id } : form;
    await fetch("/api/lots", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setShow(false);
    setEditRow(null);
    setForm(EMPTY);
    setLoading(false);
    load();
  };

  const del = async (id) => {
    if (!confirm("इस लॉट को हटाएं?")) return;
    await fetch("/api/lots", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    load();
  };

  const close = () => { setShow(false); setEditRow(null); setForm(EMPTY); };

  const statusBadge = (s) => {
    const map = { "लंबित": "bg-gray-100 text-gray-600", "काम चल रहा है": "bg-blue-100 text-blue-700", "पूर्ण": "bg-green-100 text-green-700", "बिका": "bg-purple-100 text-purple-700" };
    return map[s] || "bg-gray-100 text-gray-600";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-extrabold text-stone-900">लॉट</h1>
        <button onClick={openAdd} className="bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold px-4 py-2 rounded-lg">
          + नया लॉट
        </button>
      </div>

      {show && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4 overflow-y-auto">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md space-y-4 shadow-xl my-8">
            <h2 className="text-lg font-bold text-stone-900">
              {editRow ? "लॉट संपादित करें" : "नया लॉट जोड़ें"}
            </h2>
            {[
              ["lotNo", "लॉट नंबर *", "text"],
              ["roughWeight", "कच्चा वजन (कैरेट) *", "number"],
              ["polishWeight", "पॉलिश वजन (कैरेट)", "number"],
              ["shape", "आकार (Round/Oval/...)", "text"],
              ["quality", "गुणवत्ता (VVS1/VS1/SI1...)", "text"],
              ["color", "रंग (D/E/F/G...)", "text"],
            ].map(([k, l, t]) => (
              <input
                key={k}
                type={t}
                placeholder={l}
                value={form[k]}
                onChange={e => setForm({ ...form, [k]: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-base outline-none focus:border-amber-400"
              />
            ))}
            <select
              value={form.status}
              onChange={e => setForm({ ...form, status: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-base outline-none focus:border-amber-400"
            >
              {["लंबित", "काम चल रहा है", "पूर्ण", "बिका"].map(s => <option key={s}>{s}</option>)}
            </select>
            <div className="flex gap-3 pt-2">
              <button
                onClick={submit}
                disabled={loading}
                className="flex-1 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-semibold py-3 rounded-lg text-base"
              >
                {loading ? "सेव हो रहा है..." : "सेव करें"}
              </button>
              <button onClick={close} className="flex-1 border border-gray-200 text-stone-600 font-semibold py-3 rounded-lg text-base">
                रद्द करें
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile */}
      <div className="md:hidden space-y-3">
        {rows.length === 0 ? (
          <p className="text-center text-stone-400 py-8">कोई लॉट नहीं</p>
        ) : rows.map(row => (
          <div key={row.id} className="bg-white border border-gray-200 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <p className="font-extrabold text-stone-800 text-lg">{row.lotNo}</p>
              <div className="flex gap-3 items-center">
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusBadge(row.status)}`}>{row.status}</span>
                <button onClick={() => openEdit(row)} className="text-amber-500 text-sm font-semibold">संपादित</button>
                <button onClick={() => del(row.id)} className="text-red-400 text-sm font-semibold">हटाएं</button>
              </div>
            </div>
            <p className="text-stone-500 text-sm">कच्चा: {row.roughWeight} कैरेट</p>
            <p className="text-stone-500 text-sm">पॉलिश: {row.polishWeight ? `${row.polishWeight} कैरेट` : "—"}</p>
            <p className="text-stone-500 text-sm">
              {row.shape || "—"} | {row.quality || "—"} | {row.color || "—"}
            </p>
          </div>
        ))}
      </div>

      {/* Desktop */}
      <div className="hidden md:block bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {["लॉट नंबर", "कच्चा वजन", "पॉलिश वजन", "आकार", "गुणवत्ता", "रंग", "स्थिति", ""].map(h => (
                <th key={h} className="px-5 py-3 text-left text-xs font-bold text-stone-500 uppercase tracking-widest">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr><td colSpan={8} className="px-5 py-8 text-center text-stone-400">कोई लॉट नहीं</td></tr>
            ) : rows.map(row => (
              <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-5 py-3 font-semibold text-stone-700">{row.lotNo}</td>
                <td className="px-5 py-3 text-stone-600">{row.roughWeight} कैरेट</td>
                <td className="px-5 py-3 text-stone-600">{row.polishWeight ? `${row.polishWeight} कैरेट` : "—"}</td>
                <td className="px-5 py-3 text-stone-600">{row.shape || "—"}</td>
                <td className="px-5 py-3 text-stone-600">{row.quality || "—"}</td>
                <td className="px-5 py-3 text-stone-600">{row.color || "—"}</td>
                <td className="px-5 py-3">
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusBadge(row.status)}`}>{row.status}</span>
                </td>
                <td className="px-5 py-3">
                  <div className="flex gap-3">
                    <button onClick={() => openEdit(row)} className="text-amber-500 hover:text-amber-700 text-xs font-semibold">संपादित</button>
                    <button onClick={() => del(row.id)} className="text-red-400 hover:text-red-600 text-xs font-semibold">हटाएं</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}