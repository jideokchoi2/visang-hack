// 걸어 다니는 아이소메트릭 학교
// - 방향키/WASD로 이동, 또는 땅을 눌러서 이동 (태블릿·크롬북용)
// - 건물 문 앞에 서면 "들어가기" 버튼이 뜨고 스페이스/엔터로 입장
// - 카메라가 캐릭터를 따라다닌다
import { useEffect, useRef, useState } from "react";

const TW = 64; // 타일 가로
const TH = 32; // 타일 세로
const iso = (x, y, z = 0) => [(x - y) * (TW / 2), (x + y) * (TH / 2) - z];
const pts = (arr) => arr.map((p) => iso(...p).join(",")).join(" ");
const toTile = (sx, sy) => {
  const a = sx / (TW / 2), b = sy / (TH / 2);
  return [(a + b) / 2, (b - a) / 2];
};

// 학교 공간 배치 (x, y 타일 좌표, w×d 크기, h 높이)
export const ROOMS = [
  { id: "library", name: "도서관", emoji: "📚", x: 1, y: 0, w: 4, d: 3, h: 70, color: "#d97706" },
  { id: "classroom", name: "3학년 2반", emoji: "🏫", x: 7, y: 0, w: 3, d: 2, h: 50, color: "#3b82f6" },
  { id: "otherclass", name: "3학년 1반", emoji: "🚪", x: 11, y: 0, w: 3, d: 2, h: 50, color: "#8b5cf6" },
  { id: "art", name: "미술실", emoji: "🎨", x: 0, y: 7, w: 3, d: 2, h: 46, color: "#db2777" },
  { id: "music", name: "음악실", emoji: "🎵", x: 4, y: 7, w: 3, d: 2, h: 46, color: "#64748b", soon: true },
  { id: "board", name: "리그 게시판", emoji: "🏆", x: 8.5, y: 7.4, w: 1.2, d: 1, h: 34, color: "#eab308" },
  { id: "shop", name: "매점", emoji: "🏪", x: 11, y: 7, w: 3, d: 2, h: 40, color: "#059669" },
];
const W = 15, D = 10; // 학교 땅 크기
const door = (r) => [r.x + r.w / 2, r.y + r.d + 0.45];
const LAMPS = [[6, 3.4], [10.5, 3.4], [3.5, 6.2], [10, 6.2], [0.3, 4.5], [14.4, 4.5]];
const TREES = [[-0.2, 3.2], [6.2, 0.4], [14.3, 3], [7.6, 9.4], [3.6, 9.5], [10.4, 9.6]];

function shade(hex, amt) {
  const n = parseInt(hex.slice(1), 16);
  const c = (v) => Math.max(0, Math.min(255, v + amt));
  return `rgb(${c(n >> 16)},${c((n >> 8) & 255)},${c(n & 255)})`;
}

function Building({ r, near, onClick }) {
  const { x, y, w, d, h, color } = r;
  const [lx, ly] = iso(x + w / 2, y + d / 2, h);
  const [dx, dy] = iso(x + w / 2, y + d);
  const wins = Math.max(2, Math.round(w * 1.2));
  return (
    <g className={`building ${r.soon ? "soon" : ""} ${near ? "near" : ""}`} onPointerDown={onClick}>
      <polygon points={pts([[x + w, y, 0], [x + w, y + d, 0], [x + w, y + d, h], [x + w, y, h]])} fill={shade(color, -60)} />
      <polygon points={pts([[x, y + d, 0], [x + w, y + d, 0], [x + w, y + d, h], [x, y + d, h]])} fill={shade(color, -30)} />
      {Array.from({ length: wins }, (_, k) => {
        const [wx, wy] = iso(x + (w * (k + 0.5)) / wins, y + d, h * 0.62);
        return <rect key={k} x={wx - 6} y={wy - 6} width={11} height={10} rx={2} className="win" />;
      })}
      {/* 문 */}
      <path d={`M${dx - 9},${dy} v-20 a9,9 0 0 1 18,0 v20 z`} fill="#3b2412" stroke="#fcd34d" strokeWidth={near ? 2.5 : 1} />
      <polygon points={pts([[x, y, h], [x + w, y, h], [x + w, y + d, h], [x, y + d, h]])} fill={shade(color, 10)} />
      <text x={lx} y={ly + 4} textAnchor="middle" fontSize="26">{r.emoji}</text>
      <g transform={`translate(${lx},${ly - 26})`}>
        <rect x={-44} y={-13} width={88} height={22} rx={11} fill="#1b1430e6" stroke={near ? "#fcd34d" : "#a78bfa"} strokeWidth="1.5" />
        <text textAnchor="middle" y={3} fontSize="12" fontFamily="Jua" fill="#fff7e6">{r.soon ? "🚧 " : ""}{r.name}</text>
      </g>
    </g>
  );
}

