/* Seed loaves, shaped like the backend's Loaf model (title, body, author, happens_on). */
const LOAVES = {
  recipe: [
    { title: "Learn focaccia", body: "The dimpled kind, with rosemary.", author: "Zoie", happens_on: null },
    { title: "Fix the hall shelf", body: "It has leaned since March.", author: "Axcel", happens_on: null },
    { title: "Winter soup week", body: "Seven nights, seven pots.", author: "Zoie", happens_on: null }
  ],
  proofing: [
    { title: "Lisbon, in October", body: "Flights held, nothing booked.", author: "Axcel", happens_on: "2026-10-12" },
    { title: "Mum's birthday dinner", body: "She asked for the lemon one.", author: "Zoie", happens_on: "2026-09-20" }
  ],
  baking: [
    { title: "Sourdough starter, day 4", body: "Fed at 8pm. Smells like yoghurt.", author: "Axcel", happens_on: "2026-08-28" }
  ],
  cooled: [
    { title: "The flat white flat", body: "Two years in the small kitchen.", author: "Axcel", happens_on: "2024-06-01" },
    { title: "Cinnamon buns, try two", body: "Better. Still a little pale.", author: "Zoie", happens_on: "2025-02-01" },
    { title: "Christmas at the cabin", body: "Snowed in, on purpose.", author: "Zoie", happens_on: "2025-12-01" },
    { title: "Bike trip to the coast", body: "84km and one flat tyre.", author: "Axcel", happens_on: "2026-05-01" }
  ]
};

const META = {
  recipe: { label: "Recipes", desc: "Tickets on the rail. Someday, no date.", swatch: "#8a6a50" },
  proofing: { label: "Proofing", desc: "Resting under cloth, with a date.", swatch: "#f6b53c" },
  baking: { label: "In the oven", desc: "Happening right now. 232°C.", swatch: "#ef6f2e" },
  cooled: { label: "Cooled", desc: "Glazed, kept, on the wire rack.", swatch: "#8a4a1e" }
};

const ORDER = ["recipe", "proofing", "baking", "cooled"];

const clone = (o) => JSON.parse(JSON.stringify(o));

/* Display text for a loaf's date, which reads differently in each stage. */
function whenLabel(loaf, stage) {
  if (!loaf.happens_on) return "someday";
  const d = new Date(loaf.happens_on + "T00:00");
  const month = d.toLocaleString("en", { month: "short" });
  if (stage === "proofing") return `${d.getDate()} ${month.toUpperCase()}`;
  if (stage === "baking") return `since ${d.getDate()} ${month}`;
  return `${month} ${d.getFullYear()}`;
}

const state = { view: "kitchen", board: clone(LOAVES), dragging: null, over: null };

function move(stage, index, to) {
  const [item] = state.board[stage].splice(index, 1);
  if (!item) return;
  state.board[to].push(item);
  state.dragging = null;
  state.over = null;
  render();
}

function renderKitchen() {
  const b = state.board;
  const hero = b.baking[0];

  const proofingRows = b.proofing.map((l) => `
    <article class="proofing-row">
      <span class="date-chip">${whenLabel(l, "proofing")}</span>
      <div>
        <h4>${l.title}</h4>
        <p>${l.body}</p>
      </div>
    </article>
  `).join("");

  const recipeChips = b.recipe.map((l) => `<span class="chip">${l.title}</span>`).join("");

  const rackCards = b.cooled.map((l) => `
    <article class="rack-card">
      <div class="photo"><span>photo</span></div>
      <div class="body">
        <h4>${l.title}</h4>
        <p>${whenLabel(l, "cooled")} · ${l.author}</p>
      </div>
    </article>
  `).join("");

  return `
    <div class="kitchen">
      <section class="hero">
        <div class="hero-glow"></div>
        <div class="hero-art">
          <div class="steam"><span></span><span></span><span></span></div>
          <pixel32-sprite name="oven" scale="5"></pixel32-sprite>
        </div>
        <div class="hero-copy">
          <span class="chip-oven">in the oven · ${b.baking.length}</span>
          <h2>${hero ? hero.title : "Nothing in the oven"}</h2>
          <p>${hero ? hero.body : "The oven is warm and empty. Move something over from the counter."}</p>
          <div class="hero-actions">
            ${hero ? `<button class="btn btn-amber" data-action="pull-hero">take it out to cool</button>` : ""}
            <button class="btn btn-ghost" data-action="go-view" data-view="counter">open the counter</button>
            <span class="hero-when">${hero ? whenLabel(hero, "baking") : "—"}</span>
          </div>
        </div>
      </section>

      <div class="two-up">
        <section class="proofing-panel">
          <h3>Proofing</h3>
          <p class="sub">On the counter, with a date attached.</p>
          <div class="proofing-rows">${proofingRows}</div>
        </section>
        <section class="recipes-panel">
          <h3>Recipes</h3>
          <p class="sub">Someday, no date yet.</p>
          <div class="recipe-chips">${recipeChips}<span class="chip chip-dashed">+ write one down</span></div>
        </section>
      </div>

      <section class="rack-section">
        <div class="rack-head">
          <h3>The rack</h3>
          <p>${b.cooled.length} cooled and kept. Nothing gets thrown out.</p>
        </div>
        <div class="rack-grid">${rackCards}</div>
      </section>
    </div>
  `;
}

function nextStage(stage) {
  return ORDER[ORDER.indexOf(stage) + 1];
}

