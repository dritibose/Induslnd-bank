/* =========================================================
   INDUSIND INSURE — APPLICATION LOGIC
   ========================================================= */
(function(){
"use strict";

/* ---------------------------------------------------------
   MOCK DATA
   --------------------------------------------------------- */
const INSURERS = {
  "IndusInd Secure":  {color:"#5B2EFF", initials:"IS"},
  "Apollo Munich":    {color:"#0F9D63", initials:"AM"},
  "Star Health":      {color:"#2563EB", initials:"SH"},
  "HDFC Ergo":        {color:"#D0342C", initials:"HE"},
  "Care Health":      {color:"#B5730A", initials:"CH"},
  "Niva Bupa":        {color:"#7B54FF", initials:"NB"}
};

const POLICIES = [
  {id:"p1", name:"Family Health Optima Plus", insurer:"IndusInd Secure", premium:28450, coverage:1500000, age:"18-35", family:true, critical:true, cashless:true, rating:4.6, reviews:2140, waiting:"30 days", roomRent:"No limit", icu:"No limit", claimTime:"3–5 days",
    hospitals:8400, pros:["No room-rent capping","Covers pre-existing after 2 yrs","Free annual health checkup","Restoration benefit x2"],
    cons:["5% co-pay above age 60","Modern treatments capped at ₹2L"],
    ai:"This plan suits families wanting broad room-rent freedom and fast claim turnaround. The 2-year pre-existing waiting period is shorter than most competitors, making it a strong pick if any family member has a manageable condition like hypertension.",
    breakdown:{base:19200, gst:3456, riders:4200, addons:1594}},
  {id:"p2", name:"Comprehensive Shield 15L", insurer:"Apollo Munich", premium:24900, coverage:1500000, age:"18-35", family:true, critical:false, cashless:true, rating:4.3, reviews:1560, waiting:"24 months", roomRent:"₹8,000/day cap", icu:"No limit", claimTime:"5–7 days",
    hospitals:6200, pros:["Lower premium for same cover","Maternity benefit included","No claim bonus up to 50%"],
    cons:["Room rent capped, may mean co-pay","No critical illness rider bundled"],
    ai:"A budget-friendly option if you're comfortable with a room-rent cap. The maternity benefit is a standout if you're planning a family, but the capped ICU support means higher out-of-pocket cost at premium hospitals.",
    breakdown:{base:17800, gst:3204, riders:2400, addons:1496}},
  {id:"p3", name:"Health Assure Gold", insurer:"Star Health", premium:32100, coverage:2000000, age:"36-50", family:true, critical:true, cashless:true, rating:4.5, reviews:3420, waiting:"36 months", roomRent:"No limit", icu:"No limit", claimTime:"2–4 days",
    hospitals:9200, pros:["Highest coverage in this range","Largest hospital network","Fastest average claim settlement"],
    cons:["Higher premium","3-yr wait for pre-existing conditions"],
    ai:"Best suited if hospital-network breadth and claim speed matter most to you — Star Health settles claims fastest among compared plans. The trade-off is a longer pre-existing condition wait and a higher premium.",
    breakdown:{base:22500, gst:4050, riders:4000, addons:1550}},
  {id:"p4", name:"Smart Secure Individual", insurer:"HDFC Ergo", premium:14200, coverage:750000, age:"18-35", family:false, critical:false, cashless:true, rating:4.1, reviews:980, waiting:"24 months", roomRent:"₹5,000/day cap", icu:"₹10,000/day cap", claimTime:"5–8 days",
    hospitals:5100, pros:["Lowest premium here","Good for single young professionals","Free teleconsultations"],
    cons:["Lower total coverage","ICU cap can mean big co-pay"],
    ai:"A lean, affordable entry policy for a healthy individual in their 20s or early 30s. Not ideal as your only cover once you start a family, given the lower total coverage and ICU cap.",
    breakdown:{base:9800, gst:1764, riders:1600, addons:1036}},
  {id:"p5", name:"CritiCare Complete", insurer:"Care Health", premium:19800, coverage:1000000, age:"36-50", family:true, critical:true, cashless:true, rating:4.4, reviews:1310, waiting:"30 days", roomRent:"No limit", icu:"No limit", claimTime:"4–6 days",
    hospitals:7300, pros:["Critical illness lump sum payout","Short 30-day general waiting period","Covers alternative treatments (AYUSH)"],
    cons:["Mid-tier hospital network","Sub-limits on cataract & joint surgery"],
    ai:"Strong choice if critical illness protection is your priority — the lump-sum payout structure means funds arrive fast, independent of actual treatment cost, which many families find reassuring.",
    breakdown:{base:14600, gst:2628, riders:1800, addons:772}},
  {id:"p6", name:"Reassure 2.0 Family Floater", insurer:"Niva Bupa", premium:26700, coverage:1500000, age:"51-65", family:true, critical:false, cashless:true, rating:4.2, reviews:2050, waiting:"36 months", roomRent:"No limit", icu:"No limit", claimTime:"3–6 days",
    hospitals:8700, pros:["Unlimited reinstatement of cover","Good for senior family members","Home healthcare benefit"],
    cons:["Higher premium load after age 55","Co-pay applies for members above 60"],
    ai:"Designed with older family members in mind — unlimited reinstatement means the cover refills itself within the same year if exhausted, which matters more as claim frequency rises with age.",
    breakdown:{base:16900, gst:3042, riders:5100, addons:1658}}
];

const HOSPITALS = [
  {id:"h1", name:"Apollo Hospitals, Vaishali", distance:1.2, rating:4.6, emergency:true, cashless:true, speciality:"Multi-speciality · 24/7 ER", x:34, y:38},
  {id:"h2", name:"Fortis Escorts Heart Institute", distance:2.8, rating:4.7, emergency:true, cashless:true, speciality:"Cardiac care", x:62, y:22},
  {id:"h3", name:"Max Super Speciality, Patparganj", distance:3.5, rating:4.4, emergency:true, cashless:true, speciality:"Multi-speciality", x:20, y:64},
  {id:"h4", name:"Manipal Hospital, Ghaziabad", distance:4.1, rating:4.3, emergency:false, cashless:true, speciality:"Ortho · Neuro", x:75, y:58},
  {id:"h5", name:"Yashoda Super Speciality", distance:5.6, rating:4.5, emergency:true, cashless:false, speciality:"Multi-speciality · 24/7 ER", x:48, y:75},
  {id:"h6", name:"Columbia Asia, Indirapuram", distance:2.1, rating:4.2, emergency:false, cashless:true, speciality:"General · Maternity", x:55, y:45}
];

const CLAIMS_HISTORY = [
  {id:"CLM-2026-00417", type:"Hospitalisation", date:"16 Jul 2026", amount:86400, status:"In review", statusType:"warning"},
  {id:"CLM-2026-00312", type:"Day-care surgery", date:"02 Jun 2026", amount:42100, status:"Approved", statusType:"success"},
  {id:"CLM-2026-00198", type:"OPD consultation", date:"11 Apr 2026", amount:2800, status:"Paid", statusType:"success"},
  {id:"CLM-2025-00990", type:"Hospitalisation", date:"29 Dec 2025", amount:154200, status:"Paid", statusType:"success"},
  {id:"CLM-2025-00874", type:"Pharmacy", date:"14 Nov 2025", amount:3650, status:"Rejected", statusType:"danger"}
];

const FAMILY = [
  {name:"Priya Sharma", rel:"Self", age:34, cover:"Included"},
  {name:"Rohan Sharma", rel:"Spouse", age:36, cover:"Included"},
  {name:"Aanya Sharma", rel:"Daughter", age:6, cover:"Included"},
  {name:"Kamla Sharma", rel:"Mother", age:64, cover:"Add for ₹8,200/yr"}
];

const MED_HISTORY = [
  {icon:"🩸", name:"Hypertension", note:"Diagnosed 2022 · Managed with medication"},
  {icon:"💉", name:"COVID-19 vaccination", note:"3 doses · Last: Feb 2024"},
  {icon:"🦴", name:"Knee surgery (Rohan)", note:"May 2023 · Fully recovered"}
];

const INS_HISTORY = [
  {icon:"📄", name:"Family Health Optima Plus", note:"Active since Sep 2024"},
  {icon:"📄", name:"Basic Individual Cover", note:"Sep 2021 – Sep 2024 · Lapsed"}
];

const DOCUMENTS = [
  {icon:"🪪", name:"Aadhaar Card", meta:"Verified · PDF"},
  {icon:"📋", name:"Policy Document", meta:"IB-HL-2024-88231"},
  {icon:"🧾", name:"Hospital Invoice", meta:"Apollo · 16 Jul 2026"},
  {icon:"💊", name:"Prescription", meta:"Dr. Mehta · 15 Jul 2026"},
  {icon:"🩺", name:"Discharge Summary", meta:"Pending upload"},
  {icon:"🆔", name:"PAN Card", meta:"Verified · JPG"},
  {icon:"📑", name:"KYC Form", meta:"Verified · PDF"},
  {icon:"🏥", name:"Health Checkup Report", meta:"Mar 2026"}
];

const NOTIFICATIONS = {
  Claims:[
    {icon:"📄", title:"Document missing", body:"Upload discharge certificate for CLM-2026-00417", time:"2h ago", unread:true},
    {icon:"✅", title:"Claim approved", body:"CLM-2026-00312 approved for ₹42,100", time:"1d ago", unread:false}
  ],
  Renewals:[
    {icon:"⏰", title:"Renewal due in 58 days", body:"Family Health Optima Plus expires 14 Sep 2026", time:"3h ago", unread:true}
  ],
  Offers:[
    {icon:"🎁", title:"12% early-bird discount", body:"Renew before 31 Jul to lock in savings", time:"1d ago", unread:false},
    {icon:"💳", title:"Reward points expiring", body:"480 points expire this month", time:"4d ago", unread:false}
  ],
  Hospitals:[
    {icon:"🏥", title:"New cashless hospital added", body:"Columbia Asia, Indirapuram now cashless", time:"6d ago", unread:false}
  ],
  "AI Suggestions":[
    {icon:"✨", title:"Coverage gap detected", body:"Consider a Critical Illness rider — see Home", time:"5h ago", unread:true}
  ]
};

const OFFERS = [
  {title:"12% early-bird renewal", body:"Renew before 31 Jul and lock the discount for next year.", cta:"Renew now", action:"renewals"},
  {title:"Free annual health checkup", body:"Redeem your complimentary checkup at 400+ partner labs.", cta:"Book now", action:"checkup"},
  {title:"Refer & earn ₹500", body:"Invite a friend to IndusInd Insure, both of you earn reward points.", cta:"Refer a friend", action:"refer"}
];

const AI_RESPONSES = [
  {kw:["co-pay","copay"], text:"Co-pay is the percentage of a claim you pay yourself. On your Family Health Optima Plus, co-pay only applies above age 60 — at 5% of the claim amount. Members below 60 pay no co-pay."},
  {kw:["premium","estimate","cost"], text:"Your current annual premium is ₹28,450 for ₹15,00,000 family cover. Adding a Critical Illness rider would take it to about ₹32,650/year."},
  {kw:["claim","status","claim help"], text:"Your active claim CLM-2026-00417 is in Medical Review. It's missing a discharge certificate — upload it from the Claims page and review typically resumes within a day."},
  {kw:["compare","which policy","suits me"], text:"Based on your family size and ₹15L target cover, Family Health Optima Plus and Health Assure Gold are your closest matches. Optima Plus has a shorter pre-existing waiting period; Health Assure Gold has a larger hospital network."},
  {kw:["emergency"], text:"In an emergency, tap the SOS button in the sidebar (or bottom nav on mobile). It alerts your emergency contacts, shares live location, and shows the nearest cashless hospital."},
  {kw:["hello","hi ","hey"], text:"Hi Priya! I can help with policy questions, claims, comparisons, or premium estimates. What would you like to know?"}
];

/* ---------------------------------------------------------
   STATE
   --------------------------------------------------------- */
const state = {
  onboardingSlide:0,
  authPane:"password",
  otpDigits:"",
  compareList:[],
  filters:{price:60000, coverage:0, age:"any", family:false, critical:false, cashless:false, sort:"value", query:""},
  hospitalFilter:"all",
  hospitalQuery:"",
  currentPolicyId:null,
  dark:false,
  aiChatOpened:false
};

/* ---------------------------------------------------------
   UTILITIES
   --------------------------------------------------------- */
function $(sel, ctx){ return (ctx||document).querySelector(sel); }
function $all(sel, ctx){ return Array.from((ctx||document).querySelectorAll(sel)); }
function fmtINR(n){ return "₹" + Number(n).toLocaleString("en-IN"); }
function el(html){ const t=document.createElement("template"); t.innerHTML=html.trim(); return t.content.firstElementChild; }

function toast(msg, type){
  const host = $("#toastHost");
  const t = el(`<div class="toast ${type||""}">${msg}</div>`);
  host.appendChild(t);
  setTimeout(()=> t.remove(), 3000);
}

function openModal(id){ $("#"+id).classList.add("active"); document.body.style.overflow="hidden"; }
function closeModal(id){ $("#"+id).classList.remove("active"); document.body.style.overflow=""; }

/* ---------------------------------------------------------
   GLOBAL CLICK DELEGATION
   --------------------------------------------------------- */
document.addEventListener("click", function(e){
  const t = e.target.closest("[data-action]");
  if(!t) return;
  const action = t.dataset.action;
  const handlers = {
    "skip-onboarding": ()=> enterAuth(),
    "onboarding-next": onboardingNext,
    "toggle-password": ()=> togglePassword(t.dataset.target),
    "open-forgot": ()=> openModal("forgotModal"),
    "close-modal": ()=> { closeModal(t.dataset.modal); if(t.dataset.modal==="sosModal" && t.dataset.nav){} },
    "google-login": ()=> simulateGoogleLogin(),
    "switch-to-otp": ()=> switchAuthPane("otp"),
    "switch-to-password": ()=> switchAuthPane("password"),
    "switch-to-signup": ()=> switchAuthPane("signup"),
    "send-otp": sendOtp,
    "resend-otp": ()=> { toast("OTP resent"); },
    "verify-otp": verifyOtp,
    "send-reset-link": sendResetLink,
    "logout": doLogout,
    "go-nav": ()=> { navigateTo(t.dataset.nav); if(t.dataset.sub==="compare") setPolicyTab("compare"); if(t.dataset.modal) closeModal(t.dataset.modal); },
    "open-sos": ()=> openModal("sosModal"),
    "trigger-sos": triggerSos,
    "call-ambulance": ()=> toast("Dialing 108 — Ambulance…", "success"),
    "open-search": ()=> { openModal("searchModal"); $("#globalSearchInput").focus(); renderGlobalSearch(""); },
    "toggle-dark": toggleDark,
    "open-notifications": openNotifications,
    "close-notifications": closeNotifications,
    "go-profile": ()=> navigateTo("profile"),
    "go-checkup": ()=> toast("Checkup booking request sent — a lab partner will confirm shortly", "success"),
    "view-policy": ()=> openPolicyDetail(t.dataset.id),
    "download-card": ()=> toast("Digital insurance card downloaded", "success"),
    "toggle-filters": ()=> $("#filtersPanel").classList.toggle("open"),
    "reset-filters": resetFilters,
    "set-policy-tab": ()=> setPolicyTab(t.dataset.tab),
    "toggle-ai-chat": toggleAiChat,
    "start-claim": ()=> openTool("claim-wizard"),
    "open-tool": ()=> openTool(t.dataset.tool),
    "open-renew-flow": openRenewFlow,
    "edit-profile": ()=> toast("Profile editing opened"),
    "toast": ()=> toast(t.dataset.toast||"Done"),
    "add-compare": ()=> toggleCompare(t.dataset.id, t),
    "book-hospital": ()=> toast("Appointment request sent to "+t.dataset.name, "success"),
    "directions-hospital": ()=> toast("Opening directions to "+t.dataset.name)
  };
  if(handlers[action]) handlers[action]();
});

/* Close modal on overlay click */
$all(".modal-overlay").forEach(ov=>{
  ov.addEventListener("click", e=>{ if(e.target===ov) closeModal(ov.id); });
});
$("#notifPanelOverlay").addEventListener("click", e=>{ if(e.target===$("#notifPanelOverlay")) closeNotifications(); });
document.addEventListener("keydown", e=>{
  if(e.key==="Escape"){ $all(".modal-overlay.active").forEach(m=>closeModal(m.id)); closeNotifications(); }
  if((e.metaKey||e.ctrlKey) && e.key.toLowerCase()==="k"){ e.preventDefault(); openModal("searchModal"); $("#globalSearchInput").focus(); renderGlobalSearch(""); }
});

/* ---------------------------------------------------------
   ONBOARDING
   --------------------------------------------------------- */
function onboardingNext(){
  const slides = $all(".onb-slide");
  if(state.onboardingSlide < slides.length-1){
    slides[state.onboardingSlide].classList.remove("active");
    state.onboardingSlide++;
    slides[state.onboardingSlide].classList.add("active");
    $all(".onb-dot").forEach((d,i)=> d.classList.toggle("active", i===state.onboardingSlide));
    if(state.onboardingSlide === slides.length-1){
      $("#onbNextBtn").querySelector.bind($("#onbNextBtn"));
      $("#onbNextBtn").textContent = "Get started";
    }
  } else {
    enterAuth();
  }
}
function enterAuth(){
  $("#view-onboarding").classList.remove("active");
  $("#view-login").classList.add("active");
}

/* ---------------------------------------------------------
   AUTH
   --------------------------------------------------------- */
function switchAuthPane(pane){
  $all(".auth-pane").forEach(p=> p.classList.toggle("active", p.dataset.pane===pane));
  state.authPane = pane;
  if(pane==="otp"){ $("#otpPhoneStep").hidden=false; $("#otpCodeStep").hidden=true; }
}
function togglePassword(id){
  const input = document.getElementById(id);
  const btn = event.target;
  if(input.type==="password"){ input.type="text"; btn.textContent="Hide"; }
  else { input.type="password"; btn.textContent="Show"; }
}
function validateEmail(v){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }

$("#loginForm").addEventListener("submit", function(e){
  e.preventDefault();
  const email = $("#loginEmail").value.trim();
  const pass = $("#loginPassword").value;
  let ok = true;
  $("#err-loginEmail").textContent=""; $("#loginEmail").classList.remove("invalid");
  $("#err-loginPassword").textContent=""; $("#loginPassword").classList.remove("invalid");

  if(!email || !validateEmail(email)){
    $("#err-loginEmail").textContent = "Enter a valid email address";
    $("#loginEmail").classList.add("invalid"); ok=false;
  }
  if(!pass || pass.length < 4){
    $("#err-loginPassword").textContent = "Enter your password";
    $("#loginPassword").classList.add("invalid"); ok=false;
  }
  if(!ok) return;

  setBtnLoading("loginSubmitBtn", true);
  setTimeout(()=>{
    setBtnLoading("loginSubmitBtn", false);
    showAuthSuccess();
  }, 1100);
});

function simulateGoogleLogin(){
  toast("Connecting to Google…");
  setTimeout(showAuthSuccess, 900);
}

function sendOtp(){
  const phone = $("#otpPhone").value.trim();
  $("#err-otpPhone").textContent="";
  if(!/^\d{10}$/.test(phone)){
    $("#err-otpPhone").textContent = "Enter a valid 10-digit mobile number";
    $("#otpPhone").classList.add("invalid");
    return;
  }
  $("#otpPhone").classList.remove("invalid");
  $("#otpPhoneStep").hidden = true;
  $("#otpCodeStep").hidden = false;
  $("#otpSubText").textContent = `Code sent to +91 ${phone.slice(0,5)} ${phone.slice(5)}`;
  const boxes = $all(".otp-box");
  boxes[0].focus();
  toast("OTP sent via SMS", "success");
}
$all(".otp-box").forEach((box,i,arr)=>{
  box.addEventListener("input", ()=>{
    box.value = box.value.replace(/\D/g,"");
    if(box.value && arr[i+1]) arr[i+1].focus();
  });
  box.addEventListener("keydown", e=>{
    if(e.key==="Backspace" && !box.value && arr[i-1]) arr[i-1].focus();
  });
});
function verifyOtp(){
  const code = $all(".otp-box").map(b=>b.value).join("");
  if(code.length<6){ toast("Enter the full 6-digit code","error"); return; }
  if(code !== "445512"){
    $all(".otp-box").forEach(b=> b.classList.add("invalid"));
    toast("Incorrect code — try the demo code 445512", "error");
    return;
  }
  setBtnLoading("verifyOtpBtn", true);
  setTimeout(()=>{ setBtnLoading("verifyOtpBtn", false); showAuthSuccess(); }, 900);
}

$("#signupForm").addEventListener("submit", function(e){
  e.preventDefault();
  const name = $("#suName").value.trim();
  const email = $("#suEmail").value.trim();
  const pass = $("#suPassword").value;
  if(!name || !validateEmail(email) || pass.length<8){
    toast("Please fill all fields correctly (password ≥ 8 chars)", "error");
    return;
  }
  toast("Account created", "success");
  setTimeout(showAuthSuccess, 700);
});

function setBtnLoading(id, loading){
  const btn = document.getElementById(id);
  const label = btn.querySelector(".btn-label");
  const spinner = btn.querySelector(".btn-spinner");
  btn.disabled = loading;
  if(label) label.style.opacity = loading ? "0.5" : "1";
  if(spinner) spinner.hidden = !loading;
}

function showAuthSuccess(){
  $all(".auth-pane").forEach(p=>p.classList.remove("active"));
  $('.auth-pane[data-pane="success"]').classList.add("active");
  setTimeout(enterApp, 1400);
}

function sendResetLink(){
  const email = $("#forgotEmail").value.trim();
  if(!validateEmail(email)){ toast("Enter a valid email", "error"); return; }
  $("#forgotStep1").hidden = true;
  $("#forgotStep2").hidden = false;
}

function doLogout(){
  $("#app-shell").classList.remove("active");
  $("#view-login").classList.add("active");
  switchAuthPane("password");
  $all(".auth-pane").forEach(p=>p.classList.toggle("active", p.dataset.pane==="password"));
  toast("Logged out");
}

/* ---------------------------------------------------------
   ENTER APP
   --------------------------------------------------------- */
function enterApp(){
  $("#view-login").classList.remove("active");
  $("#app-shell").classList.add("active");
  renderHome();
  renderPolicyGrid();
  renderHospitals();
  renderClaimsHistory();
  renderDocuments();
  renderFamily();
  renderMedHistory();
  renderInsHistory();
  renderOffers();
  renderNotifications();
  initAiChat();
  startCountdown();
}

/* ---------------------------------------------------------
   NAVIGATION
   --------------------------------------------------------- */
function navigateTo(name){
  $all(".page").forEach(p=> p.classList.toggle("active", p.dataset.page===name));
  $all(".nav-item").forEach(n=> n.classList.toggle("active", n.dataset.nav===name));
  $all(".bn-item").forEach(n=> n.classList.toggle("active", n.dataset.nav===name));
  $("#content").scrollTop = 0;
  window.scrollTo({top:0, behavior:"smooth"});
}
$all(".nav-item, .bn-item").forEach(btn=>{
  btn.addEventListener("click", ()=> navigateTo(btn.dataset.nav));
});

/* ---------------------------------------------------------
   HOME
   --------------------------------------------------------- */
function renderHome(){
  const claimsList = $("#homeClaimsList");
  claimsList.innerHTML = CLAIMS_HISTORY.slice(0,3).map(c=>`
    <div class="mini-row" data-action="go-nav" data-nav="claims">
      <div class="mini-row-icon">📄</div>
      <div class="mini-row-body"><h5>${c.type}</h5><p>${c.id} · ${c.date}</p></div>
      <div class="mini-row-side"><span class="amt">${fmtINR(c.amount)}</span><span class="chip chip-${c.statusType}">${c.status}</span></div>
    </div>`).join("");

  const hospList = $("#homeHospitalsList");
  hospList.innerHTML = HOSPITALS.slice(0,3).map(h=>`
    <div class="mini-row" data-action="go-nav" data-nav="hospitals">
      <div class="mini-row-icon">🏥</div>
      <div class="mini-row-body"><h5>${h.name}</h5><p>${h.speciality}</p></div>
      <div class="mini-row-side"><span class="amt">${h.distance} km</span><span class="chip chip-neutral">★ ${h.rating}</span></div>
    </div>`).join("");
}
function renderOffers(){
  $("#offerRow").innerHTML = OFFERS.map(o=>`
    <div class="offer-card">
      <h5>${o.title}</h5><p>${o.body}</p>
      <button data-action="go-nav" data-nav="${o.action==='checkup'?'home':(o.action==='refer'?'profile':'renewals')}">${o.cta}</button>
    </div>`).join("");
}

/* ---------------------------------------------------------
   POLICIES — search / filter / sort / grid
   --------------------------------------------------------- */
function setPolicyTab(tab){
  $all(".seg-btn[data-policy-tab]").forEach(b=> b.classList.toggle("active", b.dataset.policyTab===tab));
  $all("[data-policy-panel]").forEach(p=> p.hidden = p.dataset.policyPanel!==tab);
  navigateTo("policies");
  if(tab==="compare") renderCompareTable();
}
$all(".seg-btn[data-policy-tab]").forEach(b=> b.addEventListener("click", ()=> setPolicyTab(b.dataset.policyTab)));

function getFilteredPolicies(){
  let list = POLICIES.filter(p=>{
    if(state.filters.query && !(p.name.toLowerCase().includes(state.filters.query) || p.insurer.toLowerCase().includes(state.filters.query))) return false;
    if(p.premium > state.filters.price) return false;
    if(p.coverage < state.filters.coverage) return false;
    if(state.filters.age!=="any" && p.age!==state.filters.age) return false;
    if(state.filters.family && !p.family) return false;
    if(state.filters.critical && !p.critical) return false;
    if(state.filters.cashless && !p.cashless) return false;
    return true;
  });
  if(state.filters.sort==="price-asc") list.sort((a,b)=>a.premium-b.premium);
  else if(state.filters.sort==="coverage-desc") list.sort((a,b)=>b.coverage-a.coverage);
  else list.sort((a,b)=> (b.rating*b.coverage/b.premium) - (a.rating*a.coverage/a.premium));
  return list;
}

function renderPolicyGrid(){
  const list = getFilteredPolicies();
  const grid = $("#policyGrid");
  if(!list.length){
    grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1"><div class="empty-illustration">🔍</div><h3>No policies match your filters</h3><p>Try widening your price range or clearing a filter.</p><button class="btn-primary btn-sm" data-action="reset-filters">Reset filters</button></div>`;
    return;
  }
  const bestId = [...list].sort((a,b)=>(b.rating*b.coverage/b.premium)-(a.rating*a.coverage/a.premium))[0].id;
  grid.innerHTML = list.map(p=>{
    const ins = INSURERS[p.insurer];
    const inCompare = state.compareList.includes(p.id);
    return `
    <div class="policy-card" data-action="view-policy" data-id="${p.id}">
      ${p.id===bestId ? '<span class="best-value-badge">✨ Best value</span>' : ""}
      <div class="policy-card-top">
        <div class="insurer-badge" style="background:${ins.color}">${ins.initials}</div>
        <span class="chip chip-neutral">★ ${p.rating}</span>
      </div>
      <h4>${p.name}</h4>
      <p class="insurer-name">${p.insurer} · ${p.hospitals.toLocaleString("en-IN")}+ hospitals</p>
      <div class="policy-card-stats">
        <div class="pcs-row"><span>Coverage</span><span>${fmtINR(p.coverage)}</span></div>
        <div class="pcs-row"><span>Waiting period</span><span>${p.waiting}</span></div>
        <div class="pcs-row"><span>Claim time</span><span>${p.claimTime}</span></div>
      </div>
      <div class="policy-card-tags">
        ${p.family?'<span class="chip chip-info">Family floater</span>':''}
        ${p.critical?'<span class="chip chip-success">Critical illness</span>':''}
        ${p.cashless?'<span class="chip chip-neutral">Cashless</span>':''}
      </div>
      <div class="policy-card-price">
        <div class="price">${fmtINR(p.premium)}<small> /year</small></div>
      </div>
      <button class="btn-secondary btn-sm compare-add-btn" data-action="add-compare" data-id="${p.id}" onclick="event.stopPropagation()">
        ${inCompare ? "✓ Added to compare" : "+ Add to compare"}
      </button>
    </div>`;
  }).join("");
}

$("#policySearchInput").addEventListener("input", e=>{ state.filters.query = e.target.value.toLowerCase(); renderPolicyGrid(); });
$("#policySortSelect").addEventListener("change", e=>{ state.filters.sort = e.target.value; renderPolicyGrid(); });
$("#priceSlider").addEventListener("input", e=>{
  state.filters.price = Number(e.target.value);
  $("#priceSliderVal").textContent = fmtINR(e.target.value);
  renderPolicyGrid();
});
$("#coverageFilter").addEventListener("change", e=>{ state.filters.coverage = Number(e.target.value); renderPolicyGrid(); });
$("#ageFilter").addEventListener("change", e=>{ state.filters.age = e.target.value; renderPolicyGrid(); });
["fFamily","fCritical","fCashless"].forEach(id=>{
  document.getElementById(id).addEventListener("change", e=>{
    state.filters[id==="fFamily"?"family":id==="fCritical"?"critical":"cashless"] = e.target.checked;
    renderPolicyGrid();
  });
});
function resetFilters(){
  state.filters = {price:60000, coverage:0, age:"any", family:false, critical:false, cashless:false, sort:"value", query:""};
  $("#policySearchInput").value=""; $("#policySortSelect").value="value"; $("#priceSlider").value=60000;
  $("#priceSliderVal").textContent="₹60,000"; $("#coverageFilter").value="0"; $("#ageFilter").value="any";
  ["fFamily","fCritical","fCashless"].forEach(id=> document.getElementById(id).checked=false);
  renderPolicyGrid();
}

function toggleCompare(id, btn){
  const idx = state.compareList.indexOf(id);
  if(idx>-1){ state.compareList.splice(idx,1); }
  else {
    if(state.compareList.length>=3){ toast("You can compare up to 3 policies", "error"); return; }
    state.compareList.push(id);
  }
  $("#compareCount").textContent = state.compareList.length;
  renderPolicyGrid();
  if(state.compareList.length) toast(idx>-1 ? "Removed from comparison" : "Added to comparison", "success");
}

function renderCompareTable(){
  const wrap = $("#compareTableWrap");
  const empty = $("#compareEmpty");
  if(!state.compareList.length){ empty.hidden=false; wrap.hidden=true; return; }
  empty.hidden=true; wrap.hidden=false;
  const plans = state.compareList.map(id=> POLICIES.find(p=>p.id===id));
  const bestId = [...plans].sort((a,b)=>(b.rating*b.coverage/b.premium)-(a.rating*a.coverage/a.premium))[0].id;
  const rows = [
    ["Premium", p=>fmtINR(p.premium)+"/yr"],
    ["Coverage", p=>fmtINR(p.coverage)],
    ["Claim time", p=>p.claimTime],
    ["Waiting period", p=>p.waiting],
    ["Room rent", p=>p.roomRent],
    ["Hospital network", p=>p.hospitals.toLocaleString("en-IN")+"+"],
    ["Rating", p=>"★ "+p.rating+" ("+p.reviews.toLocaleString("en-IN")+")"],
  ];
  let html = `<table class="compare-table"><thead><tr><th>Plan</th>`;
  plans.forEach(p=> html += `<th>${p.name}${p.id===bestId?'<span class="ai-best-badge">AI Best Choice</span>':''}</th>`);
  html += `</tr></thead><tbody>`;
  rows.forEach(([label, fn])=>{
    const vals = plans.map(fn);
    const differ = new Set(vals).size>1;
    html += `<tr class="${differ?'compare-diff':''}"><td class="plan-col">${label}</td>${vals.map(v=>`<td>${v}</td>`).join("")}</tr>`;
  });
  html += `<tr><td class="plan-col">Pros</td>${plans.map(p=>`<td><ul style="margin:0;padding-left:16px;font-size:12.5px;">${p.pros.slice(0,2).map(x=>`<li>${x}</li>`).join("")}</ul></td>`).join("")}</tr>`;
  html += `<tr><td class="plan-col">Buy</td>${plans.map(p=>`<td><button class="btn-primary btn-sm" data-action="view-policy" data-id="${p.id}">View & buy</button></td>`).join("")}</tr>`;
  html += `</tbody></table>`;
  wrap.innerHTML = html;
}

/* ---------------------------------------------------------
   POLICY DETAIL
   --------------------------------------------------------- */
function openPolicyDetail(id){
  state.currentPolicyId = id;
  const p = POLICIES.find(x=>x.id===id);
  const ins = INSURERS[p.insurer];
  const total = p.breakdown.base+p.breakdown.gst+p.breakdown.riders+p.breakdown.addons;
  const seg = [
    {label:"Base premium", val:p.breakdown.base, color:"#5B2EFF"},
    {label:"GST (18%)", val:p.breakdown.gst, color:"#7B54FF"},
    {label:"Riders", val:p.breakdown.riders, color:"#B8A6FF"},
    {label:"Add-ons", val:p.breakdown.addons, color:"#E4E2EE"}
  ];
  let offset=0;
  const circumference = 2*Math.PI*54;
  const arcs = seg.map(s=>{
    const frac = s.val/total;
    const dash = frac*circumference;
    const arc = `<circle cx="70" cy="70" r="54" fill="none" stroke="${s.color}" stroke-width="20" stroke-dasharray="${dash} ${circumference-dash}" stroke-dashoffset="${-offset}" />`;
    offset += dash;
    return arc;
  }).join("");

  $("#policyDetailContent").innerHTML = `
    <div class="pd-hero">
      <div>
        <div class="insurer-badge" style="background:${ins.color}">${ins.initials}</div>
        <h1>${p.name}</h1>
        <p class="insurer-name">${p.insurer}</p>
        <div class="pd-rating">★★★★★ <b>${p.rating}</b> (${p.reviews.toLocaleString("en-IN")} reviews) · ${p.hospitals.toLocaleString("en-IN")}+ hospitals</div>
      </div>
      <div class="pd-hero-price">
        <div class="price">${fmtINR(p.premium)}</div>
        <small>per year</small>
        <div class="pd-hero-actions">
          <button class="btn-secondary btn-sm" data-action="add-compare" data-id="${p.id}">Compare</button>
          <button class="btn-primary btn-sm" data-action="toast" data-toast="Redirecting to secure payment…">Purchase</button>
        </div>
      </div>
    </div>

    <div class="pd-grid">
      <div>
        <div class="pd-section">
          <h3>Coverage details</h3>
          <div class="pd-detail-grid">
            <div class="pd-detail-row"><span>Total coverage</span><span>${fmtINR(p.coverage)}</span></div>
            <div class="pd-detail-row"><span>Room rent</span><span>${p.roomRent}</span></div>
            <div class="pd-detail-row"><span>ICU</span><span>${p.icu}</span></div>
            <div class="pd-detail-row"><span>Waiting period</span><span>${p.waiting}</span></div>
            <div class="pd-detail-row"><span>Critical illness</span><span>${p.critical?"Included":"Not included"}</span></div>
            <div class="pd-detail-row"><span>Cashless</span><span>${p.cashless?"Yes":"Reimbursement only"}</span></div>
          </div>
        </div>

        <div class="pd-section">
          <h3>Claim timeline</h3>
          <div class="pd-timeline">
            <div class="pd-timeline-item"><div class="pd-timeline-dot"></div><div><h5>Submit claim online or via app</h5><p>Upload bills, reports and ID within 48 hrs of discharge</p></div></div>
            <div class="pd-timeline-item"><div class="pd-timeline-dot"></div><div><h5>Document verification</h5><p>Typically completed same day</p></div></div>
            <div class="pd-timeline-item"><div class="pd-timeline-dot"></div><div><h5>Medical review</h5><p>1–2 business days</p></div></div>
            <div class="pd-timeline-item"><div class="pd-timeline-dot"></div><div><h5>Payout</h5><p>${p.claimTime} average, direct to bank account</p></div></div>
          </div>
        </div>

        <div class="pd-section">
          <h3>Advantages &amp; disadvantages</h3>
          <div class="pros-cons">
            <div><h4 style="color:var(--success-600)">✓ Advantages</h4><ul>${p.pros.map(x=>`<li>${x}</li>`).join("")}</ul></div>
            <div><h4 style="color:var(--danger-600)">✕ Disadvantages</h4><ul>${p.cons.map(x=>`<li>${x}</li>`).join("")}</ul></div>
          </div>
        </div>
      </div>

      <div>
        <div class="pd-section">
          <h3>Price breakdown</h3>
          <div class="pie-chart-wrap">
            <svg viewBox="0 0 140 140" width="140" height="140" style="transform:rotate(-90deg)">${arcs}</svg>
            <div class="pie-legend">
              ${seg.map(s=>`<div class="pie-legend-item"><span class="pie-legend-swatch" style="background:${s.color}"></span>${s.label}<span style="margin-left:auto;font-weight:700">${fmtINR(s.val)}</span></div>`).join("")}
            </div>
          </div>
        </div>

        <div class="pd-section">
          <h3>✨ AI summary</h3>
          <div class="ai-summary-box"><p>${p.ai}</p></div>
        </div>

        <div class="pd-section">
          <h3>Included services</h3>
          <div class="policy-card-tags">
            <span class="chip chip-info">Free health checkup</span>
            <span class="chip chip-info">Teleconsultation</span>
            <span class="chip chip-info">Ambulance cover</span>
            <span class="chip chip-info">AYUSH treatment</span>
            <span class="chip chip-info">No-claim bonus</span>
          </div>
        </div>
      </div>
    </div>
  `;
  navigateTo("policy-detail");
}

/* ---------------------------------------------------------
   HOSPITALS
   --------------------------------------------------------- */
function renderHospitals(){
  let list = HOSPITALS.filter(h=>{
    if(state.hospitalQuery && !(h.name.toLowerCase().includes(state.hospitalQuery)||h.speciality.toLowerCase().includes(state.hospitalQuery))) return false;
    if(state.hospitalFilter==="emergency" && !h.emergency) return false;
    if(state.hospitalFilter==="cashless" && !h.cashless) return false;
    return true;
  });
  $("#hospitalList").innerHTML = list.map(h=>`
    <div class="hospital-card">
      <div class="hospital-card-top">
        <div><h5>${h.name}</h5><p class="hc-meta">${h.speciality} · ${h.distance} km away</p></div>
        <div class="hospital-rating">★ ${h.rating}</div>
      </div>
      <div class="hospital-tags">
        ${h.emergency?'<span class="chip chip-danger">Emergency</span>':''}
        ${h.cashless?'<span class="chip chip-success">Cashless</span>':'<span class="chip chip-neutral">Reimbursement</span>'}
      </div>
      <div class="hospital-card-actions">
        <button class="btn-primary btn-sm" data-action="book-hospital" data-name="${h.name}">Book appointment</button>
        <button class="btn-secondary btn-sm" data-action="directions-hospital" data-name="${h.name}">Directions</button>
      </div>
    </div>`).join("") || `<div class="empty-state"><div class="empty-illustration">🏥</div><h3>No hospitals match</h3><p>Try a different filter or search term.</p></div>`;

  $("#mapPins").innerHTML = list.map(h=>`
    <div class="map-pin ${h.emergency?'emergency':''}" style="left:${h.x}%; top:${h.y}%" data-action="book-hospital" data-name="${h.name}" title="${h.name}"><span>🏥</span></div>`).join("");
}
$("#hospitalSearchInput").addEventListener("input", e=>{ state.hospitalQuery=e.target.value.toLowerCase(); renderHospitals(); });
$all(".chip-filter").forEach(c=> c.addEventListener("click", ()=>{
  $all(".chip-filter").forEach(x=>x.classList.remove("active"));
  c.classList.add("active");
  state.hospitalFilter = c.dataset.hfilter;
  renderHospitals();
}));
$("#liveLocationToggle").addEventListener("change", e=>{
  toast(e.target.checked ? "Live location enabled" : "Live location disabled");
});

/* ---------------------------------------------------------
   CLAIMS HISTORY
   --------------------------------------------------------- */
function renderClaimsHistory(){
  const table = $("#claimsHistoryTable");
  table.innerHTML = `
    <thead><tr><th>Claim ID</th><th>Type</th><th>Date</th><th>Amount</th><th>Status</th></tr></thead>
    <tbody>${CLAIMS_HISTORY.map(c=>`
      <tr>
        <td style="font-family:var(--font-mono);font-size:12.5px">${c.id}</td>
        <td>${c.type}</td><td>${c.date}</td><td>${fmtINR(c.amount)}</td>
        <td><span class="chip chip-${c.statusType}">${c.status}</span></td>
      </tr>`).join("")}</tbody>`;
}

/* ---------------------------------------------------------
   RENEWALS
   --------------------------------------------------------- */
function startCountdown(){
  const target = Date.now() + (58*24*3600 + 14*3600 + 32*60)*1000;
  function tick(){
    const diff = Math.max(0, target-Date.now());
    const d = Math.floor(diff/(24*3600*1000));
    const h = Math.floor((diff%(24*3600*1000))/(3600*1000));
    const m = Math.floor((diff%(3600*1000))/(60*1000));
    ["cdDays","renewalDays"].forEach(id=>{ const e=document.getElementById(id); if(e) e.textContent=d; });
    if($("#cdHours")) $("#cdHours").textContent=h;
    if($("#cdMins")) $("#cdMins").textContent=m;
  }
  tick();
  setInterval(tick, 30000);
}

function openRenewFlow(){
  const card = $("#renewFlowCard");
  card.hidden = false;
  card.scrollIntoView({behavior:"smooth", block:"center"});
  renderRenewStep(1);
}
function renderRenewStep(step){
  const content = $("#renewFlowContent");
  if(step===1){
    content.innerHTML = `
      <div class="wizard-steps"><span class="done"></span><span></span><span></span></div>
      <h3 class="wizard-title">Confirm your plan</h3>
      <p class="wizard-sub">Renewing Family Health Optima Plus for another 12 months.</p>
      <div class="pd-detail-grid" style="margin-bottom:20px">
        <div class="pd-detail-row"><span>Coverage</span><span>₹15,00,000</span></div>
        <div class="pd-detail-row"><span>Base premium</span><span>₹28,450</span></div>
        <div class="pd-detail-row"><span>Early-bird discount</span><span style="color:var(--success-600)">−₹3,414 (12%)</span></div>
        <div class="pd-detail-row"><span>New total</span><span>₹25,036</span></div>
      </div>
      <div class="wizard-nav"><span></span><button class="btn-primary" data-renew-next="2">Continue to payment</button></div>`;
  } else if(step===2){
    content.innerHTML = `
      <div class="wizard-steps"><span class="done"></span><span class="done"></span><span></span></div>
      <h3 class="wizard-title">Payment summary</h3>
      <div class="renew-summary-row"><span>Base premium</span><span>₹28,450</span></div>
      <div class="renew-summary-row"><span>Early-bird discount</span><span style="color:var(--success-600)">−₹3,414</span></div>
      <div class="renew-summary-row"><span>GST (18%)</span><span>₹4,505</span></div>
      <div class="renew-summary-row total"><span>Total payable</span><span>₹29,541</span></div>
      <div class="wizard-nav"><button class="btn-ghost" data-renew-next="1">← Back</button><button class="btn-primary" data-renew-next="3">Pay & renew</button></div>`;
  } else {
    content.innerHTML = `
      <div class="auth-success">
        <div class="success-check"><svg viewBox="0 0 52 52"><circle cx="26" cy="26" r="24" class="success-check-circle"/><path fill="none" class="success-check-mark" d="M14 27l7 7 17-17"/></svg></div>
        <h2>Policy renewed</h2>
        <p class="auth-sub">Your new policy is active until 14 Sep 2027. A confirmation has been emailed to you.</p>
        <button class="btn-secondary btn-sm" data-action="go-nav" data-nav="documents">View policy document</button>
      </div>`;
    toast("Policy renewed successfully", "success");
  }
  $all("[data-renew-next]", content).forEach(b=> b.addEventListener("click", ()=> renderRenewStep(Number(b.dataset.renewNext))));
}

/* ---------------------------------------------------------
   DOCUMENTS / PROFILE
   --------------------------------------------------------- */
function renderDocuments(){
  $("#docGrid").innerHTML = DOCUMENTS.map(d=>`
    <div class="doc-card" data-action="toast" data-toast="Opening ${d.name}…">
      <div class="doc-icon">${d.icon}</div><h5>${d.name}</h5><p>${d.meta}</p>
    </div>`).join("");
}
function renderFamily(){
  $("#familyList").innerHTML = FAMILY.map(f=>`
    <div class="family-row">
      <div class="family-avatar">${f.name.split(" ").map(x=>x[0]).join("")}</div>
      <div class="family-row-body"><h5>${f.name} <span style="color:var(--ink-500);font-weight:500">· ${f.rel}, ${f.age}</span></h5><p>${f.cover}</p></div>
      ${f.cover.includes("Add") ? '<button class="btn-secondary btn-sm" data-action="toast" data-toast="Adding family member to policy…">Add</button>' : '<span class="chip chip-success">Covered</span>'}
    </div>`).join("");
}
function renderMedHistory(){
  $("#medHistoryList").innerHTML = MED_HISTORY.map(m=>`
    <div class="mini-row"><div class="mini-row-icon">${m.icon}</div><div class="mini-row-body"><h5>${m.name}</h5><p>${m.note}</p></div></div>`).join("");
}
function renderInsHistory(){
  $("#insHistoryList").innerHTML = INS_HISTORY.map(m=>`
    <div class="mini-row"><div class="mini-row-icon">${m.icon}</div><div class="mini-row-body"><h5>${m.name}</h5><p>${m.note}</p></div></div>`).join("");
}

/* ---------------------------------------------------------
   SETTINGS — dark mode
   --------------------------------------------------------- */
function toggleDark(){
  state.dark = !state.dark;
  document.body.classList.toggle("dark", state.dark);
  $("#settingsDarkToggle").checked = state.dark;
  toast(state.dark ? "Dark mode on" : "Dark mode off");
}
$("#settingsDarkToggle").addEventListener("change", e=>{
  state.dark = e.target.checked;
  document.body.classList.toggle("dark", state.dark);
});

/* ---------------------------------------------------------
   NOTIFICATIONS PANEL
   --------------------------------------------------------- */
function renderNotifications(){
  let html = "";
  Object.entries(NOTIFICATIONS).forEach(([group, items])=>{
    html += `<div class="notif-group-label">${group}</div>`;
    items.forEach(n=>{
      html += `<div class="notif-row ${n.unread?'unread':''}">
        <div class="notif-icon">${n.icon}</div>
        <div class="notif-body"><h5>${n.title}</h5><p>${n.body}</p><time>${n.time}</time></div>
      </div>`;
    });
  });
  $("#notifBody").innerHTML = html;
}
function openNotifications(){ $("#notifPanelOverlay").classList.add("active"); }
function closeNotifications(){ $("#notifPanelOverlay").classList.remove("active"); }

/* ---------------------------------------------------------
   GLOBAL SEARCH
   --------------------------------------------------------- */
function renderGlobalSearch(q){
  const query = q.toLowerCase().trim();
  const results = $("#globalSearchResults");
  if(!query){
    results.innerHTML = `<div class="gsr-empty">Start typing to search policies, hospitals, claims, documents &amp; settings</div>`;
    return;
  }
  const matches = [];
  POLICIES.forEach(p=>{ if(p.name.toLowerCase().includes(query)||p.insurer.toLowerCase().includes(query)) matches.push({group:"Policies", label:p.name, sub:p.insurer, action:()=>{closeModal("searchModal"); openPolicyDetail(p.id);}}); });
  HOSPITALS.forEach(h=>{ if(h.name.toLowerCase().includes(query)) matches.push({group:"Hospitals", label:h.name, sub:h.speciality, action:()=>{closeModal("searchModal"); navigateTo("hospitals");}}); });
  CLAIMS_HISTORY.forEach(c=>{ if(c.id.toLowerCase().includes(query)||c.type.toLowerCase().includes(query)) matches.push({group:"Claims", label:c.id, sub:c.type, action:()=>{closeModal("searchModal"); navigateTo("claims");}}); });
  DOCUMENTS.forEach(d=>{ if(d.name.toLowerCase().includes(query)) matches.push({group:"Documents", label:d.name, sub:d.meta, action:()=>{closeModal("searchModal"); navigateTo("documents");}}); });
  ["Dark mode","Notifications","Language","Security","Privacy"].forEach(s=>{ if(s.toLowerCase().includes(query)) matches.push({group:"Settings", label:s, sub:"Settings", action:()=>{closeModal("searchModal"); navigateTo("settings");}}); });

  if(!matches.length){ results.innerHTML = `<div class="gsr-empty">No results for "${q}"</div>`; return; }
  const groups = {};
  matches.forEach(m=>{ (groups[m.group]=groups[m.group]||[]).push(m); });
  let html="";
  Object.entries(groups).forEach(([g, items])=>{
    html += `<div class="gsr-group-label">${g}</div>`;
    items.forEach((m,i)=> html += `<div class="mini-row" data-gsr="${g}-${i}"><div class="mini-row-icon">🔎</div><div class="mini-row-body"><h5>${m.label}</h5><p>${m.sub}</p></div></div>`);
  });
  results.innerHTML = html;
  let idx=0;
  Object.entries(groups).forEach(([g, items])=>{
    items.forEach(m=>{
      const rowEl = results.querySelector(`[data-gsr="${g}-${items.indexOf(m)}"]`);
      if(rowEl) rowEl.addEventListener("click", m.action);
    });
  });
}
$("#globalSearchInput").addEventListener("input", e=> renderGlobalSearch(e.target.value));

/* ---------------------------------------------------------
   SOS
   --------------------------------------------------------- */
function triggerSos(){
  closeModal("sosModal");
  toast("Emergency contacts alerted — location shared", "success");
}

/* ---------------------------------------------------------
   AI ASSISTANT
   --------------------------------------------------------- */
function toggleAiChat(){
  const chat = $("#aiChat");
  const fab = $(".ai-fab");
  const open = !chat.classList.contains("open");
  chat.classList.toggle("open", open);
  fab.classList.toggle("hide", open);
  if(open && !state.aiChatOpened){ state.aiChatOpened = true; }
}
function initAiChat(){
  $("#aiChatBody").innerHTML = `<div class="ai-msg bot">Hi Priya 👋 I'm Insure AI. I can explain your policy, compare plans, estimate premiums, or help with a claim. What's on your mind?</div>`;
  const suggestions = ["Explain co-pay","Which policy suits me?","Estimate my premium","Claim help"];
  $("#aiChatSuggestions").innerHTML = suggestions.map(s=>`<button class="ai-suggest-chip" type="button">${s}</button>`).join("");
  $all(".ai-suggest-chip").forEach(chip=> chip.addEventListener("click", ()=> sendAiMessage(chip.textContent)));
}
$("#aiChatForm").addEventListener("submit", e=>{
  e.preventDefault();
  const input = $("#aiChatInput");
  const val = input.value.trim();
  if(!val) return;
  sendAiMessage(val);
  input.value="";
});
function sendAiMessage(text){
  const body = $("#aiChatBody");
  body.appendChild(el(`<div class="ai-msg user">${escapeHtml(text)}</div>`));
  body.scrollTop = body.scrollHeight;
  const typing = el(`<div class="ai-typing"><span></span><span></span><span></span></div>`);
  body.appendChild(typing);
  body.scrollTop = body.scrollHeight;
  setTimeout(()=>{
    typing.remove();
    const reply = getAiReply(text);
    body.appendChild(el(`<div class="ai-msg bot">${reply}</div>`));
    body.scrollTop = body.scrollHeight;
  }, 850 + Math.random()*500);
}
function getAiReply(text){
  const low = text.toLowerCase();
  for(const r of AI_RESPONSES){
    if(r.kw.some(k=> low.includes(k))) return r.text;
  }
  return "I've noted that. For a detailed answer, I'd recommend checking your Policy Details page, or ask me something like \"what's my co-pay\" or \"compare policies\".";
}
function escapeHtml(s){ const d=document.createElement("div"); d.textContent=s; return d.innerHTML; }

/* ---------------------------------------------------------
   TOOL MODALS (generic host: premium estimator, risk calc,
   upload doc / AI scan, claim wizard)
   --------------------------------------------------------- */
function openTool(tool){
  const content = $("#toolModalContent");
  const inner = $("#toolModalInner");
  inner.className = "modal modal-lg";
  if(tool==="premium-estimator") renderPremiumEstimator(content);
  else if(tool==="risk-calc") renderRiskCalc(content);
  else if(tool==="upload-doc") renderUploadDoc(content);
  else if(tool==="claim-wizard") { inner.classList.add("modal-lg"); renderClaimWizard(content, 1); }
  else if(tool==="ai-assistant") { openModal("toolModal"); closeModal("toolModal"); toggleAiChat(); return; }
  openModal("toolModal");
}

function renderPremiumEstimator(content){
  content.innerHTML = `
    <h2>Premium estimator</h2>
    <p class="modal-sub">Get an instant estimate based on your profile.</p>
    <div class="field"><label>Age of eldest member</label>
      <input type="range" min="18" max="70" value="34" class="slider" id="estAge">
      <div class="filter-value"><span id="estAgeVal">34</span> years</div>
    </div>
    <div class="field"><label>Desired coverage</label>
      <select class="select-input" id="estCoverage"><option value="500000">₹5 lakh</option><option value="1000000">₹10 lakh</option><option value="1500000" selected>₹15 lakh</option><option value="2000000">₹20 lakh</option></select>
    </div>
    <div class="field"><label>Family members to cover</label>
      <select class="select-input" id="estMembers"><option value="1">Just me</option><option value="2">Me + spouse</option><option value="3" selected>Me + spouse + 1 child</option><option value="4">Me + spouse + 2 children</option></select>
    </div>
    <div class="ai-summary-box" style="text-align:center;margin-top:8px">
      <p style="font-size:12.5px;margin-bottom:6px">Estimated annual premium</p>
      <div style="font-family:var(--font-display);font-size:30px;font-weight:700;color:var(--purple-600)" id="estResult">₹28,450</div>
    </div>`;
  function recalc(){
    const age = Number($("#estAge").value);
    const cov = Number($("#estCoverage").value);
    const mem = Number($("#estMembers").value);
    $("#estAgeVal").textContent = age;
    let base = cov*0.014 + (age>45? (age-45)*180:0) + mem*1400;
    $("#estResult").textContent = fmtINR(Math.round(base/50)*50);
  }
  $("#estAge").addEventListener("input", recalc);
  $("#estCoverage").addEventListener("change", recalc);
  $("#estMembers").addEventListener("change", recalc);
  recalc();
}

function renderRiskCalc(content){
  content.innerHTML = `
    <h2>Health risk calculator</h2>
    <p class="modal-sub">A quick estimate of your health risk profile — not a medical diagnosis.</p>
    <div class="field"><label>BMI category</label>
      <select class="select-input" id="riskBmi"><option value="0">Normal (18.5–24.9)</option><option value="1">Overweight (25–29.9)</option><option value="2">Obese (30+)</option></select>
    </div>
    <div class="field"><label class="checkbox"><input type="checkbox" id="riskSmoke"><span class="checkbox-box"></span>Smokes or uses tobacco</label></div>
    <div class="field"><label class="checkbox"><input type="checkbox" id="riskFamily"><span class="checkbox-box"></span>Family history of heart disease or diabetes</label></div>
    <div class="field"><label class="checkbox"><input type="checkbox" id="riskExercise"><span class="checkbox-box"></span>Exercises less than twice a week</label></div>
    <button class="btn-primary btn-block" id="riskCalcBtn">Calculate risk</button>
    <div id="riskResult" style="margin-top:16px"></div>`;
  $("#riskCalcBtn").addEventListener("click", ()=>{
    let score = Number($("#riskBmi").value);
    if($("#riskSmoke").checked) score+=2;
    if($("#riskFamily").checked) score+=1;
    if($("#riskExercise").checked) score+=1;
    const level = score<=1?["Low","success"]:score<=3?["Moderate","warning"]:["Elevated","danger"];
    $("#riskResult").innerHTML = `<div class="ai-summary-box"><p><span class="chip chip-${level[1]}">${level[0]} risk</span><br><br>Based on your inputs, consider adding a Critical Illness rider and booking your free annual health checkup. This is a general estimate, not medical advice.</p></div>`;
  });
}

function renderUploadDoc(content){
  content.innerHTML = `
    <h2>Upload document</h2>
    <p class="modal-sub">Drag and drop, or tap to select a file. Our AI will scan it instantly.</p>
    <div class="upload-drop" id="uploadDropZone">
      <div class="upload-drop-icon">📤</div>
      <p style="font-weight:600;margin-bottom:4px">Drop file here or click to upload</p>
      <p style="font-size:12px;color:var(--ink-500)">JPG, PNG or PDF, up to 10MB</p>
      <input type="file" id="hiddenFileInput" style="display:none" accept="image/*,.pdf">
    </div>`;
  const zone = $("#uploadDropZone");
  zone.addEventListener("click", ()=> $("#hiddenFileInput").click());
  ["dragenter","dragover"].forEach(ev=> zone.addEventListener(ev, e=>{ e.preventDefault(); zone.classList.add("dragover"); }));
  ["dragleave","drop"].forEach(ev=> zone.addEventListener(ev, e=>{ e.preventDefault(); zone.classList.remove("dragover"); }));
  zone.addEventListener("drop", ()=> runAiScan(content));
  $("#hiddenFileInput").addEventListener("change", ()=> runAiScan(content));
}

function runAiScan(content){
  content.innerHTML = `
    <h2>Analyzing document…</h2>
    <p class="modal-sub">Our AI is scanning for quality, completeness and KYC match.</p>
    <div class="scan-wrap">
      <div class="scan-ring">
        <svg viewBox="0 0 140 140"><circle class="scan-bg" cx="70" cy="70" r="60"/><circle class="scan-fg" id="scanFg" cx="70" cy="70" r="60"/></svg>
        <div class="scan-pct" id="scanPct">0%</div>
      </div>
      <div class="scan-checks" id="scanChecks">
        <div class="scan-check-row" data-c="0"><span class="scr-icon">✓</span>Image quality: Sharp, well-lit</div>
        <div class="scan-check-row" data-c="1"><span class="scr-icon">✓</span>Text detection: 98% confidence</div>
        <div class="scan-check-row" data-c="2"><span class="scr-icon">✓</span>KYC name match: Priya Sharma</div>
        <div class="scan-check-row warn" data-c="3"><span class="scr-icon">!</span>Missing field: Doctor's signature date</div>
      </div>
    </div>`;
  let pct=0;
  const fg = $("#scanFg"); const circumference = 2*Math.PI*60;
  fg.style.strokeDasharray = circumference;
  const timer = setInterval(()=>{
    pct += 4;
    if(pct>=100){ pct=100; clearInterval(timer); finishScan(content); }
    $("#scanPct").textContent = pct+"%";
    fg.style.strokeDashoffset = circumference - (circumference*pct/100);
  }, 45);
  $all(".scan-check-row").forEach((row,i)=> setTimeout(()=> row.classList.add("show"), 500+i*350));
}
function finishScan(content){
  setTimeout(()=>{
    const resultBox = el(`
      <div class="scan-result-card">
        <h5 style="margin-bottom:6px">Document accepted with 1 suggestion</h5>
        <p style="font-size:12.5px;color:var(--ink-700);margin-bottom:10px">Confidence score</p>
        <div class="confidence-bar"><div class="confidence-fill" style="width:0%"></div></div>
        <p style="font-size:11.5px;color:var(--ink-500);margin-top:4px">91% match confidence</p>
        <div style="display:flex;gap:10px;margin-top:16px">
          <button class="btn-primary btn-sm" data-action="close-modal" data-modal="toolModal">Approve &amp; continue</button>
          <button class="btn-secondary btn-sm" id="reuploadBtn">Reupload</button>
        </div>
      </div>`);
    content.querySelector(".scan-wrap").appendChild(resultBox);
    requestAnimationFrame(()=> resultBox.querySelector(".confidence-fill").style.width = "91%");
    resultBox.querySelector("#reuploadBtn").addEventListener("click", ()=> renderUploadDoc(content));
    toast("Document scanned and approved", "success");
  }, 300);
}

/* ---- Claim submission wizard ---- */
const CLAIM_DOC_TYPES = [
  {icon:"🧾", name:"Hospital bills"}, {icon:"📋", name:"Medical reports"},
  {icon:"🪪", name:"Government ID"}, {icon:"💊", name:"Prescription"},
  {icon:"🏥", name:"Hospital invoice"}, {icon:"🩺", name:"Doctor certificate"}
];
let claimUploaded = new Set();
function renderClaimWizard(content, step){
  if(step===1){
    content.innerHTML = `
      <div class="wizard-steps"><span class="done"></span><span></span><span></span></div>
      <h3 class="wizard-title">Claim details</h3>
      <p class="wizard-sub">Tell us about the hospitalisation you're claiming for.</p>
      <div class="field"><label>Hospital name</label><input type="text" id="cwHospital" placeholder="e.g. Apollo Hospitals, Vaishali" value="Apollo Hospitals, Vaishali"></div>
      <div class="field"><label>Treatment type</label><select class="select-input"><option>Hospitalisation</option><option>Day-care surgery</option><option>OPD consultation</option></select></div>
      <div class="field"><label>Claim amount (₹)</label><input type="number" id="cwAmount" placeholder="86400" value="86400"></div>
      <div class="wizard-nav"><span></span><button class="btn-primary" data-cw-next="2">Continue to documents</button></div>`;
  } else if(step===2){
    content.innerHTML = `
      <div class="wizard-steps"><span class="done"></span><span class="done"></span><span></span></div>
      <h3 class="wizard-title">Upload documents</h3>
      <p class="wizard-sub">Tap each document to simulate an upload. All six are required.</p>
      <div class="upload-doc-types" id="cwDocGrid">
        ${CLAIM_DOC_TYPES.map(d=>`<div class="upload-doc-type ${claimUploaded.has(d.name)?'uploaded':''}" data-doc="${d.name}"><span class="udt-icon">${claimUploaded.has(d.name)?'✓':d.icon}</span>${d.name}</div>`).join("")}
      </div>
      <div class="wizard-nav"><button class="btn-ghost" data-cw-next="1">← Back</button><button class="btn-primary" id="cwToStep3">Continue</button></div>`;
    $all(".upload-doc-type", content).forEach(row=>{
      row.addEventListener("click", ()=>{
        const name = row.dataset.doc;
        if(claimUploaded.has(name)) return;
        claimUploaded.add(name);
        row.classList.add("uploaded");
        row.querySelector(".udt-icon").textContent="✓";
        toast(name+" uploaded", "success");
      });
    });
    $("#cwToStep3").addEventListener("click", ()=>{
      if(claimUploaded.size < CLAIM_DOC_TYPES.length){ toast("Please upload all 6 documents", "error"); return; }
      renderClaimWizard(content, 3);
    });
  } else {
    content.innerHTML = `
      <div class="wizard-steps"><span class="done"></span><span class="done"></span><span class="done"></span></div>
      <div class="auth-success">
        <div class="success-check"><svg viewBox="0 0 52 52"><circle cx="26" cy="26" r="24" class="success-check-circle"/><path fill="none" class="success-check-mark" d="M14 27l7 7 17-17"/></svg></div>
        <h2>Claim submitted</h2>
        <p class="auth-sub">Claim reference CLM-2026-00512 created. Estimated completion: 3–5 business days.</p>
        <button class="btn-primary btn-sm" data-action="close-modal" data-modal="toolModal">Done</button>
      </div>`;
    claimUploaded = new Set();
    toast("Claim CLM-2026-00512 submitted", "success");
  }
  $all("[data-cw-next]", content).forEach(b=> b.addEventListener("click", ()=> renderClaimWizard(content, Number(b.dataset.cwNext))));
}

})();
