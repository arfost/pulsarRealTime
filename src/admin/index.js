import { createWriteStream, promises as fs } from "node:fs";
import path from "node:path";
import querystring from "node:querystring";
import { fileURLToPath, parse } from "url";
import error from "./templates/error.js";
import details from "./templates/fragments/details.js";
import fileManagement from "./templates/fragments/fileManagement.js";
import load from "./templates/fragments/load.js";
import save from "./templates/fragments/save.js";
import list from "./templates/list.js";
import main from "./templates/main.js";
import notfound from "./templates/notfound.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const routes = {
  "/download": {
    logic: async function (parsed, res, pulsarCrud, req) {
      const formValues = querystring.parse(parsed.query);
      console.log("form values : ", formValues);
      const ok = true;
      try {
        if (formValues.filename) {
          let content = await fs.readFile(`./saves/${formValues.filename}`);
          res.write(content);
        }
      } catch (e) {
        console.error(e);
        res.write(error(e.message));
        ok = false;
      }
      res.end();
    },
    headers: { 'Content-Type': 'application/json'}
  },
  "/upload": async function (parsed, res, pulsarCrud, req) {
    const formValues = querystring.parse(parsed.query);
    console.log("form values : ", formValues);
    try {
      console.log(req.file);
      let fileName = path.basename('test.json');
      let file = path.join('saves', fileName);
      console.log("file : ", file, fileName);
      req.pipe(createWriteStream(file));
      req.on('end', () => {
        res.writeHead(200, {'Content-Type': 'text'});
        res.write('uploaded succesfully');
        res.end();
      });
    } catch (e) {
      console.error(e);
      res.write(error(e.message));
    }
  },
  "/forceSave": async function (parsed, res, pulsarCrud) {
    const formValues = querystring.parse(parsed.query);
    console.log("form values : ", formValues);
    const ok = true;
    try {
      if (formValues.filename) {
        await pulsarCrud.saveToFile(formValues.filename || "data");
      }
    } catch (e) {
      console.error(e);
      ok = false;
    }
    res.write(save({ success: ok, filename: formValues.filename }));
  },
  "/forceLoad": async function (parsed, res, pulsarCrud) {
    const formValues = querystring.parse(parsed.query);
    console.log("form values : ", formValues);
    const ok = true;
    let fileList = [];
    try {
      if (formValues.filename) {
        await pulsarCrud.loadFromFile(formValues.filename);
      }
      fileList = await pulsarCrud.fileList();
      console.log(fileList);
    } catch (e) {
      console.error(e);
      ok = false;
    }
    res.write(load({ success: ok, filename: formValues.filename, fileList }));
  },
  "/list": async function (parsed, res, pulsarCrud) {
    const formValues = querystring.parse(parsed.query);
    if (!formValues.collection) {
      throw new Error("no collection specified");
    }
    res.write(list(pulsarCrud, formValues.collection));
  },
  "/details": async function (parsed, res, pulsarCrud) {
    const formValues = querystring.parse(parsed.query);
    if (!formValues.collection) {
      throw new Error("no collection specified");
    }
    if (!formValues.id) {
      throw new Error("no id specified");
    }
    res.write(details(pulsarCrud, formValues.collection, formValues.id));
  },
  "/main": async function (parsed, res, pulsarCrud) {
    res.write(main(pulsarCrud));
  },
  "/fileManagement": async function (parsed, res, pulsarCrud) {
    try {
      const fileList = await pulsarCrud.fileList();
      res.write(fileManagement({fileList}));
    } catch (e) {
      console.error(e);
      res.write(error(e.message));
    }
  }
}

export default function (server, pulsarCrud) {
  server.on("request", async (req, res) => {
    try {
      let parsed = parse(req.url);
      console.log("admin request : ", parsed, parsed.pathname);
      if (routes[parsed.pathname]) {
        res.writeHead(200, routes[parsed.pathname].headers ? routes[parsed.pathname].headers : { 'Content-Type': 'text/html' });
        if (routes[parsed.pathname].logic) {
          await routes[parsed.pathname].logic(parsed, res, pulsarCrud, req);
        } else {
          await routes[parsed.pathname](parsed, res, pulsarCrud, req);
        }
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

