import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Package, Calendar, X, RefreshCw } from "lucide-react";

interface OrderItem {
  serialNo: string;
  product: string;
  quantity: number;
  frequency: string;
  mrp: number;
}

interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  status: "pending" | "confirmed" | "delivered" | "cancelled";
  orderDate: Date;
  deliveryDate?: Date;
}

interface OrderManagementProps {
  orders: Order[];
  onOrderUpdate: (orders: Order[]) => void;
}

const OrderManagement = ({ orders, onOrderUpdate }: OrderManagementProps) => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showReturnDialog, setShowReturnDialog] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [cancelReason, setCancelReason] = useState("");
  const [returnReason, setReturnReason] = useState("");
  const { toast } = useToast();

  const handleCancelOrder = () => {
    if (!selectedOrder) return;

    const updatedOrders = orders.map(order => {
      if (order.id === selectedOrder.id) {
        if (selectedItems.length === 0) {
          // Cancel entire order
          return { ...order, status: "cancelled" as const };
        } else {
          // Cancel selected items
          const remainingItems = order.items.filter(item => !selectedItems.includes(item.serialNo));
          const newTotal = remainingItems.reduce((sum, item) => sum + (item.mrp * item.quantity), 0);
          return { ...order, items: remainingItems, total: newTotal };
        }
      }
      return order;
    });

    onOrderUpdate(updatedOrders);
    toast({
      title: "Order Cancelled",
      description: selectedItems.length === 0 ? 
        "Your entire order has been cancelled." : 
        `${selectedItems.length} item(s) cancelled from your order.`
    });
    
    setShowCancelDialog(false);
    setSelectedItems([]);
    setCancelReason("");
    setSelectedOrder(null);
  };

  const handleReturnItem = () => {
    if (!selectedOrder || selectedItems.length === 0) return;

    const updatedOrders = orders.map(order => {
      if (order.id === selectedOrder.id) {
        const updatedItems = order.items.map(item => {
          if (selectedItems.includes(item.serialNo)) {
            return { ...item, status: "returned" };
          }
          return item;
        });
        return { ...order, items: updatedItems };
      }
      return order;
    });

    onOrderUpdate(updatedOrders);
    toast({
      title: "Return Initiated",
      description: `Return request submitted for ${selectedItems.length} item(s).`
    });
    
    setShowReturnDialog(false);
    setSelectedItems([]);
    setReturnReason("");
    setSelectedOrder(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "confirmed": return "bg-blue-100 text-blue-800";
      case "delivered": return "bg-green-100 text-green-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getFrequencyLabel = (frequency: string) => {
    switch (frequency) {
      case "oneTime": return "One Time";
      case "daily": return "Daily";
      case "weekly": return "Weekly";
      case "monthly": return "Monthly";
      default: return frequency;
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-primary">Order Management</h2>
        <Badge variant="outline">{orders.length} Orders</Badge>
      </div>

      <div className="grid gap-4">
        {orders.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No orders found</p>
            </CardContent>
          </Card>
        ) : (
          orders.map((order) => (
            <Card key={order.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                    <div className="flex items-center gap-4 mt-2">
                      <Badge className={getStatusColor(order.status)}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(order.orderDate)}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">₹{order.total}</p>
                    <p className="text-sm text-muted-foreground">{order.items.length} items</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Order Items */}
                  <div className="space-y-2">
                    {order.items.slice(0, 3).map((item) => (
                      <div key={item.serialNo} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                        <div>
                          <p className="font-medium">{item.product}</p>
                          <p className="text-sm text-muted-foreground">
                            {getFrequencyLabel(item.frequency)} • Qty: {item.quantity}kg
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">₹{item.mrp * item.quantity}</p>
                          <Badge variant="outline" className="text-xs">#{item.serialNo}</Badge>
                        </div>
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <p className="text-sm text-muted-foreground text-center">
                        +{order.items.length - 3} more items
                      </p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 flex-wrap">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setSelectedOrder(order)}>
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Order Details - #{order.id}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm font-medium">Order Date</p>
                              <p className="text-sm text-muted-foreground">{formatDate(order.orderDate)}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Status</p>
                              <Badge className={getStatusColor(order.status)}>
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </Badge>
                            </div>
                          </div>
                          
                          <div>
                            <p className="text-sm font-medium mb-2">Items ({order.items.length})</p>
                            <div className="space-y-2 max-h-60 overflow-y-auto">
                              {order.items.map((item) => (
                                <div key={item.serialNo} className="flex items-center justify-between p-3 border rounded">
                                  <div>
                                    <p className="font-medium">{item.product}</p>
                                    <p className="text-sm text-muted-foreground">
                                      {getFrequencyLabel(item.frequency)} • Qty: {item.quantity}kg • #{item.serialNo}
                                    </p>
                                  </div>
                                  <p className="font-medium">₹{item.mrp * item.quantity}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div className="border-t pt-4">
                            <div className="flex justify-between items-center">
                              <span className="text-lg font-medium">Total</span>
                              <span className="text-2xl font-bold text-primary">₹{order.total}</span>
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    {order.status !== "cancelled" && order.status !== "delivered" && (
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowCancelDialog(true);
                        }}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Cancel
                      </Button>
                    )}

                    {order.status === "delivered" && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowReturnDialog(true);
                        }}
                      >
                        <RefreshCw className="h-4 w-4 mr-1" />
                        Return
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Cancel Order Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Order</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Cancel Type</label>
              <Select onValueChange={(value) => {
                if (value === "full") setSelectedItems([]);
                else setSelectedItems([]);
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select cancellation type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full">Cancel Entire Order</SelectItem>
                  <SelectItem value="partial">Cancel Selected Items</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {selectedOrder && selectedItems.length === 0 && (
              <div>
                <label className="text-sm font-medium">Select Items to Cancel</label>
                <div className="space-y-2 mt-2">
                  {selectedOrder.items.map((item) => (
                    <div key={item.serialNo} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={item.serialNo}
                        checked={selectedItems.includes(item.serialNo)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedItems([...selectedItems, item.serialNo]);
                          } else {
                            setSelectedItems(selectedItems.filter(id => id !== item.serialNo));
                          }
                        }}
                      />
                      <label htmlFor={item.serialNo} className="text-sm">
                        {item.product} (#{item.serialNo})
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="text-sm font-medium">Reason for Cancellation</label>
              <Textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Please provide a reason for cancellation..."
                className="mt-1"
              />
            </div>

            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleCancelOrder} disabled={!cancelReason}>
                Confirm Cancellation
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Return Items Dialog */}
      <Dialog open={showReturnDialog} onOpenChange={setShowReturnDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Return Items</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedOrder && (
              <div>
                <label className="text-sm font-medium">Select Items to Return</label>
                <div className="space-y-2 mt-2">
                  {selectedOrder.items.map((item) => (
                    <div key={item.serialNo} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`return-${item.serialNo}`}
                        checked={selectedItems.includes(item.serialNo)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedItems([...selectedItems, item.serialNo]);
                          } else {
                            setSelectedItems(selectedItems.filter(id => id !== item.serialNo));
                          }
                        }}
                      />
                      <label htmlFor={`return-${item.serialNo}`} className="text-sm">
                        {item.product} (#{item.serialNo})
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="text-sm font-medium">Reason for Return</label>
              <Select onValueChange={setReturnReason}>
                <SelectTrigger>
                  <SelectValue placeholder="Select return reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="damaged">Product Damaged</SelectItem>
                  <SelectItem value="quality">Quality Issues</SelectItem>
                  <SelectItem value="wrong">Wrong Product Delivered</SelectItem>
                  <SelectItem value="expired">Product Expired</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowReturnDialog(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleReturnItem} 
                disabled={selectedItems.length === 0 || !returnReason}
              >
                Submit Return Request
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrderManagement;