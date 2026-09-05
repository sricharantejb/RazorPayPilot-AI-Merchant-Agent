export const NAV=[
 {title:'COMMAND CENTER',items:[{path:'dashboard',label:'Overview',icon:'📊'},{path:'agent',label:'AI Copilot',icon:'✦'}]},
 {title:'INTELLIGENCE',items:[{path:'recovery',label:'Revenue Recovery',icon:'💰'},{path:'customers',label:'Customer Intelligence',icon:'👥'},{path:'customer-360',label:'Customer 360',icon:'👤'},{path:'products',label:'Products',icon:'📦'},{path:'payments',label:'Payments',icon:'💳'},{path:'opportunities',label:'Opportunities',icon:'🎯',badge:'7'}]},
 {title:'AI WORKFORCE',items:[{path:'agent-control',label:'Agent Control Room',icon:'🤖'},{path:'ai-buyer',label:'AI Buyer',icon:'🛒'}]},
 {title:'AUTOMATION',items:[{path:'missions',label:'Rescue Missions',icon:'🚨'},{path:'approval',label:'Approvals',icon:'✅',badge:'4'},{path:'safety',label:'Policies',icon:'🛡️'},{path:'audit',label:'Audit Trail',icon:'📜'}]},
 {title:'DEVELOPER',items:[{path:'sandbox',label:'Sandbox',icon:'🧪'}]},
 {title:'SYSTEM',items:[{path:'settings',label:'Settings',icon:'⚙️'}]}
];
export const PAGE_META={
 dashboard:{title:'AI Command Center',section:'Command Center'},agent:{title:'AI Copilot · Intelligence Layer',section:'Command Center'},'daily-brief':{title:'Daily AI Brief',section:'Command Center'},
 recovery:{title:'Revenue Recovery Agent',section:'Intelligence'},customers:{title:'Customer Intelligence',section:'Intelligence'},'customer-360':{title:'Customer 360',section:'Intelligence'},products:{title:'Product Intelligence',section:'Intelligence'},payments:{title:'Payment Intelligence',section:'Intelligence'},orders:{title:'Order Management',section:'Intelligence'},opportunities:{title:'Opportunity Intelligence',section:'Intelligence'},
 'agent-control':{title:'Agent Control Room',section:'AI Workforce'},'ai-buyer':{title:'AI Buyer · Agentic Commerce',section:'AI Workforce'},'cart-agent':{title:'Abandoned Checkout Agent',section:'AI Workforce'},campaigns:{title:'Campaign Orchestrator',section:'AI Workforce'},'customer-agent':{title:'Customer Agent',section:'AI Workforce'},'product-agent':{title:'Product Agent',section:'AI Workforce'},
 missions:{title:'Revenue Rescue Mission',section:'Automation'},approval:{title:'Human Approval Center',section:'Automation'},safety:{title:'🛡️ Pilot Constitution',section:'Automation'},audit:{title:'Audit Trail',section:'Automation'},memory:{title:'Agent Memory',section:'Automation'},autonomous:{title:'Autonomy Controls',section:'Automation'},
 anomalies:{title:'Anomaly Center',section:'Intelligence'},evaluation:{title:'Agent Evaluation Lab',section:'AI Workforce'},
 'api-console':{title:'Agent API Console',section:'Developer'},catalog:{title:'AI-Readable Catalog',section:'Developer'},sandbox:{title:'Test & Sandbox Center',section:'Developer'},
 notifications:{title:'Notification Center',section:'System'},settings:{title:'Settings',section:'System'}
};
export const money=n=>new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(n);
export const DATA={
 stats:[['Gross revenue','₹24.8L','+11.2%'],['Revenue at risk','₹62,300','-7.1%'],['Recovered revenue','₹38,500','+15.2%'],['AI actions','127','+33.1%'],['Success rate','91.4%','+4.4%'],['Pending approvals','4','-2'],['Failed payments','247','-5.7%'],['Abandoned carts','1,245','-8.2%']],
 opportunities:[
  {type:'Failed payments',icon:'↻',priority:'High',atRisk:'₹24,300',impact:'₹15,800',confidence:'92%',count:'27 failed',diagnosis:'63% appear retryable; failure concentration is highest in UPI between 7–9 PM.',action:'Retry eligible payments'},
  {type:'Abandoned carts',icon:'🛒',priority:'High',atRisk:'₹18,200',impact:'₹12,400',confidence:'87%',count:'83 carts',diagnosis:'High-intent carts are aging without a discount signal.',action:'Send personalized recovery'},
  {type:'Customer reactivation',icon:'◉',priority:'Medium',atRisk:'₹8,400',impact:'₹6,100',confidence:'81%',count:'146 customers',diagnosis:'Repeat buyers inactive for 30+ days show strong predicted LTV.',action:'Launch no-discount winback'},
  {type:'Upsell opportunity',icon:'↗',priority:'Medium',atRisk:'₹4,500',impact:'₹4,500',confidence:'78%',count:'423 buyers',diagnosis:'Customers buying laptops have a high accessory affinity.',action:'Recommend laptop bundles'},
  {type:'Conversion anomaly',icon:'△',priority:'Low',atRisk:'₹7,200',impact:'₹3,900',confidence:'76%',count:'3 products',diagnosis:'Traffic is stable while product conversion dropped 14%.',action:'Inspect product funnel'}],
 customers:[['Rahul Verma','₹1,45,600','12','VIP','72%','Laptop buyer'],['Anita Singh','₹82,300','8','High-value','64%','Repeat buyer'],['Vikram Rao','₹24,100','4','Returning','41%','UPI user'],['Neha Patel','₹8,450','2','At-risk','22%','Dormant'],['Arjun Mehta','₹62,800','7','VIP','68%','Accessory affinity']],
 products:[['MacBook Air M2','₹94,900','245','₹2.32Cr','3.2%','82','Bundle with bag'],['iPhone 15','₹79,990','189','₹1.51Cr','2.8%','88','Cross-sell case'],['AirPods Pro','₹24,900','312','₹77.6L','4.1%','91','High conversion'],['Laptop Bag','₹4,500','410','₹18.4L','7.8%','95','Top bundle match']],
 payments:[['pay_1001','Rahul Verma','₹4,500','UPI','Paid','10:42'],['pay_1002','Anita Singh','₹2,100','Cards','Pending','10:15'],['pay_1003','Vikram Rao','₹12,000','Net Banking','Failed','09:48'],['pay_1004','Neha Patel','₹8,400','UPI','Paid','09:32'],['pay_1005','Arjun Mehta','₹2,850','Wallet','Refunded','09:10']],
 orders:[['ORD_1001','Rahul Verma','₹4,500','Paid','Shipped','Today'],['ORD_1002','Anita Singh','₹2,100','Pending','Processing','Today'],['ORD_1003','Vikram Rao','₹12,000','Failed','Pending','Today'],['ORD_1004','Neha Patel','₹8,400','Paid','Shipped','Yesterday'],['ORD_1005','Arjun Mehta','₹2,850','Refunded','Cancelled','Yesterday']]
};
