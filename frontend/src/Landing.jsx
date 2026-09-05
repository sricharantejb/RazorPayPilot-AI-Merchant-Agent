import React from 'react';

const Logo = () => (
  <div className="lp-logo-wrap">
    <div className="lp-logo">RP</div>
    <div><b>RazorPayPilot</b><span>AI Revenue Operating System</span></div>
  </div>
);

const Arrow = () => <span className="lp-arrow">→</span>;

export default function Landing({ nav }) {
  return (
    <div className="landing-page">
      <nav className="lp-nav">
        <Logo />
        <div className="lp-nav-links">
          <a href="#how">How it works</a>
          <a href="#agents">AI Agents</a>
          <a href="#trust">Trust & Safety</a>
          <a href="#impact">Impact</a>
        </div>
        <div className="lp-nav-actions">
          <button className="lp-login" onClick={() => nav('/dashboard')}>Log in</button>
          <button className="lp-primary lp-small" onClick={() => nav('/register')}>Start building <Arrow /></button>
        </div>
      </nav>

      <main>
        <section className="lp-hero">
          <div className="lp-glow lp-glow-one" />
          <div className="lp-glow lp-glow-two" />
          <div className="lp-hero-copy">
            <div className="lp-pill"><span>✦</span> Autonomous AI for merchant growth</div>
            <h1>Turn lost revenue into <em>growth.</em></h1>
            <p className="lp-lead">RazorPayPilot is your AI co-founder for commerce — continuously finding revenue opportunities, deciding what to do, safely taking action and proving the financial impact.</p>
            <div className="lp-hero-actions">
              <button className="lp-primary" onClick={() => nav('/register')}>Build your AI Growth Agent <Arrow /></button>
              <button className="lp-secondary" onClick={() => nav('/dashboard')}>Explore Command Center <span>↗</span></button>
            </div>
            <div className="lp-proof-row">
              <span>✓ Razorpay Test Mode</span>
              <span>✓ Human approval controls</span>
              <span>✓ Full audit trail</span>
            </div>
          </div>

          <div className="lp-command-preview">
            <div className="lp-preview-top">
              <div className="lp-window-dots"><i/><i/><i/></div>
              <span>RAZORPAYPILOT / COMMAND CENTER</span>
              <b>TEST MODE</b>
            </div>
            <div className="lp-preview-body">
              <aside className="lp-mini-sidebar">
                <div className="lp-mini-brand">RP</div>
                {['⌂','✦','◈','◉','◇','↗'].map((x,i)=><span className={i===1?'on':''} key={i}>{x}</span>)}
              </aside>
              <div className="lp-mini-main">
                <div className="lp-mini-header"><div><small>AI MERCHANT COMMAND CENTER</small><h3>Good morning, Charan 👋</h3></div><span className="lp-avatar">CC</span></div>
                <div className="lp-mini-stats">
                  <div><small>Total revenue</small><b>₹24.8L</b><em>↑ 12.5%</em></div>
                  <div className="risk"><small>Revenue at risk</small><b>₹62,300</b><em>7 opportunities</em></div>
                  <div><small>Recovered</small><b>₹38,500</b><em>↑ 24.7%</em></div>
                  <div><small>AI actions</small><b>127</b><em>91.4% success</em></div>
                </div>
                <div className="lp-mini-grid">
                  <div className="lp-mini-chart"><div className="lp-mini-title"><b>Revenue trajectory</b><span>+11.2%</span></div><div className="lp-line"><i/><i/><i/><i/><i/><i/><i/><i/></div></div>
                  <div className="lp-mini-ai"><div className="lp-ai-head"><span>✦</span><b>Pilot found 7 opportunities</b></div><strong>₹18,300 potentially recoverable</strong><p>27 failed payments · 83 high-intent carts</p><button onClick={() => nav('/opportunities')}>Review opportunities →</button></div>
                </div>
                <div className="lp-mini-feed"><div><span className="dot red"/><b>Failed payments</b><small>27 customers · 92% confidence</small><strong>₹15,800</strong></div><div><span className="dot amber"/><b>Abandoned carts</b><small>83 high-intent carts</small><strong>₹16,200</strong></div><div><span className="dot green"/><b>Repeat purchase</b><small>Opportunity detected</small><strong>₹8,400</strong></div></div>
              </div>
            </div>
          </div>
        </section>

        <section className="lp-trust-strip">
          <span>BUILT FOR THE AI-DRIVEN MERCHANT</span>
          <b>Detect</b><i>→</i><b>Understand</b><i>→</i><b>Decide</b><i>→</i><b>Guard</b><i>→</i><b>Act</b><i>→</i><b>Measure</b><i>→</i><b>Learn</b>
        </section>

        <section className="lp-section" id="how">
          <div className="lp-section-head"><div><span className="lp-kicker">ONE CLOSED LOOP</span><h2>From a signal to a measurable <em>business outcome.</em></h2></div><p>Not another analytics dashboard. Pilot turns merchant data into decisions, bounded actions and verified outcomes.</p></div>
          <div className="lp-flow">
            {[
              ['01','Observe','Understand customers, orders, payments, products and checkout behavior.','◉'],
              ['02','Find','Detect revenue leakage, recovery opportunities and growth signals.','⌕'],
              ['03','Reason','Diagnose root cause and score the best intervention.','✦'],
              ['04','Guard','Check merchant policies, limits and approval requirements.','◇'],
              ['05','Act','Execute in Test Mode or route sensitive actions for approval.','↗'],
              ['06','Prove','Verify the result, measure impact, learn and write the audit trail.','✓']
            ].map((x,i)=><div className="lp-flow-card" key={x[0]}><span className="lp-flow-number">{x[0]}</span><div className="lp-flow-icon">{x[3]}</div><h3>{x[1]}</h3><p>{x[2]}</p>{i<5&&<span className="lp-flow-arrow">→</span>}</div>)}
          </div>
        </section>

        <section className="lp-section lp-dark-section" id="agents">
          <div className="lp-section-head light"><div><span className="lp-kicker">SPECIALIZED INTELLIGENCE</span><h2>A team of AI agents. <em>One orchestrator.</em></h2></div><p>Each agent owns a business job, while the Policy and Action layers keep every money action bounded and explainable.</p></div>
          <div className="lp-agent-board">
            <div className="lp-orchestrator"><span>✦</span><b>ORCHESTRATOR</b><small>Plans and coordinates the next best action</small></div>
            <div className="lp-agent-grid">
              {[
                ['Revenue Agent','Finds opportunities','↗'],['Payment Agent','Diagnoses payment failures','₹'],['Recovery Agent','Recovers lost revenue','↻'],['Customer Agent','Understands intent & LTV','◉'],['Product Agent','Finds cross-sell signals','◇'],['Campaign Agent','Builds growth campaigns','✦']
              ].map(x=><div className="lp-agent" key={x[0]}><span>{x[2]}</span><b>{x[0]}</b><small>{x[1]}</small></div>)}
            </div>
            <div className="lp-agent-bottom"><div><span>🛡</span><b>Policy Agent</b><small>Merchant AI Constitution · limits · approvals</small></div><div><span>⚡</span><b>Action Agent</b><small>Safe Test Mode execution · idempotency</small></div><div><span>◔</span><b>Measurement Agent</b><small>Prediction vs actual · ROI · learning</small></div></div>
          </div>
        </section>

        <section className="lp-section" id="trust">
          <div className="lp-section-head"><div><span className="lp-kicker">TRUST BY DESIGN</span><h2>Autonomy without <em>giving up control.</em></h2></div><p>The agent can observe, recommend or act — but it always operates inside the merchant's constitution.</p></div>
          <div className="lp-trust-grid">
            <div className="lp-policy-card"><div className="lp-card-label">MERCHANT AI CONSTITUTION</div><h3>Every action has a boundary.</h3><div className="lp-rule"><span>01</span><b>Auto-retry payments below</b><strong>₹5,000</strong></div><div className="lp-rule"><span>02</span><b>Maximum discount</b><strong>10%</strong></div><div className="lp-rule"><span>03</span><b>Campaigns above</b><strong>1,000 users</strong></div><div className="lp-rule"><span>04</span><b>Automatic refunds</b><strong>BLOCKED</strong></div><div className="lp-rule"><span>05</span><b>Daily AI spend</b><strong>₹25,000</strong></div></div>
            <div className="lp-approval-card"><div className="lp-card-label">HUMAN-IN-THE-LOOP</div><div className="lp-approval-head"><span className="lp-risk-icon">!</span><div><small>AI ACTION REQUEST</small><h3>Recover payment</h3></div><span className="lp-badge green">WITHIN POLICY</span></div><div className="lp-approval-data"><div><small>Customer</small><b>Rahul Verma</b></div><div><small>Amount</small><b>₹8,500</b></div><div><small>Recovery probability</small><b>91%</b></div><div><small>Expected recovery</small><b>₹8,500</b></div></div><div className="lp-reason"><b>Why?</b><p>Temporary bank-side failure. Customer has three previous successful payments using the same method.</p></div><div className="lp-approval-actions"><button onClick={() => nav('/approval')}>Reject</button><button onClick={() => nav('/approval')}>Approve & execute</button></div></div>
            <div className="lp-failure-card"><div className="lp-card-label">FAILURE CENTER</div><h3>Graceful failure is a feature.</h3><div className="lp-failure-flow"><span>Action</span><i>→</i><span>API timeout</span><i>→</i><span>Retry</span><i>→</i><span>Stop</span></div><div className="lp-safe-result">✓ No duplicate transaction created<br/><small>Merchant notified · audit entry created</small></div></div>
          </div>
        </section>

        <section className="lp-section lp-impact" id="impact">
          <div className="lp-impact-copy"><span className="lp-kicker">MEASURE WHAT MATTERS</span><h2>Your AI should prove its <em>worth.</em></h2><p>Every action feeds a closed-loop measurement system. Compare predicted recovery with actual recovery, calculate ROI and continuously calibrate the strategy.</p><button className="lp-secondary dark" onClick={() => nav('/dashboard')}>Open Command Center <Arrow /></button></div>
          <div className="lp-impact-dashboard"><div className="lp-impact-top"><div><small>AI GENERATED BUSINESS IMPACT</small><h3>Demo / Simulation results</h3></div><span>THIS MONTH</span></div><div className="lp-impact-metrics"><div><small>Revenue recovered</small><b>₹38,500</b><em>+24.7%</em></div><div><small>Revenue protected</small><b>₹62,300</b><em>7 opportunities</em></div><div><small>Additional revenue</small><b>₹51,200</b><em>+14.6%</em></div><div><small>Successful actions</small><b>104</b><em>of 127</em></div></div><div className="lp-roi"><div><small>AI operating cost</small><b>₹1,240</b></div><div><small>Revenue generated</small><b>₹51,200</b></div><div><small>AI ROI</small><strong>41.3×</strong></div></div></div>
        </section>

        <section className="lp-final-cta">
          <div className="lp-final-orb">✦</div><span className="lp-kicker">YOUR AI CO-FOUNDER IS READY</span><h2>Don't just watch your revenue.<br/><em>Let AI grow it.</em></h2><p>Build the merchant operating system that detects, decides, acts and learns.</p><button className="lp-primary" onClick={() => nav('/register')}>Create your AI workspace <Arrow /></button><small>Razorpay Test Mode · Demo-safe · Human approval controls</small>
        </section>
      </main>

      <footer className="lp-footer"><Logo /><span>© 2026 RazorPayPilot · AI Revenue Operating System · Test Mode Demo</span><div><button onClick={() => nav('/dashboard')}>Command Center</button><button onClick={() => nav('/register')}>Register</button></div></footer>
    </div>
  );
}
