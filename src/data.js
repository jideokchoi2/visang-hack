// ─────────────────────────────────────────────
// 앱에서 쓰는 고정 데이터 모음 (책, 활동 대본, 뱃지, 상점, 시연용 친구 데이터)
// 새 책을 추가할 때는 BOOKS에 넣고 activity 화면을 하나 만들면 된다.
// ─────────────────────────────────────────────

export const MY_CLASS = "3학년 2반";
export const SCHOOL = "텍스트힙초등학교";

export const LIBRARIAN = { name: "헤르만 헤세", emoji: "🧓", note: "헤세 작가를 닮은 AI 사서예요" };

export const BOOKS = [
  { id: "castaway", title: "15소년 표류기", author: "쥘 베른", emoji: "🏝️", color: "#38bdf8", activity: "castaway",
    blurb: "폭풍우에 떠밀려 무인도에 간 소년들이 힘을 모아 살아가는 이야기" },
  { id: "orange", title: "나의 라임오렌지나무", author: "J. M. 바스콘셀로스", emoji: "🍊", color: "#fb923c", activity: "orange",
    blurb: "외로운 소년 제제가 마당의 작은 나무와 친구가 되는 이야기" },
];
export const bookById = (id) => BOOKS.find((b) => b.id === id);

export const MOODS = ["신나는", "심심한", "조금 외로운", "궁금한 게 많은", "용감해지고 싶은"];
export const INTERESTS = ["모험", "친구", "가족", "자연", "동물", "비밀", "탐험"];

// 15소년 표류기 갈림길 대본. ratio는 "우리 반 친구들의 선택" 시연용 숫자
export const CASTAWAY_STEPS = [
  {
    scene: "쾅! 폭풍우가 지나가고 배가 모래사장에 멈췄어. 여기는 아무도 없는 섬이야.",
    question: "제일 먼저 무엇을 할까?",
    options: [
      { label: "🧭 대장을 뽑아서 할 일을 나눠요", badge: "leader", crew: "🧑‍✈️ 고든: 좋아! 질서가 있어야 다 같이 살아남지.", ratio: 46 },
      { label: "🔦 섬을 먼저 탐험해요", badge: "explorer", crew: "🧒 브리앙: 내가 앞장설게. 동굴이 있을지도 몰라!", ratio: 38 },
      { label: "🍞 남은 식량부터 세어요", badge: "planner", crew: "👦 백스터: 꼼꼼하네! 아껴 먹으면 오래 버틸 수 있어.", ratio: 16 },
    ],
  },
  {
    scene: "며칠 뒤, 먹을 것이 점점 줄어들고 있어. 배가 꼬르륵~",
    question: "먹을 것을 어떻게 구할까?",
    options: [
      { label: "🎣 바다에서 낚시를 해요", crew: "🧒 브리앙: 그물을 같이 만들자!", ratio: 52 },
      { label: "🍓 숲에서 열매를 찾아요", crew: "👦 백스터: 독이 있는 건 조심하자.", ratio: 31 },
      { label: "🌱 씨앗을 심어 농사를 지어요", crew: "🧑‍✈️ 고든: 시간이 걸려도 오래 먹을 수 있겠어.", ratio: 17 },
    ],
  },
  {
    scene: "앗! 도니판이 브리앙과 크게 다퉜어. 도니판이 혼자 떠나겠대.",
    question: "너라면 어떻게 할까?",
    options: [
      { label: "🤝 둘이 이야기하도록 도와줘요", badge: "peacemaker", crew: "😤 도니판: …고마워. 사실 나도 미안했어.", ratio: 61 },
      { label: "🚶 도니판을 따라가서 지켜줘요", crew: "😮 도니판: 너 왜 따라왔어? …그래도 든든하다.", ratio: 27 },
      { label: "🗳️ 다 같이 회의를 열어요", crew: "🧑‍✈️ 고든: 모두의 의견을 들어 보자.", ratio: 12 },
    ],
  },
];

// 수집용 뱃지 (사물함에 붙일 수 있음)
export const BADGES = {
  first_book: { emoji: "📗", name: "첫 책 꽂기" },
  leader: { emoji: "🧭", name: "용감한 대장" },
  explorer: { emoji: "🔦", name: "섬 탐험가" },
  planner: { emoji: "🍞", name: "꼼꼼한 살림꾼" },
  peacemaker: { emoji: "🤝", name: "화해의 다리" },
  heart: { emoji: "💌", name: "마음 편지" },
  reviewer: { emoji: "✍️", name: "한 줄 서평가" },
};

// 매점 상품 (도토리로 구매 → 사물함 꾸미기)
export const SHOP = [
  { id: "st_star", type: "sticker", emoji: "⭐", name: "별 스티커", price: 20 },
  { id: "st_cat", type: "sticker", emoji: "🐱", name: "고양이 스티커", price: 20 },
  { id: "st_rainbow", type: "sticker", emoji: "🌈", name: "무지개 스티커", price: 30 },
  { id: "st_rocket", type: "sticker", emoji: "🚀", name: "로켓 스티커", price: 30 },
  { id: "c_mint", type: "color", color: "#a7f3d0", name: "민트 사물함", price: 40 },
  { id: "c_pink", type: "color", color: "#fbcfe8", name: "분홍 사물함", price: 40 },
  { id: "c_sky", type: "color", color: "#bae6fd", name: "하늘 사물함", price: 40 },
];

// 포인트 규칙
export const POINTS = { addBook: 10, activity: 30, review: 20 };

// 리그 기준 (읽은 책 + 서평 수)
export const TIERS = [
  { name: "다이아", emoji: "💎", min: 10 },
  { name: "골드", emoji: "🥇", min: 6 },
  { name: "실버", emoji: "🥈", min: 3 },
  { name: "브론즈", emoji: "🥉", min: 0 },
];
export const tierOf = (score) => TIERS.find((t) => score >= t.min);

