import { getCloudConfig, saveCloudConfig, clearCloudConfig, getSession, testConnection, signIn, signUp, signOut, fetchContent, upsertContent, removeContent, uploadFile, createFileLink } from "./cloud.js?v=3";

const continueButton = document.querySelector("#continueButton");
const toast = document.querySelector("#toast");
const saveAction = document.querySelector("#saveAction");
const actionInput = document.querySelector("#actionInput");
const successMessage = document.querySelector("#successMessage");
const modalBackdrop = document.querySelector("#modalBackdrop");
const modalClose = document.querySelector("#modalClose");
const modalTitle = document.querySelector("#modalTitle");
const modalEyebrow = document.querySelector("#modalEyebrow");
const modalContent = document.querySelector("#modalContent");
const modalAction = document.querySelector("#modalAction");
const menuButton = document.querySelector("#menuButton");
const sidebar = document.querySelector(".sidebar");
const accountButton = document.querySelector("#accountButton");
const accountBackdrop = document.querySelector("#accountBackdrop");
const accountClose = document.querySelector("#accountClose");
const accountState = document.querySelector("#accountState");

const panels = {
  "action-plan": ["MY ACTION PLAN", "Three choices that move you forward", `<ul class="modal-list"><li><strong>Today</strong><br>Choose one small action and complete it.</li><li><strong>This week</strong><br>Finish your options brainstorm.</li><li><strong>Next call</strong><br>Bring one decision you want support with.</li></ul>`],
  profile: ["COACH & FOUNDER", "April Lungal", `<p>Welcome to your Own Your Options app.</p><ul class="modal-list"><li>Manage coaching content</li><li>View member progress</li><li>Update your profile</li></ul>`],
  calendar: ["UPCOMING SESSION", "Group coaching call", `<p><strong>Wednesday, June 17 at 6:00 PM</strong></p><p>Your session is ready to add. Calendar connection will be included when the app is connected to your preferred calendar service.</p>`],
  brainstorm: ["WORKSHEET", "Options brainstorm", `<p>What is one area where you feel stuck right now?</p><textarea class="modal-textarea" placeholder="Write what is on your mind..."></textarea><p>Now list three choices that could move you forward, even if they are not perfect.</p>`],
  audio: ["10 MINUTE RESET", "Moving through doubt", `<p>This guided audio space will help members slow down, hear their own wisdom, and choose their next step.</p><ul class="modal-list"><li>▶ Start guided reset</li><li>Save for later</li></ul>`],
  reflection: ["WEEKLY CHECK-IN", "Notice your wins", `<p>What did you do this week that you are proud of?</p><textarea class="modal-textarea" placeholder="My win this week was..."></textarea>`],
  "all-tools": ["WORKBOOK & TOOLS", "Your coaching library", `<ul class="modal-list"><li>Options brainstorm</li><li>Moving through doubt</li><li>Weekly reflection</li><li>Freedom planner</li><li>Confidence check-in</li></ul>`],
  "step-1": ["STEP 1", "Own your reality", `<p>Get clear on where you are right now. Honest awareness gives you somewhere powerful to begin.</p>`],
  "step-2": ["STEP 2", "Define your future", `<p>Create a vision for the life you truly want, based on your values rather than other people’s expectations.</p>`],
  "step-3": ["STEP 3 · CURRENT FOCUS", "Create more options", `<p>Discover and build income, skills, and lifestyle options. Your task this week is to turn one idea into action.</p>`],
  "step-4": ["STEP 4", "Implement with intention", `<p>Take consistent action and build momentum. This step unlocks after you complete Create More Options.</p>`],
  "step-5": ["STEP 5", "Build freedom", `<p>Design a life with more time, choices, and fulfillment. This step unlocks later in your journey.</p>`],
  community: ["COMMUNITY", "You don’t do this alone", `<p>A supportive place for members to share wins, ask questions, and stay accountable.</p><ul class="modal-list"><li>Share a win</li><li>Ask the community</li><li>Find an accountability partner</li></ul>`]
  ,mindset: ["TODAY'S MINDSET", "Responsibility creates options", `<p>Responsibility is not blame. It is the moment you recognize where your power lives.</p><p><strong>Today’s practice:</strong> Name one thing you can influence, even if you cannot control the whole situation.</p>`]
};

