/* =====================================================================
   app.js — reads window.WEDDING (from config.js) and fills in the page.
   You should not need to edit this file. Edit config.js instead.
   ===================================================================== */
(function () {
  const W = window.WEDDING || {};
  const $ = (id) => document.getElementById(id);
  const has = (v) => v !== undefined && v !== null && String(v).trim() !== "";
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const soon = (txt) => `<span class="soon">${esc(txt || "Details coming soon")}</span>`;
  const mapsUrl = (q) => "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(q);

  /* ---------- names, title, monograms ---------- */
  const c = W.couple || {};
  const n1 = has(c.first1) ? c.first1.trim() : "";
  const n2 = has(c.first2) ? c.first2.trim() : "";
  const names = (n1 || n2)
    ? `${esc(n1 || "…")} <span class="amp">&amp;</span> ${esc(n2 || "…")}`
    : `Our Wedding`;
  const initials = (n1 || n2) ? `${esc((n1 || "?")[0])}&amp;${esc((n2 || "?")[0])}` : "&amp;";
  $("heroNames").innerHTML = names;
  $("navMono").innerHTML = initials;
  $("footMono").innerHTML = (n1 || n2) ? `${esc(n1 || "…")} &amp; ${esc(n2 || "…")}` : "&amp;";

  const titleText = has(W.siteTitle) ? W.siteTitle : ((n1 || n2) ? `${n1 || "…"} & ${n2 || "…"}` : "Our Wedding");
  document.title = titleText;
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc && has(W.siteDescription)) metaDesc.setAttribute("content", W.siteDescription);

  /* ---------- date & countdown ---------- */
  let dateObj = null;
  if (has(W.date)) {
    const t = has(W.time) ? W.time : "00:00";
    dateObj = new Date(`${W.date}T${t}:00`);
    if (isNaN(dateObj.getTime())) dateObj = null;
  }
  const longDate = dateObj
    ? dateObj.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })
    : "";
  const dottedDate = dateObj
    ? `${String(dateObj.getMonth() + 1).padStart(2, "0")}.${String(dateObj.getDate()).padStart(2, "0")}.${dateObj.getFullYear()}`
    : "";
  const timeStr = (dateObj && has(W.time))
    ? dateObj.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
    : "";

  const dl = [];
  dl.push(longDate ? esc(longDate) : "Date coming soon");
  if (timeStr) dl.push(esc(timeStr));
  if (has(W.location)) dl.push(esc(W.location));
  $("heroDateLine").innerHTML = dl.join('<span class="dot">•</span>');

  $("footDate").textContent = dottedDate || "";
  $("footNote").textContent = (W.footer && has(W.footer.note)) ? W.footer.note : (has(c.hashtag) ? c.hashtag : "");

  const cd = $("countdown");
  function tick() {
    if (!dateObj) { cd.className = "countdown soon-text"; cd.textContent = "Save the date — details to follow"; return; }
    const diff = dateObj.getTime() - Date.now();
    if (diff <= 0) {
      const dayEnd = dateObj.getTime() + 36 * 3600 * 1000;
      cd.className = "countdown soon-text";
      cd.textContent = Date.now() < dayEnd ? "Today is the day" : "Happily married";
      return;
    }
    const d = Math.floor(diff / 86400000), h = Math.floor(diff / 3600000) % 24,
          m = Math.floor(diff / 60000) % 60, s = Math.floor(diff / 1000) % 60;
    cd.className = "countdown";
    cd.innerHTML = [[d, "Days"], [h, "Hours"], [m, "Minutes"], [s, "Seconds"]]
      .map(([v, l]) => `<div><b>${v}</b><small>${l}</small></div>`).join("");
  }
  tick(); setInterval(tick, 1000);

  /* ---------- hero image + welcome ---------- */
  const hero = W.hero || {};
  if (has(hero.image)) {
    const img = new Image();
    img.onload = () => { const bg = $("heroBg"); bg.style.backgroundImage = `url("${hero.image}")`; bg.classList.add("loaded"); };
    img.src = hero.image;
  }
  $("heroWelcome").textContent = has(hero.welcome) ? hero.welcome : "";
  if (!has(hero.welcome)) $("heroWelcome").hidden = true;

  /* ---------- section visibility helper ---------- */
  function section(key, visible) {
    const sec = document.querySelector(`section[data-sec="${key}"]`);
    const link = document.querySelector(`#navLinks a[data-sec="${key}"]`);
    if (sec) sec.hidden = !visible;
    if (link) link.parentElement.hidden = !visible;
  }

  /* ---------- our story ---------- */
  const story = W.story || {};
  section("story", story.show !== false);
  $("storyIntro").textContent = has(story.intro) ? story.intro : "";
  $("storyIntro").hidden = !has(story.intro);
  const ms = (story.milestones || []).filter(m => has(m.title) || has(m.text));
  $("storyGrid").innerHTML = ms.length ? ms.map(m => `
    <article class="milestone reveal">
      <div class="when">
        ${has(m.date) ? `<span class="eyebrow">${esc(m.date)}</span>` : ""}
        <div class="script">${esc(m.title || "")}</div>
      </div>
      <div class="what">
        ${has(m.text) ? `<p>${esc(m.text)}</p>` : `<p class="tbd" style="color:var(--muted);font-style:italic">We're still writing this chapter.</p>`}
      </div>
    </article>`).join("") : `<div style="text-align:center">${soon("Our story is coming soon")}</div>`;

  /* ---------- photos ---------- */
  const ph = W.photos || {};
  section("photos", ph.show !== false);
  const items = (ph.items || []).filter(p => has(p.src));
  const g = $("gallery");
  if (items.length) {
    g.innerHTML = items.map(p => `
      <figure class="reveal">
        <img src="${esc(p.src)}" alt="${esc(p.caption || "Photo of the couple")}" loading="lazy">
        ${has(p.caption) ? `<figcaption>${esc(p.caption)}</figcaption>` : ""}
      </figure>`).join("");
  } else {
    const marks = ["I", "II", "III", "IV", "V", "VI"];
    g.innerHTML = marks.map(mk => `
      <figure class="reveal"><div class="placeholder"><span class="script">${mk}</span></div></figure>`).join("");
  }

  /* ---------- schedule ---------- */
  const sch = W.schedule || {};
  section("schedule", sch.show !== false);
  const ev = (sch.items || []).filter(e => has(e.title));
  const summary = [];
  if (dottedDate) summary.push(dottedDate);
  const firstAttire = ev.find(e => has(e.attire));
  const generalAttire = (W.attire && has(W.attire.code)) ? W.attire.code : (firstAttire ? firstAttire.attire : "");
  if (has(generalAttire)) summary.push("Attire: " + generalAttire);
  if (has(W.location)) summary.push(W.location);
  $("daySummary").innerHTML = summary.map(esc).join("<span>•</span>");

  $("timeline").innerHTML = ev.length ? ev.map(e => `
    <article class="event reveal">
      <div class="time">${has(e.time) ? esc(e.time) : `<span class="tbd">TBD</span>`}</div>
      <div>
        <h3>${esc(e.title)}</h3>
        ${has(e.venue) ? `<div class="venue">${esc(e.venue)}</div>` : `<div class="venue tbd">Venue to be announced</div>`}
        ${has(e.address) ? `<div class="addr"><a href="${mapsUrl(e.address)}" target="_blank" rel="noopener">${esc(e.address)}</a></div>` : ""}
        ${has(e.attire) ? `<div class="meta"><span>Attire <b>${esc(e.attire)}</b></span></div>` : ""}
        ${has(e.note) ? `<p class="note">${esc(e.note)}</p>` : ""}
      </div>
    </article>`).join("") : `<div style="text-align:center">${soon("Schedule coming soon")}</div>`;

  const firstAddr = ev.find(e => has(e.address));
  if (sch.showMap !== false && firstAddr) {
    const q = encodeURIComponent((has(firstAddr.venue) ? firstAddr.venue + ", " : "") + firstAddr.address);
    const mw = $("mapWrap");
    mw.hidden = false;
    mw.innerHTML = `<iframe title="Map to ${esc(firstAddr.venue || "the venue")}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://www.google.com/maps?q=${q}&output=embed"></iframe>
      <a class="btn ghost map-link" href="${mapsUrl(firstAddr.address)}" target="_blank" rel="noopener">Open in Maps</a>`;
  }

  /* ---------- attire ---------- */
  const at = W.attire || {};
  section("attire", at.show !== false);
  $("attireCode").textContent = has(at.code) ? at.code : "Coming soon";
  $("attireSub").textContent = has(at.code) ? (dottedDate || "") : "we'll update this shortly";
  const tips = (at.tips || []).filter(has);
  $("attireCopy").innerHTML =
    (has(at.description) ? `<p>${esc(at.description)}</p>` : `<p style="color:var(--muted);font-style:italic">We'll share what to wear, and a few tips for the venue, as the day gets closer.</p>`) +
    (tips.length ? `<ul>${tips.map(t => `<li>${esc(t)}</li>`).join("")}</ul>` : "") +
    (has(at.colors) ? `<div class="colors">${esc(at.colors)}</div>` : "");

  /* ---------- travel ---------- */
  const tr = W.travel || {};
  section("travel", tr.show !== false);
  $("travelIntro").textContent = has(tr.intro) ? tr.intro : "";
  $("travelIntro").hidden = !has(tr.intro);
  const facts = [["Flying in", tr.airport], ["Parking", tr.parking], ["Transportation", tr.transportation]].filter(f => has(f[1]));
  const tf = $("travelFacts");
  if (facts.length) {
    tf.innerHTML = facts.map(([k, v]) => `<div class="reveal"><span class="eyebrow">${k}</span><p>${esc(v)}</p></div>`).join("");
    tf.style.setProperty("--cols", Math.min(facts.length, 3));
  } else tf.hidden = true;

  const hotels = (tr.hotels || []).filter(h => has(h.name));
  $("hotels").innerHTML = hotels.length ? hotels.map(h => `
    <article class="hotel reveal">
      <span class="eyebrow">${has(h.distance) ? esc(h.distance) : "Recommended stay"}</span>
      <h3>${esc(h.name)}</h3>
      ${has(h.address) ? `<div class="addr"><a href="${mapsUrl(h.address)}" target="_blank" rel="noopener" style="text-decoration:none;border-bottom:1px solid var(--rule)">${esc(h.address)}</a></div>` : ""}
      ${(has(h.blockCode) || has(h.rate) || has(h.deadline) || has(h.phone)) ? `<dl>
        ${has(h.blockCode) ? `<dt>Room block</dt><dd>${esc(h.blockCode)}</dd>` : ""}
        ${has(h.rate) ? `<dt>Rate</dt><dd>${esc(h.rate)}</dd>` : ""}
        ${has(h.deadline) ? `<dt>Book by</dt><dd>${esc(h.deadline)}</dd>` : ""}
        ${has(h.phone) ? `<dt>Phone</dt><dd><a href="tel:${esc(h.phone.replace(/[^+\d]/g, ""))}" style="text-decoration:none">${esc(h.phone)}</a></dd>` : ""}
      </dl>` : ""}
      ${has(h.note) ? `<p class="note">${esc(h.note)}</p>` : ""}
      ${has(h.url) ? `<a class="btn ghost" href="${esc(h.url)}" target="_blank" rel="noopener">Book a room</a>` : ""}
    </article>`).join("") : `<div style="text-align:center">${soon("Hotel blocks coming soon")}</div>`;

  /* ---------- registry ---------- */
  const rg = W.registry || {};
  section("registry", rg.show !== false);
  $("registryIntro").textContent = has(rg.intro) ? rg.intro : "";
  $("registryIntro").hidden = !has(rg.intro);
  const regs = (rg.items || []).filter(r => has(r.name));
  $("registries").innerHTML = regs.length ? regs.map(r => has(r.url)
    ? `<a class="registry reveal" href="${esc(r.url)}" target="_blank" rel="noopener">
         <span class="name">${esc(r.name)}</span>
         ${has(r.note) ? `<p class="note">${esc(r.note)}</p>` : ""}
         <span class="cta">View registry →</span>
       </a>`
    : `<div class="registry reveal pending">
         <span class="name">${esc(r.name)}</span>
         <p class="note">${has(r.note) ? esc(r.note) : "Link coming soon"}</p>
       </div>`).join("") : `<div style="text-align:center">${soon("Registry coming soon")}</div>`;

  /* ---------- share photos ---------- */
  const ps = W.photoShare || {};
  section("photoShare", ps.show !== false);
  const tag = has(ps.hashtag) ? ps.hashtag : (has(c.hashtag) ? c.hashtag : "");
  $("shareBox").innerHTML =
    (has(tag) ? `<div class="tag">${esc(tag)}</div>` : "") +
    (has(ps.intro) ? `<p>${esc(ps.intro)}</p>` : "") +
    (has(ps.url)
      ? `<a class="btn" href="${esc(ps.url)}" target="_blank" rel="noopener">${esc(ps.buttonText || "Upload your photos")}</a>`
      : soon("Upload link coming after the wedding"));

  /* ---------- faq ---------- */
  const fq = W.faq || {};
  section("faq", fq.show !== false);
  const qs = (fq.items || []).filter(q => has(q.q));
  $("faqList").innerHTML = qs.length ? qs.map(q => `
    <details class="reveal">
      <summary>${esc(q.q)}</summary>
      <div class="answer"><p>${has(q.a) ? esc(q.a) : `<em style="color:var(--muted)">We'll answer this soon.</em>`}</p></div>
    </details>`).join("") : `<div style="text-align:center;padding:24px 0">${soon("Questions & answers coming soon")}</div>`;


  /* ---------- invite-only RSVP (talks to the Google Apps Script in apps-script/) ---------- */
  function initGuestList(box, rs) {
    const api = rs.scriptUrl;
    const get = (qs) => fetch(api + (api.includes("?") ? "&" : "?") + qs).then(r => r.json());
    box.innerHTML = `
      <div id="gl_find" class="gl">
        <div class="field"><label for="gl_q">Find your invitation</label>
          <input id="gl_q" type="text" placeholder="First and last name" autocomplete="off" autocapitalize="words"></div>
        <button class="btn" id="gl_go" type="button">Search</button>
        <p class="form-msg" id="gl_msg" role="status"></p>
        <div class="gl-results" id="gl_results"></div>
      </div>
      <form id="gl_form" class="gl" hidden novalidate></form>`;
    const q = $("gl_q"), go = $("gl_go"), msg = $("gl_msg"), results = $("gl_results"), form = $("gl_form"), find = $("gl_find");

    async function search() {
      const v = q.value.trim();
      results.innerHTML = ""; msg.className = "form-msg";
      if (v.split(/\s+/).length < 2) { msg.textContent = "Please enter your first and last name."; return; }
      msg.textContent = "Searching…";
      try {
        const j = await get("action=search&q=" + encodeURIComponent(v));
        if (!j.ok) throw new Error();
        if (!j.results.length) { msg.textContent = "We couldn't find that name. Try the spelling on your invitation, or contact us."; return; }
        msg.textContent = "Select your name:";
        results.innerHTML = j.results.map(r => `<button type="button" class="gl-hit" data-id="${esc(r.id)}">${esc(r.name)}</button>`).join("");
      } catch { msg.textContent = "Couldn't connect. Please try again in a moment."; }
    }
    go.addEventListener("click", search);
    q.addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); search(); } });
    results.addEventListener("click", async e => {
      const b = e.target.closest(".gl-hit"); if (!b) return;
      msg.textContent = "Loading your invitation…"; results.innerHTML = "";
      try {
        const j = await get("action=party&id=" + encodeURIComponent(b.dataset.id));
        if (!j.ok) throw new Error();
        showParty(j.party);
      } catch { msg.textContent = "Couldn't load your invitation. Please try again."; }
    });

    function showParty(p) {
      find.hidden = true; form.hidden = false;
      const again = p.members.some(m => m.attending);
      form.innerHTML = `
        ${again ? `<p class="form-msg ok">You've already replied. You can change your answers below.</p>` : ""}
        <div class="gl-party">
          ${p.members.map(m => `
            <div class="gl-member">
              <div class="gl-name">${esc(m.name)}${m.child ? `<small>Child</small>` : ""}</div>
              <div class="choice">
                <label><input type="radio" name="att_${esc(m.id)}" value="yes" ${m.attending === "yes" ? "checked" : ""}> Joyfully accepts</label>
                <label><input type="radio" name="att_${esc(m.id)}" value="no" ${m.attending === "no" ? "checked" : ""}> Regretfully declines</label>
              </div>
            </div>`).join("")}
        </div>
        ${rs.askDietary !== false ? `<div class="field"><label for="gl_diet">${esc(rs.dietaryLabel || "Dietary restrictions or allergies")}</label><input id="gl_diet" value="${esc(p.dietary)}"></div>` : ""}
        ${rs.askSong !== false ? `<div class="field"><label for="gl_song">A song that will get you on the dance floor</label><input id="gl_song" value="${esc(p.song)}"></div>` : ""}
        <div class="field"><label for="gl_email">Email (so we can reach you)</label><input id="gl_email" type="email" autocomplete="email" value="${esc(p.email)}"></div>
        <div class="field"><label for="gl_note">A note for the couple</label><textarea id="gl_note">${esc(p.message)}</textarea></div>
        <button class="btn" type="submit" id="gl_submit">Send RSVP</button>
        <button class="gl-back" type="button" id="gl_back">Not you? Search again</button>
        <p class="form-msg" id="gl_fmsg" role="status"></p>`;
      $("gl_back").addEventListener("click", () => { form.hidden = true; find.hidden = false; msg.textContent = ""; });
      form.onsubmit = async e => {
        e.preventDefault();
        const fm = $("gl_fmsg"), btn = $("gl_submit");
        const responses = [];
        for (const m of p.members) {
          const c = form.querySelector(`input[name="att_${m.id}"]:checked`);
          if (!c) { fm.className = "form-msg"; fm.textContent = `Please answer for ${m.name}.`; return; }
          responses.push({ id: m.id, attending: c.value === "yes" });
        }
        btn.setAttribute("aria-disabled", "true"); fm.className = "form-msg"; fm.textContent = "Sending…";
        try {
          const r = await fetch(api, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify({
            action: "rsvp", anchor: p.anchor, responses,
            dietary: $("gl_diet") ? $("gl_diet").value : "", song: $("gl_song") ? $("gl_song").value : "",
            email: $("gl_email").value, message: $("gl_note").value }) });
          const j = await r.json();
          if (!j.ok) throw new Error(j.error || "");
          const yes = responses.filter(x => x.attending).length;
          form.innerHTML = `<div class="rsvp-center"><div class="script" style="font-size:52px">Thank you</div>
            <p style="margin:0;color:var(--muted-on-ink);max-width:40ch">${yes ? `We can't wait to celebrate with ${yes > 1 ? "you all" : "you"}.` : "We'll miss you, and we're grateful you let us know."}</p>
            <button class="gl-back" type="button" id="gl_done">Change your answers</button></div>`;
          $("gl_done").addEventListener("click", () => showParty({ ...p, members: p.members.map(m => ({ ...m, attending: responses.find(x => x.id === m.id).attending ? "yes" : "no" })) }));
        } catch (err) {
          btn.removeAttribute("aria-disabled");
          fm.textContent = (err && err.message) || "Something went wrong. Please try again.";
        }
      };
    }
  }

  /* ---------- rsvp ---------- */
  const rs = W.rsvp || {};
  section("rsvp", rs.show !== false);
  $("rsvpIntro").textContent = has(rs.intro) ? rs.intro : "";
  $("rsvpIntro").hidden = !has(rs.intro);
  $("rsvpDeadline").textContent = has(rs.deadline) ? `Kindly reply by ${rs.deadline}` : "";
  const box = $("rsvpBox");
  const mode = (rs.mode || "soon").toLowerCase();

  if (mode === "guestlist" && has(rs.scriptUrl)) {
    initGuestList(box, rs);
  } else if (mode === "googleform" && has(rs.googleFormEmbedUrl)) {
    box.innerHTML = `<iframe class="rsvp-embed" title="RSVP form" src="${esc(rs.googleFormEmbedUrl)}" loading="lazy">Loading…</iframe>`;
  } else if (mode === "link" && has(rs.link)) {
    box.innerHTML = `<div class="rsvp-center"><p style="margin:0;font-style:italic;color:var(--muted-on-ink)">Tap below to let us know.</p><a class="btn" href="${esc(rs.link)}" target="_blank" rel="noopener">RSVP now</a></div>`;
  } else {
    box.innerHTML = `<div class="rsvp-center"><div class="script" style="font-size:52px">Save the date</div>${soon("RSVP opens soon")}<p style="margin:0;font-style:italic;color:var(--muted-on-ink);max-width:40ch">Formal invitations and the RSVP link are on their way.</p></div>`;
  }

  /* ---------- nav behaviour ---------- */
  const nav = $("nav"), burger = $("burger");
  burger.addEventListener("click", () => { const open = nav.classList.toggle("open"); burger.setAttribute("aria-expanded", String(open)); });
  nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => { nav.classList.remove("open"); burger.setAttribute("aria-expanded", "false"); }));

  const secs = [...document.querySelectorAll("section[id]")].filter(s => !s.hidden);
  if ("IntersectionObserver" in window) {
    const links = [...nav.querySelectorAll("a[href^='#']")];
    const io = new IntersectionObserver((ents) => {
      ents.forEach(en => { if (en.isIntersecting) links.forEach(l => l.classList.toggle("active", l.getAttribute("href") === "#" + en.target.id)); });
    }, { rootMargin: "-40% 0px -55% 0px" });
    secs.forEach(s => io.observe(s));

    /* reveal: elements start visible; only those below the fold get the pre state */
    const rv = new IntersectionObserver((ents) => {
      ents.forEach(en => { if (en.isIntersecting) { en.target.classList.remove("pre"); rv.unobserve(en.target); } });
    }, { threshold: 0.08 });
    document.querySelectorAll(".reveal").forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.top > window.innerHeight) { el.classList.add("pre"); rv.observe(el); }
    });
  }
})();

