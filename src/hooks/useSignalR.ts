import { useEffect, useState, useRef, useCallback } from 'react';
import * as signalR from '@microsoft/signalr';
import { useAuth } from '../context/AuthContext';
import { chatApi } from '../api/chatApi';
import type { ChatMessage } from '../types';

export const useSignalR = () => {
  const { token, user, isAdmin } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [bellCount, setBellCount] = useState<number>(0);
  const [connected, setConnected] = useState<boolean>(false);
  const [loadingHistory, setLoadingHistory] = useState<boolean>(true);
  const connectionRef = useRef<signalR.HubConnection | null>(null);

  const hubUrl = import.meta.env.VITE_HUB_URL || 'http://localhost:5000/chathub';

  // 1. Tải lịch sử tin nhắn từ database khi khởi động
  const fetchHistory = useCallback(async () => {
    if (!token) return;
    try {
      setLoadingHistory(true);
      const history = await chatApi.getMessages();
      setMessages(history);
      // Cập nhật số tin nhắn chưa đọc
      const count = await chatApi.getUnreadCount();
      setBellCount(count);
    } catch (err) {
      console.warn('Lỗi tải lịch sử tin nhắn:', err);
    } finally {
      setLoadingHistory(false);
    }
  }, [token]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  // 2. Kết nối SignalR Hub
  useEffect(() => {
    if (!token) {
      if (connectionRef.current) {
        connectionRef.current.stop();
        connectionRef.current = null;
        setConnected(false);
      }
      return;
    }

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl, {
        accessTokenFactory: () => token,
        skipNegotiation: false,
        transport: signalR.HttpTransportType.WebSockets | signalR.HttpTransportType.LongPolling,
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Warning)
      .build();

    // Nhận tin nhắn Realtime
    connection.on('ReceiveMessage', (senderUser: string, messageText: string) => {
      const newMsg: ChatMessage = {
        user: senderUser,
        message: messageText,
        timestamp: new Date().toISOString(),
        isRead: false,
      };
      setMessages((prev) => [...prev, newMsg]);
    });

    // Cập nhật chuông thông báo
    connection.on('UpdateBellCount', () => {
      chatApi.getUnreadCount().then(setBellCount).catch(() => {
        setBellCount((prev) => prev + 1);
      });
    });

    connection
      .start()
      .then(() => {
        setConnected(true);
      })
      .catch((err) => {
        console.warn('SignalR Hub Connection error:', err);
        setConnected(false);
      });

    connectionRef.current = connection;

    return () => {
      connection.stop();
    };
  }, [token, hubUrl]);

  // 3. Gửi tin nhắn
  const sendMessage = useCallback(
    async (messageText: string) => {
      if (connectionRef.current && connectionRef.current.state === signalR.HubConnectionState.Connected) {
        // Nếu là Admin, gửi "Admin" để đồng bộ với MVC chathub.js
        const sender = isAdmin ? 'Admin' : (user?.hoTen || user?.mssv || 'Sinh viên');
        await connectionRef.current.invoke('SendMessage', sender, messageText);
      } else {
        throw new Error('Chưa kết nối được đến máy chủ trò chuyện realtime!');
      }
    },
    [user, isAdmin]
  );

  // 4. Xóa chuông thông báo
  const clearBell = useCallback(async () => {
    try {
      await chatApi.markRead();
      setBellCount(0);
    } catch {
      setBellCount(0);
    }
  }, []);

  return {
    messages,
    bellCount,
    connected,
    loadingHistory,
    sendMessage,
    clearBell,
    reloadHistory: fetchHistory,
  };
};
