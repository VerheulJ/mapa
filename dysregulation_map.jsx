import { useState, useRef, useEffect, useCallback } from "react";

const SECTIONS = {
  glutGABA: {
    id: "glutGABA",
    label: "Glutamato & GABA",
    icon: "⚡",
    color: "#e05c2a",
    x: 420, y: 160,
    description: "Eje central de la disrupción neuro­biológica inducida por alcohol. En machos: redireccionamiento metabólico del glutamato; en hembras: potenciación postsináptica activa.",
    males: ["↑ GLS, GAD1/2 → ↑ síntesis GABA", "↑ ALDH5A1 → degradación GABA", "↑ VGLUT2 → intento de mantener excitación", "↓ HOMER3, PRKCD → compromiso postsináptico", "↓ KCNJ6, PLCL1, PRKCB → colapso feedback GABA-B"],
    females: ["↑ GRIN1, GRIN2A → potenciación NMDA", "↑ DLGAP1 → anclaje postsináptico", "↑ ITPKA, ITPR1/3 → señalización Ca²⁺", "↑ GABRA5, GABRB1 → inhibición tónica", "↓ KCNJ3, NTRK2 → reducción canal K⁺ y BDNF"],
    alcoholLink: "El alcohol actúa como potenciador de GABA e inhibidor de NMDA. La desregulación observada es una adaptación compensatoria crónica para contrarrestar esta perturbación: el sistema intenta restaurar el equilibrio excitación/inhibición."
  },
  calcium: {
    id: "calcium",
    label: "Señalización Ca²⁺",
    icon: "🔬",
    color: "#2a7de0",
    x: 720, y: 100,
    description: "Ajustes sex-específicos en canales de calcio y señalización intracelular con consecuencias en plasticidad y función mitocondrial.",
    males: ["↓ CACNA2D3, CACNA1A, CACNA2D1 → reducción influx Ca²⁺", "↑ HPCAL1 → señalización Ca²⁺-dependiente", "↓ PPP2R5B → regulación fosfatasa Ca²⁺-responsiva"],
    females: ["↑ MICU1 → captación mitocondrial Ca²⁺", "↑ FKBP1A, PPP2R5B → señalización fosfatasa", "↓ HPCAL4 → alteración sensor Ca²⁺"],
    alcoholLink: "El alcohol altera directamente los canales de Ca²⁺ voltaje-dependientes y la homeostasis intracelular de calcio. Las adaptaciones proteómicas reflejan intentos de compensar la sobrecarga o déficit de Ca²⁺ inducido por alcohol en distintos compartimentos."
  },
  vesicles: {
    id: "vesicles",
    label: "Tráfico Vesicular",
    icon: "🔄",
    color: "#7c3aed",
    x: 720, y: 320,
    description: "Alteraciones en exocitosis, reciclaje y endocitosis sináptica. En machos: potenciación de maquinaria exocitótica; en hembras: remodelación del perfil endocítico.",
    males: ["↑ SYT1, CPLX2 → exocitosis Ca²⁺-disparada", "↑ DNM1L, SLC17A6, SLC6A11 → reciclaje sináptico", "↑ CLTA, RABEP1, SH3GL1 → endocitosis clatrina", "↓ ATP6AP2, ATP6V0A1 → posible fallo acidificación vesicular"],
    females: ["↑ DNM1, RIMS1 → escisión y zona activa", "↑ ATP6V1C1 → acidificación compensatoria", "↑ ACTR2, IST1, SNX3, RAB31 → reciclaje endosomal", "↓ ARF6, ARPC1B, ASAP1, EPN1, KIF5A → transporte axonal reducido"],
    alcoholLink: "El alcohol interfiere con la liberación y reciclaje de neurotransmisores. Las alteraciones en SYT1 y maquinaria de exocitosis reflejan intentos de mantener la neurotransmisión alterada por la perturbación aguda-crónica del alcohol en terminales sinápticas."
  },
  cytoskeleton: {
    id: "cytoskeleton",
    label: "Remodelación Citoesquelética",
    icon: "🏗️",
    color: "#0f9d58",
    x: 180, y: 320,
    description: "Ambos sexos muestran modificaciones citoesqueléticas, pero por estrategias mecánicamente distintas que reflejan distintos programas de remodelación sináptica.",
    males: ["↑ TMOD2, TAGLN, TMSB4X → estabilización actina", "↓ GSN (gelsolina) → reducción severing Ca²⁺-dependiente", "↑ TUBB5 → reorganización compensatoria microtúbulos", "↑ SEPTIN7 → rigidez cuellos dendríticos", "Tau: hipofosforilación (MAPT, MARK1, TSC2)"],
    females: ["↑ TMOD2, ACTR2 → estabilización extremos actina", "↓ ARPC1B → filamentos lineales vs. ramificados", "↓ TUBA4A → posible mecanismo neuroprotector (↓ agregación tau)", "Tau: tendencia a hiperfosforilación"],
    alcoholLink: "El alcohol altera la morfología de espinas dendríticas y la plasticidad sináptica. La remodelación del citoesqueleto observada —especialmente en actina y tau— refleja adaptaciones estructurales crónicas, con la divergencia en tau siendo potencialmente relevante para el riesgo diferencial de demencia asociada a alcohol."
  },
  mitochondria: {
    id: "mitochondria",
    label: "Metabolismo Mitocondrial",
    icon: "⚙️",
    color: "#e0a020",
    x: 180, y: 160,
    description: "Alteraciones metabólicas más extensas en machos. Incluye glicólisis, ciclo TCA, metabolismo lipídico y cetogénesis con implicaciones para homeostasis energética neuronal.",
    males: ["↑ HK1, GPI → entrada glucosa glicólisis", "↓ PFKL → cuello de botella glicólisis", "↑ IDH3A, MDH2 → ciclo TCA activado", "↑ ECH1, HMGCS2 → β-oxidación y cetogénesis", "↑ FDPS → ruta mevalonato/colesterol/prenilación"],
    females: ["↓ PGAM1 → bloqueo selectivo glicólisis", "↓ PDHB → reducción entrada TCA", "↑ ACACA → lipogénesis de novo", "↑ HMGCS2, HMGCL; ↓ ECH1, BDH1 → cetogénesis alternativa", "Acumulación acetoacetato → posible modulación GPR43-BDNF"],
    alcoholLink: "El alcohol es metabolizado principalmente en el hígado, pero sus metabolitos (acetaldehído, acetato) y el desequilibrio NADH/NAD⁺ que genera afectan directamente el metabolismo energético cerebral. Las adaptaciones observadas representan respuestas al estrés metabólico crónico inducido por alcohol."
  },
  oxphos: {
    id: "oxphos",
    label: "Fosforilación Oxidativa",
    icon: "⚡",
    color: "#e0204a",
    x: 420, y: 460,
    description: "7 subunidades nucleares desreguladas a lo largo de ambos sexos. Remodelación más extensa en hembras. Refleja consecuencias aguas abajo de alteraciones en señalización Ca²⁺ y sináptica.",
    males: ["↑ NDUFS4, NDUFS6, NDUFA5 → estabilización complejo I", "↓ COX4I1, COX5A, MT-CO2 → eficiencia catalítica complejo IV", "↑ ATP5IF1 (168%) → inhibición hidrólisis reversa ATP", "↑ ATP5PF, ATP5PD, ATP5F1C → refuerzo estructural ATP sintasa"],
    females: ["↑ NDUFS2, NDUFV3; ↓ NDUFV2, NDUFA11 → restructuración complejo I", "↑ UQCRC1, UQCRQ → modulación complejo III", "↑ ATP5F1D, ATP5F1E → modulación eficiencia catalítica ATP sintasa"],
    alcoholLink: "El alcohol induce disfunción mitocondrial directamente a través de estrés oxidativo y alteración de la cadena respiratoria. Las adaptaciones en subunidades de complejos I–V reflejan respuestas compensatorias a la perturbación crónica de la bioenergética mitocondrial neuronal."
  },
  ribosomes: {
    id: "ribosomes",
    label: "Proteínas Ribosomales",
    icon: "🧬",
    color: "#20b2aa",
    x: 180, y: 460,
    description: "Alteraciones en maquinaria traduccional más pronunciadas en hembras, posiblemente reflejando mayor demanda de síntesis proteica para la extensa remodelación sináptica.",
    males: ["↑ RPLP2 → elongación traduccional", "RPL29, RPS21, RPS12 → expresión moderada"],
    females: ["↑ RPS5, RPS18, RPS25, RPS26 → iniciación traducción (40S)", "↑ RPL2, RPL14, RPL15 → síntesis polipéptidos (60S)", "Activación generalizada: RPL27, RPL34, RPL6, RPS12, etc."],
    alcoholLink: "El alcohol altera la síntesis proteica cerebral. El aumento en proteínas ribosomales —especialmente en hembras— puede reflejar un aumento compensatorio de la capacidad de síntesis proteica para soportar la extensa remodelación de receptores, andamiajes y proteínas citoesqueléticas necesaria para adaptarse a la exposición crónica."
  }
};

