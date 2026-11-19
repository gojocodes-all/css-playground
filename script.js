"use strict";

const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

const defaultItemNames = [
  ["Alpha", "short content"],
  ["Bravo", "larger baseline"],
  ["Charlie", "unnecessarily-long-content"],
  ["Delta", "flex item"],
  ["Echo", "flex item"],
  ["Foxtrot", "flex item"],
  ["Golf", "new item"],
  ["Hotel", "new item"],
  ["India", "new item"],
  ["Juliet", "new item"]
];

function createItem(index) {
  const [name, subtitle] = defaultItemNames[index] || [`Item ${index + 1}`, "new item"];
  return {
    id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
    name,
    subtitle,
    order: 0,
    grow: 0,
    shrink: 1,
    basisType: "px",
    basisValue: 110,
    alignSelf: "auto",
    marginStartAuto: false,
    marginEndAuto: false,
    minMainZero: false
  };
}

const state = {
  container: {
    display: "flex",
    direction: "row",
    wrap: "wrap",
    justify: "flex-start",
    alignItems: "stretch",
    alignContent: "stretch",
    rowGap: 12,
    columnGap: 12,
    width: 760,
    height: 420
  },
  items: Array.from({ length: 6 }, (_, index) => createItem(index)),
  selectedId: null,
  showAxes: true,
  showLabels: true,
  showLines: true,
  animate: true,
  codeView: "css",
  lastConcept: "overview",
  completedChallenges: new Set()
};
state.selectedId = state.items[0].id;

const elements = {
  flexStage: $("#flexStage"),
  lineOverlays: $("#lineOverlays"),
  mainAxis: $("#mainAxis"),
  crossAxis: $("#crossAxis"),
  itemPicker: $("#itemPicker"),
  codeOutput: $("#codeOutput"),
  measurementList: $("#measurementList"),
  copyStatus: $("#copyStatus"),
  alignContentWarning: $("#alignContentWarning"),
  challengeFeedback: $("#challengeFeedback"),
  hintBox: $("#hintBox")
};

const presets = [
  { name: "Reset lab", icon: "↺", apply: resetState },
  {
    name: "Grow race",
    icon: "🌱",
    apply() {
      applyBaseContainer({ direction: "row", wrap: "nowrap", justify: "flex-start", alignItems: "stretch", width: 820, height: 350 });
      ensureItemCount(4);
      state.items.forEach((item, index) => Object.assign(item, { basisType: "px", basisValue: 70, grow: index + 1, shrink: 1, order: 0 }));
      selectFirst();
      setConcept("grow");
    }
  },
  {
    name: "Shrink battle",
    icon: "📉",
    apply() {
      applyBaseContainer({ direction: "row", wrap: "nowrap", justify: "flex-start", alignItems: "stretch", width: 430, height: 320 });
      ensureItemCount(4);
      state.items.forEach((item, index) => Object.assign(item, { basisType: "px", basisValue: 180, grow: 0, shrink: index === 0 ? 0 : index, order: 0, minMainZero: true }));
      selectFirst();
      setConcept("shrink");
    }
  },
  {
    name: "Equal columns",
    icon: "▥",
    apply() {
      applyBaseContainer({ direction: "row", wrap: "nowrap", justify: "flex-start", alignItems: "stretch", width: 800, height: 350 });
      ensureItemCount(3);
      state.items.forEach(item => Object.assign(item, { basisType: "zero", basisValue: 0, grow: 1, shrink: 1, order: 0 }));
      selectFirst();
      setConcept("basis");
    }
  },
  {
    name: "Navbar trick",
    icon: "⇥",
    apply() {
      applyBaseContainer({ direction: "row", wrap: "nowrap", justify: "flex-start", alignItems: "center", width: 820, height: 230 });
      ensureItemCount(4);
      state.items.forEach(item => Object.assign(item, { basisType: "auto", grow: 0, shrink: 1, order: 0, marginStartAuto: false, marginEndAuto: false }));
      state.items[3].marginStartAuto = true;
      selectItem(state.items[3].id);
      setConcept("autoMargin");
    }
  },
  {
    name: "Wrapped cards",
    icon: "▦",
    apply() {
      applyBaseContainer({ direction: "row", wrap: "wrap", justify: "flex-start", alignItems: "stretch", alignContent: "flex-start", width: 690, height: 520, rowGap: 16, columnGap: 16 });
      ensureItemCount(6);
      state.items.forEach(item => Object.assign(item, { basisType: "px", basisValue: 180, grow: 1, shrink: 1, order: 0 }));
      selectFirst();
      setConcept("wrap");
    }
  },
  {
    name: "align-content lab",
    icon: "↕",
    apply() {
      applyBaseContainer({ direction: "row", wrap: "wrap", justify: "flex-start", alignItems: "center", alignContent: "space-between", width: 520, height: 600, rowGap: 8, columnGap: 8 });
      ensureItemCount(6);
      state.items.forEach(item => Object.assign(item, { basisType: "px", basisValue: 145, grow: 0, shrink: 1, order: 0 }));
      selectFirst();
      setConcept("alignContent");
    }
  },
  {
    name: "Order chaos",
    icon: "🔀",
    apply() {
      applyBaseContainer({ direction: "row", wrap: "wrap", justify: "center", alignItems: "center", width: 720, height: 440 });
      ensureItemCount(6);
      const orders = [4, -2, 3, 0, -1, 2];
      state.items.forEach((item, index) => Object.assign(item, { basisType: "px", basisValue: 110, grow: 0, shrink: 1, order: orders[index] }));
      selectFirst();
      setConcept("order");
    }
  },
  {
    name: "Column stack",
    icon: "↧",
    apply() {
      applyBaseContainer({ direction: "column", wrap: "nowrap", justify: "space-evenly", alignItems: "center", width: 600, height: 620 });
      ensureItemCount(5);
      state.items.forEach(item => Object.assign(item, { basisType: "px", basisValue: 70, grow: 0, shrink: 1, order: 0 }));
      selectFirst();
      setConcept("direction");
    }
  },
  {
    name: "Baseline test",
    icon: "Aa",
    apply() {
      applyBaseContainer({ direction: "row", wrap: "nowrap", justify: "center", alignItems: "baseline", width: 760, height: 320 });
      ensureItemCount(5);
      state.items.forEach(item => Object.assign(item, { basisType: "px", basisValue: 115, grow: 0, shrink: 1, order: 0, alignSelf: "auto" }));
      selectFirst();
      setConcept("alignItems");
    }
  }
];

