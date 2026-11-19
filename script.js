/* Flowly: vanilla JavaScript, no dependencies.
   Every page is rendered in the browser and routed with the URL hash
   (#/pricing, #/blog/2, #/docs/api ...), so it runs on any static host.
   The billing choice and sign-ups are kept in localStorage. */
(function () {
  'use strict';

  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* ---------- Storage (falls back to memory if blocked) ---------- */
  const mem = {};
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return k in mem ? mem[k] : d; } },
    set(k, v) { mem[k] = v; try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* storage unavailable */ } }
  };

  const ARROW = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>';

  /* ---------- Demo data (replace with your own) ---------- */
  const FEATURES = [
    ['⚙️', 'Workflow Automation', 'Build no-code automations that trigger across every tool your team uses.'],
    ['📈', 'Real-Time Analytics', 'Track progress with live dashboards that update as work happens.'],
    ['🔗', '200+ Integrations', 'Connect Slack, Notion, GitHub, Figma and the rest of your stack in minutes.'],
    ['👥', 'Team Collaboration', 'Comment, assign and review work without leaving your workspace.'],
    ['🔒', 'Enterprise Security', 'SOC 2 Type II compliant with SSO, audit logs and granular permissions.'],
    ['📱', 'Mobile Ready', 'Stay on top of your work from anywhere with native iOS and Android apps.'],
    ['🤖', 'AI Assistant', 'Summarize threads, draft updates and suggest the next best action.'],
    ['🗓️', 'Smart Planning', 'Timelines, sprints and workload views that adjust when plans change.']
  ];
  const INTEGRATIONS = [
    ['💬', 'Slack', 'Communication', 'Send updates and create tasks from any channel.'],
    ['📝', 'Notion', 'Docs', 'Sync pages and databases with your projects.'],
    ['🐙', 'GitHub', 'Developer', 'Link pull requests and close tasks automatically.'],
    ['🎨', 'Figma', 'Design', 'Attach live designs to tasks and reviews.'],
    ['📧', 'Gmail', 'Communication', 'Turn emails into tasks in one click.'],
    ['📅', 'Google Calendar', 'Productivity', 'See deadlines and meetings in one calendar.'],
    ['📂', 'Google Drive', 'Docs', 'Attach files and keep folders in sync.'],
    ['🦊', 'GitLab', 'Developer', 'Track merge requests and pipelines.'],
    ['💳', 'Stripe', 'Finance', 'Trigger workflows from payments and invoices.'],
    ['📊', 'HubSpot', 'Sales', 'Create tasks when deals change stage.'],
    ['🎧', 'Zendesk', 'Support', 'Escalate tickets to the right team fast.'],
    ['🧵', 'Microsoft Teams', 'Communication', 'Get notifications and approvals in Teams.'],
    ['🐞', 'Sentry', 'Developer', 'Open a task when a new error appears.'],
    ['📦', 'Dropbox', 'Docs', 'Link files without leaving Flowly.'],
    ['🧾', 'QuickBooks', 'Finance', 'Sync invoices and project budgets.'],
    ['⚡', 'Zapier', 'Productivity', 'Connect thousands more apps with one key.']
  ];
  const INT_CATS = ['All', 'Communication', 'Developer', 'Docs', 'Productivity', 'Finance', 'Sales', 'Support', 'Design'];
  const PLANS = [
    { id: 'starter', name: 'Starter', desc: 'For individuals and small projects', m: 0, btn: 'Get Started', list: ['Up to 3 projects', 'Basic automations', 'Community support', '1 GB storage'] },
    { id: 'pro', name: 'Pro', desc: 'For growing teams that need more power', m: 29, pop: true, btn: 'Start Free Trial', list: ['Unlimited projects', 'Advanced automations', 'Priority support', '100 GB storage', 'Team analytics'] },
    { id: 'business', name: 'Business', desc: 'For organizations that need control and scale', m: 79, btn: 'Start Free Trial', list: ['Everything in Pro', 'SSO & audit logs', 'Dedicated manager', 'Unlimited storage', 'Custom integrations'] }
  ];
  const COMPARE = [
    ['Projects', 'Up to 3', 'Unlimited', 'Unlimited'], ['Automations', 'Basic', 'Advanced', 'Advanced'], ['Storage', '1 GB', '100 GB', 'Unlimited'],
    ['Team analytics', 0, 1, 1], ['Integrations', '20', '200+', '200+'], ['Priority support', 0, 1, 1], ['SSO & audit logs', 0, 0, 1], ['Dedicated manager', 0, 0, 1], ['Custom integrations', 0, 0, 1]
  ];
  const REVIEWS = [
    ['Priya Shah', 'Head of Product, Vertex', 'Flowly cut our sprint planning time in half. The automations alone paid for the subscription in a week.', 5],
    ['Daniel Osei', 'Engineering Manager, Cascade', 'We replaced four separate tools with Flowly. Onboarding new hires has never been this simple.', 5],
    ['Marie Laurent', 'COO, Nimbus', 'The analytics dashboard gives our leadership real visibility into delivery for the first time.', 4],
    ['Tomás Rivera', 'CTO, Orbital', 'The GitHub and Slack integrations just work. Our engineers stopped context switching.', 5],
    ['Aiko Tanaka', 'Operations Lead, Harbor', 'Setting up approvals took ten minutes. Before Flowly it was a spreadsheet and many reminders.', 5]
  ];
  const CASES = [
    ['Vertex', 'SaaS', 'Cut sprint planning time by 52%', '52%', 262],
    ['Cascade', 'Engineering', 'Onboarded 40 engineers in two weeks', '2 wks', 160],
    ['Nimbus', 'Operations', 'One dashboard for every delivery team', '1', 190],
    ['Orbital', 'Aerospace', 'Saved 300 hours a month on reporting', '300 h', 215],
    ['Harbor', 'Logistics', 'Automated 90% of approval requests', '90%', 30],
    ['Northwind', 'Retail', 'Launched a new store in half the time', '2x', 340]
  ];
  const POSTS = [
    { id: 1, cat: 'Product', icon: '🚀', hue: 250, date: 'Nov 12, 2026', read: 5, title: 'Introducing the Flowly AI Assistant', ex: 'Summaries, drafts and next-step suggestions, built right into your workspace.', body: ['Today we are launching the Flowly AI Assistant, a helper that lives inside every project.', '## What it does', 'It summarizes long threads, drafts status updates and suggests the next best action based on your team history.', '## Privacy first', 'Your data is never used to train models. You can turn the assistant off for any workspace at any time.'] },
    { id: 2, cat: 'Guides', icon: '📘', hue: 170, date: 'Nov 3, 2026', read: 7, title: 'A beginner guide to workflow automation', ex: 'Pick the right first automation and avoid the common traps.', body: ['Automation works best when you start small. Choose one repetitive task that happens every week.', '## Start with a trigger', 'Every automation begins with something that happens: a task moves to Done, a form arrives, a deadline passes.', '## Add one action', 'Send a message, assign a person or create the next task. Test it with a small team before rolling it out.'] },
    { id: 3, cat: 'Company', icon: '🎉', hue: 330, date: 'Oct 21, 2026', read: 4, title: 'Flowly reaches 4,000 teams', ex: 'Thank you. Here is what we learned on the way and what comes next.', body: ['Four thousand teams now plan and ship work with Flowly.', '## What we learned', 'Teams want fewer tools, not more features. Every release this year removed steps instead of adding them.', '## What comes next', 'More integrations, a faster mobile app and better reporting for leaders.'] },
    { id: 4, cat: 'Engineering', icon: '🛠️', hue: 215, date: 'Oct 9, 2026', read: 8, title: 'How we made dashboards load 3x faster', ex: 'A look at caching, pagination and one slow query.', body: ['Dashboards are the first thing many users open, so speed matters.', '## Find the slow part', 'We traced one query that scanned a very large table. An index and a smaller payload fixed most of it.', '## Cache what you can', 'Results that rarely change are now cached for a short time, which removed repeated work.'] },
    { id: 5, cat: 'Guides', icon: '📊', hue: 35, date: 'Sep 28, 2026', read: 6, title: 'Run better sprint reviews with live analytics', ex: 'Use burndown and cycle time to focus the meeting on decisions.', body: ['A sprint review is more useful when everyone sees the same numbers.', '## Pick three metrics', 'We suggest completed work, cycle time and carry-over. Anything more becomes noise.', '## Share before the meeting', 'Send the dashboard link a day early so the meeting can focus on decisions.'] },
    { id: 6, cat: 'Product', icon: '🔒', hue: 280, date: 'Sep 14, 2026', read: 3, title: 'SSO and audit logs for every Business plan', ex: 'Enterprise controls without the enterprise sales call.', body: ['Business customers can now connect their identity provider in a few minutes.', '## Audit logs', 'See who changed what and when, and export the log for your security team.', '## Roles', 'Create custom roles so each person only sees what they need.'] }
  ];
  const DOCS = [
    { id: 'quickstart', g: 'Getting started', t: 'Quickstart', body: ['Create your first project in under five minutes.', '## 1. Create a workspace', 'Sign up, name your workspace and invite your team.', '## 2. Add a project', 'Click **New project**, choose a template and add your first tasks.', '## 3. Connect a tool', 'Open **Integrations**, pick Slack or GitHub and follow the prompts.', '<div class="callout">Tip: start with the free Starter plan. You can upgrade at any time.</div>'] },
    { id: 'projects', g: 'Getting started', t: 'Projects and tasks', body: ['Projects group tasks, files and people.', '## Tasks', 'Each task has an owner, a due date and a status. Use labels to filter views.', '## Views', 'Switch between list, board and timeline. Your filters are saved per view.'] },
    { id: 'automations', g: 'Automation', t: 'Building automations', body: ['An automation is a trigger plus one or more actions.', '## Example', '<pre><code>WHEN task.status = "Done"\nTHEN slack.post("#shipped", task.title)\nAND  task.create("Write release note")</code></pre>', '## Limits', 'Starter plans run basic automations. Pro and Business plans add conditions and delays.'] },
    { id: 'integrations', g: 'Automation', t: 'Connecting integrations', body: ['Flowly connects to more than 200 apps.', '## Connect an app', 'Open **Integrations**, choose an app and sign in. You can limit which projects it can use.', '## Disconnect', 'Remove an integration at any time from settings. Linked items stay in your projects.'] },
    { id: 'api', g: 'Developers', t: 'REST API', body: ['The API lets you read and create tasks from your own code.', '## Authentication', 'Send your key as a bearer token.', '<pre><code>curl https://api.flowly.example/v1/tasks \\\n  -H "Authorization: Bearer YOUR_API_KEY"</code></pre>', '## Rate limits', 'Pro plans allow 600 requests a minute. Business plans can request more.'] },
    { id: 'webhooks', g: 'Developers', t: 'Webhooks', body: ['Webhooks send an HTTP POST to your server when something changes.', '## Events', 'Supported events include <code>task.created</code>, <code>task.updated</code> and <code>project.completed</code>.', '## Security', 'Verify the signature header on every request before trusting the payload.'] }
  ];
  const CHANGELOG = [
    ['v3.4', 'Nov 12, 2026', 'AI Assistant', ['New AI Assistant for summaries and drafts', 'Faster search across all projects', 'Fix: timeline dates in some time zones']],
    ['v3.3', 'Oct 15, 2026', 'Dashboards', ['Dashboards load up to 3x faster', 'New cycle time and carry-over widgets', 'Export dashboards as PDF']],
    ['v3.2', 'Sep 14, 2026', 'Security', ['SSO and audit logs for Business plans', 'Custom roles and permissions', 'Session timeout settings']],
    ['v3.1', 'Aug 20, 2026', 'Integrations', ['12 new integrations including Sentry and QuickBooks', 'Two-way sync for Google Calendar', 'Improved Slack commands']],
    ['v3.0', 'Jul 30, 2026', 'Mobile', ['Redesigned iOS and Android apps', 'Offline mode for tasks', 'Push notifications by project']]
  ];
  const FAQ = [
    ['Billing', 'Is there a free plan?', 'Yes. The Starter plan is free forever for up to 3 projects, no credit card required.'],
    ['Billing', 'Can I change plans later?', 'Absolutely. You can upgrade, downgrade or cancel at any time from your billing settings.'],
    ['Billing', 'Do you offer discounts?', 'Annual billing saves 20%. Nonprofits and students can ask us for a special rate.'],
    ['Product', 'Does Flowly integrate with my existing tools?', 'Flowly connects with 200+ apps including Slack, Notion, GitHub, Figma and Google Workspace.'],
    ['Product', 'Is there a mobile app?', 'Yes. Native iOS and Android apps are included on every plan.'],
    ['Security', 'Is my data secure?', 'We are SOC 2 Type II compliant and offer SSO, audit logs and role-based permissions on Business plans.'],
    ['Security', 'Where is my data stored?', 'Data is encrypted in transit and at rest. Business customers can choose a region.']
  ];
  const TEAM = [['Ana Costa', 'CEO and co-founder', 255], ['Jonas Weber', 'CTO and co-founder', 170], ['Lila Patel', 'Head of Design', 330], ['Omar Haddad', 'Head of Customer Success', 30]];

  /* ---------- Helpers ---------- */
  const shade = (h) => 'linear-gradient(135deg,hsl(' + h + ' 70% 55%),hsl(' + ((h + 40) % 360) + ' 70% 45%))';
  const soft = (h) => 'linear-gradient(135deg,hsl(' + h + ' 80% 94%),hsl(' + ((h + 30) % 360) + ' 80% 88%))';
  const initials = (n) => n.split(' ').map((w) => w[0]).slice(0, 2).join('');
  const stars = (n) => '<span class="stars" aria-hidden="true">' + '★'.repeat(n) + '☆'.repeat(5 - n) + '</span>';
  const price = (p, annual) => p.m === 0 ? 0 : Math.round(annual ? p.m * 0.8 : p.m);
  const store_ = { annual: store.get('flowly-annual', false), cat: 'All', q: '', postCat: 'All' };

  const carBtns = '<div class="car-btns"><button data-action="car" data-d="-1" aria-label="Previous">' + ARROW + '</button><button data-action="car" data-d="1" aria-label="Next">' + ARROW + '</button></div>';
  const head = (title, sub, crumbs) => `<div class="page-head"><div class="container"><nav class="crumbs" aria-label="Breadcrumb"><a href="#/">Home</a>${(crumbs || []).map((c) => ' / ' + c).join('')}</nav><h1>${title}</h1>${sub ? `<p>${sub}</p>` : ''}</div></div>`;
  const quote = (r, i) => `<figure class="quote">${stars(r[3])}<blockquote>“${r[2]}”</blockquote><figcaption class="who"><span class="avatar" style="background:${shade(i * 70 + 250)}">${initials(r[0])}</span><span><b>${r[0]}</b><small>${r[1]}</small></span></figcaption></figure>`;
  const feature = (f) => `<div class="feature"><span class="ico">${f[0]}</span><h3>${f[1]}</h3><p>${f[2]}</p></div>`;
  const cta = (t, p) => `<section class="section tight"><div class="container"><div class="cta"><h2>${t}</h2><p>${p}</p><a class="btn btn-lg" href="#/signup">Start Your Free Trial ${ARROW}</a></div></div></section>`;
  const caseCard = (c, i) => `<a class="case" href="#/customers"><div class="cover" style="background:${shade(c[4])}">${c[0]}</div><div class="body"><span class="tag">${c[1]}</span><p class="big">${c[3]}</p><p class="muted">${c[2]}</p></div></a>`;
  const postCard = (p) => `<a class="post" href="#/blog/${p.id}"><div class="cover" style="background:${soft(p.hue)}">${p.icon}</div><div class="body"><span class="tag">${p.cat}</span><h3>${p.title}</h3><p class="muted">${p.ex}</p><small>${p.date} · ${p.read} min read</small></div></a>`;
  const planCard = (p) => {
    const a = store_.annual, n = price(p, a);
    return `<div class="plan ${p.pop ? 'pop' : ''}">${p.pop ? '<span class="badge">Most Popular</span>' : ''}<h3>${p.name}</h3><p class="muted">${p.desc}</p><div class="amount">$${n}<small>/mo</small></div><small class="muted">${p.m === 0 ? 'Free forever' : a ? 'Billed yearly, 20% off' : 'Billed monthly'}</small><a class="btn ${p.pop ? 'btn-primary' : 'btn-ghost'} btn-block" href="#/signup/${p.id}">${p.btn}</a><ul class="checks">${p.list.map((x) => `<li>${x}</li>`).join('')}</ul></div>`;
  };
  const billingToggle = () => `<div class="toggle" role="group" aria-label="Billing period"><button data-action="billing" data-v="m" class="${store_.annual ? '' : 'on'}">Monthly</button><button data-action="billing" data-v="a" class="${store_.annual ? 'on' : ''}">Annual <span class="tag green">Save 20%</span></button></div>`;
  const faqList = (list) => list.map((f) => `<details class="acc"><summary>${f[1]}</summary><p>${f[2]}</p></details>`).join('');
  const bodyHTML = (arr) => arr.map((l) => l.startsWith('## ') ? `<h2>${l.slice(3)}</h2>` : l.startsWith('<') ? l : `<p>${l.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')}</p>`).join('');

  /* ---------- Pages ---------- */
  const pages = {};

  pages.home = () => `
    <section class="hero"><div class="container">
      <span class="pill">⭐ Trusted by 4,000+ teams worldwide</span>
      <h1>Automate your workflow.<br>Focus on what matters.</h1>
      <p class="hero-sub">Flowly connects your tools, automates repetitive tasks and gives your team one place to plan, track and ship work, without the busywork.</p>
      <div class="hero-cta"><a class="btn btn-primary btn-lg" href="#/signup">Start Free Trial ${ARROW}</a><a class="btn btn-ghost btn-lg" href="#/features">▶ Watch Demo</a></div>
      <p class="hero-note">No credit card required · Free 14-day trial · Cancel anytime</p>
      <div class="mock"><div class="mock-bar"><i></i><i></i><i></i></div><div class="mock-body">
        <div class="mock-card">📊<b>Analytics</b><div class="meter"><i style="width:72%"></i></div></div>
        <div class="mock-card">✅<b>Tasks</b><div class="meter"><i style="width:90%"></i></div></div>
        <div class="mock-card">🔗<b>Integrations</b><div class="meter"><i style="width:60%"></i></div></div>
      </div></div>
      <div class="logos"><small>POWERING TEAMS AT</small><div class="logo-row"><span>Northwind</span><span>Vertex</span><span>Orbital</span><span>Cascade</span><span>Nimbus</span><span>Harbor</span></div></div>
    </div></section>
    <section class="section"><div class="container">
      <div class="section-head"><span class="eyebrow">Features</span><h2>Everything your team needs, in one place</h2><p>Replace five disconnected tools with one workspace built for speed.</p></div>
      <div class="grid">${FEATURES.slice(0, 6).map(feature).join('')}</div>
      <p class="center" style="margin-top:28px"><a class="btn btn-ghost" href="#/features">Explore all features ${ARROW}</a></p>
    </div></section>
    <section class="section alt"><div class="container"><div class="stats" id="statsBar">
      <div><b data-count="4200" data-suffix="+">0</b><span>Active Teams</span></div>
      <div><b data-count="98" data-suffix="%">0</b><span>Customer Satisfaction</span></div>
      <div><b data-count="12" data-suffix="M+">0</b><span>Tasks Automated</span></div>
      <div><b data-count="40" data-suffix="+">0</b><span>Hours Saved / Month</span></div>
    </div></div></section>
    <section class="section"><div class="container split">
      <div><span class="eyebrow">Automation</span><h2>Set it once. Let Flowly do the rest.</h2><p class="lead" style="margin:14px 0">Turn repeated steps into rules that run on their own.</p>
        <ul class="checks"><li>Triggers from any connected app</li><li>Conditions, delays and approvals</li><li>Full run history for every automation</li></ul>
        <p style="margin-top:20px"><a class="btn btn-primary" href="#/features">See how it works</a></p></div>
      <div class="panel"><div class="row"><span>⚡ Task moved to <b>Done</b></span><span class="tag green">Trigger</span></div><div class="row"><span>💬 Post in #shipped</span><span class="tag">Action</span></div><div class="row"><span>📝 Create release note</span><span class="tag">Action</span></div></div>
    </div></section>
    <section class="section alt"><div class="container">
      <div class="section-head row"><div><span class="eyebrow">Integrations</span><h2>Works with the tools you already use</h2></div><a class="btn btn-ghost" href="#/integrations">All integrations</a></div>
      <div class="grid four">${INTEGRATIONS.slice(0, 8).map((i) => `<div class="card integ"><span class="ico">${i[0]}</span><div><h3>${i[1]}</h3><p>${i[2]}</p></div></div>`).join('')}</div>
    </div></section>
    <section class="section" id="pricing"><div class="container">
      <div class="section-head"><span class="eyebrow">Pricing</span><h2>Simple pricing that scales with you</h2><p>Start free. Upgrade when your team grows.</p>${billingToggle()}</div>
      <div class="plans" id="plans">${PLANS.map(planCard).join('')}</div>
      <p class="center muted" style="margin-top:20px"><a href="#/pricing" class="btn btn-ghost">Compare all plans</a></p>
    </div></section>
    <section class="section alt"><div class="container">
      <div class="section-head row"><div><span class="eyebrow">Customers</span><h2>Loved by product-led teams</h2></div>${carBtns}</div>
      <div class="carousel">${REVIEWS.map(quote).join('')}</div>
    </div></section>
    <section class="section"><div class="container">
      <div class="section-head row"><div><span class="eyebrow">Success stories</span><h2>Results our customers see</h2></div>${carBtns}</div>
      <div class="carousel">${CASES.map(caseCard).join('')}</div>
    </div></section>
    <section class="section alt"><div class="container narrow">
      <div class="section-head"><span class="eyebrow">FAQ</span><h2>Frequently asked questions</h2></div>
      ${faqList(FAQ.slice(0, 4))}
      <p class="center" style="margin-top:20px"><a class="btn btn-ghost" href="#/faq">More answers</a></p>
    </div></section>
    ${cta('Ready to automate your workflow?', 'Join thousands of teams already shipping faster with Flowly.')}`;

  pages.features = () => `
    ${head('Features', 'Everything you need to plan, automate and ship work.', ['Features'])}
    <section class="section tight"><div class="container"><div class="grid">${FEATURES.map(feature).join('')}</div></div></section>
    <section class="section"><div class="container split">
      <div class="panel"><div class="row"><span>📈 Sprint velocity</span><b>+18%</b></div><div class="row"><span>⏱️ Cycle time</span><b>3.2 days</b></div><div class="row"><span>✅ Completed this week</span><b>128</b></div></div>
      <div><span class="eyebrow">Analytics</span><h2>See what is really happening</h2><p class="lead" style="margin:14px 0">Live dashboards show progress, risks and workload without manual reports.</p><ul class="checks"><li>Burndown, velocity and cycle time</li><li>Share dashboards with a link</li><li>Export to PDF or CSV</li></ul></div>
    </div></section>
    <section class="section alt"><div class="container split flip">
      <div class="panel"><div class="row"><span>🔒 SSO enabled</span><span class="tag green">On</span></div><div class="row"><span>📜 Audit log</span><span class="tag">Exported</span></div><div class="row"><span>🛡️ Role: Reviewer</span><span class="tag">Custom</span></div></div>
      <div><span class="eyebrow">Security</span><h2>Built for teams that need control</h2><p class="lead" style="margin:14px 0">Meet your security review without slowing anyone down.</p><ul class="checks"><li>SOC 2 Type II compliant</li><li>SSO, SCIM and audit logs</li><li>Encryption in transit and at rest</li></ul></div>
    </div></section>
    ${cta('See Flowly in action', 'Start your free 14-day trial. No credit card needed.')}`;

  pages.pricing = () => `
    ${head('Pricing', 'Simple pricing that scales with you. Start free and upgrade when your team grows.', ['Pricing'])}
    <section class="section tight"><div class="container center">${billingToggle()}<div class="plans" id="plans" style="margin-top:28px;text-align:left">${PLANS.map(planCard).join('')}</div></div></section>
    <section class="section alt"><div class="container"><div class="section-head"><h2>Compare plans</h2></div>
      <div class="table-wrap"><table><thead><tr><th>Feature</th><th>Starter</th><th>Pro</th><th>Business</th></tr></thead><tbody>${COMPARE.map((r) => `<tr><td>${r[0]}</td>${r.slice(1).map((v) => `<td>${v === 1 ? '<span class="yes">✓</span>' : v === 0 ? '<span class="no">–</span>' : v}</td>`).join('')}</tr>`).join('')}</tbody></table></div>
    </div></section>
    <section class="section"><div class="container narrow"><div class="section-head"><h2>Pricing questions</h2></div>${faqList(FAQ.filter((f) => f[0] === 'Billing'))}</div></section>
    ${cta('Not sure which plan fits?', 'Talk to our team and we will help you choose.')}`;

  pages.integrations = () => `
    ${head('Integrations', 'Connect Flowly with 200+ apps your team already uses.', ['Integrations'])}
    <section class="section tight"><div class="container">
      <input class="search" type="search" data-filter="q" placeholder="Search integrations" value="${esc(store_.q)}" aria-label="Search integrations">
      <div class="filters">${INT_CATS.map((c) => `<button class="chip ${store_.cat === c ? 'on' : ''}" data-action="int-cat" data-v="${c}">${c}</button>`).join('')}</div>
      <div id="intList">${intList()}</div>
    </div></section>
    ${cta('Missing an integration?', 'Use our API and webhooks, or connect thousands of apps with Zapier.')}`;
  function intList() {
    const q = store_.q.trim().toLowerCase();
    const l = INTEGRATIONS.filter((i) => (store_.cat === 'All' || i[2] === store_.cat) && (!q || (i[1] + i[3]).toLowerCase().includes(q)));
    return l.length ? `<div class="grid">${l.map((i) => `<div class="card integ"><span class="ico">${i[0]}</span><div><h3>${i[1]}</h3><span class="tag">${i[2]}</span><p>${i[3]}</p></div></div>`).join('')}</div>` : '<div class="empty"><span class="emoji-xl">🔎</span><h3>No integrations found</h3><p>Try a different search.</p></div>';
  }

  pages.customers = () => `
    ${head('Customers', 'See how teams use Flowly to ship faster.', ['Customers'])}
    <section class="section tight"><div class="container"><div class="grid">${CASES.map(caseCard).join('')}</div></div></section>
    <section class="section alt"><div class="container"><div class="section-head row"><div><h2>What teams say</h2></div>${carBtns}</div><div class="carousel">${REVIEWS.map(quote).join('')}</div></div></section>
    ${cta('Join 4,000+ teams', 'Start free and see results in your first sprint.')}`;

  pages.blog = (id) => {
    if (id) return postPage(id);
    const cats = ['All'].concat(Array.from(new Set(POSTS.map((p) => p.cat))));
    return `${head('Blog', 'Product news, guides and stories from the Flowly team.', ['Blog'])}
    <section class="section tight"><div class="container">
      <div class="filters">${cats.map((c) => `<button class="chip ${store_.postCat === c ? 'on' : ''}" data-action="post-cat" data-v="${c}">${c}</button>`).join('')}</div>
      <div class="grid" id="postList">${POSTS.filter((p) => store_.postCat === 'All' || p.cat === store_.postCat).map(postCard).join('')}</div>
      <form class="box center stack" data-form="newsletter" style="margin-top:40px"><h3>Get new posts by email</h3><p class="muted">One short email a month. No spam.</p><div style="display:flex;gap:10px;max-width:440px;margin:0 auto;flex-wrap:wrap"><input type="email" required placeholder="you@example.com" aria-label="Email" style="flex:1;min-width:200px"><button class="btn btn-primary">Subscribe</button></div></form>
    </div></section>`;
  };
  function postPage(id) {
    const p = POSTS.find((x) => x.id === Number(id));
    if (!p) return pages.notfound();
    const more = POSTS.filter((x) => x.id !== p.id).slice(0, 3);
    return `${head(p.title, p.date + ' · ' + p.read + ' min read', ['<a href="#/blog">Blog</a>', p.cat])}
    <section class="section tight"><div class="container narrow article"><div class="cover" style="background:${soft(p.hue)}">${p.icon}</div>${bodyHTML(p.body)}<p style="margin-top:26px"><a class="btn btn-ghost" href="#/blog">← All posts</a></p></div></section>
    <section class="section alt"><div class="container"><div class="section-head"><h2>Keep reading</h2></div><div class="grid">${more.map(postCard).join('')}</div></div></section>`;
  }

  pages.docs = (id) => {
    const d = DOCS.find((x) => x.id === id) || DOCS[0];
    const idx = DOCS.indexOf(d), prev = DOCS[idx - 1], next = DOCS[idx + 1];
    const groups = Array.from(new Set(DOCS.map((x) => x.g)));
    return `${head('Documentation', 'Guides and API references to get the most out of Flowly.', ['Docs'])}
    <section class="section tight"><div class="container docs">
      <nav class="docs-nav" aria-label="Docs">${groups.map((g) => `<h4>${g}</h4>${DOCS.filter((x) => x.g === g).map((x) => `<a href="#/docs/${x.id}" class="${x.id === d.id ? 'on' : ''}">${x.t}</a>`).join('')}`).join('')}</nav>
      <article class="article"><span class="tag">${d.g}</span><h1 style="font-size:36px;margin:10px 0 16px">${d.t}</h1>${bodyHTML(d.body)}
        <div class="pager">${prev ? `<a class="btn btn-ghost" href="#/docs/${prev.id}">← ${prev.t}</a>` : '<span></span>'}${next ? `<a class="btn btn-ghost" href="#/docs/${next.id}">${next.t} →</a>` : ''}</div></article>
    </div></section>`;
  };

  pages.changelog = () => `
    ${head('Changelog', 'New features, improvements and fixes. All systems operational.', ['Changelog'])}
    <section class="section tight"><div class="container narrow"><div class="log">${CHANGELOG.map((c) => `<div class="log-item"><span class="tag">${c[0]}</span> <span class="tag green">${c[2]}</span><h3 style="margin-top:8px">${c[1]}</h3><ul class="checks">${c[3].map((x) => `<li>${x}</li>`).join('')}</ul></div>`).join('')}</div></div></section>`;

  pages.about = () => `
    ${head('About Flowly', 'We build tools that give teams their time back.', ['About'])}
    <section class="section"><div class="container split">
      <div><span class="eyebrow">Our story</span><h2>Less busywork, more real work</h2><p class="lead" style="margin:14px 0">Flowly started in 2021 when two engineers got tired of copying updates between five tools. Today more than 4,000 teams use it to plan, automate and ship.</p><p class="lead">We are a remote team with a simple rule: every feature must remove a step.</p></div>
      <div class="stats" style="grid-template-columns:1fr 1fr"><div><b>2021</b><span>Founded</span></div><div><b>60+</b><span>Teammates</span></div><div><b>30</b><span>Countries</span></div><div><b>4,200+</b><span>Teams</span></div></div>
    </div></section>
    <section class="section alt"><div class="container"><div class="section-head"><h2>Meet the team</h2></div><div class="grid four">${TEAM.map((t) => `<div class="card team"><div class="avatar" style="background:${shade(t[2])}">${initials(t[0])}</div><h3>${t[0]}</h3><p>${t[1]}</p></div>`).join('')}</div></div></section>
    <section class="section"><div class="container"><div class="section-head"><h2>What we believe</h2></div><div class="grid"><div class="feature"><span class="ico">🎯</span><h3>Focus</h3><p>Fewer features that work well beat many that do not.</p></div><div class="feature"><span class="ico">🤝</span><h3>Trust</h3><p>Clear pricing and honest communication.</p></div><div class="feature"><span class="ico">🚀</span><h3>Speed</h3><p>Fast software respects your time.</p></div></div></div></section>
    ${cta('Want to work with us?', 'We are always looking for curious people who care about craft.')}`;

  pages.contact = () => `
    ${head('Contact us', 'Questions about plans, security or a custom setup? We reply within one business day.', ['Contact'])}
    <section class="section tight"><div class="container two-col">
      <form class="box stack" data-form="contact"><h3>Send us a message</h3>
        <div class="form-grid"><div class="field"><label>Name</label><input required placeholder="Jane Doe"></div><div class="field"><label>Work email</label><input type="email" required placeholder="you@company.com"></div></div>
        <div class="field"><label>Topic</label><select><option>Sales</option><option>Support</option><option>Security</option><option>Partnership</option></select></div>
        <div class="field"><label>Message</label><textarea rows="5" required placeholder="How can we help?"></textarea></div>
        <button class="btn btn-primary btn-lg">Send message</button></form>
      <aside class="box"><h3>Other ways to reach us</h3>
        <div class="contact-row"><span>📧</span><div><b>Email</b><small>hello@flowly.example</small></div></div>
        <div class="contact-row"><span>💬</span><div><b>Live chat</b><small>Weekdays 9am to 6pm</small></div></div>
        <div class="contact-row"><span>📍</span><div><b>Office</b><small>Remote first, with a hub in Lisbon</small></div></div>
        <p class="muted" style="margin-top:12px">Sample details. Replace them with your own.</p></aside>
    </div></section>`;

  pages.login = () => `<section class="section"><div class="container"><form class="box auth stack" data-form="login"><h1 style="font-size:30px" class="center">Welcome back</h1><p class="muted center">Log in to your Flowly workspace.</p>
    <div class="field"><label>Email</label><input type="email" required placeholder="you@company.com"></div>
    <div class="field"><label>Password</label><input type="password" required minlength="6" placeholder="••••••••"></div>
    <button class="btn btn-primary btn-lg btn-block">Log In</button><p class="divider">Demo only. Nothing is sent anywhere.</p>
    <p class="center muted">New to Flowly? <a href="#/signup" style="color:var(--primary);font-weight:700">Start free trial</a></p></form></div></section>`;

  pages.signup = (plan) => {
    const sel = PLANS.some((p) => p.id === plan) ? plan : 'pro';
    return `<section class="section"><div class="container"><form class="box auth stack" data-form="signup"><h1 style="font-size:30px" class="center">Start your free trial</h1><p class="muted center">14 days free. No credit card required.</p>
    <div class="field"><label>Full name</label><input name="name" required placeholder="Jane Doe"></div>
    <div class="field"><label>Work email</label><input name="email" type="email" required placeholder="you@company.com"></div>
    <div class="field"><label>Password</label><input type="password" required minlength="6" placeholder="At least 6 characters"></div>
    <div class="field"><label>Plan</label><select name="plan">${PLANS.map((p) => `<option value="${p.id}" ${p.id === sel ? 'selected' : ''}>${p.name}${p.m ? ' ($' + p.m + '/mo)' : ' (Free)'}</option>`).join('')}</select></div>
    <button class="btn btn-primary btn-lg btn-block">Create account</button>
    <p class="center muted">Already have an account? <a href="#/login" style="color:var(--primary);font-weight:700">Log in</a></p></form></div></section>`;
  };
  pages['signup-done'] = () => {
    const s = store.get('flowly-signup', null);
    if (!s) return pages.notfound();
    return `<section class="section"><div class="container narrow center"><div class="success-ico">✓</div><h1 style="font-size:38px">You are in, ${esc(s.name.split(' ')[0])}!</h1><p class="lead" style="margin:12px 0 24px">Your ${esc(s.plan)} trial is ready. We sent a confirmation to ${esc(s.email)}. This is a demo, so no email was sent.</p><a class="btn btn-primary btn-lg" href="#/docs/quickstart">Open the quickstart</a></div></section>`;
  };

  pages.faq = () => {
    const groups = Array.from(new Set(FAQ.map((f) => f[0])));
    return `${head('Help Center', 'Quick answers about billing, the product and security.', ['FAQ'])}<section class="section tight"><div class="container narrow">${groups.map((g) => `<h3 class="faq-group">${g}</h3>${faqList(FAQ.filter((f) => f[0] === g))}`).join('')}<div class="box center" style="margin-top:32px"><h3>Still have questions?</h3><p class="muted" style="margin:6px 0 14px">Our team is happy to help.</p><a class="btn btn-primary" href="#/contact">Contact us</a></div></div></section>`;
  };
  const legal = (t, b) => `${head(t, 'Sample text. Replace it with your own policy before going live.', [t])}<section class="section tight"><div class="container narrow box article">${b}</div></section>`;
  pages.privacy = () => legal('Privacy policy', '<h2>What we collect</h2><p>This demo stores your billing choice and sign-up details only in your own browser. Nothing is sent to a server.</p><h2>Your choices</h2><p>Clear your browser storage at any time to remove this data.</p>');
  pages.terms = () => legal('Terms of service', '<h2>Using this site</h2><p>This is a free template. Plans, prices, customers and quotes are fictional examples.</p><h2>No warranty</h2><p>Replace this text with your own terms before going live.</p>');
  pages.notfound = () => '<section class="section"><div class="container narrow center"><div class="empty"><span class="emoji-xl">🧭</span><h1>Page not found</h1><p class="lead" style="margin:10px 0 20px">The page you are looking for does not exist.</p><a class="btn btn-primary btn-lg" href="#/">Back to home</a></div></div></section>';

  /* ---------- Router ---------- */
  const TITLES = { features: 'Features', pricing: 'Pricing', integrations: 'Integrations', customers: 'Customers', blog: 'Blog', docs: 'Docs', changelog: 'Changelog', about: 'About', contact: 'Contact', login: 'Log in', signup: 'Start free trial', 'signup-done': 'Welcome', faq: 'Help Center', privacy: 'Privacy', terms: 'Terms' };
  const ROUTE_GROUP = { 'signup-done': 'signup' };
  function render(keepScroll) {
    const y = window.scrollY;
    const parts = (location.hash.replace(/^#\/?/, '') || '').split('/');
    let key = parts[0] || 'home';
    if (!pages[key]) key = 'notfound';
    $('#view').innerHTML = pages[key](parts[1]);
    document.title = (TITLES[key] ? TITLES[key] + ' | ' : '') + 'Flowly';
    const group = ROUTE_GROUP[key] || key;
    $$('[data-route]').forEach((a) => a.classList.toggle('active', a.dataset.route === group));
    document.body.classList.remove('nav-open');
    window.scrollTo(0, keepScroll ? y : 0);
    if (key === 'home') startCounters();
  }

  function startCounters() {
    const bar = $('#statsBar');
    if (!bar) return;
    const run = () => $$('[data-count]').forEach((el) => {
      const target = Number(el.dataset.count), suffix = el.dataset.suffix || '', t0 = performance.now();
      const step = (now) => {
        const k = Math.min(1, (now - t0) / 1400);
        el.textContent = Math.round(target * (1 - Math.pow(1 - k, 3))).toLocaleString('en-US') + (k === 1 ? suffix : '');
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
    if (!('IntersectionObserver' in window)) { run(); return; }
    const io = new IntersectionObserver((en) => { if (en[0].isIntersecting) { run(); io.disconnect(); } }, { threshold: 0.4 });
    io.observe(bar);
  }

  function toast(msg) {
    const t = document.createElement('div');
    t.className = 'toast';
    t.textContent = msg;
    $('#toasts').appendChild(t);
    setTimeout(() => t.remove(), 2600);
  }

  /* ---------- Events ---------- */
  const actions = {
    'nav-toggle': () => document.body.classList.toggle('nav-open'),
    'ui-close': () => document.body.classList.remove('nav-open'),
    car: (el) => { const c = el.closest('.section').querySelector('.carousel'); c.scrollBy({ left: Number(el.dataset.d) * (c.firstElementChild.offsetWidth + 22) * 2, behavior: 'smooth' }); },
    billing: (el) => { store_.annual = el.dataset.v === 'a'; store.set('flowly-annual', store_.annual); render(true); },
    'int-cat': (el) => { store_.cat = el.dataset.v; $$('[data-action="int-cat"]').forEach((b) => b.classList.toggle('on', b === el)); $('#intList').innerHTML = intList(); },
    'post-cat': (el) => { store_.postCat = el.dataset.v; render(true); }
  };
  document.addEventListener('click', (e) => {
    const el = e.target.closest('[data-action]');
    if (el && actions[el.dataset.action]) { e.preventDefault(); actions[el.dataset.action](el, e); return; }
    if (e.target.closest('.nav a')) document.body.classList.remove('nav-open');
  });
  document.addEventListener('input', (e) => {
    if (e.target.dataset && e.target.dataset.filter === 'q') { store_.q = e.target.value; $('#intList').innerHTML = intList(); }
  });
  document.addEventListener('submit', (e) => {
    const form = e.target.closest('[data-form]');
    if (!form) return;
    e.preventDefault();
    const kind = form.dataset.form, d = new FormData(form);
    if (kind === 'signup') {
      store.set('flowly-signup', { name: String(d.get('name')), email: String(d.get('email')), plan: PLANS.find((p) => p.id === d.get('plan')).name });
      location.hash = '#/signup-done';
    } else if (kind === 'login') { toast('Demo login only. No account is created.'); form.reset(); }
    else if (kind === 'newsletter') { toast('Subscribed. Thanks!'); form.reset(); }
    else { toast('Message sent. We will reply soon.'); form.reset(); }
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') document.body.classList.remove('nav-open'); });

  window.addEventListener('hashchange', () => render());
  render();
})();
