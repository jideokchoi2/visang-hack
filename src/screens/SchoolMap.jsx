// 아이소메트릭 학교 지도: 건물(교실)을 누르면 캐릭터가 걸어가서 입장한다.
import { useState } from "react";

const TW = 64; // 타일 가로
const TH = 32; // 타일 세로
const OX = 300; // 화면 기준점
const OY = 96;
const iso = (x, y, z = 0) => [(x - y) * (TW / 2) + OX, (x + y) * (TH / 2) + OY - z];
const pts = (arr) => arr.map((p) => iso(...p).join(",")).join(" ");

// 학교 공간 배치 (x, y 타일 좌표, w×d 크기, h 높이)
export const ROOMS = [
  { id: "library", name: "도서관", emoji: "📚", x: 0, y: 0, w: 3, d: 2, h: 56, color: "#f59e0b" },
  { id: "classroom", name: "3학년 2반", emoji: "🏫", x: 4, y: 0, w: 2, d: 2, h: 44, color: "#60a5fa", mine: true },
  { id: "otherclass", name: "3학년 1반", emoji: "🚪", x: 7, y: 0, w: 2, d: 2, h: 44, color: "#a78bfa" },
  { id: "art", name: "미술실", emoji: "🎨", x: 0, y: 4, w: 2, d: 2, h: 40, color: "#f472b6" },
  { id: "music", name: "음악실", emoji: "🎵", x: 3, y: 4, w: 2, d: 2, h: 40, color: "#94a3b8", soon: true },
  { id: "board", name: "리그 게시판", emoji: "🏆", x: 6, y: 4.3, w: 1, d: 1, h: 30, color: "#facc15" },
  { id: "shop", name: "매점", emoji: "🏪", x: 8, y: 4, w: 2, d: 2, h: 36, color: "#34d399" },
];

function shade(hex, amt) {
  const n = parseInt(hex.slice(1), 16);
  const c = (v) => Math.max(0, Math.min(255, v + amt));
  return `rgb(${c(n >> 16)},${c((n >> 8) & 255)},${c(n & 255)})`;
}

function Building({ r, onClick }) {
  const { x, y, w, d, h, color } = r;
  const [lx, ly] = iso(x + w / 2, y + d / 2, h);
  return (
    <g className={`building ${r.soon ? "soon" : ""}`} onClick={onClick}>
      {/* 오른쪽 면 */}
      <polygon points={pts([[x + w, y, 0], [x + w, y + d, 0], [x + w, y + d, h], [x + w, y, h]])} fill={shade(color, -40)} />
      {/* 앞쪽 면 */}
      <polygon points={pts([[x, y + d, 0], [x + w, y + d, 0], [x + w, y + d, h], [x, y + d, h]])} fill={shade(color, -15)} />
      {/* 창문 */}
      {[0.25, 0.6].map((t) => {
        const [wx, wy] = iso(x + w * t, y + d, h * 0.55);
        return <rect key={t} x={wx} y={wy - 6} width={10} height={9} rx={2} fill="#fef9c3" opacity="0.9" />;
      })}
      {/* 지붕 */}
      <polygon points={pts([[x, y, h], [x + w, y, h], [x + w, y + d, h], [x, y + d, h]])} fill={shade(color, 25)} />
      <text x={lx} y={ly - 2} textAnchor="middle" fontSize="22">{r.emoji}</text>
      <g transform={`translate(${lx},${ly - 30})`}>
        <rect x={-38} y={-12} width={76} height={20} rx={10} fill="#fffaf0" stroke="#7c5c3b" strokeWidth="1.5" />
        <text textAnchor="middle" y={3} fontSize="11" fontFamily="Jua" fill="#5b4330">
          {r.soon ? "🚧 " : ""}{r.name}
        </text>
      </g>
    </g>
  );
}

export default function SchoolMap({ state, go }) {
  const [pos, setPos] = useState([9.3, 3]); // 캐릭터 위치(타일)
  const [px, py] = iso(...pos);
  const [sign, setSign] = useState("");

  const enter = (r) => {
    if (r.soon) return setSign("음악실은 곧 열려요! 🚧");
    setSign("");
    setPos([r.x + r.w / 2, r.y + r.d + 0.6]); // 건물 앞까지 이동
    setTimeout(() => go(r.id), 650);
  };

  // 바닥 타일 (운동장)
  const tiles = [];
  for (let i = -1; i < 10; i++)
    for (let j = -1; j < 8; j++)
      tiles.push(<polygon key={`${i}-${j}`} points={pts([[i, j], [i + 1, j], [i + 1, j + 1], [i, j + 1]])} fill={(i + j) % 2 ? "#bbe5a0" : "#a9db8c"} />);

  const trees = [[-1, 2.5], [2.6, 3.2], [9.3, 2.6], [5.6, 6.8], [-0.6, 6.5]];

  return (
    <div className="map-wrap">
      <p className="hint">🏫 {state.nickname}아, 어디로 가 볼까? 건물을 눌러 봐!</p>
      {sign && <p className="toast">{sign}</p>}
      <svg viewBox="0 0 680 400" className="map">
        {tiles}
        {/* 복도 길 */}
        <polygon points={pts([[0, 2.4], [10, 2.4], [10, 3.6], [0, 3.6]])} fill="#e7d3a8" />
        {trees.map(([tx, ty]) => {
          const [a, b] = iso(tx, ty);
          return <text key={tx} x={a} y={b} fontSize="26" textAnchor="middle">🌳</text>;
        })}
        {[...ROOMS].sort((a, b) => a.x + a.y - (b.x + b.y)).map((r) => (
          <Building key={r.id} r={r} onClick={() => enter(r)} />
        ))}
        <g className="player" style={{ transform: `translate(${px}px, ${py}px)` }}>
          <ellipse cx="0" cy="2" rx="12" ry="5" fill="#0003" />
          <text y="-4" fontSize="30" textAnchor="middle">{state.avatar}</text>
          <text y="-36" fontSize="10" textAnchor="middle" fontFamily="Jua" fill="#5b4330">{state.nickname}</text>
        </g>
      </svg>
    </div>
  );
}