const challenges = [
  {
    kicker: "FOUNDATIONS",
    title: "Perfect centre",
    prompt: "Place every item exactly in the centre of the container, horizontally and vertically, while keeping one flex line.",
    goal: "Target: row + nowrap + centred on both axes",
    hint: "Use justify-content for the main axis and align-items for the cross axis.",
    setup() {
      applyBaseContainer({ direction: "row", wrap: "nowrap", justify: "flex-start", alignItems: "flex-start", width: 720, height: 430 });
      ensureItemCount(3);
      resetItems({ basisType: "px", basisValue: 105, grow: 0, shrink: 1 });
    },
    check() {
      const c = state.container;
      return c.direction === "row" && c.wrap === "nowrap" && c.justify === "center" && c.alignItems === "center";
    }
  },
  {
    kicker: "FREE SPACE",
    title: "Three equal columns",
    prompt: "Make all three items consume the entire row as perfectly equal columns, even though their content differs.",
    goal: "Target: each item uses flex: 1 1 0%",
    hint: "Give every item grow: 1 and basis: 0%. Keep them on one line.",
    setup() {
      applyBaseContainer({ direction: "row", wrap: "nowrap", justify: "flex-start", alignItems: "stretch", width: 780, height: 380 });
      ensureItemCount(3);
      resetItems({ basisType: "px", basisValue: 110, grow: 0, shrink: 1 });
    },
    check() {
      return state.container.wrap === "nowrap" && state.items.length === 3 && state.items.every(item => item.grow === 1 && item.basisType === "zero");
    }
  },
  {
    kicker: "NEGATIVE SPACE",
    title: "The stubborn first item",
    prompt: "The container is too narrow. Prevent Item 1 from shrinking while the other items absorb the shortage.",
    goal: "Target: Item 1 shrink factor is 0; others may shrink",
    hint: "Select Item 1 and set flex-shrink to 0.",
    setup() {
      applyBaseContainer({ direction: "row", wrap: "nowrap", justify: "flex-start", alignItems: "stretch", width: 420, height: 330 });
      ensureItemCount(3);
      resetItems({ basisType: "px", basisValue: 190, grow: 0, shrink: 1, minMainZero: true });
    },
    check() {
      return state.items[0].shrink === 0 && state.items.slice(1).some(item => item.shrink > 0);
    }
  },
  {
    kicker: "VISUAL ORDER",
    title: "C, A, B",
    prompt: "Use only the order property so the first three DOM items appear visually as Charlie, Alpha, Bravo.",
    goal: "Target visual order: Item 3 → Item 1 → Item 2",
    hint: "Lower order values appear first. Try Item 3 = -1, Item 1 = 0, Item 2 = 1.",
    setup() {
      applyBaseContainer({ direction: "row", wrap: "nowrap", justify: "center", alignItems: "center", width: 720, height: 340 });
      ensureItemCount(3);
      resetItems({ basisType: "px", basisValue: 120, grow: 0, shrink: 1, order: 0 });
    },
    check() {
      const sorted = state.items.slice(0, 3).map((item, index) => ({ id: item.id, order: item.order, dom: index })).sort((a, b) => a.order - b.order || a.dom - b.dom);
      return sorted[0].id === state.items[2].id && sorted[1].id === state.items[0].id && sorted[2].id === state.items[1].id;
    }
  },
  {
    kicker: "MULTI-LINE ALIGNMENT",
    title: "Spread the flex lines",
    prompt: "Create multiple rows, then place the first line at the top and the last line at the bottom with equal space between lines.",
    goal: "Target: wrap + align-content: space-between",
    hint: "align-content only becomes useful after flex-wrap creates multiple lines.",
    setup() {
      applyBaseContainer({ direction: "row", wrap: "nowrap", justify: "flex-start", alignItems: "center", alignContent: "stretch", width: 470, height: 580 });
      ensureItemCount(6);
      resetItems({ basisType: "px", basisValue: 145, grow: 0, shrink: 1 });
    },
    check() {
      return state.container.wrap !== "nowrap" && state.container.alignContent === "space-between" && getLineGroups().length > 1;
    }
  },
  {
    kicker: "AUTO MARGINS",
    title: "Push the final item away",
    prompt: "Keep Items 1–3 at the start, but push Item 4 all the way to the opposite edge without changing justify-content.",
    goal: "Target: Item 4 gets margin at main-start: auto",
    hint: "Select Item 4 and enable its main-start auto margin.",
    setup() {
      applyBaseContainer({ direction: "row", wrap: "nowrap", justify: "flex-start", alignItems: "center", width: 780, height: 300 });
      ensureItemCount(4);
      resetItems({ basisType: "px", basisValue: 105, grow: 0, shrink: 1, marginStartAuto: false });
    },
    check() {
      return state.items[3].marginStartAuto && state.container.justify === "flex-start";
    }
  }
];

