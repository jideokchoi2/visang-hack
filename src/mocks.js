// AI 예시 답변(mock): API 키가 없거나, GitHub Pages처럼 서버가 없을 때 사용
// 서버(api/ai.js)와 브라우저(store.js) 양쪽에서 같이 쓴다.
export const MOCKS = {
  recommend: (i) => ({
    bookId: i.books[0].id,
    message: `오늘 ${i.mood} 기분이구나. 그럼 이 책이 딱이야! 친구들과 힘을 모으는 이야기거든.`,
  }),
  castaway: (i) => ({
    story: `${i.nickname}, 너는 친구들과 힘을 모아 섬에서 살아남았어. 다툰 친구와도 화해했지. 마침내 멀리서 배가 보였어! 모두 함께 집으로 돌아갔어.`,
    cover: {
      title: `${i.nickname}의 무인도`,
      subtitle: "함께라서 버틸 수 있었어",
      emojis: ["🏝️", "⛵", "🤝"],
      colorTop: "#7dd3fc",
      colorBottom: "#fde68a",
    },
  }),
  orange: (i) => ({
    reply: `${i.nickname}야, 편지 고마워. 네 마음을 들려줘서 기뻐. 나는 언제나 여기서 네 이야기를 들을게. 내일도 놀러 와!`,
    cover: {
      title: "비밀 나무의 답장",
      subtitle: `${i.nickname}에게`,
      emojis: ["🌳", "🍊", "💌"],
      colorTop: "#bbf7d0",
      colorBottom: "#fed7aa",
    },
  }),
};
