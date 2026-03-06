"use client";
import { useState, useEffect } from "react";

export default function Settings() {
  const [company, setCompany] = useState({ name: "", address: "", gstin: "", phone: "" });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("company_profile");
    if (stored) setCompany(JSON.parse(stored));
  }, []);

  const save = () => {
    localStorage.setItem("company_profile", JSON.stringify(company));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight">Settings</h1>
      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4 max-w-lg">
        <h2 className="text-base font-bold text-stone-800">Company Profile</h2>
        {[["name","Company Name"],["address","Address"],["gstin","GSTIN"],["phone","Phone"]].map(([k,l]) => (
          <input key={k} placeholder={l} value={company[k]} onChange={e => setCompany({...company,[k]:e.target.value})}
            className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm outline-none focus:border-amber-400" />
        ))}
        <button onClick={save} className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-6 py-2 rounded-lg text-sm transition-colors">
          {saved ? "✓ Saved" : "Save"}
        </button>
      </div>
    </div>
  );
}