const conceptCopy = {
  overview: {
    icon: "↔",
    title: "Flexbox resolves one axis at a time",
    text: "Each flex line calculates the items' starting main sizes, compares them with the available main-axis space, then grows or shrinks the items before alignment distributes any space that remains.",
    formula: "available main space − item outer base sizes − gaps = free space",
    tip: "Start every Flexbox problem by identifying the main axis. Nearly every confusing property becomes less dramatic after that."
  },
  direction: {
    icon: "🧭",
    title: "flex-direction defines the main axis",
    text: "Row directions make width the main size. Column directions make height the main size. The reverse values flip the visual flow, but they do not rewrite the HTML.",
    formula: "row → main axis is inline/horizontal in normal English writing mode\ncolumn → main axis is block/vertical",
    tip: "justify-content always follows the main axis, so its visible direction changes when flex-direction changes."
  },
  wrap: {
    icon: "↩",
    title: "flex-wrap creates independent flex lines",
    text: "With nowrap, all items negotiate space on one line. With wrap, items that no longer fit move into additional lines, and each line performs its own grow, shrink, and justify calculations.",
    formula: "nowrap = one flex line\nwrap / wrap-reverse = potentially many flex lines",
    tip: "A wrapped Flexbox is still one-dimensional per line. Use Grid when rows and columns must coordinate as a true two-dimensional system."
  },
  justify: {
    icon: "↔",
    title: "justify-content spends leftover main-axis space",
    text: "This property aligns the items only after their flexible sizes and auto margins have been resolved. If flex-grow consumes all positive free space, justify-content may appear to do nothing.",
    formula: "remaining positive space → flex-start / center / flex-end / space-*",
    tip: "When justify-content seems broken, check for flex-grow or auto margins first. CSS is usually innocent-ish."
  },
  alignItems: {
    icon: "↕",
    title: "align-items controls items inside each line",
    text: "It aligns every item along the cross axis of its own flex line. stretch fills the line's cross size when the item has no fixed cross size; baseline aligns text baselines.",
    formula: "container align-items → default cross-axis position for every item",
    tip: "align-self can override this value on one selected item."
  },
  alignContent: {
    icon: "≋",
    title: "align-content controls the flex lines",
    text: "It distributes spare cross-axis space between multiple flex lines. It cannot visibly affect a single-line container, and it needs a container with spare cross-axis room.",
    formula: "multiple flex lines + extra cross space → align-content becomes visible",
    tip: "If you are moving individual boxes, you probably want align-items. If you are moving whole rows, you want align-content."
  },
  gap: {
    icon: "↔",
    title: "gap inserts fixed gutters",
    text: "row-gap and column-gap reserve consistent space between flex items and lines. Unlike margins, gap does not add space at the outer edges of the container.",
    formula: "total gap space on a line = gap × (items on line − 1)",
    tip: "Use gap for normal spacing. Save margins for exceptional spacing or auto-margin alignment tricks."
  },
  order: {
    icon: "🔀",
    title: "order changes visual position, not document order",
    text: "Items are painted by ascending order value, with DOM order breaking ties. Keyboard focus and screen-reader reading order normally remain based on the document.",
    formula: "sort key = order value, then original DOM position",
    tip: "Use order for small visual adjustments, not to rescue badly structured HTML."
  },
  grow: {
    icon: "🌱",
    title: "flex-grow shares positive free space",
    text: "After starting sizes and gaps are accounted for, the browser divides positive free space according to the grow-factor ratio of the items on that flex line.",
    formula: "item share ≈ free space × (item grow ÷ total grow factors)",
    tip: "grow: 2 does not mean twice the final width. It means twice the share of the extra space."
  },
  shrink: {
    icon: "📉",
    title: "flex-shrink removes negative free space",
    text: "When the line is too small, items shrink according to a scaled shrink factor. The browser considers both flex-shrink and the item's flex base size, so a larger item generally surrenders more pixels.",
    formula: "scaled shrink factor = flex-shrink × flex base size",
    tip: "Set shrink to 0 only when an item genuinely must refuse compression. Otherwise overflow will arrive, delighted by your choices."
  },
  basis: {
    icon: "📏",
    title: "flex-basis proposes the starting main size",
    text: "The basis is resolved before growing and shrinking. In a row it acts on the starting width; in a column it acts on the starting height. auto usually consults the item's main-size property or content.",
    formula: "flex: grow shrink basis",
    tip: "For equal columns independent of content, a common pattern is flex: 1 1 0%."
  },
  alignSelf: {
    icon: "☝",
    title: "align-self overrides one item's cross alignment",
    text: "The selected item can ignore the container's align-items value and choose its own cross-axis alignment. auto means it inherits the container behavior.",
    formula: "item align-self wins over container align-items",
    tip: "This changes cross-axis alignment only. It does not move the item along the main axis."
  },
  autoMargin: {
    icon: "⇥",
    title: "Auto margins absorb available space first",
    text: "A main-axis auto margin takes available positive space before justify-content runs. This is why one navbar item can be pushed to the far edge without changing the alignment of its siblings.",
    formula: "positive free space → auto margins → justify-content gets what remains",
    tip: "The classic navigation trick is margin-inline-start: auto on the item that should split away."
  },
  minSize: {
    icon: "🗜",
    title: "The automatic minimum size can block shrinking",
    text: "Flex items often refuse to become narrower than their content's minimum size. Setting min-width: 0 in rows, or min-height: 0 in columns, allows overflowing content to compress inside the flex item.",
    formula: "row → min-width: 0\ncolumn → min-height: 0",
    tip: "This is a frequent fix for mysterious text overflow inside otherwise correct flexible layouts."
  }
};

