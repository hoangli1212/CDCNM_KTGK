import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:8000";

export default function App() {
  const [records, setRecords] = useState([]);
  const [about, setAbout] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    record_date: "",
    weight: "",
    height: "",
    blood_pressure: "",
    note: "",
  });

  const fetchRecords = async () => {
    try {
      const res = await axios.get(`${API}/api/records/`);
      setRecords(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchAbout = async () => {
    try {
      const res = await axios.get(`${API}/about/`);
      setAbout(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchRecords();
    fetchAbout();
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await axios.post(`${API}/api/records/`, formData);
      setFormData({
        record_date: "",
        weight: "",
        height: "",
        blood_pressure: "",
        note: "",
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2500);
      fetchRecords();
    } catch (err) {
      setError("Không thể thêm bản ghi. Vui lòng thử lại.");
    }
  };

  const getBMI = (w, h) => {
    if (!w || !h) return null;
    const bmi = (parseFloat(w) / Math.pow(parseFloat(h) / 100, 2)).toFixed(1);
    return bmi;
  };

  const getBMILabel = (bmi) => {
    if (!bmi) return null;
    if (bmi < 18.5) return { label: "Thiếu cân", color: "#3b82f6" };
    if (bmi < 25) return { label: "Bình thường", color: "#22c55e" };
    if (bmi < 30) return { label: "Thừa cân", color: "#f59e0b" };
    return { label: "Béo phì", color: "#ef4444" };
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg: #060a14;
          --surface: #0d1526;
          --surface2: #111d35;
          --border: rgba(99,140,255,0.12);
          --accent: #4f7cff;
          --accent2: #38d9a9;
          --accent3: #f97316;
          --text: #e8eeff;
          --muted: #6b7fa8;
          --danger: #f87171;
          --success: #34d399;
          --glow: rgba(79,124,255,0.18);
        }

        body {
          font-family: 'Sora', sans-serif;
          background: var(--bg);
          color: var(--text);
          min-height: 100vh;
        }

        .wrap {
          max-width: 1280px;
          margin: 0 auto;
          padding: 32px 20px 60px;
        }

        /* ── HEADER ── */
        .header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 40px;
          padding-bottom: 24px;
          border-bottom: 1px solid var(--border);
        }
        .header-left { display: flex; align-items: center; gap: 16px; }
        .logo-ring {
          width: 52px; height: 52px; border-radius: 50%;
          background: linear-gradient(135deg, var(--accent), var(--accent2));
          display: flex; align-items: center; justify-content: center;
          font-size: 22px; box-shadow: 0 0 24px var(--glow);
        }
        .header h1 { font-size: 22px; font-weight: 700; color: var(--text); }
        .header p { font-size: 13px; color: var(--muted); margin-top: 2px; }
        .status-dot {
          display: flex; align-items: center; gap: 8px;
          font-size: 13px; color: var(--accent2);
          background: rgba(56,217,169,0.08); padding: 8px 14px;
          border-radius: 999px; border: 1px solid rgba(56,217,169,0.2);
        }
        .dot { width: 7px; height: 7px; border-radius: 50%; background: var(--accent2);
          box-shadow: 0 0 8px var(--accent2); animation: pulse 2s infinite; }
        @keyframes pulse { 0%,100% { opacity:1 } 50% { opacity:0.4 } }

        /* ── ABOUT CARD ── */
        .about-card {
          background: linear-gradient(135deg, rgba(79,124,255,0.08), rgba(56,217,169,0.05));
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 24px 28px;
          margin-bottom: 28px;
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          align-items: center;
          position: relative;
          overflow: hidden;
        }
        .about-card::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, var(--accent), var(--accent2), transparent);
        }
        .about-title {
          font-size: 11px; font-weight: 600; letter-spacing: 2px;
          text-transform: uppercase; color: var(--accent); margin-bottom: 16px; width: 100%;
          display: flex; align-items: center; gap: 8px;
        }
        .about-title::after { content: ''; flex: 1; height: 1px; background: var(--border); }
        .about-item {
          display: flex; flex-direction: column; gap: 4px;
          background: rgba(255,255,255,0.03); border: 1px solid var(--border);
          border-radius: 12px; padding: 12px 18px; flex: 1; min-width: 160px;
        }
        .about-item .key {
          font-size: 11px; color: var(--muted); letter-spacing: 0.5px; text-transform: uppercase;
        }
        .about-item .val {
          font-size: 16px; font-weight: 600; color: var(--text);
        }
        .about-item .val.mono { font-family: 'JetBrains Mono', monospace; color: var(--accent2); }

        /* ── LAYOUT ── */
        .main-grid {
          display: grid;
          grid-template-columns: 380px 1fr;
          gap: 24px;
          align-items: start;
        }

        /* ── CARD ── */
        .card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 28px;
          position: relative;
          overflow: hidden;
        }
        .card-title {
          font-size: 15px; font-weight: 600; color: var(--text);
          margin-bottom: 22px; display: flex; align-items: center; gap: 10px;
        }
        .card-icon {
          width: 34px; height: 34px; border-radius: 10px;
          background: rgba(79,124,255,0.15); display: flex; align-items: center; justify-content: center;
          font-size: 16px;
        }

        /* ── FORM ── */
        .form-group { display: flex; flex-direction: column; gap: 7px; margin-bottom: 16px; }
        label { font-size: 12px; font-weight: 600; color: var(--muted); letter-spacing: 0.5px; text-transform: uppercase; }
        input, textarea {
          background: var(--surface2); border: 1px solid var(--border);
          border-radius: 12px; padding: 11px 14px;
          color: var(--text); font-family: 'Sora', sans-serif; font-size: 14px;
          outline: none; transition: border-color 0.2s, box-shadow 0.2s; width: 100%;
        }
        input:focus, textarea:focus {
          border-color: var(--accent); box-shadow: 0 0 0 3px rgba(79,124,255,0.15);
        }
        input::placeholder { color: var(--muted); }
        input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(0.5); cursor: pointer; }

        .submit-btn {
          width: 100%; padding: 13px; border: none; border-radius: 14px; cursor: pointer;
          background: linear-gradient(135deg, var(--accent), #3b61e8);
          color: white; font-family: 'Sora', sans-serif; font-size: 14px; font-weight: 600;
          letter-spacing: 0.5px; transition: opacity 0.2s, transform 0.2s;
          box-shadow: 0 6px 20px rgba(79,124,255,0.35);
        }
        .submit-btn:hover { opacity: 0.9; transform: translateY(-1px); }
        .submit-btn:active { transform: translateY(0); }

        .alert {
          padding: 12px 14px; border-radius: 12px; font-size: 13px;
          font-weight: 500; margin-bottom: 16px; display: flex; align-items: center; gap: 8px;
        }
        .alert.err { background: rgba(248,113,113,0.1); color: var(--danger); border: 1px solid rgba(248,113,113,0.2); }
        .alert.ok  { background: rgba(52,211,153,0.1); color: var(--success); border: 1px solid rgba(52,211,153,0.2); }

        /* ── TABLE ── */
        .table-meta {
          display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px;
        }
        .count-badge {
          background: rgba(79,124,255,0.12); color: var(--accent);
          border: 1px solid rgba(79,124,255,0.2);
          padding: 5px 12px; border-radius: 999px; font-size: 12px; font-weight: 600;
        }
        .table-wrap { overflow-x: auto; border-radius: 14px; border: 1px solid var(--border); }
        table { width: 100%; border-collapse: collapse; }
        thead { background: rgba(79,124,255,0.08); }
        th {
          padding: 12px 16px; text-align: left;
          font-size: 11px; font-weight: 600; letter-spacing: 1px;
          text-transform: uppercase; color: var(--muted);
          border-bottom: 1px solid var(--border);
        }
        td {
          padding: 13px 16px; font-size: 13px; color: var(--text);
          border-bottom: 1px solid rgba(99,140,255,0.06);
        }
        tbody tr:last-child td { border-bottom: none; }
        tbody tr:hover td { background: rgba(79,124,255,0.04); }

        .id-cell {
          font-family: 'JetBrains Mono', monospace; font-size: 12px;
          color: var(--muted); background: rgba(255,255,255,0.04);
          padding: 3px 8px; border-radius: 6px; display: inline-block;
        }
        .bmi-pill {
          display: inline-block; padding: 3px 10px; border-radius: 999px;
          font-size: 11px; font-weight: 600; background: rgba(34,197,94,0.1);
        }
        .empty-row td {
          text-align: center; padding: 48px; color: var(--muted); font-size: 14px;
        }

        @media (max-width: 960px) {
          .main-grid { grid-template-columns: 1fr; }
          .header { flex-direction: column; align-items: flex-start; gap: 12px; }
        }
      `}</style>

      <div className="wrap">
        {/* HEADER */}
        <header className="header">
          <div className="header-left">
            <div className="logo-ring">🫀</div>
            <div>
              <h1>Health Tracker</h1>
              <p>Quản lý sức khỏe cá nhân</p>
            </div>
          </div>
          <div className="status-dot">
            <span className="dot" />
            API Online · localhost:8000
          </div>
        </header>

        {/* ABOUT */}
        {about && (
          <div className="about-card">
            <div className="about-title">📋 Thông tin sinh viên</div>
            <div className="about-item">
              <span className="key">Họ và tên</span>
              <span className="val">{about.studentName}</span>
            </div>
            <div className="about-item">
              <span className="key">Mã sinh viên</span>
              <span className="val mono">{about.studentId}</span>
            </div>
            <div className="about-item">
              <span className="key">Lớp</span>
              <span className="val">{about.className}</span>
            </div>
            <div className="about-item">
              <span className="key">Endpoint</span>
              <span className="val mono" style={{ fontSize: 13 }}>
                /about/ · 200 OK
              </span>
            </div>
          </div>
        )}

        {/* MAIN GRID */}
        <div className="main-grid">
          {/* FORM */}
          <div className="card">
            <div className="card-title">
              <div className="card-icon">✚</div>
              Thêm bản ghi sức khỏe
            </div>

            {error && <div className="alert err">⚠ {error}</div>}
            {success && (
              <div className="alert ok">✓ Đã thêm bản ghi thành công!</div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Ngày ghi nhận</label>
                <input
                  type="date"
                  name="record_date"
                  value={formData.record_date}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Cân nặng (kg)</label>
                <input
                  type="number"
                  step="0.01"
                  name="weight"
                  placeholder="VD: 65.5"
                  value={formData.weight}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Chiều cao (cm)</label>
                <input
                  type="number"
                  step="0.01"
                  name="height"
                  placeholder="VD: 170"
                  value={formData.height}
                  onChange={handleChange}
                  required
                />
              </div>
              {formData.weight &&
                formData.height &&
                (() => {
                  const bmi = getBMI(formData.weight, formData.height);
                  const info = getBMILabel(bmi);
                  return info ? (
                    <div
                      className="alert ok"
                      style={{ marginTop: -8, marginBottom: 16 }}
                    >
                      BMI của bạn: <strong>{bmi}</strong> — {info.label}
                    </div>
                  ) : null;
                })()}
              <div className="form-group">
                <label>Huyết áp</label>
                <input
                  type="text"
                  name="blood_pressure"
                  placeholder="VD: 120/80"
                  value={formData.blood_pressure}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Ghi chú</label>
                <textarea
                  name="note"
                  placeholder="Ghi chú thêm..."
                  rows={3}
                  value={formData.note}
                  onChange={handleChange}
                  style={{ resize: "vertical" }}
                />
              </div>
              <button type="submit" className="submit-btn">
                Thêm bản ghi →
              </button>
            </form>
          </div>

          {/* TABLE */}
          <div className="card">
            <div className="table-meta">
              <div className="card-title" style={{ marginBottom: 0 }}>
                <div className="card-icon">📊</div>
                Danh sách bản ghi
              </div>
              <span className="count-badge">{records.length} bản ghi</span>
            </div>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Ngày</th>
                    <th>Cân nặng</th>
                    <th>Chiều cao</th>
                    <th>BMI</th>
                    <th>Huyết áp</th>
                    <th>Ghi chú</th>
                  </tr>
                </thead>
                <tbody>
                  {records.length === 0 ? (
                    <tr className="empty-row">
                      <td colSpan={7}>
                        Chưa có bản ghi nào. Hãy thêm bản ghi đầu tiên!
                      </td>
                    </tr>
                  ) : (
                    records.map((r) => {
                      const bmi = getBMI(r.weight, r.height);
                      const info = getBMILabel(bmi);
                      return (
                        <tr key={r.id}>
                          <td>
                            <span className="id-cell">#{r.id}</span>
                          </td>
                          <td>{r.record_date}</td>
                          <td>{r.weight} kg</td>
                          <td>{r.height} cm</td>
                          <td>
                            {bmi && info ? (
                              <span
                                className="bmi-pill"
                                style={{
                                  color: info.color,
                                  background: `${info.color}18`,
                                }}
                              >
                                {bmi}
                              </span>
                            ) : (
                              "—"
                            )}
                          </td>
                          <td>
                            {r.blood_pressure || (
                              <span style={{ color: "var(--muted)" }}>—</span>
                            )}
                          </td>
                          <td
                            style={{
                              maxWidth: 180,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {r.note || (
                              <span style={{ color: "var(--muted)" }}>—</span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
