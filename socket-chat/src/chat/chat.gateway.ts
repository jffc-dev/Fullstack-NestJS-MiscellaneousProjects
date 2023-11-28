import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { OnModuleInit } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class ChatGateway implements OnModuleInit {
  @WebSocketServer()
  public server: Server;

  constructor(private readonly chatService: ChatService) {}

  onModuleInit() {
    this.server.on('connection', (socket: Socket) => {
      console.log('client connected: ');

      const { name, token } = socket.handshake.auth;
      console.log(name, token);

      if (!name) {
        socket.disconnect();
        return;
      }

      //Add client to list
      this.chatService.onClientConnected({ id: socket.id, name: name });

      //welcome message
      socket.emit('welcome-message', 'welcome to chat');

      //return list of connected clients
      this.server.emit('on-clients-change', this.chatService.getClients());

      socket.on('disconnect', () => {
        this.chatService.onClientDisconnected({ id: socket.id });
        this.server.emit('on-clients-change', this.chatService.getClients());
        // console.log('client disconnected:', socket.id);
      });
    });
  }
}