function renderCard(stage, item, index) {
  if (stage === "recipe") {
    return `
      <article class="card ticket" draggable="true" data-stage="${stage}" data-index="${index}">
        <div class="torn-top"></div>
        <div class="body">
          <div class="meta-row"><span>ORDER IN</span><span>${item.author}</span></div>
          <div class="divider"></div>
          <h3>${item.title}</h3>
          <p>${item.body}</p>
          <div class="footer-row">
            <span>no date</span>
            <button class="advance-btn" data-action="advance" data-stage="${stage}" data-index="${index}">→ ${META[nextStage(stage)].label.toLowerCase()}</button>
          </div>
        </div>
        <div class="torn-bottom"></div>
      </article>
    `;
  }

  if (stage === "proofing") {
    return `
      <article class="card dough" draggable="true" data-stage="${stage}" data-index="${index}">
        <h3>${item.title}</h3>
        <div class="cloth">
          <div class="cloth-row">
            <span class="date-chip">${whenLabel(item, stage)}</span>
            <span class="under-cloth">under cloth</span>
          </div>
          <p>${item.body}</p>
        </div>
        <div class="advance-wrap">
          <button class="advance-btn" data-action="advance" data-stage="${stage}" data-index="${index}">→ ${META[nextStage(stage)].label.toLowerCase()}</button>
        </div>
      </article>
    `;
  }

  if (stage === "baking") {
    return `
      <article class="card firebox" draggable="true" data-stage="${stage}" data-index="${index}">
        <h3>${item.title}</h3>
        <div class="art-well">
          <div class="glow"></div>
          <pixel32-sprite name="oven" scale="3"></pixel32-sprite>
        </div>
        <div class="advance-wrap">
          <button class="advance-btn" data-action="advance" data-stage="${stage}" data-index="${index}">→ ${META[nextStage(stage)].label.toLowerCase()}</button>
        </div>
      </article>
    `;
  }

  return `
    <article class="card keeper" draggable="true" data-stage="${stage}" data-index="${index}">
      <h3>${item.title}</h3>
      <div class="panel">
        <p>${item.body}</p>
        <div class="meta-row"><span>${whenLabel(item, stage)}</span><span>${item.author}</span></div>
      </div>
      <div class="wire-rack"></div>
    </article>
  `;
}

const DROP_HINTS = {
  recipe: "pin a ticket here",
  proofing: "set dough here",
  baking: "slide it in",
  cooled: "rest it here"
};

function renderColumn(stage) {
  const items = state.board[stage];
  const meta = META[stage];
  const hovered = state.over === stage && state.dragging && state.dragging.stage !== stage;

  return `
    <section class="column col-${stage}${hovered ? " drag-over" : ""}" data-column="${stage}">
      <div class="column-head">
        <span class="swatch" style="background:${meta.swatch}"></span>
        <h2>${meta.label}</h2>
        <span class="column-count">${items.length}</span>
      </div>
      <p class="column-desc">${meta.desc}</p>
      <div class="rail"></div>
      ${items.map((item, i) => renderCard(stage, item, i)).join("")}
      <div class="drop-hint">${DROP_HINTS[stage]}</div>
    </section>
  `;
}

function renderCounter() {
  return `
    <div class="toolbar">
      <p>Drag a loaf to another column, or tap the arrow on a card.</p>
      <button class="btn-new-loaf">+ new loaf</button>
    </div>
    <div class="board">
      ${ORDER.map(renderColumn).join("")}
    </div>
  `;
}

function render() {
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.view === state.view);
  });

  const root = document.getElementById("view-root");
  root.innerHTML = state.view === "kitchen" ? renderKitchen() : renderCounter();
}

document.addEventListener("click", (e) => {
  const actionEl = e.target.closest("[data-action]");
  if (!actionEl) return;
  const action = actionEl.dataset.action;

  if (action === "go-view") {
    state.view = actionEl.dataset.view;
    render();
  } else if (action === "pull-hero") {
    move("baking", 0, "cooled");
  } else if (action === "advance") {
    const stage = actionEl.dataset.stage;
    const index = Number(actionEl.dataset.index);
    move(stage, index, nextStage(stage));
  }
});

document.addEventListener("dragstart", (e) => {
  const card = e.target.closest(".card");
  if (!card) return;
  state.dragging = { stage: card.dataset.stage, index: Number(card.dataset.index) };
});

document.addEventListener("dragend", () => {
  state.dragging = null;
  state.over = null;
  render();
});

document.addEventListener("dragover", (e) => {
  const column = e.target.closest(".column");
  if (!column) return;
  e.preventDefault();
  const stage = column.dataset.column;
  if (state.over === stage) return;
  state.over = stage;
  /* Toggle the highlight in place: re-rendering mid-drag would remove the dragged card. */
  document.querySelectorAll(".column").forEach((col) => {
    const hovered = col.dataset.column === stage && state.dragging && state.dragging.stage !== stage;
    col.classList.toggle("drag-over", Boolean(hovered));
  });
});

document.addEventListener("drop", (e) => {
  const column = e.target.closest(".column");
  if (!column) return;
  e.preventDefault();
  const stage = column.dataset.column;
  if (state.dragging && state.dragging.stage !== stage) {
    move(state.dragging.stage, state.dragging.index, stage);
  } else {
    state.dragging = null;
    state.over = null;
    render();
  }
});

document.getElementById("logout").addEventListener("click", async (e) => {
  e.preventDefault();
  await fetch("/api/logout", { method: "POST" });
  window.location.href = "/";
});

/* Signed-out visitors go back to the login page. */
fetch("/api/me").then(async (res) => {
  if (!res.ok) {
    window.location.href = "/";
    return;
  }
  const user = await res.json();
  document.getElementById("signed-in-name").textContent =
    user.name.charAt(0).toUpperCase() + user.name.slice(1);
  render();
});
