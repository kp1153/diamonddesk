"use client";
import { useEffect, useState } from "react";

export default function Reports() {
  const [data, setData] = useState(null);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    const res = await fetch(`/api/reports?${params.toString()}`);
    if (res.status === 401) { window.location.href = "/"; return; }
    const json = await res.json();
    setData(json);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const exportCSV = () => {
    if (!data) return;
    const rows = [
      ["रिपोर्ट", "मूल्य"],
      ["कुल कारीगर", data.karigarCount],
      ["कुल लॉट", data.lotCount],
      ["लंबित काम", data.pendingAssignments],
      ["पूर्ण काम", data.completedAssignments],
      ["कुल मजदूरी", data.totalWages],
      ["लंबित मजदूरी", data.pendingWages],
      ["कुल बिक्री", data.totalSales],
      ["कुल बिक्री (राशि)", data.totalSalesAmount],
    ];
    const csv = rows.map(r => r.join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `kamta-report-${from || "all"}-${to || "all"}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const Card = ({ label, value, color, bg }) => (
    <div className={`border rounded-xl p-5 ${bg}`}>
      <p className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-2">{label}</p>
      <p className={`text-3xl font-extrabold ${color}`}>{value ?? "—"}</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl md:text-3xl font-extrabold text-stone-900">रिपोर्ट</h1>
        <button onClick={exportCSV} disabled={!data}
          className="bg-green-500 hover:bg-green-600 disabled:opacity-40 text-white text-sm font-semibold px-4 py-2 rounded-lg">
          ⬇ CSV Export
        </button>
      </div>

      {/* Date Filter */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-wrap gap-3 items-end">
        <div className="flex-1 min-w-[130px]">
          <p className="text-xs font-bold text-stone-400 mb-1">से</p>
          <input type="date" value={from} onChange={e => setFrom(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-400" />
        </div>
        <div className="flex-1 min-w-[130px]">
          <p className="text-xs font-bold text-stone-400 mb-1">तक</p>
          <input type="date" value={to} onChange={e => setTo(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-400" />
        </div>
        <button onClick={load} className="bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold px-5 py-2 rounded-lg">
          फ़िल्टर करें
        </button>
        {(from || to) && (
          <button onClick={() => { setFrom(""); setTo(""); setTimeout(load, 0); }}
            className="text-stone-400 text-sm font-semibold border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-50">
            साफ करें
          </button>
        )}
      </div>

      {loading ? (
        <div className="text-center py-12 text-stone-400">लोड हो रहा है...</div>
      ) : !data ? null : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card label="कुल कारीगर" value={data.karigarCount} color="text-amber-500" bg="bg-amber-50 border-amber-200" />
            <Card label="कुल लॉट" value={data.lotCount} color="text-blue-600" bg="bg-blue-50 border-blue-200" />
            <Card label="लंबित काम" value={data.pendingAssignments} color="text-orange-600" bg="bg-orange-50 border-orange-200" />
            <Card label="पूर्ण काम" value={data.completedAssignments} color="text-green-600" bg="bg-green-50 border-green-200" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Card label="कुल मजदूरी (₹)" value={`₹${data.totalWages || 0}`} color="text-purple-600" bg="bg-purple-50 border-purple-200" />
            <Card label="लंबित मजदूरी (₹)" value={`₹${data.pendingWages || 0}`} color="text-red-500" bg="bg-red-50 border-red-200" />
            <Card label="कुल बिक्री (₹)" value={`₹${data.totalSalesAmount || 0}`} color="text-green-700" bg="bg-green-50 border-green-200" />
          </div>

          {/* Lot-wise Summary */}
          {data.lotSummary && data.lotSummary.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100">
                <h2 className="text-base font-bold text-stone-800">लॉट-वार सारांश</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>{["लॉट नंबर","कच्चा वजन","पॉलिश वजन","स्थिति","कुल मजदूरी"].map(h => (
                      <th key={h} className="px-5 py-3 text-left text-xs font-bold text-stone-500 uppercase tracking-widest">{h}</th>
                    ))}</tr>
                  </thead>
                  <tbody>
                    {data.lotSummary.map(lot => (
                      <tr key={lot.id} className="border-t border-gray-100 hover:bg-gray-50">
                        <td className="px-5 py-3 font-semibold text-stone-700">{lot.lotNo}</td>
                        <td className="px-5 py-3 text-stone-600">{lot.roughWeight} कैरेट</td>
                        <td className="px-5 py-3 text-stone-600">{lot.polishWeight ? `${lot.polishWeight} कैरेट` : "—"}</td>
                        <td className="px-5 py-3 text-stone-600">{lot.status}</td>
                        <td className="px-5 py-3 text-stone-600">₹{lot.totalWages || 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}