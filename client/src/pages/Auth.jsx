import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Activity, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Auth({ mode }) {
  const isRegister = mode === 'register';
  const { login, register, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name:'', email:'', password:'' });
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const change = e => setForm({ ...form, [e.target.name]: e.target.value });
  const submit = async e => {
    e.preventDefault(); setError('');
    try {
      const data = isRegister ? await register(form) : await login({ email:form.email, password:form.password });
      navigate(data.hasTeam ? '/' : '/team/setup');
    } catch (err) { setError(err.response?.data?.message || 'Something went wrong. Please try again.'); }
  };
  return <div className="auth-page"><div className="auth-visual"><div className="auth-brand"><div className="brand-mark"><Activity/></div> ARENA<span>STATS</span></div><div className="visual-copy"><div className="eyebrow"><span className="live-dot"/> PERFORMANCE INTELLIGENCE</div><h1>Every match.<br/><em>Every detail.</em><br/>One advantage.</h1><p>Your team's performance, brought into focus. Track progress, find patterns, and turn every game into growth.</p><div className="visual-stats"><div><strong>01</strong><span>One team hub</span></div><div><strong>06</strong><span>Player slots</span></div><div><strong>∞</strong><span>Match insights</span></div></div></div><div className="visual-footer">BUILT FOR THE COMPETITIVE EDGE <span>© 2026 ARENA STATS</span></div></div>
    <div className="auth-form-side"><div className="auth-form-wrap"><div className="mobile-brand"><Activity/> ARENA STATS</div><div className="form-kicker">{isRegister?'GET STARTED':'WELCOME BACK'}</div><h2>{isRegister?'Create your account':'Sign in to Arena'}</h2><p className="muted">{isRegister?'Set up your manager account and start building your team.':'Your team dashboard is ready when you are.'}</p>
      <form onSubmit={submit} className="form-stack">{isRegister && <label>Manager name<input name="name" value={form.name} onChange={change} placeholder="e.g. Alex Morgan" required/></label>}<label>Email address<input type="email" name="email" value={form.email} onChange={change} placeholder="you@team.com" required/></label><label>Password<div className="password-wrap"><input type={show?'text':'password'} name="password" value={form.password} onChange={change} placeholder="At least 8 characters" minLength={8} required/><button type="button" onClick={()=>setShow(!show)}>{show?<EyeOff size={17}/>:<Eye size={17}/>}</button></div></label>{error && <div className="error-box">{error}</div>}<button className="primary-btn full" disabled={loading}>{loading?'Please wait…':isRegister?'Create account':'Sign in'} <ArrowRight size={17}/></button></form>
      <div className="auth-switch">{isRegister?'Already have an account?':'New to Arena Stats?'} <Link to={isRegister?'/login':'/register'}>{isRegister?'Sign in':'Create an account'}</Link></div><div className="secure-note"> <span/> Secure team management</div></div></div></div>;
}
