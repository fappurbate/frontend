import RequestTarget from '@kothique/request-target';
import io from 'socket.io-client';

import { CustomError } from './errors';

const url = `http://${window.location.host}/app`;

let socket = null;

const eventHandlers = new EventTarget;
export { eventHandlers as events };

const requestHandlers = new RequestTarget;
export { requestHandlers as requests };

export function emit(subject, data = null) {
  socket.emit('event', subject, data);
}

export function request(subject, data = null) {
  return new Promise((resolve, reject) => {
    socket.emit('request', subject, ...data ? [data] : [], (err, response) => {
      if (err) { return reject(err); }
      resolve(response);
    })
  });
}

(function connect() {
  if (socket && socket.connected) { return; }

  console.log(`WS: connecting to ${url}...`);
  socket = io(url);

  socket.on('connect', () => {
    console.log(`WS: successfully (re)connected to ${url}.`);
  });

  socket.on('disconnect', reason => {
    console.log(`WS: connection closed: ${reason}`);

    if (reason === 'io server disconnect') {
      socket.connect();
    }
  });

  socket.on('reconnecting', () => {
    console.log(`WS: reconnecting to ${url}...`);
  });

  socket.on('event', (subject, data) => {
    eventHandlers.dispatchEvent(new CustomEvent(subject, { detail: data }));
  });

  socket.on('request', async (payload, ack) => {
    const { subject, data } = payload;

    try {
      const result = await requestHandlers.request(subject, data);
      ack({ data: result });
    } catch (error) {
      ack({ error: error.message, data: error.data });
    }
  });
})();
