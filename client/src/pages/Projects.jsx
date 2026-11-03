import { useEffect, useMemo, useState } from 'react';
import { Plus, Search, MapPin, CalendarDays, Trees, Pencil, Trash2, SlidersHorizontal, RefreshCw } from 'lucide-react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import ProjectModal from '../components/ProjectModal';

const statuses = ['All statuses', 'Planned', 'In Progress', 'Completed', 'On Hold'];
const dateText = d => d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'No end date';
const progress = p => p.targetTrees > 0 ? Math.min(100, Math.round(p.treesPlanted / p.targetTrees * 100)) : 0;

export default function Projects() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All statuses');
  const [modal, setModal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function load() {
    setLoading(true); setError('');
    try { const { data } = await api.get('/projects'); setProjects(data.projects); }
    catch (err) { setError(err.response?.data?.message || 'Could not load projects.'); }
    finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);
  const filtered = useMemo(() => projects.filter(p => (status === 'All statuses' || p.status === status) && `${p.name} ${p.location} ${p.type}`.toLowerCase().includes(search.toLowerCase())), [projects, status, search]);

  async function save(form) {
    if (modal?._id) await api.put(`/projects/${modal._id}`, form);
    else await api.post('/projects', form);
    await load();
  }
  async function remove(project) {
    if (!window.confirm(`Delete "${project.name}"? This cannot be undone.`)) return;
    try { await api.delete(`/projects/${project._id}`); await load(); }
    catch (err) { setError(err.response?.data?.message || 'Unable to delete project.'); }
  }

  return <div className="projects-page">
    <section className="projects-intro"><div><span className="eyebrow">ENVIRONMENTAL INITIATIVES</span><h2>Projects that make a difference.</h2><p>Manage your portfolio and keep every green initiative moving.</p></div>{user?.role === 'Admin' && <button className="btn btn-primary" onClick={() => setModal({})}><Plus size={18} /> New project</button>}</section>
    <section className="projects-toolbar"><div className="search-box"><Search size={17} /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search projects or locations…" /></div><div className="filter-select"><SlidersHorizontal size={16} /><select value={status} onChange={e => setStatus(e.target.value)}>{statuses.map(x => <option key={x}>{x}</option>)}</select></div><button className="icon-btn refresh-icon" onClick={load} aria-label="Refresh projects"><RefreshCw size={17} /></button></section>
    {error && <div className="inline-error">{error}</div>}
    {loading ? <div className="loading-state"><div className="spinner" /> Loading projects…</div> : filtered.length === 0 ? <div className="empty-state"><div className="empty-icon"><Trees size={26} /></div><h3>No projects found</h3><p>{search || status !== 'All statuses' ? 'Try changing your search or filters.' : 'Create your first environmental initiative to get started.'}</p>{user?.role === 'Admin' && !search && status === 'All statuses' && <button className="btn btn-primary" onClick={() => setModal({})}><Plus size={17} /> Add a project</button>}</div> : <div className="project-grid">{filtered.map(project => <article className="project-card" key={project._id}>
      <div className="project-card-top"><div className="project-type"><span className="type-icon"><Trees size={16} /></span>{project.type}</div><span className={`status-badge status-${project.status.toLowerCase().replace(' ', '-')}`}>{project.status}</span></div>
      <h3>{project.name}</h3><p className="project-location"><MapPin size={15} />{project.location}</p><p className="project-description">{project.description || 'No project description has been added.'}</p>
      <div className="progress-head"><span>Tree planting progress</span><strong>{progress(project)}%</strong></div><div className="progress-track"><div className="progress-fill" style={{ width: `${progress(project)}%` }} /></div>
      <div className="project-stats"><div><strong><Trees size={15} /> {new Intl.NumberFormat('en-IN').format(project.treesPlanted)}</strong><span>Trees planted</span></div><div><strong>{new Intl.NumberFormat('en-IN').format(project.targetTrees)}</strong><span>Target trees</span></div></div>
      <div className="project-card-bottom"><span><CalendarDays size={14} /> {dateText(project.startDate)}</span>{user?.role === 'Admin' && <div className="project-actions"><button onClick={() => setModal(project)} aria-label={`Edit ${project.name}`}><Pencil size={15} /></button><button onClick={() => remove(project)} aria-label={`Delete ${project.name}`}><Trash2 size={15} /></button></div>}</div>
    </article>)}</div>}
    <div className="results-foot">Showing <strong>{filtered.length}</strong> of {projects.length} projects</div>
    {modal && <ProjectModal project={modal._id ? modal : null} onClose={() => setModal(null)} onSave={save} />}
  </div>;
}
