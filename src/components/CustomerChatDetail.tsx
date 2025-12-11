import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Send, ArrowLeft, Store } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  message: string;
  createdAt: string;
  isOwn: boolean;
}

interface CustomerChatDetailProps {
  conversationId: string;
  sellerName: string;
  onBack: () => void;
}

const mockMessages: Record<string, Message[]> = {
  '1': [
    {
      id: '1',
      senderId: '4',
      senderName: 'Nguyễn Văn A',
      message: 'Cho mình hỏi sản phẩm còn hàng không ạ?',
      createdAt: '2025-11-08T10:25:00',
      isOwn: true,
    },
    {
      id: '2',
      senderId: '2',
      senderName: 'Nhân viên bán hàng A',
      message: 'Dạ, sản phẩm còn hàng ạ',
      createdAt: '2025-11-08T10:26:00',
      isOwn: false,
    },
    {
      id: '3',
      senderId: '2',
      senderName: 'Nhân viên bán hàng A',
      message: 'Bạn có thể đặt hàng ngay bây giờ nhé',
      createdAt: '2025-11-08T10:30:00',
      isOwn: false,
    },
  ],
  '2': [
    {
      id: '1',
      senderId: '4',
      senderName: 'Nguyễn Văn A',
      message: 'Đơn hàng của mình đã được giao chưa ạ?',
      createdAt: '2025-11-07T15:15:00',
      isOwn: true,
    },
    {
      id: '2',
      senderId: '3',
      senderName: 'Nhân viên bán hàng B',
      message: 'Đơn hàng của bạn đã được giao thành công rồi ạ. Cảm ơn bạn đã mua hàng!',
      createdAt: '2025-11-07T15:20:00',
      isOwn: false,
    },
  ],
};

export function CustomerChatDetail({ conversationId, sellerName, onBack }: CustomerChatDetailProps) {
  const [messages, setMessages] = useState<Message[]>(mockMessages[conversationId] || []);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      senderId: '4',
      senderName: 'Nguyễn Văn A',
      message: newMessage,
      createdAt: new Date().toISOString(),
      isOwn: true,
    };

    setMessages([...messages, message]);
    setNewMessage('');
    toast.success('Đã gửi tin nhắn');
  };

  return (
    <div className="space-y-3 sm:space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack} className="flex-shrink-0">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-3 flex-1">
          <Avatar>
            <AvatarFallback>
              <Store className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-base sm:text-lg">{sellerName}</h1>
            <p className="text-xs text-gray-500">Đang hoạt động</p>
          </div>
        </div>
      </div>

      {/* Chat Window */}
      <Card className="h-[calc(100vh-250px)] sm:h-[600px] flex flex-col">
        <CardContent className="p-0 flex-1 flex flex-col">
          <ScrollArea className="flex-1 p-3 sm:p-4">
            <div className="space-y-3 sm:space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] sm:max-w-[70%] rounded-lg p-2.5 sm:p-3 ${
                      message.isOwn
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm">{message.message}</p>
                    <p
                      className={`text-xs mt-1 ${
                        message.isOwn ? 'text-blue-100' : 'text-gray-500'
                      }`}
                    >
                      {new Date(message.createdAt).toLocaleTimeString('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          <div className="p-3 sm:p-4 border-t">
            <div className="flex gap-2">
              <Input
                placeholder="Nhập tin nhắn..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                className="h-9 sm:h-10"
              />
              <Button onClick={handleSendMessage} size="sm">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
