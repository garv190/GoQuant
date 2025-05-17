class SimpleEventEmitter<T = OrderbookData> {
  private events: { [key: string]: ((data?: T) => void)[] } = {};

  protected emit(event: string, data?: T): void {
    if (this.events[event]) {
      this.events[event].forEach(callback => callback(data));
    }
  }

  protected on(event: string, callback: (data?: T) => void): void {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }

  protected off(event: string, callback?: (data?: T) => void): void {
    if (!callback) {
      delete this.events[event];
    } else if (this.events[event]) {
      this.events[event] = this.events[event].filter(cb => cb !== callback);
    }
  }
}


interface OrderbookData {
  timestamp: string;
  exchange: string;
  symbol: string;
  asks: [string, string][];  
  bids: [string, string][];  
}

interface WebSocketOptions {
  onMessage: (data: OrderbookData) => void;
  onOpen?: () => void;
  onClose?: () => void;
  onError?: (error: Event) => void; 
}

class WebSocketHandler extends SimpleEventEmitter<OrderbookData>   {
  private socket: WebSocket | null = null;
  private options: WebSocketOptions;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout: number = 1000;
  private url = 'wss://ws.gomarket-cpp.goquant.io/ws/l2-orderbook/okx/BTC-USDT-SWAP';
  private mockMode = true; 

  constructor(options: WebSocketOptions) {
    super();
    this.options = options;
  }

  public connect(): void {
    if (this.socket) {
      return;
    }

    if (this.mockMode) {
      console.log('Using mock data mode...');
      this.startMockDataStream();
      if (this.options.onOpen) {
        this.options.onOpen();
      }
      return;
    }

    try {
      this.socket = new WebSocket(this.url);
      
      this.socket.onopen = () => {
        console.log('WebSocket connection established');
        this.reconnectAttempts = 0;
        if (this.options.onOpen) {
          this.options.onOpen();
        }
      };
      
      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.options.onMessage(data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };
      
      this.socket.onclose = (event) => {
        console.log(`WebSocket connection closed: ${event.code} ${event.reason}`);
        this.socket = null;
        
        if (this.options.onClose) {
          this.options.onClose();
        }
        
        this.reconnect();
      };
      
      this.socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        if (this.options.onError) {
          this.options.onError(error);
        }
      };
      
    } catch (error) {
      console.error('Error creating WebSocket:', error);
      this.reconnect();
    }
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  private reconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnect attempts reached');
      return;
    }
    
    this.reconnectAttempts++;
    const timeout = this.reconnectTimeout * Math.pow(1.5, this.reconnectAttempts - 1);
    
    console.log(`Attempting to reconnect in ${timeout}ms...`);
    
    setTimeout(() => {
      this.connect();
    }, timeout);
  }

  
 private startMockDataStream(): void {
    const mockTicker = setInterval(() => {
     
      const basePrice = 95400 + (Math.random() * 100 - 50);
      
      const mockData: OrderbookData = {
        timestamp: new Date().toISOString(),
        exchange: "OKX",
        symbol: "BTC-USDT-SWAP",
        asks: [
          [String(basePrice + 0.1), String(Math.random() * 10 + 5)],
          [String(basePrice + 2.5), String(Math.random() * 5 + 1)],
          [String(basePrice + 5), String(Math.random() * 10 + 2)],
          [String(basePrice + 10), String(Math.random() * 15 + 5)],
          [String(basePrice + 15), String(Math.random() * 20 + 10)]
        ] as [string, string][],
        bids: [
          [String(basePrice), String(Math.random() * 1500 + 500)],
          [String(basePrice - 0.1), String(Math.random() * 5 + 0.01)],
          [String(basePrice - 5), String(Math.random() * 10 + 2)],
          [String(basePrice - 10), String(Math.random() * 15 + 5)],
          [String(basePrice - 15), String(Math.random() * 20 + 10)]
        ] as [string, string][]
      };
      
      this.options.onMessage(mockData);
    }, 1000); 
    
    
    this.on('disconnect', () => {
      clearInterval(mockTicker);
    });
}
}

export default WebSocketHandler;