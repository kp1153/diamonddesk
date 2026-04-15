"use client";
import { useEffect, useState } from "react";

export default function Sales() {
  const [rows, setRows] = useState([]);
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ invoiceNo: "", buyer: "", date: "", weight: "", amount: "", status: "लंबित" });

  const load = () => fetch("/api/sales").then(r => {
    if (r.status === 401) { window.location.href = "/"; return null; }
    return r.json();
  }).then(data => { if (data && Array.isArray(data)) setRows(data); });

  useEffect(() => { load(); }, []);

  const submit = async () => {
    await fetch("/api/sales", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setShow(false);
    setForm({ invoiceNo: "", buyer: "", date: "", weight: "", amount: "", status: "लंबित" });
    load();
  };

  const del = async (id) => {
    if (!confirm("हटाएं?")) return;
    await fetch("/api/sales", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    load();
  };

  const printInvoice = (row) => {
    const win = window.open("", "_blank");
    win.document.write(`
      <html>
      <head>
        <title>Invoice - ${row.invoiceNo}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; max-width: 600px; margin: auto; }
          h1 { font-size: 24px; text-align: center; margin-bottom: 4px; }
          .subtitle { text-align: center; color: #666; font-size: 14px; margin-bottom: 30px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          td, th { border: 1px solid #ddd; padding: 10px; font-size: 14px; }
          th { background: #f5f5f5; font-weight: bold; }
          .total { font-size: 18px; font-weight: bold; text-align: right; margin-top: 20px; }
          .footer { margin-top: 40px; text-align: center; color: #999; font-size: 12px; }
          @media print { button { display: none; } }
        </style>
      </head>
      <body>
        <h1>हीरा डेस्क</h1>
        <div class="subtitle">Diamond Invoice</div>
        <table>
          <tr><th>बिल नंबर</th><td>${row.invoiceNo}</td></tr>
          <tr><th>पार्टी</th><td>${row.buyer}</td></tr>
          <tr><th>तारीख</th><td>${row.date}</td></tr>
          <tr><th>वजन</th><td>${row.weight} कैरेट</td></tr>
          <tr><th>राशि</th><td>₹${row.amount}</td></tr>
          <tr><th>स्थिति</th><td>${row.status}</td></tr>
        </table>
        <div class="total">कुल राशि: ₹${row.amount}</div>
        <div class="footer">हीरा डेस्क — निशांत सॉफ्टवेयर्स</div>
        <br/>
        <button onclick="window.print()">🖨️ Print</button>
      </body>
      </html>
    `);
    win.document.close();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-extrabold text-stone-900">बिक्री</h1>
        <button onClick={() => setShow(true)} className="bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold px-4 py-2 rounded-lg">+ नई बिक्री</button>
      </div>

      {show && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md space-y-4 shadow-xl">
            <h2 className="text-lg font-bold text-stone-900">नई बिक्री जोड़ें</h2>
            {[["invoiceNo","बिल नंबर"],["buyer","पार्टी का नाम"]].map(([k,l]) => (
              <input key={k} placeholder={l} value={form[k]} onChange={e => setForm({...form,[k]:e.target.value})}
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-base outline-none focus:border-amber-400" />
            ))}
            <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-base outline-none focus:border-amber-400" />
            {[["weight","वजन (कैरेट)"],["amount","राशि (₹)"]].map(([k,l]) => (
              <input key={k} placeholder={l} value={form[k]} onChange={e => setForm({...form,[k]:e.target.value})}
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-base outline-none focus:border-amber-400" />
            ))}
            <select value={form.status} onChange={e => setForm({...form, status: e.target.value})}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-base outline-none focus:border-amber-400">
              {["लंबित","भुगतान हो गया","रद्द"].map(s => <option key={s}>{s}</option>)}
            </select>
            <div className="flex gap-3 pt-2">
              <button onClick={submit} className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 rounded-lg text-base">सेव करें</button>
              <button onClick={() => setShow(false)} className="flex-1 border border-gray-200 text-stone-600 font-semibold py-3 rounded-lg text-base">रद्द करें</button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile card view */}
      <div className="md:hidden space-y-3">
        {rows.length === 0 ? (
          <p className="text-center text-stone-400 py-8">कोई बिक्री नहीं</p>
        ) : rows.map(row => (
          <div key={row.id} className="bg-white border border-gray-200 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <p className="font-extrabold text-stone-800 text-lg">{row.buyer}</p>
              <div className="flex gap-2">
                <button onClick={() => printInvoice(row)} className="text-amber-500 text-sm font-semibold">🖨️</button>
                <button onClick={() => del(row.id)} className="text-red-400 text-sm font-semibold">हटाएं</button>
              </div>
            </div>
            <p className="text-stone-500 text-sm">बिल: {row.invoiceNo} | तारीख: {row.date}</p>
            <p className="text-stone-500 text-sm">वजन: {row.weight} कैरेट | राशि: ₹{row.amount}</p>
            <span className={`inline-block text-xs font-bold px-2 py-1 rounded-full ${row.status === "भुगतान हो गया" ? "bg-green-100 text-green-600" : row.status === "रद्द" ? "bg-red-100 text-red-600" : "bg-orange-100 text-orange-600"}`}>{row.status}</span>
          </div>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {["बिल नंबर","पार्टी","तारीख","वजन","राशि","स्थिति",""].map(h => (
                <th key={h} className="px-5 py-3 text-left text-xs font-bold text-stone-500 uppercase tracking-widest">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr><td colSpan={7} className="px-5 py-8 text-center text-stone-400">कोई बिक्री नहीं</td></tr>
            ) : rows.map(row => (
              <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-5 py-3 font-semibold text-stone-700">{row.invoiceNo}</td>
                <td className="px-5 py-3 text-stone-600">{row.buyer}</td>
                <td className="px-5 py-3 text-stone-600">{row.date}</td>
                <td className="px-5 py-3 text-stone-600">{row.weight} कैरेट</td>
                <td className="px-5 py-3 text-stone-600">₹{row.amount}</td>
                <td className="px-5 py-3 text-stone-600">{row.status}</td>
                <td className="px-5 py-3 flex gap-2">
                  <button onClick={() => printInvoice(row)} className="text-amber-500 hover:text-amber-700 text-xs font-semibold">🖨️ Print</button>
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