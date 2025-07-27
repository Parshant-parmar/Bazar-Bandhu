import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { Heart, User, Phone, MapPin, UserCheck } from "lucide-react";

interface SignupModalProps {
  open: boolean;
  onClose: () => void;
}

const SignupModal = ({ open, onClose }: SignupModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    userType: ""
  });
  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleSendOtp = async () => {
    if (!formData.name || !formData.phone || !formData.address || !formData.userType) {
      toast({
        title: t('fillAllFields'),
        description: "कृपया सभी फ़ील्ड भरें",
        variant: "destructive",
      });
      return;
    }

    if (formData.phone.length < 10) {
      toast({
        title: "गलत मोबाइल नंबर",
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
        description: `${formData.phone} पर OTP भेजा गया`,
      });
    }, 1000);
  };

  const handleRegister = async () => {
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
        title: t('registrationSuccess'),
        description: `स्वागत है ${formData.name}! आपका पंजीकरण सफल हो गया।`,
      });
      onClose();
      navigate("/grocery");
    }, 1000);
  };

  const handleClose = () => {
    setFormData({ name: "", phone: "", address: "", userType: "" });
    setOtp("");
    setShowOtpInput(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center">
          <DialogTitle className="flex items-center justify-center gap-2 text-2xl">
            <Heart className="h-6 w-6 text-primary fill-primary animate-pulse" />
            {t('signupTitle')}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 p-6">
          {!showOtpInput ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-foreground font-medium flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {t('name')}
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder={t('namePlaceholder')}
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-foreground font-medium flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  {t('phone')}
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder={t('phonePlaceholder')}
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary"
                  maxLength={10}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="text-foreground font-medium flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {t('address')}
                </Label>
                <Input
                  id="address"
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder={t('addressPlaceholder')}
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="space-y-3">
                <Label className="text-foreground font-medium flex items-center gap-2">
                  <UserCheck className="h-4 w-4" />
                  {t('userType')}
                </Label>
                <RadioGroup
                  value={formData.userType}
                  onValueChange={(value) => setFormData({ ...formData, userType: value })}
                  className="grid grid-cols-2 gap-4"
                >
                  <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-accent transition-colors">
                    <RadioGroupItem value="buyer" id="buyer" />
                    <Label htmlFor="buyer" className="cursor-pointer flex items-center gap-2">
                      🛒 {t('buyer')}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-accent transition-colors">
                    <RadioGroupItem value="seller" id="seller" />
                    <Label htmlFor="seller" className="cursor-pointer flex items-center gap-2">
                      🏪 {t('seller')}
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <Button
                onClick={handleSendOtp}
                disabled={loading}
                className="w-full bg-gradient-primary hover:opacity-90 transform hover:scale-105 transition-all duration-200 shadow-primary font-semibold"
              >
                {loading ? "भेजा जा रहा है..." : t('sendOtp')}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-center space-y-2">
                <div className="text-sm text-muted-foreground">
                  OTP भेजा गया: {formData.phone}
                </div>
              </div>

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
                onClick={handleRegister}
                disabled={loading || otp.length !== 6}
                className="w-full bg-gradient-primary hover:opacity-90 transform hover:scale-105 transition-all duration-200 shadow-primary font-semibold"
              >
                {loading ? "पंजीकरण हो रहा है..." : t('register')}
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
      </DialogContent>
    </Dialog>
  );
};

export default SignupModal;