const views = {
  philosophy: {
    eyebrow: "PHILOSOPHY LIBRARY", title: "Ideas that create freedom", copy: "Short, practical lessons for shifting how you see responsibility, possibility, family, and freedom.",
    tabs: ["All", "Mindset", "Freedom", "Growth"],
    cards: [["◇","RESPONSIBILITY","Responsibility creates options","Find the power available inside your current reality."],["◎","OPTIONS","Create freedom","Learn why choices grow when you stop waiting for certainty."],["♡","FAMILY","Freedom creates legacy","Build choices that support the people and life you value."],["✦","CONFIDENCE","You are always one decision away","Confidence is built after action, not before it."],["✓","CLARITY","Clarity comes before confidence","Name what matters and make the next choice easier."],["→","GROWTH","Live by choice","Move from reacting to intentionally designing your life."]]
  },
  stories: {
    eyebrow: "STORY LIBRARY", title: "Real stories. More possibilities.", copy: "Stories from people who changed direction, rebuilt confidence, and created a life on their own terms.",
    tabs: ["All", "Starting over", "Family", "Business"],
    cards: [["01","STARTING OVER","When you feel stuck","The moment that changed everything."],["02","BUSINESS","Raising five kids","A lesson in building income without burning out."],["03","FAMILY","Caregiving","How a hard season revealed a new direction."],["04","GROWTH","Building options later in life","It is never too late to choose again."],["05","FREEDOM","Freedom by design","A practical path from overwhelm to agency."],["06","CONFIDENCE","Starting before confidence","Why imperfect action worked."]]
  },
  resources: {
    eyebrow: "RESOURCE VAULT", title: "Tools I personally use", copy: "A curated library to help members create more options in work, money, organization, and personal growth.",
    tabs: ["Recommended", "Business", "AI tools", "Organization"],
    cards: [["↗","BUSINESS","Income option planner","Map an idea into a realistic first offer."],["✦","AI TOOLS","AI starter guide","Use AI to save time and make ideas easier to act on."],["✓","ORGANIZATION","Weekly freedom planner","Protect time for the choices that matter."],["□","CONTENT","Simple content system","Share your work without living online."],["◎","BOOKS","April’s reading list","Books that changed how I think about choice."],["♡","WELLBEING","Energy check-in","Build plans that respect your real capacity."]]
  },
  community: {
    eyebrow: "THE COLLECTIVE", title: "You don’t have to do this alone", copy: "Connect with people creating options, taking responsibility, and building freedom one choice at a time.",
    tabs: ["Community feed", "Live calls", "Challenges"],
    cards: [["♡","CELEBRATE","Wins & wins","Share something you chose, changed, or completed."],["◎","CONNECT","Ask the community","Get perspective from people who understand."],["✓","CHALLENGE","Seven days of options","Take one small action every day this week."],["✦","LIVE COACHING","Join this week’s call","Bring a question and leave with a next step."],["◇","ACCOUNTABILITY","Find a partner","Stay consistent with someone beside you."],["→","WELCOME","Introduce yourself","Tell the collective what you are creating."]]
  },
  coaching: {
    eyebrow: "COACHING HUB", title: "Support when you need it", copy: "Access group coaching, workshops, replays, workbooks, and direct guidance from April.",
    tabs: ["Upcoming", "Replays", "Workbooks"],
    cards: [["17","UPCOMING LIVE CALL","Group coaching call","Wednesday, June 17 · 6:00 PM"],["▶","CALL REPLAY","Overcoming overwhelm","Turn an overloaded mind into one clear decision."],["▶","CALL REPLAY","Creating income options","Find practical possibilities from what you already know."],["□","WORKBOOK","Own Your Options workbook","The complete framework in one guided workbook."],["?","Q&A LIBRARY","Ask April","Browse answers to common coaching questions."],["✦","PRIVATE COACHING","Book a private session","Get personalized clarity and an action plan."]]
  },
  plan: {
    eyebrow: "THIS WEEK'S PLAN", title: "Create more options", copy: "Your clear, realistic plan for moving from idea to action this week.",
    tabs: ["This week", "This month", "Notes"],
    cards: [["1","MONDAY","Learn one new skill","Complete the 10-minute lesson."],["2","WEDNESDAY","Take one action daily","Choose something small enough to finish."],["3","FRIDAY","Reach out to one person","Ask for perspective, support, or connection."],["✓","PROGRESS","Two of four complete","Keep going. Consistency creates confidence."],["□","NOTES","Capture what you notice","Write down ideas before they disappear."],["→","NEXT WEEK","Prepare your next focus","Choose what deserves your energy next."]]
  }
};

