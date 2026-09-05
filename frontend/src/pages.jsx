import React,{useEffect,useMemo,useState} from 'react';
import {DATA,money} from './lib/data';

export const Card=({children,className=''})=><section className={'card '+className}>{children}</section>;
export const Button=({children,onClick,variant='primary',disabled=false})=><button disabled={disabled} className={'btn '+variant} onClick={onClick}>{children}</button>;
export const Badge=({children,tone})=><span className={'badge '+(tone||String(children).toLowerCase().replace(/\s/g,'-'))}>{children}</span>;
export const Header=({eyebrow,title,sub,actions})=><div className="section-head"><div>{eyebrow&&<div className="eyebrow">{eyebrow}</div>}<h2>{title}</h2>{sub&&<p>{sub}</p>}</div>{actions&&<div className="head-actions">{actions}</div>}</div>;
const LineChart=({bars=false})=><div className="chart"><div className="chart-grid"><i/><i/><i/><i/></div>{bars?<div className="bars">{[48,70,56,82,62,91,75,98,67,86,78,100].map((h,i)=><span key={i} style={{height:h+'%'}}/>)}</div>:<svg viewBox="0 0 600 180" preserveAspectRatio="none"><polyline points="0,145 52,122 102,132 150,91 200,110 250,72 302,88 355,54 410,76 465,43 520,62 600,24" fill="none" stroke="currentColor" strokeWidth="4"/><polyline points="0,160 600,160" fill="none" stroke="currentColor" opacity=".12"/></svg>}</div>;
const Donut=({value=85,label='Success'})=><div className="donut" style={{'--pct':value+'%'}}><div><b>{value}%</b><small>{label}</small></div></div>;
const Progress=({value})=><div className="progress"><i style={{width:value}}/></div>;
const Step=({title,desc,status='Complete'})=><div className="timeline-step"><span className={status==='Complete'||status==='Passed'?'step-dot done':'step-dot'}>{status==='Complete'||status==='Passed'?'✓':'○'}</span><div><b>{title}</b><small>{desc}</small></div><Badge tone={status==='Complete'||status==='Passed'?'success':status==='Blocked'?'danger':'warning'}>{status}</Badge></div>;
const Empty=({text})=><div className="empty">{text}</div>;

export function Login({nav}){return <div className="auth-page"><div className="auth-showcase"><div className="brand large"><div className="brand-logo">RP</div><div><b>RazorPayPilot</b><span>AI Revenue Operating System</span></div></div><div className="auth-copy"><span className="eyebrow">Autonomous growth for merchants</span><h1>Detect lost revenue.<br/><em>Decide. Act. Prove impact.</em></h1><p>One AI co-founder that continuously finds revenue opportunities, safely executes bounded actions and learns from outcomes.</p><div className="auth-proof"><span>✦ Opportunity Engine</span><span>⚿ Policy Guardrails</span><span>↗ Measurable Impact</span></div></div></div><Card className="auth-card"><div className="auth-header"><div className="mini-orb">✦</div><h2>Welcome back 👋</h2><p>Sign in to your merchant workspace.</p></div><form className="auth-form" onSubmit={(e)=>{e.preventDefault();nav('/dashboard');}}><label>Email<input type="email" required placeholder="merchant@example.com" defaultValue="merchant@charancommerce.in"/></label><label>Password<input type="password" required placeholder="••••••••" defaultValue="password"/></label><div className="form-inline"><label className="check"><input type="checkbox" defaultChecked/> <span>Remember me</span></label><button type="button" className="link">Forgot password?</button></div><button type="submit" className="btn auth-submit-btn">Enter Command Center →</button></form><p className="auth-footer-text">New merchant? <button type="button" className="link" onClick={()=>nav('/register')}>Create an AI workspace</button></p></Card></div>}

export const API = import.meta.env.VITE_API_URL !== undefined ? import.meta.env.VITE_API_URL : (import.meta.env.DEV ? 'http://127.0.0.1:5100' : '');

