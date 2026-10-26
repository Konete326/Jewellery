class LoadingManager {
  constructor() {
    this.activeRequests = 0;
    this.manualCount = 0;
    this.timer = null;
    this.hideTimer = null;
    this.startTime = 0;
    this.listeners = new Set();
    this.state = {
      isLoading: false,
      message: ''
    };
  }

  subscribe(listener) {
    this.listeners.add(listener);
    listener(this.state);
    return () => this.listeners.delete(listener);
  }

  notify() {
    this.listeners.forEach((listener) => listener(this.state));
  }

  startRequest(message = '') {
    this.activeRequests += 1;
    if (this.state.isLoading) {
      if (message) {
        this.state = { isLoading: true, message };
        this.notify();
      }
      return;
    }

    if (!this.timer) {
      this.timer = setTimeout(() => {
        this.timer = null;
        if (this.activeRequests > 0 || this.manualCount > 0) {
          this.startTime = Date.now();
          this.state = { isLoading: true, message };
          this.notify();
        }
      }, 180);
    }
  }

  endRequest() {
    this.activeRequests = Math.max(0, this.activeRequests - 1);
    this.checkCompletion();
  }

  start(message = '') {
    this.manualCount += 1;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    this.startTime = Date.now();
    this.state = { isLoading: true, message };
    this.notify();
  }

  stop() {
    this.manualCount = Math.max(0, this.manualCount - 1);
    this.checkCompletion();
  }

  checkCompletion() {
    if (this.activeRequests > 0 || this.manualCount > 0) return;

    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }

    if (!this.state.isLoading) return;

    const elapsed = Date.now() - this.startTime;
    const minDisplay = 200;
    const remaining = Math.max(0, minDisplay - elapsed);

    if (this.hideTimer) clearTimeout(this.hideTimer);

    this.hideTimer = setTimeout(() => {
      this.hideTimer = null;
      if (this.activeRequests === 0 && this.manualCount === 0) {
        this.state = { isLoading: false, message: '' };
        this.notify();
      }
    }, remaining);
  }
}

export const loadingManager = new LoadingManager();
