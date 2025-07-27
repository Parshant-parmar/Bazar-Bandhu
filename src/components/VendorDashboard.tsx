import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Users, Package, TrendingUp, Clock, CreditCard, CheckCircle, X, AlertTriangle, RotateCcw } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import EnhancedOrderManagement from "./EnhancedOrderManagement";

interface Product {
  serialNo: string;
  name: string;
  quantity: string;
  frequency: string;
  mrp: number;
  hasIssue?: boolean;
  issueReason?: string;
}

interface Order {
  id: string;
  vendor: string;
  products: Product[];
  amount: string;
  status: "Pending" | "Processing" | "Delivered" | "Cancelled";
  paymentStatus: "pending" | "paid";
  paymentChoice?: "now" | "later";
  orderDate: Date;
  deliverySlot: string;
  scheduledDelivery: Date;
}

const VendorDashboard = () => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [returnReason, setReturnReason] = useState("");
  const [paymentChoice, setPaymentChoice] = useState<"now" | "later">("now");
  const [isProcessing, setIsProcessing] = useState(false);
  const [upiId, setUpiId] = useState("");
  const [orders, setOrders] = useState<Order[]>(() => {
    // Initialize with stored orders or default data
    const storedOrders = localStorage.getItem('vendorOrders');
    if (storedOrders) {
      const parsed = JSON.parse(storedOrders);
      return parsed.map((order: any) => ({
        ...order,
        orderDate: new Date(order.orderDate),
        scheduledDelivery: new Date(order.scheduledDelivery)
      }));
    }
    return [
      {
        id: "ORD-001",
        vendor: "Fresh Fruits Co.",
        products: [
          { serialNo: "001", name: "Organic Apples", quantity: "25", frequency: "weekly", mrp: 85 },
          { serialNo: "002", name: "Organic Bananas", quantity: "25", frequency: "daily", mrp: 40 }
        ],
        amount: "₹7,300",
        status: "Processing" as const,
        paymentStatus: "pending" as const,
        paymentChoice: "now" as const,
        orderDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        deliverySlot: "Morning: 9 AM – 12 PM",
        scheduledDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      },
      {
        id: "ORD-002",
        vendor: "Green Vegetables",
        products: [
          { serialNo: "003", name: "Tomatoes", quantity: "10", frequency: "daily", mrp: 18 },
          { serialNo: "004", name: "Potatoes", quantity: "15", frequency: "weekly", mrp: 15 },
          { serialNo: "005", name: "Onions", quantity: "5", frequency: "monthly", mrp: 20 }
        ],
        amount: "₹5,640",
        status: "Delivered" as const,
        paymentStatus: "paid" as const,
        paymentChoice: "now" as const,
        orderDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        deliverySlot: "Afternoon: 2 PM – 5 PM",
        scheduledDelivery: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
      {
        id: "ORD-003",
        vendor: "Spice Masters",
        products: [
          { serialNo: "006", name: "Turmeric Powder", quantity: "5", frequency: "monthly", mrp: 80 },
          { serialNo: "007", name: "Red Chili Powder", quantity: "5", frequency: "oneTime", mrp: 70 }
        ],
        amount: "₹750",
        status: "Pending" as const,
        paymentStatus: "pending" as const,
        paymentChoice: "later" as const,
        orderDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        deliverySlot: "Evening: 4 PM – 7 PM",
        scheduledDelivery: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      },
      {
        id: "ORD-004",
        vendor: "Dairy Delights",
        products: [
          { serialNo: "008", name: "Fresh Milk", quantity: "20", frequency: "daily", mrp: 45 }
        ],
        amount: "₹27,000",
        status: "Processing" as const,
        paymentStatus: "pending" as const,
        paymentChoice: "now" as const,
        orderDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        deliverySlot: "Morning: 6 AM – 9 AM",
        scheduledDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      },
    ];
  });

  // Save orders to localStorage whenever orders change
  useEffect(() => {
    localStorage.setItem('vendorOrders', JSON.stringify(orders));
  }, [orders]);

  const calculateDaysRemaining = (): number => {
    const today = new Date();
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const diffTime = endOfMonth.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-IN', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
  };

  const handlePayNow = () => {
    setShowPaymentModal(true);
  };

  const handleCancelOrder = () => {
    if (selectedOrder) {
      const updatedOrders = orders.filter(order => order.id !== selectedOrder.id);
      setOrders(updatedOrders);
      setShowCancelModal(false);
      setSelectedOrder(null);
      
      toast({
        title: "Order Cancelled",
        description: "Your order has been successfully cancelled. Thank you for using our service!",
      });
    }
  };

  const handleReturnProduct = () => {
    if (selectedOrder && selectedProduct && returnReason.trim()) {
      const updatedOrders = orders.map(order => 
        order.id === selectedOrder.id 
          ? {
              ...order,
              products: order.products.map(product =>
                product.serialNo === selectedProduct.serialNo
                  ? { ...product, hasIssue: true, issueReason: returnReason }
                  : product
              )
            }
          : order
      );
      setOrders(updatedOrders);
      setShowReturnModal(false);
      setReturnReason("");
      setSelectedProduct(null);
      
      toast({
        title: "Return Request Submitted",
        description: "Thank you for your feedback! We're committed to resolving these issues quickly for you.",
      });
    }
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentChoice === "now" && !upiId.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid UPI ID",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      if (paymentChoice === "now") {
        // Update order payment status for immediate payment
        const updatedOrders = orders.map(order => 
          order.id === selectedOrder!.id 
            ? { ...order, paymentStatus: "paid" as const, status: "Processing" as const, paymentChoice: "now" as const }
            : order
        );
        setOrders(updatedOrders);
        setSelectedOrder({ ...selectedOrder!, paymentStatus: "paid", status: "Processing" as const, paymentChoice: "now" });
        
        toast({
          title: "🎉 Payment Successful!",
          description: "Thank you! Your payment has been received. Your order will be delivered as scheduled.",
        });
      } else {
        // Update order for 30-day payment
        const updatedOrders = orders.map(order => 
          order.id === selectedOrder!.id 
            ? { ...order, paymentChoice: "later" as const, status: "Processing" as const }
            : order
        );
        setOrders(updatedOrders);
        setSelectedOrder({ ...selectedOrder!, paymentChoice: "later", status: "Processing" as const });
        
        toast({
          title: "Payment Option Selected",
          description: "You've chosen to pay within 30 days. Your order will be processed and you can complete payment anytime!",
        });
      }
      
      setIsProcessing(false);
      setShowPaymentModal(false);
      setUpiId("");
      setPaymentChoice("now");
    }, 3000);
  };
  const stats = [
    {
      title: "Total Orders",
      value: "247",
      icon: ShoppingCart,
      trend: "+12%",
    },
    {
      title: "Active Vendors",
      value: "1,234",
      icon: Users,
      trend: "+5%",
    },
    {
      title: "Products Listed",
      value: "856",
      icon: Package,
      trend: "+18%",
    },
    {
      title: "Revenue",
      value: "₹45,678",
      icon: TrendingUp,
      trend: "+23%",
    },
  ];


  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-primary">Verde Link</h1>
              <span className="text-muted-foreground">Vendor Marketplace</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline">Profile</Button>
              <Button>New Order</Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="shadow-card hover:shadow-primary transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-sm text-secondary font-medium">{stat.trend}</p>
                  </div>
                  <div className="h-12 w-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                    <stat.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Enhanced Order Management Section */}
        <EnhancedOrderManagement 
          orders={orders}
          onOrderUpdate={setOrders}
        />

        {/* Recent Orders Summary */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-foreground">Recent Orders Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {orders.slice(0, 3).map((order) => {
                return (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors duration-200"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-4">
                        <div>
                          <p className="font-medium text-foreground">{order.id}</p>
                          <p className="text-sm text-muted-foreground">{order.vendor}</p>
                        </div>
                        <div>
                          <div className="space-y-1">
                            {order.products.slice(0, 2).map((product, idx) => (
                              <p key={idx} className="text-sm text-foreground">
                                {product.serialNo}: {product.name} ({product.quantity})
                              </p>
                            ))}
                            {order.products.length > 2 && (
                              <p className="text-xs text-muted-foreground">
                                +{order.products.length - 2} more items
                              </p>
                            )}
                          </div>
                        </div>
                        {order.paymentStatus === "pending" && (
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-amber-500" />
                            <span className="text-sm text-amber-600 font-medium">
                              {calculateDaysRemaining()} days left to pay
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="font-medium text-foreground">{order.amount}</p>
                        <div className="flex items-center space-x-2">
                          <Badge
                            variant={
                              order.status === "Delivered"
                                ? "secondary"
                                : order.status === "Processing"
                                ? "default"
                                : "outline"
                            }
                          >
                            {order.status}
                          </Badge>
                          {order.paymentStatus === "paid" && (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          )}
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewOrder(order)}
                      >
                        View
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Order Details Modal */}
      {selectedOrder && (
        <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Order Details - {selectedOrder.id}</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="text-center pb-4 border-b border-border">
                <h2 className="text-xl font-semibold text-foreground">{selectedOrder.id}</h2>
                <p className="text-sm text-muted-foreground mt-1">Order placed on {formatDate(selectedOrder.orderDate)}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">Vendor</Label>
                    <p className="font-medium text-lg">{selectedOrder.vendor}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Products</Label>
                    <div className="space-y-2 mt-2">
                      {selectedOrder.products.map((product, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 border border-border rounded">
                          <div>
                            <p className="font-medium text-sm">{product.serialNo}: {product.name}</p>
                            <p className="text-xs text-muted-foreground">{product.quantity}</p>
                            {product.hasIssue && (
                              <Badge variant="destructive" className="text-xs mt-1">
                                Issue: {product.issueReason}
                              </Badge>
                            )}
                          </div>
                          {selectedOrder.status === "Delivered" && !product.hasIssue && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedProduct(product);
                                setShowReturnModal(true);
                              }}
                            >
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Report Issue
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">Total Amount</Label>
                    <p className="font-bold text-2xl text-primary">{selectedOrder.amount}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Delivery Slot</Label>
                    <p className="font-medium text-primary">{selectedOrder.deliverySlot}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Scheduled Delivery</Label>
                    <p className="font-medium">{formatDate(selectedOrder.scheduledDelivery)}</p>
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Payment Status</span>
                  <Badge variant={selectedOrder.paymentStatus === "paid" ? "secondary" : "outline"}>
                    {selectedOrder.paymentStatus === "paid" ? "Payment Done" : "Payment Pending"}
                  </Badge>
                </div>
                
                {selectedOrder.paymentStatus === "pending" && (
                  <div className="space-y-4">
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                      <div className="flex items-center space-x-2 text-amber-700 mb-2">
                        <Clock className="h-5 w-5" />
                        <span className="font-semibold">Payment Reminder</span>
                      </div>
                      <p className="text-sm text-amber-700">
                        You have <span className="font-bold">{calculateDaysRemaining()} days remaining</span> to complete your payment. Thank you for being a valued part of Bazzar Bandhu! 🌟
                      </p>
                    </div>
                    <Button 
                      onClick={handlePayNow}
                      className="w-full"
                      size="lg"
                    >
                      <CreditCard className="h-4 w-4 mr-2" />
                      Pay Now - Quick & Easy!
                    </Button>
                  </div>
                )}
                
                {selectedOrder.paymentStatus === "paid" && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 text-green-700">
                      <CheckCircle className="h-5 w-5" />
                      <span className="font-semibold">Payment Completed! 🎉</span>
                    </div>
                    <p className="text-sm text-green-700 mt-1">
                      Thank you for your payment! Your order will be delivered as scheduled. We appreciate your business with Bazzar Bandhu!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Payment Modal */}
      <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>UPI Payment</DialogTitle>
          </DialogHeader>
          
          {!isProcessing ? (
            <form onSubmit={handlePaymentSubmit} className="space-y-4">
              <div className="text-center space-y-2">
                <p className="text-lg font-semibold">Amount to Pay</p>
                <p className="text-2xl font-bold text-primary">{selectedOrder?.amount}</p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Choose Payment Option</Label>
                  <RadioGroup value={paymentChoice} onValueChange={(value: "now" | "later") => setPaymentChoice(value)} className="mt-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="now" id="now" />
                      <Label htmlFor="now" className="text-sm">Pay Now (UPI)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="later" id="later" />
                      <Label htmlFor="later" className="text-sm">Pay within 30 days</Label>
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
                      Enter your UPI ID or scan QR code
                    </p>
                  </div>
                )}
                
                {paymentChoice === "later" && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-sm text-blue-700">
                      You can complete your payment anytime within 30 days. Your order will be processed immediately!
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
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  <CreditCard className="h-4 w-4 mr-2" />
                  {paymentChoice === "now" ? "Pay Now" : "Confirm Order"}
                </Button>
              </div>
            </form>
          ) : (
            <div className="text-center space-y-4 py-8">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
              <p className="text-lg font-medium">Processing your payment...</p>
              <p className="text-sm text-muted-foreground">Please wait while we confirm your transaction</p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Cancel Order Confirmation Modal */}
      <Dialog open={showCancelModal} onOpenChange={setShowCancelModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Cancel Order</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-center space-y-2">
              <p className="text-lg font-medium">Are you sure you want to cancel this order?</p>
              <p className="text-sm text-muted-foreground">
                Order ID: <span className="font-medium">{selectedOrder?.id}</span>
              </p>
              <p className="text-sm text-muted-foreground">
                This action cannot be undone.
              </p>
            </div>
            
            <div className="flex space-x-3">
              <Button 
                variant="outline" 
                onClick={() => setShowCancelModal(false)}
                className="flex-1"
              >
                Keep Order
              </Button>
              <Button 
                variant="destructive"
                onClick={handleCancelOrder}
                className="flex-1"
              >
                <X className="h-4 w-4 mr-2" />
                Yes, Cancel Order
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Return/Issue Reporting Modal */}
      <Dialog open={showReturnModal} onOpenChange={setShowReturnModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Report Product Issue</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Product: <span className="font-medium">{selectedProduct?.name}</span>
              </p>
              <p className="text-sm text-muted-foreground">
                Serial No: <span className="font-medium">{selectedProduct?.serialNo}</span>
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="reason">Please describe the issue</Label>
              <Textarea
                id="reason"
                placeholder="e.g., product is rotten, expired item received, damaged packaging..."
                value={returnReason}
                onChange={(e) => setReturnReason(e.target.value)}
                rows={3}
              />
            </div>
            
            <div className="flex space-x-3">
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowReturnModal(false);
                  setReturnReason("");
                  setSelectedProduct(null);
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleReturnProduct}
                disabled={!returnReason.trim()}
                className="flex-1"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Submit Issue
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VendorDashboard;