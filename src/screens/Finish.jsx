// 활동 마무리 공통 화면: 결과 + AI 표지 + 한 줄 서평 → 문집·미술실에 저장, 뱃지·도토리 지급
import { useState } from "react";
import { BADGES, POINTS } from "../data.js";
import { Cover } from "../components.jsx";

export default function Finish({ state, update, addBadge, toast, go, book, text, cover, badge, tags }) {
  const [review, setReview] = useState("");
  const [saved, setSaved] = useState(false);

  const save = () => {
    const hasReview = review.trim().length > 0;
    const work = {
      id: "my" + Date.now(), author: state.nickname, avatar: state.avatar, bookId: book.id,
      story: text, review: review.trim(), cover, tags,
    };
    update((s) => {
      let badges = addBadge(s, badge);
      if (hasReview) badges = addBadge({ ...s, badges }, "reviewer");
      return {
        works: [...s.works, work],
        badges,
        points: s.points + POINTS.activity + (hasReview ? POINTS.review : 0),
        reviews: s.reviews + (hasReview ? 1 : 0),
      };
    });
    setSaved(true);
    toast(`${BADGES[badge]?.emoji || "🏅"} 뱃지를 받았어! 도토리 +${POINTS.activity + (hasReview ? POINTS.review : 0)}`);
  };

  return (
    <div className="finish">
      <Cover cover={cover} author={state.nickname} size={200} />
      <div className="finish-body">
        <p className="story">{text}</p>
        <div className="tags">{tags.map((t) => <span key={t} className="tag">{t}</span>)}</div>
        {!saved ? (
          <>
            <input className="input" placeholder="✍️ 한 줄 서평 (쓰면 도토리 +20)" maxLength={40} value={review} onChange={(e) => setReview(e.target.value)} />
            <button className="btn big" onClick={save}>📕 문집에 넣고 뱃지 받기</button>
          </>
        ) : (
          <div className="row">
            <button className="btn" onClick={() => go("locker")}>🗄️ 사물함에 뱃지 붙이러 가기</button>
            <button className="btn ghost" onClick={() => go("munjip")}>📕 문집 보기</button>
          </div>
        )}
      </div>
    </div>
  );
}