function selectedItem() {
  return state.items.find(item => item.id === state.selectedId) || state.items[0];
}

function selectItem(id) {
  if (!state.items.some(item => item.id === id)) return;
  state.selectedId = id;
  render();
}

function selectFirst() {
  state.selectedId = state.items[0]?.id || null;
}

function applyBaseContainer(overrides = {}) {
  Object.assign(state.container, {
    display: "flex",
    direction: "row",
    wrap: "wrap",
    justify: "flex-start",
    alignItems: "stretch",
    alignContent: "stretch",
    rowGap: 12,
    columnGap: 12,
    width: 760,
    height: 420
  }, overrides);
}

function resetItems(overrides = {}) {
  state.items.forEach(item => Object.assign(item, {
    order: 0,
    grow: 0,
    shrink: 1,
    basisType: "px",
    basisValue: 110,
    alignSelf: "auto",
    marginStartAuto: false,
    marginEndAuto: false,
    minMainZero: false
  }, overrides));
}

function ensureItemCount(count) {
  while (state.items.length < count) state.items.push(createItem(state.items.length));
  if (state.items.length > count) state.items = state.items.slice(0, count);
  if (!state.items.some(item => item.id === state.selectedId)) selectFirst();
}

function resetState() {
  applyBaseContainer();
  state.items = Array.from({ length: 6 }, (_, index) => createItem(index));
  selectFirst();
  state.showAxes = true;
  state.showLabels = true;
  state.showLines = true;
  state.animate = true;
  setConcept("overview", false);
}

function setConcept(name, shouldRender = true) {
  state.lastConcept = name;
  if (shouldRender) render();
}

function basisCss(item) {
  switch (item.basisType) {
    case "percent": return `${item.basisValue}%`;
    case "auto": return "auto";
    case "content": return "content";
    case "zero": return "0%";
    default: return `${item.basisValue}px`;
  }
}

function mainAxisIsRow() {
  return state.container.direction.startsWith("row");
}

function mainAxisIsReverse() {
  return state.container.direction.endsWith("reverse");
}

function autoMarginStyles(item) {
  const style = { marginTop: "", marginRight: "", marginBottom: "", marginLeft: "" };
  const direction = state.container.direction;

  if (direction === "row") {
    if (item.marginStartAuto) style.marginLeft = "auto";
    if (item.marginEndAuto) style.marginRight = "auto";
  } else if (direction === "row-reverse") {
    if (item.marginStartAuto) style.marginRight = "auto";
    if (item.marginEndAuto) style.marginLeft = "auto";
  } else if (direction === "column") {
    if (item.marginStartAuto) style.marginTop = "auto";
    if (item.marginEndAuto) style.marginBottom = "auto";
  } else {
    if (item.marginStartAuto) style.marginBottom = "auto";
    if (item.marginEndAuto) style.marginTop = "auto";
  }
  return style;
}

function renderItems() {
  elements.flexStage.querySelectorAll(".flex-item").forEach(node => node.remove());

  state.items.forEach((item, index) => {
    const itemEl = document.createElement("article");
    itemEl.className = `flex-item${item.id === state.selectedId ? " selected" : ""}${index === 1 ? " baseline-tall" : ""}`;
    itemEl.dataset.id = item.id;
    itemEl.tabIndex = 0;
    itemEl.setAttribute("role", "button");
    itemEl.setAttribute("aria-label", `Select Item ${index + 1}`);

    itemEl.style.order = String(item.order);
    itemEl.style.flexGrow = String(item.grow);
    itemEl.style.flexShrink = String(item.shrink);
    itemEl.style.flexBasis = basisCss(item);
    itemEl.style.alignSelf = item.alignSelf;
    Object.assign(itemEl.style, autoMarginStyles(item));

    if (item.minMainZero) {
      if (mainAxisIsRow()) itemEl.style.minWidth = "0";
      else itemEl.style.minHeight = "0";
    }

    itemEl.innerHTML = `
      <div class="item-content">
        <span class="item-number">${index + 1}</span>
        <div class="item-title">${escapeHtml(item.name)}</div>
        <div class="item-subtitle">${escapeHtml(item.subtitle)}</div>
      </div>
      <div class="property-badges" aria-hidden="true">
        <span>o:${item.order}</span>
        <span>g:${item.grow}</span>
        <span>s:${item.shrink}</span>
        <span>b:${basisCss(item)}</span>
      </div>
    `;

    itemEl.addEventListener("click", () => selectItem(item.id));
    itemEl.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        selectItem(item.id);
      }
    });
    elements.flexStage.appendChild(itemEl);
  });
}

function renderStage() {
  const c = state.container;
  Object.assign(elements.flexStage.style, {
    display: c.display,
    flexDirection: c.direction,
    flexWrap: c.wrap,
    justifyContent: c.justify,
    alignItems: c.alignItems,
    alignContent: c.alignContent,
    rowGap: `${c.rowGap}px`,
    columnGap: `${c.columnGap}px`,
    width: `min(${c.width}px, 100%)`,
    height: `${c.height}px`
  });
  elements.flexStage.classList.toggle("animate", state.animate);
  elements.flexStage.classList.toggle("axis-hidden", !state.showAxes);
  elements.flexStage.classList.toggle("labels-hidden", !state.showLabels);

  renderItems();
  renderAxes();
}

