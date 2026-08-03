import { useState, useEffect } from "react";
import { Landmark } from "lucide-react";
import { adminFetch } from "../AdminLogin";

export interface BankDetails {
  bankName: string; accountName: string; accountNumber: string;
  branchCode: string; accountType: string; branchName: string; swiftCode: string;
}
const EMPTY_BANK_DETAILS: BankDetails = {
  bankName: "", accountName: "", accountNumber: "", branchCode: "", accountType: "", branchName: "", swiftCode: "",
};

// Lets an admin pick the Woman of Taste default bank details or set a
// custom override for one event (keyed by the event's stable id) — used both
// on the booking-derived EventDetail page and directly from the Events tab.
export default function BankDetailsPanel({ eventId }: { eventId: string }) {
  const [bankDefault, setBankDefault] = useState<BankDetails>(EMPTY_BANK_DETAILS);
  const [bankOverride, setBankOverride] = useState<BankDetails | null>(null);
  const [useCustomBank, setUseCustomBank] = useState(false);
  const [bankForm, setBankForm] = useState<BankDetails>(EMPTY_BANK_DETAILS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setLoading(true);
    adminFetch(`/admin/events/${encodeURIComponent(eventId)}/bank-details`).then(r => r.json()).then(d => {
      if (d.ok) {
        setBankDefault(d.default);
        setBankOverride(d.override);
        setUseCustomBank(!!d.override);
        setBankForm(d.override ?? d.default);
      }
    }).finally(() => setLoading(false));
  }, [eventId]);

  async function save() {
    setSaving(true);
    setSaved(false);
    const d = await adminFetch(`/admin/events/${encodeURIComponent(eventId)}/bank-details`, {
      method: "PUT",
      body: JSON.stringify({ bankDetails: useCustomBank ? bankForm : null }),
    }).then(r => r.json());
    setSaving(false);
    if (d.ok) {
      setBankOverride(useCustomBank ? bankForm : null);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }
  }

  if (loading) {
    return <div style={{ fontFamily: "Raleway, sans-serif", color: "#aaa", fontSize: "0.85rem" }}>Loading…</div>;
  }

  return (
    <div style={{ maxWidth: 520 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "1rem" }}>
        <Landmark size={16} style={{ color: "hsl(225,50%,35%)" }} />
        <span style={{ fontFamily: "Raleway, sans-serif", fontSize: "0.85rem", color: "#666" }}>
          Invoices and payment emails for this event use these bank details.
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: "1.25rem" }}>
        <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontFamily: "Raleway, sans-serif", fontSize: "0.85rem" }}>
          <input type="radio" checked={!useCustomBank} onChange={() => setUseCustomBank(false)} />
          Use the Woman of Taste default
        </label>
        <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontFamily: "Raleway, sans-serif", fontSize: "0.85rem" }}>
          <input type="radio" checked={useCustomBank} onChange={() => { setUseCustomBank(true); if (!bankOverride) setBankForm(f => (f.accountNumber || f.accountName ? f : { ...EMPTY_BANK_DETAILS })); }} />
          Use custom bank details for this event only
        </label>
      </div>

      {!useCustomBank && (
        <div style={{ background: "#fafafa", border: "1px solid #eee", borderRadius: 10, padding: "1rem 1.1rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem 1rem" }}>
          {([
            ["Bank", bankDefault.bankName], ["Account Name", bankDefault.accountName],
            ["Account Number", bankDefault.accountNumber], ["Branch Code", bankDefault.branchCode],
            ["Account Type", bankDefault.accountType], ["Branch", bankDefault.branchName],
            ["Swift Code", bankDefault.swiftCode],
          ] as [string, string][]).map(([label, value]) => (
            <div key={label}>
              <div style={{ fontFamily: "Raleway, sans-serif", fontSize: "0.62rem", color: "#aaa", textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</div>
              <div style={{ fontFamily: "Raleway, sans-serif", fontSize: "0.85rem", color: "#333", fontWeight: 600 }}>{value}</div>
            </div>
          ))}
        </div>
      )}

      {useCustomBank && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
          {([
            ["bankName", "Bank"], ["accountName", "Account Name"],
            ["accountNumber", "Account Number"], ["branchCode", "Branch Code"],
            ["accountType", "Account Type"], ["branchName", "Branch"],
          ] as [keyof BankDetails, string][]).map(([key, label]) => (
            <div key={key}>
              <label style={{ display: "block", fontFamily: "Raleway, sans-serif", fontSize: "0.62rem", color: "#aaa", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>{label}</label>
              <input
                value={bankForm[key]}
                onChange={e => setBankForm(f => ({ ...f, [key]: e.target.value }))}
                style={{ width: "100%", boxSizing: "border-box", padding: "0.5rem 0.7rem", border: "1px solid #ddd", borderRadius: 8, fontSize: "0.85rem", fontFamily: "Raleway, sans-serif" }}
              />
            </div>
          ))}
          <div style={{ gridColumn: "1 / -1" }}>
            <label style={{ display: "block", fontFamily: "Raleway, sans-serif", fontSize: "0.62rem", color: "#aaa", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>Swift Code</label>
            <input
              value={bankForm.swiftCode}
              onChange={e => setBankForm(f => ({ ...f, swiftCode: e.target.value }))}
              style={{ width: "100%", boxSizing: "border-box", padding: "0.5rem 0.7rem", border: "1px solid #ddd", borderRadius: 8, fontSize: "0.85rem", fontFamily: "Raleway, sans-serif" }}
            />
          </div>
        </div>
      )}

      <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: "1.25rem" }}>
        <button
          onClick={save}
          disabled={saving}
          style={{ background: "hsl(225,50%,22%)", color: "white", border: "none", borderRadius: 8, padding: "0.6rem 1.2rem", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer", fontFamily: "Raleway, sans-serif" }}
        >
          {saving ? "Saving…" : "Save"}
        </button>
        {saved && <span style={{ fontFamily: "Raleway, sans-serif", fontSize: "0.8rem", color: "#16a34a" }}>Saved</span>}
      </div>
    </div>
  );
}
