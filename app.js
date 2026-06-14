import { getCloudConfig, saveCloudConfig, clearCloudConfig, getSession, isAdmin, refreshUser, updateUserName, testConnection, signIn, signUp, signOut, fetchContent, upsertContent, removeContent, uploadFile, createFileLink, fetchQuestions, upsertQuestion, removeQuestion, saveAssessmentResult } from "./cloud.js?v=13";

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
const landingPage = document.querySelector("#landingPage");
const appShell = document.querySelector("#appShell");
const accountButton = document.querySelector("#accountButton");
const accountBackdrop = document.querySelector("#accountBackdrop");
const accountClose = document.querySelector("#accountClose");
const accountState = document.querySelector("#accountState");
const welcomeHeading = document.querySelector("#welcomeHeading");
const sidebarName = document.querySelector("#sidebarName");
const sidebarRole = document.querySelector("#sidebarRole");
const sidebarAvatar = document.querySelector("#sidebarAvatar");
const sidebarAccountButton = document.querySelector("#sidebarAccountButton");
document.querySelectorAll(".copyright-year").forEach(item=>item.textContent=new Date().getFullYear());

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
  offers: {
    eyebrow: "OFFERS & SHOP", title: "Choose your next step", copy: "Purchase coaching, book a private session, or choose a digital tool that helps you create more options.",
    tabs: ["All", "Group coaching", "Digital product", "1:1 coaching"],
    cards: [["✦","GROUP COACHING","Own Your Options group program","A guided twelve-week coaching experience."],["▤","DIGITAL PRODUCT","Own Your Options workbook","A practical self-guided workbook for creating your plan."],["♡","1:1 COACHING","Private coaching session","Personalized clarity, support, and a customized action plan."]]
  },
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
  workbooks: {
    eyebrow: "WORKBOOKS & TOOLS", title: "Turn insight into action", copy: "Guided worksheets, planners, exercises, and complete workbooks that help members create and follow their plan.",
    tabs: ["All", "Workbooks", "Worksheets", "Planners", "Exercises"],
    cards: [["▤","WORKBOOKS","Own Your Options workbook","Move through the complete five-step framework."],["✓","WORKSHEETS","Options brainstorm","Discover choices and opportunities you may have missed."],["□","PLANNERS","Weekly freedom planner","Choose your priorities and protect time for action."],["◇","EXERCISES","Reality check-in","Get honest and clear about where you are right now."],["◎","WORKSHEETS","Confidence builder","Collect evidence that you can create change."],["→","PLANNERS","90-day options plan","Turn your next chapter into clear weekly actions."]]
  },
  lwa: {
    eyebrow: "LWA BUSINESS", title: "Business, income, and legacy", copy: "Explore April’s LWA business, practical income opportunities, business resources, and ways to build a lasting legacy.",
    tabs: ["All", "Offers", "Business tools", "Stories", "Get started"],
    cards: [["↗","OFFERS","Explore LWA","Discover the LWA business and available opportunities."],["□","BUSINESS TOOLS","LWA resource library","Tools and guidance for building with intention."],["◎","STORIES","Why I chose LWA","April’s story, lessons, and vision for the business."],["✓","GET STARTED","Your first step","Learn what to do if LWA feels like an option for you."],["♡","COMMUNITY","Connect with April","Ask questions and explore the possibilities together."],["✦","OFFERS","Build income options","Create another path toward income and freedom."]]
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
    eyebrow: "THIS WEEK'S PLAN", title: "Own your reality", copy: "Your first week is about getting honest and clear before deciding what comes next.",
    tabs: ["This week", "This month", "Notes"],
    cards: [["1","START HERE","Complete your reality check-in","Name what feels most important right now."],["2","THIS WEEK","Notice what you can influence","Separate what you control from what you cannot."],["3","REFLECT","Choose what matters most","Identify the area that deserves your attention first."],["✓","PROGRESS","Nothing completed yet","Your first completed step will appear here."],["□","NOTES","Capture what you notice","Write down ideas before they disappear."],["→","NEXT WEEK","Define your future","Next, you will begin creating a clear vision."]]
  }
};

const assessmentView = {
  eyebrow:"YOUR OPTIONS ASSESSMENT", title:"See where your choices can grow", copy:"This assessment helps you notice where you already feel powerful and where more support could create new options."
};

