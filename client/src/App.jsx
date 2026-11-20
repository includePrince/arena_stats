import { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import api from './api';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Auth from './pages/Auth';
import TeamSetup from './pages/TeamSetup';
import Dashboard from './pages/Dashboard';
import Matches from './pages/Matches';
import MatchForm from './pages/MatchForm';
import Players from './pages/Players';

function Workspace() {
  const [team,setTeam]=useState(null);
  const [loading,setLoading]=useState(true);
  const {user}=useAuth();
  useEffect(()=>{api.get('/team').then(r=>{setTeam(r.data);}).finally(()=>setLoading(false));},[]);
  if(loading)return <div className="loading-screen">Preparing your workspace…</div>;
  if(!team)return <TeamSetup onSaved={setTeam}/>;
  return <Layout team={team}>
    <Routes>
      <Route path="/" element={<Dashboard team={team}/>}/>
      <Route path="/players" element={<Players/>}/>
      <Route path="/matches" element={<Matches/>}/>
      <Route path="/matches/new" element={<MatchForm team={team}/>}/>
      <Route path="/team" element={<TeamSetup existing={team} onSaved={setTeam}/>}/>
      <Route path="*" element={<Navigate to="/" replace/>}/>
    </Routes>
  </Layout>;
}

export default function App() {
  const {user}=useAuth();
  return <Routes>
    <Route path="/login" element={user?<Navigate to="/" replace/>:<Auth mode="login"/>}/>
    <Route path="/register" element={user?<Navigate to="/" replace/>:<Auth mode="register"/>}/>
    <Route element={<ProtectedRoute/>}><Route path="/*" element={<Workspace/>}/></Route>
    <Route path="*" element={<Navigate to={user?'/':'/login'} replace/>}/>
  </Routes>;
}
