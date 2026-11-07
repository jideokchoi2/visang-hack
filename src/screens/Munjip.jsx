// 학급 문집: 우리 반 친구들의 작품을 책처럼 한 장씩 넘겨 보기 + 해시태그로 모아 보기
import { useState } from "react";
import { CLASSMATE_WORKS, MY_CLASS, bookById } from "../data.js";
import { Cover } from "../components.jsx";

export default function Munjip({ state }) {
  const all = [...state.works.map((w) => ({ ...w, className: MY_CLASS })), ...CLASSMATE_WORKS.filter((w) => w.className === MY_CLASS)];
  const [tag, setTag] = useState(null);
  const [page, setPage] = useState(0);
  const pages = tag ? all.filter((w) => w.tags.includes(tag)) : all;
  const w = pages[Math.min(page, pages.length - 1)];
  const allTags = [...new Set(all.flatMap((x) => x.tags))];

  const pick = (t) => { setTag(t === tag ? null : t); setPage(0); };

  return (
    <div className="card">
      <h2>📕 {MY_CLASS} 학급 문집</h2>
      <div className="chips">
        {allTags.map((t) => <button key={t} className={`chip ${tag === t ? "on" : ""}`} onClick={() => pick(t)}>{t}</button>)}
      </div>
      {w && (
        <div className="munjip-page">
          <Cover cover={w.cover} author={w.author} size={190} />
          <div>
            <div className="tiny">{bookById(w.bookId)?.title}에서</div>
            <h3>{w.avatar} {w.author}의 이야기</h3>
            <p className="story">{w.story}</p>
            {w.review && <p className="review">✍️ “{w.review}”</p>}
            <div className="tags">{w.tags.map((t) => <span key={t} className="tag" onClick={() => pick(t)}>{t}</span>)}</div>
          </div>
        </div>
      )}
      <div className="row pager">
        <button className="btn ghost" disabled={page === 0} onClick={() => setPage(page - 1)}>◀ 앞장</button>
        <span>{pages.length ? page + 1 : 0} / {pages.length}</span>
        <button className="btn ghost" disabled={page >= pages.length - 1} onClick={() => setPage(page + 1)}>뒷장 ▶</button>
      </div>
    </div>
  );
}
