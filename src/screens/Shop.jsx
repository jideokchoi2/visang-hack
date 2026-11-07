// 매점: 독후 활동으로 모은 도토리로 사물함 꾸미기 아이템 사기
import { SHOP } from "../data.js";
import { Npc } from "../components.jsx";

export default function Shop({ state, update, toast }) {
  const buy = (item) => {
    if (state.owned.includes(item.id)) return;
    if (state.points < item.price) return toast("도토리가 조금 모자라. 책을 읽고 더 모아 오자! 🌰");
    update((s) => ({ points: s.points - item.price, owned: [...s.owned, item.id] }));
    toast(`${item.name}을(를) 샀어! 사물함에서 써 봐 ✨`);
  };
  return (
    <div className="card">
      <h2>🏪 매점</h2>
      <Npc emoji="🐿️" name="다람이">반짝반짝 새 물건 들어왔다람! 도토리 {state.points}개 있네~</Npc>
      <div className="shop">
        {SHOP.map((it) => {
          const own = state.owned.includes(it.id);
          return (
            <button key={it.id} className="shop-item" disabled={own} onClick={() => buy(it)}>
              <span className="shop-emoji" style={it.color ? { background: it.color } : null}>{it.emoji || "🗄️"}</span>
              <b>{it.name}</b>
              <span>{own ? "✅ 가지고 있어" : `🌰 ${it.price}`}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
