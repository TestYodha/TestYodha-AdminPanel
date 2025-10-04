import React, { useEffect, useMemo, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  orderBy,
  where,
} from "firebase/firestore";
import "./UploadMaterials.css"; // reuse form styles

const emptyForm = {
  code: "",
  title: "",
  description: "",
  type: "percent",     // 'percent' | 'flat'
  value: "",
  maxDiscount: "",
  minAmount: "",
  courseId: "",
  planId: "",
  expiresAt: "",       // datetime-local string
  active: true,
  // Limits:
  perUserLimit: "",    // 1 => one-time/user; 0/blank => unlimited
  maxUses: "",         // 0/blank => unlimited (global)
  originalPriceNote: "",
};

const toDateOrNull = (v) => (v ? new Date(v) : null);

// Timestamp/Date -> <input type="datetime-local">
const toInputDateTime = (ts) => {
  try {
    const d = ts?.toDate ? ts.toDate() : ts instanceof Date ? ts : null;
    if (!d) return "";
    const pad = (n) => (n < 10 ? `0${n}` : `${n}`);
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  } catch {
    return "";
  }
};

export default function ManageCoupons() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [courses, setCourses] = useState([]);
  const [plans, setPlans] = useState([]);

  const [list, setList] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");

  const pageWrapStyle = {
    padding: "140px 20px 24px",
    maxWidth: 960,
    margin: "0 auto",
    marginTop: "250px",
  };

  const loadAll = async () => {
    setLoading(true);
    try {
      const cSnap = await getDocs(collection(db, "courses"));
      setCourses(cSnap.docs.map((d) => ({ id: d.id, ...d.data() })));

      const pSnap = await getDocs(collection(db, "plans"));
      setPlans(pSnap.docs.map((d) => ({ id: d.id, ...d.data() })));

      const qSnap = await getDocs(
        query(collection(db, "coupons"), orderBy("createdAt", "desc"))
      );
      setList(qSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (e) {
      console.error("Load error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadAll(); }, []);

  const courseNameMap = useMemo(() => {
    const map = {};
    courses.forEach((c) => (map[c.id] = c.title || c.id));
    return map;
  }, [courses]);

  const planNameMap = useMemo(() => {
    const map = {};
    plans.forEach((p) => (map[p.id] = p.name || p.id));
    return map;
  }, [plans]);

  const resetForm = () => {
    setForm(emptyForm);
    setEditId(null);
    setError("");
  };

  const isNonNegInt = (v) => {
    if (v === "" || v === null || v === undefined) return true;
    const n = Number(v);
    return Number.isInteger(n) && n >= 0;
  };

  const validate = () => {
    if (!form.code.trim()) return "Coupon code is required";
    if (!["percent", "flat"].includes(form.type)) return "Type must be percent or flat";
    const val = Number(form.value);
    if (!val || val <= 0) return "Discount value must be > 0";
    if (form.type === "percent" && val > 95) return "Percent should be ≤ 95";
    if (form.expiresAt) {
      const ex = new Date(form.expiresAt).getTime();
      if (Number.isFinite(ex) && ex < Date.now()) return "Expiry must be in the future";
    }
    if (!isNonNegInt(form.perUserLimit)) return "Per-user limit must be a non-negative integer";
    if (!isNonNegInt(form.maxUses)) return "Max uses must be a non-negative integer";
    return "";
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const msg = validate();
    if (msg) { setError(msg); return; }

    setSaving(true);
    setError("");

    try {
      const codeUpper = form.code.trim().toUpperCase();

      // uniqueness check (code)
      const dupQ = query(collection(db, "coupons"), where("code", "==", codeUpper));
      const dupSnap = await getDocs(dupQ);
      const dupFound = dupSnap.docs.find(d => d.id !== editId);
      if (dupFound) {
        setSaving(false);
        return setError("Coupon code already exists.");
      }

      const payloadBase = {
        code: codeUpper,
        title: form.title.trim(),
        description: form.description.trim(),
        type: form.type,
        value: Number(form.value),
        maxDiscount: form.maxDiscount ? Number(form.maxDiscount) : null,
        minAmount: form.minAmount ? Number(form.minAmount) : 0,
        courseId: form.courseId || null,
        planId: form.planId || null,
        active: !!form.active,
        perUserLimit: form.perUserLimit === "" ? null : Number(form.perUserLimit), // null/0 => unlimited time
        maxUses: form.maxUses === "" ? null : Number(form.maxUses),               // null/0 => unlimited
      };

      if (form.expiresAt) {
        const d = toDateOrNull(form.expiresAt);
        payloadBase.expiresAt = d || null;
      } else {
        payloadBase.expiresAt = null;
      }

      if (editId) {
        await updateDoc(doc(db, "coupons", editId), payloadBase); // keep 'used' & 'createdAt'
      } else {
        await addDoc(collection(db, "coupons"), {
          ...payloadBase,
          used: 0,
          createdAt: serverTimestamp(),
        });
      }

      await loadAll();
      resetForm();
    } catch (e) {
      console.error("Save error:", e);
      setError("Failed to save coupon.");
    } finally {
      setSaving(false);
    }
  };

  const onEdit = (c) => {
    setEditId(c.id);
    setForm({
      code: c.code || "",
      title: c.title || "",
      description: c.description || "",
      type: c.type || "percent",
      value: c.value ?? "",
      maxDiscount: c.maxDiscount ?? "",
      minAmount: c.minAmount ?? "",
      courseId: c.courseId || "",
      planId: c.planId || "",
      expiresAt: toInputDateTime(c.expiresAt),
      active: !!c.active,
      perUserLimit: c.perUserLimit == null ? "" : c.perUserLimit,
      maxUses: c.maxUses == null ? "" : c.maxUses,
      originalPriceNote: "",
    });
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleActive = async (c) => {
    try {
      await updateDoc(doc(db, "coupons", c.id), { active: !c.active });
      await loadAll();
    } catch (e) {
      console.error("Toggle error:", e);
    }
  };

  const onDelete = async (c) => {
    if (!window.confirm(`Delete coupon ${c.code}?`)) return;
    try {
      await deleteDoc(doc(db, "coupons", c.id));
      await loadAll();
    } catch (e) {
      console.error("Delete error:", e);
    }
  };

  const filteredPlans = useMemo(() => {
    if (!form.courseId) return plans;
    return plans.filter((p) => p.courseId === form.courseId);
  }, [plans, form.courseId]);

  return (
    <div style={pageWrapStyle}>
      <h2>Manage Coupons</h2>

      <form className="material-form" onSubmit={onSubmit} style={{ marginTop: 12 }}>
        {error ? <div style={{ color: "#b91c1c", fontWeight: 700 }}>{error}</div> : null}

        <label>Coupon Code *</label>
        <input
          type="text"
          value={form.code}
          onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))}
          placeholder="e.g. WELCOME50"
          required
        />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <label>Type *</label>
            <select value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}>
              <option value="percent">Percent (%)</option>
              <option value="flat">Flat (₹)</option>
            </select>
          </div>
          <div>
            <label>Value *</label>
            <input
              type="number"
              inputMode="numeric"
              min="1"
              value={form.value}
              onChange={(e) => setForm((f) => ({ ...f, value: e.target.value }))}
              placeholder={form.type === "percent" ? "e.g. 20 (20%)" : "e.g. 100 (₹100 off)"}
              required
            />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <label>Max Discount (optional, for %)</label>
            <input
              type="number"
              inputMode="numeric"
              min="0"
              value={form.maxDiscount}
              onChange={(e) => setForm((f) => ({ ...f, maxDiscount: e.target.value }))}
              placeholder="e.g. 200"
            />
          </div>
          <div>
            <label>Min Order Amount (optional)</label>
            <input
              type="number"
              inputMode="numeric"
              min="0"
              value={form.minAmount}
              onChange={(e) => setForm((f) => ({ ...f, minAmount: e.target.value }))}
              placeholder="e.g. 299"
            />
          </div>
        </div>

        {/* Limits */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <label>Per-user Limit (0/blank = unlimited)</label>
            <input
              type="number"
              inputMode="numeric"
              min="0"
              value={form.perUserLimit}
              onChange={(e) => setForm((f) => ({ ...f, perUserLimit: e.target.value }))}
              placeholder="e.g. 1 for one-time per user"
            />
          </div>
          <div>
            <label>Global Max Uses (0/blank = unlimited)</label>
            <input
              type="number"
              inputMode="numeric"
              min="0"
              value={form.maxUses}
              onChange={(e) => setForm((f) => ({ ...f, maxUses: e.target.value }))}
              placeholder="Total uses overall"
            />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <label>Course (optional)</label>
            <select
              value={form.courseId}
              onChange={(e) => setForm((f) => ({ ...f, courseId: e.target.value, planId: "" }))}
            >
              <option value="">All Courses</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>
          </div>
          <div>
            <label>Plan (optional)</label>
            <select
              value={form.planId}
              onChange={(e) => setForm((f) => ({ ...f, planId: e.target.value }))}
            >
              <option value="">All Plans</option>
              {filteredPlans.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.durationInMonths} mo)
                </option>
              ))}
            </select>
          </div>
        </div>

        <label>Expiry (optional)</label>
        <input
          type="datetime-local"
          value={form.expiresAt}
          onChange={(e) => setForm((f) => ({ ...f, expiresAt: e.target.value }))}
        />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <label>Title (optional)</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="Display title"
            />
          </div>
          <div>
            <label>Status</label>
            <select
              value={form.active ? "1" : "0"}
              onChange={(e) => setForm((f) => ({ ...f, active: e.target.value === "1" }))}
            >
              <option value="1">Active</option>
              <option value="0">Inactive</option>
            </select>
          </div>
        </div>

        <label>Description (optional)</label>
        <textarea
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          placeholder="Short description"
        />

        <div style={{ display: "flex", gap: 12 }}>
          <button type="submit" disabled={saving}>
            {saving ? "Saving..." : editId ? "Update Coupon" : "Create Coupon"}
          </button>
          {editId ? (
            <button type="button" onClick={resetForm} style={{ background: "#6b7280" }}>
              Cancel Edit
            </button>
          ) : null}
        </div>
      </form>

      <hr style={{ margin: "24px 0" }} />

      <h3>All Coupons</h3>
      {loading ? (
        <p>Loading...</p>
      ) : list.length === 0 ? (
        <p>No coupons found.</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f3f4f6" }}>
                <th style={th}>Code</th>
                <th style={th}>Type</th>
                <th style={th}>Value</th>
                <th style={th}>Max Disc</th>
                <th style={th}>Min Amt</th>
                <th style={th}>Per-user</th>
                <th style={th}>Used</th>
                <th style={th}>Max Uses</th>
                <th style={th}>Course</th>
                <th style={th}>Plan</th>
                <th style={th}>Expiry</th>
                <th style={th}>Active</th>
                <th style={th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map((c) => (
                <tr key={c.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                  <td style={td}><b>{c.code}</b></td>
                  <td style={td}>{c.type}</td>
                  <td style={td}>{c.type === "percent" ? `${c.value}%` : `₹${c.value}`}</td>
                  <td style={td}>{c.maxDiscount ? `₹${c.maxDiscount}` : "-"}</td>
                  <td style={td}>{c.minAmount ? `₹${c.minAmount}` : "-"}</td>
                  <td style={td}>{Number.isFinite(c.perUserLimit) ? c.perUserLimit : "∞"}</td>
                  <td style={td}>{Number.isFinite(c.used) ? c.used : 0}</td>
                  <td style={td}>{Number.isFinite(c.maxUses) && c.maxUses !== 0 ? c.maxUses : "∞"}</td>
                  <td style={td}>{c.courseId ? (courseNameMap[c.courseId] || c.courseId) : "-"}</td>
                  <td style={td}>{c.planId ? (planNameMap[c.planId] || c.planId) : "-"}</td>
                  <td style={td}>{c.expiresAt ? (c.expiresAt.toDate ? c.expiresAt.toDate().toLocaleString() : "") : "-"}</td>
                  <td style={td}>{c.active ? "Yes" : "No"}</td>
                  <td style={td}>
                    <button onClick={() => onEdit(c)} style={{ marginRight: 6 }}>Edit</button>
                    <button onClick={() => toggleActive(c)} style={{ marginRight: 6, background: c.active ? "#f59e0b" : "#10b981" }}>
                      {c.active ? "Deactivate" : "Activate"}
                    </button>
                    <button onClick={() => onDelete(c)} style={{ background: "#ef4444" }}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const th = { textAlign: "left", padding: "10px", fontWeight: 800, fontSize: 13, color: "#111827" };
const td = { textAlign: "left", padding: "10px", fontSize: 13, color: "#111827" };
