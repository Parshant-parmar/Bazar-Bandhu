import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { Phone } from "lucide-react";

const LoginPage = () => {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleSendOtp = async () => {
    if (!phone || phone.length < 10) {
      toast({
        title: t('fillAllFields'),
        description: "कृपया एक वैध मोबाइल नंबर दर्ज करें",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setShowOtpInput(true);
      setLoading(false);
      toast({
        title: t('otpSent'),
        description: `${phone} पर OTP भेजा गया`,
      });
    }, 1000);
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      toast({
        title: t('invalidOtp'),
        description: "कृपया 6 अंकों का OTP दर्ज करें",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({
        title: t('loginSuccess'),
        description: "आपका स्वागत है!",
      });
      navigate("/grocery");
    }, 1000);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-600 to-green-800 relative overflow-hidden">
        {/* Background Image with Vegetables */}
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 text-6xl">🍅</div>
          <div className="absolute top-20 right-20 text-5xl">🥔</div>
          <div className="absolute top-40 left-1/4 text-4xl">🧅</div>
          <div className="absolute bottom-20 left-20 text-7xl">🥛</div>
          <div className="absolute bottom-40 right-10 text-5xl">🍎</div>
          <div className="absolute top-1/3 right-1/3 text-6xl">🥚</div>
          <div className="absolute bottom-1/3 left-1/3 text-4xl">🥦</div>
          <div className="absolute top-1/2 left-10 text-5xl">🌶️</div>
          <div className="absolute bottom-10 right-1/4 text-6xl">🧄</div>
          <div className="absolute top-60 right-1/2 text-4xl">🍞</div>
        </div>
        
        {/* Brand Name */}
        <div className="relative z-10 flex flex-col justify-center items-start p-16">
          <div className="text-white">
            <h1 className="text-6xl font-bold mb-4">
              <span className="text-emerald-300">BaZar</span><br />
              <span className="text-white">BANDHU</span>
            </h1>
            <p className="text-xl text-emerald-100 max-w-md">
              Your trusted partner for fresh groceries and daily essentials
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <Card className="w-full max-w-md shadow-xl border-0">
          <CardContent className="p-8">
            {/* Logo */}
            <div className="text-center mb-8">
              <div className="w-20 h-20 mx-auto mb-4 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-3xl font-bold text-white">B</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome Back</h2>
              <p className="text-gray-600">Sign in to your account</p>
            </div>

            <div className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-gray-700 font-medium flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    {t('phone')}
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={t('phonePlaceholder')}
                    disabled={showOtpInput}
                    className="h-12 border-gray-300 focus:border-green-500 focus:ring-green-500"
                    maxLength={10}
                  />
                </div>

                {!showOtpInput ? (
                  <Button
                    onClick={handleSendOtp}
                    disabled={loading}
                    className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg"
                  >
                    {loading ? "भेजा जा रहा है..." : t('sendOtp')}
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-gray-700 font-medium">
                        OTP दर्ज करें
                      </Label>
                      <div className="flex justify-center">
                        <InputOTP
                          maxLength={6}
                          value={otp}
                          onChange={(value) => setOtp(value)}
                        >
                          <InputOTPGroup className="gap-2">
                            <InputOTPSlot index={0} className="w-12 h-12 border-gray-300" />
                            <InputOTPSlot index={1} className="w-12 h-12 border-gray-300" />
                            <InputOTPSlot index={2} className="w-12 h-12 border-gray-300" />
                            <InputOTPSlot index={3} className="w-12 h-12 border-gray-300" />
                            <InputOTPSlot index={4} className="w-12 h-12 border-gray-300" />
                            <InputOTPSlot index={5} className="w-12 h-12 border-gray-300" />
                          </InputOTPGroup>
                        </InputOTP>
                      </div>
                    </div>

                    <Button
                      onClick={handleVerifyOtp}
                      disabled={loading || otp.length !== 6}
                      className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg"
                    >
                      {loading ? "सत्यापित हो रहा है..." : t('verifyOtp')}
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() => setShowOtpInput(false)}
                      className="w-full h-12 border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      वापस जाएं
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;