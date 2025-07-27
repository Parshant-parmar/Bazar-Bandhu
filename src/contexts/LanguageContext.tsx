import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'hi' | 'en';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const translations = {
  hi: {
    // Homepage
    welcome: "नमस्ते, बाज़ार बंधु में आपका स्वागत है!",
    login: "लॉग इन",
    signup: "साइन अप",
    
    // Common
    name: "नाम",
    phone: "मोबाइल नंबर",
    address: "पता",
    sendOtp: "OTP भेजें",
    verifyOtp: "OTP सत्यापित करें",
    register: "रजिस्टर करें",
    buyer: "खरीदार",
    seller: "विक्रेता",
    userType: "उपयोगकर्ता प्रकार",
    
    // Placeholders
    namePlaceholder: "अपना नाम दर्ज करें",
    phonePlaceholder: "मोबाइल नंबर दर्ज करें",
    addressPlaceholder: "अपना पता दर्ज करें",
    otpPlaceholder: "6 अंकों का OTP दर्ज करें",
    
    // Messages
    otpSent: "OTP भेजा गया!",
    otpVerified: "OTP सत्यापित हो गया!",
    registrationSuccess: "सफलतापूर्वक पंजीकरण हो गया!",
    loginSuccess: "लॉग इन सफल!",
    fillAllFields: "कृपया सभी फ़ील्ड भरें",
    invalidOtp: "गलत OTP",
    
    // Headers
    loginTitle: "लॉग इन करें",
    signupTitle: "साइन अप करें",
    
    // Other
    close: "बंद करें",
    cancel: "रद्द करें",
    
    // Grocery Dashboard
    groceryDashboard: "वर्डे लिंक ग्रॉसरी डैशबोर्ड",
    searchPlaceholder: "कोई वस्तु खोजें...",
    selectLocation: "अपना स्थान चुनें:",
    vegetables: "सब्जियां",
    dairyProducts: "डेयरी उत्पाद",
    spicesAndOils: "मसाले और तेल",
    meatAndPoultry: "मांस और मुर्गी",
    others: "अन्य",
    daily: "दैनिक",
    weekly: "साप्ताहिक",
    monthly: "मासिक",
    quantity: "मात्रा",
    kg: "किग्रा",
    addToCart: "कार्ट में जोड़ें",
    yourCart: "आपका कार्ट",
    cartEmpty: "कार्ट खाली है",
    total: "कुल:",
    checkout: "चेकआउट",
    cartUpdated: "कार्ट अपडेट हुआ",
    addedToCart: "कार्ट में जोड़ा गया",
    removedFromCart: "कार्ट से हटाया गया",
    itemRemoved: "वस्तु सफलतापूर्वक हटाई गई",
    language: "भाषा",
    
    // Product names
    onion: "प्याज",
    tomato: "टमाटर",
    garlic: "लहसुन",
    potato: "आलू",
    carrot: "गाजर",
    cauliflower: "गोभी",
    spinach: "पालक",
    beans: "बींस",
    peas: "मटर",
    cabbage: "पत्ता गोभी",
    chillies: "मिर्च",
    brinjal: "बैंगन",
    milk: "दूध",
    eggs: "अंडे",
    ghee: "घी",
    oil: "तेल",
    redSpice: "लाल मिर्च पाउडर",
    corianderPowder: "धनिया पाउडर",
    turmericPowder: "हल्दी पाउडर",
    garamMasala: "गरम मसाला",
    cuminSeeds: "जीरा",
    blackPepper: "काली मिर्च",
    mustardSeeds: "सरसों के बीज",
    fenugreek: "मेथी",
    asafoetida: "हींग",
    chicken: "चिकन",
    mutton: "मटन",
    fish: "मछली",
    prawns: "झींगा",
    apples: "सेब",
    broccoli: "ब्रोकली",
    rice: "चावल",
    bread: "ब्रेड",
    noodles: "नूडल्स",
    momos: "मोमोज",
  },
  en: {
    // Homepage
    welcome: "Welcome to Bazzar Bandhu!",
    login: "Login",
    signup: "Sign Up",
    
    // Common
    name: "Name",
    phone: "Mobile Number",
    address: "Address",
    sendOtp: "Send OTP",
    verifyOtp: "Verify OTP",
    register: "Register Now",
    buyer: "Buyer",
    seller: "Seller",
    userType: "User Type",
    
    // Placeholders
    namePlaceholder: "Enter your name",
    phonePlaceholder: "Enter mobile number",
    addressPlaceholder: "Enter your address",
    otpPlaceholder: "Enter 6-digit OTP",
    
    // Messages
    otpSent: "OTP Sent!",
    otpVerified: "OTP Verified!",
    registrationSuccess: "Registration Successful!",
    loginSuccess: "Login Successful!",
    fillAllFields: "Please fill all fields",
    invalidOtp: "Invalid OTP",
    
    // Headers
    loginTitle: "Login",
    signupTitle: "Sign Up",
    
    // Other
    close: "Close",
    cancel: "Cancel",
    
    // Grocery Dashboard
    groceryDashboard: "Verde Link Grocery Dashboard",
    searchPlaceholder: "Search for an item...",
    selectLocation: "Select Your Location:",
    vegetables: "Vegetables",
    dairyProducts: "Dairy Products",
    spicesAndOils: "Spices and Oils",
    meatAndPoultry: "Meat & Poultry",
    others: "Others",
    daily: "Daily",
    weekly: "Weekly",
    monthly: "Monthly",
    quantity: "Qty",
    kg: "kg",
    addToCart: "Add to Cart",
    yourCart: "Your Cart",
    cartEmpty: "Cart is empty",
    total: "Total:",
    checkout: "Checkout",
    cartUpdated: "Cart Updated",
    addedToCart: "Added to Cart",
    removedFromCart: "Removed from Cart",
    itemRemoved: "Item successfully removed",
    language: "Language",
    
    // Product names
    onion: "Onion",
    tomato: "Tomato",
    garlic: "Garlic",
    potato: "Potato",
    carrot: "Carrot",
    cauliflower: "Cauliflower",
    spinach: "Spinach",
    beans: "Beans",
    peas: "Peas",
    cabbage: "Cabbage",
    chillies: "Chillies",
    brinjal: "Brinjal",
    milk: "Milk",
    eggs: "Eggs",
    ghee: "Ghee",
    oil: "Oil",
    redSpice: "Red Chili Powder",
    corianderPowder: "Coriander Powder",
    turmericPowder: "Turmeric Powder",
    garamMasala: "Garam Masala",
    cuminSeeds: "Cumin Seeds",
    blackPepper: "Black Pepper",
    mustardSeeds: "Mustard Seeds",
    fenugreek: "Fenugreek",
    asafoetida: "Asafoetida",
    chicken: "Chicken",
    mutton: "Mutton",
    fish: "Fish",
    prawns: "Prawns",
    apples: "Apples",
    broccoli: "Broccoli",
    rice: "Rice",
    bread: "Bread",
    noodles: "Noodles",
    momos: "Momos",
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('hi');

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'hi' ? 'en' : 'hi');
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['hi']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
