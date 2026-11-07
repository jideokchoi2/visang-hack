// 교실: 학급 문고(반별 서고) + 사물함 + 학급 문집으로 가는 곳
// readOnly면 다른 반 교실 탐방 모드
import { useState } from "react";
import { bookById, CLASS_THOUGHTS, CLASSMATE_WORKS, MY_CLASS, OTHER_CLASS } from "../data.js";
import { BookCard } from "./Library.jsx";
import { Cover } from "../components.jsx";

export default function Classroom({ state, go, readOnly }) {
  const [open, setOpen] = useState(null);
  const className = readOnly ? OTHER_CLASS.name : MY_CLASS;
  const books = readOnly ? OTHER_CLASS.books : state.classBooks;
  const works = CLASSMATE_WORKS.filter((w) => w.className === className);

  return (
    <div className="card">
      <h2>{readOnly ? "🚪" : "🏫"} {className} 교실 {readOnly && <span className="tag">구경 중</span>}</h2>
      {!readOnly && (
        <div className="row">
          <button className="btn" onClick={() => go("locker")}>🗄️ 내 사물함</button>
          <button className="btn" onClick={() => go("munjip")}>📕 학급 문집</button>
        </div>
      )}

      <h3>📚 학급 문고</h3>
      {!books.length && <p className="small">아직 비어 있어. 도서관에서 책을 추천받아 꽂아 봐!</p>}
      <div className="grid">
        {books.map((id) => <BookCard key={id} book={bookById(id)} onOpen={() => setOpen(id)} />)}
      </div>

      {readOnly && (
        <>
          <h3>🖼️ {className} 친구들 작품</h3>
          <div className="gallery">
            {works.map((w) => (
              <figure key={w.id}>
                <Cover cover={w.cover} author={w.author} size={120} />
                <figcaption>{w.avatar} {w.author}</figcaption>
              </figure>
            ))}
          </div>
        </>
      )}

      {open && <BookModal book={bookById(open)} readOnly={readOnly} onClose={() => setOpen(null)} onPlay={() => go(bookById(open).activity)} />}
    </div>
  );
}

// 책을 누르면: 우리 반 친구들의 생각 + 체험하러 가기
function BookModal({ book, readOnly, onClose, onPlay }) {
  const thoughts = CLASS_THOUGHTS[book.id] || [];
  return (
    <div className="modal" onClick={onClose}>
      <div className="card" onClick={(e) => e.stopPropagation()}>
        <h2>{book.emoji} {book.title}</h2>
        <p className="small">{book.blurb}</p>
        <h3>💭 친구들은 이렇게 생각했어</h3>
        <ul className="thoughts">
          {thoughts.map((t) => <li key={t.author}>{t.avatar} <b>{t.author}</b> “{t.text}”</li>)}
        </ul>
        <div className="row">
          {!readOnly && <button className="btn big" onClick={onPlay}>🎮 체험하러 가기</button>}
          <button className="btn ghost" onClick={onClose}>닫기</button>
        </div>
      </div>
    </div>
  );
}
