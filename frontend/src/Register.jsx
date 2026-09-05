import React, { useState } from 'react';

export default function Register({ nav, notify }) {
  const [show, setShow] = useState(false);
  const [accepted, setAccepted] = useState(true);
  const [loading, setLoading] = useState(false);
  const submit = (e) => {
    e.preventDefault();
    if (!accepted) return notify('Please accept the terms to continue');
    setLoading(true);
    setTimeout(() => { setLoading(false); notify('Workspace created — let’s build your AI Growth Agent'); nav('/onboarding'); }, 650);
  };
  return (
    <div className="auth-page register-auth">
      <div className="auth-showcase register-showcase">
        <div className="brand large"><div className="brand-logo">RP</div><div><b>RazorPayPilot</b><span>AI Revenue Operating System</span></div></div>
        <div className="auth-copy">
          <span className="eyebrow">Build your AI growth team</span>
          <h1>One workspace.<br/><em>Many AI agents.</em></h1>
          <p>Create a merchant workspace and configure Pilot to detect lost revenue, recover failed payments, optimize checkout and grow repeat purchases.</p>
          <div className="register-benefits">
            <div><span>✦</span><div><b>AI Opportunity Engine</b><small>Finds revenue leakage automatically.</small></div></div>
            <div><span>🛡</span><div><b>Policy-first autonomy</b><small>Every sensitive action is bounded.</small></div></div>
            <div><span>◔</span><div><b>Measurable impact</b><small>Track recovered revenue and AI ROI.</small></div></div>
          </div>
        </div>
        <div className="register-side-note"><span>TEST MODE</span><b>Safe buildathon environment</b><small>No real money is moved by this demo.</small></div>
      </div>
      <section className="card auth-card register-card">
        <div className="auth-header">
          <div className="mini-orb">✦</div>
          <h2>Create your AI workspace</h2>
          <p>Start your merchant growth journey.</p>
        </div>
        <form onSubmit={submit} className="auth-form">
          <label>
            Full name
            <input required placeholder="Your name" defaultValue="Charan Tej" />
          </label>
          <label>
            Work email
            <input required type="email" placeholder="you@company.com" defaultValue="merchant@charancommerce.in" />
          </label>
          <label>
            Business name
            <input required placeholder="Your business" defaultValue="Charan Commerce" />
          </label>
          <label>
            Password
            <div className="password-wrap">
              <input
                required
                minLength={8}
                type={show ? 'text' : 'password'}
                placeholder="Minimum 8 characters"
                defaultValue="password123"
              />
              <button type="button" className="password-toggle" onClick={() => setShow(!show)}>
                {show ? 'Hide' : 'Show'}
              </button>
            </div>
          </label>
          <label className="terms-row" htmlFor="terms-checkbox">
            <input
              type="checkbox"
              id="terms-checkbox"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
              className="terms-checkbox"
            />
            <span className="terms-text">
              I agree to the demo workspace <a href="#terms" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }} className="terms-link">Terms</a> and <a href="#privacy" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }} className="terms-link">Privacy Policy</a>.
            </span>
          </label>
          <button type="submit" className="btn auth-submit-btn" disabled={loading}>
            {loading ? 'Creating workspace…' : 'Create workspace →'}
          </button>
        </form>
        <p className="auth-footer-text">
          Already have an account? <button type="button" className="link" onClick={() => nav('/login')}>Log in</button>
        </p>
      </section>
    </div>
  );
}
