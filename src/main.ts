import "./style.css";
import { mountKeyboardArray } from "./keyboard-array.ts";

const lettersRoot = document.querySelector<HTMLElement>("#letters");
const resetButton = document.querySelector<HTMLButtonElement>("#reset");
const status = document.querySelector<HTMLOutputElement>("#status");

if (lettersRoot === null || resetButton === null || status === null) {
  throw new Error("Keyboard Array markup is incomplete.");
}

mountKeyboardArray({ lettersRoot, resetButton, status });
