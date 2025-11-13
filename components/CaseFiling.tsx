import React, { useState } from 'react';
import { LanguagesIcon } from './icons/LanguagesIcon';
import { ExternalLinkIcon } from './icons/ExternalLinkIcon';

type Language = 'en' | 'hi' | 'ta';
type CaseTypeKey = 'consumer' | 'property' | 'family' | 'cheque' | 'otherCivil';

const translations = {
  en: {
    title: "File a New Case",
    description: "Please fill in your details below. After submission, you will be provided with links to the relevant e-filing portals based on your case type.",
    fullNameLabel: "Full Name",
    fullNamePlaceholder: "e.g., Rohan Sharma",
    addressLabel: "Full Address",
    addressPlaceholder: "Enter your complete residential address",
    phoneLabel: "Phone Number",
    emailLabel: "Email Address",
    emailPlaceholder: "e.g., user@example.com",
    caseTypeLabel: "Type of Case",
    caseTypeDefault: "Select a case type",
    submitButton: "Find Filing Portals",
    formSubmittedTitle: "E-Filing Portal Links",
    formSubmittedDescription: "Based on your selection, here are the recommended portals to file your case online. Please ensure you have all necessary documents before proceeding.",
    noLinks: "Please select a valid case type to see relevant links.",
    caseTypes: {
      consumer: 'Consumer Dispute',
      property: 'Property Dispute',
      family: 'Family Matter',
      cheque: 'Cheque Bounce / Financial',
      otherCivil: 'Other Civil Matter',
    }
  },
  hi: {
    title: "नया केस दर्ज करें",
    description: "कृपया नीचे अपना विवरण भरें। सबमिट करने के बाद, आपको आपके केस के प्रकार के आधार पर संबंधित ई-फाइलिंग पोर्टलों के लिंक प्रदान किए जाएंगे।",
    fullNameLabel: "पूरा नाम",
    fullNamePlaceholder: "जैसे, रोहन शर्मा",
    addressLabel: "पूरा पता",
    addressPlaceholder: "अपना पूरा आवासीय पता दर्ज करें",
    phoneLabel: "फ़ोन नंबर",
    emailLabel: "ईमेल पता",
    emailPlaceholder: "जैसे, user@example.com",
    caseTypeLabel: "केस का प्रकार",
    caseTypeDefault: "केस का प्रकार चुनें",
    submitButton: "फाइलिंग पोर्टल खोजें",
    formSubmittedTitle: "ई-फाइलिंग पोर्टल लिंक",
    formSubmittedDescription: "आपके चयन के आधार पर, आपके मामले को ऑनलाइन दर्ज करने के लिए यहां अनुशंसित पोर्टल दिए गए हैं। कृपया आगे बढ़ने से पहले सुनिश्चित करें कि आपके पास सभी आवश्यक दस्तावेज हैं।",
    noLinks: "प्रासंगिक लिंक देखने के लिए कृपया एक मान्य केस प्रकार चुनें।",
    caseTypes: {
      consumer: 'उपभोक्ता विवाद',
      property: 'संपत्ति विवाद',
      family: 'पारिवारिक मामला',
      cheque: 'चेक बाउंस / वित्तीय',
      otherCivil: 'अन्य दीवानी मामले',
    }
  },
  ta: {
    title: "புதிய வழக்குப் பதிவு செய்யுங்கள்",
    description: "கீழே உங்கள் விவரங்களை நிரப்பவும். சமர்ப்பித்த பிறகு, உங்கள் வழக்கின் வகையின் அடிப்படையில் தொடர்புடைய இ-ஃபைலிங் போர்ட்டல்களுக்கான இணைப்புகள் உங்களுக்கு வழங்கப்படும்.",
    fullNameLabel: "முழு பெயர்",
    fullNamePlaceholder: "எ.கா., ரோஹன் சர்மா",
    addressLabel: "முழு முகவரி",
    addressPlaceholder: "உங்கள் முழுமையான குடியிருப்பு முகவரியை உள்ளிடவும்",
    phoneLabel: "தொலைபேசி எண்",
    emailLabel: "மின்னஞ்சல் முகவரி",
    emailPlaceholder: "எ.கா., user@example.com",
    caseTypeLabel: "வழக்கின் வகை",
    caseTypeDefault: "வழக்கு வகையைத் தேர்ந்தெடுக்கவும்",
    submitButton: "தாக்கல் போர்ட்டல்களைக் கண்டறியவும்",
    formSubmittedTitle: "இ-ஃபைலிங் போர்டல் இணைப்புகள்",
    formSubmittedDescription: "உங்கள் தேர்வின் அடிப்படையில், உங்கள் வழக்கை ஆன்லைனில் தாக்கல் செய்வதற்கான பரிந்துரைக்கப்பட்ட போர்ட்டல்கள் இங்கே உள்ளன. தொடர்வதற்கு முன், தேவையான அனைத்து ஆவணங்களும் உங்களிடம் உள்ளதா என்பதை உறுதிப்படுத்தவும்.",
    noLinks: "தொடர்புடைய இணைப்புகளைப் பார்க்க, சரியான வழக்கு வகையைத் தேர்ந்தெடுக்கவும்.",
    caseTypes: {
      consumer: 'நுகர்வோர் தகராறு',
      property: 'சொத்து தகராறு',
      family: 'குடும்ப விஷயம்',
      cheque: 'காசோலை பவுன்ஸ் / நிதி',
      otherCivil: 'மற்ற சிவில் வழக்கு',
    }
  }
};

