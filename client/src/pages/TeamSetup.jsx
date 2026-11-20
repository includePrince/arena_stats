import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Plus, Trash2, UploadCloud, ShieldCheck, LogOut } from 'lucide-react';
import api from '../api';

export default function TeamSetup({ existing, onSaved }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', ownerName: '', managerName: '', players: [''] });
  const [logo, setLogo] = useState(null);
  const [preview, setPreview] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const { logout } = useAuth();
  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };
  useEffect(() => { if (existing) { setForm({ name: existing.name, ownerName: existing.ownerName || '', managerName: existing.managerName || '', players: existing.players?.length ? existing.players : [''] }); if (existing.logo) setPreview(`http://localhost:5000${existing.logo}`); } }, [existing]);
  const setPlayer = (i, value) => setForm(f => ({ ...f, players: f.players.map((p, index) => index === i ? value : p) }));
  const save = async e => {
    e.preventDefault(); setError(''); setSaving(true);
    try {
      const payload = { ...form, players: form.players.map(p => p.trim()).filter(Boolean) };
      const { data } = existing ? await api.put('/team', payload) : await api.post('/team', payload);
      if (logo) { const fd = new FormData(); fd.append('logo', logo); const uploaded = await api.post('/team/logo', fd); onSaved(uploaded.data); }
      else onSaved(data);
      navigate('/');
    } catch (err) { setError(err.response?.data?.message || 'Could not save team details.'); }
    finally { setSaving(false); }
  };
  return <div className="setup-wrap" style={{
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    width: "100%",
    margin: "0 auto"
  }}><div className="page-heading"><div><div className="eyebrow">TEAM CONFIGURATION</div><h1>{existing ? 'Edit team profile' : 'Build your team'}</h1><p className="muted">Set up your roster and team identity. You can update these details anytime.</p></div></div>
    <form className="panel setup-panel" onSubmit={save}><div className="section-title"><div className="section-icon"><ShieldCheck /></div><div><h3>Team identity</h3><p>Give your squad a name and a recognizable look.</p></div></div>
      <div className="logo-upload"><div className="logo-preview">{preview ? <img src={preview} /> : <ShieldCheck size={30} />}</div><div><strong>Team logo</strong><p className="muted">PNG, JPG or WEBP · max 3 MB</p><label className="upload-btn"><UploadCloud size={16} /> Choose image<input type="file" accept="image/png,image/jpeg,image/webp" onChange={e => { const f = e.target.files?.[0]; if (f) { setLogo(f); setPreview(URL.createObjectURL(f)); } }} /></label></div></div>
      <div className="form-grid"><label>Team name *<input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Enter your team name" required /></label><label>Team owner<input value={form.ownerName} onChange={e => setForm({ ...form, ownerName: e.target.value })} placeholder="Owner full name" /></label><label>Team manager<input value={form.managerName} onChange={e => setForm({ ...form, managerName: e.target.value })} placeholder="Manager full name" /></label></div>
      <div className="roster-heading"><div><h3>Active roster</h3><p className="muted">Add up to 6 players. Match kill inputs will follow this order.</p></div><span className="count-pill">{form.players.filter(p => p.trim()).length} / 6 PLAYERS</span></div>
      <div className="roster-list">{form.players.map((player, i) => <div className="roster-input" key={i}><span className="player-number">{String(i + 1).padStart(2, '0')}</span><input value={player} onChange={e => setPlayer(i, e.target.value)} placeholder={`Player ${i + 1} name`} /><button type="button" className="icon-btn danger" onClick={() => setForm(f => ({ ...f, players: f.players.filter((_, idx) => idx !== i) }))} disabled={form.players.length === 1}><Trash2 size={16} /></button></div>)}</div>
      {form.players.length < 6 && <button type="button" className="text-btn" onClick={() => setForm(f => ({ ...f, players: [...f.players, ''] }))}><Plus size={16} /> Add player</button>}
      {error && <div className="error-box">{error}</div>}<div className="form-actions"><button type="button" className="secondary-btn" onClick={handleLogout}><LogOut size={16} />
        Logout</button><button className="primary-btn" disabled={saving}>{saving ? 'Saving…' : existing ? 'Save changes' : 'Create team'}</button></div>
    </form></div>;
}
