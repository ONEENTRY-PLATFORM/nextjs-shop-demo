'use client';

import { useEffect, useState } from 'react';

export default function ApiTestPage() {
  const [loadingTimes, setLoadingTimes] = useState<number[]>([]);
  const [averageTime, setAverageTime] = useState<number>(0);

  const testApiPerformance = async () => {
    const times = [];
    for (let i = 0; i < 20; i++) {
      const startTime = performance.now();
      try {
        const response = await fetch('/api/test-connection');
        await response.text();
        const endTime = performance.now();
        times.push(endTime - startTime);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('API test failed:', error);
        times.push(-1);
      }
    }
    setLoadingTimes(times);
    const validTimes = times.filter((t) => t > 0);
    if (validTimes.length > 0) {
      const avg = validTimes.reduce((a, b) => a + b, 0) / validTimes.length;
      setAverageTime(avg);
    }
  };

  useEffect(() => {
    testApiPerformance();
  }, []);

  return (
    <div className="p-8">
      <h1>API Performance Test</h1>
      <div className="mt-4">
        <h2>Response Times (ms):</h2>
        <ul>
          {loadingTimes.map((time, index) => (
            <li key={index}>
              Request {index + 1}: {time > 0 ? time.toFixed(2) : 'Failed'}
            </li>
          ))}
        </ul>
        {averageTime > 0 && (
          <p className="mt-4">
            <strong>Average Response Time:</strong> {averageTime.toFixed(2)} ms
          </p>
        )}
      </div>
    </div>
  );
}
