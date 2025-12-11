import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { Search, Store, ChevronRight } from 'lucide-react';

interface Conversation {
  id: string;
  sellerId: string;
  sellerName: string;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
}

const mockConversations: Conversation[] = [
  {
    id: '1',
    sellerId: '2',
    sellerName: 'Nhân viên bán hàng A',
    lastMessage: 'Dạ, sản phẩm còn hàng ạ',
    lastMessageAt: '2025-11-08T10:30:00',
    unreadCount: 2,
  },
  {
    id: '2',
    sellerId: '3',
    sellerName: 'Nhân viên bán hàng B',
    lastMessage: 'Cảm ơn bạn đã mua hàng!',
    lastMessageAt: '2025-11-07T15:20:00',
    unreadCount: 0,
  },
];

interface CustomerChatProps {
  onSelectConversation: (conversationId: string, sellerName: string) => void;
}

export function CustomerChat({ onSelectConversation }: CustomerChatProps) {
  const [conversations] = useState<Conversation[]>(mockConversations);
  const [searchTerm, setSearchTerm] = useState('');

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 1) return 'Vừa xong';
    if (hours < 24) return `${hours} giờ trước`;
    return date.toLocaleDateString('vi-VN');
  };

  const filteredConversations = conversations.filter((conv) =>
    conv.sellerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-3 sm:space-y-6">
      <div>
        <h1 className="mb-1">Tin nhắn</h1>
        <p className="text-gray-500 text-sm">Trò chuyện với người bán</p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              placeholder="Tìm kiếm cuộc trò chuyện..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-9"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[calc(100vh-280px)] sm:h-[500px]">
            {filteredConversations.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => onSelectConversation(conversation.id, conversation.sellerName)}
                className="w-full p-3 sm:p-4 border-b hover:bg-gray-50 text-left transition-colors"
              >
                <div className="flex items-start gap-3">
                  <Avatar>
                    <AvatarFallback>
                      <Store className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-semibold text-sm truncate">{conversation.sellerName}</p>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {conversation.unreadCount > 0 && (
                          <Badge variant="destructive" className="text-xs">
                            {conversation.unreadCount}
                          </Badge>
                        )}
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 truncate">{conversation.lastMessage}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {formatTime(conversation.lastMessageAt)}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
