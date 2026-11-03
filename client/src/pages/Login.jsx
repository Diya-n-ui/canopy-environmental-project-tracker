import { useState } from 'react';
import { Leaf, Sprout, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState('admin@canopy.local');
  const [password, setPassword] = useState('CanopyDemo123!');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault(); setError(''); setBusy(true);
    try { await login(email, password); }
    catch (err) { setError(err.response?.data?.message || 'Could not sign in. Check your API and database.'); }
    finally { setBusy(false); }
  }
  return <div className="login-page">
    <div className="login-decoration"><div className="login-orb orb-one" /><div className="login-orb orb-two" /><div className="login-brand"><div className="brand-mark"><Leaf /></div><span>Canopy</span></div>
      <div className="login-copy"><span className="pill-label"><Sprout size={15} /> GROWING A GREENER FUTURE</span><h1>Small actions.<br /><em>Lasting impact.</em></h1><p>One workspace to track environmental projects, measure progress, and nurture a healthier planet.</p><div className="login-stat"><div className="stat-icon"><Leaf /></div><div><strong>Impact, made visible.</strong><span>Data that helps nature thrive.</span></div></div></div>
      <div className="login-deco-foot">ENVIRONMENTAL IMPACT PLATFORM</div>
    </div>
    <div className="login-panel"><form className="login-form" onSubmit={submit}><div className="mobile-login-brand"><div className="brand-mark"><Leaf /></div><strong>Canopy</strong></div><span className="eyebrow">WELCOME BACK</span><h2>Sign in to your workspace</h2><p className="login-sub">Enter your credentials to continue.</p>
      <label>Email address<input type="email" autoComplete="username" required value={email} onChange={e => setEmail(e.target.value)} /></label>
      <label>Password<input type="password" autoComplete="current-password" required value={password} onChange={e => setPassword(e.target.value)} /></label>
      {error && <p className="form-error">{error}</p>}
      <button className="btn btn-primary login-submit" disabled={busy}>{busy ? 'Signing in…' : <>Sign in <ArrowRight size={17} /></>}</button>
      <div className="demo-note"><strong>Demo credentials</strong><span>admin@canopy.local</span><span>CanopyDemo123!</span></div>
    </form><footer className="login-footer">Developed by <strong>Diya N</strong></footer></div>
  </div>;
}
