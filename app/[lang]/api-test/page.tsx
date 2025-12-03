'use client';

import type { JSX } from 'react';
import { useEffect, useState } from 'react';

/**
 * The API test page component for testing API performance
 * @returns {JSX.Element} The API test page component
 */
export default function ApiTestPage(): JSX.Element {
  const [loadingTimes, setLoadingTimes] = useState<number[]>([]);
  const [averageTime, setAverageTime] = useState<number>(0);

  /**
   * Test API performance on component mount
   * Tests API response time by sending 20 requests to the /api/test-connection endpoint
   * Records the time taken for each request and calculates the average response time
   */
  useEffect(() => {
    let cancelled = false;

    const runPerformanceTest = async (): Promise<void> => {
      const times = [];
      /** Loop 20 times to get sufficient data points for performance analysis */
      for (let i = 0; i < 20; i++) {
        const startTime = performance.now();
        try {
          const response = await fetch('/api/test-connection');
          await response.text();
          const endTime = performance.now();
          times.push(endTime - startTime);
        } catch (error) {
          // eslint-disable-next-line no-console
          console.log('API test failed:', error);
          times.push(-1);
        }
      }

      if (!cancelled) {
        setLoadingTimes(times);
        /** Filter out successful request times (values greater than 0) */
        const validTimes = times.filter((t) => t > 0);
        /** Calculate and set the average response time */
        if (validTimes.length > 0) {
          const avg = validTimes.reduce((a, b) => a + b, 0) / validTimes.length;
          setAverageTime(avg);
        }
      }
    };

    runPerformanceTest();

    return () => {
      cancelled = true;
    };
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