const CONNECTIONS = [
  { from: "glutGABA", to: "calcium", label: "Señalización NMDA-Ca²⁺", color: "#9b59b6" },
  { from: "calcium", to: "vesicles", label: "Exocitosis Ca²⁺-dependiente", color: "#3498db" },
  { from: "calcium", to: "cytoskeleton", label: "GSN Ca²⁺-dependiente", color: "#27ae60" },
  { from: "glutGABA", to: "mitochondria", label: "Desviación metabólica glutamato", color: "#e67e22" },
  { from: "mitochondria", to: "oxphos", label: "Flujo sustratos TCA → OXPHOS", color: "#c0392b" },
  { from: "vesicles", to: "oxphos", label: "Demanda energética vesicular", color: "#8e44ad" },
  { from: "cytoskeleton", to: "vesicles", label: "Actina → invaginación endocítica", color: "#16a085" },
  { from: "oxphos", to: "ribosomes", label: "ATP para síntesis proteica", color: "#d35400" },
  { from: "ribosomes", to: "cytoskeleton", label: "Proteínas estructurales", color: "#1abc9c" },
  { from: "glutGABA", to: "vesicles", label: "Reciclaje neurotransmisores", color: "#e74c3c" },
  { from: "mitochondria", to: "cytoskeleton", label: "Tau fosfofosforilación/energía", color: "#2ecc71" },
];

