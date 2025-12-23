export class RateLimitCaller {
  private callTimestamps: number[] = [];

  constructor(private limitPerSecond: number) {}

  async waitToCall(): Promise<void> {
    const now = Date.now();
    const oneSecondAgo = now - 1000;

    // Remove timestamps older than 1 second
    this.callTimestamps = this.callTimestamps.filter(
      (timestamp) => timestamp > oneSecondAgo,
    );

    // Check if we've reached the limit
    if (this.callTimestamps.length >= this.limitPerSecond) {
      // Calculate how long we need to wait
      const waitTime = 1000;

      if (waitTime > 0) {
        await new Promise((resolve) => setTimeout(resolve, waitTime));
      }

      // Clean up again after waiting
      const newNow = Date.now();
      const newOneSecondAgo = newNow - 1000;
      this.callTimestamps = this.callTimestamps.filter(
        (timestamp) => timestamp > newOneSecondAgo,
      );
    }

    // Record this call
    this.callTimestamps.push(Date.now());
  }

  // Optional: Method to get current rate limit status
  getCurrentUsage(): { used: number; limit: number; available: number } {
    const now = Date.now();
    const oneSecondAgo = now - 1000;

    // Count only recent calls
    const recentCalls = this.callTimestamps.filter(
      (timestamp) => timestamp > oneSecondAgo,
    ).length;

    return {
      used: recentCalls,
      limit: this.limitPerSecond,
      available: Math.max(0, this.limitPerSecond - recentCalls),
    };
  }

  // Optional: Reset rate limiter
  reset(): void {
    this.callTimestamps = [];
  }
}
