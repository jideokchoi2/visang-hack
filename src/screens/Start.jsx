// 시작 화면: 닉네임과 캐릭터 고르기 (해커톤 초안이라 로그인 대신 사용)
import { useState } from "react";
import { AVATARS, SCHOOL, MY_CLASS } from "../data.js";

export default function Start({ onStart }) {
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState(AVATARS[0]);
  return (
    <div className="card center start">
      <h1 className="logo">📖 텍스트힙 학교</h1>
      <p>{SCHOOL} · {MY_CLASS}</p>
      <p className="sub">책을 읽고, 체험하고, 친구들과 나눠요!</p>
      <div className="avatars">
        {AVATARS.map((a) => (
          <button key={a} className={`avatar ${a === avatar ? "on" : ""}`} onClick={() => setAvatar(a)}>{a}</button>
        ))}
      </div>
      <input className="input" placeholder="닉네임을 적어 줘 (실명 말고!)" maxLength={8} value={name} onChange={(e) => setName(e.target.value)} />
      <button className="btn big" disabled={!name.trim()} onClick={() => onStart(name.trim(), avatar)}>학교에 들어가기 🚪</button>
    </div>
  );
}
