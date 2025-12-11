import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { ArrowLeft, Search, MapPin, Navigation } from 'lucide-react';

interface AddressMapPickerProps {
  onBack: () => void;
  onSelectAddress: (address: string, lat: number, lng: number) => void;
}

const mockSearchResults = [
  { id: '1', name: '123 Nguyễn Huệ, Quận 1, TP.HCM', lat: 10.777, lng: 106.701 },
  { id: '2', name: '456 Lê Lợi, Quận 1, TP.HCM', lat: 10.778, lng: 106.702 },
  { id: '3', name: '789 Trần Hưng Đạo, Quận 5, TP.HCM', lat: 10.755, lng: 106.673 },
];

export function AddressMapPicker({ onBack, onSelectAddress }: AddressMapPickerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number; address: string } | null>(null);

  const filteredResults = mockSearchResults.filter((r) =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleConfirm = () => {
    if (selectedLocation) {
      onSelectAddress(selectedLocation.address, selectedLocation.lat, selectedLocation.lng);
      onBack();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b z-10">
        <div className="container mx-auto px-3 py-3 sm:px-4 sm:py-4 max-w-2xl">
          <div className="flex items-center gap-3 mb-3">
            <Button variant="ghost" size="icon" onClick={onBack} className="-ml-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="font-semibold">Chọn địa chỉ từ bản đồ</h1>
          </div>
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Tìm kiếm địa chỉ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* Map Display */}
      <div className="flex-1 relative bg-gray-200">
        {/* Mock map */}
        <div className="w-full h-full bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center">
          <div className="text-center">
            <MapPin className="h-16 w-16 text-blue-600 mx-auto mb-2" />
            <p className="text-gray-600 text-sm">Bản đồ tương tác</p>
            {selectedLocation && (
              <p className="text-xs text-gray-500 mt-2 max-w-xs mx-auto">{selectedLocation.address}</p>
            )}
          </div>
        </div>
        {/* Center marker */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <MapPin className="h-10 w-10 text-red-600 drop-shadow-lg" />
        </div>
        {/* Current location button */}
        <Button
          size="icon"
          className="absolute bottom-24 right-4 rounded-full shadow-lg"
          onClick={() => {
            setSelectedLocation({
              lat: 10.777,
              lng: 106.701,
              address: 'Vị trí hiện tại của bạn',
            });
          }}
        >
          <Navigation className="h-5 w-5" />
        </Button>
      </div>

      {/* Search Results */}
      {searchQuery && (
        <div className="absolute top-32 left-0 right-0 mx-4 bg-white rounded-lg shadow-lg max-h-64 overflow-y-auto">
          {filteredResults.map((result) => (
            <button
              key={result.id}
              onClick={() => {
                setSelectedLocation({ lat: result.lat, lng: result.lng, address: result.name });
                setSearchQuery('');
              }}
              className="w-full p-3 text-left hover:bg-gray-50 border-b last:border-b-0 flex items-start gap-3"
            >
              <MapPin className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
              <span className="text-sm">{result.name}</span>
            </button>
          ))}
        </div>
      )}

      {/* Bottom confirm button */}
      <div className="sticky bottom-0 bg-white border-t p-4">
        <Button
          onClick={handleConfirm}
          disabled={!selectedLocation}
          className="w-full"
          size="lg"
        >
          Xác nhận địa chỉ
        </Button>
      </div>
    </div>
  );
}
