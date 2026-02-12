// server/websocket/index.js
const WebSocket = require('ws');
const { authorizeWebSocket } = require('./auth');
const { handleWebSocketConnection } = require('./handlers');
const { addClient } = require('./clients'); // ← новый импорт

const initWebSocketServer = (server) => {
  const wss = new WebSocket.Server({ noServer: true });

  server.on('upgrade', async (request, socket, head) => {
    if (request.url !== '/ws/chat') {
      socket.destroy();
      return;
    }

    const userId = await authorizeWebSocket(request);
    if (!userId) {
      socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
      socket.destroy();
      return;
    }

    request.userId = userId;
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });
  });

  wss.on('connection', (ws, request) => {
    ws.userId = request.userId;
    addClient(ws.userId, ws); // ← регистрируем клиента
    handleWebSocketConnection(ws);
  });

  // Keep-alive
  const pingInterval = setInterval(() => {
    wss.clients.forEach(ws => {
      if (ws.isAlive === false) {
        console.log(`[WS TIMEOUT] Клиент ${ws.userId} отключён`);
        ws.terminate();
        // removeClient вызывается в ws.on('close')
      } else {
        ws.isAlive = false;
        ws.ping();
      }
    });
  }, 30000);

  wss.on('close', () => clearInterval(pingInterval));
  console.log('[WS INIT] ✅ WebSocket-сервер инициализирован');
  return { wss };
};

module.exports = { initWebSocketServer };