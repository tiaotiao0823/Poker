import { WebSocketMessage } from '../types';

const WS_URL = process.env.REACT_APP_WS_URL || 'ws://localhost:3001';

class WebSocketService {
  private ws: WebSocket | null = null;
  private messageHandlers: ((message: WebSocketMessage) => void)[] = [];

  connect() {
    this.ws = new WebSocket(WS_URL);

    this.ws.onopen = () => {
      console.log('WebSocket 連接已建立');
    };

    this.ws.onmessage = (event) => {
      const message = JSON.parse(event.data) as WebSocketMessage;
      this.messageHandlers.forEach(handler => handler(message));
    };

    this.ws.onclose = () => {
      console.log('WebSocket 連接已關閉');
      // 嘗試重新連接
      setTimeout(() => this.connect(), 3000);
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket 錯誤:', error);
    };
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  send(message: WebSocketMessage) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.error('WebSocket 未連接');
    }
  }

  addMessageHandler(handler: (message: WebSocketMessage) => void) {
    this.messageHandlers.push(handler);
  }

  removeMessageHandler(handler: (message: WebSocketMessage) => void) {
    this.messageHandlers = this.messageHandlers.filter(h => h !== handler);
  }
}

export const wsService = new WebSocketService();
export default wsService; 