function renderAxes() {
  const direction = state.container.direction;
  const isRow = direction.startsWith("row");
  const reverse = direction.endsWith("reverse");

  elements.mainAxis.className = `axis main-axis ${isRow ? "horizontal" : "vertical"}${reverse ? " reverse" : ""}`;
  elements.crossAxis.className = `axis cross-axis ${isRow ? "vertical" : "horizontal"}`;

  if (isRow) {
    elements.mainAxis.style.top = "18px";
    elements.mainAxis.style.bottom = "auto";
    elements.mainAxis.style.left = "16px";
    elements.mainAxis.style.right = "16px";
    elements.crossAxis.style.left = "7px";
    elements.crossAxis.style.right = "auto";
    elements.crossAxis.style.top = "42px";
    elements.crossAxis.style.bottom = "14px";
    elements.mainAxis.firstElementChild.textContent = reverse ? "← MAIN" : "MAIN →";
    elements.crossAxis.firstElementChild.textContent = state.container.wrap === "wrap-reverse" ? "CROSS ↑" : "CROSS ↓";
  } else {
    elements.mainAxis.style.left = "7px";
    elements.mainAxis.style.right = "auto";
    elements.mainAxis.style.top = "42px";
    elements.mainAxis.style.bottom = "14px";
    elements.crossAxis.style.top = "18px";
    elements.crossAxis.style.bottom = "auto";
    elements.crossAxis.style.left = "16px";
    elements.crossAxis.style.right = "16px";
    elements.mainAxis.firstElementChild.textContent = reverse ? "↑ MAIN" : "MAIN ↓";
    elements.crossAxis.firstElementChild.textContent = state.container.wrap === "wrap-reverse" ? "CROSS ←" : "CROSS →";
  }
}

function renderControls() {
  const c = state.container;
  const item = selectedItem();
  if (!item) return;

  syncControl("displaySelect", c.display, "displayValue", c.display);
  syncControl("directionSelect", c.direction, "directionValue", c.direction);
  syncControl("wrapSelect", c.wrap, "wrapValue", c.wrap);
  syncControl("justifySelect", c.justify, "justifyValue", c.justify);
  syncControl("alignItemsSelect", c.alignItems, "alignItemsValue", c.alignItems);
  syncControl("alignContentSelect", c.alignContent, "alignContentValue", c.alignContent);
  syncControl("rowGapRange", c.rowGap, "rowGapValue", c.rowGap);
  syncControl("columnGapRange", c.columnGap, "columnGapValue", c.columnGap);
  syncControl("stageWidthRange", c.width, "stageWidthValue", c.width);
  syncControl("stageHeightRange", c.height, "stageHeightValue", c.height);

  $("#showLinesCheck").checked = state.showLines;
  $("#animateCheck").checked = state.animate;
  $("#toggleAxesBtn").setAttribute("aria-pressed", String(state.showAxes));
  $("#toggleLabelsBtn").setAttribute("aria-pressed", String(state.showLabels));

  const itemIndex = state.items.findIndex(entry => entry.id === item.id);
  $("#selectedItemHeading").textContent = `Item ${itemIndex + 1}: ${item.name}`;
  $("#selectedItemChip").textContent = `#${itemIndex + 1}`;
  syncControl("orderRange", item.order, "orderValue", item.order);
  syncControl("growRange", item.grow, "growValue", item.grow);
  syncControl("shrinkRange", item.shrink, "shrinkValue", item.shrink);
  syncControl("basisValueInput", item.basisValue);
  syncControl("basisTypeSelect", item.basisType, "basisTypeValue", item.basisType === "percent" ? "%" : item.basisType);
  $("#basisDisplay").textContent = basisCss(item);
  $("#basisValueInput").disabled = ["auto", "content", "zero"].includes(item.basisType);
  syncControl("alignSelfSelect", item.alignSelf, "alignSelfValue", item.alignSelf);
  $("#marginStartCheck").checked = item.marginStartAuto;
  $("#marginEndCheck").checked = item.marginEndAuto;
  $("#minMainZeroCheck").checked = item.minMainZero;
  $("#minMainHint").textContent = mainAxisIsRow() ? "Applies min-width: 0 in row layouts." : "Applies min-height: 0 in column layouts.";

  renderItemPicker();
}

function syncControl(inputId, value, outputId, outputValue) {
  const input = document.getElementById(inputId);
  if (input) input.value = value;
  if (outputId) document.getElementById(outputId).textContent = outputValue;
}

function renderItemPicker() {
  elements.itemPicker.innerHTML = "";
  state.items.forEach((item, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = String(index + 1);
    button.classList.toggle("active", item.id === state.selectedId);
    button.setAttribute("aria-label", `Edit Item ${index + 1}`);
    button.addEventListener("click", () => selectItem(item.id));
    elements.itemPicker.appendChild(button);
  });
}

function renderPresets() {
  const host = $("#presetButtons");
  if (host.childElementCount) return;
  presets.forEach(preset => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "preset-button";
    button.textContent = `${preset.icon} ${preset.name}`;
    button.addEventListener("click", () => {
      preset.apply();
      render();
    });
    host.appendChild(button);
  });
}

