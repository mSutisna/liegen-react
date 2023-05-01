import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import { DotEnv } from '../types/general.js';
const config = dotenv.config();

const envVariables = config?.parsed as DotEnv;

if (!envVariables) {
  throw new Error('ORIGIN ENV VARIABLE NOT SET!');
}

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: envVariables.ORIGIN
  }
});

export {
  app,
  server,
  io
}