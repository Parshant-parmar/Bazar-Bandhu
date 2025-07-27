import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Package } from "lucide-react";

interface CartItem {
  product: string;
  frequency: string;
  quantity: number;
  mrp: number;
  serialNo: string;
}

interface DeliveryCalendarPreviewProps {
  cartItems: CartItem[];
}

const DeliveryCalendarPreview = ({ cartItems }: DeliveryCalendarPreviewProps) => {
  const deliveryDates = useMemo(() => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    const deliveryMap: { [key: string]: CartItem[] } = {};
    
    cartItems.forEach(item => {
      const dates: number[] = [];
      
      switch (item.frequency) {
        case "oneTime":
          // Deliver on the next available day (tomorrow)
          dates.push(today.getDate() + 1);
          break;
        case "daily":
          // Deliver every day from tomorrow
          for (let day = today.getDate() + 1; day <= daysInMonth; day++) {
            dates.push(day);
          }
          break;
        case "weekly":
          // Deliver every 7 days starting from tomorrow
          for (let week = 0; week < 4; week++) {
            const deliveryDay = today.getDate() + 1 + (week * 7);
            if (deliveryDay <= daysInMonth) {
              dates.push(deliveryDay);
            }
          }
          break;
        case "monthly":
          // Deliver once per month
          dates.push(today.getDate() + 1);
          break;
      }
      
      dates.forEach(date => {
        const dateKey = `${currentYear}-${currentMonth + 1}-${date}`;
        if (!deliveryMap[dateKey]) {
          deliveryMap[dateKey] = [];
        }
        deliveryMap[dateKey].push(item);
      });
    });
    
    return deliveryMap;
  }, [cartItems]);

  const getDaysInMonth = () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const getFrequencyColor = (frequency: string) => {
    switch (frequency) {
      case "oneTime": return "bg-blue-100 text-blue-800";
      case "daily": return "bg-green-100 text-green-800";
      case "weekly": return "bg-purple-100 text-purple-800";
      case "monthly": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const today = new Date();
  const currentMonth = today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  if (cartItems.length === 0) {
    return null;
  }

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary">
          <Calendar className="h-5 w-5" />
          Delivery Calendar Preview - {currentMonth}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Week day headers */}
            {weekDays.map(day => (
              <div key={day} className="p-2 text-center font-medium text-muted-foreground text-sm">
                {day}
              </div>
            ))}
            
            {/* Calendar days */}
            {getDaysInMonth().map((day, index) => {
              if (day === null) {
                return <div key={`empty-${index}`} className="p-2"></div>;
              }
              
              const dateKey = `${today.getFullYear()}-${today.getMonth() + 1}-${day}`;
              const deliveriesForDay = deliveryDates[dateKey] || [];
              const isToday = day === today.getDate();
              const isPast = day < today.getDate();
              
              return (
                <div 
                  key={`day-${day}`} 
                  className={`p-2 text-center text-sm border rounded transition-all hover:shadow-sm ${
                    isToday ? 'border-primary bg-primary/10 font-bold' : 
                    isPast ? 'text-muted-foreground bg-muted/30' : 
                    deliveriesForDay.length > 0 ? 'border-green-400 bg-green-50 hover:bg-green-100' : 'border-border hover:bg-muted/20'
                  }`}
                >
                  <div className="font-medium">{day}</div>
                  {deliveriesForDay.length > 0 && (
                    <div className="mt-1 space-y-1">
                      <div className="flex items-center justify-center">
                        <Package className="h-3 w-3 text-green-600" />
                        <span className="text-xs text-green-600 ml-1 font-medium">
                          {deliveriesForDay.length}
                        </span>
                      </div>
                      {deliveriesForDay.slice(0, 2).map((item, idx) => (
                        <div key={`${item.serialNo}-${idx}`} className="text-xs text-green-700 truncate px-1">
                          {item.product.substring(0, 8)}...
                        </div>
                      ))}
                      {deliveriesForDay.length > 2 && (
                        <div className="text-xs text-green-600">+{deliveriesForDay.length - 2}</div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          {/* Legend */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm">Delivery Schedule Legend:</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {["oneTime", "daily", "weekly", "monthly"].map(frequency => {
                const itemsWithFreq = cartItems.filter(item => item.frequency === frequency);
                if (itemsWithFreq.length === 0) return null;
                
                return (
                  <div key={frequency} className="flex items-center gap-2">
                    <Badge className={`text-xs ${getFrequencyColor(frequency)}`}>
                      {frequency === "oneTime" ? "One Time" : 
                       frequency === "daily" ? "Daily" :
                       frequency === "weekly" ? "Weekly" : "Monthly"}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      ({itemsWithFreq.length} item{itemsWithFreq.length > 1 ? 's' : ''})
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Delivery Summary */}
          <div className="bg-muted/50 rounded-lg p-3">
            <h4 className="font-medium text-sm mb-2">This Month's Deliveries:</h4>
            <div className="space-y-1 text-xs">
              {Object.keys(deliveryDates).length > 0 ? (
                <p className="text-muted-foreground">
                  Total delivery days: {Object.keys(deliveryDates).length}
                </p>
              ) : (
                <p className="text-muted-foreground">No deliveries scheduled</p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DeliveryCalendarPreview;