// ── 시연용 친구 데이터 (실제 서비스에서는 서버 DB에서 불러옴) ──
export const AVATARS = ["🐰", "🦊", "🐻", "🐼", "🐯", "🐸", "🐧", "🐹"];

export const CLASSMATE_WORKS = [
  { id: "w1", author: "별사탕", avatar: "🐰", className: "3학년 2반", bookId: "castaway",
    story: "별사탕은 섬에서 가장 높은 나무에 올라가 불을 피웠어. 연기를 본 배가 다가왔지!",
    review: "협동이 제일 중요하다는 걸 알았어요.", tags: ["#15소년표류기", "#섬탐험가", "#협동"],
    cover: { title: "연기 신호 작전", subtitle: "높이 높이 올라가", emojis: ["🔥", "🌴", "🚢"], colorTop: "#fca5a5", colorBottom: "#fde68a" } },
  { id: "w2", author: "하늘이", avatar: "🦊", className: "3학년 2반", bookId: "orange",
    story: "하늘이의 나무 친구는 비 오는 날마다 잎으로 우산을 만들어 줬어.",
    review: "나도 비밀 친구가 있으면 좋겠어요.", tags: ["#나의라임오렌지나무", "#마음편지", "#우정"],
    cover: { title: "잎사귀 우산", subtitle: "비 오는 날의 비밀", emojis: ["🌧️", "🌳", "☂️"], colorTop: "#93c5fd", colorBottom: "#bbf7d0" } },
  { id: "w3", author: "도토리", avatar: "🐻", className: "3학년 1반", bookId: "castaway",
    story: "도토리는 다툰 친구들을 모아 회의를 열었어. 모두 손을 잡고 섬을 지켰지.",
    review: "싸워도 다시 친해질 수 있어요.", tags: ["#15소년표류기", "#화해의다리"],
    cover: { title: "섬 회의 시간", subtitle: "우리는 한 팀", emojis: ["🗳️", "🏝️", "🤝"], colorTop: "#c4b5fd", colorBottom: "#a7f3d0" } },
  { id: "w4", author: "구름빵", avatar: "🐼", className: "3학년 1반", bookId: "orange",
    story: "구름빵은 나무에게 동생이 생겨서 서운하다고 말했어. 나무는 꼭 안아 주었지.",
    review: "속마음을 말하니까 시원했어요.", tags: ["#나의라임오렌지나무", "#가족"],
    cover: { title: "서운한 마음", subtitle: "나무가 들어 줬어", emojis: ["🍊", "🫂", "🌙"], colorTop: "#fdba74", colorBottom: "#fef3c7" } },
];

// 반별 서고: 책마다 친구들의 한마디 (시연용)
export const CLASS_THOUGHTS = {
  castaway: [
    { author: "별사탕", avatar: "🐰", text: "나라면 무서워서 울었을 것 같아" },
    { author: "하늘이", avatar: "🦊", text: "브리앙이 진짜 멋진 대장이야" },
    { author: "콩이", avatar: "🐸", text: "도니판도 사실 외로웠던 거 아닐까?" },
  ],
  orange: [
    { author: "하늘이", avatar: "🦊", text: "제제가 나무랑 대화하는 게 신기했어" },
    { author: "콩이", avatar: "🐸", text: "읽다가 좀 슬펐어" },
  ],
};

export const LEAGUE = [
  { name: "별사탕", avatar: "🐰", className: "3학년 2반", score: 11 },
  { name: "도토리", avatar: "🐻", className: "3학년 1반", score: 7 },
  { name: "하늘이", avatar: "🦊", className: "3학년 2반", score: 5 },
  { name: "구름빵", avatar: "🐼", className: "3학년 1반", score: 3 },
  { name: "콩이", avatar: "🐸", className: "3학년 2반", score: 1 },
  { name: "솜사탕", avatar: "🐧", className: "4학년 1반", score: 9 },
  { name: "바람이", avatar: "🐯", className: "4학년 2반", score: 4 },
];

export const OTHER_CLASS = { name: "3학년 1반", books: ["castaway", "orange"] };

// ── 그림 파일 (선택) ──
// public/art/ 폴더에 AI로 만든 그림을 넣고 경로를 적으면 이모지 대신 그림이 나온다.
// 예: title: "./art/title.png", librarian: "./art/hesse.png"
// 비워 두면 이모지로 표시된다.
export const ART = {
  title: "",
  librarian: "",
  guide: "",
};

// 시작 스토리 (비주얼노벨 컷신)
export const INTRO_STORY = [
  { who: "책벌레 고슴이", face: "🦔", art: "guide", color: "#7dd3fc", text: "어? 너 아직 집에 안 갔어? 방과 후 학교는 조금 특별하거든." },
  { who: "책벌레 고슴이", face: "🦔", art: "guide", color: "#7dd3fc", text: "해가 지면 도서관 책들이 하나둘 깨어나. 책 속 세계로 들어갈 수 있지!" },
  { who: "헤르만 헤세 사서", face: "🧓", art: "librarian", color: "#fbbf24", text: "반갑구나. 나는 이 도서관을 지키는 사서란다." },
  { who: "헤르만 헤세 사서", face: "🧓", art: "librarian", color: "#fbbf24", text: "책을 골라 학급 문고에 꽂고, 책 속 모험을 끝내면 뱃지를 줄게." },
  { who: "책벌레 고슴이", face: "🦔", art: "guide", color: "#7dd3fc", text: "뱃지는 사물함에 붙이고, 네 이야기는 학급 문집에 실려! 자, 도서관부터 가 보자!" },
];
