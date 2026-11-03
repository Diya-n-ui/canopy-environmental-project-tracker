import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

const empty = { name: '', type: 'Afforestation', location: '', status: 'Planned', treesPlanted: 0, targetTrees: 0, startDate: new Date().toISOString().slice(0, 10), endDate: '', description: '' };
const types = ['Afforestation', 'Restoration', 'Conservation', 'Waste Management', 'Renewable Energy', 'Other'];
const statuses = ['Planned', 'In Progress', 'Completed', 'On Hold'];

export default function ProjectModal({ project, onClose, onSave }) {
  const [form, setForm] = useState(empty);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (project) setForm({ ...empty, ...project, startDate: project.startDate?.slice(0, 10) || empty.startDate, endDate: project.endDate?.slice(0, 10) || '' });
    else setForm(empty);
  }, [project]);

  function change(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: ['treesPlanted', 'targetTrees'].includes(name) ? Number(value) : value }));
  }
  async function submit(e) {
    e.preventDefault(); setError(''); setSaving(true);
    try { await onSave(form); onClose(); }
    catch (err) { setError(err.response?.data?.errors?.join(' ') || err.response?.data?.message || 'Unable to save project.'); }
    finally { setSaving(false); }
  }
  return <div className="modal-backdrop" onMouseDown={e => e.target === e.currentTarget && onClose()}>
    <section className="modal-card">
      <div className="modal-heading"><div><span className="eyebrow">PROJECT DETAILS</span><h2>{project ? 'Edit project' : 'Add a project'}</h2></div><button className="icon-btn" onClick={onClose} aria-label="Close"><X /></button></div>
      <form onSubmit={submit} className="project-form">
        <label>Project name<input name="name" required minLength="2" maxLength="120" value={form.name} onChange={change} placeholder="e.g. Green Bengaluru Initiative" /></label>
        <div className="form-row">
          <label>Project type<select name="type" value={form.type} onChange={change}>{types.map(x => <option key={x}>{x}</option>)}</select></label>
          <label>Status<select name="status" value={form.status} onChange={change}>{statuses.map(x => <option key={x}>{x}</option>)}</select></label>
        </div>
        <label>Location<input name="location" required value={form.location} onChange={change} placeholder="City, region" /></label>
        <div className="form-row">
          <label>Trees planted<input type="number" name="treesPlanted" min="0" value={form.treesPlanted} onChange={change} required /></label>
          <label>Target trees<input type="number" name="targetTrees" min="0" value={form.targetTrees} onChange={change} required /></label>
        </div>
        <div className="form-row">
          <label>Start date<input type="date" name="startDate" value={form.startDate} onChange={change} required /></label>
          <label>End date <span className="optional">(optional)</span><input type="date" name="endDate" value={form.endDate} onChange={change} /></label>
        </div>
        <label>Description<textarea name="description" rows="3" maxLength="1000" value={form.description} onChange={change} placeholder="A short summary of the project..." /></label>
        {error && <p className="form-error">{error}</p>}
        <div className="modal-actions"><button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button><button disabled={saving} className="btn btn-primary">{saving ? 'Saving…' : project ? 'Save changes' : 'Create project'}</button></div>
      </form>
    </section>
  </div>;
}