const starterQuestions = [
  ["Responsibility","I focus my energy on what I can influence instead of what I cannot control."],
  ["Responsibility","I take ownership of my choices without blaming myself or others."],
  ["Financial freedom","I have more than one realistic way to earn income."],
  ["Financial freedom","I feel able to make thoughtful choices about money."],
  ["Health & energy","My daily routines support the energy I need for my priorities."],
  ["Health & energy","I protect time for rest and recovery without guilt."],
  ["Relationships","I can ask for support and communicate what I need."],
  ["Relationships","My closest relationships support the life I want to build."],
  ["Growth & mindset","I take action before I feel completely confident."],
  ["Growth & mindset","I can see more than one path forward when plans change."],
  ["Purpose & impact","I know what matters most to me in this season of life."],
  ["Purpose & impact","My current choices are moving me toward a meaningful future."]
].map((q,index)=>({id:index+1,category:q[0],question:q[1],low_label:"Not yet",high_label:"Absolutely",sort_order:index+1,status:"Published"}));
let assessmentQuestions=JSON.parse(localStorage.getItem("oyo-assessment-questions")||"null")||starterQuestions;
let assessmentAnswers={};
let currentQuestion=0;
let memberProgress=JSON.parse(localStorage.getItem("oyo-member-progress")||"null")||{completed:[],saved:[],reflections:[]};

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
  openPanel("step-1");
});

saveAction.addEventListener("click", () => {
  if (!actionInput.value.trim()) {
    actionInput.focus();
    showToast("Write one small action first");
    return;
  }
  localStorage.setItem("oyo-today-action", actionInput.value.trim());
  successMessage.classList.add("show");
  completeItem(actionInput.value.trim(),"Action");
  showToast("Your action is saved");
});

actionInput.value = localStorage.getItem("oyo-today-action") || "";
if (actionInput.value) successMessage.classList.add("show");

document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    if ((link.dataset.view === "admin" || link.dataset.view === "assessment-builder") && !isAdmin()) {
      sidebar.classList.remove("open");
      showToast("Administrator access required");
      openAccount();
      return;
    }
    document.querySelectorAll(".nav-link").forEach((item) => item.classList.remove("active"));
    link.classList.add("active");
    sidebar.classList.remove("open");
    renderView(link.dataset.view);
  });
});

