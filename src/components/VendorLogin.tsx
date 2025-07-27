import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const VendorLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username && password) {
      toast({
        title: "Login Successful",
        description: "Welcome to Verde Link marketplace!",
      });
      // Navigate to grocery dashboard
      navigate("/grocery");
    } else {
      toast({
        title: "Login Failed",
        description: "Please enter both username and password.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4 relative overflow-hidden">
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
      <Card className="w-full max-w-md animate-slide-in shadow-primary relative z-10">
        <CardHeader className="bg-gradient-primary text-primary-foreground text-center rounded-t-lg">
          <CardTitle className="text-2xl font-semibold tracking-wide">
            Vendor Login
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-foreground font-medium">
                Username
              </Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
                className="transition-all duration-200 focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground font-medium">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="transition-all duration-200 focus:ring-2 focus:ring-primary"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-primary hover:opacity-90 transform hover:scale-105 transition-all duration-200 shadow-primary font-semibold tracking-wide"
            >
              Login
            </Button>
          </form>
          <div className="text-right">
            <a
              href="#"
              className="text-sm text-primary hover:text-secondary transition-colors duration-200 underline decoration-dotted hover:decoration-solid"
            >
              Forgot password?
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VendorLogin;