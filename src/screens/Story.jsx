// 비주얼노벨식 컷신: 화면을 누르면 다음 대사, 건너뛰기 가능
import { useState } from "react";
import { Face } from "../components.jsx";

export default function Story({ lines, onDone }) {
  const [i, setI] = useState(0);
  const line = lines[i];
  const next = () => (i < lines.length - 1 ? setI(i + 1) : onDone());
  return (
    <div className="story-screen" onClick={next}>
      <div className="story-stage">
        <span className="story-actor">{line.face}</span>
      </div>
      <div className="vn-box">
        <Face emoji={line.face} art={line.art} size={84} />
        <div>
          <b className="npc-name" style={{ color: line.color }}>{line.who}</b>
          <p>{line.text}</p>
        </div>
        <span className="vn-next">▶</span>
      </div>
      <div className="story-foot">
        <span>{i + 1} / {lines.length}</span>
        <span>눌러서 넘기기</span>
        <button className="btn ghost sm" onClick={(e) => { e.stopPropagation(); onDone(); }}>건너뛰기 ▶▶</button>
      </div>
    </div>
  );
}
