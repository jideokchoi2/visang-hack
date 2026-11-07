// 15소년 표류기: 내가 주인공이 되어 갈림길 3번 선택 → AI가 나만의 결말과 표지를 만든다
import { useState } from "react";
import { CASTAWAY_STEPS, bookById } from "../data.js";
import { Npc, Loading } from "../components.jsx";
import { askAI } from "../store.js";
import Finish from "./Finish.jsx";

export default function Castaway(props) {
  const { state, toast } = props;
  const [step, setStep] = useState(-1); // -1: 시작 안내
  const [picked, setPicked] = useState(null); // 지금 단계에서 고른 선택지
  const [choices, setChoices] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const book = bookById("castaway");

  const next = async () => {
    const all = [...choices, picked];
    setChoices(all);
    setPicked(null);
    if (step < CASTAWAY_STEPS.length - 1) return setStep(step + 1);
    setLoading(true);
    try {
      const r = await askAI("castaway", { nickname: state.nickname, choices: all.map((c) => c.label) });
      setResult(r);
    } catch {
      toast("앗, 이야기를 만들다 파도에 휩쓸렸어! 다시 눌러 줘.");
      setChoices(choices);
      setPicked(picked);
    }
    setLoading(false);
  };

  if (result)
    return (
      <div className="card">
        <h2>🏝️ {state.nickname}의 15소년 표류기</h2>
        <Finish {...props} book={book} text={result.story} cover={result.cover}
          badge={choices[0].badge} tags={["#15소년표류기", "#내가주인공", "#협동"]} />
      </div>
    );

  if (step === -1)
    return (
      <div className="card">
        <h2>🏝️ 15소년 표류기 체험</h2>
        <Npc emoji="🧒" name="브리앙">
          안녕, 나는 브리앙이야! 우리 배가 폭풍우를 만났어. {state.nickname}, 네가 우리와 함께 섬에서 살아남아 줄래?
        </Npc>
        <p className="small">갈림길이 3번 나와. 네 선택으로 이야기가 바뀌고, 마지막엔 너만의 책 표지가 생겨!</p>
        <button className="btn big" onClick={() => setStep(0)}>배에서 내리기 ⛵</button>
      </div>
    );

  const s = CASTAWAY_STEPS[step];
  return (
    <div className="card">
      <div className="progress">{CASTAWAY_STEPS.map((_, i) => <span key={i} className={i <= step ? "on" : ""} />)}</div>
      <p className="scene">{s.scene}</p>
      <h3>{s.question}</h3>
      <div className="options">
        {s.options.map((o) => (
          <button key={o.label} className={`option ${picked === o ? "on" : ""}`} disabled={!!picked} onClick={() => setPicked(o)}>
            {o.label}
            {picked && (
              <span className="ratio"><span style={{ width: `${o.ratio}%` }} /> 우리 반 {o.ratio}%</span>
            )}
          </button>
        ))}
      </div>
      {picked && (
        <>
          <Npc emoji={picked.crew.split(" ")[0]}>{picked.crew.slice(picked.crew.indexOf(" ") + 1)}</Npc>
          {loading ? <Loading text="너만의 결말을 쓰는 중…" /> : (
            <button className="btn big" onClick={next}>{step < CASTAWAY_STEPS.length - 1 ? "다음 이야기로 ➡️" : "결말 보기 📖"}</button>
          )}
        </>
      )}
    </div>
  );
}
