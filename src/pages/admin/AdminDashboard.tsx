import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Clock, RefreshCw, LogOut, FileImage } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

// 1. Updated Interface matching YOUR actual backend response
interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  user: { name: string; email: string }; // Populated user object
  items: OrderItem[];
  totalAmount: number;
  status: "Pending" | "Completed" | "Cancelled"; // Matched your backend enum
  pickupTime: string; // "HH:mm"
  pickupToken: string;
  paymentMethod: string;
  paymentScreenshot?: string;
  orderDate: string; // Date string from backend
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  // 1. Check Auth on Load
  useEffect(() => {
    const token = localStorage.getItem("token");
    // Ideally check if user is admin role too, but for now just token check
    if (!token) {
      navigate("/login"); 
    } else {
      fetchOrders();
    }
  }, [navigate]);

  // 2. Fetch Orders from Backend
  const fetchOrders = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      // Updated URL to match your new admin route
      const res = await axios.get("http://localhost:5000/api/orders/admin/all-orders", {
        headers: { 'Authorization': token }
      });
      
      if (Array.isArray(res.data)) {
        setOrders(res.data);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast({ variant: "destructive", title: "Fetch Failed", description: "Could not load orders." });
    } finally {
      setLoading(false);
    }
  };

  // 3. Update Status Function
  const updateStatus = async (id: string, status: string) => {
    const token = localStorage.getItem('token');
    try {
      // Updated URL to match your new admin route
      await axios.put(`http://localhost:5000/api/orders/admin/update-status/${id}`, 
        { status },
        { headers: { 'Authorization': token } }
      );
      
      toast({ title: `Order ${status}`, description: "Status updated successfully." });
      fetchOrders(); // Refresh data immediately
      
    } catch (error) {
      console.error("Error updating status:", error);
      toast({ variant: "destructive", title: "Update Failed", description: "Could not update status." });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Filters based on your status (Pending, Completed, Cancelled)
  const pendingOrders = orders.filter(o => o.status === "Pending");
  // In your system, you don't have "Accepted", just Pending -> Completed. 
  // We can treat "Pending" as Incoming.
  const historyOrders = orders.filter(o => ["Cancelled", "Completed"].includes(o.status));

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
           <h1 className="text-3xl font-bold text-slate-800">Admin Dashboard</h1>
           <p className="text-slate-500">Live Orders & Kitchen Status</p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" onClick={fetchOrders} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </Button>
          <Button variant="destructive" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="incoming" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8 max-w-lg mx-auto md:mx-0">
          <TabsTrigger value="incoming" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            Incoming / Pending ({pendingOrders.length})
          </TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        {/* Tab 1: Incoming (Pending) */}
        <TabsContent value="incoming" className="animate-in fade-in-50">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pendingOrders.length === 0 && <p className="text-slate-500 col-span-full text-center py-10">No pending orders.</p>}
            {pendingOrders.map((order) => (
              <OrderCard key={order._id} order={order} 
                onComplete={() => updateStatus(order._id, "Completed")}
                onCancel={() => updateStatus(order._id, "Cancelled")}
              />
            ))}
          </div>
        </TabsContent>

        {/* Tab 2: History (Completed/Cancelled) */}
        <TabsContent value="history" className="animate-in fade-in-50">
          <div className="bg-white rounded-lg shadow border overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                <thead className="bg-slate-50 border-b">
                    <tr>
                    <th className="p-4 font-semibold text-slate-600">Token</th>
                    <th className="p-4 font-semibold text-slate-600">Customer</th>
                    <th className="p-4 font-semibold text-slate-600">Items</th>
                    <th className="p-4 font-semibold text-slate-600">Total</th>
                    <th className="p-4 font-semibold text-slate-600">Status</th>
                    <th className="p-4 font-semibold text-slate-600">Date</th>
                    </tr>
                </thead>
                <tbody>
                    {historyOrders.map((order) => (
                    <tr key={order._id} className="border-b last:border-0 hover:bg-slate-50">
                        <td className="p-4 font-mono font-bold text-blue-600">{order.pickupToken}</td>
                        <td className="p-4 text-sm font-medium">{order.user?.name || "Guest"}</td>
                        <td className="p-4 text-sm text-slate-500">{order.items.length} items</td>
                        <td className="p-4 font-bold text-sm">₹{order.totalAmount}</td>
                        <td className="p-4">
                        <Badge variant={order.status === "Completed" ? "default" : "destructive"}>
                            {order.status}
                        </Badge>
                        </td>
                        <td className="p-4 text-xs text-slate-500">
                        {new Date(order.orderDate).toLocaleString()}
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// --- Helper Component: Order Card ---
const OrderCard = ({ order, onComplete, onCancel }: { order: Order, onComplete: () => void, onCancel: () => void }) => (
  <Card className="shadow-lg border-l-4 border-l-blue-500 hover:shadow-xl transition-all relative overflow-hidden">
    <div className="absolute top-0 right-0 bg-blue-100 px-3 py-1 rounded-bl-lg">
       <span className="font-mono font-bold text-blue-800 tracking-wider">{order.pickupToken}</span>
    </div>

    <CardHeader className="pb-3 border-b bg-slate-50/50 pt-8">
      <div className="flex justify-between items-start">
        <div>
           <CardTitle className="text-lg font-bold">{order.user?.name || "Unknown User"}</CardTitle>
           <p className="text-xs text-muted-foreground mt-1">{order.user?.email}</p>
        </div>
        <Badge variant="outline" className="flex items-center gap-1 bg-white">
          <Clock className="w-3 h-3" />
          Pickup: {order.pickupTime}
        </Badge>
      </div>
    </CardHeader>
    <CardContent className="pt-4">
      <div className="space-y-2 mb-4 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
        {order.items.map((item, idx) => (
          <div key={idx} className="flex justify-between text-sm items-center border-b border-dashed pb-1 last:border-0">
            <span className="font-medium text-slate-700">{item.quantity}x {item.name}</span>
            <span className="text-slate-500 text-xs">₹{item.price * item.quantity}</span>
          </div>
        ))}
      </div>
      
      <div className="flex justify-between items-center font-bold text-lg pt-2 mb-2 border-t">
        <span>Total:</span>
        <span className="text-primary">₹{order.totalAmount}</span>
      </div>

      <div className="flex justify-between items-center text-xs text-gray-500 mb-4">
         <span>Pay: {order.paymentMethod}</span>
         {order.paymentScreenshot && (
             <a href={`http://localhost:5000/${order.paymentScreenshot}`} target="_blank" rel="noreferrer" className="flex items-center text-blue-600 hover:underline">
                 <FileImage className="w-3 h-3 mr-1"/> Screenshot
             </a>
         )}
      </div>
      
      <div className="flex gap-2 pt-1">
        <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white" onClick={onComplete}>
            <Check className="w-4 h-4 mr-1" /> Complete
        </Button>
        <Button className="flex-1" variant="destructive" onClick={onCancel}>
            <X className="w-4 h-4 mr-1" /> Reject
        </Button>
      </div>
    </CardContent>
  </Card>
);

export default AdminDashboard;
