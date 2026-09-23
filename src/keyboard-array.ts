export const alphabet: readonly string[] = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];

export interface KeyboardArrayElements {
  readonly lettersRoot: HTMLElement;
  readonly resetButton: HTMLButtonElement;
  readonly status: HTMLOutputElement;
}

export interface KeyboardArrayController {
  readonly availableLetters: () => readonly string[];
  readonly reset: () => void;
}

export const mountKeyboardArray = ({
  lettersRoot,
  resetButton,
  status,
}: KeyboardArrayElements): KeyboardArrayController => {
  const picked = new Set<string>();

  const availableLetters = (): readonly string[] =>
    alphabet.filter((letter): boolean => !picked.has(letter));

  const updateStatus = (): void => {
    const available = availableLetters().length;
    let suffix = "s";
    if (available === 1) {
      suffix = "";
    }
    status.value = `${available} letter${suffix} available`;
  };

  const render = (): void => {
    const fragment = document.createDocumentFragment();

    for (const letter of alphabet) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "letter";
      button.textContent = letter;
      button.setAttribute("data-letter", letter);
      button.disabled = picked.has(letter);
      button.setAttribute("aria-pressed", String(picked.has(letter)));

      button.addEventListener("click", (): void => {
        picked.add(letter);
        render();
      });

      fragment.append(button);
    }

    lettersRoot.replaceChildren(fragment);
    updateStatus();
  };

  const reset = (): void => {
    picked.clear();
    render();
  };

  resetButton.addEventListener("click", reset);
  render();

  return { availableLetters, reset };
};
