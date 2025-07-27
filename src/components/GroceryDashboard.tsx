import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ShoppingCart, Trash2, MapPin, Search, Languages, Clock, Package, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import FrequencyBasedCartItem from "./FrequencyBasedCartItem";
import DeliveryCalendarPreview from "./DeliveryCalendarPreview";
import OrderManagement from "./OrderManagement";

interface Product {
  category: string;
  product: string;
  desc: string;
  img: string;
  mrp: number;
}

interface CartItem {
  product: string;
  frequency: string;
  quantity: number;
  mrp: number;
  serialNo: string;
}

interface Order {
  id: string;
  items: CartItem[];
  deliverySlot: string;
  orderDate: Date;
  total: number;
  location: string;
}

const GroceryDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("mumbai");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [showDeliverySlotModal, setShowDeliverySlotModal] = useState(false);
  const [selectedDeliverySlot, setSelectedDeliverySlot] = useState("");
  const [showOrderConfirmation, setShowOrderConfirmation] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentChoice, setPaymentChoice] = useState<"now" | "later">("now");
  const [upiId, setUpiId] = useState("");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [showViewOrders, setShowViewOrders] = useState(false);
  const [paymentDeadline, setPaymentDeadline] = useState<Date | null>(null);
  const { toast } = useToast();
  const { t, language, toggleLanguage } = useLanguage();

  const PRODUCTS: Product[] = [
    // Vegetables
    {category: 'vegetables', product: 'onion', desc: 'Fresh onions', img: '🧅', mrp: 20},
    {category: 'vegetables', product: 'tomato', desc: 'Juicy red tomatoes', img: '🍅', mrp: 18},
    {category: 'vegetables', product: 'garlic', desc: 'Aromatic garlic bulbs', img: '🧄', mrp: 25},
    {category: 'vegetables', product: 'potato', desc: 'Fresh potatoes', img: '🥔', mrp: 15},
    {category: 'vegetables', product: 'carrot', desc: 'Fresh orange carrots', img: '🥕', mrp: 22},
    {category: 'vegetables', product: 'cauliflower', desc: 'White fresh cauliflower', img: '🥬', mrp: 30},
    {category: 'vegetables', product: 'spinach', desc: 'Green leafy spinach', img: '🥬', mrp: 25},
    {category: 'vegetables', product: 'beans', desc: 'Fresh green beans', img: '🫛', mrp: 35},
    {category: 'vegetables', product: 'peas', desc: 'Sweet green peas', img: '🟢', mrp: 40},
    {category: 'vegetables', product: 'cabbage', desc: 'Fresh cabbage head', img: '🥬', mrp: 18},
    {category: 'vegetables', product: 'chillies', desc: 'Hot green chillies', img: '🌶️', mrp: 30},
    {category: 'vegetables', product: 'brinjal', desc: 'Purple fresh brinjal', img: '🍆', mrp: 28},
    
    // Dairy Products
    {category: 'dairyProducts', product: 'milk', desc: 'Pure cow milk', img: '🥛', mrp: 45},
    {category: 'dairyProducts', product: 'eggs', desc: 'Organic farm eggs', img: '🥚', mrp: 60},
    
    // Spices and Oils
    {category: 'spicesAndOils', product: 'ghee', desc: 'Pure clarified butter', img: '🧈', mrp: 250},
    {category: 'spicesAndOils', product: 'oil', desc: 'Premium cooking oil', img: '🫒', mrp: 120},
    {category: 'spicesAndOils', product: 'redSpice', desc: 'Hot and spicy red chili powder', img: '🌶️', mrp: 70},
    {category: 'spicesAndOils', product: 'corianderPowder', desc: 'Fresh coriander powder', img: '🌿', mrp: 55},
    {category: 'spicesAndOils', product: 'turmericPowder', desc: 'Pure turmeric powder', img: '🟡', mrp: 80},
    {category: 'spicesAndOils', product: 'garamMasala', desc: 'Aromatic garam masala', img: '🌶️', mrp: 90},
    {category: 'spicesAndOils', product: 'cuminSeeds', desc: 'Whole cumin seeds', img: '🟤', mrp: 120},
    {category: 'spicesAndOils', product: 'blackPepper', desc: 'Ground black pepper', img: '⚫', mrp: 200},
    {category: 'spicesAndOils', product: 'mustardSeeds', desc: 'Black mustard seeds', img: '🟤', mrp: 85},
    {category: 'spicesAndOils', product: 'fenugreek', desc: 'Dried fenugreek leaves', img: '🌿', mrp: 65},
    {category: 'spicesAndOils', product: 'asafoetida', desc: 'Pure asafoetida powder', img: '🟡', mrp: 300},
    
    // Meat & Poultry
    {category: 'meatAndPoultry', product: 'chicken', desc: 'Fresh chicken meat', img: '🍗', mrp: 180},
    {category: 'meatAndPoultry', product: 'mutton', desc: 'Fresh mutton meat', img: '🥩', mrp: 450},
    {category: 'meatAndPoultry', product: 'fish', desc: 'Fresh fish fillets', img: '🐟', mrp: 250},
    {category: 'meatAndPoultry', product: 'prawns', desc: 'Fresh tiger prawns', img: '🦐', mrp: 400},
    
    // Others
    {category: 'others', product: 'apples', desc: 'Best quality, fresh apples', img: '🍎', mrp: 85},
    {category: 'others', product: 'broccoli', desc: 'Crisp green broccoli bunch', img: '🥦', mrp: 90},
    {category: 'others', product: 'rice', desc: 'Premium basmati rice', img: '🍚', mrp: 120},
    {category: 'others', product: 'bread', desc: 'Freshly baked bread', img: '🍞', mrp: 30},
    {category: 'others', product: 'noodles', desc: 'Instant noodles pack', img: '🍜', mrp: 40},
    {category: 'others', product: 'momos', desc: 'Steamed vegetable momos', img: '🥟', mrp: 150}
  ];

  const CATEGORIES = ['vegetables', 'dairyProducts', 'spicesAndOils', 'meatAndPoultry', 'others'];

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(product =>
      t(product.product).toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.desc.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, t]);

  const generateSerialNumber = () => {
    const timestamp = Date.now();
    const randomNum = Math.floor(Math.random() * 1000);
    return `${String(timestamp).slice(-6)}${String(randomNum).padStart(3, '0')}`.slice(-6);
  };

  const addToCart = (product: Product, frequency: string, quantity: number) => {
    const existingIndex = cart.findIndex(item => item.product === product.product);
    
    if (existingIndex !== -1) {
      const updatedCart = [...cart];
      updatedCart[existingIndex].frequency = frequency;
      updatedCart[existingIndex].quantity = quantity;
      setCart(updatedCart);
      toast({
        title: t('cartUpdated'),
        description: `${t(product.product)} subscription updated to ${getFrequencyLabel(frequency)}, quantity: ${quantity}${t('kg')}`,
      });
    } else {
      const serialNo = generateSerialNumber();
      setCart([...cart, { 
        product: product.product, 
        frequency, 
        quantity,
        mrp: product.mrp,
        serialNo
      }]);
      toast({
        title: t('addedToCart'),
        description: `${t(product.product)} added with ${getFrequencyLabel(frequency)} subscription, quantity: ${quantity}${t('kg')} (Serial #${serialNo})`,
      });
    }
  };

  const getFrequencyLabel = (freq: string) => {
    switch (freq) {
      case "oneTime": return "One Time";
      case "daily": return "Daily";
      case "weekly": return "Weekly";
      case "monthly": return "Monthly";
      default: return freq;
    }
  };

  const removeFromCart = (index: number) => {
    const updatedCart = cart.filter((_, i) => i !== index);
    setCart(updatedCart);
    toast({
      title: t('removedFromCart'),
      description: t('itemRemoved'),
    });
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setShowDeliverySlotModal(true);
  };

  const confirmOrder = () => {
    if (!selectedDeliverySlot) {
      toast({
        title: language === 'hi' ? 'कृपया डिलीवरी स्लॉट चुनें' : 'Please select delivery slot',
        description: language === 'hi' ? 'कृपया एक डिलीवरी समय चुनें' : 'Please choose a delivery time',
        variant: "destructive"
      });
      return;
    }

    // Calculate monthly total based on frequencies
    const calculateOrderTotal = () => {
      return cart.reduce((sum, item) => {
        const basePrice = item.mrp * item.quantity;
        switch (item.frequency) {
          case "oneTime":
            return sum + basePrice;
          case "daily":
            const today = new Date();
            const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
            return sum + (basePrice * daysInMonth);
          case "weekly":
            return sum + (basePrice * 4);
          case "monthly":
            return sum + basePrice;
          default:
            return sum + basePrice;
        }
      }, 0);
    };

    const newOrder: Order = {
      id: `ORD${Date.now()}`,
      items: [...cart],
      deliverySlot: selectedDeliverySlot,
      orderDate: new Date(),
      total: calculateOrderTotal(),
      location: location
    };

    setOrders([...orders, newOrder]);
    setCurrentOrder(newOrder);
    setCart([]);
    setShowDeliverySlotModal(false);
    setShowOrderConfirmation(true);
    setSelectedDeliverySlot("");

    toast({
      title: language === 'hi' ? 'ऑर्डर सफल!' : 'Order Successful!',
      description: language === 'hi' ? 
        `आपका ऑर्डर ${newOrder.id} सफलतापूर्वक प्राप्त हुआ है` : 
        `Your order ${newOrder.id} has been placed successfully`,
    });
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentChoice === "now" && !upiId.trim()) {
      toast({
        title: language === 'hi' ? 'त्रुटि' : 'Error',
        description: language === 'hi' ? 'कृपया वैध UPI ID दर्ज करें' : 'Please enter a valid UPI ID',
        variant: "destructive",
      });
      return;
    }

    setIsProcessingPayment(true);
    
    // Simulate payment processing
    setTimeout(() => {
      if (paymentChoice === "now") {
        toast({
          title: language === 'hi' ? '🎉 भुगतान सफल!' : '🎉 Payment Successful!',
          description: language === 'hi' ? 
            'धन्यवाद! आपका भुगतान प्राप्त हो गया है। आपका ऑर्डर निर्धारित समय पर डिलीवर किया जाएगा।' : 
            'Thank you! Your payment has been received. Your order will be delivered as scheduled.',
        });
      } else {
        // Set payment deadline for 30 days from now
        const deadline = new Date();
        deadline.setDate(deadline.getDate() + 30);
        setPaymentDeadline(deadline);
        
        toast({
          title: language === 'hi' ? 'भुगतान विकल्प चुना गया' : 'Payment Option Selected',
          description: language === 'hi' ? 
            'आपने 30 दिनों के भीतर भुगतान करना चुना है। आपका ऑर्डर प्रोसेस किया जाएगा!' : 
            'You\'ve chosen to pay within 30 days. Your order will be processed!',
        });
      }
      
      setIsProcessingPayment(false);
      // Don't automatically close the payment modal - let user close it manually
      setUpiId("");
      setPaymentChoice("now");
    }, 1500);
  };

  const ProductCard = ({ product }: { product: Product }) => {
    return (
      <FrequencyBasedCartItem 
        product={product} 
        onAddToCart={addToCart}
      />
    );
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="max-w-7xl mx-auto p-8">
        <Card className="shadow-primary animate-slide-in">
          <CardHeader className="bg-gradient-primary text-primary-foreground rounded-t-lg">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-semibold">
                {t('groceryDashboard')}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Languages className="h-4 w-4" />
                <Select value={language} onValueChange={toggleLanguage}>
                  <SelectTrigger className="w-32 bg-primary-foreground text-primary">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hi">हिंदी</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            {/* View Orders Button */}
            <div className="mb-6">
              <Button 
                onClick={() => setShowViewOrders(true)}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Package className="h-4 w-4" />
                {language === 'hi' ? 'ऑर्डर देखें' : 'View Orders'}
                {orders.length > 0 && (
                  <Badge variant="secondary">{orders.length}</Badge>
                )}
              </Button>
            </div>
            {/* Search and Location */}
            <div className="space-y-6 mb-8">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder={t('searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 text-lg"
                />
              </div>
              
              <div className="flex items-center gap-4">
                <MapPin className="h-5 w-5 text-primary" />
                <Label htmlFor="location" className="font-medium">{t('selectLocation')}</Label>
                <Select value={location} onValueChange={setLocation}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mumbai">Mumbai</SelectItem>
                    <SelectItem value="delhi">Delhi</SelectItem>
                    <SelectItem value="bengaluru">Bengaluru</SelectItem>
                    <SelectItem value="kolkata">Kolkata</SelectItem>
                    <SelectItem value="chennai">Chennai</SelectItem>
                    <SelectItem value="hyderabad">Hyderabad</SelectItem>
                    <SelectItem value="pune">Pune</SelectItem>
                    <SelectItem value="lucknow">Lucknow</SelectItem>
                    <SelectItem value="jaipur">Jaipur</SelectItem>
                    <SelectItem value="ahmedabad">Ahmedabad</SelectItem>
                    <SelectItem value="chandigarh">Chandigarh</SelectItem>
                    <SelectItem value="kochi">Kochi</SelectItem>
                    <SelectItem value="bhopal">Bhopal</SelectItem>
                    <SelectItem value="indore">Indore</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-8">
              {/* Delivery Calendar Preview */}
              {cart.length > 0 && (
                <DeliveryCalendarPreview cartItems={cart} />
              )}

              <div className="grid lg:grid-cols-4 gap-8">
                {/* Products Section */}
                <div className="lg:col-span-3">
                  {CATEGORIES.map(category => {
                    const categoryProducts = filteredProducts.filter(p => p.category === category);
                    if (categoryProducts.length === 0) return null;

                    return (
                      <div key={category} className="mb-8">
                        <h2 className="text-xl font-bold text-primary mb-6 border-b-2 border-primary/20 pb-2">
                          {t(category)}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {categoryProducts.map((product, index) => (
                            <ProductCard key={`${product.product}-${index}`} product={product} />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Cart Section */}
                <div className="lg:col-span-1">
                  <Card className="sticky top-8 shadow-card">
                  <CardHeader className="bg-muted/50">
                    <CardTitle className="flex items-center gap-2">
                      <ShoppingCart className="h-5 w-5" />
                      {t('yourCart')}
                      {cart.length > 0 && (
                        <Badge variant="secondary">{cart.length}</Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {cart.length === 0 ? (
                        <p className="text-muted-foreground text-center italic">{t('cartEmpty')}</p>
                      ) : (
                        cart.map((item, index) => (
                          <div 
                            key={index}
                            className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/30 transition-colors"
                          >
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="font-medium text-sm truncate">{t(item.product)}</p>
                                <Badge variant="outline" className="text-xs">#{item.serialNo}</Badge>
                              </div>
                              <p className="text-xs text-muted-foreground">{getFrequencyLabel(item.frequency)} • {t('quantity')}: {item.quantity}{t('kg')}</p>
                              <p className="text-xs text-primary font-medium">
                                {item.frequency === "oneTime" ? "Tomorrow delivery" :
                                 item.frequency === "daily" ? "Daily delivery starting tomorrow" :
                                 item.frequency === "weekly" ? "Weekly delivery (every 7 days)" :
                                 "Monthly delivery"}
                              </p>
                              <p className="text-xs text-secondary font-medium">Monthly: ₹{(() => {
                                const basePrice = item.mrp * item.quantity;
                                switch (item.frequency) {
                                  case "oneTime": return basePrice;
                                  case "daily": 
                                    const today = new Date();
                                    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
                                    return basePrice * daysInMonth;
                                  case "weekly": return basePrice * 4;
                                  case "monthly": return basePrice;
                                  default: return basePrice;
                                }
                              })()}</p>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeFromCart(index)}
                              className="ml-2 p-1 h-8 w-8"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        ))
                      )}
                    </div>
                    {cart.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-border">
                        <div className="flex justify-between items-center mb-3">
                          <span className="font-medium">{t('total')} (Monthly)</span>
                          <span className="font-bold text-lg text-primary">
                            ₹{cart.reduce((sum, item) => {
                              const basePrice = item.mrp * item.quantity;
                              switch (item.frequency) {
                                case "oneTime": return sum + basePrice;
                                case "daily": 
                                  const today = new Date();
                                  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
                                  return sum + (basePrice * daysInMonth);
                                case "weekly": return sum + (basePrice * 4);
                                case "monthly": return sum + basePrice;
                                default: return sum + basePrice;
                              }
                            }, 0)}
                          </span>
                        </div>
                        <Button 
                          onClick={handleCheckout}
                          className="w-full bg-gradient-primary hover:opacity-90"
                        >
                          {t('checkout')}
                        </Button>
                      </div>
                    )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Delivery Slot Selection Modal */}
        <Dialog open={showDeliverySlotModal} onOpenChange={setShowDeliverySlotModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                {language === 'hi' ? 'डिलीवरी समय चुनें' : 'Select Delivery Slot'}
              </DialogTitle>
              <DialogDescription>
                {language === 'hi' ? 'अपनी सुविधा के अनुसार डिलीवरी का समय चुनें' : 'Choose a delivery time that works for you'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-3">
                <Button
                  variant={selectedDeliverySlot === "morning" ? "default" : "outline"}
                  onClick={() => setSelectedDeliverySlot("morning")}
                  className="w-full justify-start text-left h-auto p-4"
                >
                  <div>
                    <div className="font-semibold">
                      {language === 'hi' ? 'सुबह स्लॉट' : 'Morning Slot'}
                    </div>
                    <div className="text-sm text-muted-foreground">9:00 AM – 12:00 PM</div>
                  </div>
                </Button>
                <Button
                  variant={selectedDeliverySlot === "afternoon" ? "default" : "outline"}
                  onClick={() => setSelectedDeliverySlot("afternoon")}
                  className="w-full justify-start text-left h-auto p-4"
                >
                  <div>
                    <div className="font-semibold">
                      {language === 'hi' ? 'दोपहर स्लॉट' : 'Afternoon Slot'}
                    </div>
                    <div className="text-sm text-muted-foreground">4:00 PM – 7:00 PM</div>
                  </div>
                </Button>
              </div>
              <div className="flex gap-2 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setShowDeliverySlotModal(false)}
                  className="flex-1"
                >
                  {language === 'hi' ? 'रद्द करें' : 'Cancel'}
                </Button>
                <Button 
                  onClick={confirmOrder}
                  className="flex-1 bg-gradient-primary hover:opacity-90"
                >
                  {language === 'hi' ? 'ऑर्डर पुष्टि करें' : 'Confirm Order'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Order Confirmation Modal */}
        <Dialog open={showOrderConfirmation} onOpenChange={setShowOrderConfirmation}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-center text-green-600">
                {language === 'hi' ? '🎉 ऑर्डर सफल!' : '🎉 Order Successful!'}
              </DialogTitle>
              <DialogDescription>
                {language === 'hi' ? 'आपका ऑर्डर सफलतापूर्वक दर्ज किया गया है' : 'Your order has been successfully placed'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {currentOrder && (
                <div className="space-y-3">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <h3 className="font-semibold text-lg">
                      {language === 'hi' ? 'धन्यवाद!' : 'Thank You!'}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {language === 'hi' ? 
                        'अब आप तुरंत भुगतान कर सकते हैं या 30 दिनों के भीतर भुगतान का विकल्प चुन सकते हैं।' : 
                        'You can now choose to pay immediately or pay within 30 days.'}
                    </p>
                  </div>
                  <div className="flex gap-2 mb-4">
                    <Button 
                      onClick={() => setShowPaymentModal(true)}
                      className="flex-1 bg-gradient-primary hover:opacity-90"
                    >
                      <CreditCard className="h-4 w-4 mr-2" />
                      {language === 'hi' ? 'भुगतान विकल्प चुनें' : 'Choose Payment Option'}
                    </Button>
                  </div>
                  <div className="border rounded-lg p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">{language === 'hi' ? 'ऑर्डर ID:' : 'Order ID:'}</span>
                      <span className="font-mono text-sm">{currentOrder.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">{language === 'hi' ? 'डिलीवरी समय:' : 'Delivery Slot:'}</span>
                      <span className="text-sm">
                        {currentOrder.deliverySlot === 'morning' 
                          ? (language === 'hi' ? 'सुबह: 9:00 AM – 12:00 PM' : 'Morning: 9:00 AM – 12:00 PM')
                          : (language === 'hi' ? 'दोपहर: 4:00 PM – 7:00 PM' : 'Afternoon: 4:00 PM – 7:00 PM')
                        }
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">{language === 'hi' ? 'कुल राशि:' : 'Total Amount:'}</span>
                      <span className="font-bold text-primary">₹{currentOrder.total}</span>
                    </div>
                  </div>
                </div>
              )}
              <Button 
                onClick={() => setShowOrderConfirmation(false)}
                className="w-full bg-gradient-primary hover:opacity-90"
              >
                {language === 'hi' ? 'ठीक है' : 'OK'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* View Orders Modal */}
        <Dialog open={showViewOrders} onOpenChange={setShowViewOrders}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-primary">Order Management</DialogTitle>
            </DialogHeader>
            <div className="overflow-y-auto p-4">
              <OrderManagement 
                orders={orders.map(order => ({
                  id: order.id,
                  items: order.items.map(item => ({
                    serialNo: item.serialNo,
                    product: item.product,
                    quantity: item.quantity,
                    frequency: item.frequency,
                    mrp: item.mrp
                  })),
                  total: order.total,
                  status: "pending" as const,
                  orderDate: order.orderDate,
                  deliveryDate: undefined
                }))}
                onOrderUpdate={(updatedOrders) => {
                  const newOrders = updatedOrders.map(updatedOrder => {
                    const originalOrder = orders.find(o => o.id === updatedOrder.id);
                    if (!originalOrder) return null;
                    
                    return {
                      ...originalOrder,
                      items: updatedOrder.items.map(item => ({
                        serialNo: item.serialNo,
                        product: item.product,
                        quantity: item.quantity,
                        frequency: item.frequency,
                        mrp: item.mrp
                      })),
                      total: updatedOrder.total
                    };
                  }).filter(Boolean) as Order[];
                  
                  setOrders(newOrders);
                  localStorage.setItem('groceryOrders', JSON.stringify(newOrders));
                }}
              />
            </div>
          </DialogContent>
        </Dialog>

        {/* Payment Modal */}
        <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {language === 'hi' ? 'भुगतान विकल्प' : 'Payment Options'}
              </DialogTitle>
            </DialogHeader>
            
            {!isProcessingPayment ? (
              <form onSubmit={handlePaymentSubmit} className="space-y-4">
                <div className="text-center space-y-2">
                  <p className="text-lg font-semibold">
                    {language === 'hi' ? 'भुगतान राशि' : 'Amount to Pay'}
                  </p>
                  <p className="text-2xl font-bold text-primary">₹{currentOrder?.total}</p>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">
                      {language === 'hi' ? 'भुगतान विकल्प चुनें' : 'Choose Payment Option'}
                    </Label>
                    <RadioGroup value={paymentChoice} onValueChange={(value: "now" | "later") => setPaymentChoice(value)} className="mt-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="now" id="now" />
                        <Label htmlFor="now" className="text-sm">
                          {language === 'hi' ? 'अभी भुगतान करें (UPI)' : 'Pay Now (UPI)'}
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="later" id="later" />
                        <Label htmlFor="later" className="text-sm">
                          {language === 'hi' ? '30 दिनों के भीतर भुगतान करें' : 'Pay within 30 days'}
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  {paymentChoice === "now" && (
                    <div className="space-y-2">
                      <Label htmlFor="upi">UPI ID</Label>
                      <Input
                        id="upi"
                        type="text"
                        placeholder="yourname@upi"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        className="text-center"
                      />
                      <p className="text-xs text-muted-foreground text-center">
                        {language === 'hi' ? 'अपना UPI ID दर्ज करें' : 'Enter your UPI ID'}
                      </p>
                    </div>
                  )}
                  
                  {paymentChoice === "later" && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-sm text-blue-700">
                        {language === 'hi' ? 
                          'आप 30 दिनों के भीतर कभी भी अपना भुगतान पूरा कर सकते हैं। आपका ऑर्डर तुरंत प्रोसेस किया जाएगा!' : 
                          'You can complete your payment anytime within 30 days. Your order will be processed immediately!'
                        }
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="flex space-x-3">
                  <Button 
                    type="button"
                    variant="outline" 
                    onClick={() => setShowPaymentModal(false)}
                    className="flex-1"
                  >
                    {language === 'hi' ? 'रद्द करें' : 'Cancel'}
                  </Button>
                  <Button type="submit" className="flex-1">
                    <CreditCard className="h-4 w-4 mr-2" />
                    {paymentChoice === "now" ? 
                      (language === 'hi' ? 'अभी भुगतान करें' : 'Pay Now') : 
                      (language === 'hi' ? 'ऑर्डर पुष्टि करें' : 'Confirm Order')
                    }
                  </Button>
                </div>
              </form>
            ) : (
              <div className="text-center space-y-4 py-8">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
                <p className="text-lg font-medium">
                  {language === 'hi' ? 'आपका भुगतान प्रोसेस किया जा रहा है...' : 'Processing your payment...'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {language === 'hi' ? 'कृपया अपने लेनदेन की पुष्टि का इंतजार करें' : 'Please wait while we confirm your transaction'}
                </p>
                {paymentDeadline && paymentChoice === "later" && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mt-4">
                    <p className="text-sm text-orange-700 font-medium">
                      {language === 'hi' ? 'भुगतान की समय सीमा' : 'Payment Deadline'}
                    </p>
                    <p className="text-sm text-orange-600">
                      {paymentDeadline.toLocaleDateString()} at {paymentDeadline.toLocaleTimeString()}
                    </p>
                    <p className="text-xs text-orange-600 mt-1">
                      {language === 'hi' ? 
                        `${Math.ceil((paymentDeadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24))} दिन बाकी` : 
                        `${Math.ceil((paymentDeadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days remaining`
                      }
                    </p>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default GroceryDashboard;