const assessmentView = {
  eyebrow:"YOUR OPTIONS ASSESSMENT", title:"See where your choices can grow", copy:"This assessment helps you notice where you already feel powerful and where more support could create new options."
};

const starterContent = [
  { id: 1, type: "Coaching lesson", library: "coaching", title: "Overcoming overwhelm", description: "Turn an overloaded mind into one clear decision.", format: "Video", status: "Published" },
  { id: 2, type: "Resource", library: "resources", title: "Weekly freedom planner", description: "Protect time for the choices that matter.", format: "PDF", status: "Published" },
  { id: 3, type: "Daily mindset", library: "philosophy", title: "Responsibility creates options", description: "Find the power available inside your current reality.", format: "Article", status: "Published" }
];
let adminContent = JSON.parse(localStorage.getItem("oyo-admin-content") || "null") || starterContent;
let editingId = null;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 2200);
}

continueButton.addEventListener("click", () => {
  openPanel("step-3");
});

saveAction.addEventListener("click", () => {
  if (!actionInput.value.trim()) {
    actionInput.focus();
    showToast("Write one small action first");
    return;
  }
  localStorage.setItem("oyo-today-action", actionInput.value.trim());
  successMessage.classList.add("show");
  showToast("Your action is saved");
});

actionInput.value = localStorage.getItem("oyo-today-action") || "";
if (actionInput.value) successMessage.classList.add("show");

document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    document.querySelectorAll(".nav-link").forEach((item) => item.classList.remove("active"));
    link.classList.add("active");
    sidebar.classList.remove("open");
    renderView(link.dataset.view);
  });
});

