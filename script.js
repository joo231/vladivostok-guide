const PLACES = [
  {
    id: "eagles-nest",
    title: "Сопка Орлиное гнездо",
    meta: "виды • центр",
    desc: "Классическая смотровая: панорама бухты Золотой Рог, мосты и город. Отлично на рассвете и закате.",
    tags: ["views", "city", "quick"],
    time: 45,
    mapsQuery: "Сопка Орлиное гнездо Владивосток",
  },
  {
    id: "tokarev",
    title: "Токаревский маяк",
    meta: "море • закат",
    desc: "Ощущение края земли: вода, ветер, длинная коса и минималистичная геометрия маяка.",
    tags: ["sea", "views"],
    time: 90,
    mapsQuery: "Токаревский маяк Владивосток",
  },
  {
    id: "tsesarevich",
    title: "Набережная Цесаревича",
    meta: "прогулка • семья",
    desc: "Уютная набережная для неспешной прогулки, особенно вечером. Хороший старт для “морского” дня.",
    tags: ["sea", "city", "quick"],
    time: 75,
    mapsQuery: "Набережная Цесаревича Владивосток",
  },
  {
    id: "sportivnaya",
    title: "Спортивная набережная",
    meta: "центр • атмосфера",
    desc: "Городская классика: кофе, уличная жизнь, море рядом. Удобно совместить с центром.",
    tags: ["sea", "city"],
    time: 70,
    mapsQuery: "Спортивная набережная Владивосток",
  },
  {
    id: "svetlanskaya",
    title: "Улица Светланская",
    meta: "архитектура • прогулка",
    desc: "Историческая ось города: фасады, детали и настроение портового Владивостока.",
    tags: ["city", "history", "quick"],
    time: 80,
    mapsQuery: "Светланская улица Владивосток",
  },
  {
    id: "russky-bridge",
    title: "Русский мост (видовые точки)",
    meta: "мосты • масштаб",
    desc: "Один из символов города. Лучше смотреть с обзорных точек на Русском острове (ветер почти гарантирован).",
    tags: ["views", "sea"],
    time: 110,
    mapsQuery: "Русский мост Владивосток смотровая",
  },
  {
    id: "forts",
    title: "Форты (по настроению)",
    meta: "история • приключение",
    desc: "Если хочется чуть больше “экспедиции”: форты и укрепления вокруг города. Уточняйте доступность маршрутов.",
    tags: ["history", "views", "active"],
    time: 140,
    mapsQuery: "Форты Владивосток",
  },
  {
    id: "central-square",
    title: "Центр: площадь и окрестности",
    meta: "быстро • рядом",
    desc: "Небольшая городская петля: удобно, если у вас всего пару часов между делами.",
    tags: ["city", "quick"],
    time: 55,
    mapsQuery: "Центральная площадь Владивосток",
  },
];

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

function mapsUrl(query) {
  const q = encodeURIComponent(query);
  return `https://www.google.com/maps/search/?api=1&query=${q}`;
}

