import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

// ─── Color palette & style tokens ────────────────────────────────────────────
const C = {
  bg:        "#0B0F0D",
  surface:   "#121A15",
  card:      "#182018",
  border:    "#1E2E22",
  green:     "#22C55E",
  greenDim:  "#16a34a",
  gold:      "#D4AF37",
  goldDim:   "#B8960A",
  teal:      "#0EA5E9",
  text:      "#E8F5EC",
  muted:     "#6B8F72",
  red:       "#EF4444",
  orange:    "#F97316",
};

// ─── Mock data ────────────────────────────────────────────────────────────────
const pedestrianData = [
  { time: "06:00", flow: 120 }, { time: "07:00", flow: 340 },
  { time: "08:00", flow: 680 }, { time: "09:00", flow: 520 },
  { time: "10:00", flow: 450 }, { time: "11:00", flow: 390 },
  { time: "12:00", flow: 280 }, { time: "13:00", flow: 310 },
  { time: "14:00", flow: 260 }, { time: "15:00", flow: 420 },
  { time: "16:00", flow: 590 }, { time: "17:00", flow: 780 },
  { time: "18:00", flow: 920 }, { time: "19:00", flow: 860 },
  { time: "20:00", flow: 640 },
];

const zones = [
  { id: "A1", label: "North Promenade", status: "occupied", shade: true, folded: false },
  { id: "A2", label: "Rose Garden Bench", status: "available", shade: true, folded: false },
  { id: "B1", label: "Heritage Pavilion", status: "folded",    shade: false, folded: true },
  { id: "B2", label: "Fountain Plaza",    status: "occupied", shade: false, folded: false },
  { id: "C1", label: "Sport Strip East",  status: "available", shade: true, folded: false },
  { id: "C2", label: "Palm Alley West",   status: "available", shade: false, folded: false },
];

const gems = [
  { id: 1, name: "Ottoman Archway", type: "Heritage", dist: "0.3 km", rating: 4.8, emoji: "🏛️" },
  { id: 2, name: "Desert Bloom Wall", type: "Art",     dist: "0.6 km", rating: 4.6, emoji: "🌸" },
  { id: 3, name: "Stargazing Deck",   type: "Nature",  dist: "1.1 km", rating: 4.9, emoji: "🌌" },
  { id: 4, name: "Spice Market Echo", type: "Culture", dist: "0.8 km", rating: 4.5, emoji: "🫙" },
];

const paths = [
  { id: 1, name: "Scenic Heritage Path", km: 3.2, duration: "40 min", difficulty: "Easy",  stops: 6 },
  { id: 2, name: "Urban Wellness Loop",  km: 5.8, duration: "65 min", difficulty: "Medium", stops: 9 },
  { id: 3, name: "Night Lights Trail",   km: 2.4, duration: "30 min", difficulty: "Easy",   stops: 4 },
];

// ─── AI Insights mock ─────────────────────────────────────────────────────────
const aiInsights = [
  "🌿 Peak pedestrian flow at 18:00–19:00 suggests deploying 40% more activated seating in Zone C during evening hours.",
  "☁️ AQI exceeds 60 in afternoon windows — recommend dynamic shade deployment and misting activation between 13:00–16:00.",
  "📍 Heritage Path shows 2.3× engagement vs. standard routes. Expand storytelling nodes at Ottoman Archway and Spice Market Echo.",
  "🌡️ Temperature gradient between zones A and C exceeds 4°C. IoT-controlled microclimate adjustments can reduce heat stress by 31%.",
  "🚶 Pedestrian dwell time near art installations averages 4.7 min vs. 1.2 min in open corridors — prioritize cultural anchor points in expansion.",
];

// ─── Helper components ────────────────────────────────────────────────────────
function Badge({ label, color }) {
  const map = {
    occupied:  { bg: "#3f1010", text: C.red,    dot: C.red },
    available: { bg: "#0a2d16", text: C.green,  dot: C.green },
    folded:    { bg: "#1a1a0a", text: C.gold,   dot: C.gold },
  };
  const s = map[label] || { bg: "#1a1a1a", text: "#aaa", dot: "#aaa" };
  return (
    <span style={{
      background: s.bg, color: s.text,
      border: `1px solid ${s.dot}33`,
      borderRadius: 20, padding: "2px 10px", fontSize: 11, fontWeight: 700,
      display: "inline-flex", alignItems: "center", gap: 5, letterSpacing: "0.05em"
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.dot, display: "inline-block" }} />
      {label.toUpperCase()}
    </span>
  );
}

