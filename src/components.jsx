// 여러 화면에서 같이 쓰는 작은 부품들
import { BADGES, SHOP } from "./data.js";

// 말풍선 캐릭터 (사서, 섬 대원 등)
export function Npc({ emoji, name, children }) {
  return (
    <div className="npc">
      <div className="npc-face">{emoji}</div>
      <div className="bubble">
        {name && <b className="npc-name">{name}</b>}
        <div>{children}</div>
      </div>
    </div>
  );
}

// AI가 고른 색·이모지·제목으로 그리는 책 표지 (그림 생성 AI 없이 즉시 표시)
export function Cover({ cover, author, size = 180 }) {
  if (!cover) return null;
  const id = "g" + Math.abs(hash(cover.title + (author || "")));
  return (
    <svg viewBox="0 0 120 160" width={size} height={(size * 4) / 3} className="cover" role="img" aria-label={cover.title}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={cover.colorTop} />
          <stop offset="1" stopColor={cover.colorBottom} />
        </linearGradient>
      </defs>
      <rect width="120" height="160" rx="6" fill={`url(#${id})`} />
      <rect x="0" y="0" width="8" height="160" fill="#0002" />
      <text x="64" y="62" fontSize="34" textAnchor="middle">{cover.emojis?.[0]}</text>
      <text x="38" y="92" fontSize="20" textAnchor="middle">{cover.emojis?.[1]}</text>
      <text x="90" y="92" fontSize="20" textAnchor="middle">{cover.emojis?.[2]}</text>
      <rect x="14" y="104" width="100" height="44" rx="5" fill="#fffd" />
      <text x="64" y="122" fontSize="11" textAnchor="middle" fontFamily="Jua" fill="#3b2f2f">{cover.title}</text>
      <text x="64" y="136" fontSize="7" textAnchor="middle" fill="#6b5b5b">{cover.subtitle}</text>
      {author && <text x="64" y="145" fontSize="6" textAnchor="middle" fill="#9a8a8a">글 {author}</text>}
    </svg>
  );
}
function hash(s) {
  let h = 0;
  for (const c of s) h = (h * 31 + c.charCodeAt(0)) | 0;
  return h;
}

// 뱃지·스티커 id → 표시용 이모지/이름
export function itemInfo(id) {
  if (BADGES[id]) return { ...BADGES[id], kind: "뱃지" };
  const s = SHOP.find((x) => x.id === id);
  return s ? { ...s, kind: "스티커" } : null;
}

export function Loading({ text = "생각하는 중이야…" }) {
  return <div className="loading">⏳ {text}</div>;
}
