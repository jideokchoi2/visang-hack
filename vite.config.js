import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// 개발 중에는 /api/ai 요청을 api/ai.js로 바로 연결한다 (배포 시에는 Vercel이 처리)
const devApi = () => ({
  name: "dev-api",
  configureServer(server) {
    server.middlewares.use("/api/ai", async (req, res) => {
      let body = "";
      req.on("data", (c) => (body += c));
      req.on("end", async () => {
        const { runTask } = await server.ssrLoadModule("/api/ai.js");
        res.setHeader("Content-Type", "application/json");
        try {
          const { task, input } = JSON.parse(body);
          res.end(JSON.stringify(await runTask(task, input)));
        } catch (e) {
          console.error(e);
          res.statusCode = 500;
          res.end(JSON.stringify({ error: "AI 요청 실패" }));
        }
      });
    });
  },
});

export default defineConfig(({ mode }) => {
  Object.assign(process.env, loadEnv(mode, process.cwd(), "")); // .env의 ANTHROPIC_API_KEY 읽기
  return { base: "./", plugins: [react(), devApi()] }; // base: GitHub Pages 하위 주소에서도 동작
});