function unique(arr) {
  return Array.from(new Set(arr));
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function renderPlaces(filter) {
  const grid = $("#placesGrid");
  if (!grid) return;

  const filtered =
    filter === "all"
      ? PLACES
      : PLACES.filter((p) => p.tags.includes(filter));

  grid.innerHTML = filtered
    .map((p) => {
      const badges = unique(p.tags.filter((t) => t !== "active"))
        .slice(0, 4)
        .map((t) => `<span class="badge">${tagLabel(t)}</span>`)
        .join("");

      const accent = p.tags.includes("quick")
        ? `<span class="badge badge--accent">коротко</span>`
        : p.tags.includes("active")
          ? `<span class="badge badge--accent">поактивнее</span>`
          : "";

      return `
        <article class="place" data-place="${p.id}">
          <div class="place__top">
            <div>
              <h3 class="place__title">${escapeHtml(p.title)}</h3>
              <div class="place__meta">${escapeHtml(p.meta)} • ~${p.time} мин</div>
            </div>
          </div>
          <p class="place__desc">${escapeHtml(p.desc)}</p>
          <div class="place__badges">
            ${accent}
            ${badges}
          </div>
          <div class="place__actions">
            <a class="place__link" href="${mapsUrl(p.mapsQuery)}" target="_blank" rel="noreferrer">Открыть на карте</a>
            <button class="place__link" type="button" data-add="${p.id}">Добавить в план</button>
          </div>
        </article>
      `;
    })
    .join("");
}

function tagLabel(tag) {
  switch (tag) {
    case "views":
      return "виды";
    case "sea":
      return "море";
    case "city":
      return "центр";
    case "history":
      return "история";
    case "quick":
      return "быстро";
    case "active":
      return "активно";
    case "food":
      return "еда";
    default:
      return tag;
  }
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;")
    .replaceAll("'", "&#039;");
}

function getSelectedInterests(formEl) {
  const raw = $$('input[name="interest"]', formEl)
    .filter((i) => i.checked)
    .map((i) => i.value);
  return unique(raw);
}

function buildPlan({ pace, interests, seedIds = [] }) {
  const includeFood = interests.includes("food");
  const tagsWanted = interests.filter((t) => t !== "food");

  const basePool =
    tagsWanted.length === 0
      ? PLACES
      : PLACES.filter((p) => p.tags.some((t) => tagsWanted.includes(t)));

  const pool = shuffle(basePool);

  const targetStops = pace === "easy" ? 3 : pace === "active" ? 5 : 4;
  const chosen = [];

  for (const id of seedIds) {
    const p = PLACES.find((x) => x.id === id);
    if (p && !chosen.some((c) => c.id === p.id)) chosen.push(p);
  }

  for (const p of pool) {
    if (chosen.length >= targetStops) break;
    if (chosen.some((c) => c.id === p.id)) continue;
    chosen.push(p);
  }

  const totalMinutes =
    chosen.reduce((s, p) => s + p.time, 0) +
    (chosen.length - 1) * (pace === "easy" ? 18 : pace === "active" ? 26 : 22) +
    (includeFood ? 70 : 0);

  const name =
    pace === "easy"
      ? "Лёгкий день"
      : pace === "active"
        ? "Активный день"
        : "Нормальный день";

  return { name, includeFood, chosen, totalMinutes };
}

function renderPlan(plan) {
  const root = $("#planResult");
  if (!root) return;

  const hours = Math.max(1, Math.round((plan.totalMinutes / 60) * 10) / 10);
  const meta = `~${hours} ч • ${plan.chosen.length}${plural(plan.chosen.length, " остановка", " остановки", " остановок")}${plan.includeFood ? " + еда" : ""}`;

  const stopsHtml = plan.chosen
    .map((p, idx) => {
      const badges = unique(p.tags)
        .filter((t) => ["views", "sea", "city", "history", "quick"].includes(t))
        .slice(0, 4)
        .map((t) => `<span class="badge">${tagLabel(t)}</span>`)
        .join("");

      const timeLabel = idx === 0 ? `~${p.time} мин` : `~${p.time} мин + дорога`;

      return `
        <div class="stop">
          <div class="stop__top">
            <h4 class="stop__title">${escapeHtml(p.title)}</h4>
            <div class="stop__time">${escapeHtml(timeLabel)}</div>
          </div>
          <p class="stop__desc">${escapeHtml(p.desc)}</p>
          <div class="stop__badges">
            ${badges}
            <a class="place__link" href="${mapsUrl(p.mapsQuery)}" target="_blank" rel="noreferrer">Карта</a>
          </div>
        </div>
      `;
    })
    .join("");

  const foodHtml = plan.includeFood
    ? `
      <div class="stop">
        <div class="stop__top">
          <h4 class="stop__title">Пауза на еду</h4>
          <div class="stop__time">~70 мин</div>
        </div>
        <p class="stop__desc">Идеально между прогулкой и закатом: морепродукты/рамен/кофе с видом.</p>
        <div class="stop__badges">
          <span class="badge">еда</span>
          <span class="badge badge--accent">лучше бронировать вечером</span>
        </div>
      </div>
    `
    : "";

  root.innerHTML = `
    <div class="plan">
      <div class="plan__head">
        <div>
          <h3 class="plan__name">${escapeHtml(plan.name)}</h3>
          <div class="plan__meta">${escapeHtml(meta)}</div>
        </div>
        <button class="btn btn--ghost" type="button" id="copyPlanBtn">Скопировать план</button>
      </div>
      ${stopsHtml}
      ${foodHtml}
      <p class="muted">Подсказка: закат часто красивее у моря (маяк/набережные). Планируйте финальную точку ближе к воде.</p>
    </div>
  `;

  const copyBtn = $("#copyPlanBtn");
  if (copyBtn) {
    copyBtn.addEventListener("click", async () => {
      const lines = [
        `Владивосток — ${plan.name}`,
        meta,
        "",
        ...plan.chosen.map((p, i) => `${i + 1}. ${p.title} (${p.time} мин) — ${p.mapsQuery}`),
        ...(plan.includeFood ? ["", `+ Пауза на еду (70 мин)`] : []),
      ];
      await copyToClipboard(lines.join("\n"));
      toast(copyBtn, "Скопировано");
    });
  }
}

function plural(n, one, two, many) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return two;
  return many;
}

