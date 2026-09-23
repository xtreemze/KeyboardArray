import { beforeEach, describe, expect, it } from "vitest";
import { alphabet, mountKeyboardArray } from "./keyboard-array.ts";

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
    expect(controller.availableLetters()).toHaveLength(alphabet.length);

    first?.click();

    expect(controller.availableLetters()).toHaveLength(alphabet.length - 1);
    expect(lettersRoot.querySelector<HTMLButtonElement>('[data-letter="A"]')?.disabled).toBe(true);
    expect(status.value).toBe(`${alphabet.length - 1} letters available`);
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

    expect(controller.availableLetters()).toHaveLength(alphabet.length);
    expect(status.value).toBe(`${alphabet.length} letters available`);
  });
});
