const LOAVES = {
  recipe: [
    { title: "Learn focaccia", note: "The dimpled kind, with rosemary.", who: "Zoie", when: "someday" },
    { title: "Fix the hall shelf", note: "It has leaned since March.", who: "Axcel", when: "someday" },
    { title: "Winter soup week", note: "Seven nights, seven pots.", who: "Zoie", when: "someday" }
  ],
  proofing: [
    { title: "Lisbon, in October", note: "Flights held, nothing booked.", who: "Axcel", when: "12 OCT" },
    { title: "Mum's birthday dinner", note: "She asked for the lemon one.", who: "Zoie", when: "20 SEP" }
  ],
  baking: [
    { title: "Sourdough starter, day 4", note: "Fed at 8pm. Smells like yoghurt.", who: "Axcel", when: "since 28 Aug" }
  ],
  cooled: [
    { title: "The flat white flat", note: "Two years in the small kitchen.", who: "both", when: "Jun 2024" },
    { title: "Cinnamon buns, try two", note: "Better. Still a little pale.", who: "Zoie", when: "Feb 2025" },
    { title: "Christmas at the cabin", note: "Snowed in, on purpose.", who: "both", when: "Dec 2025" },
    { title: "Bike trip to the coast", note: "84km and one flat tyre.", who: "Axcel", when: "May 2026" }
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
      <span class="date-chip">${l.when}</span>
      <div>
        <h4>${l.title}</h4>
        <p>${l.note}</p>
      </div>
    </article>
  `).join("");

  const recipeChips = b.recipe.map((l) => `<span class="chip">${l.title}</span>`).join("");

  const rackCards = b.cooled.map((l) => `
    <article class="rack-card">
      <div class="photo"><span>photo</span></div>
      <div class="body">
        <h4>${l.title}</h4>
        <p>${l.when} · ${l.who}</p>
      </div>
    </article>
  `).join("");

  return `
    <div class="kitchen">
      <section class="hero">
        <div class="hero-glow"></div>
        <div class="hero-art">
          <div class="steam"><span></span><span></span><span></span></div>
          <div class="sprite-slot" data-sprite="oven" data-scale="10"></div>
        </div>
        <div class="hero-copy">
          <span class="chip-oven">in the oven · ${b.baking.length}</span>
          <h2>${hero ? hero.title : "Nothing in the oven"}</h2>
          <p>${hero ? hero.note : "The oven is warm and empty. Move something over from the counter."}</p>
          <div class="hero-actions">
            ${hero ? `<button class="btn btn-amber" data-action="pull-hero">take it out to cool</button>` : ""}
            <button class="btn btn-ghost" data-action="go-view" data-view="counter">open the counter</button>
            <span class="hero-when">${hero ? hero.when : "—"}</span>
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
          <div class="meta-row"><span>ORDER IN</span><span>${item.who}</span></div>
          <div class="divider"></div>
          <h3>${item.title}</h3>
          <p>${item.note}</p>
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
            <span class="date-chip">${item.when}</span>
            <span class="under-cloth">under cloth</span>
          </div>
          <p>${item.note}</p>
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
          <div class="sprite-slot" data-sprite="oven" data-scale="6"></div>
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
        <p>${item.note}</p>
        <div class="meta-row"><span>${item.when}</span><span>${item.who}</span></div>
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
  window.OvenSprites.clearFire();
  root.innerHTML = state.view === "kitchen" ? renderKitchen() : renderCounter();
  window.OvenSprites.fill(root);
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
  if (state.over !== stage) {
    state.over = stage;
    render();
  }
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

render();
