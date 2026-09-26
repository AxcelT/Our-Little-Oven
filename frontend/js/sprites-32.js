/* Our Little Oven — sprites drawn on a 32-pixel grid (higher fidelity than the
   16px 8-bit set): 7-shade crusts, arched cast-iron oven, animated hearth fire.
   <pixel32-sprite name="boule" scale="3"> */

if (!window.__dc32SpritesLoaded) {
window.__dc32SpritesLoaded = true;

const MAPS = {
  boule: [
    "............................",
    ".........oooooooooo.........",
    ".......oo2222233344oo.......",
    ".....oo11111222334444oo.....",
    "....o111111112223444445o....",
    "...o11111111112234444455o...",
    "..o211111sssss22344444566o..",
    "..o211111s111s22344445566o..",
    ".o221111111111224444455667o.",
    ".o2221111111122s4444455567o.",
    ".o332222112222ss4444555566o.",
    "o33332222222233344445555667o",
    "o33333333333333444455556667o",
    "o33333333333333444455566667o",
    ".o333333333344444455556666o.",
    ".o333333444444444555566667o.",
    ".o444444444444445555666677o.",
    ".o444444444444555556666777o.",
    "..o4444444445555556666777o..",
    "...o44444555555556666777o...",
    "...o45555555555666667777o...",
    "....oo5665555666666777oo....",
    "......o66666666666777o......",
    ".......ooo77666677ooo.......",
    "..........oooooooo.........."
  ],
  baguette: [
    "................................",
    "..oooooooooooooooooooooooooooo..",
    ".o2222111111111111111444455566o.",
    ".o11111s1111s111s1111s11156666o.",
    "o2111111s111s1111s1111s11556677o",
    "o33333331s111s1111s444455555677o",
    "o333333333333333344444555566667o",
    "o333333333333344444455555666677o",
    "o334444444444444445555566666777o",
    "o444444444444555555556666677777o",
    ".o4444555555555556666667777777o.",
    "..oo555666666666666677777777oo..",
    "....oooooooooooooooooooooooo...."
  ],
  bun: [
    "......................",
    ".......oooooooo.......",
    ".....oo12223334oo.....",
    "...oo111112234444oo...",
    "..o2111111122444456o..",
    "..o11111s1122444456o..",
    ".o22111111s224445567o.",
    ".o221111112s34445556o.",
    ".o322221222344445556o.",
    "o33332222333444555667o",
    "o33333333334445556667o",
    ".o333333444444555666o.",
    ".o344444444455556667o.",
    ".o444444444555566677o.",
    "..o4444455555566677o..",
    "...o55555555666677o...",
    "....o666556666677o....",
    ".....oo76666677oo.....",
    ".......oooooooo......."
  ],
  oven: [
    "....................oooo........",
    "....................oCCo........",
    "....................oCCo........",
    "....................oCCo........",
    ".oooooooooooooooooooooooooooooo.",
    ".oEEEEEEEEEEEEEEEEEEEEEEEEEEEEo.",
    ".oDDDDDDDDDDDDDDDDDDDDDDDDDDDDo.",
    ".oooooooooooooooooooooooooooooo.",
    "..oCCCCCCCCCCCCCCCCCCCCCCCCCCo..",
    "..oCBBBBBBBBBBBBBBBBBBBBBBBBCo..",
    "..oCBBBBooooooooooBBBBBBBBBBBo..",
    "..oCBBBoossssssssooBBBwwwwwwBo..",
    "..oCBBoossssssssssooBBBwwwwBBo..",
    "..oCBoossssssssssssooBBwEEwBBo..",
    "..oCBossssssssssssssoBBwwwwBBo..",
    "..oCBossssssssssssssoBBBwwBBBo..",
    "..oCBossssssssssssssoBBBBBBBBo..",
    "..oCBossssssssssssssoBooooooBo..",
    "..oCBossssssssssssssoBBBBBBBBo..",
    "..oCBossssssssssssssoBooooooBo..",
    "..oCBossssssssssssssoBBBBBBBBo..",
    "..oCBossssssssssssssoBooooooBo..",
    "..oCBooooooooooooooooBBBBBBBBo..",
    "..oCBBBBBBBBBBBBBBBBBBBBBBBBBo..",
    "..oCBBBBBBBBBBBBBBBBBBBBBBBBBo..",
    ".oooooooooooooooooooooooooooooo.",
    ".oCCCCCCCCCCCCCCCCCCCCCCCCCCCCo.",
    ".oBBBBBBBBBBBBBBBBBBBBBBBBBBBBo.",
    ".oooooooooooooooooooooooooooooo.",
    "...ooo....................ooo...",
    "...oBo....................oBo...",
    "..ooooo..................ooooo.."
  ]
};

/* animated hearth, 14x6, sits inside the oven door at (6,16) */
const FIRE_FRAMES = [
  [
    "......mm......",
    "....mrrrrm....",
    "...mrrggrrm...",
    "..mrgghhggrm..",
    ".mrrgghhhggrm.",
    "mrrggghhhgggrm"
  ],
  [
    ".....mm.......",
    "...mrrrrm.....",
    "..mrrggrrm....",
    ".mrgghhggrm...",
    "mrrgghhhggrm..",
    "mrrggghhhgggrm"
  ],
  [
    ".......mm.....",
    ".....mrrrrm...",
    "....mrrggrrm..",
    "...mrgghhggrm.",
    "..mrrgghhhggrm",
    "mrrggghhhgggrm"
  ]
];

const PALETTES = {
  bread: {
    o: "#6b4226", s: "#d9863a", f: "#fff8e4",
    1: "#fff4d8", 2: "#ffe4ab", 3: "#ffd07d", 4: "#f8b95a",
    5: "#e79a3d", 6: "#c9752b", 7: "#a1541f"
  },
  oven: {
    o: "#4a2a18", K: "#2e1a10", B: "#7a4a26", C: "#96602f", D: "#b57c42",
    E: "#d99a55", w: "#ffeec9", s: "#2e1a10",
    m: "#b3491c", r: "#f4772c", g: "#ffb63c", h: "#fff0a8"
  }
};

const SCALES = { oven: 4, boule: 3, baguette: 3, bun: 4 };

function pixelShadow(map, palette, scale) {
  const parts = [];
  map.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      const colour = palette[row[x]];
      if (colour) parts.push(`${x * scale}px ${y * scale}px 0 0 ${colour}`);
    }
  });
  return parts.join(",");
}

