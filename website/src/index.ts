import * as wasm from "minesweeper";

const rootElement = document.querySelector<HTMLDivElement>(".root");
const widthInput = document.querySelector<HTMLInputElement>("#grid-size");
const minesInput = document.querySelector<HTMLInputElement>("#mines-input");
const startButton = document.querySelector<HTMLButtonElement>(".start-button");
const nt = document.querySelector<HTMLDivElement>(".nt");

(() => {
  // init code
  startButton.addEventListener("click", startGame);

  startGame();
})();

function startGame() {
  let w: number = widthInput.valueAsNumber;
  let m: number = minesInput.valueAsNumber;

  console.log(`new session requested with w = ${w}`);

  if (m > w * w) {
    alert("can't have mines more than the size of the grid cells");
    return;
  }

  if (w * m <= 0) {
    alert("invalid number");
    return;
  }

  wasm.restSession(w, w, m);
  nt.style.display = "none";
  render();
}

function render() {
  const data = wasm.getState();
  console.log("rendering");
  rootElement.innerHTML = "";

  let rows = data.split("\n");
  rows.pop();

  for (let y = 0; y < rows.length; y++) {
    let cols = rows[y].split(" ");
    cols.pop();

    for (let x = 0; x < rows.length; x++) {
      let cellElement: HTMLElement = document.createElement("a");
      if (cols[x]) {
        cellElement.innerText = cols[x];
        cellElement.classList.add("cell");
        cellElement.addEventListener("click", () => {
          if (wasm.openField(x, y)) nt.style.display = "block";
          render();
        });
        cellElement.addEventListener("contextmenu", (e) => {
          e.preventDefault();
          wasm.toggleFlag(x, y);
          render();
        });
        rootElement.appendChild(cellElement);
      }
    }
  }
  rootElement.style.gridTemplateColumns = `repeat(${rows.length}, 1fr)`;
}
