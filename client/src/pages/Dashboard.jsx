import { useEffect, useState } from 'react';
import { Activity, Leaf, Sprout, TreePine, ArrowUpRight, RefreshCw } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import api from '../api';

const chartColors = ['#174D36', '#2F7D50', '#6BAF82', '#A8D5B5'];
const format = n => new Intl.NumberFormat('en-IN').format(n || 0);

function MetricCard({ title, value, note, icon: Icon, tint }) {
  return <article className="metric-card"><div className="metric-top"><span>{title}</span><div className={`metric-icon ${tint}`}><Icon size={19} /></div></div><strong className="metric-value">{format(value)}</strong><div className="metric-note"><span className="note-dot" />{note}</div></article>;
}

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  async function load() {
    setLoading(true); setError('');
    try { const res = await api.get('/dashboard/summary'); setData(res.data); }
    catch (err) { setError(err.response?.data?.message || 'Could not load dashboard. Is the API running?'); }
    finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);
  if (loading) return <div className="loading-state"><div className="spinner" /> Loading your impact…</div>;
  if (error) return <div className="error-panel"><strong>Dashboard unavailable</strong><p>{error}</p><button className="btn btn-secondary" onClick={load}><RefreshCw size={16} /> Try again</button></div>;
  const s = data.summary;
  return <div className="dashboard-page">
    <section className="welcome-row"><div><span className="eyebrow">YOUR ENVIRONMENTAL OVERVIEW</span><h2>Let's grow something good.</h2><p>Here's how your projects are making a difference.</p></div><button className="refresh-btn" onClick={load}><RefreshCw size={15} /> Refresh data</button></section>
    <section className="metrics-grid">
      <MetricCard title="Total projects" value={s.totalProjects} note="Across all initiatives" icon={Sprout} tint="icon-mint" />
      <MetricCard title="Trees planted" value={s.treesPlanted} note={`of ${format(s.targetTrees)} target trees`} icon={TreePine} tint="icon-sage" />
      <MetricCard title="Active projects" value={s.activeProjects} note="Currently in progress" icon={Activity} tint="icon-pale" />
      <MetricCard title="Completion rate" value={`${Number.isFinite(Number(s.completionRate)) ? Number(s.completionRate) : 0}%`} note={`${s.completedProjects} projects completed`} icon={Leaf} tint="icon-dark" />
    </section>
    <section className="charts-grid">
      <article className="chart-card"><div className="chart-header"><div><h3>Projects by status</h3><p>Current portfolio distribution</p></div><span className="chart-tag">STATUS</span></div>
        {data.byStatus.every(x => x.value === 0) ? <div className="empty-chart">No project data yet.</div> : <div className="chart-wrap"><ResponsiveContainer width="100%" height="100%"><BarChart data={data.byStatus} margin={{ top: 12, right: 8, left: -20, bottom: 0 }}><CartesianGrid stroke="#E8EFE8" vertical={false} /><XAxis dataKey="name" tick={{ fontSize: 11, fill: '#7B8B80' }} axisLine={false} tickLine={false} /><YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#7B8B80' }} axisLine={false} tickLine={false} /><Tooltip cursor={{ fill: '#F4F8F3' }} contentStyle={{ border: '1px solid #E2EAE3', borderRadius: 12 }} /><Bar dataKey="value" name="Projects" fill="#2F7D50" radius={[6, 6, 0, 0]} barSize={34} /></BarChart></ResponsiveContainer></div>}
      </article>
      <article className="chart-card"><div className="chart-header"><div><h3>Project categories</h3><p>Initiatives by focus area</p></div><span className="chart-tag">TYPE</span></div>
        {!data.byType.length ? <div className="empty-chart">No project data yet.</div> : <div className="pie-content"><div className="pie-wrap"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={data.byType} dataKey="value" nameKey="name" innerRadius={62} outerRadius={88} paddingAngle={4}><Cell fill={chartColors[0]} />{data.byType.slice(1).map((x, i) => <Cell key={x.name} fill={chartColors[(i + 1) % chartColors.length]} />)}</Pie><Tooltip contentStyle={{ border: '1px solid #E2EAE3', borderRadius: 12 }} /></PieChart></ResponsiveContainer><div className="pie-center"><strong>{s.totalProjects}</strong><span>Projects</span></div></div><div className="legend">{data.byType.map((item, i) => <div key={item.name}><span className="legend-dot" style={{ background: chartColors[i % chartColors.length] }} /><span>{item.name}</span><strong>{item.value}</strong></div>)}</div></div>}
      </article>
    </section>
    <article className="chart-card trend-card"><div className="chart-header"><div><h3>Tree planting activity</h3><p>Recorded tree counts by project creation month</p></div><span className="chart-tag"><ArrowUpRight size={14} /> IMPACT</span></div>
      {!data.treeTrend.length ? <div className="empty-chart">Tree planting activity will appear here.</div> : <div className="trend-chart"><ResponsiveContainer width="100%" height="100%"><LineChart data={data.treeTrend} margin={{ top: 10, right: 10, left: -18, bottom: 0 }}><CartesianGrid stroke="#E8EFE8" vertical={false} /><XAxis dataKey="month" tick={{ fontSize: 11, fill: '#7B8B80' }} axisLine={false} tickLine={false} /><YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#7B8B80' }} axisLine={false} tickLine={false} /><Tooltip contentStyle={{ border: '1px solid #E2EAE3', borderRadius: 12 }} /><Line type="monotone" dataKey="trees" name="Trees planted" stroke="#2F7D50" strokeWidth={3} dot={{ r: 4, fill: '#2F7D50', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} /></LineChart></ResponsiveContainer></div>}
    </article>
    <div className="impact-banner"><div className="impact-leaf"><Leaf size={22} /></div><div><strong>Every tree tells a story.</strong><p>Keep nurturing your projects—small steps create lasting change.</p></div><div className="impact-count"><strong>{format(s.treesPlanted)}</strong><span>trees growing</span></div></div>
  </div>;
}