function renderMetrics() {
  requestAnimationFrame(() => {
    const c = state.container;
    const isRow = mainAxisIsRow();
    const stageStyle = getComputedStyle(elements.flexStage);
    const paddingMain = isRow
      ? parseFloat(stageStyle.paddingLeft) + parseFloat(stageStyle.paddingRight)
      : parseFloat(stageStyle.paddingTop) + parseFloat(stageStyle.paddingBottom);
    const mainSize = (isRow ? elements.flexStage.clientWidth : elements.flexStage.clientHeight) - paddingMain;

    const pxBasisItems = state.items.filter(item => item.basisType === "px");
    const basisTotal = pxBasisItems.reduce((sum, item) => sum + Number(item.basisValue), 0);
    const allKnown = pxBasisItems.length === state.items.length;
    const effectiveGap = isRow ? c.columnGap : c.rowGap;
    const oneLineGapTotal = effectiveGap * Math.max(0, state.items.length - 1);
    const freeSpace = allKnown ? mainSize - basisTotal - oneLineGapTotal : null;
    const factorSum = freeSpace !== null && freeSpace < 0
      ? state.items.reduce((sum, item) => sum + item.shrink * (item.basisType === "px" ? item.basisValue : 0), 0)
      : state.items.reduce((sum, item) => sum + item.grow, 0);

    $("#mainSizeMetric").textContent = `${Math.round(mainSize)}px`;
    $("#mainSizeAxis").textContent = isRow ? "content width" : "content height";
    $("#basisTotalMetric").textContent = allKnown ? `${Math.round(basisTotal)}px` : `${Math.round(basisTotal)}px+`;
    const freeMetric = $("#freeSpaceMetric");
    freeMetric.classList.remove("positive", "negative");
    if (freeSpace === null) {
      freeMetric.textContent = "mixed";
      $("#freeSpaceMeaning").textContent = "auto/content basis present";
    } else {
      freeMetric.textContent = `${freeSpace >= 0 ? "+" : ""}${Math.round(freeSpace)}px`;
      freeMetric.classList.add(freeSpace >= 0 ? "positive" : "negative");
      $("#freeSpaceMeaning").textContent = freeSpace >= 0 ? "positive space → grow" : "negative space → shrink";
    }
    $("#factorMetric").textContent = String(Math.round(factorSum * 100) / 100);
    $("#factorMeaning").textContent = freeSpace !== null && freeSpace < 0 ? "scaled shrink sum" : "grow-factor sum";

    $("#measurementAxis").textContent = `Main axis: ${isRow ? "width" : "height"}`;
    $("#mainSizeAxis").textContent = isRow ? "content width" : "content height";
    renderMeasurements(mainSize);
    renderLineOverlays();
    renderAlignContentStatus();
    updateStatusText();
  });
}

function renderMeasurements(mainSize) {
  elements.measurementList.innerHTML = "";
  const nodes = $$(".flex-item", elements.flexStage);
  nodes.forEach((node, index) => {
    const size = mainAxisIsRow() ? node.getBoundingClientRect().width : node.getBoundingClientRect().height;
    const item = state.items[index];
    const row = document.createElement("div");
    row.className = "measurement-row";
    const percentage = Math.max(0, Math.min(100, (size / Math.max(mainSize, 1)) * 100));
    row.innerHTML = `
      <span class="measurement-id">${index + 1}</span>
      <span class="measurement-name">${escapeHtml(item.name)} · flex ${item.grow} ${item.shrink} ${basisCss(item)}</span>
      <span class="measurement-track"><span class="measurement-fill" style="width:${percentage}%"></span></span>
      <span class="measurement-value">${Math.round(size)}px</span>
    `;
    elements.measurementList.appendChild(row);
  });
}

function getLineGroups() {
  const nodes = $$(".flex-item", elements.flexStage);
  if (!nodes.length) return [];
  const isRow = mainAxisIsRow();
  const stageRect = elements.flexStage.getBoundingClientRect();
  const groups = [];
  const tolerance = 3;

  nodes.forEach(node => {
    const rect = node.getBoundingClientRect();
    const coordinate = isRow ? rect.top : rect.left;
    let group = groups.find(entry => Math.abs(entry.coordinate - coordinate) <= tolerance);
    if (!group) {
      group = { coordinate, rects: [] };
      groups.push(group);
    }
    group.rects.push({
      left: rect.left - stageRect.left + elements.flexStage.scrollLeft,
      right: rect.right - stageRect.left + elements.flexStage.scrollLeft,
      top: rect.top - stageRect.top + elements.flexStage.scrollTop,
      bottom: rect.bottom - stageRect.top + elements.flexStage.scrollTop
    });
  });

  return groups.sort((a, b) => a.coordinate - b.coordinate);
}

function renderLineOverlays() {
  elements.lineOverlays.innerHTML = "";
  const groups = getLineGroups();
  if (!state.showLines || groups.length === 0) return;

  groups.forEach((group, index) => {
    const left = Math.min(...group.rects.map(rect => rect.left)) - 4;
    const right = Math.max(...group.rects.map(rect => rect.right)) + 4;
    const top = Math.min(...group.rects.map(rect => rect.top)) - 4;
    const bottom = Math.max(...group.rects.map(rect => rect.bottom)) + 4;
    const outline = document.createElement("div");
    outline.className = "line-outline";
    Object.assign(outline.style, {
      left: `${left}px`,
      top: `${top}px`,
      width: `${right - left}px`,
      height: `${bottom - top}px`
    });
    outline.innerHTML = `<span>LINE ${index + 1}</span>`;
    elements.lineOverlays.appendChild(outline);
  });
}

function renderAlignContentStatus() {
  const lineCount = getLineGroups().length;
  const active = state.container.wrap !== "nowrap" && lineCount > 1;
  elements.alignContentWarning.classList.toggle("active", active);
  elements.alignContentWarning.innerHTML = active
    ? `<strong>Active on ${lineCount} lines.</strong> Change the value and watch the outlined lines move.`
    : `<strong>Currently inactive.</strong> It needs wrapping and more than one flex line.`;
}

