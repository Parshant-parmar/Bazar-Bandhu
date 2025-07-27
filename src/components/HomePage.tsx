import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";
import LoginModal from "@/components/LoginModal";
import SignupModal from "@/components/SignupModal";
import { TreePine, Phone, Mail, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const { t } = useLanguage();
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Login Successful",
        description: "Welcome to BaZar BANDHU!",
      });
      navigate("/grocery");
    }, 1000);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding with Background */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-hero relative overflow-hidden">
        {/* Food Emoji Background */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-10 left-10 text-6xl transform -rotate-12">🍅</div>
          <div className="absolute top-20 right-20 text-5xl transform rotate-45">🥔</div>
          <div className="absolute top-40 left-1/4 text-4xl transform -rotate-45">🧅</div>
          <div className="absolute bottom-20 left-20 text-7xl transform rotate-12">🥛</div>
          <div className="absolute bottom-40 right-10 text-5xl transform -rotate-12">🍎</div>
          <div className="absolute top-1/3 right-1/3 text-6xl transform rotate-90">🥚</div>
          <div className="absolute bottom-1/3 left-1/3 text-4xl transform -rotate-90">🥦</div>
          <div className="absolute top-1/2 left-10 text-5xl transform rotate-45">🌶️</div>
          <div className="absolute bottom-10 right-1/4 text-6xl transform -rotate-45">🧄</div>
          <div className="absolute top-60 right-1/2 text-4xl transform rotate-12">🍞</div>
        </div>

        {/* Header with Logo */}
        <header className="absolute top-0 left-0 right-0 z-10 flex justify-between items-center p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
              <TreePine className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">
                <span className="text-white">BaZar</span>
                <span className="text-emerald-200 ml-1">BANDHU</span>
              </h1>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <LanguageToggle />
          </div>
        </header>
        
        {/* Brand Name Display */}
        <div className="relative z-10 flex flex-col justify-center items-start p-16">
          <div className="text-white">
            <h2 className="text-6xl font-bold mb-4">
              <span className="text-emerald-300">BaZar</span><br />
              <span className="text-white">BANDHU</span>
            </h2>
            <p className="text-xl text-emerald-100 max-w-md">
              Your trusted partner for fresh groceries and daily essentials
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8" style={{background: 'linear-gradient(135deg, #86efac, #bbf7d0)'}}>
        <Card className="w-full max-w-md shadow-xl border-0 bg-white">
          <CardContent className="p-8">
            {/* Logo */}
            <div className="text-center mb-8">
              <div className="w-20 h-20 mx-auto mb-4 bg-white rounded-full flex items-center justify-center shadow-lg">
                <TreePine className="h-12 w-12 text-green-600" />
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700 font-medium flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="h-12 border-gray-200 focus:border-green-500 focus:ring-green-500 rounded-xl bg-green-50"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-700 font-medium flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="h-12 border-gray-200 focus:border-green-500 focus:ring-green-500 rounded-xl bg-green-50"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl"
                >
                  {loading ? "Signing in..." : "Sign In"}
                </Button>
              </div>

              {/* Social Login Options */}
              <div className="pt-4">
                <div className="relative mb-4">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-500">Or continue with</span>
                  </div>
                </div>

                <div className="flex justify-center space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-12 h-12 rounded-full border-gray-200 hover:bg-blue-50"
                  >
                    <span className="text-xl">👤</span>
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-12 h-12 rounded-full border-gray-200 hover:bg-red-50"
                  >
                    <span className="text-xl">G</span>
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-12 h-12 rounded-full border-gray-200 hover:bg-gray-50"
                  >
                    <span className="text-xl">🍎</span>
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      <LoginModal open={showLogin} onClose={() => setShowLogin(false)} />
      <SignupModal open={showSignup} onClose={() => setShowSignup(false)} />
    </div>
  );
};

export default HomePage;