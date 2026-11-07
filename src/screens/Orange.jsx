// 나의 라임오렌지나무 (임시 활동): 나만의 비밀 나무 친구에게 편지 → 나무의 답장 + 편지 표지
// ※ 저작권이 남아 있는 작품이라 원작 문장은 쓰지 않고 줄거리 소개 + 활동 중심으로 구성
import { useState } from "react";
import { bookById } from "../data.js";
import { Npc, Loading } from "../components.jsx";
import { askAI } from "../store.js";
import Finish from "./Finish.jsx";

export default function Orange(props) {
  const { state, toast } = props;
  const [letter, setLetter] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const book = bookById("orange");

  const send = async () => {
    setLoading(true);
    try {
      setResult(await askAI("orange", { nickname: state.nickname, letter }));
    } catch {
      toast("앗, 바람이 편지를 날려 버렸어! 다시 보내 줘.");
    }
    setLoading(false);
  };

  if (result)
    return (
      <div className="card">
        <h2>🌳 비밀 나무의 답장</h2>
        <Finish {...props} book={book} text={result.reply} cover={result.cover}
          badge="heart" tags={["#나의라임오렌지나무", "#마음편지", "#비밀친구"]} />
      </div>
    );

  return (
    <div className="card">
      <h2>🍊 나의 라임오렌지나무 체험</h2>
      <p className="small">책 속 제제는 마당의 작은 나무와 비밀 친구가 돼. 너에게도 비밀 나무 친구가 생겼어!</p>
      <Npc emoji="🌳" name="나의 비밀 나무">
        안녕, {state.nickname}! 나는 너만의 나무 친구야. 요즘 어떤 일이 있었어? 편지로 들려줄래?
      </Npc>
      <textarea className="input" rows={5} maxLength={300} placeholder="나무 친구에게 편지를 써 봐 (예: 오늘 친구랑 싸워서 속상했어…)"
        value={letter} onChange={(e) => setLetter(e.target.value)} />
      {loading ? <Loading text="나무가 잎사귀로 답장을 쓰는 중…" /> : (
        <button className="btn big" disabled={letter.trim().length < 5} onClick={send}>💌 편지 보내기</button>
      )}
    </div>
  );
}
