export const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ" as const;

export interface KeyboardArrayElements {
  readonly lettersRoot: HTMLElement;
  readonly resetButton: HTMLButtonElement;
  readonly status: HTMLOutputElement;
}

export interface KeyboardArrayController {
  readonly availableLetters: () => readonly string[];
  readonly reset: () => void;
}

export function mountKeyboardArray({
  lettersRoot,
  resetButton,
  status,
}: KeyboardArrayElements): KeyboardArrayController {
  const picked = new Set<string>();

  const availableLetters = () => Array.from(alphabet).filter((letter) => !picked.has(letter));

  const updateStatus = () => {
    const available = availableLetters().length;
    status.value = `${available} letter${available === 1 ? "" : "s"} available`;
  };

  const render = () => {
    const fragment = document.createDocumentFragment();

    for (const letter of alphabet) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "letter";
      button.textContent = letter;
      button.dataset.letter = letter;
      button.disabled = picked.has(letter);
      button.setAttribute("aria-pressed", picked.has(letter) ? "true" : "false");

      button.addEventListener("click", () => {
        picked.add(letter);
        render();
      });

      fragment.append(button);
    }

    lettersRoot.replaceChildren(fragment);
    updateStatus();
  };

  const reset = () => {
    picked.clear();
    render();
  };

  resetButton.addEventListener("click", reset);
  render();

  return { availableLetters, reset };
}
