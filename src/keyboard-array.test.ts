import { beforeEach, describe, expect, it } from "vitest";
import { alphabet, mountKeyboardArray } from "./keyboard-array";

describe("mountKeyboardArray", () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="letters"></div>
      <button id="reset" type="button">Reset</button>
      <output id="status"></output>
    `;
  });

  it("renders the alphabet and disables a selected letter", () => {
    const lettersRoot = document.querySelector<HTMLElement>("#letters");
    const resetButton = document.querySelector<HTMLButtonElement>("#reset");
    const status = document.querySelector<HTMLOutputElement>("#status");

    if (lettersRoot === null || resetButton === null || status === null) {
      throw new Error("Test fixture is incomplete.");
    }

    const controller = mountKeyboardArray({ lettersRoot, resetButton, status });
    const first = lettersRoot.querySelector<HTMLButtonElement>('[data-letter="A"]');

    expect(lettersRoot.querySelectorAll("button")).toHaveLength(alphabet.length);
    expect(controller.availableLetters()).toHaveLength(26);

    first?.click();

    expect(controller.availableLetters()).toHaveLength(25);
    expect(lettersRoot.querySelector<HTMLButtonElement>('[data-letter="A"]')?.disabled).toBe(true);
    expect(status.value).toBe("25 letters available");
  });

  it("reset restores all letters", () => {
    const lettersRoot = document.querySelector<HTMLElement>("#letters");
    const resetButton = document.querySelector<HTMLButtonElement>("#reset");
    const status = document.querySelector<HTMLOutputElement>("#status");

    if (lettersRoot === null || resetButton === null || status === null) {
      throw new Error("Test fixture is incomplete.");
    }

    const controller = mountKeyboardArray({ lettersRoot, resetButton, status });
    lettersRoot.querySelector<HTMLButtonElement>('[data-letter="Z"]')?.click();
    resetButton.click();

    expect(controller.availableLetters()).toHaveLength(26);
    expect(status.value).toBe("26 letters available");
  });
});