function updateStatusText() {
  const lineCount = getLineGroups().length || 1;
  $("#lineCountText").textContent = `${lineCount} flex line${lineCount === 1 ? "" : "s"}`;
  $("#itemCountText").textContent = `${state.items.length} item${state.items.length === 1 ? "" : "s"}`;

  const c = state.container;
  let description = `Main axis: ${c.direction}. Cross alignment: ${c.alignItems}.`;
  if (c.wrap !== "nowrap") description += ` Wrapping is enabled, producing ${lineCount} line${lineCount === 1 ? "" : "s"}.`;
  $("#labDescription").textContent = description;
}

function renderExplanation() {
  const concept = conceptCopy[state.lastConcept] || conceptCopy.overview;
  $("#conceptIcon").textContent = concept.icon;
  $("#explanationTitle").textContent = concept.title;
  $("#explanationText").textContent = concept.text;
  $("#formulaBox").textContent = concept.formula;
  $("#tipBox").textContent = concept.tip;
}

function generateCss() {
  const c = state.container;
  const containerLines = [
    ".flex-container {",
    `  display: ${c.display};`,
    `  flex-flow: ${c.direction} ${c.wrap};`,
    `  justify-content: ${c.justify};`,
    `  align-items: ${c.alignItems};`,
    `  align-content: ${c.alignContent};`,
    `  row-gap: ${c.rowGap}px;`,
    `  column-gap: ${c.columnGap}px;`,
    `  width: ${c.width}px;`,
    `  height: ${c.height}px;`,
    "}"
  ];

  const itemLines = state.items.flatMap((item, index) => {
    const lines = [
      "",
      `.item-${index + 1} {`,
      `  order: ${item.order};`,
      `  flex: ${item.grow} ${item.shrink} ${basisCss(item)};`,
      `  align-self: ${item.alignSelf};`
    ];

    const marginStyles = autoMarginStyles(item);
    if (marginStyles.marginTop) lines.push("  margin-top: auto;");
    if (marginStyles.marginRight) lines.push("  margin-right: auto;");
    if (marginStyles.marginBottom) lines.push("  margin-bottom: auto;");
    if (marginStyles.marginLeft) lines.push("  margin-left: auto;");
    if (item.minMainZero) lines.push(`  ${mainAxisIsRow() ? "min-width" : "min-height"}: 0;`);
    lines.push("}");
    return lines;
  });

  return [...containerLines, ...itemLines].join("\n");
}

function generateHtml() {
  return [
    '<div class="flex-container">',
    ...state.items.map((item, index) => `  <div class="item item-${index + 1}">${escapeHtml(item.name)}</div>`),
    "</div>"
  ].join("\n");
}

function renderCode() {
  elements.codeOutput.textContent = state.codeView === "css" ? generateCss() : generateHtml();
  $$(".code-tab").forEach(button => button.classList.toggle("active", button.dataset.codeView === state.codeView));
}

function renderChallenges() {
  const select = $("#challengeSelect");
  if (!select.childElementCount) {
    challenges.forEach((challenge, index) => {
      const option = document.createElement("option");
      option.value = String(index);
      option.textContent = `${index + 1}. ${challenge.title}`;
      select.appendChild(option);
    });
  }
  const index = Number(select.value || 0);
  const challenge = challenges[index];
  $("#challengeNumber").textContent = String(index + 1).padStart(2, "0");
  $("#challengeKicker").textContent = challenge.kicker;
  $("#challengeTitle").textContent = challenge.title;
  $("#challengePrompt").textContent = challenge.prompt;
  $("#challengeGoal").textContent = challenge.goal;
  $("#scoreChip").textContent = `${state.completedChallenges.size}/${challenges.length}`;
}

