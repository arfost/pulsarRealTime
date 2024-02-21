import querystring from "node:querystring";
import { parse } from "url";
import load from "./templates/load.js";
import main from "./templates/main.js";
import save from "./templates/save.js";
import notfound from "./templates/notfound.js";
import error from "./templates/error.js";
import list from "./templates/list.js";

const routes = {
  "/forceSave": function (parsed, res, pulsarCrud) {
    const formValues = querystring.parse(parsed.query);
    console.log("form values : ", formValues);
    const ok = true;
    try{
      pulsarCrud.saveToFile(formValues.filename || "data");
    }catch(e){
      console.error(e);
      ok = false;
    }
    res.write(save({success: ok, filename: formValues.filename || "data"}));
  },
  "/forceLoad": function (parsed, res, pulsarCrud) {
    const formValues = querystring.parse(parsed.query);
    console.log("form values : ", formValues);
    const ok = true;
    try{
      pulsarCrud.loadFromFile(formValues.filename || "data");
    }catch(e){
      console.error(e);
      ok = false;
    }
    res.write(load({success: ok, filename: formValues.filename || "data"}));
  },
  "/list": function (parsed, res, pulsarCrud) {
    const formValues = querystring.parse(parsed.query);
    if(!formValues.collection){
      throw new Error("no collection specified");
    }
    res.write(list(pulsarCrud, formValues.collection));
  },
  "/main": function (parsed, res, pulsarCrud) {
    res.write(main(pulsarCrud));
  }
}

export default function (server, pulsarCrud) {
  server.on("request", (req, res) => {
    try {
      let parsed = parse(req.url);
      console.log("admin request : ", parsed, parsed.pathname);
      if (routes[parsed.pathname]) {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        routes[parsed.pathname](parsed, res, pulsarCrud);
      } else {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.write(notfound());
        console.warn(`Unknown admin action : ${req.url}`);
      }
    } catch (e) {
      console.error(e);
      res.writeHead(500, { 'Content-Type': 'text/html' });
      res.write(error(e.message));
    }
    res.end();
  });
}

