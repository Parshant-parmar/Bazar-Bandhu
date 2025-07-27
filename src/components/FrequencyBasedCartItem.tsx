import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Trash2, Calendar } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface Product {
  category: string;
  product: string;
  desc: string;
  img: string;
  mrp: number;
}

interface FrequencyBasedCartItemProps {
  product: Product;
  onAddToCart: (product: Product, frequency: string, quantity: number) => void;
}

const FrequencyBasedCartItem = ({ product, onAddToCart }: FrequencyBasedCartItemProps) => {
  const { t } = useLanguage();
  const [frequency, setFrequency] = useState("oneTime");
  const [quantity, setQuantity] = useState(1);

  const getFrequencyLabel = (freq: string) => {
    switch (freq) {
      case "oneTime": return "One Time";
      case "daily": return "Daily";
      case "weekly": return "Weekly";
      case "monthly": return "Monthly";
      default: return freq;
    }
  };

  const getDeliveryPreview = (freq: string) => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    switch (freq) {
      case "oneTime":
        return "Delivered once on your selected date";
      case "daily":
        return `Delivered daily (${daysInMonth} times this month)`;
      case "weekly":
        return "Delivered weekly (4 times this month)";
      case "monthly":
        return "Delivered once per month";
      default:
        return "";
    }
  };

  const calculateMonthlyTotal = (freq: string, basePrice: number, qty: number) => {
    switch (freq) {
      case "oneTime":
        return basePrice * qty;
      case "daily":
        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        return basePrice * qty * daysInMonth;
      case "weekly":
        return basePrice * qty * 4;
      case "monthly":
        return basePrice * qty * 1;
      default:
        return basePrice * qty;
    }
  };

  return (
    <Card className="group hover:shadow-primary transition-all duration-200 hover:scale-105 animate-fade-in">
      <CardContent className="p-6 text-center">
        <div className="text-4xl mb-4">{product.img}</div>
        <h3 className="font-semibold text-lg text-primary mb-2">{t(product.product)}</h3>
        <p className="text-muted-foreground text-sm mb-3 flex-1">{product.desc}</p>
        <div className="text-lg font-semibold text-secondary mb-4">
          MRP: ₹{product.mrp}/{t('kg')}
        </div>
        
        <div className="space-y-3 mb-4">
          <div>
            <Label className="text-sm">Frequency:</Label>
            <Select value={frequency} onValueChange={setFrequency}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="oneTime">One Time</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center gap-2">
            <Label htmlFor={`quantity-${product.product}`} className="text-sm">{t('quantity')}:</Label>
            <Input
              id={`quantity-${product.product}`}
              type="number"
              min="0.1"
              max="99"
              step="0.1"
              value={quantity === 0 ? "" : quantity.toString()}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "") {
                  setQuantity(0);
                } else {
                  const parsed = parseFloat(value);
                  if (!isNaN(parsed) && parsed >= 0.1) {
                    setQuantity(parsed);
                  }
                }
              }}
              onBlur={(e) => {
                if (quantity === 0 || isNaN(quantity)) {
                  setQuantity(0.1);
                }
              }}
              className="w-20 text-center"
            />
            <span className="text-sm text-muted-foreground">{t('kg')}</span>
          </div>
          
          <div className="bg-muted/50 rounded-lg p-3 text-left">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Delivery Schedule</span>
            </div>
            <p className="text-xs text-muted-foreground mb-2">
              {getDeliveryPreview(frequency)}
            </p>
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Monthly Total:</span>
              <Badge variant="secondary" className="text-xs">
                ₹{calculateMonthlyTotal(frequency, product.mrp, quantity)}
              </Badge>
            </div>
          </div>
        </div>
        
        <Button 
          onClick={() => onAddToCart(product, frequency, quantity)}
          className="w-full bg-gradient-primary hover:opacity-90 transition-all duration-200"
        >
          {t('addToCart')}
        </Button>
      </CardContent>
    </Card>
  );
};

export default FrequencyBasedCartItem;