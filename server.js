const WebSocket = require('ws');
const express = require('express');
const app = express();

app.get('/', (req, res) => res.send('Chat SIRSAT activo'));

const server = app.listen(process.env.PORT || 3000);
const wss = new WebSocket.Server({ server });

const clients = new Set();
const agents = new Set();

wss.on('connection', (ws) => {
  ws.on('message', (data) => {
    const msg = JSON.parse(data);
    
    if (msg.type === 'register') {
      if (msg.role === 'agent') agents.add(ws);
      else clients.add(ws);
      return;
    }

    [...clients, ...agents].forEach(client => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(msg));
      }
    });
  });

  ws.on('close', () => {
    clients.delete(ws);
    agents.delete(ws);
  });
});

console.log("Servidor SIRSAT activo");