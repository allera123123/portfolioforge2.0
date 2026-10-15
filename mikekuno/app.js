import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// These are public browser credentials. Never use a Supabase service-role key here.
const SUPABASE_URL = "https://tlcuzznfmbltpoqkmvle.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsY3V6em5mbWJsdHBvcWttdmxlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIwMzk3OTYsImV4cCI6MjEwNzYxNTc5Nn0.odmNcMnzMCI_dj8OO3xzJs9L8LSR4_WnCmi_cVCXMXo";
const supabaseReady = !SUPABASE_URL.includes("YOUR_PROJECT") && !SUPABASE_ANON_KEY.includes("YOUR_");
const supabase = supabaseReady ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

const app = document.querySelector("#app");
const toast = document.querySelector("#toast");
let editingId = null;
let selectedTemplate = "simple";
let portfolios = [];

const escapeHtml = (value = "") => String(value).replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[char]));
const lines = value => String(value || "").split("\n").map(item => item.trim()).filter(Boolean);
const formatDate = value => value ? new Date(value).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }) : "";
const showToast = message => {
  toast.textContent = message;
  toast.classList.add("visible");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("visible"), 3200);
};
const dbNotice = () => supabaseReady ? "" : `<div class="notice">Supabase is not connected yet. Add the public Project URL and anon key at the top of <strong>app.js</strong>, then run the SQL in <strong>supabase-schema.sql</strong>.</div>`;

function homePage() {
  return `<section class="container hero">
    <div class="hero-copy">
      <div class="eyebrow">Your story, beautifully presented</div>
      <h1>Create a portfolio that opens doors.</h1>
      <p>PortfolioForge helps you turn your experience, skills, and projects into a polished online portfolio in minutes.</p>
      <div class="hero-actions"><a class="button" href="#create">Create my portfolio <span>→</span></a><a class="button ghost" href="#manage">Manage portfolios</a></div>
    </div>
    <div class="hero-card"><div class="mock-top"><span>PORTFOLIO</span><span>2025</span></div><div class="mock-avatar"></div><h2>Your name here.</h2><div class="muted">Designer · Developer · Dreamer</div><div class="mock-lines"><span></span><span></span><span></span></div></div>
  </section>
  <section class="container feature-strip">
    <article class="feature"><strong>01 · Add your details</strong><p>Share your story, education, skills, projects, and experience in one organized form.</p></article>
    <article class="feature"><strong>02 · Pick your style</strong><p>Choose from exactly three designs: Simple, Modern, or Creative.</p></article>
    <article class="feature"><strong>03 · Share your work</strong><p>Preview your finished portfolio and keep it safely stored online.</p></article>
  </section>`;
}

