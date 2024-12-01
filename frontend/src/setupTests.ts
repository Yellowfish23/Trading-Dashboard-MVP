import '@testing-library/jest-dom';

// Mock WebSocket
class MockWebSocket {
  onmessage: ((event: MessageEvent) => void) | null = null;
  onclose: (() => void) | null = null;
  readyState = WebSocket.OPEN;

  constructor(public url: string) {}

  send(data: string): void {
    // Mock send implementation
  }

  close(): void {
    if (this.onclose) {
      this.onclose();
    }
  }
}

global.WebSocket = MockWebSocket as any;

// Suppress console errors in tests
const originalError = console.error;
beforeAll(() => {
  console.error = (...args: any[]) => {
    if (
      /Warning: ReactDOM.render is no longer supported in React 18/.test(args[0]) ||
      /Warning: An update to .* inside a test was not wrapped in act/.test(args[0])
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
