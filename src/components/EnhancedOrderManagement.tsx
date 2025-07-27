import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  Package, X, RotateCcw, AlertTriangle, CheckCircle, 
  Calendar, Clock, CreditCard 
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface OrderProduct {
  serialNo: string;
  name: string;
  quantity: string;
  frequency: string;
  mrp: number;
  hasIssue?: boolean;
  issueReason?: string;
  canReturn?: boolean;
  delivered?: boolean;
}

interface EnhancedOrder {
  id: string;
  vendor: string;
  products: OrderProduct[];
  amount: string;
  status: "Pending" | "Processing" | "Delivered" | "Cancelled";
  paymentStatus: "pending" | "paid";
  orderDate: Date;
  deliverySlot: string;
  scheduledDelivery: Date;
  monthlyBreakdown?: {
    [productSerial: string]: {
      basePrice: number;
      frequency: string;
      monthlyTotal: number;
      deliveryDays: number[];
    };
  };
}

interface EnhancedOrderManagementProps {
  orders: EnhancedOrder[];
  onOrderUpdate: (updatedOrders: EnhancedOrder[]) => void;
}

const EnhancedOrderManagement = ({ orders, onOrderUpdate }: EnhancedOrderManagementProps) => {
  const [selectedOrder, setSelectedOrder] = useState<EnhancedOrder | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<OrderProduct | null>(null);
  const [returnReason, setReturnReason] = useState("");
  const [cancelType, setCancelType] = useState<"full" | "partial">("full");
  const [selectedProductsToCancel, setSelectedProductsToCancel] = useState<string[]>([]);

  const calculateMonthlyTotal = (frequency: string, basePrice: number, quantity: string) => {
    const qty = parseFloat(quantity);
    switch (frequency) {
      case "oneTime":
        return basePrice * qty;
      case "daily":
        const today = new Date();
        const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
        return basePrice * qty * daysInMonth;
      case "weekly":
        return basePrice * qty * 4;
      case "monthly":
        return basePrice * qty * 1;
      default:
        return basePrice * qty;
    }
  };

  const generateMonthlyInvoice = (order: EnhancedOrder) => {
    const breakdown = order.products.map(product => {
      const qty = parseFloat(product.quantity);
      const monthlyTotal = calculateMonthlyTotal(product.frequency, product.mrp, product.quantity);
      
      return {
        serialNo: product.serialNo,
        name: product.name,
        frequency: product.frequency,
        quantity: qty,
        unitPrice: product.mrp,
        monthlyTotal,
        deliveryCount: product.frequency === "daily" ? 30 : 
                       product.frequency === "weekly" ? 4 : 
                       product.frequency === "monthly" ? 1 : 1
      };
    });

    const grandTotal = breakdown.reduce((sum, item) => sum + item.monthlyTotal, 0);
    
    return { breakdown, grandTotal };
  };

  const handleCancelOrder = () => {
    if (!selectedOrder) return;

    if (cancelType === "full") {
      // Cancel entire order
      const updatedOrders = orders.map(order => 
        order.id === selectedOrder.id 
          ? { ...order, status: "Cancelled" as const }
          : order
      );
      onOrderUpdate(updatedOrders);
      
      toast({
        title: "Order Cancelled Successfully!",
        description: `Order #${selectedOrder.id} has been cancelled. We're sorry to see you go!`,
      });
    } else {
      // Cancel selected products
      const updatedOrders = orders.map(order => 
        order.id === selectedOrder.id 
          ? {
              ...order,
              products: order.products.filter(product => 
                !selectedProductsToCancel.includes(product.serialNo)
              )
            }
          : order
      );
      onOrderUpdate(updatedOrders);
      
      toast({
        title: "Products Cancelled Successfully!",
        description: `${selectedProductsToCancel.length} product(s) cancelled from order #${selectedOrder.id}`,
      });
    }

    setShowCancelModal(false);
    setSelectedOrder(null);
    setSelectedProductsToCancel([]);
  };

  const handleReturnProduct = () => {
    if (!selectedOrder || !selectedProduct || !returnReason.trim()) return;

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
    
    onOrderUpdate(updatedOrders);
    setShowReturnModal(false);
    setReturnReason("");
    setSelectedProduct(null);
    
    toast({
      title: `Return Initiated for Serial #${selectedProduct.serialNo}!`,
      description: `Thank you for letting us know about the issue. We'll resolve this quickly for you!`,
    });
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-IN', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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

  return (
    <div className="space-y-6">
      {/* Orders List */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center space-x-2">
            <Package className="h-5 w-5" />
            <span>Enhanced Order Management</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors duration-200"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <h3 className="font-semibold text-foreground">{order.id}</h3>
                      <Badge variant={
                        order.status === "Delivered" ? "secondary" : 
                        order.status === "Processing" ? "default" : 
                        order.status === "Cancelled" ? "destructive" : "outline"
                      }>
                        {order.status}
                      </Badge>
                      {order.paymentStatus === "paid" && (
                        <Badge variant="secondary" className="bg-green-100 text-green-700">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Payment Done
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{order.vendor}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg text-foreground">{order.amount}</p>
                    <p className="text-sm text-muted-foreground">Order Date: {formatDate(order.orderDate)}</p>
                  </div>
                </div>
                
                {/* Products with Serial Numbers and Frequencies */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label className="text-xs text-muted-foreground">Products & Serial Numbers</Label>
                    <div className="space-y-1">
                      {order.products.map((product, idx) => (
                        <div key={idx} className="text-sm flex items-center justify-between">
                          <div>
                            <span className="font-medium text-primary">#{product.serialNo}</span>
                            <span className="ml-2">{product.name}</span>
                            <span className="text-muted-foreground ml-2">({product.quantity})</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={`text-xs ${getFrequencyColor(product.frequency)}`}>
                              {product.frequency === "oneTime" ? "One Time" : 
                               product.frequency === "daily" ? "Daily" :
                               product.frequency === "weekly" ? "Weekly" : "Monthly"}
                            </Badge>
                            {product.hasIssue && (
                              <Badge variant="destructive" className="text-xs">
                                Issue Reported
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Delivery Information</Label>
                    <p className="font-medium text-primary">{order.deliverySlot}</p>
                    <p className="text-sm text-muted-foreground">Scheduled: {formatDate(order.scheduledDelivery)}</p>
                  </div>
                </div>
                
                <div className="flex justify-between items-center pt-3 border-t border-border">
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedOrder(order)}
                    >
                      View Details
                    </Button>
                    {order.status !== "Delivered" && order.status !== "Cancelled" && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowCancelModal(true);
                        }}
                        className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                    )}
                  </div>
                  {order.paymentStatus === "pending" && (
                    <Button size="sm" className="bg-primary hover:bg-primary/90">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Pay Now
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Order Details Modal */}
      {selectedOrder && (
        <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Order Details - {selectedOrder.id}</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              {/* Monthly Invoice Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Monthly Invoice Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  {(() => {
                    const { breakdown, grandTotal } = generateMonthlyInvoice(selectedOrder);
                    return (
                      <div className="space-y-4">
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b">
                                <th className="text-left p-2">Serial #</th>
                                <th className="text-left p-2">Product</th>
                                <th className="text-left p-2">Frequency</th>
                                <th className="text-right p-2">Qty</th>
                                <th className="text-right p-2">Unit Price</th>
                                <th className="text-right p-2">Deliveries</th>
                                <th className="text-right p-2">Monthly Total</th>
                              </tr>
                            </thead>
                            <tbody>
                              {breakdown.map((item) => (
                                <tr key={item.serialNo} className="border-b">
                                  <td className="p-2 font-mono text-primary">#{item.serialNo}</td>
                                  <td className="p-2">{item.name}</td>
                                  <td className="p-2">
                                    <Badge className={`text-xs ${getFrequencyColor(item.frequency)}`}>
                                      {item.frequency === "oneTime" ? "One Time" : 
                                       item.frequency === "daily" ? "Daily" :
                                       item.frequency === "weekly" ? "Weekly" : "Monthly"}
                                    </Badge>
                                  </td>
                                  <td className="p-2 text-right">{item.quantity}</td>
                                  <td className="p-2 text-right">₹{item.unitPrice}</td>
                                  <td className="p-2 text-right">{item.deliveryCount}</td>
                                  <td className="p-2 text-right font-medium">₹{item.monthlyTotal}</td>
                                </tr>
                              ))}
                            </tbody>
                            <tfoot>
                              <tr className="border-t-2 font-bold">
                                <td colSpan={6} className="p-2 text-right">Grand Total:</td>
                                <td className="p-2 text-right text-primary">₹{grandTotal}</td>
                              </tr>
                            </tfoot>
                          </table>
                        </div>
                      </div>
                    );
                  })()}
                </CardContent>
              </Card>

              {/* Product Management */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Product Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {selectedOrder.products.map((product) => (
                      <div key={product.serialNo} className="flex items-center justify-between p-3 border rounded">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-primary font-medium">#{product.serialNo}</span>
                            <span className="font-medium">{product.name}</span>
                            <Badge className={`text-xs ${getFrequencyColor(product.frequency)}`}>
                              {product.frequency === "oneTime" ? "One Time" : 
                               product.frequency === "daily" ? "Daily" :
                               product.frequency === "weekly" ? "Weekly" : "Monthly"}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{product.quantity}</p>
                          {product.hasIssue && (
                            <Badge variant="destructive" className="text-xs mt-1">
                              Issue: {product.issueReason}
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex gap-2">
                          {selectedOrder.status === "Delivered" && !product.hasIssue && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedProduct(product);
                                setShowReturnModal(true);
                              }}
                            >
                              <RotateCcw className="h-3 w-3 mr-1" />
                              Return
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Cancel Order Modal */}
      <Dialog open={showCancelModal} onOpenChange={setShowCancelModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Cancel Order</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">What would you like to cancel?</Label>
              <RadioGroup value={cancelType} onValueChange={(value: "full" | "partial") => setCancelType(value)} className="mt-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="full" id="full" />
                  <Label htmlFor="full" className="text-sm">Cancel entire order</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="partial" id="partial" />
                  <Label htmlFor="partial" className="text-sm">Cancel specific products</Label>
                </div>
              </RadioGroup>
            </div>

            {cancelType === "partial" && selectedOrder && (
              <div className="space-y-2">
                <Label className="text-sm">Select products to cancel:</Label>
                {selectedOrder.products.map((product) => (
                  <div key={product.serialNo} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={product.serialNo}
                      checked={selectedProductsToCancel.includes(product.serialNo)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedProductsToCancel([...selectedProductsToCancel, product.serialNo]);
                        } else {
                          setSelectedProductsToCancel(selectedProductsToCancel.filter(id => id !== product.serialNo));
                        }
                      }}
                    />
                    <Label htmlFor={product.serialNo} className="text-sm">
                      #{product.serialNo}: {product.name}
                    </Label>
                  </div>
                ))}
              </div>
            )}
            
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
                disabled={cancelType === "partial" && selectedProductsToCancel.length === 0}
              >
                <X className="h-4 w-4 mr-2" />
                Confirm Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Return Product Modal */}
      <Dialog open={showReturnModal} onOpenChange={setShowReturnModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Return Product</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Product: <span className="font-medium">{selectedProduct?.name}</span>
              </p>
              <p className="text-sm text-muted-foreground">
                Serial #: <span className="font-medium font-mono text-primary">#{selectedProduct?.serialNo}</span>
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="reason">Reason for return</Label>
              <Textarea
                id="reason"
                placeholder="e.g., Product is rotten, expired item received, damaged packaging..."
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
                Submit Return
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EnhancedOrderManagement;