// server/websocket/clients.js
const connectedClients = new Map();

const addClient = (userId, ws) => {
  connectedClients.set(userId, ws);
};

const removeClient = (userId) => {
  connectedClients.delete(userId);
};

const getClient = (userId) => {
  return connectedClients.get(userId);
};

const getAllClients = () => {
  return connectedClients;
};

module.exports = { addClient, removeClient, getClient, getAllClients };