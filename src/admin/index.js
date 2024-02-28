import querystring from "node:querystring";
import { parse } from "url";
import error from "./templates/error.js";
import details from "./templates/fragments/details.js";
import load from "./templates/fragments/load.js";
import save from "./templates/fragments/save.js";
import list from "./templates/list.js";
import main from "./templates/main.js";
import notfound from "./templates/notfound.js";

const routes = {
  "/forceSave": function (parsed, res, pulsarCrud) {
    const formValues = querystring.parse(parsed.query);
    console.log("form values : ", formValues);
    const ok = true;
    try{
      if(formValues.filename){
        pulsarCrud.saveToFile(formValues.filename || "data");
      }
    }catch(e){
      console.error(e);
      ok = false;
    }
    res.write(save({success: ok, filename: formValues.filename}));
  },
  "/forceLoad": function (parsed, res, pulsarCrud) {
    const formValues = querystring.parse(parsed.query);
    console.log("form values : ", formValues);
    const ok = true;
    try{
      if(formValues.filename){
        pulsarCrud.loadFromFile(formValues.filename);
      }
    }catch(e){
      console.error(e);
      ok = false;
    }
    res.write(load({success: ok, filename: formValues.filename}));
  },
  "/list": function (parsed, res, pulsarCrud) {
    const formValues = querystring.parse(parsed.query);
    if(!formValues.collection){
      throw new Error("no collection specified");
    }
    res.write(list(pulsarCrud, formValues.collection));
  },
  "/details": function (parsed, res, pulsarCrud) {
    const formValues = querystring.parse(parsed.query);
    if(!formValues.collection){
      throw new Error("no collection specified");
    }
    if(!formValues.id){
      throw new Error("no id specified");
    }
    res.write(details(pulsarCrud, formValues.collection, formValues.id));
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