function Card({ children, style = {} }) {
  return (
    <div style={{
      background: C.card,
      border: `1px solid ${C.border}`,
      borderRadius: 16,
      padding: "18px 20px",
      ...style
    }}>
      {children}
    </div>
  );
}

function SectionTitle({ children, accent = C.green }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
      <div style={{ width: 3, height: 18, background: accent, borderRadius: 4 }} />
      <h3 style={{ margin: 0, color: C.text, fontSize: 15, fontWeight: 700, letterSpacing: "0.03em", fontFamily: "'Playfair Display', serif" }}>
        {children}
      </h3>
    </div>
  );
}

// ─── Tab: Citizen Dashboard ───────────────────────────────────────────────────
function CitizenDash() {
  const [steps, setSteps] = useState(7842);
  const [points, setPoints] = useState(312);
  const [claimed, setClaimed] = useState(false);
  const [celebrating, setCelebrating] = useState(false);
  const goal = 10000;
  const pct = Math.min((steps / goal) * 100, 100);

  useEffect(() => {
    const t = setInterval(() => {
      setSteps(s => {
        const n = s + Math.floor(Math.random() * 12 + 3);
        return n > goal ? goal : n;
      });
      setPoints(p => p + 1);
    }, 1500);
    return () => clearInterval(t);
  }, []);

  const handleClaim = () => {
    if (steps >= goal && !claimed) {
      setClaimed(true);
      setCelebrating(true);
      setTimeout(() => setCelebrating(false), 3000);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      {/* Hero step card */}
      <Card style={{ marginBottom: 14, position: "relative", overflow: "hidden" }}>
        <div style={{
          position: "absolute", top: -40, right: -40, width: 180, height: 180,
          borderRadius: "50%", background: `radial-gradient(circle, ${C.green}18, transparent 70%)`
        }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <p style={{ margin: "0 0 4px", color: C.muted, fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase" }}>Today's Steps</p>
            <motion.h1
              key={steps}
              initial={{ scale: 1.04 }}
              animate={{ scale: 1 }}
              style={{ margin: 0, fontSize: 48, fontWeight: 900, color: C.green, fontFamily: "'Playfair Display', serif", lineHeight: 1 }}
            >
              {steps.toLocaleString()}
            </motion.h1>
            <p style={{ margin: "4px 0 0", color: C.muted, fontSize: 13 }}>Goal: {goal.toLocaleString()} steps</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 32 }}>🏃</div>
            <div style={{ color: C.gold, fontWeight: 800, fontSize: 18 }}>{points} pts</div>
            <div style={{ color: C.muted, fontSize: 11 }}>points</div>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ marginTop: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ color: C.muted, fontSize: 12 }}>Progress</span>
            <span style={{ color: C.green, fontWeight: 700, fontSize: 12 }}>{pct.toFixed(1)}%</span>
          </div>
          <div style={{ height: 10, background: C.border, borderRadius: 10, overflow: "hidden" }}>
            <motion.div
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              style={{
                height: "100%",
                background: `linear-gradient(90deg, ${C.green}, ${C.gold})`,
                borderRadius: 10,
                boxShadow: `0 0 12px ${C.green}88`
              }}
            />
          </div>
        </div>
      </Card>

      {/* Reward */}
      <Card style={{ marginBottom: 14 }}>
        <SectionTitle accent={C.gold}>🎁 Available Reward</SectionTitle>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <div>
            <div style={{ fontSize: 28 }}>☕</div>
            <div style={{ color: C.text, fontWeight: 700, fontSize: 15, marginTop: 4 }}>Free Arabic Coffee</div>
            <div style={{ color: C.muted, fontSize: 12 }}>Unlock at 10,000 steps</div>
          </div>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={handleClaim}
            style={{
              background: steps >= goal && !claimed
                ? `linear-gradient(135deg, ${C.gold}, ${C.goldDim})`
                : C.border,
              color: steps >= goal && !claimed ? "#000" : C.muted,
              border: "none", borderRadius: 12, padding: "10px 20px",
              fontWeight: 800, fontSize: 13, cursor: steps >= goal && !claimed ? "pointer" : "default",
              letterSpacing: "0.05em"
            }}
          >
            {claimed ? "✓ CLAIMED" : "CLAIM"}
          </motion.button>
        </div>
        <AnimatePresence>
          {celebrating && (
            <motion.div
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              style={{ marginTop: 12, background: "#0a2d16", border: `1px solid ${C.green}44`, borderRadius: 10, padding: "10px 14px", color: C.green, fontSize: 13, fontWeight: 600 }}
            >
              🎉 Reward claimed! Show this at any Boulevard café.
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      {/* Daily stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
        {[
          { label: "Calories", val: Math.round(steps * 0.04), unit: "kcal", icon: "🔥" },
          { label: "Distance", val: (steps * 0.0007).toFixed(1), unit: "km", icon: "📍" },
          { label: "Active min", val: Math.round(steps / 110), unit: "min", icon: "⏱" },
        ].map(s => (
          <Card key={s.label} style={{ textAlign: "center", padding: "14px 10px" }}>
            <div style={{ fontSize: 22 }}>{s.icon}</div>
            <div style={{ color: C.text, fontWeight: 800, fontSize: 18, marginTop: 4 }}>{s.val}</div>
            <div style={{ color: C.muted, fontSize: 11 }}>{s.unit}</div>
            <div style={{ color: C.muted, fontSize: 10, marginTop: 2 }}>{s.label}</div>
          </Card>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Tab: Smart Seats ────────────────────────────────────────────────────────
function SmartSeats() {
  const [seatStates, setSeatStates] = useState(zones);

  const toggle = (id, field) => {
    setSeatStates(prev => prev.map(z => z.id === id ? { ...z, [field]: !z[field] } : z));
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <Card style={{ marginBottom: 14 }}>
        <SectionTitle>IoT Zone Overview</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
          {["occupied", "available", "folded"].map(s => (
            <div key={s} style={{ background: C.surface, borderRadius: 10, padding: "10px 0", textAlign: "center" }}>
              <div style={{
                fontWeight: 800, fontSize: 22,
                color: s === "occupied" ? C.red : s === "available" ? C.green : C.gold
              }}>
                {seatStates.filter(z => z.status === s).length}
              </div>
              <div style={{ color: C.muted, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.07em" }}>{s}</div>
            </div>
          ))}
        </div>
      </Card>

      {seatStates.map((zone, i) => (
        <motion.div
          key={zone.id}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.07 }}
        >
          <Card style={{ marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <div>
                <div style={{ color: C.muted, fontSize: 11, letterSpacing: "0.08em" }}>ZONE {zone.id}</div>
                <div style={{ color: C.text, fontWeight: 700, fontSize: 14 }}>{zone.label}</div>
              </div>
              <Badge label={zone.status} />
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {[
                { field: "shade", icon: "☂️", label: "Shade" },
                { field: "folded", icon: "📐", label: "Fold" },
              ].map(ctrl => (
                <button
                  key={ctrl.field}
                  onClick={() => toggle(zone.id, ctrl.field)}
                  style={{
                    flex: 1, background: zone[ctrl.field] ? `${C.green}22` : C.surface,
                    border: `1px solid ${zone[ctrl.field] ? C.green : C.border}`,
                    borderRadius: 8, padding: "7px 0", color: zone[ctrl.field] ? C.green : C.muted,
                    fontSize: 12, fontWeight: 700, cursor: "pointer", transition: "all 0.2s",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 5
                  }}
                >
                  {ctrl.icon} {ctrl.label}: {zone[ctrl.field] ? "ON" : "OFF"}
                </button>
              ))}
            </div>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}

// ─── Tab: Urban Explorer ──────────────────────────────────────────────────────
function UrbanExplorer() {
  const [activeGem, setActiveGem] = useState(null);

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      {/* Stylized map placeholder */}
      <Card style={{ marginBottom: 14, padding: 0, overflow: "hidden" }}>
        <div style={{
          height: 180,
          background: `
            radial-gradient(ellipse at 30% 50%, ${C.green}15 0%, transparent 50%),
            radial-gradient(ellipse at 70% 30%, ${C.teal}12 0%, transparent 50%),
            linear-gradient(160deg, #0d1f12 0%, #0a1510 100%)
          `,
          display: "flex", alignItems: "center", justifyContent: "center",
          position: "relative", padding: 16
        }}>
          {/* Fake path line */}
          <svg width="100%" height="100%" style={{ position: "absolute", top: 0, left: 0 }}>
            <path d="M 40 140 Q 120 60 240 100 T 380 70" stroke={C.green} strokeWidth="2" fill="none" strokeDasharray="6 4" opacity="0.6" />
            <path d="M 20 100 Q 100 160 200 130 T 380 150" stroke={C.gold} strokeWidth="1.5" fill="none" strokeDasharray="4 6" opacity="0.4" />
          </svg>
          {gems.map((g, i) => (
            <motion.div
              key={g.id}
              whileHover={{ scale: 1.3 }}
              onClick={() => setActiveGem(activeGem?.id === g.id ? null : g)}
              style={{
                position: "absolute",
                left: `${[15, 35, 60, 75][i]}%`,
                top: `${[60, 30, 55, 25][i]}%`,
                cursor: "pointer",
                background: C.green,
                borderRadius: "50%", width: 28, height: 28,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 14, boxShadow: `0 0 12px ${C.green}88`,
                border: `2px solid ${C.card}`
              }}
            >
              {g.emoji}
            </motion.div>
          ))}
          <div style={{ color: C.muted, fontSize: 12, letterSpacing: "0.1em", userSelect: "none" }}>
            RIYADH SPORTS BOULEVARD
          </div>
        </div>
        <AnimatePresence>
          {activeGem && (
            <motion.div
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
              style={{ padding: "14px 20px", borderTop: `1px solid ${C.border}` }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 20 }}>{activeGem.emoji} <span style={{ color: C.text, fontWeight: 700 }}>{activeGem.name}</span></div>
                  <div style={{ color: C.muted, fontSize: 12 }}>{activeGem.type} · {activeGem.dist}</div>
                </div>
                <div style={{ color: C.gold, fontWeight: 800 }}>★ {activeGem.rating}</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      {/* Walking paths */}
      <SectionTitle>🗺️ Themed Walking Paths</SectionTitle>
      {paths.map((p, i) => (
        <motion.div key={p.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}>
          <Card style={{ marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ color: C.text, fontWeight: 700, fontSize: 14 }}>{p.name}</div>
                <div style={{ color: C.muted, fontSize: 12, marginTop: 3 }}>
                  {p.km} km · {p.duration} · {p.stops} stops
                </div>
              </div>
              <span style={{
                background: p.difficulty === "Easy" ? "#0a2d16" : "#2d1a0a",
                color: p.difficulty === "Easy" ? C.green : C.orange,
                border: `1px solid ${p.difficulty === "Easy" ? C.green : C.orange}44`,
                borderRadius: 20, padding: "3px 10px", fontSize: 11, fontWeight: 700
              }}>
                {p.difficulty}
              </span>
            </div>
            <div style={{ marginTop: 10, height: 4, background: C.border, borderRadius: 4, overflow: "hidden" }}>
              <div style={{
                height: "100%", width: `${(p.km / 6) * 100}%`,
                background: `linear-gradient(90deg, ${C.teal}, ${C.green})`, borderRadius: 4
              }} />
            </div>
          </Card>
        </motion.div>
      ))}

      {/* Hidden gems list */}
      <SectionTitle>💎 Hidden Gems</SectionTitle>
      {gems.map((g, i) => (
        <motion.div key={g.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.07 }}>
          <Card style={{ marginBottom: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ fontSize: 28 }}>{g.emoji}</div>
              <div>
                <div style={{ color: C.text, fontWeight: 700 }}>{g.name}</div>
                <div style={{ color: C.muted, fontSize: 12 }}>{g.type} · {g.dist}</div>
              </div>
            </div>
            <div style={{ color: C.gold, fontWeight: 800 }}>★ {g.rating}</div>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}

// ─── Tab: Environment ────────────────────────────────────────────────────────
function Environment() {
  const [temp, setTemp] = useState(32.4);
  const [aqi, setAqi] = useState(58);
  const [humidity, setHumidity] = useState(24);
  const [wind, setWind] = useState(12);

  useEffect(() => {
    const t = setInterval(() => {
      setTemp(v => parseFloat((v + (Math.random() - 0.5) * 0.2).toFixed(1)));
      setAqi(v => Math.max(20, Math.min(120, v + Math.floor((Math.random() - 0.5) * 3))));
      setHumidity(v => Math.max(10, Math.min(60, v + Math.floor((Math.random() - 0.5) * 2))));
      setWind(v => Math.max(0, Math.min(30, v + Math.floor((Math.random() - 0.5) * 2))));
    }, 2000);
    return () => clearInterval(t);
  }, []);

  const aqiColor = aqi < 50 ? C.green : aqi < 100 ? C.orange : C.red;
  const aqiLabel = aqi < 50 ? "Good" : aqi < 100 ? "Moderate" : "Unhealthy";

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      {/* Main sensors */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
        {/* Temperature */}
        <Card style={{ textAlign: "center" }}>
          <div style={{ fontSize: 32 }}>🌡️</div>
          <motion.div
            key={temp}
            initial={{ scale: 1.05 }} animate={{ scale: 1 }}
            style={{ color: temp > 38 ? C.red : temp > 32 ? C.orange : C.green, fontWeight: 900, fontSize: 36, fontFamily: "'Playfair Display', serif" }}
          >
            {temp}°
          </motion.div>
          <div style={{ color: C.muted, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em" }}>Temperature (C)</div>
          <div style={{ marginTop: 8, height: 4, background: C.border, borderRadius: 4, overflow: "hidden" }}>
            <div style={{
              height: "100%", width: `${((temp - 15) / 30) * 100}%`,
              background: `linear-gradient(90deg, ${C.teal}, ${C.orange}, ${C.red})`,
              transition: "width 0.8s ease"
            }} />
          </div>
        </Card>

        {/* AQI */}
        <Card style={{ textAlign: "center" }}>
          <div style={{ fontSize: 32 }}>💨</div>
          <motion.div
            key={aqi}
            initial={{ scale: 1.05 }} animate={{ scale: 1 }}
            style={{ color: aqiColor, fontWeight: 900, fontSize: 36, fontFamily: "'Playfair Display', serif" }}
          >
            {aqi}
          </motion.div>
          <div style={{ color: C.muted, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em" }}>AQI</div>
          <div style={{ marginTop: 4, color: aqiColor, fontSize: 12, fontWeight: 700 }}>{aqiLabel}</div>
        </Card>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
        <Card style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ fontSize: 28 }}>💧</div>
          <div>
            <div style={{ color: C.teal, fontWeight: 800, fontSize: 22 }}>{humidity}%</div>
            <div style={{ color: C.muted, fontSize: 11 }}>Humidity</div>
          </div>
        </Card>
        <Card style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ fontSize: 28 }}>🌬️</div>
          <div>
            <div style={{ color: C.text, fontWeight: 800, fontSize: 22 }}>{wind} km/h</div>
            <div style={{ color: C.muted, fontSize: 11 }}>Wind Speed</div>
          </div>
        </Card>
      </div>

      {/* Responsive environment status */}
      <Card>
        <SectionTitle accent={C.teal}>Responsive Environment Status</SectionTitle>
        {[
          { label: "Misting System", active: temp > 32, icon: "🌫️" },
          { label: "Smart Shading", active: aqi > 50 || temp > 35, icon: "⛅" },
          { label: "Cooling Fans",  active: temp > 36, icon: "🌀" },
          { label: "Air Purifiers", active: aqi > 70, icon: "🏭" },
        ].map(s => (
          <div key={s.label} style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "10px 0", borderBottom: `1px solid ${C.border}`
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 18 }}>{s.icon}</span>
              <span style={{ color: C.text, fontSize: 14 }}>{s.label}</span>
            </div>
            <div style={{
              background: s.active ? `${C.green}22` : `${C.border}`,
              color: s.active ? C.green : C.muted,
              border: `1px solid ${s.active ? C.green + "44" : C.border}`,
              borderRadius: 20, padding: "3px 12px", fontSize: 11, fontWeight: 700
            }}>
              {s.active ? "● ACTIVE" : "○ STANDBY"}
            </div>
          </div>
        ))}
      </Card>
    </motion.div>
  );
}

// ─── Tab: AI Planner ─────────────────────────────────────────────────────────
function AIPlanner() {
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState(aiInsights.slice(0, 3));
  const [typed, setTyped] = useState("");
  const [aiResponse, setAiResponse] = useState(null);

  const generate = async () => {
    if (!typed.trim()) return;
    setLoading(true);
    setAiResponse(null);
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: `You are an expert urban design AI assistant for the HumanizeCity platform at Riyadh Sports Boulevard, Saudi Arabia. 
You analyze pedestrian flow data, environmental sensors (temperature, AQI), and IoT seat usage to provide strategic recommendations for humanizing Saudi cities. 
Current data: Peak pedestrian flow at 18:00-19:00 (920 users), avg temp 32.4°C, AQI 58 (Moderate), 2 occupied zones out of 6.
Respond with 2-3 concise, actionable urban design recommendations. Use emojis. Be specific with percentages or metrics.`,
          messages: [{ role: "user", content: typed }]
        })
      });
      const data = await response.json();
      const text = data.content?.map(b => b.text || "").join("\n") || "No response generated.";
      setAiResponse(text);
    } catch (e) {
      setAiResponse("⚠️ Unable to reach AI service. Here's a cached insight:\n\n" + aiInsights[Math.floor(Math.random() * aiInsights.length)]);
    }
    setLoading(false);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      {/* Pedestrian flow chart */}
      <Card style={{ marginBottom: 14 }}>
        <SectionTitle accent={C.teal}>📊 Pedestrian Flow Analysis</SectionTitle>
        <ResponsiveContainer width="100%" height={160}>
          <AreaChart data={pedestrianData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="flowGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={C.green} stopOpacity={0.35} />
                <stop offset="95%" stopColor={C.green} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke={C.border} strokeDasharray="3 3" />
            <XAxis dataKey="time" tick={{ fill: C.muted, fontSize: 10 }} />
            <YAxis tick={{ fill: C.muted, fontSize: 10 }} />
            <Tooltip contentStyle={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, color: C.text }} />
            <Area type="monotone" dataKey="flow" stroke={C.green} strokeWidth={2} fill="url(#flowGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      {/* AI Query Input */}
      <Card style={{ marginBottom: 14 }}>
        <SectionTitle accent={C.gold}>🤖 Gemini Urban AI Planner</SectionTitle>
        <textarea
          value={typed}
          onChange={e => setTyped(e.target.value)}
          placeholder="Ask about pedestrian strategies, heat mitigation, cultural activation..."
          rows={3}
          style={{
            width: "100%", background: C.surface, border: `1px solid ${C.border}`,
            borderRadius: 10, padding: "10px 14px", color: C.text, fontSize: 13,
            resize: "none", outline: "none", fontFamily: "inherit", boxSizing: "border-box",
            lineHeight: 1.6
          }}
        />
        <motion.button
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
          onClick={generate}
          disabled={loading}
          style={{
            marginTop: 10, width: "100%",
            background: loading ? C.border : `linear-gradient(135deg, ${C.green}, ${C.teal})`,
            color: loading ? C.muted : "#000",
            border: "none", borderRadius: 10, padding: "12px",
            fontWeight: 800, fontSize: 14, cursor: loading ? "default" : "pointer",
            letterSpacing: "0.05em"
          }}
        >
          {loading ? "⟳ Analyzing boulevard data..." : "✦ Generate AI Insights"}
        </motion.button>

        <AnimatePresence>
          {aiResponse && (
            <motion.div
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              style={{
                marginTop: 14, background: C.surface,
                border: `1px solid ${C.green}33`,
                borderRadius: 12, padding: "14px 16px",
                color: C.text, fontSize: 13, lineHeight: 1.8,
                whiteSpace: "pre-wrap"
              }}
            >
              <div style={{ color: C.green, fontWeight: 700, fontSize: 11, letterSpacing: "0.1em", marginBottom: 8 }}>AI STRATEGIC ANALYSIS</div>
              {aiResponse}
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      {/* Static insights */}
      <Card>
        <SectionTitle>📌 Latest Insights</SectionTitle>
        {insights.map((ins, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
            style={{
              padding: "10px 12px", marginBottom: 8,
              background: C.surface, borderRadius: 10,
              borderLeft: `3px solid ${[C.green, C.gold, C.teal][i % 3]}`,
              color: C.text, fontSize: 13, lineHeight: 1.6
            }}
          >
            {ins}
          </motion.div>
        ))}
      </Card>
    </motion.div>
  );
}

// ─── Main App ────────────────────────────────────────────────────────────────
const TABS = [
  { id: "citizen",  label: "Me",        icon: "🏃" },
  { id: "seats",    label: "Seats",     icon: "🪑" },
  { id: "explorer", label: "Explore",   icon: "🗺️" },
  { id: "env",      label: "Climate",   icon: "🌡️" },
  { id: "ai",       label: "AI Plan",   icon: "🤖" },
];

export default function App() {
  const [tab, setTab] = useState("citizen");

  const content = {
    citizen:  <CitizenDash />,
    seats:    <SmartSeats />,
    explorer: <UrbanExplorer />,
    env:      <Environment />,
    ai:       <AIPlanner />,
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: C.bg,
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      color: C.text,
      maxWidth: 440,
      margin: "0 auto",
      display: "flex",
      flexDirection: "column",
    }}>
      {/* Header */}
      <div style={{
        background: C.surface,
        borderBottom: `1px solid ${C.border}`,
        padding: "16px 20px 12px",
        position: "sticky", top: 0, zIndex: 100
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 22, fontWeight: 900,
              background: `linear-gradient(135deg, ${C.green}, ${C.gold})`,
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
            }}>
              HumanizeCity
            </div>
            <div style={{ color: C.muted, fontSize: 11, letterSpacing: "0.12em", marginTop: 1 }}>
              RIYADH SPORTS BOULEVARD
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.green, boxShadow: `0 0 8px ${C.green}` }} />
              <span style={{ color: C.green, fontSize: 11, fontWeight: 700 }}>LIVE</span>
            </div>
            <div style={{ color: C.muted, fontSize: 10 }}>
              {new Date().toLocaleTimeString("en-SA", { hour: "2-digit", minute: "2-digit" })}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: "16px 16px 100px", overflowY: "auto" }}>
        <AnimatePresence mode="wait">
          <motion.div key={tab}>
            {content[tab]}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Nav */}
      <div style={{
        position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
        width: "100%", maxWidth: 440,
        background: C.surface,
        borderTop: `1px solid ${C.border}`,
        display: "flex",
        padding: "8px 0 12px",
        zIndex: 100
      }}>
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              flex: 1, background: "none", border: "none", cursor: "pointer",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
              padding: "4px 0"
            }}
          >
            <motion.div
              animate={{ scale: tab === t.id ? 1.15 : 1 }}
              style={{ fontSize: 20 }}
            >
              {t.icon}
            </motion.div>
            <span style={{
              fontSize: 10, fontWeight: tab === t.id ? 700 : 400,
              color: tab === t.id ? C.green : C.muted,
              letterSpacing: "0.05em", transition: "color 0.2s"
            }}>
              {t.label}
            </span>
            {tab === t.id && (
              <motion.div
                layoutId="activeTab"
                style={{ width: 20, height: 2, background: C.green, borderRadius: 2 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;700;800&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #1E2E22; border-radius: 4px; }
        textarea::placeholder { color: #6B8F72; }
      `}</style>
    </div>
  );
}
