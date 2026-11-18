// ---- Mock hero cards ----
const mockCards = [
  { icon: "📊", title: "Analytics", fill: "72%" },
  { icon: "✅", title: "Tasks", fill: "88%" },
  { icon: "🔗", title: "Integrations", fill: "60%" }
];
const mockBody = document.getElementById("mockBody");
mockCards.forEach(function (c) {
  const card = document.createElement("div");
  card.className = "mock-card";
  card.innerHTML =
    '<div class="mc-icon">' + c.icon + '</div>' +
    '<div class="mc-title">' + c.title + '</div>' +
    '<div class="mc-bar"><div class="mc-bar-fill" style="width:' + c.fill + '"></div></div>';
  mockBody.appendChild(card);
});

// ---- Logos ----
const logos = ["Northwind", "Vertex", "Orbital", "Cascade", "Nimbus", "Harbor"];
const logosRow = document.getElementById("logosRow");
logos.forEach(function (name) {
  const span = document.createElement("span");
  span.textContent = name;
  logosRow.appendChild(span);
});

// ---- Features ----
const features = [
  { icon: "⚙️", title: "Workflow Automation", desc: "Build no-code automations that trigger across every tool your team uses." },
  { icon: "📈", title: "Real-Time Analytics", desc: "Track progress with live dashboards that update as work happens." },
  { icon: "🔗", title: "200+ Integrations", desc: "Connect Slack, Notion, GitHub, Figma and the rest of your stack in minutes." },
  { icon: "👥", title: "Team Collaboration", desc: "Comment, assign and review work without leaving your workspace." },
  { icon: "🔒", title: "Enterprise Security", desc: "SOC 2 Type II compliant with SSO, audit logs and granular permissions." },
  { icon: "📱", title: "Mobile Ready", desc: "Stay on top of your work from anywhere with native iOS and Android apps." }
];
const featuresGrid = document.getElementById("featuresGrid");
features.forEach(function (f) {
  const card = document.createElement("div");
  card.className = "feature-card";
  card.innerHTML =
    '<div class="feature-icon">' + f.icon + '</div>' +
    '<h3>' + f.title + '</h3>' +
    '<p>' + f.desc + '</p>';
  featuresGrid.appendChild(card);
});

// ---- Stats strip ----
const stats = [
  { value: "4,200+", label: "Active Teams" },
  { value: "98%", label: "Customer Satisfaction" },
  { value: "12M+", label: "Tasks Automated" },
  { value: "40+", label: "Hours Saved / Month" }
];
const statsStrip = document.getElementById("statsStrip");
stats.forEach(function (s) {
  const div = document.createElement("div");
  div.className = "stat-item";
  div.innerHTML = '<div class="stat-num">' + s.value + '</div><div class="stat-label">' + s.label + '</div>';
  statsStrip.appendChild(div);
});

// ---- Pricing ----
const plans = [
  {
    name: "Starter",
    desc: "For individuals and small projects",
    monthly: 0,
    annual: 0,
    featured: false,
    features: ["Up to 3 projects", "Basic automations", "Community support", "1 GB storage"]
  },
  {
    name: "Pro",
    desc: "For growing teams that need more power",
    monthly: 29,
    annual: 23,
    featured: true,
    features: ["Unlimited projects", "Advanced automations", "Priority support", "100 GB storage", "Team analytics"]
  },
  {
    name: "Business",
    desc: "For organizations that need control and scale",
    monthly: 79,
    annual: 63,
    featured: false,
    features: ["Everything in Pro", "SSO & audit logs", "Dedicated manager", "Unlimited storage", "Custom integrations"]
  }
];

const pricingGrid = document.getElementById("pricingGrid");
let billingAnnual = false;

