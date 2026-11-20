import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Trash2, Swords } from 'lucide-react';
import api from '../api';

export default function Matches() {
  const [matches,setMatches] = useState([]);
  const [error,setError] = useState('');
  const load = () => api.get('/matches').then(r=>setMatches(r.data)).catch(()=>setError('Could not load matches.'));
  useEffect(()=>{load();},[]);
  const remove = async id => { if(!window.confirm('Delete this match record?')) return; try { await api.delete(`/matches/${id}`); load(); } catch { setError('Could not delete match.'); } };
  return <div><div className="page-heading heading-row"><div><div className="eyebrow">MATCH ARCHIVE</div><h1>Match history</h1><p className="muted">Every result, saved in one place.</p></div><Link to="/matches/new" className="primary-btn"><Plus size={17}/> Add match</Link></div>
    {error&&<div className="error-box">{error}</div>}<section className="panel recent-panel"><div className="panel-heading"><div><h3>All recorded matches</h3><p className="muted">{matches.length} total records</p></div></div>
    {matches.length?<div className="table-wrap"><table><thead><tr><th>MATCH TYPE</th><th>MAP</th><th>TEAMS</th><th>PLACE</th><th>KILLS</th><th>DATE</th><th></th></tr></thead><tbody>{matches.map(m=><tr key={m._id}><td><strong>{m.matchType}</strong></td><td>{m.map}</td><td>{m.totalTeams}</td><td><span className={`placement ${m.position===1?'first':''}`}>#{m.position}</span></td><td>{m.players.reduce((s,p)=>s+p.kills,0)}</td><td>{new Date(m.createdAt).toLocaleDateString()}</td><td><button className="icon-btn danger" title="Delete match" onClick={()=>remove(m._id)}><Trash2 size={16}/></button></td></tr>)}</tbody></table></div>:<div className="empty-state"><div className="empty-icon"><Swords/></div><strong>Your match archive is empty</strong><p>Record a match to begin tracking performance.</p><Link to="/matches/new" className="text-btn"><Plus size={16}/> Add your first match</Link></div>}</section>
  </div>;
}
