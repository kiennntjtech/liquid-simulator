import { WebSocket } from 'ws';
import {
  WebSocketSubscribeRequestDto,
  WebSocketUnsubscribeRequestDto,
  WebSocketInstrumentPositionDto,
  WebSocketChannelType,
  WebSocketWalletBalanceDto,
} from './dto/websocket.dto';
import { EventEmitter } from 'events';

export class LmaxSocketClient {
  private token: string | null = null;
  private ws: WebSocket | null = null;
  private eventEmitter = new EventEmitter();
  constructor(private wsUrl: string) {
    setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.ping();
      }
    }, 5000); // ping every 5 seconds
  }

  reconnect(token: string, retryCount: number = 3) {
    this.token = token;
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.ws = new WebSocket(`${this.wsUrl}/v1/web-socket`, {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });

    this.ws.on('open', () => {
      console.log('Lmax WebSocket connection opened.');
      this.ws.send(
        JSON.stringify({
          type: 'SUBSCRIBE',
          channels: ['INSTRUMENT_POSITIONS', 'WALLET_BALANCES'],
        } as WebSocketSubscribeRequestDto),
      );
      this.ws.ping();
    });

    this.ws.on('message', (data) => {
      console.log('Received message:', data.toString());
      try {
        const obj = JSON.parse(data.toString());
        this.eventEmitter.emit(obj.type, obj);
      } catch (error) {
        throw new Error('Failed to parse WebSocket message: ' + error);
      }
    });

    this.ws.on('close', () => {
      console.log('WebSocket connection closed. Attempting to reconnect...');
      if (retryCount > 0) {
        setTimeout(() => {
          this.reconnect(this.token!, retryCount - 1);
        }, 2000); // wait 2 seconds before reconnecting
      } else {
        console.error(
          'Max reconnection attempts reached. Could not reconnect.',
        );
      }
    });

    this.ws.on('error', (error) => {
      console.error('WebSocket error:', error);
      if (retryCount > 0) {
        setTimeout(() => {
          this.reconnect(this.token!, retryCount - 1);
        }, 2000); // wait 2 seconds before reconnecting
      }
    });
  }

  onPositionUpdate(callback: (data: WebSocketInstrumentPositionDto) => void) {
    this.eventEmitter.on('INSTRUMENT_POSITIONS', callback);
  }

  onWalletUpdate(callback: (data: WebSocketWalletBalanceDto) => void) {
    this.eventEmitter.on('WALLET_BALANCES', callback);
  }

  on(event: WebSocketChannelType, callback: (data: any) => void) {
    this.eventEmitter.on(event, callback);
  }
}
