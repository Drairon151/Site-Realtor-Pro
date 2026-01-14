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
          { path: 'participants', select: 'name surname avatarUrl' },
          { path: 'messages', options: { sort: { timestamp: -1 }, limit: 1 } }
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
      const other = chat.participants.find(p => !p._id.equals(req.user._id));
      if (!other) {
        console.warn('⚠️ [getChatsInfo] Не найден собеседник в чате:', chat._id.toString());
      }

      const lastMessage = chat.messages.length ? chat.messages[0] : null;
      if (lastMessage) {
        console.log('📄 [getChatsInfo] Последнее сообщение в чате:', lastMessage.text);
      }

      return {
        name: `${other?.name || 'Unknown'} ${other?.surname || ''}`,
        chat_id: chat._id.toString(),
        avatar_url: other?.avatarUrl || '/default-avatar.png',
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

    const chat = await Chat
      .findById(chatId)
      .populate('participants', 'name surname')
      .populate('messages.sender', 'name surname');

    if (!chat) {
      console.warn('⚠️ [getChatData] Чат не найден по ID:', chatId);
      return res.status(404).json({ error: 'Chat not found' });
    }

    console.log('🔍 [getChatData] Участники чата:', chat.participants.map(p => p._id.toString()));
    const hasAccess = chat.participants.some(p => p._id.equals(req.user._id));
    if (!hasAccess) {
      console.warn('🔒 [getChatData] Доступ запрещён. Пользователь не в чате:', req.user._id);
      return res.status(403).json({ error: 'Access denied' });
    }

    const other = chat.participants.find(p => !p._id.equals(req.user._id));
    if (!other) {
      console.warn('⚠️ [getChatData] Не удалось определить собеседника в чате:', chatId);
    }

    const chatHistory = chat.messages.map(msg => ({
      userName: msg.sender?.name || 'Unknown',
      userID: msg.sender?._id.toString() || null,
      messageId: msg._id.toString(),
      text: msg.text,
      timeStamp: msg.timestamp,
    }));

    console.log('✅ [getChatData] Подготовлено сообщений:', chatHistory.length);
    res.json({
      [chatId]: {
        chatData: {
          users: {
            [other?._id.toString() || 'unknown']: {
              userName: `${other?.name || ''} ${other?.surname || ''}`.trim() || 'Unknown',
            }
          }
        },
        chatHistory,
      }
    });
  } catch (err) {
    console.error('❌ [getChatData] Ошибка:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// POST /api/messager/createNewChat { recipientId: "..." }
exports.createNewChat = async (req, res) => {
  console.log('🔄 [createNewChat] Попытка создания нового чата');
  try {
    const { recipientId } = req.body;
    console.log('📥 [createNewChat] Получен recipientId:', recipientId);

    if (!recipientId) {
      console.warn('⚠️ [createNewChat] recipientId не указан');
      return res.status(400).json({ error: 'recipientId required' });
    }

    const recipient = await User.findById(recipientId);
    if (!recipient) {
      console.warn('⚠️ [createNewChat] Получатель не найден по ID:', recipientId);
      return res.status(404).json({ error: 'Recipient not found' });
    }

    console.log('👤 [createNewChat] Роль текущего пользователя:', req.user.role);
    console.log('👤 [createNewChat] Роль получателя:', recipient.role);

    if (req.user.role === recipient.role) {
      console.warn('⚠️ [createNewChat] Запрещено создавать чат между пользователями одной роли');
      return res.status(400).json({ error: 'Chats allowed only between client and realtor' });
    }

    // Сортируем ID для уникальности
    const participants = [req.user._id, recipient._id]
      .map(id => id.toString())
      .sort()
      .map(id => new mongoose.Types.ObjectId(id));

    console.log('👥 [createNewChat] Участники чата (отсортированы):', participants.map(p => p.toString()));

    let chat = await Chat.findOne({ participants });
    if (!chat) {
      console.log('🆕 [createNewChat] Чат не найден — создаём новый');
      chat = new Chat({ participants, messages: [] });
      await chat.save();
      console.log('✅ [createNewChat] Новый чат сохранён с ID:', chat._id.toString());

      // Добавляем chat._id в chatIds обоих пользователей
      await User.updateOne(
        { _id: req.user._id },
        { $addToSet: { chatIds: chat._id } }
      );
      await User.updateOne(
        { _id: recipient._id },
        { $addToSet: { chatIds: chat._id } }
      );
      console.log('✅ [createNewChat] chatId добавлен в профили обоих пользователей');
    } else {
      console.log('🔄 [createNewChat] Чат уже существует с ID:', chat._id.toString());

      // Защита от рассинхронизации chatIds
      const updates = [];
      const currentUserChatIds = req.user.chatIds?.map(id => id.toString()) || [];
      const recipientChatIds = recipient.chatIds?.map(id => id.toString()) || [];

      if (!currentUserChatIds.includes(chat._id.toString())) {
        console.log('🔧 [createNewChat] Добавляем chatId в профиль текущего пользователя');
        updates.push(
          User.updateOne(
            { _id: req.user._id },
            { $addToSet: { chatIds: chat._id } }
          )
        );
      }
      if (!recipientChatIds.includes(chat._id.toString())) {
        console.log('🔧 [createNewChat] Добавляем chatId в профиль получателя');
        updates.push(
          User.updateOne(
            { _id: recipient._id },
            { $addToSet: { chatIds: chat._id } }
          )
        );
      }
      if (updates.length) {
        await Promise.all(updates);
        console.log('✅ [createNewChat] Выполнено обновление chatIds для рассинхронизированных пользователей');
      }
    }

    console.log('📤 [createNewChat] Отправка ответа с chatId:', chat._id.toString());
    res.json({ chatId: chat._id.toString() });
  } catch (err) {
    console.error('❌ [createNewChat] Ошибка:', err);
    res.status(500).json({ error: 'Failed to create chat' });
  }
};