// AI 서버 함수 (Vercel Serverless Function 형식)
// - API 키는 서버에만 둔다. 브라우저 코드에는 절대 넣지 않는다.
// - ANTHROPIC_API_KEY가 없으면 미리 준비한 예시 답변(mock)으로 동작해서 시연이 끊기지 않는다.
import Anthropic from "@anthropic-ai/sdk";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import * as z from "zod/v4";
import { MOCKS } from "../src/mocks.js";

// 모든 AI 답변에 공통으로 붙는 말투·안전 지시문
const TONE = `너는 초등학교 3~4학년 친구들과 이야기하는 다정한 학교 마을 캐릭터야.
- 한 문장은 짧게(15자 안팎) 말해.
- 반말을 쓰되 다정하고 존중하는 말투로 말해.
- 어려운 한자어 대신 쉬운 우리말을 써.
- 무섭거나 폭력적인 표현, 외모·성별 비하, 개인정보를 묻는 말은 절대 하지 마.
- 아이가 쓴 내용이 부적절하면 부드럽게 다른 이야기로 돌려.`;

// 표지 디자인 스키마 (그림 생성 AI 대신 SVG로 그려서 빠르고 안정적)
const Cover = z.object({
  title: z.string().describe("나만의 책 제목, 12자 이내"),
  subtitle: z.string().describe("부제, 20자 이내"),
  emojis: z.array(z.string()).describe("표지에 들어갈 이모지 3개"),
  colorTop: z.string().describe("배경 위쪽 색, #RRGGBB"),
  colorBottom: z.string().describe("배경 아래쪽 색, #RRGGBB"),
});

const TASKS = {
  // 1) 도서관 작가 사서의 책 추천
  recommend: {
    schema: z.object({
      bookId: z.string().describe("반드시 후보 목록 중 하나의 id"),
      message: z.string().describe("사서가 건네는 추천 이유, 2~3문장"),
    }),
    system: (i) => `${TONE}
너는 '${i.librarian}' 작가를 닮은 AI 사서야. 진짜 작가 본인인 척하지는 마.
아이의 기분과 관심사를 듣고 후보 책 중 한 권을 골라 추천해.
후보 책: ${JSON.stringify(i.books)}`,
    user: (i) => `내 기분: ${i.mood}\n내 관심사: ${i.interests.join(", ")}`,
    mock: MOCKS.recommend,
  },

  // 2) 15소년 표류기: 내 선택으로 결말 + 표지 만들기
  castaway: {
    schema: z.object({ story: z.string().describe("결말 이야기 3~4문장"), cover: Cover }),
    system: () => `${TONE}
『15소년 표류기』(쥘 베른)를 바탕으로 아이가 고른 선택을 이어서 '나만의 결말'을 써 줘.
아이가 주인공이야. 원작의 분위기(무인도, 협동, 우정)를 지키고 희망찬 결말로 끝내.
그 결말에 어울리는 책 표지도 디자인해 줘.`,
    user: (i) => `내 이름: ${i.nickname}\n내가 고른 선택: ${i.choices.join(" → ")}`,
    mock: MOCKS.castaway,
  },

  // 3) 나의 라임오렌지나무: 나만의 비밀 나무 친구에게 편지 → 나무의 답장 (임시 활동)
  orange: {
    schema: z.object({ reply: z.string().describe("나무 친구의 답장, 3~4문장"), cover: Cover }),
    system: () => `${TONE}
너는 『나의 라임오렌지나무』에서 영감을 받은 '아이만의 비밀 나무 친구'야.
원작 문장을 옮기지 말고, 아이의 편지에 따뜻하게 공감하며 답장해.
아이가 힘든 이야기를 하면 믿을 수 있는 어른(선생님, 보호자)에게 말해 보라고 다정하게 권해.
답장에 어울리는 편지 표지도 디자인해 줘.`,
    user: (i) => `${i.nickname}의 편지:\n${i.letter}`,
    mock: MOCKS.orange,
  },
};

const client = process.env.ANTHROPIC_API_KEY ? new Anthropic() : null;

export async function runTask(task, input) {
  const t = TASKS[task];
  if (!t) throw new Error(`알 수 없는 작업: ${task}`);
  if (!client) return { ...t.mock(input), mock: true };

  const res = await client.beta.messages.parse({
    model: "claude-opus-5-5",
    max_tokens: 2000,
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default", // 안전 필터가 거절하면 서버가 다른 모델로 자동 재시도
    output_config: { effort: "low", format: betaZodOutputFormat(t.schema) }, // 아이들이 기다리지 않게 low
    system: t.system(input),
    messages: [{ role: "user", content: t.user(input) }],
  });

  if (res.stop_reason === "refusal" || !res.parsed_output) return { ...t.mock(input), mock: true };
  return res.parsed_output;
}

// Vercel 핸들러
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });
  try {
    const { task, input } = req.body;
    res.status(200).json(await runTask(task, input));
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "AI 요청 실패" });
  }
}
