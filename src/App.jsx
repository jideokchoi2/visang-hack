// 화면 전환과 상단바를 담당하는 뼈대
import { useState } from "react";
import { useStore } from "./store.js";
import { tierOf } from "./data.js";
import Start from "./screens/Start.jsx";
import SchoolMap from "./screens/SchoolMap.jsx";
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

export default function App() {
  const { state, update, addBadge, reset } = useStore();
  const [screen, setScreen] = useState("map");
  const [msg, setMsg] = useState("");

  const toast = (m) => {
    setMsg(m);
    setTimeout(() => setMsg(""), 2500);
  };
  const go = (s) => {
    setScreen(s);
    window.scrollTo(0, 0);
  };

  if (!state.nickname)
    return <main className="app"><Start onStart={(nickname, avatar) => update(() => ({ nickname, avatar }))} /></main>;

  const Screen = SCREENS[screen];
  const tier = tierOf(state.works.length + state.reviews);
  const props = { state, update, addBadge, toast, go };

  return (
    <main className="app">
      <header className="topbar">
        <button className="btn ghost sm" onClick={() => go("map")}>🗺️ 학교 지도</button>
        <span className="me">{state.avatar} {state.nickname}</span>
        <span className="pill">🌰 {state.points}</span>
        <span className="pill">{tier.emoji} {tier.name}</span>
        <span className="pill">🏅 {state.badges.length}</span>
        <button className="btn ghost sm reset" onClick={() => confirm("처음부터 다시 할까요?") && (reset(), go("map"))}>↺</button>
      </header>
      {Screen ? <Screen {...props} /> : <SchoolMap {...props} />}
      {msg && <div className="toast-fixed">{msg}</div>}
    </main>
  );
}
