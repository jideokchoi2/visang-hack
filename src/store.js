// 학생 한 명의 상태를 브라우저(localStorage)에 저장한다.
// 해커톤 초안용: 실제 서비스에서는 이 부분을 서버 DB로 바꾸면 된다.
import { useEffect, useState } from "react";

const KEY = "textip-school-v1";

export const initialState = {
  nickname: "",
  avatar: "🐰",
  classBooks: [], // 학급 문고에 꽂은 책 id
  points: 0, // 도토리
  badges: [], // 받은 뱃지 id
  owned: [], // 산 상점 아이템 id
  locker: { color: "#fde68a", items: [] }, // 사물함에 붙인 뱃지/스티커 id
  works: [], // 내 작품 (문집·미술실에 모임)
  reviews: 0, // 서평 수
};

function load() {
  try {
    return { ...initialState, ...JSON.parse(localStorage.getItem(KEY)) };
  } catch {
    return initialState;
  }
}

export function useStore() {
  const [state, setState] = useState(load);
  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* 저장 불가 환경이면 무시 */
    }
  }, [state]);

  const update = (fn) => setState((s) => ({ ...s, ...fn(s) }));
  const addBadge = (s, id) => (id && !s.badges.includes(id) ? [...s.badges, id] : s.badges);
  const reset = () => setState(initialState);

  return { state, update, addBadge, reset };
}

// AI 서버 호출
export async function askAI(task, input) {
  const res = await fetch("/api/ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ task, input }),
  });
  if (!res.ok) throw new Error("AI 요청 실패");
  return res.json();
}
