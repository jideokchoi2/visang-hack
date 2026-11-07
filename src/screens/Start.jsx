// 캐릭터 고르기 (해커톤 초안이라 로그인 대신 닉네임 사용)
import { useState } from "react";
import { AVATARS, SCHOOL, MY_CLASS } from "../data.js";

export default function Start({ onStart, onBack }) {
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState(AVATARS[0]);
  return (
    <div className="setup-screen">
      <div className="setup">
        <h2 className="glow">{MY_CLASS} · 누구로 들어갈까요?</h2>
        <p className="tiny">{SCHOOL}</p>
        <div className="avatars">
          {AVATARS.map((a) => (
            <button key={a} className={`avatar ${a === avatar ? "on" : ""}`} onClick={() => setAvatar(a)}>{a}</button>
          ))}
        </div>
        <input className="input" placeholder="내 이름 (실명 말고 닉네임!)" maxLength={8} value={name} onChange={(e) => setName(e.target.value)} />
        <button className="btn big wide" disabled={!name.trim()} onClick={() => onStart(name.trim(), avatar)}>혼자 하기</button>
        <button className="btn big wide dark" disabled title="다음 버전에서 열려요">친구와 함께: 반 코드로 들어가기 🔒</button>
        <button className="link" onClick={onBack}>← 처음 화면</button>
      </div>
    </div>
  );
}
