// 도서관: 작가를 닮은 AI 사서가 기분·관심사를 듣고 책을 추천 → 학급 문고에 꽂기
import { useState } from "react";
import { BOOKS, LIBRARIAN, MOODS, INTERESTS, bookById, POINTS } from "../data.js";
import { Npc, Loading } from "../components.jsx";
import { askAI } from "../store.js";

export default function Library({ state, update, addBadge, toast }) {
  const [mood, setMood] = useState("");
  const [likes, setLikes] = useState([]);
  const [rec, setRec] = useState(null);
  const [loading, setLoading] = useState(false);

  const toggle = (x) => setLikes((l) => (l.includes(x) ? l.filter((y) => y !== x) : [...l, x]));

  const ask = async () => {
    setLoading(true);
    try {
      const r = await askAI("recommend", {
        librarian: LIBRARIAN.name,
        mood,
        interests: likes,
        books: BOOKS.map(({ id, title, blurb }) => ({ id, title, blurb })),
      });
      setRec({ ...r, book: bookById(r.bookId) || BOOKS[0] });
    } catch {
      toast("앗, 사서 선생님이 잠깐 자리를 비웠어. 다시 눌러 줘!");
    }
    setLoading(false);
  };

  const shelve = (id) => {
    if (state.classBooks.includes(id)) return toast("이미 학급 문고에 있어!");
    update((s) => ({ classBooks: [...s.classBooks, id], points: s.points + POINTS.addBook, badges: addBadge(s, "first_book") }));
    toast(`짠! 학급 문고에 꽂았어 📚 도토리 +${POINTS.addBook}`);
  };

  return (
    <div className="card">
      <h2>📚 도서관</h2>
      <Npc emoji={LIBRARIAN.emoji} art="librarian" name={`${LIBRARIAN.name} 사서`}>
        어서 와, {state.nickname}아. 오늘 기분은 어때? 너에게 맞는 책을 찾아 줄게.
        <div className="tiny">※ {LIBRARIAN.note}</div>
      </Npc>

      <h3>오늘 내 기분은?</h3>
      <div className="chips">
        {MOODS.map((m) => <button key={m} className={`chip ${mood === m ? "on" : ""}`} onClick={() => setMood(m)}>{m}</button>)}
      </div>
      <h3>좋아하는 것 (여러 개 골라도 돼)</h3>
      <div className="chips">
        {INTERESTS.map((x) => <button key={x} className={`chip ${likes.includes(x) ? "on" : ""}`} onClick={() => toggle(x)}>{x}</button>)}
      </div>
      <button className="btn" disabled={!mood || !likes.length || loading} onClick={ask}>책 추천받기 ✨</button>

      {loading && <Loading text="사서 선생님이 책장을 살펴보는 중…" />}
      {rec && (
        <div className="rec">
          <Npc emoji={LIBRARIAN.emoji} art="librarian" name={`${LIBRARIAN.name} 사서`}>{rec.message}</Npc>
          <BookCard book={rec.book} onShelve={() => shelve(rec.book.id)} shelved={state.classBooks.includes(rec.book.id)} />
        </div>
      )}

      <h3>도서관 책장 둘러보기</h3>
      <div className="grid">
        {BOOKS.map((b) => <BookCard key={b.id} book={b} onShelve={() => shelve(b.id)} shelved={state.classBooks.includes(b.id)} />)}
      </div>
    </div>
  );
}

export function BookCard({ book, onShelve, shelved, onOpen }) {
  return (
    <div className="book" style={{ "--c": book.color }}>
      <div className="book-spine">{book.emoji}</div>
      <div>
        <b>{book.title}</b>
        <div className="tiny">{book.author}</div>
        <div className="small">{book.blurb}</div>
        {onShelve && <button className="btn sm" disabled={shelved} onClick={onShelve}>{shelved ? "✅ 문고에 있어요" : "학급 문고에 꽂기"}</button>}
        {onOpen && <button className="btn sm" onClick={onOpen}>열어 보기</button>}
      </div>
    </div>
  );
}
