import { useState, useEffect } from "react";

export default function ShareModal({ lang, dark, results, onClose }) {
  const [copied, setCopied] = useState(false);
  const SITE_URL = "levelup-talent.xyz";

  const L = {
    ru:{ prompt:"📤 Поделись сайтом с друзьями!", click:"Нажми чтобы скопировать", copied:"✅ Ссылка скопирована!" },
    uz:{ prompt:"📤 Saytni do'stlaringiz bilan ulashing!", click:"Nusxalash uchun bosing", copied:"✅ Havola nusxalandi!" },
    en:{ prompt:"📤 Share this site with friends!", click:"Click to copy", copied:"✅ Link copied!" },
  }[lang]||{};

  const handleClick = () => {
    navigator.clipboard.writeText(`https://${SITE_URL}`).then(() => {
      setCopied(true);
      setTimeout(onClose, 2000);
    }).catch(() => {
      setCopied(true);
      setTimeout(onClose, 2000);
    });
  };

  // Auto-dismiss if ignored
  useEffect(() => {
    const t = setTimeout(onClose, 8000);
    return () => clearTimeout(t);
  }, []);

  const card = dark ? "#0D1A11" : "#fff";
  const bdr  = dark ? "rgba(93,202,165,0.2)" : "rgba(15,110,86,0.15)";
  const text = dark ? "#E1F5EE" : "#04342C";

  return (
    <>
      <style>{`
        @keyframes toastPop{from{opacity:0;transform:translateY(20px) scale(0.9)}to{opacity:1;transform:translateY(0) scale(1)}}
        .share-toast-btn:hover{transform:translateY(-2px);box-shadow:0 12px 32px rgba(15,110,86,0.35)!important;}
      `}</style>

      <div
        onClick={!copied ? handleClick : undefined}
        style={{
          position:"fixed", bottom:96, left:24, zIndex:9991,
          background: copied ? "linear-gradient(135deg,#2E7D32,#43A047)" : card,
          borderRadius:16, border:`1.5px solid ${copied?"transparent":bdr}`,
          boxShadow:"0 12px 40px rgba(0,0,0,0.18)",
          padding:"14px 20px", cursor: copied?"default":"pointer",
          animation:"toastPop 0.4s cubic-bezier(0.34,1.56,0.64,1) both",
          maxWidth:"calc(100vw - 48px)",
          transition:"all 0.3s ease",
        }}
        className={copied ? "" : "share-toast-btn"}
      >
        {copied ? (
          <span style={{ fontFamily:"'Fredoka One',cursive", fontSize:"0.95rem", color:"#fff" }}>
            {L.copied}
          </span>
        ) : (
          <div>
            <div style={{ fontFamily:"'Fredoka One',cursive", fontSize:"0.92rem", color:text, marginBottom:2 }}>
              {L.prompt}
            </div>
            <div style={{ fontSize:"0.75rem", fontWeight:700, color:"#0F6E56" }}>
              👆 {L.click} · {SITE_URL}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