function renderView(key) {
  const home = document.querySelector("#home");
  const host = document.querySelector("#viewHost");
  if (key === "home") {
    host.hidden = true;
    home.hidden = false;
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }
  home.hidden = true;
  host.hidden = false;
  if (key === "admin") {
    renderAdmin(host);
  } else if (key === "assessment") {
    host.innerHTML = `<section class="view-hero"><div><p class="eyebrow">${assessmentView.eyebrow}</p><h1>${assessmentView.title}</h1><p>${assessmentView.copy}</p><button class="primary-button" data-open="assessment-start">Retake assessment <span>→</span></button></div><div class="metric-ring"><div><strong>72</strong><small>OVERALL SCORE</small></div></div></section><section class="section-block"><div class="section-heading"><div><p class="eyebrow">YOUR RESULTS</p><h2>Where options can grow</h2></div></div><div class="score-list">${[["Responsibility",86],["Financial freedom",65],["Health & energy",70],["Relationships",68],["Growth & mindset",75],["Purpose & impact",60]].map(([n,s])=>`<div class="score-row"><strong>${n}</strong><div class="score-bar"><span style="width:${s}%"></span></div><b>${s}%</b></div>`).join("")}</div><div class="quote-panel">Your score is not a judgment. It is a map showing where one new choice could change the direction.</div></section>`;
  } else {
    const view = views[key] || views.philosophy;
    const custom = adminContent.filter(item => item.library === key && item.status === "Published");
    host.innerHTML = `<section class="view-hero"><div><p class="eyebrow">${view.eyebrow}</p><h1>${view.title}</h1><p>${view.copy}</p></div></section><div class="view-tabs">${view.tabs.map((t,i)=>`<button class="${i===0?"active":""}">${t}</button>`).join("")}</div><div class="view-grid">${custom.map(c=>`<button class="feature-card" data-content-id="${c.id}"><span class="card-mark">✦</span><small>${c.type.toUpperCase()} · ${c.format.toUpperCase()}</small><strong>${c.title}</strong><p>${c.description}</p><b>Open →</b></button>`).join("")}${view.cards.map(c=>`<button class="feature-card" data-open="generic-card"><span class="card-mark">${c[0]}</span><small>${c[1]}</small><strong>${c[2]}</strong><p>${c[3]}</p><b>Open →</b></button>`).join("")}</div>`;
  }
  host.querySelectorAll("[data-open]").forEach(el => el.addEventListener("click",()=>openPanel(el.dataset.open)));
  host.querySelectorAll("[data-content-id]").forEach(el => el.addEventListener("click",()=>openPublishedContent(Number(el.dataset.contentId))));
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderAdmin(host) {
  host.innerHTML = `<section class="view-hero"><div><p class="eyebrow">APRIL ADMIN</p><h1>Manage your coaching app</h1><p>Create and publish lessons, resources, stories, calls, and daily mindset content. Published items automatically appear in the matching member library.</p></div><span class="status-pill">ADMIN MODE</span></section>
  <section class="admin-panel cloud-panel"><p class="eyebrow">SECURE CLOUD</p><h2>Member accounts & file storage</h2><div class="cloud-status"><span class="cloud-dot ${getCloudConfig() ? "connected" : ""}"></span><span>${getCloudConfig() ? "Cloud details saved. Test the connection to confirm access." : "Local mode. Connect Supabase to share content across devices."}</span></div>
    <form class="admin-form" id="cloudForm"><div class="field-row"><div class="field"><label for="cloudUrl">Supabase project URL</label><input id="cloudUrl" type="url" placeholder="https://your-project.supabase.co" value="${getCloudConfig()?.url || ""}"></div><div class="field"><label for="cloudKey">Public anon key</label><input id="cloudKey" type="password" placeholder="Your public anon key" value="${getCloudConfig()?.anonKey || ""}"></div></div><div class="admin-buttons"><button class="primary-button" type="submit">Connect & test <span>→</span></button><button class="outline-button" id="disconnectCloud" type="button">Disconnect</button></div></form>
    <p class="account-note">Required Supabase items: an <strong>oyo_content</strong> table and a private <strong>oyo-content</strong> storage bucket. Member passwords stay securely with Supabase and are never stored in this app.</p>
  </section>
  <div class="admin-layout">
    <section class="admin-panel"><p class="eyebrow">CONTENT EDITOR</p><h2 id="editorTitle">Add new content</h2>
      <form class="admin-form" id="contentForm">
        <div class="field-row"><div class="field"><label for="contentType">Content type</label><select id="contentType"><option>Coaching lesson</option><option>Resource</option><option>Story</option><option>Live call</option><option>Daily mindset</option><option>Workbook</option></select></div><div class="field"><label for="contentLibrary">Member library</label><select id="contentLibrary"><option value="coaching">Coaching hub</option><option value="resources">Resource vault</option><option value="stories">Story library</option><option value="philosophy">Philosophy library</option><option value="community">Community</option></select></div></div>
        <div class="field"><label for="contentTitle">Title</label><input id="contentTitle" required placeholder="Example: Creating income options"></div>
        <div class="field"><label for="contentDescription">Description</label><textarea id="contentDescription" required placeholder="What will members learn or receive?"></textarea></div>
        <div class="field-row"><div class="field"><label for="contentFormat">Format</label><select id="contentFormat"><option>Video</option><option>Audio</option><option>Article</option><option>PDF</option><option>Live session</option><option>Worksheet</option></select></div><div class="field"><label for="contentStatus">Status</label><select id="contentStatus"><option>Published</option><option>Draft</option></select></div></div>
        <label class="upload-zone">Attach video, audio, PDF, or workbook<br><input id="contentFile" type="file" accept="video/*,audio/*,.pdf,.doc,.docx"></label>
        <div class="admin-buttons"><button class="primary-button" type="submit">Publish content <span>→</span></button><button class="outline-button" id="cancelEdit" type="button">Clear</button></div>
      </form>
    </section>
    <section class="admin-panel"><p class="eyebrow">CONTENT LIBRARY</p><h2>Your published content</h2><div class="content-list" id="contentList"></div></section>
  </div>`;
  bindAdmin();
}

function bindAdmin() {
  const form = document.querySelector("#contentForm");
  const list = document.querySelector("#contentList");
  const refreshList = () => {
    list.innerHTML = adminContent.length ? adminContent.map(item => `<article class="content-item"><div><small>${item.type.toUpperCase()} · ${item.format.toUpperCase()} <span class="status-pill">${item.status}</span></small><strong>${item.title}</strong><p>${item.description}</p></div><div class="item-actions"><button data-edit="${item.id}" title="Edit">✎</button><button data-delete="${item.id}" title="Delete">×</button></div></article>`).join("") : "<p>No content yet. Add your first lesson.</p>";
    list.querySelectorAll("[data-edit]").forEach(button => button.addEventListener("click",()=>editContent(Number(button.dataset.edit))));
    list.querySelectorAll("[data-delete]").forEach(button => button.addEventListener("click",()=>deleteContent(Number(button.dataset.delete))));
  };
  document.querySelector("#cloudForm").addEventListener("submit", async event => {
    event.preventDefault();
    const url=document.querySelector("#cloudUrl").value.trim(), key=document.querySelector("#cloudKey").value.trim();
    if(!url || !key) return showToast("Add both cloud details");
    saveCloudConfig(url,key);
    try { await testConnection(); await syncFromCloud(); showToast("Cloud connected"); renderView("admin"); }
    catch(error) { showToast(`Saved, but test failed: ${error.message}`); }
  });
  document.querySelector("#disconnectCloud").addEventListener("click",()=>{clearCloudConfig();showToast("Cloud disconnected");renderView("admin");});
  form.addEventListener("submit", async event => {
    event.preventDefault();
    const file=document.querySelector("#contentFile").files[0];
    let fileUrl="", fileName=file?.name || "";
    if(file && getCloudConfig()) { try { fileUrl=await uploadFile(file); } catch(error){ return showToast(`Upload failed: ${error.message}`); } }
    const item = {
      id: editingId || Date.now(), type: document.querySelector("#contentType").value, library: document.querySelector("#contentLibrary").value,
      title: document.querySelector("#contentTitle").value.trim(), description: document.querySelector("#contentDescription").value.trim(),
      format: document.querySelector("#contentFormat").value, status: document.querySelector("#contentStatus").value,
      fileName, file_url: fileUrl
    };
    if (editingId) adminContent = adminContent.map(existing => existing.id === editingId ? item : existing);
    else adminContent.unshift(item);
    saveAdminContent();
    if(getCloudConfig()) { try { await upsertContent(item); } catch(error) { showToast(`Saved locally. Cloud: ${error.message}`); } }
    editingId = null; form.reset(); document.querySelector("#editorTitle").textContent = "Add new content"; refreshList(); showToast(item.status === "Published" ? "Content published" : "Draft saved");
  });
  document.querySelector("#cancelEdit").addEventListener("click",()=>{ editingId=null; form.reset(); document.querySelector("#editorTitle").textContent="Add new content"; });
  window.refreshAdminList = refreshList;
  refreshList();
}

function editContent(id) {
  const item = adminContent.find(entry => entry.id === id); if (!item) return; editingId = id;
  document.querySelector("#contentType").value=item.type; document.querySelector("#contentLibrary").value=item.library; document.querySelector("#contentTitle").value=item.title; document.querySelector("#contentDescription").value=item.description; document.querySelector("#contentFormat").value=item.format; document.querySelector("#contentStatus").value=item.status; document.querySelector("#editorTitle").textContent="Edit content"; window.scrollTo({top:0,behavior:"smooth"});
}
async function deleteContent(id) { adminContent = adminContent.filter(item=>item.id!==id); saveAdminContent(); if(getCloudConfig()) { try{await removeContent(id);}catch(error){showToast(`Deleted locally. Cloud: ${error.message}`);} } window.refreshAdminList(); showToast("Content deleted"); }
function saveAdminContent() { localStorage.setItem("oyo-admin-content", JSON.stringify(adminContent)); }
async function openPublishedContent(id) { const item=adminContent.find(entry=>entry.id===id); if(!item)return; let fileLink=""; if(item.file_url&&getSession())try{fileLink=await createFileLink(item.file_url);}catch(error){showToast(error.message);} panels["published"]=[`${item.type.toUpperCase()} · ${item.format.toUpperCase()}`,item.title,`<p>${item.description}</p>${item.fileName?`<p><strong>Attached:</strong> ${item.fileName}</p>`:""}${fileLink?`<p><a href="${fileLink}" target="_blank">Open attached file →</a></p>`:item.file_url?`<p>Sign in to open this private attachment.</p>`:""}`]; openPanel("published"); }
async function syncFromCloud(){ if(!getCloudConfig())return; const remote=await fetchContent(); if(Array.isArray(remote)){adminContent=remote;saveAdminContent();} }

panels["generic-card"] = ["OWN YOUR OPTIONS", "Your next choice", "<p>This lesson is ready for your full coaching content, video, audio, worksheets, and member reflections.</p><p><strong>The next build step:</strong> connect your real program material and member accounts.</p>"];
panels["assessment-start"] = ["OPTIONS ASSESSMENT", "Let’s see where you are", "<p>Answer a focused set of questions across responsibility, financial freedom, health, relationships, growth, and purpose.</p><ul class='modal-list'><li>About 8 minutes</li><li>Personalized options score</li><li>Recommended next steps</li></ul>"];

function openPanel(key) {
  const panel = panels[key];
  if (!panel) return;
  modalEyebrow.textContent = panel[0];
  modalTitle.textContent = panel[1];
  modalContent.innerHTML = panel[2];
  modalBackdrop.hidden = false;
  document.body.style.overflow = "hidden";
  modalClose.focus();
}

function closePanel() {
  modalBackdrop.hidden = true;
  document.body.style.overflow = "";
}

document.querySelectorAll("[data-open]").forEach((control) => {
  control.addEventListener("click", (event) => {
    event.preventDefault();
    openPanel(control.dataset.open);
  });
});

modalClose.addEventListener("click", closePanel);
modalAction.addEventListener("click", () => {
  closePanel();
  showToast("Progress saved");
});
modalBackdrop.addEventListener("click", (event) => {
  if (event.target === modalBackdrop) closePanel();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closePanel();
});
menuButton.addEventListener("click", () => sidebar.classList.toggle("open"));

function renderAccount() {
  const session=getSession();
  if(session?.user) {
    accountState.innerHTML=`<p class="account-note">Signed in securely as <strong>${session.user.email}</strong>. Your progress and member access can now follow you across devices.</p><button class="outline-button wide" id="signOutButton">Sign out</button>`;
    document.querySelector("#accountTitle").textContent="Your member account";
    document.querySelector("#signOutButton").addEventListener("click",()=>{signOut();accountBackdrop.hidden=true;showToast("Signed out");});
  } else {
    accountState.innerHTML=`<p class="account-note">${getCloudConfig()?"Sign in to access your coaching from any device.":"April must connect the secure cloud in April Admin before member sign-in is available."}</p><form class="account-form" id="signInForm"><div class="field"><label>Email</label><input id="accountEmail" type="email" required></div><div class="field"><label>Password</label><input id="accountPassword" type="password" minlength="6" required></div><button class="primary-button" type="submit">Sign in <span>→</span></button><button class="text-button" id="createAccount" type="button">Create a new member account</button></form>`;
    document.querySelector("#accountTitle").textContent="Sign in to your options";
    document.querySelector("#signInForm").addEventListener("submit",async event=>{event.preventDefault();try{await signIn(document.querySelector("#accountEmail").value,document.querySelector("#accountPassword").value);showToast("Welcome back");renderAccount();}catch(error){showToast(error.message);}});
    document.querySelector("#createAccount").addEventListener("click",async()=>{const email=document.querySelector("#accountEmail").value,password=document.querySelector("#accountPassword").value;if(!email||!password)return showToast("Enter email and password first");try{await signUp(email,password,"Own Your Options member");showToast("Check your email to confirm your account");}catch(error){showToast(error.message);}});
  }
}
accountButton.addEventListener("click",()=>{renderAccount();accountBackdrop.hidden=false;});
accountClose.addEventListener("click",()=>accountBackdrop.hidden=true);
accountBackdrop.addEventListener("click",event=>{if(event.target===accountBackdrop)accountBackdrop.hidden=true;});
if(getCloudConfig()) syncFromCloud().catch(()=>{});
