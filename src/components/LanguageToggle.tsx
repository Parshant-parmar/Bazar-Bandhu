import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

const LanguageToggle = () => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleLanguage}
      className="font-medium transition-all duration-200 hover:scale-105"
    >
      {language === 'hi' ? 'EN' : 'हि'}
    </Button>
  );
};

export default LanguageToggle;