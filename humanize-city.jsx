 (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
diff --git a/humanize-city.jsx b/humanize-city.jsx
index 4ab3bfac182b940d395b767c0156a6c7d6c04711..e84a2e069650a4cb6f10ab991e64e752da72df66 100644
--- a/humanize-city.jsx
+++ b/humanize-city.jsx
@@ -1,26 +1,26 @@
-import { useState, useEffect, useRef } from "react";
+import { useState, useEffect } from "react";
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
@@ -527,97 +527,113 @@ function Environment() {
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
+      const apiKey = import.meta?.env?.VITE_ANTHROPIC_API_KEY;
+      if (!apiKey) throw new Error("Missing VITE_ANTHROPIC_API_KEY");
+
       const response = await fetch("https://api.anthropic.com/v1/messages", {
         method: "POST",
-        headers: { "Content-Type": "application/json" },
+        headers: {
+          "Content-Type": "application/json",
+          "x-api-key": apiKey,
+          "anthropic-version": "2023-06-01"
+        },
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
+
+      if (!response.ok) {
+        const err = await response.text();
+        throw new Error(`Anthropic API error ${response.status}: ${err}`);
+      }
+
       const data = await response.json();
       const text = data.content?.map(b => b.text || "").join("\n") || "No response generated.";
       setAiResponse(text);
     } catch (e) {
-      setAiResponse("⚠️ Unable to reach AI service. Here's a cached insight:\n\n" + aiInsights[Math.floor(Math.random() * aiInsights.length)]);
+      setAiResponse(
+        "⚠️ Live AI is unavailable (missing API key, CORS, or network). Here's a cached insight:\n\n" +
+        aiInsights[Math.floor(Math.random() * aiInsights.length)]
+      );
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
-        <SectionTitle accent={C.gold}>🤖 Gemini Urban AI Planner</SectionTitle>
+        <SectionTitle accent={C.gold}>🤖 Claude Urban AI Planner</SectionTitle>
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
 
EOF
)
