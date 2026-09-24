// Page logic. All cm / kg values are computed here from the source inches / pounds.
(() => {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);
  const cm = (inch) => Math.round(inch * 2.54);
  const kg = (lb, digits = 1) => (lb * 0.45359237).toFixed(digits).replace(/\.0$/, "");
  const ftIn = (inch) => `${Math.floor(inch / 12)}'${Math.round((inch % 12) * 10) / 10}"`;
  const usd = (n) => "US$" + (Number.isInteger(n) ? n : n.toFixed(2));
  const byId = (id) => PRODUCTS.find((p) => p.id === id);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  // Refurbished listings reuse the photos of the new model.
  const PARENT = { "refurb-underarm": "underarm-spring", "refurb-forearm": "forearm-spring" };
  const imagesOf = (p) => (PARENT[p.id] ? [...p.images, ...byId(PARENT[p.id]).images] : p.images);
  const coverOf = (p) => p.cover || imagesOf(p)[0];

  const heightRange = (p) => {
    const lo = Math.min(...p.sizes.map((s) => s.heightIn[0]));
    const hi = Math.max(...p.sizes.map((s) => s.heightIn[1]));
    return `${cm(lo)}-${cm(hi)} cm`;
  };
  const measureText = (s) => {
    if (!s.measure) return "";
    const where = s.measure === "hip" ? "floor to hip" : "floor to underarm";
    return `Measure ${where}: ${cm(s.measureIn[0])}-${cm(s.measureIn[1])} cm`;
  };

  // Safe storage: the page works without it.
  const store = {
    get(k, fallback) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : fallback; } catch { return fallback; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* private mode */ } }
  };

  let userHeight = 170;

  /* ---------------- Catalog ---------------- */
  const chips = $("#chips");
  const grid = $("#grid");
  let family = "all";

  function renderChips() {
    chips.innerHTML = FAMILIES.map((f) =>
      `<button type="button" class="chip" data-f="${f.key}" aria-pressed="${f.key === family}">${f.label}</button>`).join("");
  }
  chips.addEventListener("click", (e) => {
    const b = e.target.closest(".chip");
    if (!b) return;
    family = b.dataset.f;
    renderChips();
    renderGrid();
  });

  function renderGrid() {
    const list = PRODUCTS.filter((p) => family === "all" || p.family === family);
    if (!list.length) { grid.innerHTML = `<p class="grid__empty">No crutches in this group. Choose All to see the full range.</p>`; return; }
    grid.innerHTML = list.map((p) => `
      <button type="button" class="card" data-id="${p.id}">
        <div class="card__img${p.coverFill ? " card__img--fill" : ""}"><img src="img/${coverOf(p)}" alt="${esc(p.name + ", " + p.variant)}" loading="lazy"></div>
        <div>
          <p class="card__variant">${esc(p.variant)}</p>
          <p class="card__name">${esc(p.name)}</p>
          <p class="card__meta"><span>${p.sizes.length > 1 ? p.sizes.length + " sizes, " : ""}${heightRange(p)}</span><span class="card__price">${usd(p.priceUsd)}</span></p>
        </div>
      </button>`).join("");
  }
  grid.addEventListener("click", (e) => {
    const c = e.target.closest(".card");
    if (c) openProduct(c.dataset.id);
  });

  /* ---------------- Product dialog ---------------- */
  const pd = $("#pd");
  let current = null;
  let qty = 1;

  function openProduct(id, sizeKey) {
    const p = byId(id);
    current = p;
    qty = 1;
    $("#qty").textContent = qty;
    $("#pdErr").textContent = "";
    $("#pdVariant").textContent = p.variant;
    $("#pdTitle").textContent = p.name;
    $("#pdPrice").innerHTML = `${usd(p.priceUsd)} <small>per pair, US list price</small>`;
    $("#pdSummary").textContent = p.summary;
    $("#pdPoints").innerHTML = p.points.map((t) => `<li>${esc(t)}</li>`).join("");
    $("#pdNote").textContent = p.note || "";

    const imgs = imagesOf(p);
    setMain(imgs[0], p);
    $("#pdThumbs").innerHTML = imgs.map((f, i) =>
      `<button type="button" data-img="${f}" aria-label="Photo ${i + 1} of ${imgs.length}" aria-current="${i === 0}"><img src="img/${f}" alt="" loading="lazy"></button>`).join("");

    // Preselect: requested size, else the one that fits the ruler height, else nothing.
    const fitting = p.sizes.find((s) => userHeight >= cm(s.heightIn[0]) && userHeight <= cm(s.heightIn[1]));
    const pre = sizeKey || (p.sizes.length === 1 ? p.sizes[0].key : fitting && fitting.key);
    $("#pdSizes").innerHTML = `<legend>Size</legend>` + p.sizes.map((s) => `
      <label class="size">
        <input type="radio" name="size" value="${s.key}" ${s.key === pre ? "checked" : ""}>
        <span class="size__box">
          <span class="size__name">${s.label}</span>
          <span class="size__h">${cm(s.heightIn[0])}-${cm(s.heightIn[1])} cm <small>(${ftIn(s.heightIn[0])}-${ftIn(s.heightIn[1])})</small></span>
          <span class="size__detail">${esc(s.adjust)}${s.weightLb ? `. ${kg(s.weightLb)}&nbsp;kg per crutch` : ""}</span>
        </span>
      </label>`).join("");
    updateFit();

    if (!pd.open) pd.showModal();
    pd.scrollTop = 0;
  }

  function setMain(file, p) {
    const main = $("#pdMain");
    // Wide studio photos on grey fill the frame; cut-outs on white stay whole.
    main.onload = () => main.classList.toggle("is-wide", main.naturalWidth / main.naturalHeight > 1.3);
    main.src = `img/${file}`;
    main.alt = `${p.name}, ${p.variant}`;
  }

  function selectedSize() {
    const r = $("#pdSizes input:checked");
    return r ? current.sizes.find((s) => s.key === r.value) : null;
  }

  function updateFit() {
    const s = selectedSize();
    const bits = [];
    if (s) {
      if (measureText(s)) bits.push(measureText(s) + ".");
      if (s.note) bits.push(s.note);
    } else {
      bits.push("Choose a size to see the measurement it needs.");
    }
    $("#pdFit").textContent = bits.join(" ");
  }

  $("#pdSizes").addEventListener("change", () => { $("#pdErr").textContent = ""; updateFit(); });
  $("#pdThumbs").addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    setMain(b.dataset.img, current);
    $("#pdThumbs").querySelectorAll("button").forEach((x) => x.setAttribute("aria-current", x === b));
  });
  $("#qtyMinus").addEventListener("click", () => { qty = Math.max(1, qty - 1); $("#qty").textContent = qty; });
  $("#qtyPlus").addEventListener("click", () => { qty = Math.min(99, qty + 1); $("#qty").textContent = qty; });

  $("#pdForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const s = selectedSize();
    if (!s) { $("#pdErr").textContent = "Choose a size before adding to cart."; return; }
    addToCart(current.id, s.key, qty);
    pd.close();
    openCart();
  });

  /* ---------------- Cart ---------------- */
  const cartDlg = $("#cart");
  let cart = store.get("mm-cart", []);

  const lineKey = (l) => l.id + "|" + l.size;
  function addToCart(id, size, n) {
    const hit = cart.find((l) => lineKey(l) === id + "|" + size);
    if (hit) hit.qty = Math.min(99, hit.qty + n); else cart.push({ id, size, qty: n });
    saveCart();
    const c = $("#cartCount");
    c.classList.remove("bump"); void c.offsetWidth; c.classList.add("bump");
  }
  function saveCart() { store.set("mm-cart", cart); renderCart(); }

  function renderCart() {
    const count = cart.reduce((a, l) => a + l.qty, 0);
    $("#cartCount").textContent = count;
    const body = $("#cartBody");
    if (!cart.length) {
      body.innerHTML = `<div class="cart__empty"><p>Your cart is empty. Choose crutches and a size to add them here.</p><button type="button" class="btn btn--line" data-close>Browse crutches</button></div>`;
      $("#cartFoot").hidden = true;
      return;
    }
    $("#cartFoot").hidden = false;
    let total = 0;
    body.innerHTML = cart.map((l, i) => {
      const p = byId(l.id);
      const s = p.sizes.find((x) => x.key === l.size);
      const sum = p.priceUsd * l.qty;
      total += sum;
      return `<div class="line">
        <img src="img/${coverOf(p)}" alt="">
        <div>
          <p class="line__name">${esc(p.name)}</p>
          <p class="line__meta">${esc(p.variant)}, ${s.label} ${cm(s.heightIn[0])}-${cm(s.heightIn[1])} cm</p>
          <div class="line__qty">
            <button type="button" class="icon-btn" data-dec="${i}" aria-label="One pair fewer"><i class="ph ph-minus" aria-hidden="true"></i></button>
            <span>${l.qty} ${l.qty === 1 ? "pair" : "pairs"}</span>
            <button type="button" class="icon-btn" data-inc="${i}" aria-label="One pair more"><i class="ph ph-plus" aria-hidden="true"></i></button>
          </div>
          <button type="button" class="link-btn" data-rm="${i}">Remove</button>
        </div>
        <p class="line__price">${usd(Math.round(sum * 100) / 100)}</p>
      </div>`;
    }).join("");
    $("#cartTotal").textContent = usd(Math.round(total * 100) / 100);
  }

  $("#cartBody").addEventListener("click", (e) => {
    const t = e.target.closest("button");
    if (!t) return;
    if (t.dataset.inc) cart[+t.dataset.inc].qty = Math.min(99, cart[+t.dataset.inc].qty + 1);
    else if (t.dataset.dec) { const l = cart[+t.dataset.dec]; l.qty -= 1; if (l.qty < 1) cart.splice(+t.dataset.dec, 1); }
    else if (t.dataset.rm) cart.splice(+t.dataset.rm, 1);
    else return;
    saveCart();
  });

  function openCart() { renderCart(); if (!cartDlg.open) cartDlg.showModal(); }
  $("#cartOpen").addEventListener("click", openCart);

  $("#checkout").addEventListener("click", () => {
    const pairs = cart.reduce((a, l) => a + l.qty, 0);
    cart = [];
    store.set("mm-cart", cart);
    $("#cartCount").textContent = 0;
    $("#cartFoot").hidden = true;
    $("#cartBody").innerHTML = `<div class="cart__done">
      <h3>Order request recorded</h3>
      <p>${pairs} ${pairs === 1 ? "pair" : "pairs"} in this test order. This concept page takes no payment and sends nothing.</p>
      <button type="button" class="btn btn--line" data-close>Close</button></div>`;
  });

  // Close buttons and backdrop clicks for both dialogs.
  [pd, cartDlg].forEach((d) => {
    d.addEventListener("click", (e) => {
      if (e.target.closest("[data-close]")) { d.close(); return; }
      if (e.target === d) {
        const r = d.getBoundingClientRect();
        const inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
        if (!inside || d === cartDlg) d.close();
      }
    });
  });

  /* ---------------- Fit ruler ---------------- */
  const MIN = 120, MAX = 220;
  const pct = (v) => ((v - MIN) / (MAX - MIN)) * 100;

  const RULER = [
    { id: "underarm-spring", size: "short", name: "Underarm Pro, Short" },
    { id: "underarm-spring", size: "tall", name: "Underarm Pro, Tall" },
    { id: "forearm-spring", size: "short", name: "Forearm Pro, Short" },
    { id: "forearm-spring", size: "tall", name: "Forearm Pro, Tall" },
    { id: "youth", size: "one", name: "Youth" },
    { id: "a-frame", size: "tall-adult", name: "Standard A-Frame" }
  ].map((r) => {
    const s = byId(r.id).sizes.find((x) => x.key === r.size);
    return { ...r, lo: cm(s.heightIn[0]), hi: cm(s.heightIn[1]) };
  });

  function buildRuler() {
    let ticks = "";
    for (let v = MIN; v <= MAX; v += 5) {
      const major = v % 20 === 0;
      ticks += `<i class="ruler__tick${major ? " ruler__tick--major" : ""}" style="left:${pct(v)}%">${major ? `<span>${v}</span>` : ""}</i>`;
    }
    $("#rulerScale").innerHTML = ticks;
    $("#rulerRows").innerHTML = RULER.map((r, i) => `
      <button type="button" class="rrow" data-i="${i}" aria-label="${r.name}, ${r.lo} to ${r.hi} cm. Open product">
        <span class="rrow__label"><span class="rrow__name">${r.name}</span><span class="rrow__range">${r.lo}-${r.hi} cm</span></span>
        <span class="rrow__track"><span class="rrow__bar" style="left:${pct(r.lo)}%;width:${pct(r.hi) - pct(r.lo)}%"></span></span>
      </button>`).join("");
  }

  function updateRuler() {
    const range = $("#height");
    userHeight = +range.value;
    $("#heightOut").textContent = userHeight;
    const scale = $("#rulerScale");
    const ruler = $("#ruler");
    // Marker sits on the scale's coordinate system, which starts after the label column.
    const left = scale.offsetLeft + (scale.offsetWidth * pct(userHeight)) / 100;
    $("#rulerMarker").style.left = left + "px";
    const fits = [];
    ruler.querySelectorAll(".rrow").forEach((row) => {
      const r = RULER[+row.dataset.i];
      const ok = userHeight >= r.lo && userHeight <= r.hi;
      row.classList.toggle("is-fit", ok);
      if (ok) fits.push(r.name);
    });
    $("#fitResult").innerHTML = fits.length
      ? `At ${userHeight} cm: <strong>${fits.join(", ")}</strong>. Select a row to open it.`
      : `No model is listed for ${userHeight} cm. The range covers ${Math.min(...RULER.map((r) => r.lo))}-${Math.max(...RULER.map((r) => r.hi))} cm.`;
    store.set("mm-height", userHeight);
  }

  $("#height").addEventListener("input", updateRuler);
  $("#rulerRows").addEventListener("click", (e) => {
    const row = e.target.closest(".rrow");
    if (!row) return;
    const r = RULER[+row.dataset.i];
    openProduct(r.id, r.size);
  });
  new ResizeObserver(updateRuler).observe($("#ruler"));

  /* ---------------- Specs table ---------------- */
  function buildSpecs() {
    const cols = [
      { p: byId("underarm-spring"), title: "in-Motion Pro Underarm", post: "Spring, rigid, or both in a bundle" },
      { p: byId("forearm-spring"), title: "in-Motion Pro Forearm", post: "Spring, rigid, or both in a bundle" },
      { p: byId("youth"), title: "in-Motion Youth", post: "Rigid" },
      { p: byId("a-frame"), title: "Standard A-Frame", post: "Fixed A-frame" }
    ];
    const perSize = (p, fn) => p.sizes.map((s) => (p.sizes.length > 1 ? `<span class="sub">${s.label}</span>` : "") + fn(s)).join("");
    const rows = [
      ["Height", (c) => perSize(c.p, (s) => `${cm(s.heightIn[0])}-${cm(s.heightIn[1])} cm`)],
      ["Measurement", (c) => c.p.sizes[0].measure ? perSize(c.p, (s) => `${s.measure === "hip" ? "Floor to hip" : "Floor to underarm"} ${cm(s.measureIn[0])}-${cm(s.measureIn[1])} cm`) : "Not stated"],
      ["Adjustment", (c) => perSize(c.p, (s) => esc(s.adjust))],
      ["Weight per crutch", (c) => c.p.sizes[0].weightLb ? [...new Set(c.p.sizes.map((s) => kg(s.weightLb) + " kg"))].join(" / ") : "Set of two ships at 2.7 kg with packaging"],
      ["Weight capacity", (c) => `${kg(c.p.capacityLb, 0)} kg`],
      ["Lower post", (c) => c.post],
      ["Folds", (c) => c.p.folds === true ? "Yes" : c.p.folds === false ? "No" : "Not stated"],
      ["Warranty (US)", (c) => c.p.warranty || "Not stated"],
      ["US list price", (c) => {
        const same = PRODUCTS.filter((x) => x.family === c.p.family || (PARENT[x.id] === c.p.id));
        const prices = [...new Set(same.map((x) => x.priceUsd))].sort((a, b) => a - b);
        return prices.map(usd).join(" / ");
      }]
    ];
    // Phone: one block per model instead of a sideways-scrolling table.
    $("#specsCards").innerHTML = cols.map((c) => `
      <article class="scard">
        <h3>${c.title}</h3>
        <dl>${rows.map(([h, fn]) => `<div><dt>${h}</dt><dd>${fn(c)}</dd></div>`).join("")}</dl>
      </article>`).join("");
    $("#specsTable").innerHTML =
      `<thead><tr><th scope="col"><span class="sr">Specification</span></th>${cols.map((c) => `<th scope="col">${c.title}</th>`).join("")}</tr></thead>
       <tbody>${rows.map(([h, fn]) => `<tr><th scope="row">${h}</th>${cols.map((c) => `<td>${fn(c)}</td>`).join("")}</tr>`).join("")}</tbody>`;
  }

  /* ---------------- Trade form ---------------- */
  const EU = ["Austria", "Belgium", "Bulgaria", "Croatia", "Cyprus", "Czechia", "Denmark", "Estonia", "Finland", "France", "Germany", "Greece", "Hungary", "Ireland", "Italy", "Latvia", "Lithuania", "Luxembourg", "Malta", "Netherlands", "Poland", "Portugal", "Romania", "Slovakia", "Slovenia", "Spain", "Sweden"];
  $("#f-country").innerHTML = `<option value="">Choose</option>` + EU.map((c) => `<option>${c}</option>`).join("");
  const modelNames = [...new Set(PRODUCTS.map((p) => p.family === "refurbished" ? "Refurbished" : p.name))];
  $("#f-models").innerHTML = modelNames.map((m) =>
    `<label class="check"><input type="checkbox" name="models" value="${esc(m)}"><span>${esc(m)}</span></label>`).join("");

  $("#tradeForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const f = e.target;
    const checks = [
      ["f-org", "e-org", (v) => v.trim().length > 1, "Enter the name of your organisation."],
      ["f-type", "e-type", (v) => v !== "", "Choose the type of organisation."],
      ["f-country", "e-country", (v) => v !== "", "Choose your country."],
      ["f-email", "e-email", (v) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v), "Enter an email address like name@clinic.eu."]
    ];
    let firstBad = null;
    checks.forEach(([fid, eid, ok, msg]) => {
      const el = $("#" + fid);
      const good = ok(el.value);
      el.setAttribute("aria-invalid", !good);
      el.setAttribute("aria-describedby", eid);
      $("#" + eid).textContent = good ? "" : msg;
      if (!good && !firstBad) firstBad = el;
    });
    if (firstBad) { firstBad.focus(); return; }
    const data = Object.fromEntries(new FormData(f));
    data.models = [...f.querySelectorAll("input[name=models]:checked")].map((x) => x.value);
    const saved = store.get("mm-inquiries", []);
    saved.push({ ...data, at: new Date().toISOString() });
    store.set("mm-inquiries", saved);
    const done = $("#tradeDone");
    done.hidden = false;
    done.textContent = `Inquiry from ${data.org} saved in this browser. In this concept version nothing is sent.`;
    f.reset();
  });

  /* ---------------- Init ---------------- */
  const savedH = store.get("mm-height", null);
  if (savedH >= MIN && savedH <= MAX) $("#height").value = savedH;
  renderChips();
  renderGrid();
  buildRuler();
  updateRuler();
  buildSpecs();
  renderCart();
})();