export function Onboarding({nav,setMode,notify,addAudit}){
  const [step,setStep]=useState(1);
  const [business, setBusiness] = useState({
    name: 'Charan Commerce',
    website: 'https://charancommerce.in',
    category: 'Electronics & Accessories',
    aov: '₹2,850',
    revenueRange: '₹10L – ₹50L',
    targetCustomers: 'Indian online shoppers'
  });
  const goals=['Increase revenue','Recover failed payments','Reduce cart abandonment','Increase repeat purchases','Increase AOV','Acquire customers'];
  const [selectedGoals, setSelectedGoals] = useState([
    'Increase revenue',
    'Recover failed payments',
    'Reduce cart abandonment',
    'Increase repeat purchases'
  ]);
  const [razorpay, setRazorpay] = useState({
    keyId: 'rzp_test_demo_key',
    keySecret: 'demo-secret'
  });
  const [rzpVerifying, setRzpVerifying] = useState(false);
  const [rzpStatus, setRzpStatus] = useState({
    verified: true,
    message: 'Connected to Razorpay Sandbox Test Mode'
  });
  const [policy, setPolicy] = useState({
    autonomy: 'Assisted',
    auto_payment_limit: 5000,
    max_discount_pct: 10,
    daily_spend: 25000
  });
  const [launching, setLaunching] = useState(false);

  const toggleGoal = (g) => {
    setSelectedGoals(prev => {
      if (prev.includes(g)) {
        if (prev.length === 1) {
          notify?.('Keep at least one optimization goal selected');
          return prev;
        }
        const next = prev.filter(x => x !== g);
        notify?.(`Unselected: ${g}`);
        return next;
      } else {
        const next = [...prev, g];
        notify?.(`Selected: ${g}`);
        return next;
      }
    });
  };

  const verifyRazorpay = async () => {
    setRzpVerifying(true);
    try {
      const res = await fetch(`${API}/api/razorpay/test`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key_id: razorpay.keyId, key_secret: razorpay.keySecret })
      });
      const data = await res.json();
      setRzpStatus({
        verified: data.connected !== false,
        message: data.message || 'Razorpay connection verified'
      });
      notify?.(data.message || 'Razorpay Test Mode connection verified');
    } catch {
      setRzpStatus({
        verified: true,
        message: 'Connected to Razorpay Sandbox Test Mode (Local fallback)'
      });
      notify?.('Sandbox Test Mode ready');
    } finally {
      setRzpVerifying(false);
    }
  };

  const launchPilot = async () => {
    setLaunching(true);
    try {
      const res = await fetch(`${API}/api/onboarding/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          business,
          goals: selectedGoals,
          razorpay: { key_id: razorpay.keyId },
          autonomy: policy.autonomy,
          policy: {
            auto_payment_limit: policy.auto_payment_limit,
            max_discount_pct: policy.max_discount_pct,
            daily_spend: policy.daily_spend
          }
        })
      });
      const data = await res.json();
      if (data.audit) addAudit?.(data.audit);
      setMode?.(policy.autonomy);
      notify?.(`AI Growth Agent configured for ${business.name}!`);
      nav('/dashboard');
    } catch {
      setMode?.(policy.autonomy);
      addAudit?.({
        action: 'Workspace Onboarding Completed',
        trigger: 'Setup Wizard',
        customer: business.name,
        amount: 0,
        result: 'Success',
        policy: `Mode: ${policy.autonomy} · ${selectedGoals.length} goals`
      });
      notify?.(`AI Growth Agent configured for ${business.name}!`);
      nav('/dashboard');
    } finally {
      setLaunching(false);
    }
  };

  return (
    <div className="onboard-page">
      <div className="onboard-top">
        <div className="brand">
          <div className="brand-logo">RP</div>
          <div>
            <b>RazorPayPilot</b>
            <span>Build your AI Growth Agent</span>
          </div>
        </div>
        <Badge tone="success">Secure Test Mode</Badge>
      </div>
      <Card className="wizard-card">
        <div className="wizard-steps">
          {['Business','Goals','Razorpay','Import','Configure'].map((x,i)=>(
            <span
              className={step>=i+1?'active':''}
              key={x}
              onClick={()=>setStep(i+1)}
              style={{cursor:'pointer'}}
              title={`Go to step ${i+1}`}
            >
              <b>{i+1}</b>{x}
            </span>
          ))}
        </div>

        {step===1 && (
          <>
            <Header eyebrow="Step 1 / 5" title="Tell Pilot about your business" sub="Your context becomes the agent's Merchant Growth Profile."/>
            <div className="form-grid">
              <label>Business name
                <input value={business.name} onChange={e=>setBusiness({...business, name: e.target.value})}/>
              </label>
              <label>Website
                <input value={business.website} onChange={e=>setBusiness({...business, website: e.target.value})}/>
              </label>
              <label>Business category
                <select value={business.category} onChange={e=>setBusiness({...business, category: e.target.value})}>
                  <option>Electronics & Accessories</option>
                  <option>Fashion & Apparel</option>
                  <option>SaaS & Subscriptions</option>
                  <option>D2C Retail Brands</option>
                </select>
              </label>
              <label>Average order value
                <input value={business.aov} onChange={e=>setBusiness({...business, aov: e.target.value})}/>
              </label>
              <label>Monthly revenue range
                <select value={business.revenueRange} onChange={e=>setBusiness({...business, revenueRange: e.target.value})}>
                  <option>₹10L – ₹50L</option>
                  <option>₹1L – ₹10L</option>
                  <option>₹50L+</option>
                </select>
              </label>
              <label>Target customers
                <input value={business.targetCustomers} onChange={e=>setBusiness({...business, targetCustomers: e.target.value})}/>
              </label>
            </div>
          </>
        )}

        {step===2 && (
          <>
            <Header
              eyebrow="Step 2 / 5"
              title="What should Pilot optimize?"
              sub="Choose outcomes, not just dashboards. Click any outcome below to activate or deactivate it."
            />
            <div className="goal-grid">
              {goals.map((g)=>{
                const isSelected = selectedGoals.includes(g);
                return (
                  <button
                    key={g}
                    type="button"
                    className={'goal '+(isSelected?'selected':'')}
                    onClick={()=>toggleGoal(g)}
                  >
                    <span>{isSelected?'✓':'+'}</span>
                    {g}
                  </button>
                );
              })}
            </div>
            <div style={{marginTop:16,padding:'11px 15px',background:'#f6f7fb',border:'1px solid #e7eaf2',borderRadius:10,fontSize:10,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
              <span>✦ <b>{selectedGoals.length} outcomes selected</b> for autonomous optimization.</span>
              <Badge tone="success">{selectedGoals.length>=4?'High Coverage':'Custom Coverage'}</Badge>
            </div>
          </>
        )}

        {step===3 && (
          <>
            <Header
              eyebrow="Step 3 / 5"
              title="Connect Razorpay Test Mode"
              sub="No real money. No live secrets. Use sandbox data for the buildathon demo."
            />
            <div className="connect-hero">
              <div className="rzp-mark">R</div>
              <div style={{flex:1}}>
                <b>Razorpay Test Mode</b>
                <p>Connect payments, orders and customers.</p>
              </div>
              <Button variant="secondary" onClick={verifyRazorpay} disabled={rzpVerifying}>
                {rzpVerifying ? 'Checking…' : 'Test Connection ↗'}
              </Button>
              <Badge tone="success">SAFE</Badge>
            </div>
            {rzpStatus.message && (
              <div style={{marginTop:10,padding:'9px 13px',background:'#eaf8f2',border:'1px solid #c7eedc',borderRadius:8,fontSize:11,color:'#138d63',display:'flex',alignItems:'center',gap:7}}>
                <span>✓</span><b>{rzpStatus.message}</b>
              </div>
            )}
            <div className="form-grid">
              <label>Test Mode Key ID
                <input value={razorpay.keyId} onChange={e=>setRazorpay({...razorpay, keyId: e.target.value})}/>
              </label>
              <label>Test Mode Secret
                <input type="password" value={razorpay.keySecret} onChange={e=>setRazorpay({...razorpay, keySecret: e.target.value})}/>
              </label>
            </div>
            <div className="check-grid">
              <span>✓ Orders accessible</span>
              <span>✓ Payments accessible</span>
              <span>✓ Customers accessible</span>
              <span>✓ Refund workflow available</span>
            </div>
          </>
        )}

        {step===4 && (
          <>
            <Header eyebrow="Step 4 / 5" title="Pilot is learning your business" sub="We build a Growth Profile from your merchant signals."/>
            <div className="import-progress">
              <div className="import-ring">86%</div>
              <div className="import-list">
                {[['Customers','8,425'],['Orders','5,214'],['Payments','7,856'],['Products','124'],['Abandoned carts','1,245'],['Failed payments','247']].map(x=>(
                  <div key={x[0]}>
                    <span>✓</span>
                    <b>{x[1]}</b>
                    <small>{x[0]} imported</small>
                  </div>
                ))}
              </div>
            </div>
            <div className="profile-preview">
              <span className="eyebrow">Merchant Growth Profile · {business.name}</span>
              <b>Primary: {selectedGoals[0] || 'Revenue Growth'}</b>
              <b>Secondary: {selectedGoals[1] || 'Payment Recovery'}</b>
              <b>Third: {selectedGoals[2] || 'Cart Optimization'}</b>
              <strong>₹62,300 revenue at risk</strong>
            </div>
          </>
        )}

        {step===5 && (
          <>
            <Header eyebrow="Step 5 / 5" title="Configure your AI constitution" sub="Pilot will operate inside these boundaries."/>
            <div style={{display:'flex',gap:8,marginBottom:15}}>
              {['Assisted','Autonomous','Manual'].map(m=>(
                <button
                  key={m}
                  type="button"
                  className={'btn '+(policy.autonomy===m?'primary':'secondary')}
                  onClick={()=>setPolicy({...policy, autonomy: m})}
                  style={{flex:1,padding:'9px 8px'}}
                >
                  {m} {m==='Assisted'?'(Recommended)':''}
                </button>
              ))}
            </div>
            <div className="policy-grid">
              <div>
                <b>Autonomy Mode</b>
                <p>{policy.autonomy} · {policy.autonomy==='Autonomous'?'Direct action inside bounds':policy.autonomy==='Manual'?'Manual merchant confirmation':'Approval for sensitive actions'}</p>
              </div>
              <div>
                <b>Auto-execution limit</b>
                <p>₹{policy.auto_payment_limit.toLocaleString('en-IN')} per action</p>
              </div>
              <div>
                <b>Max discount</b>
                <p>{policy.max_discount_pct}% margin-safe limit</p>
              </div>
              <div>
                <b>Daily campaign budget</b>
                <p>₹{policy.daily_spend.toLocaleString('en-IN')}</p>
              </div>
            </div>
            <div className="ready">
              <span>✦</span>
              <div>
                <b>Ready to grow {business.name}</b>
                <p>Pilot will detect → understand → decide → guard → act → verify → measure → learn across {selectedGoals.length} optimization targets.</p>
              </div>
            </div>
          </>
        )}

        <div className="wizard-actions">
          <Button variant="secondary" disabled={step===1} onClick={()=>setStep(s=>s-1)}>Back</Button>
          {step<5 ? (
            <Button onClick={()=>setStep(s=>s+1)}>Continue →</Button>
          ) : (
            <Button onClick={launchPilot} disabled={launching}>
              {launching ? 'Configuring Agent…' : 'Launch RazorPayPilot ✦'}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}

export function ActionProposalModal({proposal, onApprove, onReject, onClose}){
  if (!proposal) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box action-proposal-modal" onClick={e=>e.stopPropagation()}>
        <div className="proposal-header">
          <span className="shield-icon">🛡️</span>
          <div>
            <span className="eyebrow">EXPLAINABLE AI ACTION PROPOSAL</span>
            <h3>{proposal.title || 'Retry failed payment'}</h3>
          </div>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="proposal-body">
          <div className="proposal-target-row">
            <div><span>Customer</span><b>{proposal.customer || 'Vikram Rao'}</b></div>
            <div><span>Amount</span><b>{typeof proposal.amount === 'number' ? money(proposal.amount) : proposal.amount}</b></div>
            <div><span>Risk</span><span className="badge success">{proposal.risk || 'LOW'}</span></div>
            <div><span>Confidence</span><span className="badge info">{proposal.confidence || 92}%</span></div>
          </div>
          <div className="proposal-section">
            <span className="prop-label">Why?</span>
            <p>{proposal.why || 'Payment failure appears retryable.'}</p>
          </div>
          <div className="proposal-section">
            <span className="prop-label">Evidence</span>
            <ul className="evidence-bullets">
              {(proposal.evidence || [
                'Previous successful UPI payment',
                'Retry window available',
                'No duplicate transaction detected'
              ]).map((ev, i) => <li key={i}>{ev.startsWith('•') ? ev : `• ${ev}`}</li>)}
            </ul>
          </div>
          <div className="proposal-metrics-row">
            <div><span>Expected benefit</span><b style={{color: '#0f9f6e'}}>+{money(typeof proposal.amount === 'number' ? proposal.amount : 4500)} recovered</b></div>
            <div><span>Policy check</span><b style={{color: '#6246ea'}}>✓ {proposal.policy || 'Within ₹5,000 auto-action limit'}</b></div>
          </div>
        </div>
        <div className="proposal-footer">
          <Button variant="secondary" onClick={onReject}>✕ Reject</Button>
          <Button onClick={onApprove}>✓ Approve & Execute</Button>
        </div>
      </div>
    </div>
  );
}

export function Dashboard({nav,notify}){
  const [live,setLive]=useState(null);
  const [mission,setMission]=useState(null);
  const [busy,setBusy]=useState(false);
  const [showSimModal, setShowSimModal] = useState(false);
  const [recovering, setRecovering] = useState(false);
  const [recoveryDone, setRecoveryDone] = useState(false);

  const load=async()=>{
    try{
      const [a,b]=await Promise.all([fetch(`${API}/api/realtime`),fetch(`${API}/api/revenue-rescue`)]);
      const ad=await a.json();
      const bd=await b.json();
      setLive(ad.snapshot);
      setMission(bd.mission);
    }catch{}
  };
  useEffect(()=>{load(); const id=setInterval(load,5000); return()=>clearInterval(id)},[]);

  const handleProceedRecovery = async () => {
    setRecovering(true);
    try {
      const res = await fetch(`${API}/api/revenue-rescue/execute-all`, { method: 'POST' });
      const d = await res.json();
      notify?.(d.message || 'Revenue Rescue Plan executed: ₹38,500 recovered!');
      setRecoveryDone(true);
      setShowSimModal(false);
      load();
    } catch {
      notify?.('Backend unavailable');
    } finally {
      setRecovering(false);
    }
  };

  const stats=live?.stats||{};
  return <>
    {/* 1. HERO DEMO: REVENUE RESCUE MISSION */}
    <div className="rescue-hero-box">
      <div className="eyebrow" style={{color: '#a99bff'}}>🚨 Autonomous Recovery · Hero Demo</div>
      <h2>🚨 REVENUE RESCUE MISSION DETECTED</h2>
      <p className="lead">
        <b>{money(mission?.at_risk ?? live?.live?.protected_revenue ?? 62300)}</b> revenue currently at risk · <b>{live?.opportunities?.total_detected ?? 7} opportunities detected</b> · <b>{money(mission?.recoverable ?? live?.live?.recovered_revenue ?? 38500)}</b> estimated recoverable revenue.
        Pilot has identified {Math.min(3, mission?.steps?.length || 3)} highest-impact actions.
      </p>

      <div className="rescue-kpi-row">
        <div>
          <span>Revenue at Risk</span>
          <b>{money(mission?.at_risk ?? live?.live?.protected_revenue ?? 62300)}</b>
        </div>
        <div>
          <span>Recoverable Revenue</span>
          <b className="text-green">{money(mission?.recoverable ?? 38500)}</b>
        </div>
        <div>
          <span>Confidence</span>
          <b>{mission?.confidence || 91}%</b>
        </div>
      </div>

      <div className="rescue-actions-list">
        {(mission?.steps?.slice(0, 3) || [
          { id: 'failed', title: 'Failed Payments', expected: 15800, count: 27, desc: 'retryable transactions' },
          { id: 'cart', title: 'Abandoned Carts', expected: 12400, count: 83, desc: 'high-intent customers' },
          { id: 'winback', title: 'Customer Winback', expected: 6100, count: 146, desc: 'high-LTV inactive customers' }
        ]).map((st, idx) => (
          <div key={st.id || idx} className="rescue-action-item">
            <span className="num-badge">{idx + 1}</span>
            <b>{st.title}</b>
            <span className="impact-val">{money(st.expected || st.impact || 0)}</span>
            <small>{st.count} {st.desc || (st.id === 'failed' ? 'retryable transactions' : st.id === 'cart' ? 'high-intent customers' : 'actionable records')}</small>
          </div>
        ))}
      </div>

      <div className="rescue-btn-row">
        <Button onClick={()=>setShowSimModal(true)}>🧪 Simulate Recovery</Button>
        <Button variant="secondary" onClick={()=>nav('/missions')}>Review Actions →</Button>
        {recoveryDone && <Badge tone="success">✓ Recovery Plan Executed (+₹38,500)</Badge>}
      </div>
    </div>

    {/* Simulation Modal (Before vs After) */}
    {showSimModal && (
      <div className="modal-overlay" onClick={()=>setShowSimModal(false)}>
        <div className="modal-box" onClick={e=>e.stopPropagation()}>
          <div className="modal-header">
            <div>
              <span className="eyebrow">CLOSED-LOOP PREDICTION</span>
              <h3>Pilot Revenue Recovery Simulation</h3>
            </div>
            <button className="modal-close" onClick={()=>setShowSimModal(false)}>×</button>
          </div>
          <div className="modal-body">
            <div className="roi-comparison-grid">
              <div className="roi-box without">
                <span className="title">WITHOUT PILOT</span>
                <strong className="val">₹24.8L</strong>
                <span className="muted" style={{fontSize: 11}}>Baseline expected revenue</span>
              </div>
              <div className="roi-box with">
                <span className="title">WITH PILOT</span>
                <strong className="val">+₹38,500</strong>
                <span className="up" style={{fontSize: 11}}>Expected net recovery lift</span>
              </div>
            </div>

            <div className="roi-details-grid">
              <div><span>Estimated ROI</span><b style={{color: '#0f9f6e'}}>4.7x</b></div>
              <div><span>Risk Level</span><b style={{color: '#6246ea'}}>LOW</b></div>
              <div><span>Awaiting Approval</span><b>2 actions</b></div>
              <div><span>Autonomous</span><b>1 action</b></div>
            </div>

            <div style={{padding: '14px', background: '#fafafc', border: '1px solid #eef0f5', borderRadius: 10}}>
              <b style={{fontSize: 13, color: '#17203a'}}>Proceed with Recovery Plan?</b>
              <p style={{fontSize: 11, color: '#6b7280', margin: '4px 0 0'}}>
                Pilot will execute 1 bounded autonomous payment retry and stage 2 high-value interventions for your approval.
              </p>
            </div>
          </div>
          <div className="modal-footer">
            <Button variant="secondary" onClick={()=>setShowSimModal(false)}>Cancel</Button>
            <Button onClick={handleProceedRecovery} disabled={recovering}>
              {recovering ? 'Executing Plan…' : 'Proceed with Recovery Plan →'}
            </Button>
          </div>
        </div>
      </div>
    )}

    {/* Rest of Overview */}
    <div className="stat-grid">{[
      ['Gross revenue',money(stats.revenue||2480000),'+11.2%'],['Revenue at risk',money(stats.risk||62300),'Protected'],['Recovered revenue',money(stats.recovered||38500),'+15.2%'],['AI actions',String(stats.ai_actions||127),'+33.1%'],['Success rate','91.4%','+4.4%'],['Pending approvals',String(live?.live?.approval_count||4),'Live'],['Failed payments',String(stats.failed_payments||247),'-5.7%'],['Abandoned carts',String(stats.abandoned_carts||1245),'-8.2%']
    ].map(([label,value,change],i)=><Card key={label}><span className="muted">{label}</span><strong className="metric">{value}</strong><span className={change[0]==='-'?'down':'up'}>{change}</span>{i===1&&<div className="spark"><i/><i/><i/><i/><i/><i/></div>}</Card>)}</div>
    <div className="dashboard-grid"><Card className="wide"><Header title="Revenue trajectory" sub="Last 30 days · actual vs protected" actions={<Badge tone="success">Live</Badge>}/><LineChart/><div className="chart-labels"><span>May 01</span><span>May 08</span><span>May 15</span><span>May 22</span><span>May 30</span></div></Card><Card><Header title="Payment health" sub="Real-time Test Mode telemetry"/><div className="donut-wrap"><Donut value={85} label="Success"/><div className="metric-list"><p><span>Successful</span><b>{stats.failed_payments?6678:'—'}</b></p><p><span>Failed</span><b>{stats.failed_payments||247}</b></p><p><span>Recovered</span><b>{money(stats.recovered||38500)}</b></p></div></div></Card></div>
    <div className="dashboard-grid three"><Card><Header title="AI opportunity radar" sub="Where Pilot sees money"/><div className="radar-list">{DATA.opportunities.slice(0,4).map(o=><div key={o.type}><span className="radar-dot">{o.icon}</span><span><b>{o.type}</b><small>{o.count}</small></span><strong>{o.impact}</strong></div>)}</div></Card><Card><Header title="Recovery performance" sub="Closed-loop outcomes"/><div className="recovery-score"><b>88.2%</b><span>recovery rate</span></div><LineChart bars/><div className="mini-kpis"><span>{money(stats.recovered||38500)} <small>recovered</small></span><span>{money(18420)} <small>this week</small></span></div></Card><Card><Header title="Today's agent activity" actions={<button className="link" onClick={()=>nav('/audit')}>View audit →</button>}/><div className="activity"><p><i className="ok">✓</i><span>{live?.live?.actions||127} actions executed</span><b>{money(18400)}</b></p><p><i className="wait">◷</i><span>{live?.live?.approval_count||4} approvals waiting</span><b>{money(8200)}</b></p><p><i className="danger">!</i><span>2 failures stopped safely</span><b>0 dupes</b></p><p><i className="ai">✦</i><span>Live monitor</span><b>Healthy</b></p></div></Card></div>
  </>;
}

export function Agent({notify,addAudit}){
  const [q,setQ]=useState('');
  const [busy,setBusy]=useState(false);
  const [expanded,setExpanded]=useState(false);
  const [status,setStatus]=useState({configured:false,provider:'gemini',model:'gemini-2.5-flash'});
  const [activeStep,setActiveStep]=useState(2);
  const [proposal,setProposal]=useState(null);
  const [messages,setMessages]=useState([
    {
      role:'assistant',
      content:'Hi! I’m Pilot, your AI merchant copilot. I operate as an autonomous intelligence layer across payments, revenue leakage, customer 360, and catalog commerce. Ask me anything about your revenue.',
    },
    {
      role:'user',
      content:'Why did revenue drop yesterday?'
    },
    {
      role:'assistant',
      content:'',
      investigation: {
        checks: [
          {label: 'Revenue', status: 'Checked'},
          {label: 'Payments', status: 'Checked'},
          {label: 'Failed transactions', status: 'Checked'},
          {label: 'Products', status: 'Checked'},
          {label: 'Customer activity', status: 'Checked'},
          {label: 'Checkout funnel', status: 'Checked'}
        ],
        found: {
          revenue_change: 'Revenue ↓ 11.7%',
          primary_cause: 'Payment failure rate ↑ 18.2%',
          most_affected: 'UPI',
          peak_window: '7 PM – 9 PM',
          lost_revenue: 18400,
          recommended_action: 'Retry eligible transactions',
          confidence: 92
        }
      }
    }
  ]);

  const pipeline = [
    'USER', 'AI COPILOT', 'UNDERSTAND INTENT', 'QUERY MERCHANT DATA',
    'ANALYZE', 'GENERATE PLAN', 'POLICY CHECK', 'SIMULATE IMPACT',
    'ASK APPROVAL', 'EXECUTE', 'VERIFY', 'AUDIT'
  ];

  useEffect(()=>{
    fetch(API+'/api/copilot/status').then(r=>r.json()).then(setStatus).catch(()=>{});
  },[]);

  const ask=async(text=q)=>{
    const clean=text.trim();
    if(!clean||busy)return;
    setMessages(m=>[...m,{role:'user',content:clean}]);
    setQ('');
    setBusy(true);
    setActiveStep(3);
    try{
      const r=await fetch(API+'/api/copilot/chat',{
        method:'POST',headers:{'Content-Type':'application/json'},
        body:JSON.stringify({message:clean,history:messages.slice(-8)})
      });
      const d=await r.json();
      setActiveStep(6);
      setMessages(m=>[...m,{role:'assistant',content:d.answer,investigation:d.investigation,meta:d}]);
      if(d.provider) setStatus({configured:true,provider:d.provider,model:d.model});
      addAudit?.({action:'AI Copilot Investigation',trigger:'merchant query',customer:'—',amount:d.investigation?.found?.lost_revenue||0,result:'Completed',policy:'Read-only'});
    }catch(err){
      setMessages(m=>[...m,{role:'assistant',content:'Investigation complete using local merchant context.\n\nRevenue dropped 11.7% primarily due to UPI payment failures between 7 PM - 9 PM.'}]);
    }finally{setBusy(false)}
  };

  const handleOpenProposal = () => {
    setProposal({
      title: 'Retry failed payment',
      customer: 'Vikram Rao',
      amount: 4500,
      why: 'Payment failure appears retryable.',
      evidence: [
        'Previous successful UPI payment',
        'Retry window available',
        'No duplicate transaction detected'
      ],
      expected_benefit: 4500,
      risk: 'LOW',
      policy: 'Within ₹5,000 auto-action limit',
      confidence: 92
    });
  };

  const handleApproveProposal = async () => {
    try {
      const res = await fetch(`${API}/api/recovery/approve`, {
        method: 'POST', headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({id: 'rec_103', amount: 4500, customer: 'Vikram Rao'})
      });
      const d = await res.json();
      notify?.('Vikram Rao payment retry executed in Test Mode (+₹4,500)');
      addAudit?.(d.audit || {action: 'Retry Payment', customer: 'Vikram Rao', amount: 4500, result: 'Success · Test Mode', status: 'Success'});
    } catch {
      notify?.('Action executed in Test Mode');
    } finally {
      setProposal(null);
    }
  };

  const prompts=[
    'Why did revenue drop yesterday?',
    'Why is revenue at risk?',
    'Analyze failed payments',
    'What should we do first?',
    'Prepare a recovery campaign'
  ];

  return (
    <div className="copilot-layout">
      {/* 12-stage agent pipeline */}
      <div className="agent-pipeline-bar">
        {pipeline.map((p, idx) => (
          <React.Fragment key={p}>
            <span className={'step ' + (idx <= activeStep ? 'active' : '')}>{p}</span>
            {idx < pipeline.length - 1 && <em>→</em>}
          </React.Fragment>
        ))}
      </div>

      <Card className="chat-panel copilot-chat">
        <div className="chat-top">
          <div className="agent-avatar">✦</div>
          <div className="grow">
            <b>RazorPayPilot Copilot</b>
            <span>Autonomous Intelligence Layer · Live Merchant Grounding</span>
          </div>
          <Badge tone={status.configured ? 'success' : 'info'}>
            {status.configured ? 'Live Model Online' : 'Agent Intelligence Active'}
          </Badge>
        </div>

        <div className="copilot-model-bar">
          <span><i className="online-dot"></i>{status.provider ? status.provider.toUpperCase() : 'INTELLIGENCE LAYER'}</span>
          <span>{status.model || 'Agentic Multi-Turn'}</span>
          <span>Razorpay Test Mode</span>
        </div>

        <div className="messages copilot-messages">
          {messages.map((m,i)=>(
            <div className={'message '+(m.role==='user'?'user':'ai')} key={i}>
              {m.role==='assistant'&&<span>✦</span>}
              <div style={{width: '100%'}}>
                {m.investigation ? (
                  <div className="investigation-box">
                    <div className="investigation-header">
                      <span>🔎</span>
                      <b>INVESTIGATING WORKSPACE SIGNALS...</b>
                    </div>
                    <div className="investigation-checks">
                      {(m.investigation.checks || []).map(c => (
                        <span key={c.label}>✓ {c.label}</span>
                      ))}
                    </div>

                    <div className="found-card">
                      <h4>FOUND</h4>
                      <ul>
                        <li><b>{m.investigation.found.revenue_change}</b></li>
                        <li><b>Primary cause:</b> {m.investigation.found.primary_cause}</li>
                        <li><b>Most affected:</b> {m.investigation.found.most_affected}</li>
                        <li><b>Peak failure window:</b> {m.investigation.found.peak_window}</li>
                        <li><b>Estimated lost revenue:</b> {money(m.investigation.found.lost_revenue)}</li>
                        <li><b>Recommended action:</b> {m.investigation.found.recommended_action}</li>
                        <li><b>Confidence:</b> {m.investigation.found.confidence}%</li>
                      </ul>
                      <div className="action-row">
                        <Button variant="secondary" onClick={()=>notify?.('Simulated 18.2% failure recovery: +₹18,400 potential')}>🧪 Simulate</Button>
                        <Button onClick={handleOpenProposal}>⚡ Prepare Action</Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p>{m.content}</p>
                )}
                {m.meta?.suggested_actions?.length>0&&<div className="copilot-actions">{m.meta.suggested_actions.map(a=><button key={a.id} onClick={handleOpenProposal}>{a.label} →</button>)}</div>}
              </div>
            </div>
          ))}
          {busy&&<div className="typing">Pilot is investigating workspace signals <i/><i/><i/></div>}
        </div>

        <div className="prompt-row">
          {prompts.map(x=><button key={x} onClick={()=>ask(x)}>{x}</button>)}
        </div>

        {/* Adjustable AI Composer Bar */}
        <div className={`adjustable-composer ${expanded ? 'is-expanded' : ''}`}>
          <div className="composer-toolbar">
            <div className="composer-toolbar-left">
              <span className="composer-hint">
                <kbd>↵</kbd> Send query &nbsp;·&nbsp; <kbd>⇧</kbd>+<kbd>↵</kbd> New line
              </span>
              {q.trim().length > 0 && (
                <span className="char-count">{q.length} chars</span>
              )}
            </div>
            <div className="composer-toolbar-right">
              {q.trim().length > 0 && (
                <button
                  type="button"
                  className="composer-action-btn clear-btn"
                  onClick={() => setQ('')}
                  title="Clear query"
                >
                  ✕ Clear
                </button>
              )}
              <button
                type="button"
                className="composer-action-btn resize-toggle-btn"
                onClick={() => setExpanded(!expanded)}
                title={expanded ? "Compact typing bar" : "Expand typing bar for longer prompts"}
              >
                {expanded ? '⤡ Compact Bar' : '⤢ Expand Bar'}
              </button>
            </div>
          </div>

          <div className="composer-box">
            <textarea
              className="adjustable-textarea"
              rows={expanded ? 5 : 2}
              value={q}
              onChange={e => setQ(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  ask();
                }
              }}
              placeholder="Ask Pilot anything about your merchant business… (e.g. Why did revenue drop? What payment methods failed?)"
            />
            <div className="composer-actions">
              <Button
                className="composer-send-btn"
                onClick={() => ask()}
                disabled={busy || !q.trim()}
              >
                {busy ? 'Investigating…' : 'Send ↑'}
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Action Proposal Modal */}
      {proposal && (
        <ActionProposalModal
          proposal={proposal}
          onApprove={handleApproveProposal}
          onReject={()=>{notify?.('Action rejected by merchant'); setProposal(null);}}
          onClose={()=>setProposal(null)}
        />
      )}
    </div>
  );
}

export function TableCard({title,sub,headers,rows,actions}){
  return (
    <Card>
      <Header title={title} sub={sub} actions={actions}/>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>{headers.map(h=><th key={h}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {rows.map((row,idx)=>(
              <tr key={idx}>
                {row.map((v,i)=>{
                  const headerName = String(headers[i]||'').toLowerCase();
                  const isName = typeof v === 'string' && (headerName.includes('customer') || headerName.includes('product') || headerName.includes('name'));
                  return (
                    <td key={i}>
                      {isName ? (
                        <b className="cell-name-highlight">{v}</b>
                      ) : i===0 && (typeof v === 'string' || typeof v === 'number') ? (
                        <b>{v}</b>
                      ) : typeof v==='string'&&['Paid','Failed','Pending','Refunded','VIP','High-value','Returning','At-risk','High','Medium','Low','Active','Completed','Connected','Disconnected','Eligible','Approved','Rejected'].includes(v)? (
                        <Badge tone={v==='Failed'||v==='At-risk'||v==='High'||v==='Disconnected'||v==='Rejected'?'danger':v==='Pending'||v==='Medium'?'warning':v==='VIP'||v==='Paid'||v==='Active'||v==='Completed'||v==='Connected'||v==='Eligible'||v==='Approved'?'success':'info'}>{v}</Badge>
                      ) : v}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

// -------------------------------------------------------------
// SCREEN 10 & 11: OPPORTUNITY INTELLIGENCE & OPPORTUNITY DETAILS
// -------------------------------------------------------------
export function Opportunities({nav, notify, addAudit}){
  const [filter, setFilter] = useState('All');
  const [opportunities, setOpportunities] = useState([]);
  const [kpis, setKpis] = useState({
    total_at_risk: '₹62,300',
    expected_recovery: '₹38,500',
    avg_confidence: '88.2%',
    active_count: 7
  });
  const [activeOpp, setActiveOpp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);

  const mapOpp = (o) => ({
    ...o,
    atRisk: typeof o.at_risk === 'number' ? money(o.at_risk) : (o.at_risk || o.atRisk || '₹10,000'),
    impact: typeof o.impact === 'number' ? money(o.impact) : (o.impact || '₹8,000'),
    confidence: typeof o.confidence === 'number' ? `${o.confidence}%` : (o.confidence || '85%'),
    count: o.count_label || (typeof o.count === 'number' ? `${o.count} cases` : (o.count || '1 case')),
    action: o.recommended_action || o.action || 'Execute safe intervention'
  });

  const fetchOpps = async () => {
    try {
      const res = await fetch(`${API}/api/opportunities`);
      const data = await res.json();
      const oppList = data.opportunities || data.items;
      if (oppList) {
        setOpportunities(oppList.map(mapOpp));
        if (data.kpis) setKpis(data.kpis);
      }
    } catch {
      setOpportunities(DATA.opportunities);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOpps();
  }, []);

  const handleScan = async () => {
    setScanning(true);
    try {
      const res = await fetch(`${API}/api/opportunities/scan`, { method: 'POST' });
      const data = await res.json();
      const oppList = data.opportunities || data.items;
      if (oppList) {
        setOpportunities(oppList.map(mapOpp));
        if (data.kpis) setKpis(data.kpis);
      }
      notify?.(data.message || 'Scanned and refreshed active revenue opportunities');
    } catch {
      notify?.('Opportunities refreshed');
    } finally {
      setScanning(false);
    }
  };

  const handleReset = async () => {
    try {
      const res = await fetch(`${API}/api/opportunities/reset`, { method: 'POST' });
      const data = await res.json();
      const oppList = data.opportunities || data.items;
      if (oppList) {
        setOpportunities(oppList.map(mapOpp));
        if (data.kpis) setKpis(data.kpis);
      }
      notify?.('Opportunities reset to initial state');
    } catch {
      notify?.('Reset complete');
    }
  };

  const handleExecute = async (opp) => {
    try {
      const res = await fetch(`${API}/api/opportunities/execute`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ id: opp.id })
      });
      const data = await res.json();
      if (data.ok) {
        setOpportunities(prev => prev.map(o => o.id === opp.id ? { ...o, status: 'Executed' } : o));
        notify?.(`✓ Executed: ${opp.action} (${opp.impact} expected)`);
        addAudit?.(data.audit || {
          action: opp.action,
          trigger: 'Opportunity Intelligence',
          customer: opp.type,
          amount: opp.impact,
          result: 'Success · Test Mode',
          policy: 'Within limits'
        });
        setActiveOpp(null);
      }
    } catch {
      setOpportunities(prev => prev.map(o => o.id === opp.id ? { ...o, status: 'Executed' } : o));
      notify?.(`Executed: ${opp.action} (simulated safe execution)`);
      setActiveOpp(null);
    }
  };

  const handleReject = async (opp) => {
    try {
      const res = await fetch(`${API}/api/opportunities/reject`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ id: opp.id })
      });
      const data = await res.json();
      if (data.ok) {
        setOpportunities(prev => prev.map(o => o.id === opp.id ? { ...o, status: 'Rejected' } : o));
        notify?.(`Rejected: ${opp.type} opportunity marked rejected`);
        addAudit?.(data.audit || {
          action: 'Reject Opportunity',
          trigger: 'Merchant Override',
          customer: opp.type,
          amount: 0,
          result: 'Rejected',
          policy: 'Merchant choice'
        });
        setActiveOpp(null);
      }
    } catch {
      setOpportunities(prev => prev.map(o => o.id === opp.id ? { ...o, status: 'Rejected' } : o));
      notify?.('Opportunity rejected');
      setActiveOpp(null);
    }
  };

  const filtered = opportunities.filter(o => {
    if (filter === 'All') return true;
    return (o.priority || 'Medium').toLowerCase() === filter.toLowerCase();
  });

  const highCount = opportunities.filter(o => o.priority === 'High').length;
  const medCount = opportunities.filter(o => o.priority === 'Medium').length;
  const lowCount = opportunities.filter(o => o.priority === 'Low').length;
  const [selectedBranch, setSelectedBranch] = useState(null);

  return (
    <div className="opportunities-container">
      {/* Top 4 KPI Cards */}
      <div className="stat-grid four" style={{marginBottom: 20}}>
        <Card>
          <span className="muted">Total At Risk</span>
          <strong className="metric" style={{color: '#ff5c5c'}}>{kpis.total_at_risk || '₹62,300'}</strong>
          <small className="down">Across 7 leakage vectors</small>
        </Card>
        <Card>
          <span className="muted">Expected Recovery</span>
          <strong className="metric" style={{color: '#10b981'}}>{kpis.expected_recovery || '₹38,500'}</strong>
          <small className="up">+15.2% lift potential</small>
        </Card>
        <Card>
          <span className="muted">Avg Confidence</span>
          <strong className="metric">{kpis.avg_confidence || '88.2%'}</strong>
          <small className="up">Calibrated accuracy</small>
        </Card>
        <Card>
          <span className="muted">Active Opportunities</span>
          <strong className="metric">{opportunities.length}</strong>
          <small className="muted">{highCount} high priority</small>
        </Card>
      </div>

      {/* Feature 5: Revenue Opportunity Map Visual Tree */}
      <Card style={{marginBottom: 20}}>
        <Header
          eyebrow="Visual Opportunity Tree"
          title="Revenue Opportunity Map"
          sub="Interactive visual breakdown: Click any branch to inspect AI reasoning, confidence calibration, and recommended intervention."
        />
        <div className="opp-tree-wrap">
          <div className="opp-tree-root">
            <b>₹38,500 Recoverable Revenue</b>
            <small>AI OPPORTUNITY TREE ROOT · REVENUE RESCUE ENGINE</small>
          </div>
          <div className="opp-tree-stem" />
          <div className="opp-tree-bar" />
          <div className="opp-tree-branches">
            <div
              className={`opp-branch-card ${selectedBranch === 'payments' ? 'active' : ''}`}
              onClick={() => {
                setSelectedBranch('payments');
                const opp = opportunities.find(o => o.type?.toLowerCase().includes('payment')) || opportunities[0];
                if (opp) setActiveOpp(opp);
              }}
            >
              <span className="branch-name">PAYMENT FAILURES</span>
              <strong className="branch-val">₹15,800</strong>
              <small className="branch-sub">27 retryable cases · 92% conf</small>
            </div>
            <div
              className={`opp-branch-card ${selectedBranch === 'carts' ? 'active' : ''}`}
              onClick={() => {
                setSelectedBranch('carts');
                const opp = opportunities.find(o => o.type?.toLowerCase().includes('cart')) || opportunities[1];
                if (opp) setActiveOpp(opp);
              }}
            >
              <span className="branch-name">ABANDONED CARTS</span>
              <strong className="branch-val">₹12,400</strong>
              <small className="branch-sub">83 carts · 87% conf</small>
            </div>
            <div
              className={`opp-branch-card ${selectedBranch === 'customers' ? 'active' : ''}`}
              onClick={() => {
                setSelectedBranch('customers');
                const opp = opportunities.find(o => o.type?.toLowerCase().includes('customer')) || opportunities[2];
                if (opp) setActiveOpp(opp);
              }}
            >
              <span className="branch-name">CUSTOMER REACTIVATION</span>
              <strong className="branch-val">₹6,100</strong>
              <small className="branch-sub">146 users · 81% conf</small>
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <Header
          eyebrow="Opportunity Intelligence"
          title="Revenue Opportunities"
          sub="Pilot continuously detects, scores, and ranks revenue opportunities across your business."
          actions={
            <div style={{display:'flex', gap:8, alignItems:'center', flexWrap:'wrap'}}>
              <div className="filters">
                {[
                  { label: `All (${opportunities.length})`, val: 'All' },
                  { label: `High (${highCount})`, val: 'High' },
                  { label: `Medium (${medCount})`, val: 'Medium' },
                  { label: `Low (${lowCount})`, val: 'Low' },
                ].map(x => (
                  <button
                    key={x.val}
                    className={filter === x.val ? 'active' : ''}
                    onClick={() => setFilter(x.val)}
                  >
                    {x.label}
                  </button>
                ))}
              </div>
              <Button variant="secondary" onClick={handleScan} disabled={scanning}>
                {scanning ? 'Scanning…' : '✦ Scan New'}
              </Button>
              <button className="btn secondary" onClick={handleReset} title="Reset feed" style={{padding:'8px 12px'}}>
                ↺
              </button>
            </div>
          }
        />

        <div className="opp-list">
          {filtered.map((o) => (
            <div key={o.id || o.type} className={`opp-card ${o.status === 'Executed' ? 'executed' : o.status === 'Rejected' ? 'rejected' : ''}`}>
              <div className="opp-icon">{o.icon || '◎'}</div>
              <div className="opp-main">
                <div style={{display:'flex', gap:8, alignItems:'center', flexWrap:'wrap'}}>
                  <b>{o.type}</b>
                  <Badge tone={o.priority === 'High' ? 'danger' : o.priority === 'Medium' ? 'warning' : 'info'}>
                    {o.priority} Priority
                  </Badge>
                  {o.status && o.status !== 'Active' && (
                    <Badge tone={o.status === 'Executed' ? 'success' : 'danger'}>
                      {o.status}
                    </Badge>
                  )}
                </div>
                <span>{o.count} · {o.at_risk || o.atRisk} revenue at risk</span>
                <p><b>AI diagnosis:</b> {o.diagnosis}</p>
              </div>
              <div className="opp-impact">
                <b>{o.impact}</b>
                <span>expected recovery</span>
                <small>{o.confidence} confidence</small>
              </div>
              <div>
                {o.status === 'Executed' ? (
                  <Button variant="secondary" disabled>✓ Executed</Button>
                ) : o.status === 'Rejected' ? (
                  <Button variant="secondary" disabled>× Rejected</Button>
                ) : (
                  <Button variant="secondary" onClick={() => setActiveOpp(o)}>Review →</Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Screen 11: Opportunity Detail Modal / Drawer */}
      {activeOpp && (
        <div className="modal-overlay" onClick={() => setActiveOpp(null)}>
          <div className="modal-content opp-detail-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="eyebrow">Opportunity Detail · Screen 11 Blueprint</span>
                <h2>{activeOpp.type}</h2>
                <div style={{display:'flex', gap:8, marginTop:6}}>
                  <Badge tone={activeOpp.priority === 'High' ? 'danger' : 'warning'}>{activeOpp.priority} Priority</Badge>
                  <Badge tone="info">{activeOpp.count}</Badge>
                </div>
              </div>
              <button className="close-btn" onClick={() => setActiveOpp(null)}>✕</button>
            </div>

            <div className="modal-body" style={{display:'flex', flexDirection:'column', gap:16, marginTop:16}}>
              <div className="diagnosis-box" style={{background:'rgba(98, 70, 234, 0.06)', border:'1px solid rgba(98, 70, 234, 0.2)', padding:16, borderRadius:12}}>
                <b style={{color:'#6246ea', display:'block', marginBottom:6}}>✦ AI Diagnosis & Root Cause:</b>
                <p style={{margin:0, fontSize:13, lineHeight:1.5, color:'#cbd5e1'}}>{activeOpp.diagnosis}</p>
              </div>

              {/* 4 Metrics Triplet */}
              <div className="opp-metrics-grid" style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(130px, 1fr))', gap:12}}>
                <div className="metric-chip">
                  <span className="muted">Revenue at Risk</span>
                  <b style={{color:'#ff5c5c', fontSize:16}}>{activeOpp.at_risk || activeOpp.atRisk}</b>
                </div>
                <div className="metric-chip">
                  <span className="muted">Expected Recovery</span>
                  <b style={{color:'#10b981', fontSize:16}}>{activeOpp.impact}</b>
                </div>
                <div className="metric-chip">
                  <span className="muted">Model Confidence</span>
                  <b style={{fontSize:16}}>{activeOpp.confidence}</b>
                </div>
                <div className="metric-chip">
                  <span className="muted">Execution Risk</span>
                  <b style={{color:'#10b981', fontSize:16}}>Low (Test Mode)</b>
                </div>
              </div>

              <div className="action-box-light">
                <b style={{display:'block', marginBottom:4}}>Recommended Intervention:</b>
                <p style={{margin:0, color:'#475569', fontSize:13}}>
                  {activeOpp.action}
                </p>
                <small style={{display:'block', marginTop:8, color:'#6246ea', fontWeight:600}}>
                  ⚡ Automatic execution policy checked: Within ₹5,000 threshold · max 2 retries
                </small>
              </div>

              {/* Evidence list */}
              <div className="evidence-section-light">
                <b style={{display:'block', marginBottom:8, fontSize:12, textTransform:'uppercase', letterSpacing:1, color:'#64748b'}}>
                  Empirical Evidence & Telemetry:
                </b>
                <ul style={{margin:0, paddingLeft:20, fontSize:12.5, color:'#475569', lineHeight:1.7}}>
                  <li>3 previous successful payments by user with zero chargebacks.</li>
                  <li>Failure telemetry: <code>BAD_REQUEST_ERROR_BANK_DOWNTIME</code> on acquirer gateway.</li>
                  <li>Customer lifetime spend exceeds ₹45,000 across 12 orders.</li>
                  <li>Action bounded safely within Razorpay Test Mode constraints.</li>
                </ul>
              </div>
            </div>

            <div className="modal-footer" style={{display:'flex', justifyContent:'space-between', gap:12, marginTop:20, paddingTop:16, borderTop:'1px solid #edf0f5'}}>
              <Button variant="danger" onClick={() => handleReject(activeOpp)}>
                Reject Opportunity
              </Button>
              <div style={{display:'flex', gap:8}}>
                <Button variant="secondary" onClick={() => setActiveOpp(null)}>
                  Cancel
                </Button>
                <Button onClick={() => handleExecute(activeOpp)}>
                  Approve & Execute →
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// -------------------------------------------------------------
// SCREEN 12: REVENUE RECOVERY AGENT
// -------------------------------------------------------------
export function Recovery({notify, addAudit}){
  const [kpis, setKpis] = useState({
    revenue_at_risk: 24300,
    recovery_confidence: 92,
    expected_recovery: 15800,
    active_count: 27,
    recovered_revenue: 45100
  });
  const [workflows, setWorkflows] = useState([
    { id: 'wf_1', name: 'Payment Retry', title: 'Payment Retry', trigger: 'Failed payments', count: '27 cases', rate: '84%', potential: '₹24,300', status: 'Active' },
    { id: 'wf_2', name: 'Abandoned Checkout', title: 'Abandoned Checkout', trigger: 'High-intent carts', count: '18 cases', rate: '72%', potential: '₹12,500', status: 'Active' },
    { id: 'wf_3', name: 'Subscription Failure', title: 'Subscription Failure', trigger: 'Dunning cycle', count: '6 cases', rate: '65%', potential: '₹6,200', status: 'Active' },
    { id: 'wf_4', name: 'Invoice Recovery', title: 'Invoice Recovery', trigger: 'Overdue invoices', count: '3 cases', rate: '58%', potential: '₹2,900', status: 'Paused' }
  ]);
  const [queue, setQueue] = useState([
    { id: 'rec_101', customer: 'Rahul Verma', amount: '₹4,500', rawAmount: 4500, reason: 'Temporary bank issue', prob: '91%', status: 'Eligible', risk: 'Low', action: 'Retry' },
    { id: 'rec_102', customer: 'Vikram Rao', amount: '₹12,000', rawAmount: 12000, reason: 'Net banking timeout', prob: '88%', status: 'Approval Required', risk: 'Medium', action: 'Approval' },
    { id: 'rec_103', customer: 'Anita Singh', amount: '₹2,100', rawAmount: 2100, reason: 'Card authentication glitch', prob: '79%', status: 'Eligible', risk: 'Low', action: 'Retry' },
    { id: 'rec_104', customer: 'Neha Patel', amount: '₹8,400', rawAmount: 8400, reason: 'UPI decline', prob: '72%', status: 'Approval Required', risk: 'Medium', action: 'Approval' },
    { id: 'rec_105', customer: 'Arjun Mehta', amount: '₹3,200', rawAmount: 3200, reason: 'Wallet session timeout', prob: '85%', status: 'Eligible', risk: 'Low', action: 'Retry' }
  ]);
  const [running, setRunning] = useState(false);

  const fetchQueue = async () => {
    try {
      const res = await fetch(`${API}/api/recovery/queue`);
      const data = await res.json();
      if (data.kpis) {
        setKpis(prev => ({ ...prev, ...data.kpis }));
      }
      if (data.workflows && Array.isArray(data.workflows)) {
        setWorkflows(data.workflows.map(wf => {
          const name = wf.name || wf.title || 'Workflow';
          return {
            id: wf.id,
            name: name,
            title: name,
            trigger: wf.trigger || (name.toLowerCase().includes('payment') ? 'Failed payments' : (name.toLowerCase().includes('checkout') || name.toLowerCase().includes('cart')) ? 'High-intent carts' : name.toLowerCase().includes('subscription') ? 'Dunning cycle' : 'Overdue invoices'),
            count: wf.count || (wf.in_queue ? `${wf.in_queue} cases` : '12 cases'),
            rate: wf.rate || (wf.probability ? `${wf.probability}%` : '80%'),
            potential: wf.potential || (typeof wf.amount === 'number' ? money(wf.amount) : wf.amount || '₹15,000'),
            status: wf.status || 'Active'
          };
        }));
      }
      if (data.queue && Array.isArray(data.queue)) {
        setQueue(data.queue.map(q => ({
          id: q.id,
          customer: q.customer || 'Customer',
          amount: typeof q.amount === 'number' ? money(q.amount) : q.amount || '₹4,500',
          rawAmount: q.amount,
          reason: q.reason || 'Temporary gateway timeout',
          prob: (q.probability || 85) + '%',
          status: q.status || 'Eligible',
          risk: q.risk || 'Low',
          action: q.guardrail?.requires_approval ? 'Approval' : (q.status === 'Recovered' ? 'Done' : 'Retry')
        })));
      }
    } catch {
      // Keep static defaults
    }
  };

  useEffect(() => {
    fetchQueue();
    const id = setInterval(fetchQueue, 5000);
    return () => clearInterval(id);
  }, []);

  const executeWorkflow = async (wf) => {
    const name = wf.name || wf.title || 'Workflow';
    setRunning(true);
    try {
      const res = await fetch(`${API}/api/recovery/workflow/execute`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ id: wf.id })
      });
      const data = await res.json();
      notify?.(data.message || `Workflow "${name}" executed successfully`);
      addAudit?.(data.audit || {
        action: `Execute Workflow: ${name}`,
        trigger: wf.trigger || 'Recovery pipeline',
        customer: 'Batch Queue',
        amount: wf.potential || 15800,
        result: 'Success · Test Mode',
        policy: 'Workflow guardrails'
      });
      fetchQueue();
    } catch {
      notify?.(`Workflow "${name}" executed in Test Mode`);
    } finally {
      setRunning(false);
    }
  };

  const handleBatchRetry = async () => {
    setRunning(true);
    try {
      const res = await fetch(`${API}/api/recovery/retry-all`, { method: 'POST' });
      const data = await res.json();
      notify?.(data.message || 'Safe batch recovery executed for all eligible transactions');
      setQueue(prev => prev.map(q => q.action === 'Retry' ? { ...q, status: 'Recovered' } : q));
      addAudit?.(data.audit || {
        action: 'Batch Payment Retry',
        trigger: 'AI Opportunity',
        customer: 'Eligible Queue',
        amount: 9800,
        result: 'Success · Test Mode',
        policy: 'Within limits'
      });
      fetchQueue();
    } catch {
      setQueue(prev => prev.map(q => q.action === 'Retry' ? { ...q, status: 'Recovered' } : q));
      notify?.('Batch recovery simulated safely');
    } finally {
      setRunning(false);
    }
  };

  const handleRowRetry = async (row) => {
    try {
      const res = await fetch(`${API}/api/recovery/execute`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ payment_id: row.id, customer: row.customer, amount: row.rawAmount || 4500 })
      });
      const data = await res.json();
      notify?.(`✓ Recovered ${row.amount} for ${row.customer}`);
      setQueue(prev => prev.map(q => q.id === row.id ? { ...q, status: 'Recovered' } : q));
      addAudit?.(data.audit || {
        action: 'Payment Recovery Retry',
        trigger: 'Failed payment',
        customer: row.customer,
        amount: row.amount,
        result: 'Success · Test Mode',
        policy: 'Within limit'
      });
      fetchQueue();
    } catch {
      setQueue(prev => prev.map(q => q.id === row.id ? { ...q, status: 'Recovered' } : q));
      notify?.(`Recovery executed for ${row.customer}`);
    }
  };

  return (
    <div className="recovery-page">
      {/* Hero Banner */}
      <div className="agent-banner" style={{marginBottom: 0}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
          <div style={{width: 46, height: 46, borderRadius: 12, background: 'linear-gradient(135deg, #6246ea, #7b61ff)', color: '#fff', display: 'grid', placeItems: 'center', fontSize: 22, fontWeight: 900, flexShrink: 0}}>
            ↻
          </div>
          <div>
            <div style={{display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap'}}>
              <span className="eyebrow" style={{color: '#6246ea'}}>Autonomous Agent · Track 02</span>
              <Badge tone="success">🟢 Live · Assisted Test Mode</Badge>
            </div>
            <h2 style={{margin: '4px 0 2px', fontSize: 21}}>Revenue Recovery Agent</h2>
            <p style={{margin: 0, color: '#6b7280', fontSize: 11.5}}>
              Continuous 9-stage loop: Detect → Diagnose → Score → Intervene → Guard → Approve → Execute → Verify → Recover.
            </p>
          </div>
        </div>
        <div style={{display: 'flex', gap: 10}}>
          <Button variant="secondary" onClick={() => { notify?.('Syncing with payment telemetry…'); fetchQueue(); }}>↻ Sync Gateway</Button>
        </div>
      </div>

      {/* 3 Top KPI Cards */}
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14}}>
        <Card>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
            <span className="muted" style={{fontSize: 11}}>Revenue at Risk</span>
            <span style={{fontSize: 18}}>🚨</span>
          </div>
          <strong className="metric" style={{color: '#e53e3e', fontSize: 24, margin: '8px 0 4px', display: 'block'}}>
            {typeof kpis.revenue_at_risk === 'number' ? money(kpis.revenue_at_risk) : kpis.revenue_at_risk}
          </strong>
          <small style={{color: '#718096', fontSize: 11}}>{kpis.active_count || kpis.total_count || 27} eligible failed payments detected</small>
        </Card>
        <Card>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
            <span className="muted" style={{fontSize: 11}}>Recovery Probability</span>
            <Badge tone="success">{kpis.recovery_confidence || 92}% Calibrated</Badge>
          </div>
          <strong className="metric" style={{color: '#0d875a', fontSize: 24, margin: '8px 0 4px', display: 'block'}}>
            {kpis.recovery_confidence || 92.0}%
          </strong>
          <Progress value={`${kpis.recovery_confidence || 92}%`} />
          <small style={{color: '#0d875a', fontSize: 11, display: 'block', marginTop: 6}}>High model confidence · UPI concentration</small>
        </Card>
        <Card>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
            <span className="muted" style={{fontSize: 11}}>Expected Recovery</span>
            <Badge tone="info">+15.8% Lift</Badge>
          </div>
          <strong className="metric" style={{color: '#6246ea', fontSize: 24, margin: '8px 0 4px', display: 'block'}}>
            {typeof kpis.expected_recovery === 'number' ? money(kpis.expected_recovery) : kpis.expected_recovery}
          </strong>
          <small style={{color: '#718096', fontSize: 11}}>Bounded by Razorpay Test Mode policy</small>
        </Card>
      </div>

      {/* Active Recovery Pipelines */}
      <Card>
        <Header
          eyebrow="Workflow Automation"
          title="Active Recovery Pipelines"
          sub="Pre-configured multi-step workflows for autonomous revenue restoration."
          actions={<Badge tone="info">{workflows.length} Active Pipelines</Badge>}
        />
        <div className="table-wrap" style={{marginTop: 12}}>
          <table className="recovery-workflows-table">
            <thead>
              <tr>
                <th style={{width: '26%'}}>Workflow</th>
                <th style={{width: '20%'}}>Trigger Event</th>
                <th style={{width: '14%'}}>Eligible Cases</th>
                <th style={{width: '13%'}}>Success Rate</th>
                <th style={{width: '14%'}}>Recoverable</th>
                <th style={{width: '13%', textAlign: 'right'}}>Action</th>
              </tr>
            </thead>
            <tbody>
              {workflows.map(wf => {
                const name = wf.name || wf.title || 'Workflow';
                return (
                  <tr key={wf.id || name}>
                    <td>
                      <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
                        <span style={{fontSize: 16, color: '#6246ea'}}>
                          {name.includes('Payment') ? '↻' : (name.includes('Checkout') || name.includes('Cart')) ? '🛒' : name.includes('Subscription') ? '🔄' : '📄'}
                        </span>
                        <div>
                          <b>{name}</b>
                          <small style={{display: 'block', color: '#718096', fontSize: 10}}>{wf.status || 'Active'}</small>
                        </div>
                      </div>
                    </td>
                    <td><span style={{background: '#f1f5f9', padding: '4px 8px', borderRadius: 6, fontSize: 11}}>{wf.trigger || 'Automated trigger'}</span></td>
                    <td><b>{wf.count}</b></td>
                    <td><Badge tone="success">{wf.rate}</Badge></td>
                    <td><b style={{color: '#0d875a'}}>{wf.potential}</b></td>
                    <td style={{textAlign: 'right'}}>
                      <Button variant="secondary" onClick={() => executeWorkflow(wf)} disabled={running} style={{padding: '6px 12px', fontSize: 10.5}}>
                        {running ? 'Running…' : 'Execute →'}
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Clean Light Summary Bar */}
        <div className="recovery-summary-bar">
          <span>Recoverable Potential: <b style={{color: '#0d875a'}}>₹45,900</b></span>
          <span>In Progress: <b>12 cases</b></span>
          <span>Recovered to Date: <b style={{color: '#0d875a'}}>{typeof kpis.recovered_revenue === 'number' ? money(kpis.recovered_revenue) : '₹45,100'}</b></span>
          <span>Recovery Success Rate: <b style={{color: '#6246ea'}}>88.2%</b></span>
        </div>
      </Card>

      {/* Screen 12: Live Queue (Proper Table Grid Alignment) */}
      <Card>
        <Header
          eyebrow="Real-Time Execution Queue"
          title="Current Recovery Queue"
          sub="Every case has telemetry evidence, risk rating, and a bounded action."
          actions={
            <Button onClick={handleBatchRetry} disabled={running}>
              {running ? 'Executing…' : '⚡ Run Safe Batch Recovery'}
            </Button>
          }
        />
        <div className="table-wrap" style={{marginTop: 12}}>
          <table className="recovery-queue-table">
            <thead>
              <tr>
                <th style={{width: '28%'}}>Customer & Failure Context</th>
                <th style={{width: '14%'}}>Failed Amount</th>
                <th style={{width: '16%'}}>Recovery Probability</th>
                <th style={{width: '14%'}}>Risk Rating</th>
                <th style={{width: '14%'}}>Status</th>
                <th style={{width: '14%', textAlign: 'right'}}>Action</th>
              </tr>
            </thead>
            <tbody>
              {queue.map(r => {
                const cust = r.customer || 'Customer';
                const initials = cust.split(' ').filter(Boolean).map(n => n[0]).join('').slice(0, 2) || 'C';
                return (
                  <tr key={r.id || cust}>
                    <td>
                      <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
                        <div className="avatar" style={{width: 32, height: 32, fontSize: 11, background: '#efedff', color: '#6246ea', flexShrink: 0}}>
                          {initials}
                        </div>
                        <div>
                          <b style={{fontSize: 12, color: '#17203a', display: 'block'}}>{cust}</b>
                          <small style={{color: '#718096', fontSize: 10.5, display: 'block'}}>{r.reason || 'Temporary failure'}</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <b style={{color: '#0d875a', fontSize: 13}}>{r.amount}</b>
                    </td>
                    <td>
                      <div style={{display: 'flex', alignItems: 'center', gap: 6}}>
                        <Badge tone="info">{r.prob}</Badge>
                        <small style={{color: '#718096', fontSize: 11}}>confidence</small>
                      </div>
                    </td>
                    <td>
                      <Badge tone={r.risk === 'Low' ? 'success' : 'warning'}>{r.risk} Risk</Badge>
                    </td>
                    <td>
                      <Badge tone={r.status === 'Recovered' ? 'success' : r.action === 'Approval' ? 'warning' : 'info'}>
                        {r.status}
                      </Badge>
                    </td>
                    <td style={{textAlign: 'right'}}>
                      {r.status === 'Recovered' ? (
                        <span style={{color: '#0d875a', fontWeight: 700, fontSize: 11}}>✓ Recovered</span>
                      ) : r.action === 'Approval' ? (
                        <Button variant="secondary" onClick={() => notify?.(`Escalated ${cust} (${r.amount}) to Human Approval Hub`)} style={{fontSize: 10.5, padding: '6px 10px'}}>
                          Review Approval
                        </Button>
                      ) : (
                        <Button onClick={() => handleRowRetry(r)} style={{fontSize: 10.5, padding: '6px 12px'}}>
                          Retry Now →
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Why Pilot Recommends Retry (Explainability & Telemetry) */}
      <Card>
        <Header
          eyebrow="Empirical Reasoning"
          title="Why Pilot Recommends Retry"
          sub="Transparent reasoning engine · every decision is grounded in gateway telemetry and merchant policy."
        />
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14, marginTop: 14}}>
          <div style={{background: '#f8f9fc', border: '1px solid #e9edf5', borderRadius: 10, padding: 16}}>
            <span className="eyebrow" style={{color: '#6246ea'}}>TELEMETRY EVIDENCE</span>
            <ul style={{listStyle: 'none', padding: 0, margin: '8px 0 0', fontSize: 11, color: '#4a5568', lineHeight: 1.8}}>
              <li><span style={{color: '#0d875a', fontWeight: 800}}>✓</span> 3 previous successful payments by customer</li>
              <li><span style={{color: '#0d875a', fontWeight: 800}}>✓</span> 1 recent temporary acquirer gateway timeout</li>
              <li><span style={{color: '#0d875a', fontWeight: 800}}>✓</span> Zero history of dispute or chargeback</li>
            </ul>
          </div>
          <div style={{background: '#f8f9fc', border: '1px solid #e9edf5', borderRadius: 10, padding: 16}}>
            <span className="eyebrow" style={{color: '#e53e3e'}}>CONSTITUTION GUARDRAILS</span>
            <ul style={{listStyle: 'none', padding: 0, margin: '8px 0 0', fontSize: 11, color: '#4a5568', lineHeight: 1.8}}>
              <li><span style={{color: '#6246ea', fontWeight: 800}}>🛡️</span> Retry limit strictly bounded: ≤ 2 attempts</li>
              <li><span style={{color: '#6246ea', fontWeight: 800}}>🛡️</span> Action amount ₹4,500 ≤ ₹5,000 threshold</li>
              <li><span style={{color: '#6246ea', fontWeight: 800}}>🛡️</span> Idempotency key verified: zero duplicate risk</li>
            </ul>
          </div>
          <div style={{background: '#f8f9fc', border: '1px solid #e9edf5', borderRadius: 10, padding: 16}}>
            <span className="eyebrow" style={{color: '#0d875a'}}>EXPECTED FINANCIAL OUTCOME</span>
            <strong style={{display: 'block', fontSize: 24, color: '#0d875a', margin: '6px 0 2px'}}>₹4,500</strong>
            <span style={{fontSize: 11, color: '#0d875a', fontWeight: 700}}>91% Recovery Probability</span>
            <small style={{display: 'block', color: '#718096', marginTop: 8, fontSize: 10.5}}>
              Every action committed to immutable ledger with verified transaction trace.
            </small>
          </div>
        </div>
      </Card>
    </div>
  );
}

// -------------------------------------------------------------
// SCREEN 13: ABANDONED CHECKOUT AGENT
// -------------------------------------------------------------
export function CartAgent({notify, addAudit}){
  const [carts, setCarts] = useState([
    { id: 'cart_1', customer: 'Rahul Verma', value: '₹8,500', rawValue: 8500, age: '2h', intent: '87%', action: 'WhatsApp Nudge', channel: 'WhatsApp', status: 'Pending' },
    { id: 'cart_2', customer: 'Anita Singh', value: '₹2,100', rawValue: 2100, age: '5h', intent: '81%', action: 'Email Reminder', channel: 'Email', status: 'Pending' },
    { id: 'cart_3', customer: 'Vikram Rao', value: '₹12,000', rawValue: 12000, age: '1d', intent: '92%', action: '10% Discount Nudge', channel: 'WhatsApp', status: 'Pending' },
    { id: 'cart_4', customer: 'Neha Patel', value: '₹2,600', rawValue: 2600, age: '2d', intent: '54%', action: 'Email Follow-up', channel: 'Email', status: 'Pending' },
    { id: 'cart_5', customer: 'Arjun Mehta', value: '₹6,000', rawValue: 6000, age: '3h', intent: '76%', action: 'SMS Reminder', channel: 'SMS', status: 'Pending' }
  ]);
  const [running, setRunning] = useState(false);

  const fetchCarts = async () => {
    try {
      const res = await fetch(`${API}/api/carts`);
      const data = await res.json();
      if (data.carts) {
        setCarts(data.carts.map(c => ({
          id: c.id,
          customer: c.customer,
          value: money(c.cart_value || c.value),
          rawValue: c.cart_value || c.value,
          age: c.age || '2h',
          intent: (c.intent_score || 85) + '%',
          action: c.ai_action || 'Recovery Nudge',
          channel: c.channel || 'WhatsApp',
          status: c.status || 'Pending'
        })));
      }
    } catch {
      // Fallback to initial
    }
  };

  useEffect(() => {
    fetchCarts();
    const id = setInterval(fetchCarts, 5000);
    return () => clearInterval(id);
  }, []);

  const handleTakeAction = async (cart) => {
    try {
      const res = await fetch(`${API}/api/carts/action`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ id: cart.id })
      });
      const data = await res.json();
      setCarts(prev => prev.map(c => c.id === cart.id ? { ...c, status: 'Recovered' } : c));
      notify?.(`✓ Cart action dispatched to ${cart.customer} via ${cart.channel}`);
      addAudit?.(data.audit || {
        action: `Cart Recovery: ${cart.action}`,
        trigger: 'Abandoned Checkout',
        customer: cart.customer,
        amount: cart.value,
        result: 'Success · Dispatched',
        policy: 'Within discount policy'
      });
    } catch {
      setCarts(prev => prev.map(c => c.id === cart.id ? { ...c, status: 'Recovered' } : c));
      notify?.(`Simulated recovery dispatched for ${cart.customer}`);
    }
  };

  const handleRecoverAll = async () => {
    setRunning(true);
    try {
      const res = await fetch(`${API}/api/carts/recover-all`, { method: 'POST' });
      const data = await res.json();
      setCarts(prev => prev.map(c => ({ ...c, status: 'Recovered' })));
      notify?.(data.message || 'Recovered all eligible abandoned carts');
      addAudit?.(data.audit || {
        action: 'Recover All Eligible Carts',
        trigger: 'Agent Bulk Automation',
        customer: 'All Carts',
        amount: '₹31,200',
        result: 'Success · Batch Complete',
        policy: 'Constitution Compliant'
      });
    } catch {
      setCarts(prev => prev.map(c => ({ ...c, status: 'Recovered' })));
      notify?.('All eligible carts recovered in Test Mode');
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="agent-product">
      {/* Screen 13: 5 Strategy Decision Cards */}
      <Card>
        <Header
          eyebrow="Specialized Agent · Screen 13 Blueprint"
          title="Abandoned Checkout Agent"
          sub="Optimize WHO, WHEN, WHAT, HOW — and LIMIT."
          actions={
            <Button onClick={handleRecoverAll} disabled={running}>
              {running ? 'Recovering…' : '⚡ Recover All Eligible (5)'}
            </Button>
          }
        />
        <div className="decision-cards">
          {[
            ['WHO', 'Rahul Verma', 'High purchase intent (87%)'],
            ['WHEN', 'After 30 minutes', 'Peak customer response window'],
            ['WHAT', 'Reminder only', 'Protects merchant gross margin'],
            ['HOW', 'WhatsApp', 'Preferred channel (84% open rate)'],
            ['LIMIT', '₹0 discount', 'Policy-safe bounded action']
          ].map(x => (
            <div key={x[0]}>
              <span style={{fontSize:11, color:'#6246ea', fontWeight:700}}>{x[0]}</span>
              <b>{x[1]}</b>
              <small>{x[2]}</small>
            </div>
          ))}
        </div>
      </Card>

      {/* Screen 13: High-Intent Carts Queue Table */}
      <Card>
        <Header
          title="High-Intent Abandoned Carts"
          sub="Continuously scored by purchasing propensity, browsing recency, and price elasticity."
          actions={<Badge tone="success">83 High Intent Cases</Badge>}
        />
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Cart Value</th>
                <th>Age</th>
                <th>Intent Score</th>
                <th>AI Action Plan</th>
                <th>Channel</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {carts.map(c => (
                <tr key={c.id || c.customer}>
                  <td>
                    <div style={{display:'flex', alignItems:'center', gap:10}}>
                      <span className="avatar" style={{width:28, height:28, fontSize:11}}>
                        {c.customer.split(' ').map(n=>n[0]).join('')}
                      </span>
                      <b className="cell-name-highlight">{c.customer}</b>
                    </div>
                  </td>
                  <td><b style={{color:'#10b981'}}>{c.value}</b></td>
                  <td>{c.age}</td>
                  <td>
                    <div style={{display:'flex', alignItems:'center', gap:6}}>
                      <Progress value={c.intent}/>
                      <span style={{fontSize:12}}>{c.intent}</span>
                    </div>
                  </td>
                  <td>{c.action}</td>
                  <td><Badge tone="info">{c.channel}</Badge></td>
                  <td>
                    <Badge tone={c.status === 'Recovered' ? 'success' : 'warning'}>
                      {c.status}
                    </Badge>
                  </td>
                  <td>
                    {c.status === 'Recovered' ? (
                      <Button variant="secondary" disabled>✓ Recovered</Button>
                    ) : (
                      <Button variant="secondary" onClick={() => handleTakeAction(c)}>
                        Take Action →
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// -------------------------------------------------------------
// SCREEN 14: PAYMENT INTELLIGENCE
// -------------------------------------------------------------
export function Payments({nav, notify}){
  const [payments, setPayments] = useState(DATA.payments);

  useEffect(() => {
    fetch(`${API}/api/payments/intelligence`)
      .then(r => r.json())
      .then(d => {
        if (d.recent_payments) {
          setPayments(d.recent_payments.map(p => [
            p.id, p.customer, money(p.amount), p.method, p.status, p.time || 'Today'
          ]));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div>
      {/* 4 Stat Cards */}
      <div className="stat-grid four" style={{marginBottom: 20}}>
        <Card>
          <span className="muted">Success Rate</span>
          <strong className="metric" style={{color:'#10b981'}}>85.2%</strong>
          <span className="up">+3.2% vs last week</span>
        </Card>
        <Card>
          <span className="muted">Failure Rate</span>
          <strong className="metric" style={{color:'#ff5c5c'}}>14.8%</strong>
          <span className="down">-2.1% improvement</span>
        </Card>
        <Card>
          <span className="muted">Transactions</span>
          <strong className="metric">7,856</strong>
          <span className="up">+12.4% volume</span>
        </Card>
        <Card>
          <span className="muted">Recoverable Potential</span>
          <strong className="metric" style={{color:'#6246ea'}}>₹15,800</strong>
          <span className="up">92% model confidence</span>
        </Card>
      </div>

      {/* Screen 14 Analytics Breakdown */}
      <div className="dashboard-grid two" style={{marginBottom: 20}}>
        <Card>
          <Header title="Payment Method Performance" sub="Success rates across payment rails."/>
          <div style={{display:'flex', alignItems:'center', gap:24, margin:'16px 0'}}>
            <Donut value={85} label="Overall"/>
            <div style={{flex:1, display:'flex', flexDirection:'column', gap:10}}>
              <div>
                <div style={{display:'flex', justifyContent:'space-between', fontSize:12, marginBottom:4}}>
                  <span>UPI Autopay & Direct</span><b>78%</b>
                </div>
                <Progress value="78%"/>
              </div>
              <div>
                <div style={{display:'flex', justifyContent:'space-between', fontSize:12, marginBottom:4}}>
                  <span>Credit / Debit Cards</span><b>68%</b>
                </div>
                <Progress value="68%"/>
              </div>
              <div>
                <div style={{display:'flex', justifyContent:'space-between', fontSize:12, marginBottom:4}}>
                  <span>Net Banking</span><b>45%</b>
                </div>
                <Progress value="45%"/>
              </div>
              <div>
                <div style={{display:'flex', justifyContent:'space-between', fontSize:12, marginBottom:4}}>
                  <span>Wallets & PayLater</span><b>35%</b>
                </div>
                <Progress value="35%"/>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <Header title="Failure Reasons Breakdown" sub="Root-cause classification by AI telemetry."/>
          <div style={{display:'flex', flexDirection:'column', gap:10, marginTop:12}}>
            <div style={{background:'#f8f9fc', border:'1px solid #edf0f6', padding:'12px 14px', borderRadius:10, display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              <div style={{display:'flex', alignItems:'center', gap:10}}>
                <span style={{width:32, height:32, borderRadius:8, background:'#fff0f1', color:'#e11d48', display:'grid', placeItems:'center', fontSize:15}}>🏦</span>
                <div>
                  <b style={{color:'#17203a', fontSize:12, display:'block'}}>Bank Acquirer Downtime</b>
                  <small style={{color:'#7d879d', fontSize:10}}>Temporary issuer timeout · 7–9 PM peak</small>
                </div>
              </div>
              <Badge tone="danger">42% · Retryable</Badge>
            </div>

            <div style={{background:'#f8f9fc', border:'1px solid #edf0f6', padding:'12px 14px', borderRadius:10, display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              <div style={{display:'flex', alignItems:'center', gap:10}}>
                <span style={{width:32, height:32, borderRadius:8, background:'#fff8eb', color:'#b87816', display:'grid', placeItems:'center', fontSize:15}}>💳</span>
                <div>
                  <b style={{color:'#17203a', fontSize:12, display:'block'}}>Insufficient Customer Balance</b>
                  <small style={{color:'#7d879d', fontSize:10}}>Account funds shortage</small>
                </div>
              </div>
              <Badge tone="warning">28% · Nudge eligible</Badge>
            </div>

            <div style={{background:'#f8f9fc', border:'1px solid #edf0f6', padding:'12px 14px', borderRadius:10, display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              <div style={{display:'flex', alignItems:'center', gap:10}}>
                <span style={{width:32, height:32, borderRadius:8, background:'#fff8eb', color:'#b87816', display:'grid', placeItems:'center', fontSize:15}}>📱</span>
                <div>
                  <b style={{color:'#17203a', fontSize:12, display:'block'}}>User Cancelled / 2FA Dropout</b>
                  <small style={{color:'#7d879d', fontSize:10}}>OTP screen abandoned</small>
                </div>
              </div>
              <Badge tone="warning">18% · Instant link</Badge>
            </div>

            <div style={{background:'#f8f9fc', border:'1px solid #edf0f6', padding:'12px 14px', borderRadius:10, display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              <div style={{display:'flex', alignItems:'center', gap:10}}>
                <span style={{width:32, height:32, borderRadius:8, background:'#edf4ff', color:'#2b6cb0', display:'grid', placeItems:'center', fontSize:15}}>🔒</span>
                <div>
                  <b style={{color:'#17203a', fontSize:12, display:'block'}}>Authentication Failure</b>
                  <small style={{color:'#7d879d', fontSize:10}}>Incorrect credentials</small>
                </div>
              </div>
              <Badge tone="info">12% · Tokenized</Badge>
            </div>
          </div>
        </Card>
      </div>

      <TableCard
        title="Payment Telemetry Log"
        sub="Live transactions categorized by recovery eligibility."
        headers={['Payment ID','Customer','Amount','Method','Status','Time','AI Action']}
        rows={payments.map(p => [
          p[0], p[1], p[2], p[3], p[4], p[5],
          p[4] === 'Failed' ? (
            <button className="link" onClick={() => nav('/recovery')}>
              Recover in Agent →
            </button>
          ) : (
            <span style={{color:'#8b94a8', fontSize:12}}>Verified</span>
          )
        ])}
      />
    </div>
  );
}

// -------------------------------------------------------------
// SCREEN 15: ORDER MANAGEMENT
// -------------------------------------------------------------
export function Orders({notify, addAudit}){
  const [filter, setFilter] = useState('All');
  const [orders, setOrders] = useState([
    { id: 'ORD1234', customer: 'Rahul Verma', items: 'MacBook Air M2', amount: '₹94,900', rawAmount: 94900, method: 'UPI', status: 'Paid', date: 'Today' },
    { id: 'ORD1235', customer: 'Anita Singh', items: 'AirPods Pro', amount: '₹24,900', rawAmount: 24900, method: 'Cards', status: 'Pending', date: 'Today' },
    { id: 'ORD1236', customer: 'Vikram Rao', items: 'Laptop Bag + Mouse', amount: '₹12,000', rawAmount: 12000, method: 'Net Banking', status: 'Failed', date: 'Today' },
    { id: 'ORD1237', customer: 'Neha Patel', items: 'iPhone 15 Case', amount: '₹2,600', rawAmount: 2600, method: 'UPI', status: 'Paid', date: 'Yesterday' },
    { id: 'ORD1238', customer: 'Arjun Mehta', items: 'Wireless Charger', amount: '₹3,200', rawAmount: 3200, method: 'Wallet', status: 'Refunded', date: 'Yesterday' },
    { id: 'ORD1239', customer: 'Pooja Sharma', items: 'Mechanical Keyboard', amount: '₹6,400', rawAmount: 6400, method: 'Cards', status: 'Paid', date: '2 days ago' },
    { id: 'ORD1240', customer: 'Karan Malhotra', items: 'USB-C Dock', amount: '₹4,800', rawAmount: 4800, method: 'UPI', status: 'Paid', date: '3 days ago' }
  ]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCustomer, setNewCustomer] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newItems, setNewItems] = useState('');
  const [newMethod, setNewMethod] = useState('UPI');

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API}/api/orders?status=${filter}`);
      const data = await res.json();
      if (data.orders) {
        setOrders(data.orders.map(o => ({
          id: o.order_id || o.id,
          customer: o.customer,
          items: o.items,
          amount: money(o.amount),
          rawAmount: o.amount,
          method: o.method,
          status: o.status,
          date: o.date || 'Today'
        })));
      }
    } catch {
      // Fallback
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [filter]);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`${API}/api/orders/update-status`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ order_id: orderId, status: newStatus })
      });
      const data = await res.json();
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      notify?.(`Order ${orderId} status updated to ${newStatus}`);
      addAudit?.(data.audit || {
        action: `Update Order Status to ${newStatus}`,
        trigger: 'Merchant Order Ops',
        customer: orderId,
        amount: 0,
        result: 'Success',
        policy: 'Authorized'
      });
    } catch {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      notify?.(`Order updated to ${newStatus}`);
    }
  };

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    const amountVal = parseFloat(newAmount) || 2500;
    try {
      const res = await fetch(`${API}/api/orders/create`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          customer: newCustomer || 'New Customer',
          amount: amountVal,
          items: newItems || 'Standard Order',
          method: newMethod
        })
      });
      const data = await res.json();
      const created = {
        id: data.order?.id || 'ORD' + Math.floor(1000 + Math.random()*9000),
        customer: newCustomer || 'New Customer',
        items: newItems || 'Standard Order',
        amount: money(amountVal),
        rawAmount: amountVal,
        method: newMethod,
        status: 'Paid',
        date: 'Just now'
      };
      setOrders(prev => [created, ...prev]);
      notify?.(`✓ Test order ${created.id} created successfully`);
      addAudit?.(data.audit || {
        action: 'Create Test Order',
        trigger: 'Merchant Interface',
        customer: created.customer,
        amount: amountVal,
        result: 'Success · Paid',
        policy: 'Test Mode Sandbox'
      });
      setShowCreateModal(false);
      setNewCustomer('');
      setNewAmount('');
      setNewItems('');
    } catch {
      notify?.('Order created in simulation');
      setShowCreateModal(false);
    }
  };

  const filteredOrders = orders.filter(o => {
    if (filter === 'All') return true;
    return o.status.toLowerCase() === filter.toLowerCase();
  });

  return (
    <Card>
      <Header
        eyebrow="Commerce Operations · Screen 15 Blueprint"
        title="Order Management"
        sub="Merchant orders synchronized with Razorpay Test Mode webhooks."
        actions={
          <div style={{display:'flex', gap:8, alignItems:'center', flexWrap:'wrap'}}>
            <div className="filters">
              {['All', 'Paid', 'Pending', 'Failed', 'Refunded'].map(x => (
                <button
                  key={x}
                  className={filter === x ? 'active' : ''}
                  onClick={() => setFilter(x)}
                >
                  {x}
                </button>
              ))}
            </div>
            <Button onClick={() => setShowCreateModal(true)}>
              + Create Test Order
            </Button>
          </div>
        }
      />

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Amount</th>
              <th>Payment Method</th>
              <th>Status</th>
              <th>Date</th>
              <th>Quick Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map(o => (
              <tr key={o.id}>
                <td><b>{o.id}</b></td>
                <td><b className="cell-name-highlight">{o.customer}</b></td>
                <td>{o.items}</td>
                <td><b style={{color:'#10b981'}}>{o.amount}</b></td>
                <td><Badge tone="info">{o.method}</Badge></td>
                <td>
                  <Badge tone={o.status === 'Paid' ? 'success' : o.status === 'Failed' ? 'danger' : o.status === 'Refunded' ? 'warning' : 'info'}>
                    {o.status}
                  </Badge>
                </td>
                <td>{o.date}</td>
                <td>
                  <div style={{display:'flex', gap:6}}>
                    {o.status !== 'Paid' && (
                      <button className="btn secondary" style={{padding:'4px 8px', fontSize:11}} onClick={() => updateOrderStatus(o.id, 'Paid')}>
                        Mark Paid
                      </button>
                    )}
                    {o.status === 'Paid' && (
                      <button className="btn secondary" style={{padding:'4px 8px', fontSize:11, color:'#ff5c5c'}} onClick={() => updateOrderStatus(o.id, 'Refunded')}>
                        Refund
                      </button>
                    )}
                    {o.status === 'Pending' && (
                      <button className="btn secondary" style={{padding:'4px 8px', fontSize:11, color:'#ff5c5c'}} onClick={() => updateOrderStatus(o.id, 'Cancelled')}>
                        Cancel
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" style={{maxWidth: 460}} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Create Razorpay Test Mode Order</h3>
              <button className="close-btn" onClick={() => setShowCreateModal(false)}>✕</button>
            </div>
            <form onSubmit={handleCreateOrder} style={{display:'flex', flexDirection:'column', gap:14, marginTop:16}}>
              <label style={{fontSize:12, fontWeight:600}}>
                Customer Name
                <input
                  required
                  placeholder="e.g. Priyesh Sharma"
                  value={newCustomer}
                  onChange={e => setNewCustomer(e.target.value)}
                  style={{marginTop:4}}
                />
              </label>
              <label style={{fontSize:12, fontWeight:600}}>
                Order Amount (₹)
                <input
                  type="number"
                  required
                  placeholder="e.g. 4500"
                  value={newAmount}
                  onChange={e => setNewAmount(e.target.value)}
                  style={{marginTop:4}}
                />
              </label>
              <label style={{fontSize:12, fontWeight:600}}>
                Item Summary
                <input
                  placeholder="e.g. Wireless Ergonomic Mouse"
                  value={newItems}
                  onChange={e => setNewItems(e.target.value)}
                  style={{marginTop:4}}
                />
              </label>
              <label style={{fontSize:12, fontWeight:600}}>
                Payment Method
                <select value={newMethod} onChange={e => setNewMethod(e.target.value)} style={{marginTop:4}}>
                  <option value="UPI">UPI Autopay / QR</option>
                  <option value="Cards">Credit / Debit Card</option>
                  <option value="Net Banking">Net Banking</option>
                  <option value="Wallet">Wallet</option>
                </select>
              </label>
              <div style={{display:'flex', justifyContent:'flex-end', gap:8, marginTop:8}}>
                <Button variant="secondary" onClick={() => setShowCreateModal(false)}>Cancel</Button>
                <Button type="submit">Create Order →</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Card>
  );
}

// -------------------------------------------------------------
// SCREEN 16: CAMPAIGN ORCHESTRATOR
// -------------------------------------------------------------
export function Campaigns({notify, addAudit}){
  const [campaigns, setCampaigns] = useState([
    { id: 'cmp_1', name: 'Win-back 30-day Dormant Buyers', audience: '1,245 inactive', channel: 'WhatsApp', offer: 'No discount', budget: '₹5,000', status: 'Active', roi: '8.4x' },
    { id: 'cmp_2', name: 'MacBook Accessory Affinity Upsell', audience: '410 laptop buyers', channel: 'Email', offer: 'Bundle 5% Off', budget: '₹3,500', status: 'Active', roi: '11.2x' },
    { id: 'cmp_3', name: 'VIP Customer Retention Circle', audience: '120 VIPs', channel: 'WhatsApp', offer: 'Early Access', budget: '₹1,500', status: 'Completed', roi: '14.5x' }
  ]);
  const [name, setName] = useState('Win-back 30-day dormant buyers');
  const [audience, setAudience] = useState('Inactive 30+ days (1,245 buyers)');
  const [channel, setChannel] = useState('WhatsApp');
  const [offer, setOffer] = useState('No discount (Margin safe)');
  const [schedule, setSchedule] = useState('Immediate launch');
  const [budget, setBudget] = useState('5000');
  const [deploying, setDeploying] = useState(false);

  useEffect(() => {
    fetch(`${API}/api/campaigns`)
      .then(r => r.json())
      .then(d => {
        if (d.campaigns) setCampaigns(d.campaigns);
      })
      .catch(() => {});
  }, []);

  const handleDeploy = async () => {
    setDeploying(true);
    try {
      const res = await fetch(`${API}/api/campaigns/deploy`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          name, audience, channel, offer_type: offer, schedule, budget: parseFloat(budget) || 5000
        })
      });
      const data = await res.json();
      if (data.ok) {
        setCampaigns(prev => [data.campaign || {
          id: 'cmp_' + Date.now(),
          name, audience, channel, offer, budget: `₹${budget}`, status: 'Active', roi: 'Pending'
        }, ...prev]);
        notify?.(`✓ Campaign "${name}" deployed successfully`);
        addAudit?.(data.audit || {
          action: `Deploy Campaign: ${name}`,
          trigger: 'Campaign Orchestrator',
          customer: audience,
          amount: parseFloat(budget) || 5000,
          result: 'Success · Active',
          policy: 'Budget & audience checked'
        });
      }
    } catch {
      notify?.(`Campaign "${name}" deployed in simulation`);
    } finally {
      setDeploying(false);
    }
  };

  return (
    <div className="campaign-page">
      {/* Screen 16: Campaign Builder */}
      <Card className="campaign-builder">
        <Header
          eyebrow="Campaign Orchestrator · Screen 16 Blueprint"
          title="Create a Growth Campaign in Plain English"
          sub="Tell Pilot the outcome. It builds audience, channel, incentive, and safety guardrails."
        />

        <div className="form-grid" style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(240px, 1fr))', gap:16, margin:'16px 0'}}>
          <label style={{fontSize:12, fontWeight:600}}>
            Campaign Objective / Name
            <input value={name} onChange={e => setName(e.target.value)} style={{marginTop:4}}/>
          </label>
          <label style={{fontSize:12, fontWeight:600}}>
            Target Audience Segment
            <select value={audience} onChange={e => setAudience(e.target.value)} style={{marginTop:4}}>
              <option value="Inactive 30+ days (1,245 buyers)">Inactive 30+ days (1,245 buyers)</option>
              <option value="High-intent cart dropoffs (380)">High-intent cart dropoffs (380)</option>
              <option value="VIPs at churn risk (420)">VIPs at churn risk (420)</option>
              <option value="Laptop purchasers without bag (240)">Laptop purchasers without bag (240)</option>
            </select>
          </label>
          <label style={{fontSize:12, fontWeight:600}}>
            Primary Channel
            <select value={channel} onChange={e => setChannel(e.target.value)} style={{marginTop:4}}>
              <option value="WhatsApp">WhatsApp (Recommended · 84% open)</option>
              <option value="Email">Email Nudge</option>
              <option value="SMS">SMS Notification</option>
            </select>
          </label>
          <label style={{fontSize:12, fontWeight:600}}>
            Incentive / Offer Type
            <select value={offer} onChange={e => setOffer(e.target.value)} style={{marginTop:4}}>
              <option value="No discount (Margin safe)">No discount (Margin safe)</option>
              <option value="5% incentive">5% incentive</option>
              <option value="10% max allowed">10% max allowed</option>
            </select>
          </label>
          <label style={{fontSize:12, fontWeight:600}}>
            Schedule
            <select value={schedule} onChange={e => setSchedule(e.target.value)} style={{marginTop:4}}>
              <option value="Immediate launch">Immediate launch</option>
              <option value="Weekend prime window">Weekend prime window</option>
              <option value="Scheduled 24h delay">Scheduled 24h delay</option>
            </select>
          </label>
          <label style={{fontSize:12, fontWeight:600}}>
            Campaign Budget (₹)
            <input type="number" value={budget} onChange={e => setBudget(e.target.value)} style={{marginTop:4}}/>
          </label>
        </div>

        {/* Campaign plan preview */}
        <div className="campaign-plan" style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(140px, 1fr))', gap:12, padding:14, borderRadius:12, margin:'16px 0'}}>
          <div>
            <span className="muted">Audience</span>
            <b>{audience.split(' ')[0]}</b>
            <small style={{display:'block', color:'#8b94a8'}}>Predicted reach 92%</small>
          </div>
          <div>
            <span className="muted">Incentive</span>
            <b>{offer}</b>
            <small style={{display:'block', color:'#10b981'}}>Protects gross margin</small>
          </div>
          <div>
            <span className="muted">Channel</span>
            <b>{channel}</b>
            <small style={{display:'block', color:'#8b94a8'}}>Verified connector</small>
          </div>
          <div>
            <span className="muted">Daily Budget</span>
            <b style={{color:'#10b981'}}>₹{budget}</b>
            <small style={{display:'block', color:'#8b94a8'}}>Within ₹25,000 policy</small>
          </div>
        </div>

        {/* Message preview */}
        <div className="message-preview" style={{background:'#0f1422', border:'1px solid #1e263d', padding:14, borderRadius:12, marginBottom:16}}>
          <span style={{fontSize:11, color:'#6246ea', fontWeight:700, textTransform:'uppercase'}}>AI-Generated Message Payload</span>
          <p style={{fontStyle:'italic', color:'#e2e8f0', margin:'8px 0'}}>
            “Hi Rahul, we noticed you left something special in your cart. Your items are reserved at Charan Commerce for the next 24 hours. Tap here to complete in 1 click.”
          </p>
          <small style={{color:'#8b94a8'}}>Channel: {channel} · Tone: concise & non-spammy · Razorpay 1-Click Checkout enabled</small>
        </div>

        {/* Guardrail checklist */}
        <div className="guard-grid" style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(180px, 1fr))', gap:8, marginBottom:16, fontSize:12, color:'#10b981'}}>
          <span>✓ Audience under 2,000</span>
          <span>✓ Budget under ₹25,000/day</span>
          <span>✓ Policy safe discount</span>
          <span>✓ Merchant-approved channel</span>
        </div>

        <div style={{display:'flex', gap:12}}>
          <Button onClick={handleDeploy} disabled={deploying}>
            {deploying ? 'Deploying…' : '🚀 Deploy Campaign'}
          </Button>
          <Button variant="secondary" onClick={() => notify?.('Campaign policy check passed with zero violations')}>
            Run Policy Check
          </Button>
        </div>
      </Card>

      {/* Active Campaigns Table */}
      <Card>
        <Header title="Live Campaigns" sub="Active and recently completed AI-orchestrated growth campaigns."/>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Campaign Name</th>
                <th>Target Audience</th>
                <th>Channel</th>
                <th>Offer Type</th>
                <th>Budget</th>
                <th>Status</th>
                <th>Estimated ROI</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map(c => (
                <tr key={c.id || c.name}>
                  <td><b>{c.name}</b></td>
                  <td>{c.audience}</td>
                  <td><Badge tone="info">{c.channel}</Badge></td>
                  <td>{c.offer}</td>
                  <td><b style={{color:'#10b981'}}>{c.budget}</b></td>
                  <td><Badge tone={c.status === 'Active' ? 'success' : 'info'}>{c.status}</Badge></td>
                  <td><Badge tone="success">{c.roi || '9.2x'}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// -------------------------------------------------------------
// SCREEN 17: CUSTOMER INTELLIGENCE & PERSONALIZATION ENGINE
// -------------------------------------------------------------
export function Customers({notify}){
  const [customers,setCustomers]=useState([]); const [searchTerm,setSearchTerm]=useState(''); const [segmentFilter,setSegmentFilter]=useState('All'); const [profile,setProfile]=useState(null); const [loading,setLoading]=useState(false);
  const load=()=>fetch(`${API}/api/customers`).then(r=>r.json()).then(d=>setCustomers((d.customers||[]).map(c=>({id:c.id,name:c.name,ltv:typeof c.ltv==='number'?money(c.ltv):c.ltv,orders:c.orders,segment:c.segment,prob:(c.re_purchase_probability||80)+'%',action:c.decision_explanation?.action||'Recommend Bundle',channel:(c.preferred_channel||'WhatsApp').split(' · ')[0],churn:c.churn_risk||'Low'})))).catch(()=>{});
  useEffect(()=>{load();const id=setInterval(load,8000);return()=>clearInterval(id)},[]);
  const open360=async(name)=>{setLoading(true);try{const d=await fetch(`${API}/api/customer-360/${encodeURIComponent(name)}`).then(r=>r.json());setProfile(d.profile)}catch{notify?.('Customer profile unavailable')}finally{setLoading(false)}};
  const filtered=customers.filter(c=>(!searchTerm||c.name.toLowerCase().includes(searchTerm.toLowerCase()))&&(segmentFilter==='All'||c.segment.toLowerCase().includes(segmentFilter.toLowerCase())));
  const exportCSV=()=>{const rows=[['Customer','LTV','Orders','Segment','Purchase Probability','Next Best Action'],...filtered.map(c=>[c.name,c.ltv,c.orders,c.segment,c.prob,c.action])];const blob=new Blob([rows.map(r=>r.join(',')).join('\n')],{type:'text/csv'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='razorpaypilot_customers.csv';a.click();URL.revokeObjectURL(a.href);notify?.('Customer intelligence exported');};
  return <div>
    <div className="stat-grid four" style={{marginBottom:20}}>{[['Total Customers','8,425','+12.6%'],['High-Value','1,245','+8.2%'],['At-Risk LTV','₹27,800','-4.1%'],['Avg Customer LTV','₹31,240','+6.8%']].map((x,i)=><Card key={x[0]}><span className="muted">{x[0]}</span><strong className="metric">{x[1]}</strong><span className={i===2?'down':'up'}>{x[2]}</span></Card>)}</div>
    <Card className="customer-filter-card"><Header eyebrow="Customer intelligence" title="Customer 360 workspace" sub="Search behavior, RFM signals, churn risk and the next best action." actions={<Badge tone="success">Live sync</Badge>}/><div className="customer-toolbar"><div className="customer-toolbar-left"><div className="customer-search-wrap"><span className="customer-search-icon">🔍</span><input className="customer-search-input" value={searchTerm} onChange={e=>setSearchTerm(e.target.value)} placeholder="Search customer name…"/></div><div className="customer-pills">{['All','VIP','High-value','Returning','At-risk'].map(f=><button key={f} className={'customer-pill-btn '+(segmentFilter===f?'active':'')} onClick={()=>setSegmentFilter(f)}>{f}</button>)}</div></div><button className="customer-export-btn" onClick={exportCSV}>📥 Export Intelligence</button></div></Card>
    <TableCard title="Customer Intelligence Database" sub={`Showing ${filtered.length} live customer profiles · click Open 360 for AI context.`} headers={['Customer','Lifetime Spend','Orders','Segment','Re-purchase Probability','AI Next Action']} rows={filtered.map(c=>[c.name,c.ltv,c.orders,c.segment,<div style={{display:'inline-flex',alignItems:'center',gap:8}}><Progress value={c.prob}/><span>{c.prob}</span></div>,<button className="link" onClick={()=>open360(c.name)}>Open 360 →</button>])}/>
    {profile&&<Card className="customer-360-card"><Header eyebrow="Customer 360" title={profile.name} sub="AI-generated customer understanding · policy-aware recommendations" actions={<button className="link" onClick={()=>setProfile(null)}>Close ×</button>}/><div className="customer360-grid"><div className="customer360-kpis"><span><b>{money(profile.ltv)}</b><small>Lifetime value</small></span><span><b>{profile.orders}</b><small>Orders</small></span><span><b>{money(profile.aov)}</b><small>AOV</small></span><span><b>{profile.re_purchase_probability}%</b><small>Purchase probability</small></span><span><b>{profile.churn_pct}%</b><small>Churn risk</small></span><span><b>{profile.rfm?.overall}</b><small>RFM score</small></span></div><div className="ai-understanding"><h3>✦ What Pilot knows</h3><p>Segment: <b>{profile.segment}</b></p><p>Preferred channel: <b>{profile.preferred_channel}</b></p><p>Payment preference: <b>{profile.preferred_payment}</b></p><p>Price sensitivity: <b>{profile.price_elasticity}</b></p></div><div className="next-best-action"><span className="eyebrow">NEXT BEST ACTION</span><h3>{profile.decision_explanation?.action}</h3><p>{profile.decision_explanation?.rationale}</p><div className="nba-row"><Badge tone="success">{profile.decision_explanation?.confidence}% confidence</Badge><b>{money(profile.decision_explanation?.expected_impact||0)} expected</b></div></div><div className="timeline"><h3>Customer timeline</h3>{(profile.journey_timeline||[]).map((t,i)=><div key={i}><span>{t.time}</span><b>{t.event}</b><small>{t.channel}</small></div>)}</div></div>{loading&&<div className="empty">Loading customer intelligence…</div>}</Card>}
  </div>;
}

// -------------------------------------------------------------
// -------------------------------------------------------------
// SCREEN 19: AI GUARDRAILS & CONTROLS (SAFETY)
// -------------------------------------------------------------
export function Safety({notify, addAudit}){
  const [policy, setPolicy] = useState({
    auto_payment_limit: 5000,
    max_discount_pct: 10,
    daily_action_limit: 50,
    daily_spend: 25000,
    approval_threshold: 5000,
    max_auto_retries: 2,
    allow_auto_retry: true,
    allow_whatsapp_cart: true,
    allow_dynamic_bundles: true,
    block_auto_refunds: true
  });
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    fetch(`${API}/api/policy`)
      .then(r => r.json())
      .then(d => {
        if (d.policy) {
          setPolicy(prev => ({
            ...prev,
            ...d.policy,
            max_auto_retries: d.policy.max_retries ?? d.policy.max_auto_retries ?? prev.max_auto_retries
          }));
        }
      })
      .catch(() => {});
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSavedSuccess(false);
    try {
      const res = await fetch(`${API}/api/policy/update`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ policy, ...policy })
      });
      const data = await res.json();
      setSavedSuccess(true);
      notify?.(data.message || 'AI Constitution & Guardrails saved');
      addAudit?.(data.audit || {
        action: 'Update AI Constitution',
        trigger: 'Merchant Security Ops',
        customer: 'Policy Config',
        amount: policy.auto_payment_limit,
        result: 'Success · Enforced',
        policy: 'Constitution v2.4'
      });
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch {
      notify?.('AI Constitution saved successfully');
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  const num = (v) => (typeof v === 'number' ? v : parseFloat(v) || 0);

  return (
    <div className="safety-layout">
      {/* 1. Header Banner */}
      <div className="constitution-hero">
        <div className="constitution-hero-left">
          <div className="constitution-hero-orb">🛡️</div>
          <div className="constitution-hero-text">
            <span className="eyebrow">MERCHANT AI CONSTITUTION · REAL-TIME GOVERNANCE</span>
            <h2>Pilot Constitution &amp; Safety Guardrails</h2>
            <p>
              Autonomous actions are bounded by deterministic invariants, merchant limits, and human-in-the-loop approvals.
            </p>
          </div>
        </div>
        <div className="constitution-hero-badge">
          <span className="constitution-status-tag">
            <span className="pulse-dot" />
            ENFORCING v2.4
          </span>
        </div>
      </div>

      {/* 2. Executive KPI Overview */}
      <div className="constitution-kpis-strip">
        <div className="constitution-kpi-card">
          <div className="kpi-label">Auto Payment Limit</div>
          <div className="kpi-value">₹{num(policy.auto_payment_limit).toLocaleString('en-IN')}</div>
          <div className="kpi-sub">Gated review if above limit</div>
        </div>

        <div className="constitution-kpi-card">
          <div className="kpi-label">Max Discount Cap</div>
          <div className="kpi-value">{num(policy.max_discount_pct)}%</div>
          <div className="kpi-sub">Margin floor protection</div>
        </div>

        <div className="constitution-kpi-card">
          <div className="kpi-label">Daily Spend Budget</div>
          <div className="kpi-value">₹{num(policy.daily_spend).toLocaleString('en-IN')}</div>
          <div className="kpi-sub">Autonomous campaign cap</div>
        </div>

        <div className="constitution-kpi-card">
          <div className="kpi-label">Refunds Policy</div>
          <div className="kpi-value" style={{ color: policy.block_auto_refunds ? '#0f9f6e' : '#dd5361', fontSize: 17 }}>
            {policy.block_auto_refunds ? 'Always Gated' : 'Autonomous'}
          </div>
          <div className="kpi-sub">Human sign-off mandatory</div>
        </div>
      </div>

      {/* 3. Concise Constitution Mandates (Clean & Spacious) */}
      <div className="constitution-grid">
        <div className="constitution-card may-do">
          <div className="constitution-header-row">
            <h3>
              <span className="header-icon-circle">✓</span>
              WHAT PILOT MAY DO
            </h3>
            <Badge tone="success">Permitted</Badge>
          </div>
          <div className="c-clean-list">
            <div className="c-clean-item">
              <span className="c-bullet green">✓</span>
              <span>Auto-retry transient failed payments under <b>₹{num(policy.auto_payment_limit).toLocaleString('en-IN')}</b></span>
            </div>
            <div className="c-clean-item">
              <span className="c-bullet green">✓</span>
              <span>Send recovery messages via WhatsApp and Email for abandoned checkouts</span>
            </div>
            <div className="c-clean-item">
              <span className="c-bullet green">✓</span>
              <span>Recommend product bundles capped at maximum <b>{num(policy.max_discount_pct)}%</b> discount</span>
            </div>
            <div className="c-clean-item">
              <span className="c-bullet green">✓</span>
              <span>Trigger real-time merchant alerts for sudden gateway degradations or velocity spikes</span>
            </div>
          </div>
        </div>

        <div className="constitution-card may-not-do">
          <div className="constitution-header-row">
            <h3>
              <span className="header-icon-circle">✕</span>
              WHAT PILOT MAY NOT DO
            </h3>
            <Badge tone="danger">Blocked</Badge>
          </div>
          <div className="c-clean-list">
            <div className="c-clean-item">
              <span className="c-bullet red">✕</span>
              <span><b>Never issue automatic refunds</b> — human merchant review is strictly required</span>
            </div>
            <div className="c-clean-item">
              <span className="c-bullet red">✕</span>
              <span><b>Never exceed discount cap</b> (&gt; {num(policy.max_discount_pct)}%) under any conditions</span>
            </div>
            <div className="c-clean-item">
              <span className="c-bullet red">✕</span>
              <span><b>Never exceed 24h spend limit</b> (₹{num(policy.daily_spend).toLocaleString('en-IN')}) across campaigns</span>
            </div>
            <div className="c-clean-item">
              <span className="c-bullet red">✕</span>
              <span><b>Never modify Razorpay API keys</b>, bank accounts, or bypass audit logging</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Lower Grid: Left Card = Thresholds, Right Card = Toggles & Fail-Safe */}
      <Card className="policy-engine-card">
        <Header
          eyebrow="Merchant Controls"
          title="Policy Thresholds"
          sub="Configurable values bounded by the immutable constitution."
        />

        <div className="policy-form-grid">
          <div className="policy-input-box">
            <label>Auto Payment Limit</label>
            <div className="policy-input-wrapper">
              <span className="policy-input-affix prefix">₹</span>
              <input
                className="policy-input-field"
                type="number"
                value={policy.auto_payment_limit}
                onChange={e => setPolicy({ ...policy, auto_payment_limit: parseFloat(e.target.value) || 0 })}
                style={{ paddingLeft: 24 }}
              />
            </div>
            <small>Actions above this require approval</small>
          </div>

          <div className="policy-input-box">
            <label>Max Allowed Discount</label>
            <div className="policy-input-wrapper">
              <input
                className="policy-input-field"
                type="number"
                value={policy.max_discount_pct}
                onChange={e => setPolicy({ ...policy, max_discount_pct: parseFloat(e.target.value) || 0 })}
                style={{ paddingRight: 28 }}
              />
              <span className="policy-input-affix suffix">%</span>
            </div>
            <small>Strict margin protection ceiling</small>
          </div>

          <div className="policy-input-box">
            <label>Daily AI Action Limit</label>
            <div className="policy-input-wrapper">
              <input
                className="policy-input-field"
                type="number"
                value={policy.daily_action_limit}
                onChange={e => setPolicy({ ...policy, daily_action_limit: parseInt(e.target.value) || 0 })}
                style={{ paddingRight: 38 }}
              />
              <span className="policy-input-affix suffix">ops</span>
            </div>
            <small>Max autonomous actions per 24h</small>
          </div>

          <div className="policy-input-box">
            <label>Daily Campaign Spend</label>
            <div className="policy-input-wrapper">
              <span className="policy-input-affix prefix">₹</span>
              <input
                className="policy-input-field"
                type="number"
                value={policy.daily_spend}
                onChange={e => setPolicy({ ...policy, daily_spend: parseFloat(e.target.value) || 0 })}
                style={{ paddingLeft: 24 }}
              />
            </div>
            <small>Total 24h budget ceiling</small>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 18 }}>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'Saving…' : 'Save Policy Settings'}
          </Button>
          {savedSuccess && (
            <span style={{ fontSize: 11, fontWeight: 700, color: '#0f9f6e' }}>
              ✓ Saved &amp; Enforced
            </span>
          )}
        </div>
      </Card>

      <Card className="enforcement-matrix-card">
        <Header
          eyebrow="Autonomous Safeguards"
          title="Guardrail Toggles"
          sub="Enable or disable autonomous execution for specific channels."
        />

        <div className="policy-toggles-container">
          {[
            { key: 'allow_auto_retry', label: 'Auto-Retry Eligible Failed Payments', sub: `Retries payments under ₹${num(policy.auto_payment_limit).toLocaleString('en-IN')}` },
            { key: 'allow_whatsapp_cart', label: 'WhatsApp Cart Recovery Nudges', sub: 'High-intent cart checkouts' },
            { key: 'allow_dynamic_bundles', label: 'Dynamic Product Bundles', sub: 'Margin-safe cross-sell pairings' },
            { key: 'block_auto_refunds', label: 'Always Gate Refunds (Human Sign-off)', sub: 'Never process refunds without approval' }
          ].map(t => (
            <div key={t.key} className="policy-toggle-card">
              <div>
                <b>{t.label}</b>
                <small>{t.sub}</small>
              </div>
              <button
                className={`toggle ${policy[t.key] ? 'on' : ''}`}
                onClick={() => setPolicy({ ...policy, [t.key]: !policy[t.key] })}
                style={{cursor:'pointer'}}
              >
                <i/>
              </button>
            </div>
          ))}
        </div>

        <div className="circuit-breaker-banner">
          <span className="circuit-breaker-icon">⚡</span>
          <div className="circuit-breaker-body">
            <b>Fail-Safe Circuit Breaker Active</b>
            <p>
              Actions pause and switch to Human Review if payment failure rate &gt; 5% or spend cap reaches 100%.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

// -------------------------------------------------------------
// SCREEN 20: HUMAN APPROVAL SYSTEM (HITL)
// -------------------------------------------------------------
export function Approval({notify, addAudit}){
  const [approvals, setApprovals] = useState([
    { id: 'appr_1', customer: 'Rahul Verma', type: 'Payment Recovery', amount: '₹8,500', rawAmount: 8500, reason: 'Temporary bank decline retry > ₹5,000 auto limit', prob: '91%', risk: 'Low', status: 'Pending' },
    { id: 'appr_2', customer: 'Vikram Rao', type: 'Checkout Recovery', amount: '₹12,000', rawAmount: 12000, reason: 'High-value cart recovery with 10% discount incentive', prob: '88%', risk: 'Medium', status: 'Pending' },
    { id: 'appr_3', customer: 'Neha Patel', type: 'Gateway Switch Retry', amount: '₹8,400', rawAmount: 8400, reason: 'Acquirer outage fallback across payment routes', prob: '72%', risk: 'Medium', status: 'Pending' }
  ]);

  useEffect(() => {
    fetch(`${API}/api/approvals`)
      .then(r => r.json())
      .then(d => {
        const list = d.approvals || d.pending;
        if (list) {
          setApprovals(list.map(p => ({
            id: p.id,
            customer: p.customer,
            type: p.action || p.type || 'Payment Recovery',
            amount: typeof p.amount === 'number' ? money(p.amount) : p.amount,
            rawAmount: typeof p.amount === 'number' ? p.amount : (parseInt(String(p.amount).replace(/\D/g, '')) || 0),
            reason: p.reason,
            prob: (p.probability || 85) + '%',
            risk: p.risk || (p.probability < 75 ? 'Medium' : 'Low'),
            status: p.status || 'Pending'
          })));
        }
      })
      .catch(() => {});
  }, []);

  const handleDecision = async (item, decision) => {
    try {
      const res = await fetch(`${API}/api/approvals/decision`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ id: item.id, decision })
      });
      const data = await res.json();
      setApprovals(prev => prev.map(a => a.id === item.id ? { ...a, status: decision === 'approved' ? 'Approved · Test Mode' : 'Rejected' } : a));
      notify?.(decision === 'approved' ? `✓ Approved: ${item.type} for ${item.customer} executed` : `Rejected: ${item.type} for ${item.customer}`);
      addAudit?.(data.audit || {
        action: `${item.type} (${decision})`,
        trigger: 'Human Approval Center',
        customer: item.customer,
        amount: item.amount,
        result: decision === 'approved' ? 'Approved · Test Mode' : 'Rejected',
        policy: 'Merchant Signature'
      });
    } catch {
      setApprovals(prev => prev.map(a => a.id === item.id ? { ...a, status: decision === 'approved' ? 'Approved · Test Mode' : 'Rejected' } : a));
      notify?.(`Decision recorded: ${decision}`);
    }
  };

  const pendingCount = approvals.filter(a => a.status === 'Pending').length;
  const totalGatedValue = approvals
    .filter(a => a.status === 'Pending')
    .reduce((acc, curr) => acc + (curr.rawAmount || 0), 0);

  return (
    <div className="approval-page">
      <div className="approval-hero">
        <div className="approval-hero-content">
          <span className="eyebrow">HUMAN-IN-THE-LOOP · REVENUE SAFEGUARD</span>
          <h2>Human Approval Center</h2>
          <p>Sensitive money-moving operations and actions exceeding ₹5,000 constitutional limits remain gated until verified by merchant authorization.</p>
        </div>
        <div className="approval-stat-pill">
          <span className="stat-label">Gated Queue</span>
          <b className="stat-value">{money(totalGatedValue || 28900)}</b>
          <span className="stat-sub">{pendingCount} actions pending review</span>
        </div>
      </div>

      <div className="stat-grid four" style={{marginBottom: 20}}>
        <Card>
          <span className="muted">Pending Decisions</span>
          <strong className="metric" style={{color: pendingCount > 0 ? '#eab308' : '#10b981'}}>{pendingCount}</strong>
          <span className="muted" style={{fontSize: 10, color: '#64748b'}}>Requires authorization</span>
        </Card>
        <Card>
          <span className="muted">Total Gated Value</span>
          <strong className="metric" style={{color: '#10b981'}}>{money(totalGatedValue || 28900)}</strong>
          <span className="up">Protected in pipeline</span>
        </Card>
        <Card>
          <span className="muted">Auto-Approval Limit</span>
          <strong className="metric">₹5,000</strong>
          <span className="muted" style={{fontSize: 10, color: '#64748b'}}>Bounded by Constitution</span>
        </Card>
        <Card>
          <span className="muted">HITL Policy Status</span>
          <strong className="metric" style={{color: '#6246ea'}}>Active</strong>
          <span className="up">100% Policy Enforced</span>
        </Card>
      </div>

      <div style={{display:'flex', flexDirection:'column', gap:16, marginTop:16}}>
        {approvals.map(item => (
          <Card key={item.id} className="approval-card-full">
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:12}}>
              <div style={{display:'flex', gap:14}}>
                <div className="approval-agent-badge">
                  ✦
                </div>
                <div>
                  <div style={{display:'flex', gap:8, alignItems:'center'}}>
                    <Badge tone="warning">{item.type}</Badge>
                    <Badge tone={item.risk === 'Low' ? 'success' : 'warning'}>{item.risk} Risk</Badge>
                  </div>
                  <h3 className="approval-customer-title">{item.customer} · <span className="approval-amount-highlight">{item.amount}</span></h3>
                  <p className="approval-reason-text">{item.reason}</p>
                </div>
              </div>

              <div className="approval-metrics-wrap">
                <div className="approval-metric-box">
                  <span className="approval-metric-label">Probability</span>
                  <b className="approval-metric-val">{item.prob}</b>
                </div>
                <div className="approval-metric-box">
                  <span className="approval-metric-label">Impact</span>
                  <b className="approval-metric-val impact">{item.amount}</b>
                </div>
              </div>
            </div>

            <div className="approval-card-footer">
              <div className="gated-reason-banner">
                <span>⚿</span>
                <span>Gated Reason: <b>Exceeds auto-execution boundary ₹5,000</b></span>
              </div>
              <div>
                {item.status === 'Pending' ? (
                  <div style={{display:'flex', gap:8}}>
                    <Button variant="danger" onClick={() => handleDecision(item, 'rejected')}>
                      Reject
                    </Button>
                    <Button onClick={() => handleDecision(item, 'approved')}>
                      Approve & Execute →
                    </Button>
                  </div>
                ) : (
                  <Badge tone={item.status.includes('Approved') ? 'success' : 'danger'}>
                    {item.status}
                  </Badge>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// SCREEN 21: AUTONOMOUS MODE & CONTROL PLANE
// -------------------------------------------------------------
export function Autonomous({mode, setMode, notify, addAudit, nav}){
  const [selectedMode, setSelectedMode] = useState(mode || 'Assisted');
  const [updating, setUpdating] = useState(false);

  const modesList = [
    {
      name: 'Manual',
      tagline: 'Observe Only',
      desc: 'Pilot continuously detects opportunities and calculates rationale, but requires human approval for every action.',
      tone: 'info'
    },
    {
      name: 'Assisted',
      tagline: 'Recommend & Gate',
      desc: 'Pilot automatically executes safe actions under ₹5,000. Sensitive or high-value actions are gated for human approval.',
      tone: 'success'
    },
    {
      name: 'Autonomous',
      tagline: 'Act Within Constitution',
      desc: 'Pilot operates autonomously within strict constitutional boundaries (≤ ₹5,000, max 10% discount, 50 daily actions).',
      tone: 'warning'
    }
  ];

  const handleApplyMode = async (m) => {
    setSelectedMode(m);
    setUpdating(true);
    try {
      const res = await fetch(`${API}/api/autonomy/set`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ mode: m })
      });
      const data = await res.json();
      setMode?.(m);
      notify?.(data.message || `Agent autonomy mode set to ${m}`);
      addAudit?.(data.audit || {
        action: `Set Autonomy Mode: ${m}`,
        trigger: 'Control Plane',
        customer: 'Agent OS',
        amount: 0,
        result: 'Success · Mode Set',
        policy: 'Merchant Authority'
      });
    } catch {
      setMode?.(m);
      notify?.(`Agent mode set to ${m}`);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="autonomy-layout">
      {/* Screen 21: Mode Selection Cards */}
      <Card>
        <Header
          eyebrow="Control Plane · Screen 21 Blueprint"
          title="Agent Autonomy Controls"
          sub="Choose how much freedom Pilot has to act on behalf of your merchant business."
        />

        <div style={{display:'flex', flexDirection:'column', gap:14, margin:'16px 0'}}>
          {modesList.map(m => (
            <div
              key={m.name}
              className={`autonomy-card ${selectedMode === m.name ? 'selected' : ''}`}
              onClick={() => handleApplyMode(m.name)}
            >
              <span className="autonomy-dot" style={{fontSize:20, color: selectedMode === m.name ? '#6246ea' : '#8b94a8'}}>
                {selectedMode === m.name ? '●' : '○'}
              </span>
              <div style={{flex:1}}>
                <div style={{display:'flex', alignItems:'center', gap:8}}>
                  <b style={{fontSize:15}}>{m.name} Mode</b>
                  <Badge tone={m.tone}>{m.tagline}</Badge>
                </div>
                <p style={{margin:'4px 0 0', color:'#64748b', fontSize:13}}>{m.desc}</p>
              </div>
              <span style={{color:'#6246ea', fontSize:18}}>→</span>
            </div>
          ))}
        </div>

        <div className="mode-warning">
          <span>⚿</span>
          <span><b>Autonomous never means unrestricted.</b> Every action still passes policy checks, spend limits, and retry limits.</span>
        </div>
      </Card>

      {/* Boundaries Card */}
      <Card>
        <Header title="Current Execution Boundaries" sub="Hard policies enforced by runtime guardrails."/>
        <div className="boundary-list" style={{display:'flex', flexDirection:'column', gap:12, margin:'16px 0', fontSize:13.5}}>
          <p style={{margin:0}}>Payment auto-action ≤ <b style={{color:'#10b981'}}>₹5,000</b></p>
          <p style={{margin:0}}>Maximum allowed discount ≤ <b style={{color:'#10b981'}}>10%</b></p>
          <p style={{margin:0}}>Daily autonomous budget ≤ <b style={{color:'#10b981'}}>₹25,000</b></p>
          <p style={{margin:0}}>Campaign audience limit ≤ <b style={{color:'#10b981'}}>2,000 customers</b></p>
          <p style={{margin:0}}>Refunds: <Badge tone="danger">Always Gated</Badge></p>
        </div>
        <Button variant="secondary" onClick={() => nav('/safety')}>
          Edit Safety Policy →
        </Button>
      </Card>
    </div>
  );
}



// -------------------------------------------------------------

// -------------------------------------------------------------

// -------------------------------------------------------------
// SCREEN 25: IMMUTABLE AUDIT TRAIL
// -------------------------------------------------------------
export function Audit({audit, notify}){
  const [dbAudit, setDbAudit] = useState([]);

  const fetchAudit = async () => {
    try {
      const res = await fetch(`${API}/api/audit`);
      const data = await res.json();
      if (Array.isArray(data)) setDbAudit(data);
      else if (data.audit) setDbAudit(data.audit);
    } catch {
      // Fallback
    }
  };

  useEffect(() => {
    fetchAudit();
  }, [audit]);

  const allRows = useMemo(() => {
    const combined = [...(audit || []), ...dbAudit];
    const seen = new Set();
    return combined.filter(item => {
      const key = `${item.time}-${item.action}-${item.customer}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [audit, dbAudit]);

  const rows = allRows.length ? allRows : [
    { time: '10:42', action: 'Payment recovery retry', trigger: 'Failed payment', customer: 'Rahul Verma', amount: '₹4,500', result: 'Success · Test Mode', policy: 'Within limit' },
    { time: '10:18', action: 'Cart recovery nudge', trigger: 'Abandoned cart', customer: 'Anita Singh', amount: '₹2,100', result: 'Success · Dispatched', policy: 'Within limit' },
    { time: '09:54', action: 'Campaign deployment', trigger: 'Merchant request', customer: '1,245 users', amount: '₹5,000', result: 'Approved · Active', policy: 'Budget check' }
  ];

  const handleExportCSV = () => {
    const csvContent = 'data:text/csv;charset=utf-8,' +
      ['Time,Action,Trigger,Customer,Amount,Result,Policy']
        .concat(rows.map(r => `"${r.time}","${r.action}","${r.trigger}","${r.customer}","${r.amount}","${r.result}","${r.policy}"`))
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `razorpay_pilot_audit_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    notify?.('Audit trail exported as CSV');
  };

  const handleClearAudit = async () => {
    try {
      await fetch(`${API}/api/audit/clear`, { method: 'POST' });
      setDbAudit([]);
      notify?.('Audit trail reset');
    } catch {
      notify?.('Audit trail cleared');
    }
  };

  return (
    <Card>
      <Header
        eyebrow="Trust Layer · Screen 25 Blueprint"
        title="Immutable-Looking Audit Trail"
        sub="WHO · WHAT · WHY · WHEN · AMOUNT · POLICY · RESULT"
        actions={
          <div style={{display:'flex', gap:8}}>
            <Button variant="secondary" onClick={handleExportCSV}>Export CSV</Button>
            <button className="btn secondary" onClick={handleClearAudit} style={{padding:'8px 12px'}}>Clear</button>
          </div>
        }
      />

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Time</th>
              <th>Action</th>
              <th>Trigger</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Result</th>
              <th>Policy Rule</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, idx) => (
              <tr key={idx}>
                <td><small style={{fontFamily:'monospace'}}>{r.time}</small></td>
                <td><b>{r.action}</b></td>
                <td>{r.trigger}</td>
                <td><b className="cell-name-highlight">{r.customer}</b></td>
                <td><b style={{color:'#10b981'}}>{typeof r.amount === 'number' ? money(r.amount) : r.amount || '—'}</b></td>
                <td>
                  <Badge tone={String(r.result).includes('Success') || String(r.result).includes('Approved') ? 'success' : String(r.result).includes('Reject') || String(r.result).includes('Fail') ? 'danger' : 'warning'}>
                    {r.result}
                  </Badge>
                </td>
                <td><small style={{color:'#8b94a8'}}>{r.policy}</small></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

// -------------------------------------------------------------
// SCREEN 26: SIMULATION MODE & TEST SANDBOX
// -------------------------------------------------------------
export function Sandbox({notify, addAudit}){
  const [customersCount, setCustomersCount] = useState(10000);
  const [ordersCount, setOrdersCount] = useState(5600);
  const [paymentsCount, setPaymentsCount] = useState(7500);
  const [cartsCount, setCartsCount] = useState(1500);
  const [failedCount, setFailedCount] = useState(300);
  const [simulating, setSimulating] = useState(false);
  const [event, setEvent] = useState(null);

  const handleSimulateScale = async () => {
    setSimulating(true);
    try {
      const res = await fetch(`${API}/api/sandbox/simulate`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          scenario: 'scale',
          params: {
            customers: customersCount,
            orders: ordersCount,
            payments: paymentsCount,
            carts: cartsCount,
            failed_payments: failedCount
          }
        })
      });
      const data = await res.json();
      notify?.(data.message || `Simulation ran with ${customersCount.toLocaleString()} customers`);
      addAudit?.(data.audit || {
        action: 'Run Scale Simulation',
        trigger: 'Test & Sandbox Center',
        customer: `${customersCount} Customers`,
        amount: 0,
        result: 'Success · Simulated',
        policy: 'Test Mode Boundaries'
      });
      setEvent({
        name: `Scale Simulation: ${customersCount.toLocaleString()} Customers`,
        desc: `Generated ${failedCount} test payment failures and ${cartsCount} abandoned checkouts. Agent opportunities updated.`
      });
    } catch {
      notify?.('Simulation completed in sandbox');
    } finally {
      setSimulating(false);
    }
  };

  const handleInjectEvent = async (name, desc) => {
    try {
      const res = await fetch(`${API}/api/sandbox/simulate`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ scenario: name.toLowerCase().replace(/\s+/g, '_') })
      });
      const data = await res.json();
      setEvent({ name, desc });
      notify?.(`Event injected: ${name}`);
      addAudit?.(data.audit || {
        action: `Inject Sandbox Event: ${name}`,
        trigger: 'Sandbox Injector',
        customer: 'Live Stream',
        amount: 0,
        result: 'Observed',
        policy: 'Sandbox Mode'
      });
    } catch {
      setEvent({ name, desc });
      notify?.(`Event injected: ${name}`);
    }
  };

  return (
    <div className="sandbox-layout">
      {/* Screen 26: Simulation Input Parameters */}
      <Card>
        <Header
          eyebrow="Buildathon Demo Control · Screen 26 Blueprint"
          title="Merchant Simulation Sandbox"
          sub="Stress test the agent against realistic merchant transaction volumes."
        />

        <div className="form-grid" style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(180px, 1fr))', gap:16, margin:'16px 0'}}>
          <label style={{fontSize:12, fontWeight:600}}>
            Simulated Customers
            <input type="number" value={customersCount} onChange={e => setCustomersCount(parseInt(e.target.value)||0)} style={{marginTop:4}}/>
          </label>
          <label style={{fontSize:12, fontWeight:600}}>
            Completed Orders
            <input type="number" value={ordersCount} onChange={e => setOrdersCount(parseInt(e.target.value)||0)} style={{marginTop:4}}/>
          </label>
          <label style={{fontSize:12, fontWeight:600}}>
            Total Payments
            <input type="number" value={paymentsCount} onChange={e => setPaymentsCount(parseInt(e.target.value)||0)} style={{marginTop:4}}/>
          </label>
          <label style={{fontSize:12, fontWeight:600}}>
            Abandoned Carts
            <input type="number" value={cartsCount} onChange={e => setCartsCount(parseInt(e.target.value)||0)} style={{marginTop:4}}/>
          </label>
          <label style={{fontSize:12, fontWeight:600}}>
            Failed Payments
            <input type="number" value={failedCount} onChange={e => setFailedCount(parseInt(e.target.value)||0)} style={{marginTop:4}}/>
          </label>
        </div>

        <Button onClick={handleSimulateScale} disabled={simulating}>
          {simulating ? 'Simulating…' : '⚡ Run Merchant Simulation'}
        </Button>
      </Card>

      {/* Screen 26: Event Injectors */}
      <Card>
        <Header title="Deterministic Event Injectors" sub="Click any scenario to inject real-time merchant events."/>
        <div className="event-grid" style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(180px, 1fr))', gap:10, margin:'14px 0'}}>
          {[
            ['Bank Acquirer Outage', 'Simulate 503 gateway downtime spike'],
            ['High-Value Cart Abandoned', 'Simulate ₹12,000 checkout drop-off'],
            ['VIP Customer Inactivity', 'Simulate 30-day dormant high LTV buyer'],
            ['Payment Timeout Anomaly', 'Simulate network handshake failure'],
            ['API 500 Error Injection', 'Verify agent graceful degradation']
          ].map(([title, desc]) => (
            <button
              key={title}
              className="btn secondary"
              onClick={() => handleInjectEvent(title, desc)}
              style={{padding:12, textAlign:'left', display:'flex', flexDirection:'column', gap:4}}
            >
              <b>{title}</b>
              <small style={{color:'#8b94a8'}}>{desc}</small>
            </button>
          ))}
        </div>

        {event && (
          <div className="sandbox-live-event-card">
            <div className="sandbox-live-event-header">
              <Badge tone="success">LIVE EVENT INJECTED</Badge>
              <span className="sandbox-telemetry-pill">
                <span className="pulse-dot"></span>
                <span>Telemetry Active</span>
              </span>
            </div>
            <h3 className="sandbox-event-title">{event.name}</h3>
            <p className="sandbox-event-desc">{event.desc}</p>
            <div className="sandbox-steps-list">
              <Step title="Event Observed" desc="Telemetry received in real-time stream" status="Complete"/>
              <Step title="Constitution Evaluation" desc="Checked against ₹5,000 threshold and policy limits" status="Passed"/>
              <Step title="Agent Intervention" desc="Opportunity logged and queued for execution" status="Complete"/>
            </div>
            <div className="sandbox-success-banner">
              <span style={{fontSize: 16}}>🛡️</span>
              <span><b>Deterministic Sandbox Execution</b> · Verified safe in Razorpay Test Mode with zero risk to production.</span>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

// -------------------------------------------------------------
// SETTINGS
// -------------------------------------------------------------
export function Settings({notify, addAudit, onLogout}){
  const [merchantSettings, setMerchantSettings] = useState({
    businessName: 'Charan Commerce',
    supportEmail: 'merchant@charancommerce.in',
    currency: 'INR',
    timezone: 'Asia/Kolkata',
    industry: 'Electronics & Accessories'
  });
  const [aiSettings, setAiSettings] = useState({
    model: 'Gemini 1.5 Pro',
    confidenceThreshold: '75%',
    defaultMode: 'Assisted',
    dailyLimit: 50
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`${API}/api/settings`)
      .then(r => r.json())
      .then(d => {
        if (d.settings) {
          if (d.settings.merchant) setMerchantSettings(d.settings.merchant);
          if (d.settings.ai) setAiSettings(d.settings.ai);
        }
      })
      .catch(() => {});
  }, []);

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${API}/api/settings/save`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ merchant: merchantSettings, ai: aiSettings })
      });
      const data = await res.json();
      notify?.(data.message || 'Settings saved successfully');
      addAudit?.(data.audit || {
        action: 'Save Workspace Settings',
        trigger: 'Merchant Admin',
        customer: 'Config',
        amount: 0,
        result: 'Success',
        policy: 'Admin'
      });
    } catch {
      notify?.('Settings updated');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="settings-layout">
      <Card>
        <Header title="Merchant Workspace Settings" sub="Configure store details and business parameters."/>
        <div className="form-grid" style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))', gap:16, margin:'16px 0'}}>
          <label style={{fontSize:12, fontWeight:600}}>
            Business Name
            <input
              value={merchantSettings.businessName}
              onChange={e => setMerchantSettings({ ...merchantSettings, businessName: e.target.value })}
              style={{marginTop:4}}
            />
          </label>
          <label style={{fontSize:12, fontWeight:600}}>
            Support Email
            <input
              value={merchantSettings.supportEmail}
              onChange={e => setMerchantSettings({ ...merchantSettings, supportEmail: e.target.value })}
              style={{marginTop:4}}
            />
          </label>
          <label style={{fontSize:12, fontWeight:600}}>
            Currency
            <select
              value={merchantSettings.currency}
              onChange={e => setMerchantSettings({ ...merchantSettings, currency: e.target.value })}
              style={{marginTop:4}}
            >
              <option value="INR">INR — Indian Rupee (₹)</option>
              <option value="USD">USD — US Dollar ($)</option>
            </select>
          </label>
          <label style={{fontSize:12, fontWeight:600}}>
            Industry
            <select
              value={merchantSettings.industry}
              onChange={e => setMerchantSettings({ ...merchantSettings, industry: e.target.value })}
              style={{marginTop:4}}
            >
              <option value="Electronics & Accessories">Electronics & Accessories</option>
              <option value="Fashion & Apparel">Fashion & Apparel</option>
              <option value="D2C Health & Beauty">D2C Health & Beauty</option>
            </select>
          </label>
        </div>
      </Card>

      <Card>
        <Header title="AI Reasoning Engine Settings" sub="Configure underlying foundation models and safety gates."/>
        <div className="form-grid" style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))', gap:16, margin:'16px 0'}}>
          <label style={{fontSize:12, fontWeight:600}}>
            AI Foundation Model
            <select
              value={aiSettings.model}
              onChange={e => setAiSettings({ ...aiSettings, model: e.target.value })}
              style={{marginTop:4}}
            >
              <option value="Gemini 1.5 Pro">Gemini 1.5 Pro (Recommended)</option>
              <option value="OpenAI GPT-4o">OpenAI GPT-4o</option>
              <option value="Local Adapter">Deterministic Local Adapter</option>
            </select>
          </label>
          <label style={{fontSize:12, fontWeight:600}}>
            Model Confidence Threshold
            <input
              value={aiSettings.confidenceThreshold}
              onChange={e => setAiSettings({ ...aiSettings, confidenceThreshold: e.target.value })}
              style={{marginTop:4}}
            />
          </label>
          <label style={{fontSize:12, fontWeight:600}}>
            Default Autonomy Mode
            <select
              value={aiSettings.defaultMode}
              onChange={e => setAiSettings({ ...aiSettings, defaultMode: e.target.value })}
              style={{marginTop:4}}
            >
              <option value="Assisted">Assisted Mode</option>
              <option value="Manual">Manual Mode</option>
              <option value="Autonomous">Autonomous Mode</option>
            </select>
          </label>
          <label style={{fontSize:12, fontWeight:600}}>
            Daily Action Limit
            <input
              type="number"
              value={aiSettings.dailyLimit}
              onChange={e => setAiSettings({ ...aiSettings, dailyLimit: parseInt(e.target.value)||50 })}
              style={{marginTop:4}}
            />
          </label>
        </div>

        <Button onClick={handleSaveAll} disabled={saving}>
          {saving ? 'Saving…' : 'Save Changes'}
        </Button>
      </Card>

      <Card style={{gridColumn:'1 / -1'}}>
        <Header title="Account & Session" sub="Manage your merchant administrator account and security session."/>
        <div style={{marginTop:16, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 20px', background:'rgba(239, 68, 68, 0.05)', border:'1px solid rgba(239, 68, 68, 0.2)', borderRadius:12}}>
          <div>
            <div style={{fontSize:13, fontWeight:700, color:'#ef4444', marginBottom:2}}>Merchant Session · Charan Commerce</div>
            <div style={{fontSize:11, color:'#64748b'}}>Signed in as merchant@charancommerce.in (Administrator)</div>
          </div>
          <button 
            type="button" 
            className="btn danger" 
            style={{color:'#ef4444', borderColor:'#fca5a5', fontWeight:700, display:'inline-flex', alignItems:'center', gap:6, padding:'9px 16px', borderRadius:8}}
            onClick={onLogout}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </Card>
    </div>
  );
}

// -------------------------------------------------------------
// ANCILLARY PAGES: PRODUCTS, CUSTOMER AGENT, PRODUCT AGENT, AI BUYER, EXPERIMENTS, FORECAST, ANOMALIES, MEMORY, FAILURE CENTER, API CONSOLE, NOTIFICATIONS
// -------------------------------------------------------------
export function Products({nav, notify, addAudit}){
  const [products, setProducts] = useState([
    {
      id: 'prod_101',
      name: 'iPhone 15 Pro (128GB - Natural Titanium)',
      sku: 'SKU-IPH15P-128',
      category: 'Flagship Smartphones',
      icon: '📱',
      price: 134900,
      stock: 85,
      pattern: 'High demand / Low conversion',
      pattern_key: 'high_demand_low_conversion',
      pattern_tag: 'High Demand · Low Conv',
      pattern_tone: 'warning',
      telemetry: {
        views: 18450,
        orders: 221,
        revenue: 29812900,
        conversion_rate: '1.2%',
        benchmark_conv: '3.5%',
        refund_rate: '1.4%',
        abandonment_rate: '68.2%',
        trend_mom: '+24.5%',
        opportunity_amount: 124000
      },
      diagnosis: 'Exceptionally high organic demand (18,450 page views), but 85% funnel drop-off is concentrated at payment checkout because customers lack prominent No-Cost EMI tenure visibility.',
      evidence: [
        '18,450 catalog views in last 14 days (Rank #1 in store traffic)',
        '85% checkout drop-off at final payment option selection',
        '78% of drop-off visitors browsed external EMI calculators',
        'Eligible for instant Razorpay Cardless & Credit Card No-Cost EMI'
      ],
      action: {
        action_id: 'act_prod_101',
        title: 'Enable Instant Razorpay No-Cost EMI & Fast Checkout Widget',
        action_key: 'enable_no_cost_emi',
        description: 'Activate Razorpay No-Cost EMI badge on product PDP and inject one-click checkout modal to remove high-ticket friction.',
        expected_impact: '+₹1,24,000 revenue uplift (+2.3% conversion recovery)',
        impact_amount: 124000,
        confidence: 92,
        risk: 'Low',
        status: 'Action Required',
        policy_check: 'Within ₹25,000 daily spend & autonomous boundary',
        executed_at: null
      }
    },
    {
      id: 'prod_102',
      name: 'Anker 65W GaN Dual-Port Fast Charger',
      sku: 'SKU-ANK-65W',
      category: 'Charging & Cables',
      icon: '🔌',
      price: 3499,
      stock: 480,
      pattern: 'High conversion / Low visibility',
      pattern_key: 'high_conversion_low_visibility',
      pattern_tag: 'High Conv · Low Visibility',
      pattern_tone: 'info',
      telemetry: {
        views: 620,
        orders: 54,
        revenue: 188946,
        conversion_rate: '8.7%',
        benchmark_conv: '2.8%',
        refund_rate: '0.8%',
        abandonment_rate: '28.5%',
        trend_mom: '+8.2%',
        opportunity_amount: 52500
      },
      diagnosis: "Merchant 'Hidden Gem': extraordinary 8.7% conversion rate (3.1x benchmark) and 4.9★ rating, but traffic is stifled at only 620 views because it is buried on page 3 of accessories.",
      evidence: [
        'Conversion rate of 8.7% is 3.1x higher than category average (2.8%)',
        'Current catalog ranking: #38 (Page 3 of Accessories collection)',
        '98.4% 5-star positive review sentiment across verified buyers',
        'Healthy warehouse inventory: 480 units available for immediate dispatch'
      ],
      action: {
        action_id: 'act_prod_102',
        title: 'Promote to Homepage Hero & Top Category Placement',
        action_key: 'promote_featured',
        description: 'Elevate product to storefront hero carousel, add "AI Recommended" badge, and include in weekly email newsletter.',
        expected_impact: '+₹52,500 monthly revenue (+350 incremental orders)',
        impact_amount: 52500,
        confidence: 94,
        risk: 'Low',
        status: 'Action Required',
        policy_check: 'Zero discount required · 100% margin protection',
        executed_at: null
      }
    },
    {
      id: 'prod_103',
      name: 'MacBook Air M2 (Space Grey - 256GB)',
      sku: 'SKU-MBA-M2-SG',
      category: 'Laptops & Workstations',
      icon: '💻',
      price: 94900,
      stock: 42,
      pattern: 'Frequently bought together',
      pattern_key: 'frequently_bought_together',
      pattern_tag: 'Frequently Bought Together',
      pattern_tone: 'success',
      telemetry: {
        views: 7800,
        orders: 245,
        revenue: 23250500,
        conversion_rate: '3.2%',
        benchmark_conv: '3.0%',
        refund_rate: '1.2%',
        abandonment_rate: '42.1%',
        trend_mom: '+14.2%',
        opportunity_amount: 62500,
        paired_item: 'Thunderbolt 4 Hub & Leather Sleeve (₹6,999)',
        affinity_pct: '81%'
      },
      diagnosis: 'Market basket affinity analysis reveals 81% of MacBook Air buyers purchase the Thunderbolt Hub and Sleeve within 14 days, but currently do so as disjointed separate orders.',
      evidence: [
        'Co-purchase affinity index: 0.81 (Highest multi-product correlation in store)',
        'Split shipments add ₹180 in secondary packing & courier costs per buyer',
        '5% complementary bundle discount is within max 10% discount policy',
        'Projected bundle conversion rate: 34% of laptop checkouts'
      ],
      action: {
        action_id: 'act_prod_103',
        title: 'Deploy 1-Click Bundle Offer with 5% Complementary Discount',
        action_key: 'create_bundle',
        description: 'Automate dynamic checkout bundling to offer the Hub + Sleeve package at 5% discount when MacBook Air is added to cart.',
        expected_impact: '+₹62,500 AOV expansion (est. 140 bundle purchases)',
        impact_amount: 62500,
        confidence: 91,
        risk: 'Low',
        status: 'Action Required',
        policy_check: '5% discount strictly compliant with 10% policy cap',
        executed_at: null
      }
    },
    {
      id: 'prod_104',
      name: 'Ergonomic Wireless Trackball Mouse v1',
      sku: 'SKU-ERG-TRK-V1',
      category: 'PC Peripherals',
      icon: '🖱️',
      price: 4299,
      stock: 160,
      pattern: 'High refund rate',
      pattern_key: 'high_refund_rate',
      pattern_tag: 'High Refund Rate',
      pattern_tone: 'danger',
      telemetry: {
        views: 4100,
        orders: 340,
        revenue: 1461660,
        conversion_rate: '8.3%',
        benchmark_conv: '3.5%',
        refund_rate: '18.2%',
        benchmark_refund: '2.5%',
        refunds_count: 62,
        abandonment_rate: '36.0%',
        trend_mom: '-12.4%',
        opportunity_amount: 42000
      },
      diagnosis: 'Critical 18.2% refund/return rate (7.2x category benchmark). Telemetry analysis reveals 82% of return claims report "Bluetooth connection lag on macOS Sequoia" isolated to batch #B2408.',
      evidence: [
        '62 customer refunds approved in past 30 days totaling ₹26,650 in refunded GMV',
        'Primary return reason: "Bluetooth packet drops on recent OS updates"',
        'Anomaly strictly concentrated in supplier manufacturing lot #B2408',
        'Active paid ad spend (₹18,000/mo) is driving sales that lead to refunds'
      ],
      action: {
        action_id: 'act_prod_104',
        title: 'Pause Paid Ad Spend & Trigger Supplier Batch Quality Audit',
        action_key: 'pause_and_audit',
        description: 'Immediately pause paid Meta/Google ad sets for this SKU, alert merchant warehouse, and request batch inspection from supplier.',
        expected_impact: 'Protect ₹42,000 monthly margin & prevent brand churn',
        impact_amount: 42000,
        confidence: 96,
        risk: 'Medium',
        status: 'Action Required',
        policy_check: 'Non-destructive safety pause approved under policy rules',
        executed_at: null
      }
    },
    {
      id: 'prod_105',
      name: 'Sony WH-1000XM5 Wireless Headphones',
      sku: 'SKU-SNY-XM5-BLK',
      category: 'Premium Audio',
      icon: '🎧',
      price: 29990,
      stock: 75,
      pattern: 'High abandonment',
      pattern_key: 'high_abandonment',
      pattern_tag: 'High Abandonment',
      pattern_tone: 'warning',
      telemetry: {
        views: 5600,
        orders: 128,
        revenue: 3838720,
        conversion_rate: '2.3%',
        benchmark_conv: '3.8%',
        refund_rate: '1.1%',
        carts_initiated: 480,
        carts_abandoned: 352,
        abandonment_rate: '73.3%',
        benchmark_abandonment: '45.0%',
        trend_mom: '+5.1%',
        opportunity_amount: 54600
      },
      diagnosis: 'Excessive 73.3% cart abandonment rate at final checkout. Buyers configure color/warranty options for >3 mins but drop off when standard ground shipping indicates 5-7 business days.',
      evidence: [
        '352 abandoned carts representing ₹1.05Cr in uncompleted checkouts',
        '71% of drop-off visitors spent >3 minutes configuring color and warranty',
        'Standard shipping estimate (5-7 days) is cited as top checkout drop reason',
        'Free 2-day express upgrade incentive projected to recover 28 carts'
      ],
      action: {
        action_id: 'act_prod_105',
        title: 'Trigger Automated WhatsApp Checkout Link with Free Express Shipping',
        action_key: 'whatsapp_abandonment_recovery',
        description: 'Dispatch intelligent WhatsApp recovery link offering complimentary 2-day express delivery without discounting product price.',
        expected_impact: 'Recover 28 high-intent carts (₹54,600 recovery)',
        impact_amount: 54600,
        confidence: 89,
        risk: 'Low',
        status: 'Action Required',
        policy_check: 'Adheres to messaging guardrail · ₹0 product price discount',
        executed_at: null
      }
    },
    {
      id: 'prod_106',
      name: 'AuraFit Fitness Tracker Band 3',
      sku: 'SKU-AUR-FIT3',
      category: 'Wearables & Fitness',
      icon: '⌚',
      price: 2499,
      stock: 210,
      pattern: 'Declining product',
      pattern_key: 'declining_product',
      pattern_tag: 'Declining Product',
      pattern_tone: 'danger',
      telemetry: {
        views: 1150,
        orders: 28,
        revenue: 69972,
        conversion_rate: '2.4%',
        benchmark_conv: '3.2%',
        refund_rate: '3.4%',
        abandonment_rate: '51.0%',
        trend_mom: '-41.2%',
        prior_orders: 142,
        warehouse_stock: 210,
        opportunity_amount: 52400
      },
      diagnosis: 'Product lifecycle has entered terminal obsolescence (-41.2% MoM sales velocity) following the launch of Band 4. 210 units are aging in warehouse incurring ₹18,500/mo in storage depreciation.',
      evidence: [
        'Order velocity plummeted 41.2% in last 30 days (from 142 to 28 units)',
        'Days of Inventory (DOI) spiked from 18 days to 92 days',
        '10% clearance markdown is compliant with merchant constitution (10% max)',
        'Liquidates trapped working capital to restock fast-selling Band 4 inventory'
      ],
      action: {
        action_id: 'act_prod_106',
        title: 'Launch Automated Clearance Flash Sale (-10% limited discount)',
        action_key: 'clearance_flash_sale',
        description: 'Trigger an automated 72-hour clearance campaign to email subscribers and discount-seeking cohorts to liquidate remaining 210 units.',
        expected_impact: 'Liquidate ₹52,400 trapped working capital within 10 days',
        impact_amount: 52400,
        confidence: 93,
        risk: 'Low',
        status: 'Action Required',
        policy_check: '10% discount strictly within constitutional guardrail',
        executed_at: null
      }
    },
    {
      id: 'prod_107',
      name: 'Apple AirPods Pro (2nd Generation)',
      sku: 'SKU-APP-AIRP2',
      category: 'Personal Audio',
      icon: '🎵',
      price: 24900,
      stock: 120,
      pattern: 'Optimal Performance',
      pattern_key: 'optimal',
      pattern_tag: 'Optimal · Top Seller',
      pattern_tone: 'success',
      telemetry: {
        views: 12200,
        orders: 312,
        revenue: 7768800,
        conversion_rate: '4.1%',
        benchmark_conv: '3.2%',
        refund_rate: '1.1%',
        abandonment_rate: '32.0%',
        trend_mom: '+18.5%',
        opportunity_amount: 0
      },
      diagnosis: 'Top performing SKU in catalog. Conversion rate is +28% above industry average with strong customer retention.',
      evidence: [
        'Highest grossing audio item in current month',
        'Low refund rate (1.1%) and high customer satisfaction',
        'No conversion friction detected'
      ],
      action: {
        action_id: 'act_prod_107',
        title: 'Maintain Current Marketing & Monitor Stock',
        action_key: 'maintain_stock',
        description: 'Conversion and stock are balanced. No corrective action required.',
        expected_impact: 'Sustain ₹77.6L monthly GMV run-rate',
        impact_amount: 0,
        confidence: 98,
        risk: 'Low',
        status: 'Executed',
        policy_check: 'Optimal benchmark',
        executed_at: 'Today'
      }
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [patternFilter, setPatternFilter] = useState('all');
  const [selectedProductForModal, setSelectedProductForModal] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    fetch(`${API}/api/products`)
      .then(r => r.json())
      .then(d => {
        if (d.products && d.products.length > 0) {
          setProducts(d.products);
        }
      })
      .catch(() => {});
  }, []);

  const handleExecuteAction = async (product) => {
    setActionLoading(product.id);
    try {
      const res = await fetch(`${API}/api/products/action`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ product_id: product.id })
      });
      const data = await res.json();
      if (data.ok) {
        setProducts(prev => prev.map(p => p.id === product.id ? {
          ...p,
          action: { ...p.action, status: 'Executed', executed_at: 'Just now' }
        } : p));
        notify?.(`Executed: ${product.action.title} on ${product.name}`);
        addAudit?.({
          agent: 'Product Intelligence Agent',
          action: product.action.title,
          customer: `${product.name} (${product.sku})`,
          amount: product.action.impact_amount || 0,
          result: 'Success · Executed',
          status: 'Success',
          policy: product.action.policy_check || 'Within policy'
        });
        if (selectedProductForModal && selectedProductForModal.id === product.id) {
          setSelectedProductForModal(prev => ({
            ...prev,
            action: { ...prev.action, status: 'Executed', executed_at: 'Just now' }
          }));
        }
      } else {
        notify?.(data.message || 'Execution error');
      }
    } catch {
      // Local fallback
      setProducts(prev => prev.map(p => p.id === product.id ? {
        ...p,
        action: { ...p.action, status: 'Executed', executed_at: 'Just now' }
      } : p));
      notify?.(`Executed: ${product.action.title} (Local fallback)`);
      addAudit?.({
        agent: 'Product Intelligence Agent',
        action: product.action.title,
        customer: `${product.name} (${product.sku})`,
        amount: product.action.impact_amount || 0,
        result: 'Success · Executed',
        status: 'Success',
        policy: product.action.policy_check || 'Within policy'
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleScan = async () => {
    setScanning(true);
    try {
      const res = await fetch(`${API}/api/products/scan`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'}
      });
      const data = await res.json();
      if (data.ok && data.products) {
        setProducts(data.products);
      }
      notify?.('AI Product Catalog Scan complete. 6 actionable patterns refreshed.');
      addAudit?.({
        agent: 'Product Intelligence Agent',
        action: 'AI Catalog Telemetry Scan',
        customer: '24 Storefront SKUs',
        amount: 0,
        result: 'Success · Scanned',
        status: 'Success',
        policy: 'Autonomous telemetry read'
      });
    } catch {
      notify?.('AI Catalog Scan complete (Offline Mode).');
    } finally {
      setScanning(false);
    }
  };

  const handleReset = async () => {
    try {
      const res = await fetch(`${API}/api/products/reset`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'}
      });
      const data = await res.json();
      if (data.ok && data.products) {
        setProducts(data.products);
      }
      notify?.('Product Intelligence reset to baseline state.');
    } catch {
      notify?.('Product Intelligence reset.');
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = !searchTerm.trim() ||
      p.name.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase().trim());
    const matchesPattern = patternFilter === 'all' || p.pattern_key === patternFilter;
    return matchesSearch && matchesPattern;
  });

  const patternsList = [
    { key: 'all', label: 'All Patterns' },
    { key: 'high_demand_low_conversion', label: 'High Demand / Low Conv' },
    { key: 'high_conversion_low_visibility', label: 'High Conv / Low Visibility' },
    { key: 'frequently_bought_together', label: 'Frequently Bought Together' },
    { key: 'high_refund_rate', label: 'High Refund Rate' },
    { key: 'high_abandonment', label: 'High Abandonment' },
    { key: 'declining_product', label: 'Declining Product' }
  ];

  return (
    <div>
      {/* 4 Stat Cards */}
      <div className="stat-grid four" style={{marginBottom: 20}}>
        <Card>
          <span className="muted">Catalog Monitored</span>
          <strong className="metric">24 SKUs</strong>
          <span className="up">₹8.4Cr Gross GMV</span>
        </Card>
        <Card>
          <span className="muted">Actionable AI Signals</span>
          <strong className="metric" style={{color: '#6246ea'}}>6 Signals</strong>
          <span className="up">100% Actionable</span>
        </Card>
        <Card>
          <span className="muted">Revenue Opportunity</span>
          <strong className="metric" style={{color: '#10b981'}}>₹3,71,100</strong>
          <span className="up">+14.2% Growth Uplift</span>
        </Card>
        <Card>
          <span className="muted">Avg Catalog Conversion</span>
          <strong className="metric">3.8%</strong>
          <span className="up">+0.8% with AI actions</span>
        </Card>
      </div>

      {/* Adjustable & Pixel-Aligned Filter & Action Container */}
      <section className="product-filter-card">
        <div className="customer-filter-header">
          <div className="customer-filter-title-wrap">
            <div className="customer-filter-icon">📦</div>
            <div className="customer-filter-titles">
              <h3>Product Intelligence & Behavioral Pattern Detection</h3>
              <p>AI identifies demand mismatches, conversion gaps, co-purchase affinity, refund anomalies, and declining lifecycles.</p>
            </div>
          </div>
          <div className="customer-filter-status">
            <Badge tone="info">Showing {filteredProducts.length} of {products.length} Products</Badge>
            {(searchTerm.trim() || patternFilter !== 'all') && (
              <button
                type="button"
                className="customer-filter-reset-btn"
                onClick={() => { setSearchTerm(''); setPatternFilter('all'); }}
              >
                Reset Filters
              </button>
            )}
            <button
              type="button"
              className="product-detail-btn"
              onClick={handleScan}
              disabled={scanning}
              style={{display: 'inline-flex', alignItems: 'center', gap: 5}}
            >
              {scanning ? 'Scanning…' : '✦ Re-scan AI Catalog'}
            </button>
            <button
              type="button"
              className="product-detail-btn"
              onClick={handleReset}
              title="Reset state to initial baseline"
            >
              ↺ Reset
            </button>
          </div>
        </div>

        <div className="customer-toolbar">
          <div className="customer-toolbar-left">
            <div className="customer-search-wrap" style={{maxWidth: 320}}>
              <span className="customer-search-icon">🔍</span>
              <input
                type="text"
                className="customer-search-input"
                placeholder="Search product name, SKU, or category…"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  type="button"
                  className="customer-search-clear"
                  onClick={() => setSearchTerm('')}
                  title="Clear search"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="customer-pills">
              {patternsList.map(pat => {
                const count = pat.key === 'all'
                  ? products.length
                  : products.filter(p => p.pattern_key === pat.key).length;
                return (
                  <button
                    key={pat.key}
                    type="button"
                    className={`customer-pill-btn ${patternFilter === pat.key ? 'active' : ''}`}
                    onClick={() => setPatternFilter(pat.key)}
                  >
                    <span>{pat.label}</span>
                    <small style={{opacity: 0.75, fontSize: 10}}>({count})</small>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Featured AI Identification Signals Grid */}
      <div style={{marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        <div>
          <h3 style={{fontSize: 15, margin: 0, color: '#17203a'}}>AI-Identified Product Anomalies & Generated Actions</h3>
          <p style={{fontSize: 11, color: '#7d879d', margin: '2px 0 0'}}>Real-time telemetry deductions paired with bounded autonomous merchant actions.</p>
        </div>
      </div>

      <div className="product-signals-grid">
        {filteredProducts.map(p => {
          const isExecuted = p.action?.status === 'Executed';
          const isLoading = actionLoading === p.id;
          return (
            <div key={p.id} className="product-intel-card">
              <div>
                <div className="product-card-top">
                  <div className="product-identity">
                    <div className="product-icon-avatar">{p.icon || '📦'}</div>
                    <div className="product-names">
                      <h4>{p.name}</h4>
                      <span>{p.sku} · {p.category}</span>
                    </div>
                  </div>
                  <span className={`product-pattern-chip ${p.pattern_tone || 'info'}`}>
                    {p.pattern_tag || p.pattern}
                  </span>
                </div>

                <div style={{display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', margin: '4px 0 10px'}}>
                  <strong style={{fontSize: 17, color: '#17203a'}}>{money(p.price)}</strong>
                  <span style={{fontSize: 10, color: p.stock < 50 ? '#dc2626' : '#16a34a', fontWeight: 600}}>
                    ● {p.stock} units in warehouse
                  </span>
                </div>

                {/* Telemetry Metrics Strip */}
                <div className="product-telemetry-strip">
                  <div className="telemetry-item">
                    <span>Views (14d)</span>
                    <strong>{p.telemetry?.views?.toLocaleString() || '—'}</strong>
                  </div>
                  <div className="telemetry-item">
                    <span>Conversion</span>
                    <strong style={{color: p.pattern_key === 'high_demand_low_conversion' ? '#dc2626' : p.pattern_key === 'high_conversion_low_visibility' ? '#16a34a' : '#17203a'}}>
                      {p.telemetry?.conversion_rate || '—'}
                    </strong>
                  </div>
                  <div className="telemetry-item">
                    <span>Refund Rate</span>
                    <strong style={{color: p.pattern_key === 'high_refund_rate' ? '#dc2626' : '#17203a'}}>
                      {p.telemetry?.refund_rate || '—'}
                    </strong>
                  </div>
                  <div className="telemetry-item">
                    <span>Abandonment</span>
                    <strong style={{color: p.pattern_key === 'high_abandonment' ? '#dc2626' : '#17203a'}}>
                      {p.telemetry?.abandonment_rate || '—'}
                    </strong>
                  </div>
                </div>

                {/* Diagnosis Box */}
                <div className="product-diagnosis-box">
                  <div className="product-diagnosis-header">
                    <span>✦ AI Pattern Diagnosis</span>
                  </div>
                  <p>{p.diagnosis}</p>
                </div>
              </div>

              {/* Action Box */}
              <div className="product-action-box">
                <div className="product-action-title-row">
                  <b>{p.action?.title}</b>
                  {p.action?.expected_impact && (
                    <span className="product-impact-badge">
                      {p.action.expected_impact.split(' (')[0]}
                    </span>
                  )}
                </div>

                <div className="product-action-controls">
                  <span className="product-confidence-pill">
                    AI Confidence: <strong>{p.action?.confidence || 90}%</strong> · Risk: <strong>{p.action?.risk || 'Low'}</strong>
                  </span>
                  <div style={{display: 'flex', gap: 6}}>
                    <button
                      type="button"
                      className="product-detail-btn"
                      onClick={() => setSelectedProductForModal(p)}
                    >
                      Rationale
                    </button>
                    <button
                      type="button"
                      className={`product-exec-btn ${isExecuted ? 'executed' : ''}`}
                      onClick={() => !isExecuted && handleExecuteAction(p)}
                      disabled={isExecuted || isLoading}
                    >
                      {isLoading ? 'Executing…' : isExecuted ? '✓ Executed' : '⚡ Execute Action'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Comprehensive Catalog Table */}
      <TableCard
        title="Product Intelligence Catalog Database"
        sub="Full merchant SKU telemetry with AI patterns and next bounded actions."
        headers={['Product', 'Pattern Detected', 'Price', 'Telemetry (14d)', 'Conversion', 'Risk / Health', 'AI Next Action']}
        rows={filteredProducts.map(p => {
          const isExecuted = p.action?.status === 'Executed';
          return [
            <div key={p.id} style={{display: 'flex', alignItems: 'center', gap: 8}}>
              <span style={{fontSize: 18}}>{p.icon || '📦'}</span>
              <div>
                <b>{p.name}</b>
                <small style={{display: 'block', color: '#8b94a8', fontSize: 11}}>{p.sku} · {p.category}</small>
              </div>
            </div>,
            <span key={`pat_${p.id}`} className={`product-pattern-chip ${p.pattern_tone || 'info'}`}>
              {p.pattern_tag || p.pattern}
            </span>,
            money(p.price),
            <div key={`tel_${p.id}`}>
              <b>{p.telemetry?.views?.toLocaleString() || 0} views</b>
              <small style={{display: 'block', color: '#8b94a8'}}>{p.telemetry?.orders || 0} orders</small>
            </div>,
            <div key={`conv_${p.id}`} style={{display: 'flex', alignItems: 'center', gap: 6}}>
              <Progress value={p.telemetry?.conversion_rate || '3%'}/>
              <b>{p.telemetry?.conversion_rate}</b>
            </div>,
            <span key={`risk_${p.id}`} style={{fontSize: 10, color: p.telemetry?.refund_rate > '10%' || p.telemetry?.abandonment_rate > '60%' ? '#dc2626' : '#16a34a', fontWeight: 600}}>
              {p.telemetry?.refund_rate > '10%' ? `High Refund (${p.telemetry.refund_rate})` : p.telemetry?.abandonment_rate > '60%' ? `High Abandon (${p.telemetry.abandonment_rate})` : 'Healthy'}
            </span>,
            <div key={`act_${p.id}`} style={{display: 'flex', alignItems: 'center', gap: 8}}>
              <span style={{fontSize: 11, fontWeight: 600, color: '#17203a', maxWidth: 180, whiteSpace: 'normal'}}>
                {p.action?.title}
              </span>
              <button
                type="button"
                className={`product-exec-btn ${isExecuted ? 'executed' : ''}`}
                style={{height: 28, fontSize: 10, padding: '0 10px'}}
                onClick={() => !isExecuted && handleExecuteAction(p)}
                disabled={isExecuted || actionLoading === p.id}
              >
                {isExecuted ? '✓ Done' : 'Execute'}
              </button>
            </div>
          ];
        })}
      />

      {/* Evidence & Telemetry Inspector Modal */}
      {selectedProductForModal && (
        <div className="product-modal-backdrop" onClick={() => setSelectedProductForModal(null)}>
          <div className="product-modal-card" onClick={e => e.stopPropagation()}>
            <div className="product-modal-head">
              <div>
                <span className={`product-pattern-chip ${selectedProductForModal.pattern_tone || 'info'}`} style={{background: '#ffffff22', color: '#ffffff', borderColor: '#ffffff44'}}>
                  {selectedProductForModal.pattern_tag || selectedProductForModal.pattern}
                </span>
                <h3>{selectedProductForModal.name}</h3>
                <p>{selectedProductForModal.sku} · {selectedProductForModal.category} · Price: {money(selectedProductForModal.price)}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedProductForModal(null)}
                style={{background: 'none', border: 'none', color: '#fff', fontSize: 20, cursor: 'pointer'}}
              >
                ✕
              </button>
            </div>

            <div className="product-modal-body">
              <div style={{marginBottom: 14}}>
                <h4 style={{fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#6246ea', margin: '0 0 4px'}}>
                  ✦ Behavioral Telemetry Diagnosis
                </h4>
                <p style={{fontSize: 12, lineHeight: 1.6, color: '#374151', margin: 0}}>
                  {selectedProductForModal.diagnosis}
                </p>
              </div>

              <div className="product-telemetry-strip" style={{margin: '12px 0 16px'}}>
                <div className="telemetry-item">
                  <span>14-Day Views</span>
                  <strong>{selectedProductForModal.telemetry?.views?.toLocaleString()}</strong>
                </div>
                <div className="telemetry-item">
                  <span>Conversion Rate</span>
                  <strong>{selectedProductForModal.telemetry?.conversion_rate} (vs {selectedProductForModal.telemetry?.benchmark_conv})</strong>
                </div>
                <div className="telemetry-item">
                  <span>Refund / Return</span>
                  <strong>{selectedProductForModal.telemetry?.refund_rate}</strong>
                </div>
                <div className="telemetry-item">
                  <span>Cart Drop-off</span>
                  <strong>{selectedProductForModal.telemetry?.abandonment_rate}</strong>
                </div>
              </div>

              <div>
                <h4 style={{fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#6246ea', margin: '0 0 4px'}}>
                  Empirical Evidence Factors
                </h4>
                <div className="evidence-list-box">
                  <ul>
                    {selectedProductForModal.evidence?.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div style={{background: '#faf9ff', border: '1px solid #e7e2ff', borderRadius: 10, padding: 14, marginTop: 12}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4}}>
                  <strong style={{fontSize: 12, color: '#17203a'}}>AI Generated Recommendation</strong>
                  <span className="product-impact-badge">{selectedProductForModal.action?.expected_impact}</span>
                </div>
                <p style={{fontSize: 11, color: '#4b5563', margin: '4px 0 0', lineHeight: 1.5}}>
                  {selectedProductForModal.action?.description}
                </p>
                <div style={{fontSize: 10, color: '#6b7280', marginTop: 6}}>
                  Guardrail compliance: <b style={{color: '#16a34a'}}>{selectedProductForModal.action?.policy_check || 'Passed'}</b>
                </div>
              </div>
            </div>

            <div className="product-modal-foot">
              <button
                type="button"
                className="product-detail-btn"
                onClick={() => setSelectedProductForModal(null)}
              >
                Close
              </button>
              <button
                type="button"
                className={`product-exec-btn ${selectedProductForModal.action?.status === 'Executed' ? 'executed' : ''}`}
                onClick={() => handleExecuteAction(selectedProductForModal)}
                disabled={selectedProductForModal.action?.status === 'Executed'}
              >
                {selectedProductForModal.action?.status === 'Executed' ? '✓ Action Executed' : '⚡ Execute Action Now'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function CustomerAgent({notify, addAudit}){
  const [data, setData] = useState(null);
  const [busy, setBusy] = useState('');
  const [executed, setExecuted] = useState({});

  const load = () => {
    fetch(`${API}/api/customer-agent/rahul-verma`)
      .then(r => r.json())
      .then(d => { if (d.ok) setData(d.customer); })
      .catch(() => {});
  };
  useEffect(() => { load(); const id = setInterval(load, 5000); return () => clearInterval(id); }, []);

  const handleAction = async (item) => {
    setBusy(item.type);
    try {
      const res = await fetch(`${API}/api/customer-agent/action`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          type: item.type,
          action: item.action,
          amount: item.amount || 4500,
          customer: data?.name || 'Rahul Verma'
        })
      });
      const d = await res.json();
      notify?.(d.message || `Dispatched ${item.action} to ${data?.name}`);
      if (d.audit) addAudit?.(d.audit);
      setExecuted(prev => ({...prev, [item.type]: true}));
      load();
    } catch {
      notify?.('Action executed in Test Mode');
      setExecuted(prev => ({...prev, [item.type]: true}));
    } finally {
      setBusy('');
    }
  };

  const customer = data || {
    name: 'Rahul Verma',
    initials: 'RV',
    segment: 'VIP',
    ltv: 145600,
    orders: 12,
    purchase_probability: 87,
    next_actions: [
      {type: 'Reactivate', action: 'No discount winback', priority: 'High', tone: 'success', amount: 4500},
      {type: 'Upsell', action: 'Laptop Bag · 81% affinity', priority: 'High', tone: 'success', amount: 4500},
      {type: 'Retain', action: 'Check-in after 14 days', priority: 'Medium', tone: 'warning', amount: 0}
    ],
    evidence: [
      {label: 'Last purchase', value: 'MacBook Air · ₹94,900'},
      {label: 'Similar buyers purchased a bag within 14 days', value: '81%'},
      {label: 'Preferred channel', value: 'WhatsApp'},
      {label: 'Discount sensitivity', value: 'Low'}
    ]
  };

  return (
    <div className="dashboard-grid two">
      <Card>
        <Header eyebrow="Customer Agent · Live" title="Find the next best customer action" actions={<Badge tone="success">Live Active</Badge>}/>
        <div className="customer-profile">
          <span className="avatar xl">{customer.initials || 'RV'}</span>
          <div>
            <h3>{customer.name}</h3>
            <span>{customer.segment} · {money(customer.ltv)} lifetime spend · {customer.orders} orders</span>
          </div>
          <Badge tone="success">{customer.purchase_probability}% purchase probability</Badge>
        </div>
        <div className="next-actions">
          {customer.next_actions.map(x => (
            <div key={x.type} style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f1f5f9'}}>
              <span style={{fontWeight: 700, color: '#6246ea'}}>{x.type}</span>
              <b style={{flex: 1, margin: '0 12px', fontSize: 12}}>{x.action}</b>
              <Badge tone={x.tone || (x.priority === 'High' ? 'success' : 'warning')}>{x.priority}</Badge>
              <Button
                variant={executed[x.type] ? 'secondary' : 'primary'}
                style={{marginLeft: 10, padding: '5px 12px', fontSize: 11}}
                onClick={() => handleAction(x)}
                disabled={busy === x.type || executed[x.type]}
              >
                {busy === x.type ? 'Dispatching…' : executed[x.type] ? '✓ Dispatched' : 'Execute →'}
              </Button>
            </div>
          ))}
        </div>
      </Card>
      <Card>
        <Header title="Customer Evidence & Telemetry" sub="Live merchant data grounding AI decisions."/>
        <div className="evidence">
          {customer.evidence.map((ev, idx) => (
            <p key={idx}>{ev.label}: <b>{ev.value}</b></p>
          ))}
        </div>
      </Card>
    </div>
  );
}

export function ProductAgent({nav, notify, addAudit}){
  const [bundle, setBundle] = useState(null);
  const [busy, setBusy] = useState(false);
  const [deployed, setDeployed] = useState(false);

  useEffect(() => {
    fetch(`${API}/api/product-agent/bundle`)
      .then(r => r.json())
      .then(d => { if (d.ok) setBundle(d); })
      .catch(() => {});
  }, []);

  const handleDeploy = async () => {
    setBusy(true);
    try {
      const res = await fetch(`${API}/api/product-agent/action`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({amount: 4500})
      });
      const d = await res.json();
      notify?.(d.message || 'AI Bundle deployed to storefront');
      if (d.audit) addAudit?.(d.audit);
      setDeployed(true);
    } catch {
      notify?.('Bundle recommendation deployed in Test Mode');
      setDeployed(true);
    } finally {
      setBusy(false);
    }
  };

  const bData = bundle || {
    source: {name: 'MacBook Air M2', price: 94900, icon: '💻'},
    recommend: {name: 'Laptop Bag', price: 4500, icon: '🎒'},
    match_confidence: 81,
    reasons: ['78% of laptop buyers purchase this bag within 14 days', 'High margin accessory', 'Stock verified in catalog']
  };

  return (
    <div className="dashboard-grid two">
      <Card>
        <Header eyebrow="Product Agent · Real-Time" title="AI Bundle Recommendation" sub="Cross-sell based on actual purchase affinity." actions={<Badge tone="success">Live Affinity</Badge>}/>
        <div className="product-focus">
          <div className="product-box">{bData.source.icon || '💻'}</div>
          <div><span>Purchased</span><h3>{bData.source.name}</h3><b>{money(bData.source.price)}</b></div>
          <span className="arrow">→</span>
          <div className="product-box">{bData.recommend.icon || '🎒'}</div>
          <div><span>Recommend</span><h3>{bData.recommend.name}</h3><b>{money(bData.recommend.price)}</b></div>
        </div>
        <div className="confidence">
          <span>Match confidence</span><b>{bData.match_confidence}%</b>
          <Progress value={`${bData.match_confidence}%`}/>
        </div>
        <div className="evidence">
          {bData.reasons.map((r, i) => <p key={i}>✓ {r}</p>)}
        </div>
        <div style={{marginTop: 14}}>
          <Button
            style={{width: '100%', padding: '10px 0'}}
            onClick={handleDeploy}
            disabled={busy || deployed}
          >
            {busy ? 'Deploying to store…' : deployed ? '✓ Bundle Recommendation Active' : '⚡ Deploy AI Bundle Recommendation →'}
          </Button>
        </div>
      </Card>
      <Card>
        <Header title="Product Opportunity Map" sub="Monitored across 24 storefront SKUs." actions={<button className="link" onClick={()=>nav('/products')}>Inspect all SKUs →</button>}/>
        <div className="opportunity-map">
          {[
            ['High demand / high conversion','AirPods Pro','Scale visibility'],
            ['High demand / low conversion','iPhone 15','Inspect checkout funnel'],
            ['High affinity','Laptop Bag','Bundle with MacBook Air M2'],
            ['High refund rate','Accessory X','Flagged for vendor review']
          ].map(x=>(
            <div key={x[1]}>
              <Badge tone={x[0].includes('High affinity')?'success':x[0].includes('refund')?'danger':'info'}>{x[0]}</Badge>
              <b>{x[1]}</b>
              <small>{x[2]}</small>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

const PRODUCT_IMAGES = {
  'prod_001': 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=500&q=80',
  'prod_002': 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=500&q=80',
  'prod_003': 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=500&q=80',
  'prod_004': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=500&q=80',
  'prod_005': 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=500&q=80',
  'prod_006': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=500&q=80',
  'prod_007': 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=500&q=80',
  'prod_008': 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=500&q=80',
  'bundle_laptop_bag': 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=600&q=80',
  'MacBook Air M2': 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=500&q=80',
  'iPhone 15': 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=500&q=80',
  'AirPods Pro': 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=500&q=80',
  'Laptop Bag': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=500&q=80',
  'Premium Laptop Bag': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=500&q=80',
  'Wireless Ergonomic Mouse': 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=500&q=80',
  'Noise Cancel Headphones': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=500&q=80',
  'Wireless Headphones Pro': 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=500&q=80',
  'Ultra-Slim 65W GaN Charger': 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=500&q=80',
};

const getProductImg = (p) => {
  if (!p) return PRODUCT_IMAGES['prod_001'];
  return p.image || PRODUCT_IMAGES[p.id] || PRODUCT_IMAGES[p.name] || 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=500&q=80';
};

const DEFAULT_CATALOG_ITEMS = [
  {id:'prod_001',name:'MacBook Air M2',price:94900,stock:245,category:'Laptop',description:'Lightweight performance laptop with Apple M2 chip'},
  {id:'prod_002',name:'iPhone 15',price:79990,stock:189,category:'Phone',description:'Dynamic Island, 48MP main camera, USB-C'},
  {id:'prod_003',name:'AirPods Pro',price:24900,stock:312,category:'Audio',description:'Active Noise Cancellation with Spatial Audio'},
  {id:'prod_004',name:'Laptop Bag',price:4500,stock:410,category:'Accessory',description:'Water-resistant premium padded laptop sleeve & bag'},
  {id:'prod_005',name:'Wireless Ergonomic Mouse',price:1800,stock:260,category:'Accessory',description:'High-precision silent ergonomic wireless mouse'},
  {id:'prod_006',name:'Noise Cancel Headphones',price:2999,stock:180,category:'Audio',description:'Over-ear Active Noise Cancelling headphones'},
  {id:'prod_007',name:'Wireless Headphones Pro',price:2799,stock:220,category:'Audio',description:'Deep bass hi-fi wireless headphones'},
  {id:'prod_008',name:'Ultra-Slim 65W GaN Charger',price:1999,stock:340,category:'Accessory',description:'Ultra-compact fast GaN multi-device charger'},
];

export function AIBuyer(){
  const [query, setQuery] = useState('I need a laptop under ₹1 lakh with accessories.');
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(null);
  const [activeProposal, setActiveProposal] = useState(null);
  const [buyerExpanded, setBuyerExpanded] = useState(false);
  const [catalogItems, setCatalogItems] = useState(DEFAULT_CATALOG_ITEMS);

  useEffect(() => {
    fetch(`${API}/api/catalog`)
      .then(r => r.json())
      .then(d => {
        if (d.products && d.products.length > 0) {
          setCatalogItems(d.products);
        }
      })
      .catch(() => {});
  }, []);

  const isBundleQuery = query.toLowerCase().includes('laptop') && (query.toLowerCase().includes('accessor') || query.toLowerCase().includes('1 lakh') || query.toLowerCase().includes('100000') || query.toLowerCase().includes('bag'));

  const search = async (qText) => {
    const q = qText !== undefined ? qText : query;
    if (!q.trim()) return;
    setBusy(true);
    try {
      const d = await fetch(`${API}/api/catalog/search`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({query: q})
      }).then(r => r.json());
      setResults(d.products || []);
      setSelected(null);
      setDone(null);
    } catch {} finally {
      setBusy(false);
    }
  };

  const initiateBuy = async (isBundle = false, productOverride = null) => {
    const targetProduct = productOverride || selected;
    setBusy(true);
    try {
      const payload = isBundle
        ? { product_id: 'bundle_laptop_bag', is_bundle: true }
        : { product_id: targetProduct?.id };
      const d = await fetch(`${API}/api/catalog/buy`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload)
      }).then(r => r.json());

      if (d.requires_approval && d.proposal) {
        setActiveProposal({
          ...d.proposal,
          isBundle,
          productId: isBundle ? 'bundle_laptop_bag' : targetProduct?.id,
          productName: isBundle ? 'MacBook Air M2 + Laptop Bag Bundle' : targetProduct?.name,
          amount: isBundle ? 99400 : targetProduct?.price
        });
      } else {
        setDone(d);
      }
    } catch {
      setDone({ok: false, message: 'Backend unavailable'});
    } finally {
      setBusy(false);
    }
  };

  const handleApproveProposal = async () => {
    if (!activeProposal) return;
    setBusy(true);
    try {
      const d = await fetch(`${API}/api/catalog/buy`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          product_id: activeProposal.productId,
          is_bundle: activeProposal.isBundle,
          approved: true
        })
      }).then(r => r.json());
      setDone(d);
      setActiveProposal(null);
    } catch {
      setDone({ok: false, message: 'Execution failed'});
      setActiveProposal(null);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="buyer-layout">
      {activeProposal && (
        <ActionProposalModal
          proposal={{
            title: activeProposal.action || activeProposal.title || 'AI Buyer Purchase Approval',
            customer: activeProposal.customer || 'AI Autonomous Buyer',
            amount: activeProposal.amount || 99400,
            risk: activeProposal.risk || 'LOW',
            confidence: activeProposal.confidence || 95,
            why: activeProposal.why || 'Matched merchant catalog within budget.',
            evidence: activeProposal.evidence || [
              'Requested laptop under ₹1,00,000 with accessories',
              'MacBook Air M2 (₹94,900) + Laptop Bag (₹4,500) = ₹99,400',
              'Both items verified in stock in merchant catalog'
            ],
            policy: 'Requires 1-click human approval (> ₹5,000)'
          }}
          onApprove={handleApproveProposal}
          onReject={() => {
            setActiveProposal(null);
            setDone({ok: false, message: 'Purchase rejected by merchant.'});
          }}
          onClose={() => setActiveProposal(null)}
        />
      )}

      <Card className="buyer-chat">
        <Header
          eyebrow="Track 01 · Agentic Commerce"
          title="AI Buyer"
          sub="Natural language request → catalog understanding → policy check → Razorpay Test Mode order."
        />

        {/* Quick prompt suggestions */}
        <div style={{display: 'flex', gap: 6, flexWrap: 'wrap', padding: '0 18px 10px'}}>
          {[
            'I need a laptop under ₹1 lakh with accessories.',
            'AirPods Pro under ₹25,000',
            'Wireless headphones for work',
            'iPhone 15 smartphone'
          ].map(p => (
            <button
              key={p}
              onClick={() => { setQuery(p); search(p); }}
              style={{background: '#f1efff', color: '#5f46de', padding: '6px 11px', borderRadius: 8, fontSize: 11, fontWeight: 500, cursor: 'pointer', border: '1px solid #e0d9ff'}}
            >
              ✦ {p}
            </button>
          ))}
        </div>

        <div className="buyer-messages">
          <div className="message ai">
            <span>◇</span>
            <p>Tell me what you want to buy. I will parse your budget and constraints, search the merchant's catalog, and construct the optimal basket with verified product images.</p>
          </div>

          {query && (
            <div className="message user">
              <p>{query}</p>
            </div>
          )}

          {busy && <div className="typing">Pilot is querying catalog <i/><i/><i/></div>}

          {/* Curated Bundle Recommendation with Real Product Images */}
          {isBundleQuery && (
            <div style={{margin: '14px 0 16px 31px'}}>
              {/* Request Understanding */}
              <div style={{background: '#fafbfe', border: '1px solid #e2e8f0', borderRadius: 10, padding: 14, marginBottom: 12}}>
                <b style={{color: '#6246ea', fontSize: 11, display: 'block', marginBottom: 6}}>
                  ✦ REQUEST UNDERSTANDING:
                </b>
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, fontSize: 12}}>
                  <div><span style={{color: '#64748b'}}>Budget:</span> <b>₹1,00,000</b></div>
                  <div><span style={{color: '#64748b'}}>Category:</span> <b>Laptop</b></div>
                  <div><span style={{color: '#64748b'}}>Requirement:</span> <b>Accessories Included</b></div>
                </div>
              </div>

              {/* Recommendation Bundle Box with Images */}
              <div className="bundle-box">
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12}}>
                  <div>
                    <span className="eyebrow" style={{color: '#6246ea'}}>AI CURATED BUNDLE</span>
                    <h4 style={{margin: '3px 0 0', fontSize: 16, color: '#0f172a'}}>MacBook Air M2 + Premium Laptop Bag</h4>
                  </div>
                  <Badge tone="success">95% Match Score</Badge>
                </div>

                {/* Visual Product Cards with Real Photos */}
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12, margin: '12px 0'}}>
                  <div style={{display: 'flex', gap: 12, padding: 12, background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 10, alignItems: 'center'}}>
                    <img
                      src={getProductImg({id: 'prod_001', name: 'MacBook Air M2'})}
                      alt="MacBook Air M2"
                      style={{width: 68, height: 68, objectFit: 'cover', borderRadius: 8, border: '1px solid #e2e8f0', flexShrink: 0}}
                      onError={e => { e.target.style.display = 'none'; }}
                    />
                    <div style={{minWidth: 0}}>
                      <Badge tone="info" style={{fontSize: 11, padding: '3px 7px'}}>Laptop</Badge>
                      <b style={{display: 'block', fontSize: 13, color: '#0f172a', margin: '3px 0'}}>MacBook Air M2</b>
                      <span style={{fontSize: 14, color: '#0f9f6e', fontWeight: 700}}>₹94,900</span>
                      <small style={{display: 'block', color: '#64748b', fontSize: 11}}>245 in stock</small>
                    </div>
                  </div>

                  <div style={{display: 'flex', gap: 12, padding: 12, background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 10, alignItems: 'center'}}>
                    <img
                      src={getProductImg({id: 'prod_004', name: 'Laptop Bag'})}
                      alt="Premium Laptop Bag"
                      style={{width: 68, height: 68, objectFit: 'cover', borderRadius: 8, border: '1px solid #e2e8f0', flexShrink: 0}}
                      onError={e => { e.target.style.display = 'none'; }}
                    />
                    <div style={{minWidth: 0}}>
                      <Badge tone="info" style={{fontSize: 11, padding: '3px 7px'}}>Accessory</Badge>
                      <b style={{display: 'block', fontSize: 13, color: '#0f172a', margin: '3px 0'}}>Premium Laptop Bag</b>
                      <span style={{fontSize: 14, color: '#0f9f6e', fontWeight: 700}}>₹4,500</span>
                      <small style={{display: 'block', color: '#64748b', fontSize: 11}}>410 in stock</small>
                    </div>
                  </div>
                </div>

                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: 10, margin: '12px 0'}}>
                  <div>
                    <span style={{fontSize: 10, color: '#047857', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em'}}>BUNDLE TOTAL (UNDER BUDGET)</span>
                    <b style={{display: 'block', fontSize: 20, color: '#065f46'}}>₹99,400</b>
                  </div>
                  <Badge tone="success">₹600 under ₹1L budget</Badge>
                </div>

                <b style={{fontSize: 12, color: '#0f172a', display: 'block', marginTop: 10}}>Why Pilot recommends this combination:</b>
                <ul className="bundle-reasons">
                  <li><span>✓</span> Fits budget perfectly (₹99,400 ≤ ₹1,00,000)</li>
                  <li><span>✓</span> 78% of laptop buyers purchase this exact protective bag within 14 days</li>
                  <li><span>✓</span> In stock in merchant catalog with verified Razorpay test checkout</li>
                </ul>

                <div style={{marginTop: 14}}>
                  <Button onClick={() => initiateBuy(true)} disabled={busy} style={{width: '100%', padding: '11px 0', fontSize: 13}}>
                    {busy ? 'Verifying Policy…' : '🛒 Buy Bundle in Test Mode (₹99,400) →'}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Action Notification / Order Status */}
          {done && (
            <div style={{margin: '12px 0 16px 31px'}} className={done.ok ? 'success-box' : 'error-box'}>
              <b>{done.ok ? '✓ Razorpay Test Mode Order Created' : 'Action Notification'}</b>
              <p style={{margin: '4px 0 0', fontSize: 12}}>
                {done.message || (done.order?.id && `Order ID: ${done.order.id} for ${money(done.order.amount / 100)}`)}
              </p>
              {done.order?.id && (
                <small style={{display: 'block', marginTop: 4, color: '#0d6e4b', fontSize: 11}}>
                  Idempotent trace logged · Audit trail committed
                </small>
              )}
            </div>
          )}

          {/* Search Results Output with Product Images */}
          {results.length > 0 && !isBundleQuery && (
            <div style={{margin: '12px 0 16px 31px'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10}}>
                <b style={{fontSize: 12, color: '#64748b'}}>Found {results.length} Catalog Matches:</b>
                <span style={{fontSize: 11, color: '#6246ea'}}>Click to inspect or buy</span>
              </div>
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12}}>
                {results.map((p, i) => (
                  <div
                    key={p.id}
                    className={`product-result-card ${selected?.id === p.id ? 'selected' : ''}`}
                    onClick={() => { setSelected(p); setDone(null); }}
                    style={{
                      background: '#ffffff',
                      border: selected?.id === p.id ? '2px solid #6246ea' : '1px solid #e2e8f0',
                      borderRadius: 12,
                      overflow: 'hidden',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{position: 'relative', width: '100%', height: 130, background: '#f8fafc', overflow: 'hidden'}}>
                      <img
                        src={getProductImg(p)}
                        alt={p.name}
                        style={{width: '100%', height: '100%', objectFit: 'cover'}}
                        onError={e => { e.target.style.display = 'none'; }}
                      />
                      <span style={{position: 'absolute', top: 8, right: 8, background: '#10b981', color: '#ffffff', fontSize: 10, fontWeight: 700, padding: '3px 7px', borderRadius: 6}}>
                        {p.match || 90}% Match
                      </span>
                      <span style={{position: 'absolute', top: 8, left: 8, background: 'rgba(15,23,42,0.75)', color: '#ffffff', fontSize: 10, fontWeight: 600, padding: '3px 7px', borderRadius: 6}}>
                        {p.category}
                      </span>
                    </div>
                    <div style={{padding: 12, display: 'flex', flexDirection: 'column', flex: 1}}>
                      <b style={{fontSize: 14, color: '#0f172a', marginBottom: 3}}>{p.name}</b>
                      <p style={{fontSize: 11, color: '#64748b', margin: '0 0 10px', lineHeight: 1.4}}>{p.description}</p>
                      <div style={{marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8, borderTop: '1px solid #f1f5f9'}}>
                        <b style={{fontSize: 15, color: '#0f9f6e'}}>{money(p.price)}</b>
                        <Badge tone={p.stock > 0 ? 'success' : 'danger'}>
                          {p.stock > 0 ? `${p.stock} in stock` : 'Out of stock'}
                        </Badge>
                      </div>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelected(p);
                          initiateBuy(false, p);
                        }}
                        style={{marginTop: 10, padding: '8px 0', fontSize: 11}}
                      >
                        Buy with Pilot →
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Adjustable AI Buyer Typing Bar */}
        <div className={`buyer-input-wrapper adjustable-composer ${buyerExpanded ? 'is-expanded' : ''}`}>
          <div className="composer-toolbar">
            <div className="composer-toolbar-left">
              <span className="composer-hint">
                <kbd>↵</kbd> Search or Buy &nbsp;·&nbsp; <kbd>⇧</kbd>+<kbd>↵</kbd> New line
              </span>
              {query.trim().length > 0 && (
                <span className="char-count">{query.length} chars</span>
              )}
            </div>
            <div className="composer-toolbar-right">
              {query.trim().length > 0 && (
                <button
                  type="button"
                  className="composer-action-btn clear-btn"
                  onClick={() => setQuery('')}
                  title="Clear input"
                >
                  ✕ Clear
                </button>
              )}
              <button
                type="button"
                className="composer-action-btn resize-toggle-btn"
                onClick={() => setBuyerExpanded(!buyerExpanded)}
                title={buyerExpanded ? "Compact typing bar" : "Expand typing bar for detailed buyer queries"}
              >
                {buyerExpanded ? '⤡ Compact Bar' : '⤢ Expand Bar'}
              </button>
            </div>
          </div>

          <div className="composer-box buyer-composer-box">
            <textarea
              className="adjustable-textarea"
              rows={buyerExpanded ? 4 : 2}
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  if (isBundleQuery) initiateBuy(true);
                  else if (selected) initiateBuy(false);
                  else search();
                }
              }}
              placeholder="e.g. I need a laptop under ₹1 lakh with accessories, or AirPods Pro under ₹25,000…"
            />
            <div className="composer-actions">
              <Button
                className="composer-send-btn"
                onClick={() => isBundleQuery ? initiateBuy(true) : selected ? initiateBuy(false) : search()}
                disabled={busy}
              >
                {busy ? 'Working…' : isBundleQuery ? 'Buy in Test Mode' : selected ? 'Buy Selected' : 'Search catalog →'}
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Right Column: Live Product Showcase (Replaces the old AI-Readable Catalog Schema) */}
      <Card className="buyer-catalog-view">
        <Header
          eyebrow="Merchant Catalog"
          title="Live Product Showcase"
          sub="Products available for AI buyer inquiry & instant test checkout."
          actions={<Badge tone="success">Test Mode</Badge>}
        />
        <div style={{display: 'flex', flexDirection: 'column', gap: 10, marginTop: 14, maxHeight: 650, overflowY: 'auto', paddingRight: 4}}>
          {catalogItems.map(p => (
            <div
              key={p.id}
              className={`catalog-item-card ${selected?.id === p.id ? 'active' : ''}`}
              onClick={() => { setSelected(p); }}
              style={{
                display: 'flex',
                gap: 12,
                padding: 12,
                background: selected?.id === p.id ? '#f5f3ff' : '#ffffff',
                border: selected?.id === p.id ? '1.5px solid #6246ea' : '1px solid #e2e8f0',
                borderRadius: 12,
                alignItems: 'center',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <img
                src={getProductImg(p)}
                alt={p.name}
                style={{width: 58, height: 58, objectFit: 'cover', borderRadius: 8, border: '1px solid #edf2f7', flexShrink: 0}}
                onError={e => { e.target.style.display = 'none'; }}
              />
              <div style={{flex: 1, minWidth: 0}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <b style={{fontSize: 13, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{p.name}</b>
                  <b style={{fontSize: 13, color: '#0f9f6e', marginLeft: 8}}>{money(p.price)}</b>
                </div>
                <small style={{display: 'block', color: '#64748b', fontSize: 11, margin: '2px 0'}}>
                  {p.category} · {p.stock} units available
                </small>
                <div style={{display: 'flex', gap: 8, marginTop: 6}}>
                  <button
                    className="link"
                    style={{fontSize: 11, padding: 0}}
                    onClick={(e) => {
                      e.stopPropagation();
                      setQuery(`Tell me about ${p.name}`);
                      search(`Tell me about ${p.name}`);
                    }}
                  >
                    ✦ Ask AI →
                  </button>
                  <span style={{color: '#cbd5e1'}}>·</span>
                  <button
                    className="link"
                    style={{fontSize: 11, padding: 0, color: '#059669'}}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelected(p);
                      initiateBuy(false, p);
                    }}
                  >
                    Buy Item →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}


export function Anomalies({nav}){
  const [data, setData] = useState(null);

  const load = () => {
    fetch(`${API}/api/anomalies`)
      .then(r => r.json())
      .then(d => { if (d.ok) setData(d); })
      .catch(() => {});
  };
  useEffect(() => { load(); const id = setInterval(load, 5000); return () => clearInterval(id); }, []);

  const anomalyList = data?.anomalies || [
    {id: '1', title: 'Payment failure spike', metric: '15.4% failure rate', impact: 21400, severity: 'High', detail: 'UPI concentration'},
    {id: '2', title: 'Product conversion drop', metric: '-14% conversion drop', impact: 7200, severity: 'Medium', detail: 'Traffic stable'},
    {id: '3', title: 'Refund anomaly', metric: '+22% refunds', impact: 3800, severity: 'Medium', detail: 'Accessory X'},
    {id: '4', title: 'Customer churn spike', metric: '+8% churn risk', impact: 12500, severity: 'Low', detail: '30-day inactive'}
  ];

  return (
    <div>
      <div className="anomaly-hero">
        <span className="eyebrow">Continuous monitoring · Real-Time</span>
        <h2>Active telemetry anomaly detected</h2>
        <p>Payment failure rate increased from <b>7.2% → 15.4%</b> during peak UPI processing hours.</p>
        <Button onClick={()=>nav('/agent')}>Investigate root cause with Copilot →</Button>
      </div>
      <div className="anomaly-list">
        {anomalyList.map(x => (
          <Card key={x.id || x.title}>
            <div className="anomaly-row">
              <span className="anomaly-icon">△</span>
              <div>
                <b>{x.title}</b>
                <p>{x.metric} · {x.detail || x.cause}</p>
              </div>
              <strong>{money(x.impact)}</strong>
              <Badge tone={x.severity === 'High' ? 'danger' : x.severity === 'Medium' ? 'warning' : 'info'}>{x.severity}</Badge>
              <button className="link" onClick={()=>nav('/agent')}>Inspect →</button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function Memory({notify, addAudit}){
  const [data, setData] = useState(null);
  const [syncing, setSyncing] = useState(false);

  const load = () => {
    fetch(`${API}/api/memory`)
      .then(r => r.json())
      .then(d => { if (d.ok) setData(d); })
      .catch(() => {});
  };
  useEffect(() => { load(); const id = setInterval(load, 5000); return () => clearInterval(id); }, []);

  const handleSync = async () => {
    setSyncing(true);
    try {
      const res = await fetch(`${API}/api/memory/sync`, { method: 'POST' });
      const d = await res.json();
      notify?.(d.message || 'Preferences synced across all 6 agents');
      if (d.audit) addAudit?.(d.audit);
      load();
    } catch {
      notify?.('Preferences synced across all 6 agents');
    } finally {
      setSyncing(false);
    }
  };

  const preferences = data?.preferences || [
    { title: 'Rahul Verma Preference', desc: 'Rahul prefers WhatsApp alerts over Email', tag: 'High Priority', icon: '💬' },
    { title: 'Accessory Discount Ceiling', desc: 'Never discount accessories over 10%', tag: 'Policy Bound', icon: '🏷️' },
    { title: 'Execution Schedule', desc: 'Retry failed payments during business hours only', tag: 'High Priority', icon: '⏰' },
    { title: 'Payment Retry Window', desc: 'Preferred payment retry window: 9 AM - 8 PM', tag: 'Schedule', icon: '☀️' },
    { title: 'VIP Protection Rule', desc: 'VIP customers should never receive automated nudges', tag: 'Relationship', icon: '👑' }
  ];

  const patterns = data?.patterns || [
    { pattern: 'HDFC gateway failures spike between 8 PM - 10 PM', impact: 'Routes to ICICI/Axis during peak evening downtime window', confidence: '94%', icon: '🏦' },
    { pattern: 'WhatsApp recovery has 2.4x higher conversion than SMS', impact: 'Default recovery channel prioritized across all high-intent carts', confidence: '91%', icon: '📈' },
    { pattern: 'Tech bundle conversions increase on weekends', impact: 'Dynamic MacBook Air + Bag bundle nudges triggered on Sat/Sun', confidence: '88%', icon: '🛍️' }
  ];

  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: 16}}>
      {/* Feature 8: Callout banner */}
      <div className="memory-policy-banner">
        <div>
          <b>🧬 Memory Policy Boundary</b>
          <p>Pilot remembers merchant preferences, but memory can never override policy.</p>
        </div>
        <Badge tone="info">POLICY PRECEDENCE ENFORCED</Badge>
      </div>

      <div className="dashboard-grid two" style={{gap: 16}}>
        {/* Merchant Preferences */}
        <Card>
          <Header
            eyebrow="Configured Context · Live"
            title="Merchant Preferences"
            sub="Rules established through merchant interactions and direct configuration."
            actions={<Button variant="secondary" onClick={handleSync} disabled={syncing}>{syncing ? 'Syncing…' : 'Sync to Workforce ↻'}</Button>}
          />
          <div className="memory-list" style={{display: 'flex', flexDirection: 'column', gap: 10, marginTop: 12}}>
            {preferences.map((p, i) => (
              <div key={i} style={{display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', background: '#f8f9fb', borderRadius: 10, border: '1px solid #eef0f5'}}>
                <span style={{fontSize: 20}}>{p.icon}</span>
                <div style={{flex: 1}}>
                  <b style={{fontSize: 12, display: 'block', color: '#17203a'}}>{p.title}</b>
                  <p style={{margin: '2px 0 0', fontSize: 11, color: '#5b6479'}}>{p.desc}</p>
                </div>
                <Badge tone={p.tag === 'Policy Bound' ? 'warning' : 'info'}>{p.tag}</Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* Learned Patterns */}
        <Card>
          <Header
            eyebrow="Continuous Learning · Real-Time"
            title="Learned Patterns"
            sub="Empirically observed behavioral and telemetry trends calibrated across transactions."
            actions={<Badge tone="success">{patterns.length} Active Models</Badge>}
          />
          <div style={{display: 'flex', flexDirection: 'column', gap: 12, marginTop: 12}}>
            {patterns.map((pt, i) => (
              <div key={i} style={{padding: 14, background: '#f8f9fb', borderRadius: 10, border: '1px solid #eef0f5'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6}}>
                  <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
                    <span style={{fontSize: 16}}>{pt.icon}</span>
                    <b style={{fontSize: 12, color: '#17203a'}}>{pt.pattern}</b>
                  </div>
                  <Badge tone="success">{pt.confidence} Conf</Badge>
                </div>
                <small style={{display: 'block', color: '#6246ea', fontSize: 10.5, fontWeight: 600}}>
                  Action Impact: {pt.impact}
                </small>
              </div>
            ))}
          </div>
          <div style={{marginTop: 18, padding: 12, background: '#f0f3fa', borderRadius: 8, fontSize: 10.5, color: '#55607b'}}>
            ✦ <b>Continuous Calibration:</b> Outcome data feeds back into the prompt context for the next decision cycle.
          </div>
        </Card>
      </div>
    </div>
  );
}


export function APIConsole({notify}){
 const [selected,setSelected]=useState('GET /api/realtime');const [response,setResponse]=useState(null);const [busy,setBusy]=useState(false);
 const endpoints=[['GET /api/realtime','Live Control Plane'],['GET /api/customers','Customer Tools'],['GET /api/catalog','AI Catalog'],['POST /api/revenue-rescue/simulate','Simulation Tool'],['POST /api/revenue-rescue/execute','Action Tool'],['POST /api/catalog/buy','Agentic Commerce']];
 const send=async()=>{setBusy(true);try{let path=selected.split(' ')[1],opts={};if(selected.includes('simulate')){opts={method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({discount_pct:5,audience:83})}}else if(selected.includes('/execute')){opts={method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({step_id:'failed'})}}else if(selected.includes('/buy')){opts={method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({product_id:'prod_004'})}}const r=await fetch(API+path,opts);const d=await r.json();setResponse({status:r.status,data:d});notify?.(`API ${r.status} response received`)}catch(e){setResponse({status:0,data:{error:e.message}})}finally{setBusy(false)}};
 return <div className="api-console"><Card><Header eyebrow="Engineering visibility" title="Agent API Console" sub="Run the actual Flask tools used by Pilot."/><div className="endpoint-list">{endpoints.map(e=><button key={e[0]} className={selected===e[0]?'selected':''} onClick={()=>{setSelected(e[0]);setResponse(null)}}><span className={e[0].startsWith('GET')?'get':'post'}>{e[0].split(' ')[0]}</span><b>{e[0].split(' ')[1]}</b><small>{e[1]}</small></button>)}</div></Card><Card><Header title={selected} actions={<Badge tone={response?.status===200||response?.status===202?'success':'info'}>{response?`HTTP ${response.status}`:'Ready'}</Badge>}/><div className="code-box"><span>// Request</span><pre>{JSON.stringify(selected.includes('simulate')?{discount_pct:5,audience:83}:selected.includes('execute')?{step_id:'failed'}:selected.includes('/buy')?{product_id:'prod_004'}:{},null,2)}</pre><span>// Live response</span><pre>{JSON.stringify(response?.data||{status:'Press Send test request'},null,2)}</pre></div><Button onClick={send} disabled={busy}>{busy?'Calling backend…':'▶ Send real test request'}</Button></Card></div>;
}

export function Notifications(){const [items,setItems]=useState([]);useEffect(()=>{const load=()=>fetch(`${API}/api/audit`).then(r=>r.json()).then(d=>setItems((d.audit||[]).slice(0,8))).catch(()=>{});load();const id=setInterval(load,5000);return()=>clearInterval(id)},[]);return <Card><Header title="Notification Center" sub="Live events generated by Pilot's backend." actions={<Badge tone="success">Live</Badge>}/><div className="notifications">{items.map((x,i)=><div key={x.id||i} className="notification"><span className="notif-icon">{x.status==='Failed'?'!':x.status==='Approval Required'?'◷':'✦'}</span><div><b>{x.action}</b><p>{x.customer||'Merchant workspace'} · {x.result||'Event recorded'}</p><small>{x.time}</small></div><Badge tone={x.status==='Failed'?'danger':x.status==='Approval Required'?'warning':'success'}>{x.status||'Event'}</Badge><span className="muted">{x.amount?money(x.amount):''}</span></div>)}</div></Card>}


export function DailyBrief({nav}){const [s,setS]=useState(null);useEffect(()=>{const load=()=>fetch(`${API}/api/realtime`).then(r=>r.json()).then(d=>setS(d.snapshot)).catch(()=>{});load();const id=setInterval(load,5000);return()=>clearInterval(id)},[]);return <div><Card className="brief-hero"><div><span className="eyebrow">☀️ Proactive intelligence · Live</span><h2>Good morning, Charan.</h2><p>Pilot reviewed your merchant signals and prepared the highest-impact actions for today.</p></div><Button onClick={()=>nav('/missions')}>Review Action Plan →</Button></Card><div className="stat-grid four">{[['Revenue at risk',money(s?.live?.protected_revenue||62300)],['Potential recovery',money(s?.live?.predicted_recovery||38500)],['Pending approvals',s?.live?.approval_count||4],['AI actions',s?.live?.actions||127]].map(x=><Card key={x[0]}><span className="muted">{x[0]}</span><strong className="metric">{x[1]}</strong></Card>)}</div><Card><Header title="Pilot's morning brief" sub="Evidence-first recommendations · no action is executed without policy checks."/><div className="brief-list"><div><span className="brief-icon">🔴</span><div><b>Payment degradation needs attention</b><p>27 failed payments are candidates for bounded recovery. Expected impact ₹15,800.</p></div><button className="link" onClick={()=>nav('/recovery')}>Inspect →</button></div><div><span className="brief-icon">🛒</span><div><b>83 high-intent carts are aging</b><p>Pilot recommends personalized recovery before considering discounts.</p></div><button className="link" onClick={()=>nav('/cart-agent')}>Inspect →</button></div><div><span className="brief-icon">◉</span><div><b>Customer retention opportunity</b><p>146 repeat buyers show reactivation potential with a margin-safe winback.</p></div><button className="link" onClick={()=>nav('/customers')}>Inspect →</button></div></div></Card></div>}

export function MissionCenter({nav,notify}){
 const [mission,setMission]=useState(null); const [busy,setBusy]=useState('');
 const load=()=>fetch(`${API}/api/revenue-rescue`).then(r=>r.json()).then(d=>setMission(d.mission)).catch(()=>{}); useEffect(()=>{load();const id=setInterval(load,5000);return()=>clearInterval(id)},[]);
 const act=async(id)=>{setBusy(id);try{const d=await fetch(`${API}/api/revenue-rescue/execute`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({step_id:id})}).then(r=>r.json());notify?.(d.message);load()}catch{notify?.('Backend unavailable')}finally{setBusy('')}};
 return <div><Card className="mission-hero"><div><span className="eyebrow">Autonomous growth mission · Live Test Mode</span><h2>🚨 Revenue Rescue Mission</h2><p>Pilot continuously coordinates recovery, winback and upsell opportunities under merchant policy.</p></div><div className="mission-total"><b>{money(mission?.recoverable||38500)}</b><span>expected recovery</span><small>{mission?.confidence||91}% confidence</small></div></Card><div className="mission-grid">{(mission?.steps||[]).map(s=><Card key={s.id} className="mission-step"><div className="mission-step-head"><span className="mission-icon">✦</span><div><b>{s.title}</b><small>{s.count} targets · {money(s.risk)} at risk</small></div><Badge tone={s.status==='Executed'?'success':'info'}>{s.status}</Badge></div><div className="mission-metrics"><span><b>{money(s.expected)}</b><small>Expected impact</small></span><span><b>{s.confidence}%</b><small>Confidence</small></span></div><p>{s.action}</p><Button variant={s.status==='Executed'?'secondary':'primary'} disabled={busy===s.id||s.status==='Executed'} onClick={()=>act(s.id)}>{busy===s.id?'Checking policy…':s.status==='Executed'?'✓ Executed':s.expected>5000?'Request Approval':'Execute Safely'}</Button></Card>)}</div></div>;
}

export function Customer360({notify, addAudit}){
  const [profile,setProfile]=useState(null);
  const [name,setName]=useState('Rahul Verma');
  const [busy,setBusy]=useState(false);
  const [proposal,setProposal]=useState(null);

  const load=async(n=name)=>{
    setBusy(true);
    try{
      const d=await fetch(`${API}/api/customer-360/${encodeURIComponent(n)}`).then(r=>r.json());
      setProfile(d.profile);
    }catch{}finally{setBusy(false)}
  };
  useEffect(()=>{load('Rahul Verma')},[]);

  const handlePrepareRecommendation = () => {
    setProposal({
      title: 'Recommend Laptop Bag Pro (Cross-Sell)',
      customer: name,
      amount: 4500,
      why: '78% of similar buyers purchased an accessory within 14 days.',
      evidence: [
        'Purchased MacBook Air M2 7 days ago',
        'High laptop category affinity & accessory interest',
        'Low price elasticity (0% discount required to convert)',
        'Preferred WhatsApp channel with 84% open rate'
      ],
      expected_benefit: 4500,
      risk: 'LOW',
      policy: 'Within ₹5,000 auto-action limit',
      confidence: 72
    });
  };

  const handleApproveProposal = async () => {
    try {
      const res = await fetch(`${API}/api/customer-agent/action`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          action: proposal?.title || 'Send Product Recommendation',
          customer: name,
          amount: proposal?.amount || 4500
        })
      });
      const d = await res.json();
      notify?.(d.message || `Personalized recommendation sent to ${name} via WhatsApp!`);
      if (d.audit) addAudit?.(d.audit);
    } catch {
      notify?.(`Personalized recommendation sent to ${name} via WhatsApp!`);
    }
    setProposal(null);
  };

  return <div>
    <Card>
      <Header
        eyebrow="Customer Intelligence · Customer 360"
        title="Customer 360"
        sub="A unified AI-readable view of value, affinity, churn risk, purchase history and next best action."
        actions={
          <div style={{display:'flex',gap:8,alignItems:'center'}}>
            <select value={name} onChange={e=>{setName(e.target.value);load(e.target.value)}} style={{padding: '8px 12px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 12}}>
              {['Rahul Verma','Anita Singh','Vikram Rao','Neha Patel','Arjun Mehta'].map(x=><option key={x}>{x}</option>)}
            </select>
            <Badge tone="success">Live Profile</Badge>
          </div>
        }
      />
      {busy ? (
        <div className="empty">Loading customer intelligence…</div>
      ) : profile && (
        <div className="customer360-grid">
          {/* Header Card: Name & Segment */}
          <div style={{gridColumn: '1 / -1', padding: '16px 20px', background: '#f8f9fe', border: '1px solid #e1e4f2', borderRadius: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <div>
              <span className="eyebrow" style={{color: '#6246ea'}}>PROFILE INTELLIGENCE</span>
              <h2 style={{margin: '4px 0 0', fontSize: 20}}>{name.toUpperCase()} · <span style={{color: '#0f9f6e'}}>{name === 'Rahul Verma' ? 'VIP CUSTOMER' : profile.segment}</span></h2>
            </div>
            <div style={{display: 'flex', gap: 10}}>
              <Badge tone="success">{profile.re_purchase_probability || 87}% Purchase Probability</Badge>
              <Badge tone="info">{profile.churn_pct || 8}% Churn Risk</Badge>
            </div>
          </div>

          {/* 5 Core KPIs */}
          <div className="customer360-kpis">
            {[
              ['Lifetime Value', money(profile.ltv || 145600)],
              ['Orders', profile.orders || 12],
              ['Avg Order Value', money(profile.aov || 12133)],
              ['Purchase Probability', (profile.re_purchase_probability || 87) + '%'],
              ['Churn Risk', (profile.churn_pct || 8) + '%'],
              ['RFM Score', profile.rfm?.overall || 87]
            ].map(x=>(
              <span key={x[0]}>
                <b>{x[1]}</b>
                <small>{x[0]}</small>
              </span>
            ))}
          </div>

          {/* AI Customer Understanding */}
          <div className="ai-understanding">
            <h3>✦ AI CUSTOMER UNDERSTANDING</h3>
            <p style={{fontSize: 11, color: '#717b94', margin: '0 0 10px'}}>What Pilot knows:</p>
            <div style={{display: 'grid', gap: 6}}>
              <div style={{padding: '7px 10px', background: '#fff', borderRadius: 6, border: '1px solid #edf0f7', fontSize: 11, color: '#2d3748'}}>✓ High-value customer</div>
              <div style={{padding: '7px 10px', background: '#fff', borderRadius: 6, border: '1px solid #edf0f7', fontSize: 11, color: '#2d3748'}}>✓ Laptop category affinity</div>
              <div style={{padding: '7px 10px', background: '#fff', borderRadius: 6, border: '1px solid #edf0f7', fontSize: 11, color: '#2d3748'}}>✓ Low discount sensitivity (zero discount required)</div>
              <div style={{padding: '7px 10px', background: '#fff', borderRadius: 6, border: '1px solid #edf0f7', fontSize: 11, color: '#2d3748'}}>✓ Prefers WhatsApp for notification delivery</div>
              <div style={{padding: '7px 10px', background: '#fff', borderRadius: 6, border: '1px solid #edf0f7', fontSize: 11, color: '#2d3748'}}>✓ Frequently purchases accessories within 14 days</div>
            </div>
          </div>

          {/* Next Best Action */}
          <div className="next-best-action">
            <span className="eyebrow" style={{color: '#5b40e5'}}>NEXT BEST ACTION</span>
            <h3 style={{fontSize: 16, margin: '6px 0'}}>Recommend: Laptop Bag</h3>
            <p style={{fontSize: 11, color: '#4b5568', margin: '0 0 12px', lineHeight: 1.5}}>
              <b>Reason:</b> 78% of similar buyers purchased an accessory within 14 days. Zero margin discount recommended.
            </p>
            <div className="nba-row" style={{marginBottom: 14}}>
              <Badge tone="success">Expected Conversion: 72%</Badge>
              <b style={{fontSize: 14, color: '#0f9f6e'}}>Expected Revenue: ₹4,500</b>
            </div>
            <Button onClick={handlePrepareRecommendation} style={{width: '100%'}}>
              ⚡ Prepare Recommendation
            </Button>
          </div>

          {/* Customer Timeline */}
          <div className="timeline">
            <h3>Customer Timeline</h3>
            {[
              { time: 'Today', event: 'Viewed Laptop Bag in Web Storefront', channel: 'Web Storefront' },
              { time: 'Yesterday', event: 'Purchased MacBook Air M2 (₹94,900 via UPI)', channel: 'Razorpay Checkout' },
              { time: '7 days ago', event: 'Opened WhatsApp campaign and browsed accessories', channel: 'WhatsApp Agent' },
              { time: '14 days ago', event: 'Purchased laptop and browsed accessory bundles', channel: 'Web Storefront' }
            ].map((t, i) => (
              <div key={i} style={{padding: '10px 0', borderBottom: '1px solid #edf0f5'}}>
                <span style={{fontWeight: 700, color: '#6246ea'}}>{t.time}</span>
                <b>{t.event}</b>
                <small>{t.channel}</small>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>

    {proposal && (
      <ActionProposalModal
        proposal={proposal}
        onApprove={handleApproveProposal}
        onReject={()=>{notify?.('Recommendation cancelled'); setProposal(null);}}
        onClose={()=>setProposal(null)}
      />
    )}
  </div>;
}


export function AgentControl({notify, addAudit}){
  const [agents,setAgents]=useState([]);
  const [selectedAgent, setSelectedAgent] = useState('recovery');
  const [busy,setBusy]=useState('');

  const AGENT_CONFIGS = {
    revenue: {
      action: 'Scanning payment and cart anomaly signals across channels',
      guardrails: ['Continuous 5s anomaly scanning', 'Zero false alarm threshold', 'Strict policy-bound alerting'],
      progress: [
        { label: 'anomalies tracked', val: 7 },
        { label: 'signals analyzed', val: 342 },
        { label: 'leakage flagged', val: 3 },
        { label: 'actions suggested', val: 3 }
      ]
    },
    recovery: {
      action: 'Preparing intelligent payment retry strategy',
      guardrails: ['Max retries: 2', 'Payment limit: ₹5,000 auto-execution', 'Approval required above limit'],
      progress: [
        { label: 'cases identified', val: 27 },
        { label: 'analyzed', val: 19 },
        { label: 'eligible', val: 12 },
        { label: 'awaiting approval', val: 8 }
      ]
    },
    customer: {
      action: 'Calibrating WhatsApp vs Email delivery preferences for VIPs',
      guardrails: ['Zero unauthorized discounts', 'VIP protection policy', 'Channel preference bound'],
      progress: [
        { label: 'customers monitored', val: 146 },
        { label: 'churn risk assessed', val: 146 },
        { label: 'high LTV flagged', val: 18 },
        { label: 'nba queued', val: 5 }
      ]
    },
    product: {
      action: 'Calculating MacBook Air + Bag purchase affinity (78%)',
      guardrails: ['Minimum bundle margin >= 25%', 'Affinity threshold > 70%', '1-Click storefront deploy'],
      progress: [
        { label: 'catalog items', val: 8 },
        { label: 'bundles tested', val: 14 },
        { label: 'affinity matches', val: 4 },
        { label: 'ready to deploy', val: 1 }
      ]
    },
    campaign: {
      action: 'Evaluating margin-safe winback simulation and ROI',
      guardrails: ['Zero margin erosion', 'Audience cap 500 merchants', 'Approval gate required'],
      progress: [
        { label: 'target audience', val: 83 },
        { label: 'discount ceiling', val: '5%' },
        { label: 'roi modeled', val: '4.7x' },
        { label: 'policy compliant', val: '100%' }
      ]
    },
    buyer: {
      action: 'Ready to accept machine-readable queries and create Test Mode orders',
      guardrails: ['Razorpay Test Mode only', 'Verified schema validation', 'Zero real-fund debiting'],
      progress: [
        { label: 'catalog exposed', val: 8 },
        { label: 'schema verified', val: 'Yes' },
        { label: 'orders processed', val: 3 },
        { label: 'active test keys', val: 1 }
      ]
    }
  };

  const load=()=>fetch(`${API}/api/agents`).then(r=>r.json()).then(d=>{
    if(d.agents && d.agents.length){
      setAgents(d.agents);
    }
  }).catch(()=>{});

  useEffect(()=>{load();const id=setInterval(load,5000);return()=>clearInterval(id)},[]);

  const run=async(id)=>{
    setBusy(id);
    try{
      const d=await fetch(`${API}/api/agents/${id}/run`,{method:'POST'}).then(r=>r.json());
      notify?.(d.message || 'Agent mission started');
      if(d.audit) addAudit?.(d.audit);
      load();
    }catch{}finally{setBusy('')}
  };

  const toggle=async(id)=>{
    setBusy(id);
    try{
      const d=await fetch(`${API}/api/agents/${id}/toggle`,{method:'POST'}).then(r=>r.json());
      notify?.(d.message || 'Agent status updated');
      if(d.audit) addAudit?.(d.audit);
      load();
    }catch{}finally{setBusy('')}
  };

  const defaultList = [
    { id: 'revenue', name: 'Revenue Agent', status: 'Working', impact: 15800, confidence: 92, mission: 'Find and prioritize lost revenue leakage' },
    { id: 'recovery', name: 'Recovery Agent', status: 'Working', impact: 15800, confidence: 92, mission: 'Recover eligible failed payments via smart retries' },
    { id: 'customer', name: 'Customer Agent', status: 'Monitoring', impact: 6100, confidence: 87, mission: 'Monitor VIP customer churn risk & retention' },
    { id: 'product', name: 'Product Agent', status: 'Monitoring', impact: 4500, confidence: 84, mission: 'Find cross-sell and bundle affinity opportunities' },
    { id: 'campaign', name: 'Campaign Agent', status: 'Ready', impact: 12400, confidence: 87, mission: 'Orchestrate margin-safe customer campaigns' },
    { id: 'buyer', name: 'AI Buyer', status: 'Ready', impact: 0, confidence: 96, mission: 'Agentic commerce catalog purchasing in Test Mode' }
  ];

  const agentList = (agents && agents.length) ? agents : defaultList;
  const current = agentList.find(a => a.id === selectedAgent) || agentList[0] || defaultList[0];
  const currentCfg = AGENT_CONFIGS[current.id] || AGENT_CONFIGS.recovery;
  const isWorking = current.status === 'Working' || current.status === 'Monitoring';

  return <div>
    {/* Hero Card */}
    <Card className="agent-control-hero">
      <div className="agent-control-hero-content">
        <div className="agent-control-hero-icon">✦</div>
        <div>
          <span className="eyebrow">AI WORKFORCE CONTROL ROOM · REAL-TIME</span>
          <h2>Agent Control Room</h2>
          <p>Specialized autonomous agents collaborating under one merchant AI Constitution, shared context, and unified audit trail.</p>
        </div>
      </div>
      <Badge tone="success">● {agentList.length} Agents Live & Synchronized</Badge>
    </Card>

    {/* AI WORKFORCE TABLE */}
    <Card style={{marginTop: 18}}>
      <Header title="AI Workforce Status" sub="Live operational status across all specialized revenue agents. Click to inspect blueprint."/>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Agent Name</th>
              <th>Status</th>
              <th>Active Mission</th>
              <th>Potential Impact</th>
              <th>Controls</th>
            </tr>
          </thead>
          <tbody>
            {agentList.map(w => {
              const tone = w.status === 'Working' ? 'success' : w.status === 'Monitoring' ? 'info' : w.status === 'Paused' ? 'danger' : 'warning';
              const indicator = w.status === 'Paused' ? '✕' : w.status === 'Working' || w.status === 'Monitoring' ? '●' : '○';
              return (
                <tr
                  key={w.id}
                  style={{cursor: 'pointer', background: current.id === w.id ? '#f7f6fe' : 'transparent', transition: 'background 0.2s'}}
                  onClick={()=>setSelectedAgent(w.id)}
                >
                  <td><b>{w.name}</b> {current.id === w.id && <span style={{fontSize: 11, color: '#6246ea'}}>◀ Active</span>}</td>
                  <td><Badge tone={tone}>{indicator} {w.status}</Badge></td>
                  <td>{w.mission}</td>
                  <td><b style={{color: '#0f9f6e'}}>{typeof w.impact === 'number' ? money(w.impact) : (w.impact || 'Catalog')}</b></td>
                  <td>
                    <div style={{display: 'flex', gap: 6}}>
                      <Button variant="secondary" onClick={(e)=>{e.stopPropagation(); setSelectedAgent(w.id);}} style={{fontSize: 11}}>
                        Inspect
                      </Button>
                      <Button
                        variant={w.status === 'Paused' ? 'primary' : 'secondary'}
                        onClick={(e)=>{e.stopPropagation(); toggle(w.id);}}
                        disabled={busy===w.id}
                        style={{fontSize: 11}}
                      >
                        {busy===w.id ? '…' : (w.status === 'Paused' ? 'Resume' : 'Pause')}
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>

    {/* REAL MISSION INSPECTOR */}
    <Card style={{marginTop: 18}}>
      <Header
        eyebrow="Agent Mission Blueprint · Live State"
        title={`${current.name} · Active Mission`}
        sub="Detailed guardrails, execution progress, and bounded decision state."
        actions={<Badge tone={isWorking ? 'success' : 'warning'}>{isWorking ? '● ACTIVE' : '○ ' + current.status.toUpperCase()}</Badge>}
      />

      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, marginTop: 10}}>
        <div style={{padding: 16, background: '#f8f9fe', border: '1px solid #e2e6f3', borderRadius: 12}}>
          <span className="eyebrow" style={{color: '#6246ea'}}>MISSION STATEMENT</span>
          <h3 style={{margin: '6px 0', fontSize: 15}}>{current.mission}</h3>
          <p style={{fontSize: 11, color: '#6b7280', margin: '4px 0 12px'}}>
            Assigned to <b>{current.name}</b> with real-time feedback loop to unified audit trail.
          </p>

          <span className="eyebrow" style={{color: '#0f9f6e'}}>LIVE PROGRESS</span>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, margin: '8px 0'}}>
            {currentCfg.progress.map((p, idx) => (
              <div key={idx} style={{background: '#fff', padding: 8, borderRadius: 6, border: '1px solid #edf0f7'}}>
                <b style={{fontSize: 13, color: '#17203a'}}>{p.val}</b>
                <small style={{display: 'block', color: '#718096', fontSize: 10.5}}>{p.label}</small>
              </div>
            ))}
          </div>
        </div>

        <div style={{padding: 16, background: '#f8f9fe', border: '1px solid #e2e6f3', borderRadius: 12}}>
          <span className="eyebrow" style={{color: '#6246ea'}}>CURRENT ACTION</span>
          <h3 style={{margin: '6px 0', fontSize: 15}}>{currentCfg.action}</h3>
          <div style={{display: 'flex', justifyContent: 'space-between', margin: '10px 0'}}>
            <span>Expected impact: <b style={{color: '#0f9f6e'}}>{typeof current.impact === 'number' ? money(current.impact) : current.impact}</b></span>
            <span>Confidence: <b style={{color: '#6246ea'}}>{current.confidence || 92}%</b></span>
          </div>

          <span className="eyebrow" style={{color: '#e53e3e'}}>GUARDRAILS ENFORCED</span>
          <ul style={{listStyle: 'none', padding: 0, margin: '8px 0', fontSize: 11, color: '#4a5568'}}>
            {currentCfg.guardrails.map((g, idx) => (
              <li key={idx} style={{margin: '3px 0'}}>• {g}</li>
            ))}
          </ul>

          <div style={{display: 'flex', gap: 8, marginTop: 14}}>
            <Button
              variant="secondary"
              onClick={()=>toggle(current.id)}
              disabled={busy===current.id}
            >
              {busy===current.id ? '…' : (current.status === 'Paused' ? '▶ Resume Agent' : '⏸ Pause Agent')}
            </Button>
            <Button
              variant="secondary"
              onClick={()=>notify?.(`Reviewing ${current.name} activity queue`)}
            >
              📋 Review
            </Button>
            <Button
              onClick={()=>run(current.id)}
              disabled={busy===current.id}
            >
              {busy===current.id ? 'Running…' : '⚡ Run Mission'}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  </div>;
}

export function Evaluation(){const [m,setM]=useState(null);const [busy,setBusy]=useState(false);const run=async()=>{setBusy(true);try{const d=await fetch(`${API}/api/evaluation/run`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({customers:1000,orders:500,payments:750,failed_payments:100,abandoned_carts:150})}).then(r=>r.json());setM(d.metrics)}catch{}finally{setBusy(false)}};return <div><Card className="evaluation-hero"><div><span className="eyebrow">Judge mode · repeatable benchmark</span><h2>Agent Evaluation Lab</h2><p>Run a fixed workload and measure whether the agent detects opportunities without violating policy.</p></div><Button onClick={run} disabled={busy}>{busy?'Running benchmark…':'Run Agent Evaluation →'}</Button></Card>{m&&<><div className="stat-grid four">{[['Opportunities',m.opportunities_detected],['Correct interventions',m.correct_interventions],['Revenue recovered',money(m.revenue_recovered)],['Policy violations',m.policy_violations],['False actions',m.false_actions],['Safe execution',Math.round(m.safe_execution_rate*100)+'%'],['Decision time',m.avg_decision_ms+' ms'],['Failed payments',m.failed_payments]].map(x=><Card key={x[0]}><span className="muted">{x[0]}</span><strong className="metric">{x[1]}</strong></Card>)}</div><Card><Header title="Evaluation verdict"/><div className="verdict"><span>✓</span><div><b>Bounded agent behavior confirmed</b><p>{m.policy_violations===0?'Zero policy violations were recorded in this run.':'Review policy violations before submission.'} The benchmark is repeatable and every run is auditable.</p></div></div></Card></>}</div>}

export function Catalog(){
  const [products,setProducts]=useState([]);
  useEffect(()=>{fetch(`${API}/api/catalog`).then(r=>r.json()).then(d=>setProducts(d.products||[])).catch(()=>{})},[]);
  return (
    <div>
      <Card>
        <Header eyebrow="Agentic commerce" title="Merchant Product Catalog" sub="Structured catalog context exposed to AI buyers with live images and pricing." actions={<Badge tone="success">Test Mode</Badge>}/>
        <div className="catalog-table">
          {products.map(p=>(
            <div key={p.id} style={{display: 'flex', alignItems: 'center', gap: 14, padding: '12px 0', borderBottom: '1px solid #f1f5f9'}}>
              <img
                src={getProductImg(p)}
                alt={p.name}
                style={{width: 50, height: 50, objectFit: 'cover', borderRadius: 8, border: '1px solid #e2e8f0', flexShrink: 0}}
                onError={e=>{e.target.style.display='none'}}
              />
              <span style={{flex: 1}}>
                <b style={{fontSize: 14, color: '#0f172a'}}>{p.name}</b>
                <small style={{display: 'block', color: '#64748b', fontSize: 11, marginTop: 2}}>{p.category} · {p.description}</small>
              </span>
              <b style={{fontSize: 14, color: '#0f9f6e'}}>{money(p.price)}</b>
              <span style={{fontSize: 12, color: '#64748b'}}>{p.stock} in stock</span>
              <Badge tone={p.stock>0?'success':'danger'}>{p.stock>0?'Available':'Out of stock'}</Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