function render() {
  renderPresets();
  renderStage();
  renderControls();
  renderExplanation();
  renderCode();
  renderChallenges();
  renderMetrics();
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function bindControl(id, eventName, updater, concept) {
  document.getElementById(id).addEventListener(eventName, event => {
    updater(event.target);
    if (concept) state.lastConcept = concept;
    render();
  });
}

function bindEvents() {
  $$(".tab").forEach(tab => {
    tab.addEventListener("click", () => {
      $$(".tab").forEach(button => button.classList.toggle("active", button === tab));
      $$(".tab-panel").forEach(panel => panel.classList.toggle("active", panel.dataset.panel === tab.dataset.tab));
    });
  });

  bindControl("displaySelect", "change", input => state.container.display = input.value, "overview");
  bindControl("directionSelect", "change", input => state.container.direction = input.value, "direction");
  bindControl("wrapSelect", "change", input => state.container.wrap = input.value, "wrap");
  bindControl("justifySelect", "change", input => state.container.justify = input.value, "justify");
  bindControl("alignItemsSelect", "change", input => state.container.alignItems = input.value, "alignItems");
  bindControl("alignContentSelect", "change", input => state.container.alignContent = input.value, "alignContent");
  bindControl("rowGapRange", "input", input => state.container.rowGap = Number(input.value), "gap");
  bindControl("columnGapRange", "input", input => state.container.columnGap = Number(input.value), "gap");
  bindControl("stageWidthRange", "input", input => state.container.width = Number(input.value), "overview");
  bindControl("stageHeightRange", "input", input => state.container.height = Number(input.value), "overview");

  bindControl("orderRange", "input", input => selectedItem().order = Number(input.value), "order");
  bindControl("growRange", "input", input => selectedItem().grow = Number(input.value), "grow");
  bindControl("shrinkRange", "input", input => selectedItem().shrink = Number(input.value), "shrink");
  bindControl("basisValueInput", "input", input => selectedItem().basisValue = Math.max(0, Number(input.value) || 0), "basis");
  bindControl("basisTypeSelect", "change", input => selectedItem().basisType = input.value, "basis");
  bindControl("alignSelfSelect", "change", input => selectedItem().alignSelf = input.value, "alignSelf");
  bindControl("marginStartCheck", "change", input => selectedItem().marginStartAuto = input.checked, "autoMargin");
  bindControl("marginEndCheck", "change", input => selectedItem().marginEndAuto = input.checked, "autoMargin");
  bindControl("minMainZeroCheck", "change", input => selectedItem().minMainZero = input.checked, "minSize");

  $("#showLinesCheck").addEventListener("change", event => { state.showLines = event.target.checked; render(); });
  $("#animateCheck").addEventListener("change", event => { state.animate = event.target.checked; render(); });
  $("#toggleAxesBtn").addEventListener("click", () => { state.showAxes = !state.showAxes; render(); });
  $("#toggleLabelsBtn").addEventListener("click", () => { state.showLabels = !state.showLabels; render(); });

  $("#addItemBtn").addEventListener("click", () => {
    if (state.items.length >= 10) return;
    const item = createItem(state.items.length);
    state.items.push(item);
    state.selectedId = item.id;
    render();
  });

  $("#removeItemBtn").addEventListener("click", () => {
    if (state.items.length <= 1) return;
    const index = state.items.findIndex(item => item.id === state.selectedId);
    state.items.splice(index, 1);
    state.selectedId = state.items[Math.max(0, index - 1)].id;
    render();
  });

  $("#resetBtn").addEventListener("click", () => { resetState(); render(); });

  $("#randomizeBtn").addEventListener("click", () => {
    const choices = {
      direction: ["row", "row-reverse", "column", "column-reverse"],
      wrap: ["nowrap", "wrap", "wrap-reverse"],
      justify: ["flex-start", "center", "flex-end", "space-between", "space-around", "space-evenly"],
      alignItems: ["stretch", "flex-start", "center", "flex-end", "baseline"],
      alignContent: ["stretch", "flex-start", "center", "flex-end", "space-between", "space-around", "space-evenly"]
    };
    Object.keys(choices).forEach(key => state.container[key] = choices[key][Math.floor(Math.random() * choices[key].length)]);
    state.container.rowGap = Math.floor(Math.random() * 31);
    state.container.columnGap = Math.floor(Math.random() * 31);
    state.items.forEach(item => {
      item.order = Math.floor(Math.random() * 7) - 2;
      item.grow = Math.floor(Math.random() * 4);
      item.shrink = Math.floor(Math.random() * 4);
      item.basisType = "px";
      item.basisValue = 60 + Math.floor(Math.random() * 121);
      item.alignSelf = ["auto", "flex-start", "center", "flex-end", "stretch"][Math.floor(Math.random() * 5)];
      item.marginStartAuto = false;
      item.marginEndAuto = false;
    });
    setConcept("overview");
  });

  $("#moveBeforeBtn").addEventListener("click", () => moveSelected(-1));
  $("#moveAfterBtn").addEventListener("click", () => moveSelected(1));

  $$(".code-tab").forEach(button => {
    button.addEventListener("click", () => {
      state.codeView = button.dataset.codeView;
      renderCode();
    });
  });

  $("#copyCodeBtn").addEventListener("click", copyCode);

  $("#challengeSelect").addEventListener("change", () => {
    elements.challengeFeedback.className = "feedback";
    elements.challengeFeedback.textContent = "Load the mission, then solve it using the normal controls.";
    elements.hintBox.classList.add("hidden");
    renderChallenges();
  });

  $("#loadChallengeBtn").addEventListener("click", () => {
    const challenge = challenges[Number($("#challengeSelect").value)];
    challenge.setup();
    selectFirst();
    state.lastConcept = "overview";
    elements.challengeFeedback.className = "feedback";
    elements.challengeFeedback.textContent = "Setup loaded. Use the Container and Selected item tabs to solve it.";
    elements.hintBox.classList.add("hidden");
    render();
  });

  $("#hintBtn").addEventListener("click", () => {
    const challenge = challenges[Number($("#challengeSelect").value)];
    elements.hintBox.textContent = challenge.hint;
    elements.hintBox.classList.remove("hidden");
  });

  $("#checkChallengeBtn").addEventListener("click", () => {
    const index = Number($("#challengeSelect").value);
    const challenge = challenges[index];
    renderMetrics();
    requestAnimationFrame(() => {
      const passed = challenge.check();
      elements.challengeFeedback.className = `feedback ${passed ? "success" : "error"}`;
      elements.challengeFeedback.textContent = passed
        ? "Mission complete. The browser has reluctantly confirmed your competence."
        : "Not there yet. Compare the target with the active values and try again.";
      if (passed) state.completedChallenges.add(index);
      renderChallenges();
    });
  });

  window.addEventListener("resize", () => renderMetrics());
  elements.flexStage.addEventListener("scroll", () => renderLineOverlays());

  if ("ResizeObserver" in window) {
    const observer = new ResizeObserver(() => renderMetrics());
    observer.observe(elements.flexStage);
  }
}

function moveSelected(delta) {
  const index = state.items.findIndex(item => item.id === state.selectedId);
  const nextIndex = index + delta;
  if (index < 0 || nextIndex < 0 || nextIndex >= state.items.length) return;
  const [item] = state.items.splice(index, 1);
  state.items.splice(nextIndex, 0, item);
  render();
}

async function copyCode() {
  const text = elements.codeOutput.textContent;
  try {
    await navigator.clipboard.writeText(text);
    elements.copyStatus.textContent = "Copied to clipboard.";
  } catch {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    textArea.remove();
    elements.copyStatus.textContent = "Copied using fallback mode.";
  }
  window.setTimeout(() => elements.copyStatus.textContent = "", 1800);
}

bindEvents();
render();