function formPage() {
  const p = editingId ? portfolios.find(item => item.id === editingId) : {};
  const value = key => escapeHtml(p[key] || "");
  return `<section class="container"><div class="page-heading"><div class="eyebrow">${editingId ? "Edit portfolio" : "New portfolio"}</div><h2>${editingId ? "Keep your story up to date." : "Tell us about yourself."}</h2><p>Complete the sections below. You can edit or delete this portfolio at any time.</p></div>${dbNotice()}
    <form id="portfolio-form" class="form-layout">
      <div><div class="form-card"><h3>Personal information</h3><div class="fields">
        <div class="field"><label for="full_name">Full name *</label><input id="full_name" name="full_name" required value="${value("full_name")}" placeholder="e.g. Alex Santos" /></div>
        <div class="field"><label for="email">Email *</label><input id="email" type="email" name="email" required value="${value("email")}" placeholder="alex@email.com" /></div>
        <div class="field"><label for="contact_number">Contact number</label><input id="contact_number" name="contact_number" value="${value("contact_number")}" placeholder="+63 912 345 6789" /></div>
        <div class="field"><label for="address">Address</label><input id="address" name="address" value="${value("address")}" placeholder="City, Country" /></div>
        <div class="field full"><label for="profile_picture">Profile picture URL</label><input id="profile_picture" type="url" name="profile_picture" value="${value("profile_picture")}" placeholder="https://..." /><p class="hint">Use a public image URL. A placeholder is shown if this is blank.</p></div>
        <div class="field full"><label for="about_me">About me *</label><textarea id="about_me" name="about_me" required placeholder="Write a short introduction...">${value("about_me")}</textarea></div>
      </div></div>
      <div class="form-card"><h3>Education and skills</h3><div class="fields">
        <div class="field full"><label for="education">Educational background *</label><textarea id="education" name="education" required placeholder="One entry per line, e.g.&#10;BS Information Technology — University of Example, 2024">${value("education")}</textarea></div>
        <div class="field full"><label for="skills">Skills *</label><textarea id="skills" name="skills" required placeholder="One skill per line, e.g.&#10;JavaScript&#10;UI Design&#10;Project Management">${value("skills")}</textarea></div>
      </div></div>
      <div class="form-card"><h3>Projects and experience</h3><div class="fields">
        <div class="field full"><label for="projects">Projects *</label><textarea id="projects" name="projects" required placeholder="One project per line, e.g.&#10;PortfolioForge — Online portfolio generator">${value("projects")}</textarea></div>
        <div class="field full"><label for="work_experience">Work experience</label><textarea id="work_experience" name="work_experience" placeholder="One role per line, e.g.&#10;Frontend Intern — Bright Studio, 2023">${value("work_experience")}</textarea></div>
        <div class="field full"><label for="social_links">Social media / website links</label><textarea id="social_links" name="social_links" placeholder="One URL per line, e.g.&#10;https://github.com/yourname&#10;https://linkedin.com/in/yourname">${value("social_links")}</textarea></div>
      </div></div><div class="form-actions"><a class="button ghost" href="${editingId ? "#manage" : "#home"}">Cancel</a><button class="button" type="submit">${editingId ? "Save changes" : "Save portfolio"} →</button></div></div>
      <aside class="side-card"><h3>Good to know</h3><p>Your information is stored in your connected Supabase online database and can be retrieved after a refresh.</p><ul class="check-list"><li>Required fields are marked *</li><li>Each line becomes a portfolio item</li><li>You can change the template later</li><li>Delete is permanent</li></ul></aside>
    </form></section>`;
}

function templatesPage() {
  const p = portfolios.find(item => item.id === editingId) || portfolios[0];
  if (!p) return `<section class="container page-heading"><h2>No portfolio selected</h2><p>Create a portfolio before selecting a template.</p><a class="button" href="#create">Create portfolio</a></section>`;
  return `<section class="container"><div class="page-heading"><div class="eyebrow">Choose a template</div><h2>Which style feels like you?</h2><p>Pick one of exactly three layouts. You can change this choice whenever you like.</p></div>
    <div class="template-grid">${templateOption("simple", "Simple", "Clean and professional.", "simple")}${templateOption("modern", "Modern", "Cards, sections, and visual elements.", "modern")}${templateOption("creative", "Creative", "A bold and expressive arrangement.", "creative")}</div>
    <div class="form-actions"><a class="button ghost" href="#manage">Back to manage</a><button class="button" id="generate-button">Generate portfolio →</button></div></section>`;
}
function templateOption(id, name, description, style) {
  return `<button class="template-option ${selectedTemplate === id ? "selected" : ""}" data-template="${id}"><div class="template-swatch ${style}">${style === "creative" ? '<div class="creative-shape"></div>' : ""}<div class="swatch-avatar"></div><div class="swatch-lines"><i></i><i></i><i></i></div></div><div class="template-copy"><strong>${name}</strong><span>${description}</span></div></button>`;
}