export default function SchoolMap({ state, go, paused }) {
  const [pos, setPos] = useState(state.mapPos || [6, 4.8]);
  const [moving, setMoving] = useState(false);
  const [sign, setSign] = useState("");
  const keys = useRef(new Set());
  const target = useRef(null); // 눌러서 이동할 목표 {x,y,room}
  const posRef = useRef(pos);
  const svgRef = useRef(null);

  // 문 앞에 서 있는 건물 찾기
  const nearRoom = ROOMS.find((r) => {
    const [ddx, ddy] = door(r);
    return Math.hypot(pos[0] - ddx, pos[1] - ddy) < 0.9;
  });

  const enter = (r) => {
    if (!r) return;
    if (r.soon) {
      setSign("🎵 음악실은 곧 열려요! 🚧");
      setTimeout(() => setSign(""), 1800);
      return;
    }
    go(r.id, posRef.current);
  };

  // 키보드
  useEffect(() => {
    if (paused) return;
    const down = (e) => {
      const k = e.key.toLowerCase();
      if (["arrowup", "arrowdown", "arrowleft", "arrowright", "w", "a", "s", "d"].includes(k)) {
        e.preventDefault();
        keys.current.add(k);
        target.current = null;
      }
      if (k === " " || k === "enter") {
        e.preventDefault();
        enter(nearRoomRef.current);
      }
    };
    const up = (e) => keys.current.delete(e.key.toLowerCase());
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      keys.current.clear();
    };
  }, [paused]);
  const nearRoomRef = useRef(null);
  nearRoomRef.current = nearRoom;

  // 이동 루프
  useEffect(() => {
    if (paused) return;
    let raf, last = performance.now();
    const blocked = (x, y) =>
      x < -0.6 || y < -0.6 || x > W - 0.4 || y > D - 0.4 ||
      ROOMS.some((r) => x > r.x - 0.2 && x < r.x + r.w + 0.2 && y > r.y - 0.2 && y < r.y + r.d + 0.2);
    const tick = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const k = keys.current;
      // 화면 기준 방향 → 타일 방향 (아이소메트릭)
      let sx = (k.has("arrowright") || k.has("d") ? 1 : 0) - (k.has("arrowleft") || k.has("a") ? 1 : 0);
      let sy = (k.has("arrowdown") || k.has("s") ? 1 : 0) - (k.has("arrowup") || k.has("w") ? 1 : 0);
      let vx = sx + sy, vy = sy - sx;
      const t = target.current;
      if (!vx && !vy && t) {
        vx = t.x - posRef.current[0];
        vy = t.y - posRef.current[1];
        if (Math.hypot(vx, vy) < 0.12) {
          target.current = null;
          vx = vy = 0;
          if (t.room) enter(t.room);
        }
      }
      const len = Math.hypot(vx, vy);
      if (len > 0) {
        const sp = 4 * dt;
        const [x, y] = posRef.current;
        let nx = x + (vx / len) * sp, ny = y + (vy / len) * sp;
        if (blocked(nx, y)) nx = x;
        if (blocked(nx, ny)) ny = y;
        if (nx === x && ny === y && t) target.current = null; // 막히면 멈춤
        posRef.current = [nx, ny];
        setPos(posRef.current);
      }
      setMoving(len > 0);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [paused]);

  // 땅을 누르면 그곳으로 이동
  const onGround = (e) => {
    if (paused) return;
    const svg = svgRef.current;
    const p = svg.createSVGPoint();
    p.x = e.clientX;
    p.y = e.clientY;
    const sp = p.matrixTransform(svg.getScreenCTM().inverse());
    const [x, y] = toTile(sp.x, sp.y);
    target.current = { x, y };
  };
  const onBuilding = (r) => (e) => {
    e.stopPropagation();
    const [x, y] = door(r);
    target.current = { x, y, room: r };
  };

  // 카메라: 캐릭터 중심
  const [cx, cy] = iso(...pos);
  const VW = 760, VH = 470;

  const tiles = [];
  for (let i = -1; i < W; i++)
    for (let j = -1; j < D; j++) {
      const road = j >= 3.5 && j < 5.5;
      tiles.push(<polygon key={`${i}-${j}`} points={pts([[i, j], [i + 1, j], [i + 1, j + 1], [i, j + 1]])}
        fill={road ? ((i + j) % 2 ? "#6b5b4b" : "#75644f") : (i + j) % 2 ? "#2f5d3a" : "#356842"} />);
    }

  // 그리기 순서: 뒤(x+y 작은 것)부터
  const sprites = [
    ...ROOMS.map((r) => ({ k: r.x + r.w + r.y + r.d, el: <Building key={r.id} r={r} near={nearRoom === r} onClick={onBuilding(r)} /> })),
    ...TREES.map(([x, y]) => ({ k: x + y + 0.5, el: (() => { const [a, b] = iso(x, y); return <text key={`t${x}`} x={a} y={b} fontSize="34" textAnchor="middle">🌳</text>; })() })),
    ...LAMPS.map(([x, y]) => ({ k: x + y + 0.4, el: (() => { const [a, b] = iso(x, y); return (
      <g key={`l${x}${y}`}>
        <circle cx={a} cy={b - 44} r="34" fill="url(#lampGlow)" />
        <rect x={a - 2} y={b - 40} width="4" height="40" fill="#2a2235" />
        <circle cx={a} cy={b - 44} r="6" fill="#fde68a" />
      </g>); })() })),
    { k: pos[0] + pos[1] + 0.6, el: (
      <g key="me" transform={`translate(${cx},${cy})`}>
        <ellipse rx="16" ry="7" fill="#0006" />
        <circle r="20" cy="-2" fill="none" stroke="#c084fc" strokeWidth="3" strokeDasharray="6 5" className="ring" transform="scale(1 0.45)" />
        <text y="-6" fontSize="40" textAnchor="middle" className={moving ? "walk" : ""}>{state.avatar}</text>
        <text y="-52" fontSize="13" textAnchor="middle" fontFamily="Jua" fill="#e9d5ff" stroke="#1b1430" strokeWidth="3" paintOrder="stroke">{state.nickname} (나)</text>
      </g>) },
  ].sort((a, b) => a.k - b.k);

  return (
    <div className="world">
      <svg ref={svgRef} className="world-svg" viewBox={`${cx - VW / 2} ${cy - VH / 2} ${VW} ${VH}`}
        preserveAspectRatio="xMidYMid slice" onPointerDown={onGround}>
        <defs>
          <radialGradient id="lampGlow">
            <stop offset="0" stopColor="#fde68a" stopOpacity="0.55" />
            <stop offset="1" stopColor="#fde68a" stopOpacity="0" />
          </radialGradient>
        </defs>
        {tiles}
        {sprites.map((s) => s.el)}
      </svg>

      {/* HUD */}
      <div className="hud-tl">
        <div className="hud-place">{nearRoom ? nearRoom.name + " 앞" : "운동장"}</div>
        <div className="tiny">방향키·WASD로 걷기 · 땅이나 건물을 눌러도 돼요</div>
      </div>
      {sign && <div className="hud-sign">{sign}</div>}
      {nearRoom && !paused && (
        <button className="enter-btn" onClick={() => enter(nearRoom)}>
          {nearRoom.emoji} {nearRoom.name} 들어가기 <kbd>Space</kbd>
        </button>
      )}
    </div>
  );
}
