import { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ArrowLeft, Send, Paperclip, Image as ImageIcon, Package, MoreVertical, Phone, Video } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface Message {
  id: string;
  senderId: 'seller' | 'customer';
  text?: string;
  image?: string;
  order?: {
    id: string;
    name: string;
    price: number;
    image: string;
  };
  time: string;
  isRead: boolean;
}

const mockMessages: Message[] = [
  {
    id: '1',
    senderId: 'customer',
    text: 'Chào shop! Em muốn hỏi về sản phẩm áo thun nam',
    time: '2025-11-13T14:20:00',
    isRead: true,
  },
  {
    id: '2',
    senderId: 'seller',
    text: 'Chào bạn! Shop có thể tư vấn cho bạn ạ. Bạn muốn hỏi về sản phẩm nào?',
    time: '2025-11-13T14:21:00',
    isRead: true,
  },
  {
    id: '3',
    senderId: 'customer',
    text: 'Áo này còn màu đen không shop? Và size M còn không ạ?',
    time: '2025-11-13T14:23:00',
    isRead: true,
  },
  {
    id: '4',
    senderId: 'seller',
    text: 'Dạ màu đen size M vẫn còn hàng bạn nhé. Bạn có muốn đặt hàng không?',
    time: '2025-11-13T14:24:00',
    isRead: true,
  },
  {
    id: '5',
    senderId: 'customer',
    order: {
      id: 'P001',
      name: 'Áo thun nam cổ tròn',
      price: 199000,
      image: '👕',
    },
    time: '2025-11-13T14:25:00',
    isRead: true,
  },
  {
    id: '6',
    senderId: 'customer',
    text: 'Em đặt sản phẩm này ạ!',
    time: '2025-11-13T14:25:30',
    isRead: true,
  },
  {
    id: '7',
    senderId: 'seller',
    text: 'Dạ shop đã nhận được đơn hàng của bạn. Shop sẽ xử lý và giao hàng trong 2-3 ngày làm việc nhé!',
    time: '2025-11-13T14:26:00',
    isRead: true,
  },
  {
    id: '8',
    senderId: 'customer',
    text: 'Cho em hỏi sản phẩm này còn màu đen không ạ?',
    time: '2025-11-13T14:30:00',
    isRead: false,
  },
];

interface SellerChatDetailProps {
  conversationId: string;
  customerName: string;
  onBack: () => void;
}

export function SellerChatDetail({ conversationId, customerName, onBack }: SellerChatDetailProps) {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      senderId: 'seller',
      text: newMessage,
      time: new Date().toISOString(),
      isRead: false,
    };

    setMessages([...messages, message]);
    setNewMessage('');
    toast.success('Đã gửi tin nhắn');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const message: Message = {
          id: Date.now().toString(),
          senderId: 'seller',
          image: reader.result as string,
          time: new Date().toISOString(),
          isRead: false,
        };
        setMessages([...messages, message]);
        toast.success('Đã gửi hình ảnh');
      };
      reader.readAsDataURL(file);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Hôm nay';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Hôm qua';
    }
    return date.toLocaleDateString('vi-VN');
  };

  const renderMessage = (message: Message, index: number) => {
    const isFirstMessageOfDay =
      index === 0 ||
      formatDate(messages[index - 1].time) !== formatDate(message.time);

    const isSeller = message.senderId === 'seller';

    return (
      <div key={message.id}>
        {isFirstMessageOfDay && (
          <div className="flex justify-center my-4">
            <Badge variant="secondary" className="text-xs">
              {formatDate(message.time)}
            </Badge>
          </div>
        )}

        <div className={`flex gap-2 mb-3 ${isSeller ? 'justify-end' : 'justify-start'}`}>
          {!isSeller && (
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs">{customerName.charAt(0)}</span>
            </div>
          )}

          <div className={`flex flex-col gap-1 max-w-[75%] ${isSeller ? 'items-end' : 'items-start'}`}>
            {message.text && (
              <div
                className={`rounded-2xl px-4 py-2 ${
                  isSeller
                    ? 'bg-blue-600 text-white rounded-br-sm'
                    : 'bg-gray-100 text-gray-900 rounded-bl-sm'
                }`}
              >
                <p className="text-sm">{message.text}</p>
              </div>
            )}

            {message.image && (
              <div className="rounded-2xl overflow-hidden border">
                <img src={message.image} alt="Sent" className="max-w-full h-auto max-h-64 object-cover" />
              </div>
            )}

            {message.order && (
              <Card className="max-w-xs">
                <CardContent className="p-3">
                  <div className="flex items-center gap-2">
                    <div className="text-3xl">{message.order.image}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs truncate">{message.order.name}</p>
                      <p className="text-xs text-red-600">
                        {message.order.price.toLocaleString('vi-VN')} ₫
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <span className="text-[10px] text-gray-400 px-1">{formatTime(message.time)}</span>
          </div>

          {isSeller && (
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs">S</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] sm:h-[calc(100vh-10rem)]">
      {/* Header */}
      <Card className="rounded-b-none border-b">
        <CardContent className="p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={onBack} className="-ml-2">
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="relative">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <span className="text-white">{customerName.charAt(0)}</span>
                </div>
                <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-white rounded-full" />
              </div>
              <div>
                <p className="text-sm">{customerName}</p>
                <p className="text-xs text-green-600">Đang hoạt động</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="hidden sm:flex">
                <Phone className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hidden sm:flex">
                <Video className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {messages.map((message, index) => renderMessage(message, index))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <Card className="rounded-t-none border-t">
        <CardContent className="p-3">
          <div className="flex items-end gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => fileInputRef.current?.click()}
              className="flex-shrink-0"
            >
              <ImageIcon className="h-5 w-5" />
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
            
            <div className="flex-1">
              <Input
                placeholder="Nhập tin nhắn..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                className="resize-none"
              />
            </div>

            <Button
              onClick={handleSend}
              disabled={!newMessage.trim()}
              className="flex-shrink-0"
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
