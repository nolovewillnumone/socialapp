export default function RadarChart({ data }) {
  const size = 260;
  const cx = size / 2, cy = size / 2;
  const r = 100;
  const n = data.length;
  const angle = (i) => (Math.PI * 2 * i) / n - Math.PI / 2;
  const gridLevels = [0.25, 0.5, 0.75, 1];
  const colors = ["#42A5F5", "#FF7043", "#66BB6A", "#FFD740", "#7E57C2", "#26C6DA"];

  const toXY = (i, val) => ({
    x: cx + r * val * Math.cos(angle(i)),
    y: cy + r * val * Math.sin(angle(i)),
  });

  const dataPoints = data.map((d, i) => toXY(i, d.value / 100));
  const polyPoints = dataPoints.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <svg width={size} height={size} className="radar-svg">
      {gridLevels.map((lvl) => {
        const pts = data.map((_, i) => toXY(i, lvl));
        return (
          <polygon
            key={lvl}
            points={pts.map((p) => `${p.x},${p.y}`).join(" ")}
            fill="none"
            stroke="#BBDEFB"
            strokeWidth="1.5"
          />
        );
      })}
      {data.map((_, i) => {
        const outer = toXY(i, 1);
        return <line key={i} x1={cx} y1={cy} x2={outer.x} y2={outer.y} stroke="#BBDEFB" strokeWidth="1.5" />;
      })}
      <polygon points={polyPoints} fill="rgba(66,165,245,0.22)" stroke="#1565C0" strokeWidth="2.5" />
      {dataPoints.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={6} fill={colors[i % colors.length]} stroke="#fff" strokeWidth="2" />
      ))}
      {data.map((d, i) => {
        const lx = cx + (r + 22) * Math.cos(angle(i));
        const ly = cy + (r + 22) * Math.sin(angle(i));
        return (
          <text key={i} x={lx} y={ly} textAnchor="middle" dominantBaseline="middle"
            fontSize="12" fontWeight="800" fill={colors[i % colors.length]} fontFamily="Nunito, sans-serif">
            {d.value}%
          </text>
        );
      })}
    </svg>
  );
}
