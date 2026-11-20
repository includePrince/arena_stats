export default function StatCard({ label, value, detail, icon: Icon, accent = 'violet' }) {
  return <div className="stat-card"><div className="stat-top"><span>{label}</span><div className={`stat-icon ${accent}`}><Icon size={18}/></div></div><div className="stat-value">{value}</div><div className="stat-detail">{detail}</div></div>;
}
