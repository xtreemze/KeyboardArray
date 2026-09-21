export default {
  extends: ["stylelint-config-standard"],
  rules: {
    "declaration-no-important": true,
    "selector-max-id": 0,
    "selector-max-specificity": "0,3,0",
    "selector-max-compound-selectors": 4,
    "property-disallowed-list": [
      "left",
      "right",
      "margin-left",
      "margin-right",
      "padding-left",
      "padding-right",
      "border-left",
      "border-right"
    ],
    "declaration-property-value-disallowed-list": {
      "transition": ["/\\ball\\b/"],
      "/^overflow(?:-[xy])?$/": ["/^(?:hidden|clip)$/"]
    }
  }
};
