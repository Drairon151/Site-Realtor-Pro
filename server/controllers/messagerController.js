const Chat = require('../models/Chat');
const User = require('../models/User');
const mongoose = require('mongoose'); // Убедись, что mongoose импортирован

// GET /api/messager/getChatsInfo
exports.getChatsInfo = async (req, res) => {
  console.log('🔍 [getChatsInfo] Запрос на получение информации о чатах');
  try {
    console.log('🔍 [getChatsInfo] ID текущего пользователя:', req.user._id);

    const user = await User.findById(req.user._id)
      .select('chatIds')
      .populate({
        path: 'chatIds',
        populate: [
          { path: 'participant1', select: 'name surname avatarUrl' },
          { path: 'participant2', select: 'name surname avatarUrl' },
          { 
            path: 'messages', 
            options: { sort: { timestamp: -1 }, limit: 1 } 
          }
        ],
        options: { sort: { updatedAt: -1 } }
      });

    if (!user) {
      console.warn('⚠️ [getChatsInfo] Пользователь не найден по ID:', req.user._id);
      return res.status(404).json({ error: 'User not found' });
    }

    console.log('✅ [getChatsInfo] Найдено чатов у пользователя:', user.chatIds?.length || 0);

    const chats = user.chatIds || [];
    const result = chats.map(chat => {
      console.log('🔍 [getChatsInfo] Обработка чата:', chat._id.toString());

      // Определяем собеседника: кто не является текущим пользователем
      let other = null;
      const userIdStr = req.user._id.toString();

      if (chat.participant1?._id.toString() === userIdStr) {
        other = chat.participant2;
      } else if (chat.participant2?._id.toString() === userIdStr) {
        other = chat.participant1;
      }

      if (!other) {
        console.warn('⚠️ [getChatsInfo] Не найден собеседник в чате:', chat._id.toString());
        other = { name: 'Unknown', surname: '', avatarUrl: null };
      }

      const lastMessage = chat.messages.length ? chat.messages[0] : null;
      if (lastMessage) {
        console.log('📄 [getChatsInfo] Последнее сообщение в чате:', lastMessage.text);
      }

      return {
        name: `${other.name || 'Unknown'} ${other.surname || ''}`.trim() || 'Unknown',
        chat_id: chat._id.toString(),
        avatar_url: other.avatarUrl || '/default-avatar.png',
        lastMessage: lastMessage
          ? { text: lastMessage.text, timestamp: lastMessage.timestamp }
          : null,
      };
    });

    console.log('✅ [getChatsInfo] Ответ готов. Количество чатов в ответе:', result.length);
    res.json(result);
  } catch (err) {
    console.error('❌ [getChatsInfo] Ошибка:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
// GET /api/messager/getChatData?chatId=...
exports.getChatData = async (req, res) => {
  console.log('🔍 [getChatData] Запрос данных чата');
  try {
    const { chatId } = req.query;
    console.log('📥 [getChatData] Получен chatId из запроса:', chatId);

    if (!chatId) {
      console.warn('⚠️ [getChatData] chatId не указан');
      return res.status(400).json({ error: 'chatId required' });
    }

    // Находим чат и загружаем участников и сообщения
    const chat = await Chat.findById(chatId)
      .populate('participant1', 'name surname')
      .populate('participant2', 'name surname')
      .populate('messages.sender', 'name surname');

    if (!chat) {
      console.warn('⚠️ [getChatData] Чат не найден по ID:', chatId);
      return res.status(404).json({ error: 'Chat not found' });
    }

    // Проверка доступа: текущий пользователь должен быть одним из участников
    const userIdStr = req.user._id.toString();
    const isParticipant =
      chat.participant1?._id.toString() === userIdStr ||
      chat.participant2?._id.toString() === userIdStr;

    if (!isParticipant) {
      console.warn('🔒 [getChatData] Доступ запрещён. Пользователь не в чате:', req.user._id);
      return res.status(403).json({ error: 'Access denied' });
    }

    // Определяем собеседника
    const other =
      chat.participant1?._id.toString() === userIdStr
        ? chat.participant2
        : chat.participant1;

    if (!other) {
      console.warn('⚠️ [getChatData] Не удалось определить собеседника в чате:', chatId);
    }

    // Формируем историю сообщений
    const chatHistory = chat.messages.map(msg => ({
      userName: msg.sender?.name || 'Unknown',
      userID: msg.sender?._id.toString() || null,
      messageId: String(msg._id),
      text: msg.text,
      timeStamp: msg.timestamp,
    }));

    console.log('✅ [getChatData] Подготовлено сообщений:', chatHistory.length);

    // Формат ответа совместим с фронтендом
    res.json({
      [chatId]: {
        chatData: {
          users: {
            [other?._id.toString() || 'unknown']: {
              userName: `${other?.name || ''} ${other?.surname || ''}`.trim() || 'Unknown',
            },
          },
        },
        chatHistory,
      },
    });
  } catch (err) {
    console.error('❌ [getChatData] Ошибка:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// POST /api/messager/createNewChat
exports.createNewChat = async (req, res) => {
  console.log('🔄 [createNewChat] Запрос на создание чата');
  try {
    const { recipientId } = req.body;
    const currentUserId = req.user._id;

    if (!recipientId) {
      return res.status(400).json({ error: 'recipientId required' });
    }

    if (recipientId.toString() === currentUserId.toString()) {
      return res.status(400).json({ error: 'Cannot chat with yourself' });
    }

    const recipient = await User.findById(recipientId, '_id');
    if (!recipient) {
      return res.status(404).json({ error: 'Recipient not found' });
    }

    // 🔑 Канонический порядок: меньший ID → participant1
    const ids = [currentUserId.toString(), recipientId.toString()].sort();
    const participant1 = new mongoose.Types.ObjectId(ids[0]);
    const participant2 = new mongoose.Types.ObjectId(ids[1]);

    // Поиск существующего чата
    let chat = await Chat.findOne({ participant1, participant2 });

    if (!chat) {
      console.log('🆕 [createNewChat] Чат не найден — создаём новый');
      chat = new Chat({ participant1, participant2, messages: [] });
      await chat.save();
      console.log('✅ [createNewChat] Новый чат создан:', chat._id);

      // Обновляем chatIds у пользователей
      await Promise.all([
        User.updateOne({ _id: currentUserId }, { $addToSet: { chatIds: chat._id } }),
        User.updateOne({ _id: recipientId }, { $addToSet: { chatIds: chat._id } })
      ]);
    } else {
      console.log('🔄 [createNewChat] Чат уже существует:', chat._id);
    }

    res.json({ chatId: chat._id.toString() });
  } catch (err) {
    if (err.code === 11000) {
      // Race condition: повторно найдём чат
      const ids = [req.user._id.toString(), req.body.recipientId.toString()].sort();
      const participant1 = new mongoose.Types.ObjectId(ids[0]);
      const participant2 = new mongoose.Types.ObjectId(ids[1]);
      const chat = await Chat.findOne({ participant1, participant2 });
      if (chat) {
        return res.json({ chatId: chat._id.toString() });
      }
    }
    console.error('❌ [createNewChat] Ошибка:', err);
    res.status(500).json({ error: 'Failed to create chat' });
  }
};