const NODE_R = 56;

function getNodeCenter(node) {
  return { x: node.x, y: node.y };
}

function getEdgePts(fromNode, toNode) {
  const fx = fromNode.x, fy = fromNode.y;
  const tx = toNode.x, ty = toNode.y;
  const dx = tx - fx, dy = ty - fy;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const ux = dx / dist, uy = dy / dist;
  return {
    x1: fx + ux * NODE_R,
    y1: fy + uy * NODE_R,
    x2: tx - ux * NODE_R,
    y2: ty - uy * NODE_R,
    mx: (fx + tx) / 2,
    my: (fy + ty) / 2,
  };
}

export default function DysregulationMap() {
  const [selected, setSelected] = useState(null);
  const [hovered, setHovered] = useState(null);
  const [tab, setTab] = useState("males");
  const [showAlcohol, setShowAlcohol] = useState(false);
  const svgRef = useRef(null);

  const node = selected ? SECTIONS[selected] : null;

  const activeConnections = selected
    ? CONNECTIONS.filter(c => c.from === selected || c.to === selected)
    : hovered
    ? CONNECTIONS.filter(c => c.from === hovered || c.to === hovered)
    : [];

  const connectedIds = new Set(activeConnections.flatMap(c => [c.from, c.to]));

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0a12",
      fontFamily: "'Crimson Text', Georgia, serif",
      color: "#e8e4d8",
      display: "flex",
      flexDirection: "column",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Crimson+Text:ital,wght@0,400;0,600;1,400&family=JetBrains+Mono:wght@400;700&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #0a0a12; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 3px; }
        .node-circle {
          cursor: pointer;
          transition: filter 0.2s, transform 0.2s;
          transform-origin: center;
          transform-box: fill-box;
        }
        .node-circle:hover { filter: brightness(1.3); }
        .tab-btn {
          padding: 6px 18px;
          border: 1px solid #333;
          background: transparent;
          color: #aaa;
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.08em;
          cursor: pointer;
          transition: all 0.2s;
          border-radius: 2px;
        }
        .tab-btn.active {
          background: #1a1a2e;
          color: #e8e4d8;
          border-color: #555;
        }
        .tab-btn:hover { border-color: #888; color: #e8e4d8; }
        .alcohol-btn {
          padding: 7px 16px;
          border: 1px solid #e05c2a55;
          background: transparent;
          color: #e05c2a;
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.1em;
          cursor: pointer;
          transition: all 0.25s;
          border-radius: 2px;
          text-transform: uppercase;
        }
        .alcohol-btn.active {
          background: #e05c2a22;
          border-color: #e05c2a;
        }
        .alcohol-btn:hover { background: #e05c2a15; }
        .detail-item {
          padding: 4px 0 4px 12px;
          border-left: 2px solid;
          font-size: 13px;
          line-height: 1.5;
          margin: 3px 0;
          opacity: 0.88;
        }
        .legend-dot {
          width: 10px; height: 10px;
          border-radius: 50%;
          flex-shrink: 0;
          margin-top: 4px;
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }
        .alcohol-glow { animation: pulse 2.5s ease-in-out infinite; }
      `}</style>

      {/* Header */}
      <div style={{
        borderBottom: "1px solid #1e1e2e",
        padding: "20px 32px 16px",
        display: "flex",
        alignItems: "baseline",
        gap: 16,
      }}>
        <span style={{ fontSize: 11, letterSpacing: "0.25em", color: "#666", fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase" }}>Mapa Interactivo</span>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 600, letterSpacing: "0.02em", color: "#e8e4d8" }}>
          Desregulación Proteómica por Alcohol
        </h1>
        <span style={{ fontSize: 11, color: "#555", fontFamily: "'JetBrains Mono', monospace", marginLeft: "auto" }}>
          Hipocampo · Dimorfismo Sexual
        </span>
      </div>

      <div style={{ display: "flex", flex: 1, minHeight: 0 }}>

        {/* SVG Map */}
        <div style={{ flex: "0 0 auto", position: "relative", padding: "24px 0 24px 24px" }}>
          <svg
            ref={svgRef}
            width={900} height={600}
            viewBox="0 0 900 600"
            style={{ display: "block" }}
          >
            <defs>
              {Object.values(SECTIONS).map(s => (
                <radialGradient key={s.id} id={`grad-${s.id}`} cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor={s.color} stopOpacity="0.35" />
                  <stop offset="100%" stopColor={s.color} stopOpacity="0.08" />
                </radialGradient>
              ))}
              <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                <path d="M0,0 L0,6 L8,3 z" fill="#555" />
              </marker>
              {CONNECTIONS.map((c, i) => (
                <marker key={i} id={`arrow-${i}`} markerWidth="7" markerHeight="7" refX="5" refY="2.5" orient="auto">
                  <path d="M0,0 L0,5 L7,2.5 z" fill={c.color} />
                </marker>
              ))}
            </defs>

            {/* Background connections (all, dimmed) */}
            {CONNECTIONS.map((c, i) => {
              const from = SECTIONS[c.from], to = SECTIONS[c.to];
              const pts = getEdgePts(from, to);
              const isActive = activeConnections.includes(c);
              return (
                <g key={i} opacity={activeConnections.length > 0 && !isActive ? 0.07 : 0.35}>
                  <line
                    x1={pts.x1} y1={pts.y1} x2={pts.x2} y2={pts.y2}
                    stroke={c.color}
                    strokeWidth={isActive ? 2.5 : 1.2}
                    strokeDasharray={isActive ? "none" : "5,4"}
                    markerEnd={`url(#arrow-${i})`}
                    opacity={isActive ? 1 : 0.6}
                  />
                  {isActive && (
                    <text
                      x={pts.mx} y={pts.my - 7}
                      textAnchor="middle"
                      fontSize="10"
                      fill={c.color}
                      fontFamily="'JetBrains Mono', monospace"
                      opacity="0.9"
                    >
                      {c.label}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Nodes */}
            {Object.values(SECTIONS).map(s => {
              const isSelected = selected === s.id;
              const isHovered = hovered === s.id;
              const isConnected = connectedIds.has(s.id);
              const dimmed = (selected || hovered) && !isSelected && !isConnected;
              return (
                <g
                  key={s.id}
                  className="node-circle"
                  opacity={dimmed ? 0.3 : 1}
                  onClick={() => setSelected(selected === s.id ? null : s.id)}
                  onMouseEnter={() => setHovered(s.id)}
                  onMouseLeave={() => setHovered(null)}
                >
                  {/* Glow ring when selected */}
                  {(isSelected || isHovered) && (
                    <circle
                      cx={s.x} cy={s.y} r={NODE_R + 10}
                      fill="none"
                      stroke={s.color}
                      strokeWidth="1.5"
                      opacity="0.5"
                    />
                  )}
                  {/* Background gradient circle */}
                  <circle cx={s.x} cy={s.y} r={NODE_R} fill={`url(#grad-${s.id})`} />
                  {/* Stroke ring */}
                  <circle
                    cx={s.x} cy={s.y} r={NODE_R}
                    fill="none"
                    stroke={s.color}
                    strokeWidth={isSelected ? 2.5 : 1.5}
                    opacity={isSelected ? 1 : 0.7}
                  />
                  {/* Icon */}
                  <text x={s.x} y={s.y - 10} textAnchor="middle" fontSize="22" dominantBaseline="middle">
                    {s.icon}
                  </text>
                  {/* Label */}
                  <text
                    x={s.x} y={s.y + 16}
                    textAnchor="middle"
                    fontSize="11"
                    fill={s.color}
                    fontFamily="'JetBrains Mono', monospace"
                    fontWeight="700"
                    letterSpacing="0.04em"
                  >
                    {s.label.split(" ").map((word, wi) => (
                      <tspan key={wi} x={s.x} dy={wi === 0 ? 0 : 13}>{word}</tspan>
                    ))}
                  </text>
                </g>
              );
            })}

            {/* Center alcohol label */}
            <g>
              <circle cx={450} cy={310} r={38} fill="#e05c2a10" stroke="#e05c2a" strokeWidth="1" strokeDasharray="4,3" opacity="0.6" className="alcohol-glow" />
              <text x={450} y={303} textAnchor="middle" fontSize="18" fill="#e05c2a" opacity="0.8">🍺</text>
              <text x={450} y={321} textAnchor="middle" fontSize="9" fill="#e05c2a" fontFamily="'JetBrains Mono', monospace" letterSpacing="0.1em" opacity="0.8">ALCOHOL</text>
            </g>
          </svg>
        </div>

        {/* Detail panel */}
        <div style={{
          flex: 1,
          borderLeft: "1px solid #1e1e2e",
          padding: "28px 28px 20px",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 0,
        }}>
          {!node ? (
            <div style={{ opacity: 0.5, marginTop: 60 }}>
              <p style={{ fontStyle: "italic", fontSize: 15, color: "#999", lineHeight: 1.7 }}>
                Haz clic sobre cualquier nodo del mapa para explorar los cambios proteómicos por sexo y su relación con la exposición al alcohol.
              </p>
              <div style={{ marginTop: 32 }}>
                <p style={{ fontSize: 12, color: "#666", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.08em", marginBottom: 14, textTransform: "uppercase" }}>Vías del mapa</p>
                {Object.values(SECTIONS).map(s => (
                  <div
                    key={s.id}
                    style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 10, cursor: "pointer" }}
                    onClick={() => setSelected(s.id)}
                  >
                    <div className="legend-dot" style={{ background: s.color, marginTop: 4 }} />
                    <div>
                      <span style={{ fontSize: 14, color: s.color, fontWeight: 600 }}>{s.label}</span>
                      <p style={{ margin: "2px 0 0", fontSize: 12, color: "#777", lineHeight: 1.5 }}>{s.description.slice(0, 80)}…</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div>
              {/* Node header */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                <span style={{ fontSize: 30 }}>{node.icon}</span>
                <div>
                  <h2 style={{ margin: 0, fontSize: 20, color: node.color, fontWeight: 600 }}>{node.label}</h2>
                  <p style={{ margin: "4px 0 0", fontSize: 13, color: "#999", lineHeight: 1.5 }}>{node.description}</p>
                </div>
              </div>

              {/* Tabs: Machos / Hembras */}
              <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
                <button className={`tab-btn ${tab === "males" ? "active" : ""}`} onClick={() => setTab("males")}>♂ Machos</button>
                <button className={`tab-btn ${tab === "females" ? "active" : ""}`} onClick={() => setTab("females")}>♀ Hembras</button>
                <button
                  className={`alcohol-btn ${showAlcohol ? "active" : ""}`}
                  onClick={() => setShowAlcohol(!showAlcohol)}
                  style={{ marginLeft: "auto" }}
                >
                  🍺 Link con Alcohol
                </button>
              </div>

              {/* Dysregulation list */}
              <div style={{ marginBottom: 16 }}>
                {(tab === "males" ? node.males : node.females).map((item, i) => (
                  <div
                    key={i}
                    className="detail-item"
                    style={{ borderLeftColor: node.color, fontFamily: "'JetBrains Mono', monospace", fontSize: 12, lineHeight: 1.6 }}
                  >
                    {item}
                  </div>
                ))}
              </div>

              {/* Alcohol link */}
              {showAlcohol && (
                <div style={{
                  background: "#e05c2a0d",
                  border: "1px solid #e05c2a44",
                  borderRadius: 4,
                  padding: "14px 16px",
                  marginBottom: 16,
                }}>
                  <p style={{ margin: "0 0 6px", fontSize: 11, color: "#e05c2a", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                    🍺 Asociación con Alcohol
                  </p>
                  <p style={{ margin: 0, fontSize: 13, color: "#d4c9b8", lineHeight: 1.7 }}>{node.alcoholLink}</p>
                </div>
              )}

              {/* Connected pathways */}
              <div>
                <p style={{ margin: "0 0 8px", fontSize: 11, color: "#666", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.1em", textTransform: "uppercase" }}>Vías conectadas</p>
                {CONNECTIONS.filter(c => c.from === node.id || c.to === node.id).map((c, i) => {
                  const otherId = c.from === node.id ? c.to : c.from;
                  const other = SECTIONS[otherId];
                  const dir = c.from === node.id ? "→" : "←";
                  return (
                    <div
                      key={i}
                      style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 7, cursor: "pointer" }}
                      onClick={() => setSelected(otherId)}
                    >
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: c.color, flexShrink: 0 }} />
                      <span style={{ fontSize: 12, color: c.color, fontFamily: "'JetBrains Mono', monospace" }}>{dir}</span>
                      <span style={{ fontSize: 13, color: other.color, fontWeight: 600 }}>{other.label}</span>
                      <span style={{ fontSize: 11, color: "#666" }}>· {c.label}</span>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={() => setSelected(null)}
                style={{ marginTop: 20, background: "transparent", border: "1px solid #333", color: "#666", padding: "6px 14px", cursor: "pointer", fontFamily: "'JetBrains Mono', monospace", fontSize: 11, borderRadius: 2, letterSpacing: "0.08em" }}
              >
                ← Volver al mapa
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div style={{ borderTop: "1px solid #1e1e2e", padding: "10px 32px", display: "flex", gap: 24, alignItems: "center" }}>
        <span style={{ fontSize: 10, color: "#444", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.08em" }}>
          LÍNEAS SÓLIDAS → conexión activa · LÍNEAS PUNTEADAS → resto de conexiones
        </span>
        <span style={{ fontSize: 10, color: "#444", fontFamily: "'JetBrains Mono', monospace", marginLeft: "auto" }}>
          {Object.keys(SECTIONS).length} nodos · {CONNECTIONS.length} conexiones
        </span>
      </div>
    </div>
  );
}
