// server/websocket/handlers.js
const Chat = require('../models/Chat');
const User = require('../models/User');
const { getAllClients, removeClient } = require('./clients');

const handleWebSocketMessage = async (ws, data) => {
  try {
    const msg = JSON.parse(data);
    console.log(`[WS MSG] Получено сообщение от ${ws.userId}:`, msg.type);

    if (msg.type === 'message:new') {
      const { chatId, text } = msg;
      console.log(`[WS MSG] Попытка отправить сообщение в чат ${chatId}`);

      if (!chatId || !text?.trim()) {
        console.warn('[WS MSG] ❌ Отсутствует chatId или текст');
        return ws.send(JSON.stringify({ type: 'error', message: 'chatId and text required' }));
      }

      const chat = await Chat.findById(chatId);
      if (!chat) {
        console.warn(`[WS MSG] ❌ Чат не найден: ${chatId}`);
        return ws.send(JSON.stringify({ type: 'error', message: 'Chat not found' }));
      }

      const isParticipant = chat.participants
        .filter(id => id != null)
        .some(id => id.toString() === ws.userId);

      if (!isParticipant) {
        console.warn(`[WS MSG] ❌ Пользователь ${ws.userId} не участник чата ${chatId}`);
        return ws.send(JSON.stringify({ type: 'error', message: 'Chat access denied' }));
      }

      // Сохраняем сообщение
      chat.messages.push({
        text: text.trim(),
        sender: ws.userId,
        timestamp: new Date(),
      });
      chat.updatedAt = new Date();
      await chat.save();

      const lastMessage = chat.messages[chat.messages.length - 1];
// После сохранения чата и получения lastMessage:

// 🔑 Загружаем данные ОТПРАВИТЕЛЯ (он же ws.userId)
      const senderUser = await User.findById(ws.userId).select('name surname');
      const userName = senderUser 
        ? senderUser.name 
        : 'Пользователь';

      const messageDto = {
        messageId: lastMessage._id.toString(),
        text: lastMessage.text,
        userID: lastMessage.sender.toString(),
        userName: userName,
        timeStamp: lastMessage.timestamp.toISOString(), // ← строка в формате ISO 8601
      };

      // Отправка отправителю
      ws.send(JSON.stringify({ type: 'message:created', chatId, message: messageDto }));
      console.log(`[WS MSG] Отправлено подтверждение отправителю ${ws.userId}`);

      // Отправка получателю
      const recipientId = chat.participants
        .filter(id => id != null)
        .map(id => id.toString())
        .find(id => id !== ws.userId);

      const recipientWs = getAllClients().get(recipientId);
      if (recipientWs?.readyState === WebSocket.OPEN) {
        recipientWs.send(JSON.stringify({ type: 'message:created', chatId, message: messageDto }));
        console.log(`[WS MSG] ✅ Сообщение доставлено получателю ${recipientId}`);
      } else {
        console.log(`[WS MSG] ⏳ Получатель ${recipientId} оффлайн`);
      }
    } else {
      console.warn(`[WS MSG] Неизвестный тип сообщения: ${msg.type}`);
      ws.send(JSON.stringify({ type: 'error', message: 'Unknown message type' }));
    }
  } catch (err) {
    console.error('[WS MSG] 💥 Ошибка при обработке сообщения:', err);
    ws.send(JSON.stringify({ type: 'error', message: 'Server error' }));
  }
};

const handleWebSocketConnection = (ws) => {
  console.log(`[WS CONN] 🟢 Новое соединение: ${ws.userId}`);

  ws.isAlive = true;
  ws.on('pong', () => {
    ws.isAlive = true;
    console.log(`[WS PONG] Получен pong от ${ws.userId}`);
  });

  ws.on('message', (data) => handleWebSocketMessage(ws, data));

  ws.on('close', () => {
    console.log(`[WS CONN] 🔴 Соединение закрыто для: ${ws.userId}`);
    removeClient(ws.userId); // ← используем clients.js
  });

  ws.on('error', (err) => {
    console.error(`[WS ERROR] У ${ws.userId}:`, err.message);
  });
};

module.exports = { handleWebSocketConnection };