const portalLinks: Record<CaseTypeKey, { name: string; url: string }[]> = {
  consumer: [
    { name: 'National Consumer Helpline', url: 'https://consumerhelpline.gov.in/' },
    { name: 'E-Daakhil Portal', url: 'https://edaakhil.nic.in/' },
  ],
  property: [
    { name: 'e-Courts Services', url: 'https://ecourts.gov.in/ecourts_home/' },
    { name: 'National Generic Document Registration System', url: 'https://ngdrs.gov.in/' },
  ],
  family: [
    { name: 'e-Courts Services', url: 'https://ecourts.gov.in/ecourts_home/' },
  ],
  cheque: [
    { name: 'e-Courts Services for Negotiable Instruments Act', url: 'https://ecourts.gov.in/ecourts_home/' },
  ],
  otherCivil: [
    { name: 'e-Courts Services', url: 'https://ecourts.gov.in/ecourts_home/' },
  ]
};

export const CaseFiling: React.FC = () => {
    const [language, setLanguage] = useState<Language>('en');
    const [formData, setFormData] = useState({
        fullName: '',
        address: '',
        phone: '',
        email: '',
        caseType: '',
    });
    const [formSubmitted, setFormSubmitted] = useState(false);

    const t = translations[language];

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setFormSubmitted(true);
    };
    
    const linksToShow = portalLinks[formData.caseType as CaseTypeKey] || [];

    return (
        <div>
            <div className="flex justify-between items-center mb-2">
                <h1 className="text-3xl font-bold text-[rgb(var(--foreground))]">{t.title}</h1>
                <div className="relative">
                    <LanguagesIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[rgb(var(--muted-foreground))]" />
                    <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value as Language)}
                        className="pl-10 pr-4 py-2 border border-[rgb(var(--border))] rounded-md bg-[rgb(var(--card))] text-[rgb(var(--foreground))] focus:ring-2 focus:ring-[rgb(var(--ring))]"
                        aria-label="Select language"
                    >
                        <option value="en">English</option>
                        <option value="hi">हिन्दी</option>
                        <option value="ta">தமிழ்</option>
                    </select>
                </div>
            </div>
            <p className="text-lg text-[rgb(var(--muted-foreground))] mb-6">{t.description}</p>
            
            <div className="bg-[rgb(var(--card))] p-6 sm:p-8 rounded-xl shadow-custom-lg border border-[rgb(var(--border))]">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="fullName" className="block text-sm font-medium text-[rgb(var(--card-foreground))]">{t.fullNameLabel}</label>
                            <input type="text" name="fullName" id="fullName" value={formData.fullName} onChange={handleInputChange} placeholder={t.fullNamePlaceholder} className="mt-1 block w-full p-2 border border-[rgb(var(--border))] rounded-md bg-[rgb(var(--background))] focus:ring-2 focus:ring-[rgb(var(--ring))]" required />
                        </div>
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-[rgb(var(--card-foreground))]">{t.phoneLabel}</label>
                            <input type="tel" name="phone" id="phone" value={formData.phone} onChange={handleInputChange} className="mt-1 block w-full p-2 border border-[rgb(var(--border))] rounded-md bg-[rgb(var(--background))] focus:ring-2 focus:ring-[rgb(var(--ring))]" required />
                        </div>
                    </div>
                     <div>
                        <label htmlFor="address" className="block text-sm font-medium text-[rgb(var(--card-foreground))]">{t.addressLabel}</label>
                        <textarea name="address" id="address" value={formData.address} onChange={handleInputChange} rows={3} placeholder={t.addressPlaceholder} className="mt-1 block w-full p-2 border border-[rgb(var(--border))] rounded-md bg-[rgb(var(--background))] focus:ring-2 focus:ring-[rgb(var(--ring))]" required />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-[rgb(var(--card-foreground))]">{t.emailLabel}</label>
                            <input type="email" name="email" id="email" value={formData.email} onChange={handleInputChange} placeholder={t.emailPlaceholder} className="mt-1 block w-full p-2 border border-[rgb(var(--border))] rounded-md bg-[rgb(var(--background))] focus:ring-2 focus:ring-[rgb(var(--ring))]" required />
                        </div>
                        <div>
                            <label htmlFor="caseType" className="block text-sm font-medium text-[rgb(var(--card-foreground))]">{t.caseTypeLabel}</label>
                            <select name="caseType" id="caseType" value={formData.caseType} onChange={handleInputChange} className="mt-1 block w-full p-2 border border-[rgb(var(--border))] rounded-md bg-[rgb(var(--background))] focus:ring-2 focus:ring-[rgb(var(--ring))]" required>
                                <option value="">{t.caseTypeDefault}</option>
                                {Object.entries(t.caseTypes).map(([key, value]) => (
                                    <option key={key} value={key}>{value}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div>
                        <button type="submit" className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-[rgb(var(--primary))] to-[rgb(var(--accent))] text-[rgb(var(--primary-foreground))] font-semibold rounded-md hover:opacity-90 disabled:opacity-50 transition-all duration-300 transform hover:scale-105 shadow-md">
                            {t.submitButton}
                        </button>
                    </div>
                </form>

                {formSubmitted && (
                    <div className="mt-8 pt-6 border-t border-[rgb(var(--border))]">
                        <h2 className="text-2xl font-semibold text-[rgb(var(--card-foreground))]">{t.formSubmittedTitle}</h2>
                        <p className="text-[rgb(var(--muted-foreground))] mt-2 mb-4">{t.formSubmittedDescription}</p>
                        
                        <div className="space-y-3">
                            {linksToShow.length > 0 ? (
                                linksToShow.map(link => (
                                    <a
                                        key={link.name}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-between p-4 bg-[rgb(var(--muted))] rounded-lg border border-[rgb(var(--border))] hover:border-[rgb(var(--primary))] transition-colors"
                                    >
                                        <span className="font-semibold text-[rgb(var(--primary))]">{link.name}</span>
                                        <ExternalLinkIcon className="w-5 h-5 text-[rgb(var(--muted-foreground))]" />
                                    </a>
                                ))
                            ) : (
                                <p className="text-center text-[rgb(var(--muted-foreground))] p-4 bg-[rgb(var(--muted))] rounded-lg">{t.noLinks}</p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};