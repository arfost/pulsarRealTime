import base from "./base.js";

export default function (error) {
  return base(`
      <h2>Error</h2>
      it seems something went wrong...
      <pre>${error}</pre>
  `);
}