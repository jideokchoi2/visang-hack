// 게임 뼈대: 타이틀 → 캐릭터 고르기 → 시작 스토리 → 걸어 다니는 학교
// 건물에 들어가면 학교 위에 게임 창(패널)이 열린다.
import { useState } from "react";
import { useStore } from "./store.js";
import { tierOf, INTRO_STORY } from "./data.js";
import Title from "./screens/Title.jsx";
import Start from "./screens/Start.jsx";
import Story from "./screens/Story.jsx";
import SchoolMap, { ROOMS } from "./screens/SchoolMap.jsx";
import Library from "./screens/Library.jsx";
import Classroom from "./screens/Classroom.jsx";
import Castaway from "./screens/Castaway.jsx";
import Orange from "./screens/Orange.jsx";
import Locker from "./screens/Locker.jsx";
import Shop from "./screens/Shop.jsx";
import Munjip from "./screens/Munjip.jsx";
import Art from "./screens/Art.jsx";
import Board from "./screens/Board.jsx";

const SCREENS = {
  library: Library,
  classroom: Classroom,
  otherclass: (p) => <Classroom {...p} readOnly />,
  castaway: Castaway,
  orange: Orange,
  locker: Locker,
  shop: Shop,
  munjip: Munjip,
  art: Art,
  board: Board,
};
const TITLES = { castaway: "🏝️ 15소년 표류기", orange: "🍊 나의 라임오렌지나무", locker: "🗄️ 사물함", munjip: "📕 학급 문집" };

export default function App() {
  const { state, update, addBadge, reset } = useStore();
  const [phase, setPhase] = useState("title");
  const [screen, setScreen] = useState("map");
  const [msg, setMsg] = useState("");

  const toast = (m) => {
    setMsg(m);
    setTimeout(() => setMsg(""), 2500);
  };
  // pos: 학교에서 나갈 때 서 있던 자리 (돌아오면 그 자리에서 시작)
  const go = (s, pos) => {
    if (pos) update(() => ({ mapPos: pos }));
    setScreen(s);
  };

  if (phase === "title") return <Title onStart={() => setPhase(state.nickname ? "game" : "setup")} />;
  if (phase === "setup")
    return <Start onBack={() => setPhase("title")} onStart={(nickname, avatar) => { update(() => ({ nickname, avatar })); setPhase("story"); }} />;
  if (phase === "story") return <Story lines={INTRO_STORY} onDone={() => setPhase("game")} />;

  const Screen = SCREENS[screen];
  const tier = tierOf(state.works.length + state.reviews);
  const props = { state, update, addBadge, toast, go };
  const room = ROOMS.find((r) => r.id === screen);

  return (
    <main className="game">
      <SchoolMap {...props} paused={!!Screen} />

      <div className="hud-tr">
        <span className="pill">🌰 {state.points}</span>
        <span className="pill">{tier.emoji} {tier.name}</span>
        <span className="pill me">{state.avatar} {state.nickname}</span>
      </div>
      <div className="hud-br">
        <button className="hud-btn" onClick={() => go("locker")}>🗄️<small>사물함</small><b>{state.badges.length}</b></button>
        <button className="hud-btn" onClick={() => go("munjip")}>📕<small>문집</small></button>
        <button className="hud-btn" onClick={() => confirm("처음부터 다시 할까요?") && (reset(), setScreen("map"), setPhase("title"))}>⚙️<small>처음부터</small></button>
      </div>

      {Screen && (
        <div className="window-wrap">
          <section className="window">
            <header className="window-head">
              <span>{room ? `${room.emoji} ${room.name}` : TITLES[screen]}</span>
              <button className="btn ghost sm" onClick={() => go("map")}>✕ 나가기</button>
            </header>
            <div className="window-body"><Screen {...props} /></div>
          </section>
        </div>
      )}
      {msg && <div className="toast-fixed">{msg}</div>}
    </main>
  );
}