function renderView(key) {
  const home = document.querySelector("#home");
  const host = document.querySelector("#viewHost");
  if ((key === "admin" || key === "assessment-builder") && !isAdmin()) {
    showToast("Administrator access required");
    openAccount();
    return;
  }
  if (key === "progress") {
    home.hidden=true;host.hidden=false;renderProgress(host);window.scrollTo({top:0,behavior:"smooth"});return;
  }
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
  } else if (key === "assessment-builder") {
    renderAssessmentBuilder(host);
  } else if (key === "assessment") {
    renderAssessmentIntro(host);
  } else {
    const view = views[key] || views.philosophy;
    const custom = adminContent.filter(item => item.library === key && item.status === "Published");
    host.innerHTML = `<section class="view-hero"><div><p class="eyebrow">${view.eyebrow}</p><h1>${view.title}</h1><p>${view.copy}</p></div></section><div class="view-tabs">${view.tabs.map((t,i)=>`<button class="${i===0?"active":""}" data-filter="${t}">${t}</button>`).join("")}</div><div class="view-grid">${custom.map(c=>`<button class="feature-card" data-category="${c.type}" data-content-id="${c.id}" data-save-title="${c.title}" data-save-type="${c.type}"><span class="card-mark">${c.payment_url?"$":"✦"}</span><small>${c.type.toUpperCase()} · ${c.format.toUpperCase()}</small><strong>${c.title}</strong>${c.price?`<span class="price-tag">${c.price}</span>`:""}<p>${c.description}</p><b>${c.payment_url?"View offer →":"Open →"}</b></button>`).join("")}${view.cards.map(c=>`<button class="feature-card" data-category="${c[1]}" data-open="generic-card" data-save-title="${c[2]}" data-save-type="${c[1]}"><span class="card-mark">${c[0]}</span><small>${c[1]}</small><strong>${c[2]}</strong><p>${c[3]}</p><b>Open →</b></button>`).join("")}</div><p class="empty-filter" hidden>No items have been added to this category yet.</p>`;
  }
  host.querySelectorAll("[data-open]").forEach(el => el.addEventListener("click",()=>{
    if(el.dataset.saveTitle) {
      panels["selected-card"]=[el.dataset.saveType,el.dataset.saveTitle,"<p>Open this item, return to it later, or mark it complete when you are ready.</p>"];
      openPanel("selected-card");
    } else openPanel(el.dataset.open);
  }));
  host.querySelectorAll("[data-content-id]").forEach(el => el.addEventListener("click",()=>openPublishedContent(Number(el.dataset.contentId))));
  host.querySelectorAll("[data-save-title]").forEach(el=>el.addEventListener("contextmenu",event=>{event.preventDefault();saveItem(el.dataset.saveTitle,el.dataset.saveType);}));
  bindViewTabs(host);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderProgress(host) {
  const result=JSON.parse(localStorage.getItem("oyo-assessment-result")||"null"), action=localStorage.getItem("oyo-today-action")||"";
  host.innerHTML=`<section class="view-hero"><div><p class="eyebrow">MY PROGRESS</p><h1>Your choices are adding up</h1><p>Return to what you saved, notice what you completed, and choose the next small action.</p></div>${result?`<div class="metric-ring"><div><strong>${result.overall}</strong><small>OPTIONS SCORE</small></div></div>`:""}</section><div class="progress-overview"><article class="progress-stat"><small>COMPLETED</small><strong>${memberProgress.completed.length}</strong> <span>items</span></article><article class="progress-stat"><small>SAVED</small><strong>${memberProgress.saved.length}</strong> <span>for later</span></article><article class="progress-stat"><small>REFLECTIONS</small><strong>${memberProgress.reflections.length}</strong> <span>written</span></article><article class="progress-stat"><small>JOURNEY</small><strong>${Math.min(100,memberProgress.completed.length*5)}%</strong></article></div><div class="progress-sections"><section class="progress-panel"><p class="eyebrow">TODAY</p><h2>Your next action</h2>${action?entryMarkup({id:0,title:action,type:"Action"},"action"):'<p class="empty-state">Add an action from your dashboard and it will appear here.</p>'}</section><section class="progress-panel"><p class="eyebrow">SAVED FOR LATER</p><h2>Saved resources</h2><div class="saved-list">${savedMarkup(memberProgress.saved,"saved")}</div></section><section class="progress-panel"><p class="eyebrow">YOUR WINS</p><h2>Completed</h2><div class="saved-list">${savedMarkup(memberProgress.completed,"completed")}</div></section><section class="progress-panel"><p class="eyebrow">YOUR WORDS</p><h2>Reflections</h2><div class="saved-list">${savedMarkup(memberProgress.reflections,"reflections")}</div></section></div>`;
  host.querySelectorAll("[data-remove-progress]").forEach(btn=>btn.addEventListener("click",()=>{if(btn.dataset.list==="action")localStorage.removeItem("oyo-today-action");else memberProgress[btn.dataset.list]=memberProgress[btn.dataset.list].filter(i=>i.id!==Number(btn.dataset.removeProgress));saveProgress();renderProgress(host);}));
}
function entryMarkup(item,list){return `<div class="saved-entry"><div><small>${item.type.toUpperCase()}</small><strong>${item.title}</strong>${item.note?`<p>${item.note}</p>`:""}</div><button data-remove-progress="${item.id}" data-list="${list}" title="Remove">×</button></div>`;}
function savedMarkup(items,list){return items.length?items.map(item=>entryMarkup(item,list)).join(""):'<p class="empty-state">Nothing here yet. Your saved work will appear here.</p>';}
function saveProgress(){localStorage.setItem("oyo-member-progress",JSON.stringify(memberProgress));}
function saveItem(title,type){if(memberProgress.saved.some(item=>item.title===title))return showToast("Already saved");memberProgress.saved.unshift({id:Date.now(),title,type});saveProgress();showToast("Saved to My Progress");}
function completeItem(title,type,note=""){if(!memberProgress.completed.some(item=>item.title===title))memberProgress.completed.unshift({id:Date.now(),title,type,note});saveProgress();}

