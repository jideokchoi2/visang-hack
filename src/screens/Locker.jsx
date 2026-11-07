// 나의 사물함: 받은 뱃지와 산 스티커를 붙여서 나를 표현하는 공간
import { SHOP, tierOf } from "../data.js";
import { itemInfo } from "../components.jsx";

export default function Locker({ state, update }) {
  const collection = [...state.badges, ...state.owned.filter((id) => SHOP.find((s) => s.id === id)?.type === "sticker")];
  const colors = SHOP.filter((s) => s.type === "color" && state.owned.includes(s.id));
  const tier = tierOf(state.works.length + state.reviews);

  const toggle = (id) =>
    update((s) => ({
      locker: { ...s.locker, items: s.locker.items.includes(id) ? s.locker.items.filter((x) => x !== id) : [...s.locker.items, id] },
    }));

  return (
    <div className="card">
      <h2>🗄️ {state.nickname}의 사물함</h2>
      <div className="locker" style={{ background: state.locker.color }}>
        <div className="locker-name">{state.avatar} {state.nickname} · {tier.emoji} {tier.name}</div>
        <div className="locker-vent" />
        <div className="locker-items">
          {state.locker.items.map((id) => {
            const it = itemInfo(id);
            return it && <span key={id} className="sticker" title={it.name}>{it.emoji}</span>;
          })}
          {!state.locker.items.length && <span className="small">아래에서 뱃지를 눌러 붙여 봐!</span>}
        </div>
      </div>

      <h3>🏅 내 컬렉션 ({collection.length})</h3>
      {!collection.length && <p className="small">체험을 끝내면 뱃지를 받을 수 있어!</p>}
      <div className="chips">
        {collection.map((id) => {
          const it = itemInfo(id);
          return (
            <button key={id} className={`chip ${state.locker.items.includes(id) ? "on" : ""}`} onClick={() => toggle(id)}>
              {it.emoji} {it.name}
            </button>
          );
        })}
      </div>

      {colors.length > 0 && (
        <>
          <h3>🎨 사물함 색</h3>
          <div className="chips">
            {[{ id: "base", color: "#fde68a", name: "기본 노랑" }, ...colors].map((c) => (
              <button key={c.id} className="chip" style={{ background: c.color }} onClick={() => update((s) => ({ locker: { ...s.locker, color: c.color } }))}>
                {c.name}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
