import { useEffect, useState } from 'react';
import { Crosshair, Medal, Users, TrendingUp, Target, Activity } from 'lucide-react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  LineChart, Line, AreaChart, Area
} from 'recharts';
import api from '../api';
import PeriodTabs from '../components/PeriodTabs';

export default function Players() {
  const [period,setPeriod]=useState('all');
  const [players,setPlayers]=useState([]);
  const [selected,setSelected]=useState('');
  const [history,setHistory]=useState([]);
  const [loading,setLoading]=useState(true);
  const [historyLoading,setHistoryLoading]=useState(false);

  useEffect(()=>{
    setLoading(true);
    api.get(`/stats/players?period=${period}`)
      .then(r=>{
        const next=r.data.players;
        setPlayers(next);
        setSelected(current => next.some(p=>p.name===current) ? current : (next[0]?.name || ''));
      })
      .finally(()=>setLoading(false));
  },[period]);

  useEffect(()=>{
    if(!selected){setHistory([]);return;}
    setHistoryLoading(true);
    api.get(`/stats/player-history?period=${period}&player=${encodeURIComponent(selected)}`)
      .then(r=>setHistory(r.data.history))
      .catch(()=>setHistory([]))
      .finally(()=>setHistoryLoading(false));
  },[selected,period]);

  const max=Math.max(1,...players.map(p=>p.kills));
  const selectedPlayer=players.find(p=>p.name===selected);
  const chartPlayers=players.map(p=>({...p,shortName:p.name.length>12?`${p.name.slice(0,11)}…`:p.name}));

  return <div className="player-analytics-page">
    <div className="page-heading">
      <div className="eyebrow">ROSTER ANALYTICS</div>
      <h1>Player performance</h1>
      <p className="muted">Compare every player and follow individual performance match by match.</p>
    </div>

    <div className="toolbar-row">
      <div><h3>Player leaderboard</h3><p className="muted">Ranked by total kills</p></div>
      <PeriodTabs value={period} onChange={setPeriod}/>
    </div>

    {loading ? <div className="loading-state">Loading player statistics…</div> :
      players.length ? <>
        <div className="player-grid">{players.map((p,i)=><div className="panel player-card" key={p.name}>
          <div className="player-card-top">
            <div className="player-avatar">{p.name.slice(0,1).toUpperCase()}</div>
            <span className={`rank-badge rank-${i+1}`}>{i===0?<Medal size={14}/>: `#${i+1}`}</span>
          </div>
          <h3>{p.name}</h3><p className="muted">{p.matches} matches played</p>
          <div className="player-kill-number"><strong>{p.kills}</strong><span>total kills</span></div>
          <div className="progress-track"><span style={{width:`${p.kills/max*100}%`}}/></div>
          <div className="player-meta">
            <span><Crosshair size={14}/> {p.avgKills.toFixed(1)} avg / match</span>
            <span><TrendingUp size={14}/> {p.matches} games</span>
          </div>
          <button className={`player-focus-btn ${selected===p.name?'active':''}`} onClick={()=>setSelected(p.name)}>
            {selected===p.name?'Viewing performance':'View performance'}
          </button>
        </div>)}</div>

        <div className="player-charts-grid">
          <section className="panel chart-panel">
            <div className="panel-heading"><div><h3>Kill contribution</h3><p className="muted">Total kills by player · {period==='all'?'All time':period==='week'?'Last 7 days':period==='month'?'This month':'This year'}</p></div><span className="chart-tag"><Users size={14}/> COMPARISON</span></div>
            <div className="chart-area player-bar-area">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartPlayers} margin={{top:12,right:12,left:0,bottom:8}}>
                  <CartesianGrid stroke="#252b3b" vertical={false}/>
                  <XAxis dataKey="shortName" tick={{fill:'#aab3c6',fontSize:10}} axisLine={false} tickLine={false}/>
                  <YAxis tick={{fill:'#8992a8',fontSize:10}} axisLine={false} tickLine={false} allowDecimals={false}/>
                  <Tooltip contentStyle={{background:'#171d2c',border:'1px solid #30384c',borderRadius:12,color:'#fff'}} labelFormatter={(label)=>players.find(p=>p.name.startsWith(label.replace('…','')))?.name||label}/>
                  <Bar dataKey="kills" name="Total kills" fill="#8d7cff" radius={[6,6,0,0]} maxBarSize={52}/>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className="panel chart-panel">
            <div className="panel-heading"><div><h3>Average kills per match</h3><p className="muted">Consistency comparison across the roster</p></div><span className="chart-tag"><Activity size={14}/> EFFICIENCY</span></div>
            <div className="chart-area player-bar-area">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartPlayers} margin={{top:12,right:12,left:0,bottom:8}}>
                  <CartesianGrid stroke="#252b3b" vertical={false}/>
                  <XAxis dataKey="shortName" tick={{fill:'#aab3c6',fontSize:10}} axisLine={false} tickLine={false}/>
                  <YAxis tick={{fill:'#8992a8',fontSize:10}} axisLine={false} tickLine={false}/>
                  <Tooltip contentStyle={{background:'#171d2c',border:'1px solid #30384c',borderRadius:12,color:'#fff'}}/>
                  <Bar dataKey="avgKills" name="Average kills" fill="#45c7a2" radius={[6,6,0,0]} maxBarSize={52}/>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>
        </div>

        <section className="panel chart-panel individual-chart">
          <div className="panel-heading player-chart-heading">
            <div><h3>{selected || 'Player'} · match-by-match performance</h3><p className="muted">Kills earned in each recorded match</p></div>
            <div className="player-select-wrap"><label htmlFor="player-focus">SELECT PLAYER</label><select id="player-focus" value={selected} onChange={e=>setSelected(e.target.value)}>{players.map(p=><option key={p.name} value={p.name}>{p.name}</option>)}</select></div>
          </div>
          <div className="chart-area individual-line-area">
            {historyLoading ? <div className="empty-chart">Loading player match history…</div> :
              history.length ? <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={history} margin={{top:12,right:15,left:0,bottom:8}}>
                  <defs><linearGradient id="playerKillFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#45c7a2" stopOpacity={.32}/><stop offset="100%" stopColor="#45c7a2" stopOpacity={0}/></linearGradient></defs>
                  <CartesianGrid stroke="#252b3b" vertical={false}/>
                  <XAxis dataKey="match" tick={{fill:'#8992a8',fontSize:10}} axisLine={false} tickLine={false}/>
                  <YAxis tick={{fill:'#8992a8',fontSize:10}} axisLine={false} tickLine={false} allowDecimals={false}/>
                  <Tooltip contentStyle={{background:'#171d2c',border:'1px solid #30384c',borderRadius:12,color:'#fff'}} labelFormatter={label=>{const item=history.find(h=>h.match===label);return item?`${label} · ${item.matchType} · ${item.map}`:label;}}/>
                  <Area type="monotone" dataKey="kills" name="Kills" stroke="#54d0aa" strokeWidth={2.5} fill="url(#playerKillFill)" activeDot={{r:5}}/>
                </AreaChart>
              </ResponsiveContainer> : <div className="empty-chart">No match history for this player in the selected period.</div>}
          </div>
          {selectedPlayer && <div className="individual-summary">
            <div><span>TOTAL KILLS</span><strong>{selectedPlayer.kills}</strong></div>
            <div><span>AVERAGE / MATCH</span><strong>{selectedPlayer.avgKills.toFixed(1)}</strong></div>
            <div><span>MATCHES PLAYED</span><strong>{selectedPlayer.matches}</strong></div>
          </div>}
        </section>
      </> : <div className="panel empty-state"><div className="empty-icon"><Users/></div><strong>No player stats yet</strong><p>Record matches to build your player leaderboard and performance graphs.</p></div>}
  </div>;
}
