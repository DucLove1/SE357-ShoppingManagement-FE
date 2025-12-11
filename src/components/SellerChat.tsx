import { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Search, MessageCircle } from 'lucide-react';

interface Conversation {
  id: string;
  customerName: string;
  customerAvatar?: string;
  lastMessage: string;
  time: string;
  unread: number;
  isOnline: boolean;
}

const mockConversations: Conversation[] = [
  {
    id: '1',
    customerName: 'Nguyễn Văn A',
    lastMessage: 'Cho em hỏi sản phẩm này còn màu đen không ạ?',
    time: '2025-11-13T14:30:00',
    unread: 2,
    isOnline: true,
  },
  {
    id: '2',
    customerName: 'Trần Thị B',
    lastMessage: 'Shop ơi đơn hàng của em đến khi nào vậy?',
    time: '2025-11-13T13:15:00',
    unread: 1,
    isOnline: true,
  },
  {
    id: '3',
    customerName: 'Lê Văn C',
    lastMessage: 'Cảm ơn shop nhiều nhé!',
    time: '2025-11-13T10:45:00',
    unread: 0,
    isOnline: false,
  },
  {
    id: '4',
    customerName: 'Phạm Thị D',
    lastMessage: 'Sản phẩm có size XL không shop?',
    time: '2025-11-12T16:20:00',
    unread: 0,
    isOnline: false,
  },
  {
    id: '5',
    customerName: 'Hoàng Văn E',
    lastMessage: 'Shop có thể giao hàng nhanh được không?',
    time: '2025-11-12T14:10:00',
    unread: 3,
    isOnline: true,
  },
  {
    id: '6',
    customerName: 'Võ Thị F',
    lastMessage: 'Áo này có màu nào khác không ạ?',
    time: '2025-11-11T09:30:00',
    unread: 0,
    isOnline: false,
  },
];

interface SellerChatProps {
  onSelectConversation: (id: string, name: string) => void;
}

export function SellerChat({ onSelectConversation }: SellerChatProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const totalUnread = mockConversations.reduce((sum, conv) => sum + conv.unread, 0);

  const filteredConversations = mockConversations.filter(
    (conv) =>
      searchQuery === '' ||
      conv.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (hours < 1) return 'Vừa xong';
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="mb-1 sm:mb-2">Tin nhắn</h1>
        <p className="text-gray-500 text-sm">
          {totalUnread > 0
            ? `Bạn có ${totalUnread} tin nhắn chưa đọc`
            : 'Không có tin nhắn mới'}
        </p>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Tìm kiếm khách hàng..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      {/* Conversations */}
      <div className="space-y-2">
        {filteredConversations.length > 0 ? (
          filteredConversations.map((conv) => (
            <Card
              key={conv.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                conv.unread > 0 ? 'bg-blue-50 border-blue-200' : ''
              }`}
              onClick={() => onSelectConversation(conv.id, conv.customerName)}
            >
              <CardContent className="p-3 sm:p-4">
                <div className="flex gap-3">
                  <div className="relative flex-shrink-0">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <span className="text-white">{conv.customerName.charAt(0)}</span>
                    </div>
                    {conv.isOnline && (
                      <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-white rounded-full" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <p className={`text-sm truncate ${conv.unread > 0 ? 'font-semibold' : ''}`}>
                        {conv.customerName}
                      </p>
                      <span className="text-xs text-gray-500 flex-shrink-0">
                        {formatTime(conv.time)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <p
                        className={`text-xs truncate ${
                          conv.unread > 0 ? 'text-gray-900 font-medium' : 'text-gray-500'
                        }`}
                      >
                        {conv.lastMessage}
                      </p>
                      {conv.unread > 0 && (
                        <Badge variant="destructive" className="h-5 min-w-[20px] rounded-full px-1.5">
                          {conv.unread}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Không tìm thấy cuộc trò chuyện nào</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