function portfolioContent(p, template) {
  const image = p.profile_picture || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&q=80";
  const skills = lines(p.skills).map(item => `<span class="link-pill">${escapeHtml(item)}</span>`).join("");
  const projects = lines(p.projects).map(item => `<div class="modern-project"><strong>${escapeHtml(item)}</strong><p class="muted">Project highlight</p></div>`).join("");
  const common = `<img class="portfolio-avatar" src="${escapeHtml(image)}" alt="${escapeHtml(p.full_name)} profile" onerror="this.src='https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&q=80'" />`;
  if (template === "modern") return `<article class="portfolio modern"><div class="modern-hero">${common}<div><div class="eyebrow">Portfolio</div><h1>${escapeHtml(p.full_name)}</h1><div>${escapeHtml(p.email)} · ${escapeHtml(p.contact_number)}</div></div></div><div class="modern-section"><h2>About me</h2><p>${escapeHtml(p.about_me)}</p></div><div class="portfolio-grid"><div class="modern-section"><h2>Skills</h2><div class="skill-cloud">${skills}</div></div><div class="modern-section"><h2>Education</h2><p>${escapeHtml(p.education)}</p></div></div><div class="modern-section"><h2>Selected projects</h2><div class="modern-projects">${projects}</div></div><div class="portfolio-grid"><div class="modern-section"><h2>Experience</h2><p>${escapeHtml(p.work_experience || "Open to new opportunities.")}</p></div><div class="modern-section"><h2>Connect</h2>${linkList(p.social_links, true)}</div></div></article>`;
  if (template === "creative") return `<article class="portfolio creative"><div class="creative-top"><div><div class="eyebrow">Hello, I am</div><h1>${escapeHtml(p.full_name)}</h1><div class="creative-line"></div><p>${escapeHtml(p.email)}<br />${escapeHtml(p.address)}</p></div>${common}</div><div class="creative-content"><div><h2>My story</h2><p>${escapeHtml(p.about_me)}</p><h2>What I do</h2><div class="skill-cloud">${skills}</div></div><div><h2>Things I've made</h2><p>${escapeHtml(p.projects)}</p><h2>Experience</h2><p>${escapeHtml(p.work_experience || "Building my next chapter.")}</p><h2>Find me</h2>${linkList(p.social_links, false)}</div></div></article>`;
  return `<article class="portfolio simple"><div class="simple-header">${common}<div><div class="eyebrow">Portfolio</div><h1>${escapeHtml(p.full_name)}</h1><div class="tagline">${escapeHtml(p.email)} · ${escapeHtml(p.contact_number)}</div></div></div><div class="portfolio-section"><h2>About me</h2><p>${escapeHtml(p.about_me)}</p></div><div class="portfolio-grid"><div class="portfolio-section"><h2>Education</h2><p>${escapeHtml(p.education)}</p></div><div class="portfolio-section"><h2>Skills</h2><div class="skill-cloud">${skills}</div></div></div><div class="portfolio-grid"><div class="portfolio-section"><h2>Projects</h2><p>${escapeHtml(p.projects)}</p></div><div class="portfolio-section"><h2>Experience</h2><p>${escapeHtml(p.work_experience || "Open to new opportunities.")}</p></div></div><div class="portfolio-section"><h2>Connect</h2>${linkList(p.social_links, false)}</div></article>`;
}
function linkList(value, modern) {
  const links = lines(value);
  return links.length ? `<ul class="link-list">${links.map(link => `<li><a href="${escapeHtml(link)}" target="_blank" rel="noreferrer">${escapeHtml(link.replace(/^https?:\/\//, "").replace(/\/$/, ""))}</a></li>`).join("")}</ul>` : `<p class="muted">Add your links to connect with visitors.</p>`;
}
function previewPage() {
  const p = portfolios.find(item => item.id === editingId) || portfolios[0];
  if (!p) return `<section class="container page-heading"><h2>No portfolio selected</h2><a class="button" href="#create">Create portfolio</a></section>`;
  return `<section class="container preview-shell"><div class="preview-toolbar"><div><div class="eyebrow">${p.template || selectedTemplate} template</div><h2>Preview your portfolio</h2></div><div class="actions"><a class="button ghost small" href="#templates/${p.id}">Change template</a><a class="button small" href="#edit/${p.id}">Edit portfolio</a></div></div>${portfolioContent(p, p.template || selectedTemplate)}</section>`;
}

async function loadPortfolios() {
  if (!supabase) { portfolios = JSON.parse(localStorage.getItem("portfolioforge-demo") || "[]"); return; }
  const { data, error } = await supabase.from("portfolios").select("*").order("updated_at", { ascending: false });
  if (error) throw error;
  portfolios = data || [];
}
function managePage() {
  return `<section class="container"><div class="page-heading"><div class="eyebrow">Your workspace</div><h2>Manage portfolios</h2><p>View, edit, choose a template, or remove your saved portfolio.</p></div>${dbNotice()}<div class="manage-list">${portfolios.length ? portfolios.map(p => `<article class="manage-card"><div><h3>${escapeHtml(p.full_name)}</h3><small>${escapeHtml(p.email)} · Updated ${formatDate(p.updated_at)}</small></div><div class="manage-actions"><a class="button ghost small" href="#preview/${p.id}">View</a><a class="button secondary small" href="#templates/${p.id}">Template</a><a class="button ghost small" href="#edit/${p.id}">Edit</a><button class="button danger small" data-delete="${p.id}">Delete</button></div></article>`).join("") : `<div class="empty-state"><h3>Your portfolio library is empty.</h3><p>Create your first portfolio to get started.</p><a class="button" href="#create">Create portfolio</a></div>`}</div></section>`;
}

async function savePortfolio(form) {
  const data = Object.fromEntries(new FormData(form));
  data.template = selectedTemplate;
  if (!supabase) {
    const local = editingId ? portfolios.map(p => p.id === editingId ? { ...p, ...data, updated_at: new Date().toISOString() } : p) : [{ ...data, id: crypto.randomUUID(), updated_at: new Date().toISOString() }, ...portfolios];
    portfolios = local; localStorage.setItem("portfolioforge-demo", JSON.stringify(local)); return editingId || local[0].id;
  }
  const result = editingId ? await supabase.from("portfolios").update(data).eq("id", editingId).select().single() : await supabase.from("portfolios").insert(data).select().single();
  if (result.error) throw result.error;
  portfolios = editingId ? portfolios.map(p => p.id === editingId ? result.data : p) : [result.data, ...portfolios];
  return result.data.id;
}
async function deletePortfolio(id) {
  if (supabase) { const { error } = await supabase.from("portfolios").delete().eq("id", id); if (error) throw error; }
  portfolios = portfolios.filter(p => p.id !== id);
  if (!supabase) localStorage.setItem("portfolioforge-demo", JSON.stringify(portfolios));
}

async function render() {
  const hash = location.hash.slice(1) || "home";
  const [route, id] = hash.split("/");
  if (route === "edit") { editingId = id; selectedTemplate = portfolios.find(p => p.id === id)?.template || "simple"; app.innerHTML = formPage(); }
  else if (route === "templates") { if (id) editingId = id; app.innerHTML = templatesPage(); }
  else if (route === "preview") { editingId = id; app.innerHTML = previewPage(); }
  else if (route === "create") { editingId = null; selectedTemplate = "simple"; app.innerHTML = formPage(); }
  else if (route === "manage") { editingId = null; app.innerHTML = managePage(); }
  else { editingId = null; app.innerHTML = homePage(); }
  document.querySelectorAll(".main-nav a").forEach(link => link.classList.toggle("active", link.getAttribute("href") === `#${route}`));
}

document.addEventListener("click", async event => {
  const templateButton = event.target.closest("[data-template]");
  if (templateButton) { selectedTemplate = templateButton.dataset.template; document.querySelectorAll(".template-option").forEach(item => item.classList.toggle("selected", item === templateButton)); return; }
  const deleteButton = event.target.closest("[data-delete]");
  if (deleteButton && window.confirm("Delete this portfolio permanently?")) {
    try { await deletePortfolio(deleteButton.dataset.delete); showToast("Portfolio deleted."); await render(); } catch (error) { showToast(`Delete failed: ${error.message}`); }
  }
  if (event.target.closest("#generate-button")) {
    const p = portfolios.find(item => item.id === editingId);
    if (p && supabase) { const { data, error } = await supabase.from("portfolios").update({ template: selectedTemplate }).eq("id", p.id).select().single(); if (error) { showToast(`Template save failed: ${error.message}`); return; } portfolios = portfolios.map(item => item.id === p.id ? data : item); }
    else if (p) { p.template = selectedTemplate; localStorage.setItem("portfolioforge-demo", JSON.stringify(portfolios)); }
    location.hash = `preview/${editingId}`;
  }
});
document.addEventListener("submit", async event => {
  if (!event.target.matches("#portfolio-form")) return;
  event.preventDefault();
  const submit = event.target.querySelector("button[type=submit]"); submit.disabled = true; submit.textContent = "Saving...";
  try { const id = await savePortfolio(event.target); showToast("Portfolio saved online."); location.hash = `templates/${id}`; } catch (error) { showToast(`Save failed: ${error.message}`); submit.disabled = false; submit.textContent = editingId ? "Save changes →" : "Save portfolio →"; }
});
window.addEventListener("hashchange", render);
(async function start() { try { await loadPortfolios(); await render(); } catch (error) { app.innerHTML = `<section class="container page-heading"><h2>Unable to load portfolios</h2><p>Supabase returned an error: ${escapeHtml(error.message)}</p><a class="button" href="#create">Try creating a portfolio</a></section>`; } })();
