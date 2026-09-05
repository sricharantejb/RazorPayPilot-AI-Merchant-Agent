import React, {useEffect, useMemo, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {BrowserRouter, useLocation, useNavigate} from 'react-router-dom';
import './styles.css';
import {NAV, PAGE_META} from './lib/data';
import * as Pages from './pages.jsx';
import Landing from './Landing';
import Register from './Register';

const pageMap = {
  ...Object.fromEntries(Object.entries(Pages).map(([k,v])=>[k.toLowerCase(),v])),
  ...Object.fromEntries(Object.entries(Pages).map(([k,v])=>[k.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, ''), v])),
  missions: Pages.MissionCenter,
  'mission-center': Pages.MissionCenter,
  customers: Pages.Customers,
  'customer-360': Pages.Customer360,
  recovery: Pages.Recovery,
  'cart-agent': Pages.CartAgent,
  'customer-agent': Pages.CustomerAgent,
  'product-agent': Pages.ProductAgent,
  'ai-buyer': Pages.AIBuyer,
  'api-console': Pages.APIConsole,
};

function App(){
  const loc=useLocation(); const nav=useNavigate();
  const key=(loc.pathname.split('/')[1]||'landing').toLowerCase();
  const Page=key==='landing'?Landing:key==='register'?Register:key==='login'?(Pages.Login||Pages.Dashboard):key==='onboarding'?(Pages.Onboarding||Pages.Dashboard):(pageMap[key]||Pages.Dashboard);
  const [mode,setMode]=useState(()=>localStorage.getItem('rp_mode')||'Assisted');
  const [theme,setTheme]=useState(()=>localStorage.getItem('rp_theme')||'light');
  const [toast,setToast]=useState('');
  const [audit,setAudit]=useState(()=>JSON.parse(localStorage.getItem('rp_audit')||'[]'));
  const [collapsed,setCollapsed]=useState(false);
  const [pendingCount, setPendingCount] = useState(4);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const notify=(message)=>{setToast(message);window.clearTimeout(window.__rpToast);window.__rpToast=window.setTimeout(()=>setToast(''),3200)};
  const addAudit=(entry)=>setAudit(prev=>{const next=[{id:crypto.randomUUID?.()||String(Date.now()),time:new Date().toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'}),...entry},...prev].slice(0,80);localStorage.setItem('rp_audit',JSON.stringify(next));return next});
  useEffect(()=>localStorage.setItem('rp_mode',mode),[mode]);

  const handleLogout = () => {
    setShowLogoutConfirm(false);
    try {
      localStorage.removeItem('rp_session');
      localStorage.removeItem('rp_user');
    } catch {}
    notify('Logged out successfully');
    nav('/landing');
  };

  useEffect(() => {
    if (!showLogoutConfirm) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setShowLogoutConfirm(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showLogoutConfirm]);

  useEffect(() => {
    const fetchLive = () => {
      fetch(`${Pages.API}/api/realtime`)
        .then(r => r.json())
        .then(d => {
          if (d?.snapshot?.live?.approvals_pending !== undefined) {
            setPendingCount(d.snapshot.live.approvals_pending);
          }
        })
        .catch(() => {});
    };
    fetchLive();
    const id = setInterval(fetchLive, 5000);
    return () => clearInterval(id);
  }, []);

  useEffect(()=>{
    localStorage.setItem('rp_theme',theme);
    document.documentElement.setAttribute('data-theme',theme);
    if(theme==='dark'){
      document.body.classList.add('dark-theme');
      document.body.classList.remove('light-theme');
    } else {
      document.body.classList.add('light-theme');
      document.body.classList.remove('dark-theme');
    }
  },[theme]);

  const toastPopup = toast && (
    <div className="toast-popup" role="status" aria-live="polite">
      <div className="toast-icon">✓</div>
      <div className="toast-message">{toast}</div>
      <button type="button" className="toast-close" onClick={()=>setToast('')} aria-label="Close">×</button>
    </div>
  );

  if(key==='landing'||key==='login'||key==='register'||key==='onboarding') {
    return (
      <>
        <Page nav={nav} notify={notify} mode={mode} setMode={setMode} addAudit={addAudit} theme={theme} setTheme={setTheme}/>
        {toastPopup}
      </>
    );
  }

  return <div className={`app ${collapsed?'collapsed ':''}${theme==='dark'?'dark-theme theme-dark':'light-theme theme-light'}`}>
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-logo" title="RazorPayPilot">RP</div>
        <div className="brand-text"><b>RazorPayPilot</b><span>AI Revenue OS</span></div>
        <button className="collapse" onClick={()=>setCollapsed(!collapsed)} title={collapsed ? "Expand sidebar" : "Collapse sidebar"} aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}>
          {collapsed ? '▶' : '☰'}
        </button>
      </div>
      <div className="env" title="Razorpay Test Mode · Safe demo environment">
        <span>●</span>
        <div className="env-text"><b>Razorpay Test Mode</b><small>Safe demo environment</small></div>
      </div>
      <div className="side-scroll">
        {NAV.map(group=>(
          <div className="nav-group" key={group.title}>
            <small className="nav-title">{group.title}</small>
            {group.items.map(item=>(
              <button
                key={item.path}
                className={'nav-item '+(key===item.path?'active':'')}
                onClick={()=>nav('/'+item.path)}
                title={item.label}
                aria-label={item.label}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
                {item.badge && <em>{item.badge}</em>}
              </button>
            ))}
          </div>
        ))}
      </div>
      <button className="merchant-card" onClick={()=>nav('/settings')} title="Charan Commerce · Merchant Settings" aria-label="Charan Commerce settings">
        <span className="avatar">CC</span>
        <span className="merchant-info"><b>Charan Commerce</b><small>Merchant workspace</small></span>
        <span className="merchant-more">⋯</span>
      </button>
    </aside>
    <main className="main">
      <header className="topbar">
        <div>
          <div className="crumb">Merchant workspace / {PAGE_META[key]?.section||'Command Center'}</div>
          <h1>{PAGE_META[key]?.title||'Command Center'}</h1>
        </div>
        <div className="top-actions">
          <button className="search" onClick={()=>nav('/agent')} title="Open Pilot AI Assistant">
            ⌕ <span>Ask Pilot anything…</span><kbd>⌘ K</kbd>
          </button>
          <div className="theme-toggle-wrap">
            <button
              className={`theme-toggle-btn ${theme}`}
              onClick={()=>setTheme(t => t==='dark'?'light':'dark')}
              title={theme==='dark'?'Switch to Light Mode':'Switch to Dark Mode'}
              aria-label="Toggle light or dark theme"
            >
              <span className="theme-toggle-icon">{theme==='dark'?'☀️':'🌙'}</span>
              <span className="theme-toggle-text">{theme==='dark'?'Light':'Dark'}</span>
            </button>
          </div>
          <button className="bell" onClick={()=>nav('/notifications')} title={`${pendingCount} pending approvals / notifications`}>◔<i>{pendingCount}</i></button>
          <button className="mode-chip" onClick={()=>nav('/autonomous')}>AI <b>{mode}</b></button>
          <button 
            className="topbar-logout-btn" 
            onClick={()=>setShowLogoutConfirm(true)} 
            title="Logout" 
            aria-label="Logout"
          >
            <span className="logout-icon" aria-hidden="true">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
            </span>
            <span className="logout-text">Logout</span>
          </button>
          <span className="avatar big" title="Charan Tej · Logged in">CT</span>
        </div>
      </header>
      <div className="content"><Page nav={nav} notify={notify} mode={mode} setMode={setMode} addAudit={addAudit} audit={audit} theme={theme} setTheme={setTheme} onLogout={()=>setShowLogoutConfirm(true)}/></div>
    </main>
    {showLogoutConfirm && (
      <div 
        className="logout-modal-backdrop" 
        onClick={()=>setShowLogoutConfirm(false)}
        role="dialog"
        aria-modal="true"
        aria-labelledby="logout-dialog-title"
      >
        <div className="logout-modal" onClick={e => e.stopPropagation()}>
          <button 
            type="button" 
            className="logout-modal-close" 
            onClick={()=>setShowLogoutConfirm(false)} 
            aria-label="Close dialog"
          >
            ×
          </button>
          <div className="logout-modal-icon-wrap">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </div>
          <h3 id="logout-dialog-title">Do you want to logout?</h3>
          <p>Are you sure you want to end your current merchant session? You will be redirected to the landing page.</p>
          <div className="logout-modal-actions">
            <button 
              type="button" 
              className="logout-btn-cancel" 
              onClick={()=>setShowLogoutConfirm(false)}
            >
              Cancel
            </button>
            <button 
              type="button" 
              className="logout-btn-confirm" 
              onClick={handleLogout}
            >
              Yes, Logout
            </button>
          </div>
        </div>
      </div>
    )}
    {toastPopup}
  </div>
}
createRoot(document.getElementById('root')).render(<BrowserRouter><App/></BrowserRouter>);