function renderPricing() {
  pricingGrid.innerHTML = "";
  plans.forEach(function (p) {
    const price = billingAnnual ? p.annual : p.monthly;
    const card = document.createElement("div");
    card.className = "price-card" + (p.featured ? " featured" : "");
    let featuresHtml = "";
    p.features.forEach(function (feat) {
      featuresHtml += "<li>" + feat + "</li>";
    });
    card.innerHTML =
      (p.featured ? '<span class="price-badge">Most Popular</span>' : "") +
      '<h3>' + p.name + '</h3>' +
      '<p class="plan-desc">' + p.desc + '</p>' +
      '<div class="price-amount">$' + price + '<span>/mo</span></div>' +
      '<a href="#" class="btn ' + (p.featured ? "btn-primary" : "btn-ghost") + '">Get Started</a>' +
      '<ul class="price-features">' + featuresHtml + '</ul>';
    pricingGrid.appendChild(card);
  });
}
renderPricing();

const billingSwitch = document.getElementById("billingSwitch");
const monthlyLabel = document.getElementById("monthlyLabel");
const annualLabel = document.getElementById("annualLabel");
billingSwitch.addEventListener("click", function () {
  billingAnnual = !billingAnnual;
  billingSwitch.classList.toggle("on", billingAnnual);
  monthlyLabel.classList.toggle("active", !billingAnnual);
  annualLabel.classList.toggle("active", billingAnnual);
  renderPricing();
});

// ---- Testimonials ----
const testimonials = [
  { quote: "Flowly cut our sprint planning time in half. The automations alone paid for the subscription in a week.", name: "Priya Shah", role: "Head of Product, Vertex", stars: 5 },
  { quote: "We replaced four separate tools with Flowly. Onboarding new hires has never been this simple.", name: "Daniel Osei", role: "Engineering Manager, Cascade", stars: 5 },
  { quote: "The analytics dashboard gives our leadership real visibility into delivery for the first time.", name: "Marie Laurent", role: "COO, Nimbus", stars: 4 }
];
const testimonialsGrid = document.getElementById("testimonialsGrid");
testimonials.forEach(function (t) {
  const card = document.createElement("div");
  card.className = "testimonial-card";
  const initials = t.name.split(" ").map(function (n) { return n[0]; }).join("");
  card.innerHTML =
    '<div class="testimonial-stars">' + "★".repeat(t.stars) + "☆".repeat(5 - t.stars) + '</div>' +
    '<p class="quote">“' + t.quote + '”</p>' +
    '<div class="testimonial-person">' +
      '<div class="t-avatar">' + initials + '</div>' +
      '<div><div class="t-name">' + t.name + '</div><div class="t-role">' + t.role + '</div></div>' +
    '</div>';
  testimonialsGrid.appendChild(card);
});

// ---- FAQ ----
const faqs = [
  { q: "Is there a free plan?", a: "Yes. The Starter plan is free forever for up to 3 projects, no credit card required." },
  { q: "Can I change plans later?", a: "Absolutely. You can upgrade, downgrade or cancel at any time from your billing settings." },
  { q: "Does Flowly integrate with my existing tools?", a: "Flowly connects with 200+ apps including Slack, Notion, GitHub, Figma and Google Workspace." },
  { q: "Is my data secure?", a: "We are SOC 2 Type II compliant and offer SSO, audit logs and role-based permissions on Business plans." }
];
const faqList = document.getElementById("faqList");
faqs.forEach(function (item, i) {
  const el = document.createElement("div");
  el.className = "faq-item";
  el.innerHTML =
    '<button class="faq-question">' + item.q + '<span class="faq-icon">+</span></button>' +
    '<div class="faq-answer"><p>' + item.a + '</p></div>';
  el.querySelector(".faq-question").addEventListener("click", function () {
    el.classList.toggle("open");
  });
  faqList.appendChild(el);
});

// ---- Mobile nav ----
const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");
const overlay = document.getElementById("overlay");
function closeNav() {
  mainNav.classList.remove("open");
  overlay.classList.remove("open");
}
menuToggle.addEventListener("click", function () {
  mainNav.classList.toggle("open");
  overlay.classList.toggle("open");
});
overlay.addEventListener("click", closeNav);
document.querySelectorAll(".nav a").forEach(function (a) {
  a.addEventListener("click", closeNav);
});

// ---- Sticky header shadow on scroll ----
const header = document.getElementById("header");
window.addEventListener("scroll", function () {
  header.style.boxShadow = window.scrollY > 10 ? "0 2px 16px rgba(15,18,34,0.08)" : "none";
});
