import base from "./base.js";

export default function (error) {
  return base(`
    <h2>404</h2>
    Someone has been messing with the URL...
  `);
}