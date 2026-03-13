// src/components/Loader.jsx
export default function Loader({ message = "Загружаем..." }) {
  return (
    <div style={styles.wrap}>
      {/* Orbiting dots */}
      <div style={styles.orbit}>
        <div style={{ ...styles.dot, ...styles.dot1 }} />
        <div style={{ ...styles.dot, ...styles.dot2 }} />
        <div style={{ ...styles.dot, ...styles.dot3 }} />
        <div style={styles.star}>🌟</div>
      </div>

      <p style={styles.message}>{message}</p>

      <style>{`
        @keyframes orbit {
          from { transform: rotate(0deg) translateX(36px) rotate(0deg); }
          to   { transform: rotate(360deg) translateX(36px) rotate(-360deg); }
        }
        @keyframes orbit2 {
          from { transform: rotate(120deg) translateX(36px) rotate(-120deg); }
          to   { transform: rotate(480deg) translateX(36px) rotate(-480deg); }
        }
        @keyframes orbit3 {
          from { transform: rotate(240deg) translateX(36px) rotate(-240deg); }
          to   { transform: rotate(600deg) translateX(36px) rotate(-600deg); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50%       { transform: scale(1.25); }
        }
        @keyframes fadeSlide {
          0%, 100% { opacity: 0.5; transform: translateY(0px); }
          50%       { opacity: 1;   transform: translateY(-4px); }
        }
      `}</style>
    </div>
  );
}

const styles = {
  wrap: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "60vh",
    gap: 24,
    fontFamily: "'Nunito', sans-serif",
  },
  orbit: {
    position: "relative",
    width: 90,
    height: 90,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  dot: {
    position: "absolute",
    width: 14,
    height: 14,
    borderRadius: "50%",
    top: "50%",
    left: "50%",
    marginTop: -7,
    marginLeft: -7,
  },
  dot1: {
    background: "#1565C0",
    animation: "orbit 1.2s linear infinite",
  },
  dot2: {
    background: "#FF7043",
    animation: "orbit2 1.2s linear infinite",
  },
  dot3: {
    background: "#66BB6A",
    animation: "orbit3 1.2s linear infinite",
  },
  star: {
    fontSize: "1.8rem",
    animation: "pulse 1.5s ease-in-out infinite",
    zIndex: 1,
  },
  message: {
    color: "#1565C0",
    fontWeight: 800,
    fontSize: "1.05rem",
    animation: "fadeSlide 1.8s ease-in-out infinite",
    margin: 0,
  },
};