function bindViewTabs(host) {
  const tabs=host.querySelectorAll("[data-filter]");
  if(!tabs.length)return;
  tabs.forEach(tab=>tab.addEventListener("click",()=>{
    tabs.forEach(item=>item.classList.remove("active"));tab.classList.add("active");
    const filter=tab.dataset.filter.toLowerCase(), cards=[...host.querySelectorAll(".feature-card")];
    let shown=0;
    cards.forEach(card=>{
      const category=(card.dataset.category||"").toLowerCase();
      const visible=filter==="all" || category.includes(filter.replace(/s$/,"")) || filter.includes(category.replace(/s$/,""));
      card.hidden=!visible;if(visible)shown++;
    });
    const empty=host.querySelector(".empty-filter");if(empty)empty.hidden=shown!==0;
  }));
}

function renderAssessmentIntro(host) {
  const previous=JSON.parse(localStorage.getItem("oyo-assessment-result")||"null");
  host.innerHTML=`<section class="view-hero"><div><p class="eyebrow">${assessmentView.eyebrow}</p><h1>${assessmentView.title}</h1><p>${assessmentView.copy}</p><button class="primary-button" id="startAssessment">${previous?"Retake":"Start"} assessment <span>→</span></button></div>${previous?`<div class="metric-ring"><div><strong>${previous.overall}</strong><small>OVERALL SCORE</small></div></div>`:""}</section>${previous?assessmentResultsMarkup(previous):`<div class="quote-panel">This is not a test. It is a clear, honest look at where one new choice could create more freedom.</div>`}`;
  document.querySelector("#startAssessment").addEventListener("click",()=>{assessmentAnswers={};currentQuestion=0;renderAssessmentQuestion(host);});
}

function renderAssessmentQuestion(host) {
  const questions=assessmentQuestions.filter(q=>q.status==="Published");
  if(!questions.length){host.innerHTML="<p>No assessment questions have been published yet.</p>";return;}
  const q=questions[currentQuestion], selected=assessmentAnswers[q.id];
  host.innerHTML=`<div class="assessment-shell"><p class="eyebrow">${q.category.toUpperCase()} · QUESTION ${currentQuestion+1} OF ${questions.length}</p><div class="assessment-progress"><span style="width:${((currentQuestion+1)/questions.length)*100}%"></span></div><section class="question-card"><h2>${q.question}</h2><div class="answer-scale">${[1,2,3,4,5].map(n=>`<button class="answer-choice ${selected===n?"selected":""}" data-score="${n}"><b>${n}</b>${n===1?q.low_label:n===5?q.high_label:""}</button>`).join("")}</div><div class="assessment-nav"><button class="outline-button" id="previousQuestion" ${currentQuestion===0?"disabled":""}>← Previous</button><button class="primary-button" id="nextQuestion">${currentQuestion===questions.length-1?"See my results":"Next"} <span>→</span></button></div></section></div>`;
  document.querySelectorAll("[data-score]").forEach(btn=>btn.addEventListener("click",()=>{assessmentAnswers[q.id]=Number(btn.dataset.score);renderAssessmentQuestion(host);}));
  document.querySelector("#previousQuestion").addEventListener("click",()=>{if(currentQuestion>0){currentQuestion--;renderAssessmentQuestion(host);}});
  document.querySelector("#nextQuestion").addEventListener("click",()=>{if(!assessmentAnswers[q.id])return showToast("Choose an answer first"); if(currentQuestion<questions.length-1){currentQuestion++;renderAssessmentQuestion(host);}else finishAssessment(host,questions);});
}

async function finishAssessment(host,questions) {
  const categories={};
  questions.forEach(q=>{categories[q.category]??=[];categories[q.category].push(assessmentAnswers[q.id]);});
  const scores=Object.fromEntries(Object.entries(categories).map(([name,answers])=>[name,Math.round((answers.reduce((a,b)=>a+b,0)/(answers.length*5))*100)]));
  const result={overall:Math.round(Object.values(scores).reduce((a,b)=>a+b,0)/Object.values(scores).length),scores,created_at:new Date().toISOString()};
  localStorage.setItem("oyo-assessment-result",JSON.stringify(result)); host.innerHTML=assessmentResultsMarkup(result);
  if(getSession())try{await saveAssessmentResult({user_id:getSession().user.id,overall_score:result.overall,scores:result.scores});}catch(error){showToast("Results saved on this device");}
}

