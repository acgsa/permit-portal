'use client';

import { useEffect, useRef, useCallback } from 'react';
import { IS_DEMO_MODE } from '@/lib/appMode';

const WS_BASE = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000')
  .replace(/^http/, 'ws');

export interface NotificationPayload {
  type: string;
  workflow_id?: number;
  message?: string;
  [key: string]: unknown;
}

interface Options {
  token: string | null;
  onMessage: (payload: NotificationPayload) => void;
  /** Milliseconds between reconnect attempts. Default: 3000. */
  retryDelay?: number;
}

/**
 * Opens a WebSocket to /ws/notifications?token=... whenever `token` is set.
 * Automatically reconnects on unexpected closes.
 */
export function useNotifications({ token, onMessage, retryDelay = 3000 }: Options): void {
  const onMessageRef = useRef(onMessage);
  onMessageRef.current = onMessage;

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const activeRef = useRef(false);

  const connect = useCallback(() => {
    if (!token || IS_DEMO_MODE) return;

    const ws = new WebSocket(`${WS_BASE}/ws/notifications?token=${encodeURIComponent(token)}`);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data as string) as NotificationPayload;
        onMessageRef.current(payload);
      } catch {
        // ignore malformed frames
      }
    };

    ws.onclose = (event) => {
      if (!activeRef.current) return;
      // 4401 = auth error — don't retry
      if (event.code === 4401) return;
      timerRef.current = setTimeout(connect, retryDelay);
    };
  }, [token, retryDelay]);

  useEffect(() => {
    if (!token || IS_DEMO_MODE) return;
    activeRef.current = true;
    connect();

    return () => {
      activeRef.current = false;
      if (timerRef.current) clearTimeout(timerRef.current);
      wsRef.current?.close();
    };
  }, [token, connect]);
}
