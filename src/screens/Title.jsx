// 타이틀 화면: 큰 제목 + 시작하기 (ART.title에 그림을 넣으면 배경 그림으로 나온다)
import { ART } from "../data.js";

export default function Title({ onStart }) {
  return (
    <div className="title-screen" style={ART.title ? { backgroundImage: `url(${ART.title})` } : null}>
      {!ART.title && <TitleScene />}
      <div className="title-left">
        <h1 className="game-title">
          <span>텍스트힙</span>
          <span>학교</span>
        </h1>
        <p className="title-sub">해가 지면 책 속 세계가 열린다</p>
        <button className="btn big wide" onClick={onStart}>시작하기</button>
      </div>
      <div className="credit">제1회 교사연구회 연합 AI 해커톤 · TEXT HIP</div>
    </div>
  );
}

// 그림이 없을 때 보여 줄 기본 배경: 노을 진 학교와 떠다니는 책
function TitleScene() {
  return (
    <div className="title-scene" aria-hidden>
      <div className="moon" />
      <div className="school-silhouette">
        <div className="tower">🕰️</div>
        <div className="wing">{Array.from({ length: 10 }, (_, i) => <i key={i} />)}</div>
      </div>
      {["📕", "📗", "📘", "📙", "📖"].map((b, i) => <span key={i} className={`float-book b${i}`}>{b}</span>)}
      <div className="title-cast">🧓 🦔 🐰 🦊</div>
    </div>
  );
}