function assessmentResultsMarkup(result) {
  const advice=score=>score<50?"Start with one small, supported choice this week.":score<75?"You have momentum. Choose one area to strengthen next.":"This is a strong foundation. Use it to create options elsewhere.";
  return `<section class="section-block"><div class="section-heading"><div><p class="eyebrow">YOUR RESULTS</p><h2>Your options score: ${result.overall}</h2></div><button class="outline-button" onclick="location.reload()">Retake</button></div><div class="result-grid">${Object.entries(result.scores).map(([name,score])=>`<article class="result-card"><strong>${name}</strong><b>${score}%</b><div class="score-bar"><span style="width:${score}%"></span></div><p>${advice(score)}</p></article>`).join("")}</div><div class="quote-panel">Your score is not a judgment. It is a map showing where one new choice could change the direction.</div></section>`;
}

function renderAssessmentBuilder(host) {
  host.innerHTML=`<section class="view-hero"><div><p class="eyebrow">APRIL ADMIN</p><h1>Assessment builder</h1><p>Create the questions that help members see where they are and where their options can grow.</p></div><span class="status-pill">${assessmentQuestions.length} QUESTIONS</span></section><div class="admin-layout"><section class="admin-panel"><p class="eyebrow">ADD QUESTION</p><h2>New assessment question</h2><form class="admin-form" id="questionForm"><div class="field"><label>Question</label><textarea id="questionText" required placeholder="Example: I feel able to make thoughtful choices about money."></textarea></div><div class="field-row"><div class="field"><label>Category</label><select id="questionCategory">${["Responsibility","Financial freedom","Health & energy","Relationships","Growth & mindset","Purpose & impact"].map(c=>`<option>${c}</option>`).join("")}</select></div><div class="field"><label>Status</label><select id="questionStatus"><option>Published</option><option>Draft</option></select></div></div><div class="field-row"><div class="field"><label>Low answer label</label><input id="lowLabel" value="Not yet"></div><div class="field"><label>High answer label</label><input id="highLabel" value="Absolutely"></div></div><button class="primary-button" type="submit">Add question <span>→</span></button></form></section><section class="admin-panel"><p class="eyebrow">ASSESSMENT QUESTIONS</p><h2>Your questions</h2><div class="content-list" id="questionList"></div></section></div>`;
  const list=document.querySelector("#questionList");
  const refresh=()=>{list.innerHTML=assessmentQuestions.map(q=>`<article class="question-admin-item"><div><small>${q.category.toUpperCase()} · ${q.status.toUpperCase()}</small><strong>${q.question}</strong></div><div class="item-actions"><button data-question-delete="${q.id}" title="Delete">×</button></div></article>`).join("");list.querySelectorAll("[data-question-delete]").forEach(btn=>btn.addEventListener("click",async()=>{assessmentQuestions=assessmentQuestions.filter(q=>q.id!==Number(btn.dataset.questionDelete));saveQuestions();if(getCloudConfig())try{await removeQuestion(Number(btn.dataset.questionDelete));}catch{}refresh();showToast("Question removed");}));};
  document.querySelector("#questionForm").addEventListener("submit",async event=>{event.preventDefault();const q={id:Date.now(),category:document.querySelector("#questionCategory").value,question:document.querySelector("#questionText").value.trim(),low_label:document.querySelector("#lowLabel").value.trim(),high_label:document.querySelector("#highLabel").value.trim(),sort_order:assessmentQuestions.length+1,status:document.querySelector("#questionStatus").value};assessmentQuestions.push(q);saveQuestions();if(getCloudConfig())try{await upsertQuestion(q);}catch(error){showToast("Saved locally. Sign in as admin to publish.");}event.target.reset();refresh();showToast("Question added");});refresh();
}
function saveQuestions(){localStorage.setItem("oyo-assessment-questions",JSON.stringify(assessmentQuestions));}

