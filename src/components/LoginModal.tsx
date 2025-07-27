import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { Heart, Phone } from "lucide-react";

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
}

const LoginModal = ({ open, onClose }: LoginModalProps) => {
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
    // Simulate API call
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
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast({
        title: t('loginSuccess'),
        description: "आपका स्वागत है!",
      });
      onClose();
      navigate("/grocery");
    }, 1000);
  };

  const handleClose = () => {
    setPhone("");
    setOtp("");
    setShowOtpInput(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <DialogTitle className="flex items-center justify-center gap-2 text-2xl">
            <Heart className="h-6 w-6 text-primary fill-primary animate-pulse" />
            {t('loginTitle')}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 p-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-foreground font-medium flex items-center gap-2">
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
                className="transition-all duration-200 focus:ring-2 focus:ring-primary"
                maxLength={10}
              />
            </div>

            {!showOtpInput ? (
              <Button
                onClick={handleSendOtp}
                disabled={loading}
                className="w-full bg-gradient-primary hover:opacity-90 transform hover:scale-105 transition-all duration-200 shadow-primary font-semibold"
              >
                {loading ? "भेजा जा रहा है..." : t('sendOtp')}
              </Button>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-foreground font-medium">
                    OTP दर्ज करें
                  </Label>
                  <div className="flex justify-center">
                    <InputOTP
                      maxLength={6}
                      value={otp}
                      onChange={(value) => setOtp(value)}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                </div>

                <Button
                  onClick={handleVerifyOtp}
                  disabled={loading || otp.length !== 6}
                  className="w-full bg-gradient-primary hover:opacity-90 transform hover:scale-105 transition-all duration-200 shadow-primary font-semibold"
                >
                  {loading ? "सत्यापित हो रहा है..." : t('verifyOtp')}
                </Button>

                <Button
                  variant="outline"
                  onClick={() => setShowOtpInput(false)}
                  className="w-full"
                >
                  वापस जाएं
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;