function renderSprite(map, palette, scale) {
  const wrap = document.createElement("div");
  wrap.style.position = "relative";
  wrap.style.flex = "none";
  wrap.style.width = map[0].length * scale + "px";
  wrap.style.height = map.length * scale + "px";
  const pixels = document.createElement("div");
  pixels.style.position = "absolute";
  pixels.style.left = "0";
  pixels.style.top = "0";
  pixels.style.width = scale + "px";
  pixels.style.height = scale + "px";
  pixels.style.boxShadow = pixelShadow(map, palette, scale);
  wrap.appendChild(pixels);
  return wrap;
}

class Pixel32Sprite extends HTMLElement {
  connectedCallback() { this.draw(); }
  static get observedAttributes() { return ["name", "scale"]; }
  attributeChangedCallback() { if (this.isConnected) this.draw(); }
  draw() {
    const name = this.getAttribute("name") || "boule";
    const scale = Number(this.getAttribute("scale")) || SCALES[name] || 3;
    const map = MAPS[name];
    if (!map) return;
    const palette = PALETTES[name] || PALETTES.bread;
    this.style.display = "inline-block";
    this.style.lineHeight = "0";
    this.innerHTML = "";
    const sprite = renderSprite(map, palette, scale);
    this.appendChild(sprite);
    clearInterval(this._fire);
    if (name === "oven") {
      const fire = document.createElement("div");
      fire.style.position = "absolute";
      fire.style.left = 6 * scale + "px";
      fire.style.top = 16 * scale + "px";
      sprite.appendChild(fire);
      let frame = 0;
      const drawFire = () => {
        fire.innerHTML = "";
        fire.appendChild(renderSprite(FIRE_FRAMES[frame], PALETTES.oven, scale));
        frame = (frame + 1) % FIRE_FRAMES.length;
      };
      drawFire();
      this._fire = setInterval(drawFire, 1000 / 7);
    }
  }
  disconnectedCallback() { clearInterval(this._fire); }
}

if (!customElements.get("pixel32-sprite")) customElements.define("pixel32-sprite", Pixel32Sprite);
}
