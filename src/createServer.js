import { createServer as createHttpServer } from "http";
import { createServer as createHttpsServer } from 'https';

export default function (args) {
  const secure = args.indexOf("-s") > -1;
  const certPath = args[args.indexOf("-c") + 1];
  const keyPath = args[args.indexOf("-k") + 1];

  const server = secure ? createHttpsServer({ certPath, keyPath }) : createHttpServer();
  return server;
}