function renderAdmin(host) {
  host.innerHTML = `<section class="view-hero"><div><p class="eyebrow">APRIL ADMIN</p><h1>Manage your coaching app</h1><p>Create and publish lessons, resources, stories, calls, and daily mindset content. Published items automatically appear in the matching member library.</p></div><span class="status-pill">ADMIN MODE</span></section>
  <section class="admin-panel cloud-panel"><p class="eyebrow">SECURE CLOUD</p><h2>Member accounts & file storage</h2><div class="cloud-status"><span class="cloud-dot ${getCloudConfig() ? "connected" : ""}"></span><span>${getCloudConfig() ? "Cloud details saved. Test the connection to confirm access." : "Local mode. Connect Supabase to share content across devices."}</span></div>
    <form class="admin-form" id="cloudForm"><div class="field-row"><div class="field"><label for="cloudUrl">Supabase project URL</label><input id="cloudUrl" type="url" placeholder="https://your-project.supabase.co" value="${getCloudConfig()?.url || ""}"></div><div class="field"><label for="cloudKey">Public anon key</label><input id="cloudKey" type="password" placeholder="Your public anon key" value="${getCloudConfig()?.anonKey || ""}"></div></div><div class="admin-buttons"><button class="primary-button" type="submit">Connect & test <span>→</span></button><button class="outline-button" id="disconnectCloud" type="button">Disconnect</button></div></form>
    <p class="account-note">Required Supabase items: an <strong>oyo_content</strong> table and a private <strong>oyo-content</strong> storage bucket. Member passwords stay securely with Supabase and are never stored in this app.</p>
  </section>
  <div class="admin-layout">
    <section class="admin-panel"><p class="eyebrow">CONTENT EDITOR</p><h2 id="editorTitle">Add new content</h2>
      <form class="admin-form" id="contentForm">
        <div class="field-row"><div class="field"><label for="contentType">Content type</label><select id="contentType"><option>Coaching lesson</option><option>Group coaching</option><option>Digital product</option><option>1:1 coaching</option><option>Resource</option><option>Story</option><option>Live call</option><option>Daily mindset</option><option>Workbook</option><option>Worksheet</option><option>Planner</option><option>Exercise</option><option>LWA offer</option><option>LWA business tool</option></select></div><div class="field"><label for="contentLibrary">Member library</label><select id="contentLibrary"><option value="offers">Offers & shop</option><option value="coaching">Coaching hub</option><option value="resources">Resource vault</option><option value="workbooks">Workbooks & tools</option><option value="lwa">LWA Business</option><option value="stories">Story library</option><option value="philosophy">Philosophy library</option><option value="community">Community</option></select></div></div>
        <div class="field"><label for="contentTitle">Title</label><input id="contentTitle" required placeholder="Example: Creating income options"></div>
        <div class="field"><label for="contentDescription">Description</label><textarea id="contentDescription" required placeholder="What will members learn or receive?"></textarea></div>
        <div class="field-row"><div class="field"><label for="contentFormat">Format</label><select id="contentFormat"><option>Video</option><option>Audio</option><option>Article</option><option>PDF</option><option>Live session</option><option>Worksheet</option></select></div><div class="field"><label for="contentStatus">Status</label><select id="contentStatus"><option>Published</option><option>Draft</option></select></div></div>
        <div class="field-row"><div class="field"><label for="contentPrice">Display price</label><input id="contentPrice" placeholder="Example: $97 or $997"></div><div class="field"><label for="paymentUrl">Payment or booking link</label><input id="paymentUrl" type="url" placeholder="https://buy.stripe.com/..."></div></div>
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
      price: document.querySelector("#contentPrice").value.trim(), payment_url: document.querySelector("#paymentUrl").value.trim(),
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
  document.querySelector("#contentType").value=item.type; document.querySelector("#contentLibrary").value=item.library; document.querySelector("#contentTitle").value=item.title; document.querySelector("#contentDescription").value=item.description; document.querySelector("#contentFormat").value=item.format; document.querySelector("#contentStatus").value=item.status; document.querySelector("#contentPrice").value=item.price||""; document.querySelector("#paymentUrl").value=item.payment_url||""; document.querySelector("#editorTitle").textContent="Edit content"; window.scrollTo({top:0,behavior:"smooth"});
}
async function deleteContent(id) { adminContent = adminContent.filter(item=>item.id!==id); saveAdminContent(); if(getCloudConfig()) { try{await removeContent(id);}catch(error){showToast(`Deleted locally. Cloud: ${error.message}`);} } window.refreshAdminList(); showToast("Content deleted"); }
function saveAdminContent() { localStorage.setItem("oyo-admin-content", JSON.stringify(adminContent)); }
async function openPublishedContent(id) { const item=adminContent.find(entry=>entry.id===id); if(!item)return; let fileLink=""; if(item.file_url&&getSession())try{fileLink=await createFileLink(item.file_url);}catch(error){showToast(error.message);} panels["published"]=[`${item.type.toUpperCase()} · ${item.format.toUpperCase()}`,item.title,`${item.price?`<span class="price-tag">${item.price}</span>`:""}<p>${item.description}</p>${item.payment_url?`<a class="primary-button purchase-button" href="${item.payment_url}" target="_blank" rel="noopener">Purchase or book securely →</a>`:""}${item.fileName?`<p><strong>Attached:</strong> ${item.fileName}</p>`:""}${fileLink?`<p><a href="${fileLink}" target="_blank">Open attached file →</a></p>`:item.file_url?`<p>Sign in to open this private attachment.</p>`:""}`]; openPanel("published"); }
async function syncFromCloud(){ if(!getCloudConfig())return; const remote=await fetchContent(); if(Array.isArray(remote)){const byId=new Map(adminContent.map(item=>[String(item.id),item]));remote.forEach(item=>byId.set(String(item.id),item));adminContent=[...byId.values()];saveAdminContent();} }
async function syncQuestionsFromCloud(){ if(!getCloudConfig()||!getSession())return; const remote=await fetchQuestions(); if(Array.isArray(remote)&&remote.length){assessmentQuestions=remote;saveQuestions();} }

panels["generic-card"] = ["OWN YOUR OPTIONS", "Your next choice", "<p>This lesson is ready for your full coaching content, video, audio, worksheets, and member reflections.</p><p><strong>The next build step:</strong> connect your real program material and member accounts.</p>"];
panels["assessment-start"] = ["OPTIONS ASSESSMENT", "Let’s see where you are", "<p>Answer a focused set of questions across responsibility, financial freedom, health, relationships, growth, and purpose.</p><ul class='modal-list'><li>About 8 minutes</li><li>Personalized options score</li><li>Recommended next steps</li></ul>"];

function openPanel(key) {
  const panel = panels[key];
  if (!panel) return;
  modalEyebrow.textContent = panel[0];
  modalTitle.textContent = panel[1];
  modalContent.innerHTML = `${panel[2]}<button class="outline-button wide save-for-later" type="button">Save for later ＋</button>`;
  modalContent.querySelector(".save-for-later").addEventListener("click",()=>saveItem(panel[1],panel[0]));
  modalAction.textContent = key==="reflection" ? "Save reflection ✓" : "Save to My Progress ✓";
  modalAction.dataset.panelKey=key;
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
  const note=modalContent.querySelector("textarea")?.value.trim()||"";
  if(modalAction.dataset.panelKey==="reflection" && note) {
    memberProgress.reflections.unshift({id:Date.now(),title:"Weekly reflection",type:"Reflection",note});
    saveProgress();
  } else {
    completeItem(modalTitle.textContent,modalEyebrow.textContent,note);
  }
  closePanel();
  showToast("Saved to My Progress");
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
    const currentName=session.user.user_metadata?.name||"";
    accountState.innerHTML=`<p class="account-note">Signed in securely as <strong>${session.user.email}</strong>. Your progress and member access can now follow you across devices.</p>${isAdmin()?'<p class="account-success">Administrator access is active.</p>':'<p class="account-note">Member access is active.</p>'}<form class="account-form" id="profileNameForm"><div class="field"><label for="profileName">Display name</label><input id="profileName" type="text" autocomplete="name" value="${escapeAttribute(currentName)}" placeholder="Enter the name shown in your app" required></div><button class="primary-button" type="submit">Save my name <span>→</span></button></form><button class="outline-button wide" id="signOutButton">Sign out</button>`;
    document.querySelector("#accountTitle").textContent="Your member account";
    document.querySelector("#profileNameForm").addEventListener("submit",async event=>{event.preventDefault();const name=document.querySelector("#profileName").value.trim();if(!name)return;try{await updateUserName(name);updateMemberIdentity();showToast("Name and initials updated");renderAccount();}catch(error){showToast(error.message);}});
    document.querySelector("#signOutButton").addEventListener("click",()=>{signOut();updateAccess();updateMemberIdentity();accountBackdrop.hidden=true;showToast("Signed out");renderView("home");});
  } else {
    accountState.innerHTML=`<p class="account-note">Sign in to access your coaching from any device.</p><div id="accountMessage"></div><form class="account-form" id="signInForm"><div class="field"><label for="accountName">Your name</label><input id="accountName" type="text" autocomplete="name" placeholder="Needed only when creating an account"></div><div class="field"><label for="accountEmail">Email</label><input id="accountEmail" type="email" autocomplete="email" required></div><div class="field"><label for="accountPassword">Password</label><input id="accountPassword" type="password" autocomplete="current-password" minlength="6" required></div><button class="primary-button" type="submit">Sign in <span>→</span></button><button class="text-button" id="createAccount" type="button">Create a new member account</button></form>`;
    document.querySelector("#accountTitle").textContent="Sign in to your options";
    document.querySelector("#signInForm").addEventListener("submit",async event=>{event.preventDefault();setAccountMessage("Signing in…");try{await signIn(document.querySelector("#accountEmail").value,document.querySelector("#accountPassword").value);await refreshUser();updateAccess();updateMemberIdentity();showToast("Welcome back");renderAccount();}catch(error){setAccountMessage(friendlyAuthError(error.message),true);}});
    document.querySelector("#createAccount").addEventListener("click",async()=>{const name=document.querySelector("#accountName").value.trim(),email=document.querySelector("#accountEmail").value,password=document.querySelector("#accountPassword").value;if(!name)return setAccountMessage("Enter your name first.",true);if(!email||!password)return setAccountMessage("Enter your email and password first.",true);setAccountMessage("Creating your account…");try{await signUp(email,password,name);setAccountMessage("Account created. Check your email and confirm it before signing in.");}catch(error){setAccountMessage(friendlyAuthError(error.message),true);}});
  }
}
function setAccountMessage(message,isError=false){const area=document.querySelector("#accountMessage");if(area){area.className=isError?"account-error":"account-success";area.textContent=message;}}
function friendlyAuthError(message){if(message.toLowerCase().includes("invalid login"))return "The email or password is incorrect, or your email has not been confirmed yet.";if(message.toLowerCase().includes("email not confirmed"))return "Please confirm your email using the message Supabase sent you, then sign in.";return message;}
function updateAccess(){document.querySelectorAll(".admin-only").forEach(link=>link.hidden=!isAdmin());}
function escapeAttribute(value){return String(value).replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;");}
function updateMemberIdentity(){const session=getSession(),savedName=session?.user?.user_metadata?.name?.trim()||"",emailName=session?.user?.email?.split("@")[0]?.replace(/[._-]+/g," ")||"",name=savedName||emailName;const initials=name?name.split(/\s+/).filter(Boolean).slice(0,2).map(part=>part[0]).join("").toUpperCase():"YO";welcomeHeading.textContent=session?.user?`Welcome, ${name||"member"}.`:"Your journey starts here.";sidebarName.textContent=session?.user?(name||"Own Your Options member"):"Your account";sidebarRole.textContent=isAdmin()?"Administrator":"Own Your Options member";sidebarAvatar.textContent=initials;accountButton.textContent=initials;}
function openAccount(){renderAccount();accountBackdrop.hidden=false;document.body.style.overflow="hidden";}
accountButton.addEventListener("click",openAccount);
sidebarAccountButton.addEventListener("click",openAccount);
accountClose.addEventListener("click",()=>accountBackdrop.hidden=true);
accountBackdrop.addEventListener("click",event=>{if(event.target===accountBackdrop){accountBackdrop.hidden=true;document.body.style.overflow="";}});
accountClose.addEventListener("click",()=>document.body.style.overflow="");
updateAccess();
updateMemberIdentity();
if(getSession()) refreshUser().then(()=>{updateAccess();updateMemberIdentity();}).catch(()=>{signOut();updateAccess();updateMemberIdentity();});
if(getCloudConfig()) { syncFromCloud().catch(()=>{}); syncQuestionsFromCloud().catch(()=>{}); }

function showMemberApp(view="home") {
  landingPage.hidden=true;appShell.hidden=false;
  document.querySelectorAll(".nav-link").forEach(link=>link.classList.toggle("active",link.dataset.view===view));
  renderView(view);window.scrollTo({top:0});
}
function showLanding(){appShell.hidden=true;landingPage.hidden=false;window.scrollTo({top:0});}
document.querySelector("#enterApp").addEventListener("click",()=>showMemberApp("home"));
document.querySelectorAll(".landing-enter").forEach(button=>button.addEventListener("click",()=>showMemberApp("coaching")));
document.querySelectorAll(".landing-offer-link").forEach(button=>button.addEventListener("click",()=>showMemberApp("offers")));
document.querySelector("#openLwa").addEventListener("click",()=>showMemberApp("lwa"));
document.querySelector("#landingSignIn").addEventListener("click",()=>{showMemberApp("home");openAccount();});
document.querySelector(".brand").addEventListener("click",event=>{event.preventDefault();showLanding();});
