import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast"; // Ensure this matches your hook path

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent page reload
    setLoading(true);

    try {
      // Connect to your Backend Login Route
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // ✅ CRITICAL: Check if the user is an ADMIN
        if (data.user.isAdmin) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("isAdmin", "true");
          
          toast({ title: "Welcome, Admin!" });
          navigate("/admin/dashboard");
        } else {
          toast({ 
            variant: "destructive", 
            title: "Access Denied", 
            description: "This account does not have admin privileges." 
          });
        }
      } else {
        toast({ 
          variant: "destructive", 
          title: "Login Failed", 
          description: data.msg || "Invalid credentials" 
        });
      }
    } catch (error) {
      console.error(error);
      toast({ 
        variant: "destructive", 
        title: "Network Error", 
        description: "Is the backend server running on port 5000?" 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="p-3 bg-primary/10 rounded-full">
            <Lock className="w-8 h-8 text-primary" />
          </div>
        </div>
        <h1 className="text-2xl font-bold mb-2 text-center text-slate-800">Admin Portal</h1>
        <p className="text-center text-slate-500 mb-8">Sign in to manage orders</p>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Email</label>
            <Input 
              type="email" 
              placeholder="admin@fooodle.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">Password</label>
            <Input 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button 
            type="submit"
            className="w-full h-11 text-lg" 
            disabled={loading}
          >
            {loading ? <Loader2 className="animate-spin mr-2" /> : "Login"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;