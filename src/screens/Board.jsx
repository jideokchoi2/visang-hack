// 리그 게시판: 활동(책 체험) 수 + 서평 수로 브론즈~다이아 리그
import { useState } from "react";
import { LEAGUE, MY_CLASS, TIERS, tierOf } from "../data.js";

export default function Board({ state }) {
  const [scope, setScope] = useState("grade");
  const me = { name: state.nickname, avatar: state.avatar, className: MY_CLASS, score: state.works.length + state.reviews, me: true };
  const rows = [...LEAGUE, me]
    .filter((r) => scope === "school" || r.className.startsWith("3학년"))
    .sort((a, b) => b.score - a.score);

  return (
    <div className="card">
      <h2>🏆 리그 게시판</h2>
      <div className="chips">
        <button className={`chip ${scope === "grade" ? "on" : ""}`} onClick={() => setScope("grade")}>3학년 리그</button>
        <button className={`chip ${scope === "school" ? "on" : ""}`} onClick={() => setScope("school")}>학교 리그</button>
      </div>
      <p className="tiny">점수 = 체험한 책 + 쓴 서평 · {TIERS.map((t) => `${t.emoji}${t.name} ${t.min}+`).join(" · ")}</p>
      <ol className="league">
        {rows.map((r, i) => {
          const t = tierOf(r.score);
          return (
            <li key={r.name + r.className} className={r.me ? "me" : ""}>
              <span className="rank">{i + 1}</span>
              <span>{r.avatar} {r.name}</span>
              <span className="tiny">{r.className}</span>
              <span>{t.emoji} {t.name}</span>
              <b>{r.score}점</b>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