async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    ta.remove();
  }
}

function toast(anchorEl, text) {
  const prev = anchorEl.dataset.toast;
  anchorEl.dataset.toast = text;
  const original = anchorEl.textContent;
  anchorEl.textContent = text;
  setTimeout(() => {
    anchorEl.textContent = original;
    if (prev) anchorEl.dataset.toast = prev;
  }, 1200);
}

function setupFilters() {
  const chips = $$(".chip");
  if (chips.length === 0) return;

  chips.forEach((btn) => {
    btn.addEventListener("click", () => {
      chips.forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      renderPlaces(btn.dataset.filter || "all");
    });
  });
}

function setupPlanner() {
  const form = $("#planForm");
  if (!form) return;

  let seedIds = [];

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const pace = $("#pace")?.value || "normal";
    const interests = getSelectedInterests(form);
    const plan = buildPlan({ pace, interests, seedIds });
    seedIds = [];
    renderPlan(plan);
  });

  $("#shuffleBtn")?.addEventListener("click", () => {
    seedIds = [];
    const pace = $("#pace")?.value || "normal";
    const interests = getSelectedInterests(form);
    const plan = buildPlan({ pace, interests, seedIds });
    renderPlan(plan);
  });

  document.addEventListener("click", (e) => {
    const t = e.target;
    if (!(t instanceof HTMLElement)) return;
    const id = t.dataset.add;
    if (!id) return;
    seedIds = unique([...seedIds, id]).slice(0, 4);
    toast(t, "Добавлено");
  });
}

function setupMobileMenu() {
  const btn = $("#menuBtn");
  const nav = $("#mobileNav");
  if (!btn || !nav) return;

  btn.addEventListener("click", () => {
    const expanded = btn.getAttribute("aria-expanded") === "true";
    btn.setAttribute("aria-expanded", expanded ? "false" : "true");
    nav.hidden = expanded;
  });

  nav.addEventListener("click", (e) => {
    const t = e.target;
    if (t instanceof HTMLAnchorElement) {
      btn.setAttribute("aria-expanded", "false");
      nav.hidden = true;
    }
  });
}

function setupCopySiteLink() {
  $("#copyLinkBtn")?.addEventListener("click", async (e) => {
    const btn = e.currentTarget;
    if (!(btn instanceof HTMLElement)) return;
    const url = window.location.href;
    await copyToClipboard(url);
    toast(btn, "Скопировано");
  });
}

function init() {
  renderPlaces("all");
  setupFilters();
  setupPlanner();
  setupMobileMenu();
  setupCopySiteLink();
}

document.addEventListener("DOMContentLoaded", init);

