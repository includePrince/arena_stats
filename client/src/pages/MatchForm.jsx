import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Crosshair, Save } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api';

export default function MatchForm({ team }) {
  const navigate = useNavigate();
  const [form,setForm] = useState({matchType:'Practice Scrim',map:'Erangel',totalTeams:25,position:1,kills:team?.players?.map(()=>0)||[]});
  const [error,setError] = useState('');
  const [saving,setSaving] = useState(false);
  const set = (key,value) => setForm(f=>({...f,[key]:value}));
  const submit = async e => { e.preventDefault();setError('');setSaving(true);try{await api.post('/matches',form);navigate('/matches');}catch(err){setError(err.response?.data?.message||'Could not save match.');}finally{setSaving(false);}};
  return <div className="form-page"><Link to="/matches" className="back-link"><ArrowLeft size={16}/> Back to match history</Link><div className="page-heading"><div className="eyebrow">MATCH ENTRY</div><h1>Record a match</h1><p className="muted">Add the result and enter kills in your current roster order.</p></div>
    <form className="panel match-form" onSubmit={submit}><div className="section-title"><div className="section-icon"><Crosshair/></div><div><h3>Match details</h3><p>Tell us how the match played out.</p></div></div>
      <div className="form-grid"><label>Match type *<input value={form.matchType} onChange={e=>set('matchType',e.target.value)} placeholder="e.g. 50K Tournament — Semi-final" required/></label><label>Map *<select value={form.map} onChange={e=>set('map',e.target.value)}>{['Erangel','Miramar','Sanhok','Vikendi','Livik','Rondo','Other'].map(m=><option key={m}>{m}</option>)}</select></label><label>Total teams *<input type="number" min="1" max="100" value={form.totalTeams} onChange={e=>set('totalTeams',Number(e.target.value))} required/></label><label>Team placement *<input type="number" min="1" max={form.totalTeams} value={form.position} onChange={e=>set('position',Number(e.target.value))} required/><small>1 = first place</small></label></div>
      <div className="roster-heading kill-heading"><div><h3>Player kills</h3><p className="muted">Enter each player's kills. Names are pre-filled from your team roster.</p></div><span className="count-pill">{team?.players?.length||0} PLAYERS</span></div>
      <div className="kill-list">{team?.players?.map((name,i)=><div className="kill-row" key={`${name}-${i}`}><div className="player-ident"><span className="player-number">{String(i+1).padStart(2,'0')}</span><strong>{name}</strong></div><label className="kill-input"><span>KILLS</span><input type="number" min="0" value={form.kills[i]??0} onChange={e=>set('kills',form.kills.map((v,index)=>index===i?Number(e.target.value):v))}/></label></div>)}</div>
      <div className="kill-total"><span>Total team kills</span><strong>{form.kills.reduce((s,k)=>s+Number(k||0),0)}</strong></div>
      {error&&<div className="error-box">{error}</div>}<div className="form-actions"><button type="button" className="secondary-btn" onClick={()=>navigate('/matches')}>Cancel</button><button className="primary-btn" disabled={saving}><Save size={16}/>{saving?'Saving match…':'Save match data'}</button></div>
    </form></div>;
}
