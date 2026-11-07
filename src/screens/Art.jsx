// 미술실: 모두가 만든 책 표지 갤러리 (학교 전체)
import { CLASSMATE_WORKS } from "../data.js";
import { Cover } from "../components.jsx";

export default function Art({ state }) {
  const all = [...state.works.map((w) => ({ ...w, className: "3학년 2반", mine: true })), ...CLASSMATE_WORKS];
  return (
    <div className="card">
      <h2>🎨 미술실 표지 갤러리</h2>
      <p className="small">친구들이 자기 이야기로 만든 책 표지가 걸려 있어!</p>
      <div className="gallery">
        {all.map((w) => (
          <figure key={w.id} className={w.mine ? "mine" : ""}>
            <Cover cover={w.cover} author={w.author} size={130} />
            <figcaption>{w.avatar} {w.author} <span className="tiny">{w.className}</span></figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
