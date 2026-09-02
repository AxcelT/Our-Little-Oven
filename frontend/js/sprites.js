/* Pixel sprites for Our Little Oven.
   Each sprite is a character map; a palette maps characters to colours.
   Rendered as a single element whose box-shadow paints every pixel. */

const MAPS = {
  oven: [
    "................",
    "..DDDDDDDDDDDD..",
    "..DLLLLLLLLLLD..",
    "..DLBBBBBBBBLD..",
    "..DDDDDDDDDDDD..",
    "..DBBKBBBBKBBD..",
    "..DBBBBBBBBBBD..",
    "..DDOOOOOOOODD..",
    "..DDOOOOOOOODD..",
    "..DDOOOOOOOODD..",
    "..DDOOOOOOOODD..",
    "..DBBBBBBBBBBD..",
    "..DBBHHHHHHBBD..",
    "..DDDDDDDDDDDD..",
    "..DD........DD..",
    "................"
  ],
  boule: [
    "...DDDDDD...",
    "..DCCCCCCD..",
    ".DCCSSCCCCD.",
    "DCCSCCSCCCCD",
    "DCCCCCSCCCCD",
    ".DCCCCCCCCD.",
    "..DDDDDDDD.."
  ],
  baguette: [
    "...DDDDDDDD...",
    ".DDCCCCCCCCDD.",
    "DCCSCCSCCSCCCD",
    "DCCCCCCCCCCCCD",
    ".DDCCCCCCCCDD.",
    "...DDDDDDDD..."
  ],
  bun: [
    "..DDDD..",
    ".DCCCCD.",
    "DCCSSCCD",
    "DCCCCCCD",
    ".DCCCCD.",
    "..DDDD.."
  ],
  baker: [
    "...WWWWWW...",
    "..WWWWWWWW..",
    ".WWWWWWWWWW.",
    ".DDDDDDDDDD.",
    "..HHHHHHHH..",
    "..KKKKKKKK..",
    "..KEKKKKEK..",
    "..KKKKKKKK..",
    "..KKKMMKKK..",
    "...KKKKKK...",
    "...DAAAAD...",
    "..AAAAAAAA..",
    ".AAAAAAAAAA.",
    ".AAAAAAAAAA."
  ]
};

const FIRE_FRAMES = [
  ["..oo....", ".oyyo.o.", "oyyyyooo"],
  ["...oo...", ".o.oyyo.", "ooyyyyoo"],
  [".oo..o..", ".oyyooy.", "oyyyoyyo"]
];

const PALETTES = {
  oven: {
    D: "#160c07", L: "#d08a4a", B: "#a35a2a", K: "#f6b53c",
    O: "#120a06", H: "#f6b53c", o: "#ef6f2e", y: "#ffd76a"
  },
  bread: { D: "#5e3312", C: "#d59a52", S: "#f2cd90" },
  "baker-1": {
    W: "#fff8e8", D: "#2e1a11", H: "#4a2c16", K: "#e8b48a",
    E: "#2e1a11", M: "#a8563a", A: "#ef6f2e"
  },
  "baker-2": {
    W: "#fff8e8", D: "#2e1a11", H: "#1f1410", K: "#b57f56",
    E: "#2e1a11", M: "#a8563a", A: "#c9762f"
  }
};

const SCALES = { oven: 9, boule: 5, baguette: 5, bun: 5, "baker-1": 3, "baker-2": 3 };

/* Build the box-shadow value that paints one pixel map. */
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

/* Fill every [data-sprite] slot on the page. */
document.querySelectorAll("[data-sprite]").forEach((slot) => {
  const name = slot.dataset.sprite;
  const scale = SCALES[name] || 4;
  const map = MAPS[name] || MAPS[name.replace(/-\d+$/, "")];
  const palette =
    PALETTES[name] ||
    (name === "oven" ? PALETTES.oven : PALETTES.bread);

  slot.appendChild(renderSprite(map, palette, scale));

  /* The oven gets an animated fire in its door opening (cols 4-11, rows 8-10). */
  if (name === "oven") {
    const fire = document.createElement("div");
    fire.style.position = "absolute";
    fire.style.left = 4 * scale + "px";
    fire.style.top = 8 * scale + "px";
    slot.firstChild.appendChild(fire);

    let frame = 0;
    const drawFire = () => {
      fire.innerHTML = "";
      fire.appendChild(renderSprite(FIRE_FRAMES[frame], PALETTES.oven, scale));
      frame = (frame + 1) % FIRE_FRAMES.length;
    };
    drawFire();
    setInterval(drawFire, 1000 / 7);
  }
});
