const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const lettersRoot = document.querySelector("#abcs");
const resetControl = document.querySelector("#reset");
const selectedLetters = new Set();

if (!(lettersRoot instanceof HTMLElement) || !(resetControl instanceof HTMLButtonElement)) {
  throw new TypeError("KeyboardArray requires its letter container and reset button.");
}

function createLetterButton(letter) {
  const button = document.createElement("button");
  button.className = "frame";
  button.type = "button";
  button.textContent = letter;
  button.disabled = selectedLetters.has(letter);
  button.classList.toggle("picked", button.disabled);
  button.addEventListener("click", () => {
    selectedLetters.add(letter);
    render();
  });
  return button;
}

function render() {
  const fragment = document.createDocumentFragment();
  for (const letter of alphabet) {
    fragment.append(createLetterButton(letter));
  }
  lettersRoot.replaceChildren(fragment);
}

resetControl.addEventListener("click", () => {
  selectedLetters.clear();
  render();
});

render();
