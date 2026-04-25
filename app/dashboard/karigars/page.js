"use client";
import { useEffect, useState } from "react";

const EMPTY_K = { name: "", phone: "", stage: "आरी", advance: "", rateAari: "", rateGhisai: "", ratePolish: "", rateJanch: "" };
const EMPTY_P = { karigarId: "", amount: "", advanceDeducted: "0", date: "", note: "" };

export default function Karigars() {
  const [rows, setRows] = useState([]);
  const [summary, setSummary] = useState([]);
  const [payments, setPayments] = useState([]);
  const [show, setShow] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [form, setForm] = useState(EMPTY_K);
  const [payShow, setPayShow] = useState(false);
  const [payForm, setPayForm] = useState(EMPTY_P);
  const [histKarigar, setHistKarigar] = useState(null); // which karigar's history is open
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("list"); // "list" | "hisab"

  const load = () =>
    fetch("/api/karigars").then(r => {
      if (r.status === 401) { window.location.href = "/"; return; }
      return r.json();
    }).then(data => { if (Array.isArray(data)) setRows(data); });

  const loadHisab = () =>
    fetch("/api/wage-payments").then(r => r.json())
      .then(data => {
        if (data?.summary) setSummary(data.summary);
        if (data?.payments) setPayments(data.payments);
      });

  useEffect(() => { load(); loadHisab(); }, []);

  const openAdd = () => { setEditRow(null); setForm(EMPTY_K); setShow(true); };
  const openEdit = (row) => {
    setEditRow(row);
    setForm({ name: row.name || "", phone: row.phone || "", stage: row.stage || "आरी", advance: row.advance ?? "", rateAari: row.rateAari ?? "", rateGhisai: row.rateGhisai ?? "", ratePolish: row.ratePolish ?? "", rateJanch: row.rateJanch ?? "" });
    setShow(true);
  };
  const close = () => { setShow(false); setEditRow(null); setForm(EMPTY_K); };

  const submit = async () => {
    if (!form.name.trim()) return;
    setLoading(true);
    const method = editRow ? "PUT" : "POST";
    const body = editRow ? { ...form, id: editRow.id } : form;
    await fetch("/api/karigars", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    setShow(false); setEditRow(null); setForm(EMPTY_K); setLoading(false);
    load(); loadHisab();
  };

  const del = async (id) => {
    if (!confirm("इस कारीगर को हटाएं?")) return;
    await fetch("/api/karigars", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    load(); loadHisab();
  };

  const openPay = (karigar) => {
    setPayForm({ ...EMPTY_P, karigarId: karigar.id, advanceDeducted: karigar.advance > 0 ? karigar.advance : "0", date: new Date().toISOString().split("T")[0] });
    setPayShow(true);
  };

  const submitPay = async () => {
    if (!payForm.amount || !payForm.date) return;
    setLoading(true);
    await fetch("/api/wage-payments", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payForm) });
    setPayShow(false); setPayForm(EMPTY_P); setLoading(false);
    loadHisab();
  };

  const delPayment = async (id) => {
    if (!confirm("यह भुगतान हटाएं?")) return;
    await fetch("/api/wage-payments", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    loadHisab();
  };

  const netColor = (v) => v > 0 ? "text-red-600" : v < 0 ? "text-green-600" : "text-stone-600";

  const Input = ({ k, l, type = "text", src = "form", setSrc }) => {
    const val = src === "form" ? form[k] : payForm[k];
    const setter = src === "form"
      ? (v) => setForm(f => ({ ...f, [k]: v }))
      : (v) => setPayForm(f => ({ ...f, [k]: v }));
    return (
      <input type={type} placeholder={l} value={val} onChange={e => setter(e.target.value)}
        className="w-full border border-gray-200 rounded-lg px-4 py-3 text-base outline-none focus:border-amber-400" />
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-extrabold text-stone-900">कारीगर</h1>
        <button onClick={openAdd} className="bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold px-4 py-2 rounded-lg">+ नया कारीगर</button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        {[["list", "सूची"], ["hisab", "हिसाब"]].map(([t, l]) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-semibold border-b-2 transition ${tab === t ? "border-amber-500 text-amber-600" : "border-transparent text-stone-400 hover:text-stone-600"}`}>
            {l}
          </button>
        ))}
      </div>

      {/* ── KARIGAR ADD/EDIT MODAL ── */}
      {show && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4 overflow-y-auto">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md space-y-4 shadow-xl my-8">
            <h2 className="text-lg font-bold text-stone-900">{editRow ? "कारीगर संपादित करें" : "नया कारीगर जोड़ें"}</h2>
            {[["name","नाम *","text"],["phone","मोबाइल नंबर","text"],["advance","अग्रिम (₹)","number"]].map(([k,l,t]) => (
              <input key={k} type={t} placeholder={l} value={form[k]} onChange={e => setForm({...form,[k]:e.target.value})}
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-base outline-none focus:border-amber-400" />
            ))}
            <select value={form.stage} onChange={e => setForm({...form, stage: e.target.value})}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-base outline-none focus:border-amber-400">
              {["आरी","घिसाई","पॉलिश","जाँच"].map(s => <option key={s}>{s}</option>)}
            </select>
            <p className="text-xs font-bold text-stone-500 uppercase tracking-widest">मजदूरी दर (₹/कैरेट)</p>
            {[["rateAari","आरी"],["rateGhisai","घिसाई"],["ratePolish","पॉलिश"],["rateJanch","जाँच"]].map(([k,l]) => (
              <input key={k} type="number" placeholder={`${l} दर`} value={form[k]} onChange={e => setForm({...form,[k]:e.target.value})}
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-base outline-none focus:border-amber-400" />
            ))}
            <div className="flex gap-3 pt-2">
              <button onClick={submit} disabled={loading}
                className="flex-1 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-semibold py-3 rounded-lg text-base">
                {loading ? "सेव हो रहा है..." : "सेव करें"}
              </button>
              <button onClick={close} className="flex-1 border border-gray-200 text-stone-600 font-semibold py-3 rounded-lg text-base">रद्द करें</button>
            </div>
          </div>
        </div>
      )}

      {/* ── PAYMENT MODAL ── */}
      {payShow && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md space-y-4 shadow-xl">
            <h2 className="text-lg font-bold text-stone-900">मजदूरी भुगतान करें</h2>
            <input type="number" placeholder="राशि (₹) *" value={payForm.amount}
              onChange={e => setPayForm(f => ({...f, amount: e.target.value}))}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-base outline-none focus:border-amber-400" />
            <input type="number" placeholder="अग्रिम काटें (₹)" value={payForm.advanceDeducted}
              onChange={e => setPayForm(f => ({...f, advanceDeducted: e.target.value}))}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-base outline-none focus:border-amber-400" />
            {payForm.amount && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-sm">
                <span className="text-stone-500">नेट भुगतान: </span>
                <span className="font-bold text-amber-700">
                  ₹{(parseFloat(payForm.amount || 0) - parseFloat(payForm.advanceDeducted || 0)).toFixed(2)}
                </span>
              </div>
            )}
            <input type="date" value={payForm.date}
              onChange={e => setPayForm(f => ({...f, date: e.target.value}))}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-base outline-none focus:border-amber-400" />
            <input type="text" placeholder="नोट (वैकल्पिक)" value={payForm.note}
              onChange={e => setPayForm(f => ({...f, note: e.target.value}))}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-base outline-none focus:border-amber-400" />
            <div className="flex gap-3 pt-2">
              <button onClick={submitPay} disabled={loading}
                className="flex-1 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-semibold py-3 rounded-lg text-base">
                {loading ? "सेव..." : "भुगतान करें"}
              </button>
              <button onClick={() => setPayShow(false)} className="flex-1 border border-gray-200 text-stone-600 font-semibold py-3 rounded-lg text-base">रद्द करें</button>
            </div>
          </div>
        </div>
      )}

      {/* ── PAYMENT HISTORY MODAL ── */}
      {histKarigar && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4 overflow-y-auto">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl my-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-stone-900">{histKarigar.name} — भुगतान इतिहास</h2>
              <button onClick={() => setHistKarigar(null)} className="text-stone-400 text-sm">✕ बंद</button>
            </div>
            {payments.filter(p => p.karigarId === histKarigar.id).length === 0 ? (
              <p className="text-stone-400 text-sm text-center py-6">कोई भुगतान नहीं</p>
            ) : payments.filter(p => p.karigarId === histKarigar.id).map(p => (
              <div key={p.id} className="border-b border-gray-100 py-3 flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold text-stone-800">₹{p.netPaid} <span className="text-xs font-normal text-stone-400">({p.date})</span></p>
                  {p.advanceDeducted > 0 && <p className="text-xs text-stone-400">अग्रिम काटा: ₹{p.advanceDeducted}</p>}
                  {p.note && <p className="text-xs text-stone-400">{p.note}</p>}
                </div>
                <button onClick={() => delPayment(p.id)} className="text-red-400 text-xs font-semibold ml-4">हटाएं</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── LIST TAB ── */}
      {tab === "list" && (
        <>
          <div className="md:hidden space-y-3">
            {rows.length === 0 ? <p className="text-center text-stone-400 py-8">कोई कारीगर नहीं</p>
              : rows.map(row => (
              <div key={row.id} className="bg-white border border-gray-200 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="font-extrabold text-stone-800 text-lg">{row.name}</p>
                  <div className="flex gap-3">
                    <button onClick={() => openEdit(row)} className="text-amber-500 text-sm font-semibold">संपादित</button>
                    <button onClick={() => del(row.id)} className="text-red-400 text-sm font-semibold">हटाएं</button>
                  </div>
                </div>
                <p className="text-stone-500 text-sm">📱 {row.phone || "—"}</p>
                <p className="text-stone-500 text-sm">काम: {row.stage} | अग्रिम: ₹{row.advance || 0}</p>
                <p className="text-stone-500 text-sm">दर: आरी ₹{row.rateAari||0} | घिसाई ₹{row.rateGhisai||0} | पॉलिश ₹{row.ratePolish||0} | जाँच ₹{row.rateJanch||0}</p>
              </div>
            ))}
          </div>
          <div className="hidden md:block bg-white border border-gray-200 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>{["नाम","मोबाइल","काम","अग्रिम","आरी","घिसाई","पॉलिश","जाँच",""].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-bold text-stone-500 uppercase tracking-widest">{h}</th>
                ))}</tr>
              </thead>
              <tbody>
                {rows.length === 0 ? <tr><td colSpan={9} className="px-5 py-8 text-center text-stone-400">कोई कारीगर नहीं</td></tr>
                  : rows.map(row => (
                  <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-5 py-3 font-semibold text-stone-700">{row.name}</td>
                    <td className="px-5 py-3 text-stone-600">{row.phone || "—"}</td>
                    <td className="px-5 py-3 text-stone-600">{row.stage}</td>
                    <td className="px-5 py-3 text-stone-600">₹{row.advance || 0}</td>
                    <td className="px-5 py-3 text-stone-600">₹{row.rateAari||0}</td>
                    <td className="px-5 py-3 text-stone-600">₹{row.rateGhisai||0}</td>
                    <td className="px-5 py-3 text-stone-600">₹{row.ratePolish||0}</td>
                    <td className="px-5 py-3 text-stone-600">₹{row.rateJanch||0}</td>
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
        </>
      )}

      {/* ── HISAB TAB ── */}
      {tab === "hisab" && (
        <div className="space-y-4">
          {summary.length === 0 ? <p className="text-center text-stone-400 py-8">कोई कारीगर नहीं</p>
            : summary.map(k => (
            <div key={k.id} className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-extrabold text-stone-800 text-lg">{k.name}</p>
                  <p className="text-stone-400 text-xs">{k.stage} | 📱 {k.phone || "—"}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setHistKarigar(k)} className="text-blue-500 text-xs font-semibold border border-blue-200 px-2 py-1 rounded-lg">इतिहास</button>
                  <button onClick={() => openPay(k)} className="bg-amber-500 text-white text-xs font-semibold px-3 py-1 rounded-lg">भुगतान करें</button>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-orange-50 border border-orange-100 rounded-lg p-3 text-center">
                  <p className="text-xs text-stone-400 mb-1">बकाया मजदूरी</p>
                  <p className="font-bold text-orange-600 text-lg">₹{k.pendingWages.toFixed(0)}</p>
                </div>
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-center">
                  <p className="text-xs text-stone-400 mb-1">अग्रिम दिया</p>
                  <p className="font-bold text-blue-600 text-lg">₹{(k.advance || 0).toFixed(0)}</p>
                </div>
                <div className={`rounded-lg p-3 text-center border ${k.netDue > 0 ? "bg-red-50 border-red-100" : k.netDue < 0 ? "bg-green-50 border-green-100" : "bg-gray-50 border-gray-100"}`}>
                  <p className="text-xs text-stone-400 mb-1">नेट देना है</p>
                  <p className={`font-bold text-lg ${netColor(k.netDue)}`}>₹{Math.abs(k.netDue).toFixed(0)}</p>
                  {k.netDue < 0 && <p className="text-xs text-green-500">अधिक भुगतान</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}