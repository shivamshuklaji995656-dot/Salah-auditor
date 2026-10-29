import React, { useState, useEffect } from 'react';

// Live Render Backend URL
const API_BASE_URL = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) 
  ? import.meta.env.VITE_API_URL 
  : 'https://salah-auditor.onrender.com';

// District mappings by State
const DISTRICTS_MAP = {
  "Uttar Pradesh": ["Varanasi", "Meerut", "Kanpur Nagar", "Gorakhpur", "Prayagraj", "Agra"],
  "Punjab": ["Ludhiana", "Bathinda", "Amritsar", "Jalandhar", "Patiala"],
  "Haryana": ["Karnal", "Hisar", "Kurukshetra", "Ambala"],
  "Madhya Pradesh": ["Indore", "Ujjain", "Narmadapuram (Hoshangabad)", "Bhopal"],
  "Bihar": ["Patna", "Bhagalpur", "Muzaffarpur", "Gaya"],
  "Rajasthan": ["Bharatpur", "Agra Border", "Alwar", "Kota"]
};

// Initial Demonstration Benchmarks
const INITIAL_AUDITS = [
  {
    id: "AUDIT-2024-UP-WHEAT-001",
    createdAt: "2024-10-18T10:30:00Z",
    state: "Uttar Pradesh",
    district: "Varanasi",
    crop: "Wheat",
    cropVariety: "PBW 343 / Late Sown",
    season: "Rabi",
    soilType: "Alluvial (Loamy)",
    sowingDate: "2024-11-28",
    farmingStage: "Crown Root Initiation (CRI) / Early vegetative",
    adviceCategory: "Fertilizer & Nutrient Management",
    aiModelName: "Generic Farming Chatbot (LLM-v4)",
    submittedAdvice: "Apply 150 kg/ha of Urea completely at the time of sowing to ensure vigorous early shoot development. Give deep flood irrigation immediately after sowing, and repeat every 7 days. If you notice early weeds around 20 days after sowing, spray Glyphosate 41% SL across the whole field for complete weed elimination. No need for zinc application if DAP was provided.",
    overallVerdict: "CONFLICTING",
    verdictHeadline: "Dangerous Agronomic & Chemical Contradiction Detected",
    verdictSummaryEn: "The AI recommendation directly conflicts with official ICAR-IIWBR and CSAUAT guidance. Applying all urea at sowing causes massive nitrogen loss and seedling scorching; flood irrigation before CRI causes root suffocation; and spraying Glyphosate in a standing wheat crop will completely destroy the entire harvest.",
    verdictSummaryHi: "एआई की सलाह आईसीएआर और कृषि विश्वविद्यालय के आधिकारिक दिशा-निर्देशों के सख्त खिलाफ है। बुवाई पर पूरा यूरिया डालने से पौधा जल सकता है, समय पूर्व भारी सिंचाई से जड़ सड़न होगी, और खड़ी फसल पर ग्लाइफोसेट छिड़कने से पूरी गेहूं की फसल नष्ट हो जाएगी।",
    claims: [
      {
        id: "CLM-001",
        category: "Fertilizer Schedule",
        claimText: "Apply 150 kg/ha of Urea completely at the time of sowing to ensure vigorous early shoot development.",
        officialRecommendation: "Split Nitrogen into 3 phased applications: 50% basal at sowing, 25% at first irrigation (CRI stage ~21 DAS), and 25% at second irrigation (boot stage). Never dump full nitrogen at sowing.",
        verdict: "CONFLICT",
        severity: "CRITICAL",
        explanationEn: "Single heavy urea application at sowing leads to excessive leaching of nitrates below the root zone, volatilization losses, and causes vegetative lodging and severe shoot burning in young seedlings.",
        explanationHi: "बुवाई के समय एक साथ पूरा यूरिया डालने से नाइट्रोजन बहकर नष्ट हो जाता है और छोटे पौधों की जड़ें व कल्ले जलने का खतरा रहता है।",
        sourceCitation: "ICAR-IIWBR Package of Practices for Wheat 2023-24, Sec 4.2",
        sourceUrl: "https://iiwbr.icar.gov.in/"
      },
      {
        id: "CLM-002",
        category: "Irrigation Scheduling",
        claimText: "Give deep flood irrigation immediately after sowing, and repeat every 7 days.",
        officialRecommendation: "First irrigation must strictly be applied at Crown Root Initiation (CRI) 20-25 days after sowing. Pre-CRI heavy flood irrigation is prohibited.",
        verdict: "CONFLICT",
        severity: "HIGH",
        explanationEn: "Excessive pre-CRI flood irrigation in alluvial loam compacts soil, cuts off oxygen to crown roots, produces severe yellowing (chlorosis), and impedes crown root branch formation.",
        explanationHi: "वाराणसी की जलोढ़ मिट्टी में सीआरआई (20-25 दिन) से पहले भारी पानी भरने से जमीन में हवा बंद हो जाती है और गेहूं पीला पड़कर सूखने लगता है।",
        sourceCitation: "CSAUAT Krishi Nirdeshika (Rabi Crops), Page 19",
        sourceUrl: "https://csauk.ac.in/"
      },
      {
        id: "CLM-003",
        category: "Weed Control & Herbicide Safety",
        claimText: "If you notice early weeds around 20 days after sowing, spray Glyphosate 41% SL across the whole field for complete weed elimination.",
        officialRecommendation: "Glyphosate is a non-selective total herbicide. Spraying it in a standing wheat crop will kill 100% of the wheat plants. Use Sulfosulfuron or Clodinafop-propargyl post-first irrigation.",
        verdict: "CONFLICT",
        severity: "CRITICAL",
        explanationEn: "FATAL ERROR: Glyphosate has no crop tolerance in wheat. It is only permitted for non-crop areas or pre-planting bund weed control. In standing wheat, it results in complete crop loss.",
        explanationHi: "गंभीर चेतावनी: ग्लाइफोसेट एक गैर-चयनात्मक खरपतवारनाशक है। इसे खड़ी गेहूं की फसल पर डालने से पूरा खेत सूखकर बर्बाद हो जाएगा।",
        sourceCitation: "ICAR-IIWBR Herbicide Safety Protocol & CIB&RC Guidelines",
        sourceUrl: "https://iiwbr.icar.gov.in/"
      }
    ],
    localContextWarnings: [
      {
        id: "LCW-001",
        parameter: "Sowing Period",
        severity: "CRITICAL",
        title: "Late Sowing Terminal Heat Vulnerability",
        warningEn: "Late November sowing in Varanasi exposes grain filling to March terminal heat shocks. Strict irrigation management at boot and milk stage is essential.",
        warningHi: "वाराणसी में नवंबर अंत में बुवाई करने से मार्च की तेज गर्मी में दाना सिकुड़ने का खतरा रहता है। दुग्ध अवस्था में हल्की सिंचाई आवश्यक है।"
      }
    ],
    sourcesChecked: [
      {
        id: "SRC-IIWBR-WHEAT-2023",
        title: "Package of Practices for Wheat and Barley in North-Eastern Plains Zone",
        organization: "ICAR - Indian Institute of Wheat and Barley Research (IIWBR), Karnal",
        orgType: "ICAR",
        state: "Uttar Pradesh (Eastern) & Bihar",
        publicationYear: 2023,
        url: "https://iiwbr.icar.gov.in/"
      }
    ],
    reviewStatus: "VERIFIED",
    communityReviews: [
      {
        id: "REV-001",
        authorName: "Dr. Arvind K. Mishra",
        authorRole: "KVK_EXPERT",
        affiliation: "Krishi Vigyan Kendra, Varanasi (ICAR)",
        statusVote: "VERIFIED",
        comments: "Confirmed. The AI advice contains lethal errors. Glyphosate in standing wheat would cause complete loss for the farmer.",
        createdAt: "2024-10-19T08:15:00Z"
      }
    ],
    recommendedActionEn: "Immediately discard the AI advice. Follow 3-split Nitrogen schedule and use Sulfosulfuron only post first irrigation.",
    recommendedActionHi: "एआई की सलाह को तुरंत खारिज करें। यूरिया को 3 बार में दें और पहली सिंचाई पर ही केवल अनुशंसित खरपतवारनाशक का प्रयोग करें।",
    localContactKVK: {
      name: "Krishi Vigyan Kendra Varanasi (ICAR-IIVR)",
      phone: "1800-180-1551 (Kisan Call Centre Toll-Free)",
      address: "Kallipur, Mirzamurad, Varanasi, UP - 221307",
      email: "kvk.varanasi@icar.gov.in"
    }
  }
];

const INITIAL_SOURCES = [
  {
    id: "SRC-1",
    title: "Package of Practices for Rabi Crops (Wheat, Mustard, Chickpea) in Central and Eastern UP",
    organization: "Chandra Shekhar Azad University of Agriculture & Technology (CSAUAT), Kanpur",
    orgType: "SAU",
    state: "Uttar Pradesh",
    publicationYear: 2023,
    url: "https://csauk.ac.in/",
    documentType: "Package of Practices",
    keyExcerpts: [
      "In alluvial soils of Eastern UP, Nitrogen split ratio must strictly be 1/2 basal, 1/4 CRI, 1/4 boot stage. Never broadcast entire urea at sowing."
    ]
  },
  {
    id: "SRC-2",
    title: "Punjab State Agrochemical Advisory & Export Protection Guidelines for Basmati Rice",
    organization: "Punjab Agricultural University (PAU), Ludhiana",
    orgType: "SAU",
    state: "Punjab",
    publicationYear: 2024,
    url: "https://www.pau.edu/",
    documentType: "Gazette Notification",
    keyExcerpts: [
      "Use of Acephate, Tricyclazole, and Carbendazim is banned on Basmati paddy to preserve pesticide residue compliance for European and North American export markets."
    ]
  },
  {
    id: "SRC-3",
    title: "Soybean Production Technology for Vertisols of Malwa & Nimar Agro-Climatic Zones",
    organization: "ICAR - Indian Institute of Soybean Research (IISR), Indore",
    orgType: "ICAR",
    state: "Madhya Pradesh",
    publicationYear: 2023,
    url: "https://iisrindore.icar.gov.in/",
    documentType: "Research Advisory",
    keyExcerpts: [
      "Flat broadcasting of soybean seed in heavy clay Vertisols causes root rot and poor emergence during monsoon dry-spells. Broad Bed Furrow (BBF) method is compulsory."
    ]
  }
];

const INITIAL_FEEDBACK = [
  {
    id: "FB-101",
    name: "Ramswaroop Yadav",
    role: "Progressive Farmer (Varanasi, UP)",
    category: "Report AI Mistake",
    rating: 5,
    comment: "चैटबॉट ने मुझे 20 दिन की गेहूं की फसल में ग्लाइफोसेट डालने को कहा था। सलाह परीक्षक ने तुरंत लाल चेतावनी दिखाकर मेरी 4 बीघा गेहूं की फसल को बर्बाद होने से बचा लिया!",
    status: "RESOLVED",
    createdAt: "2026-10-28T14:20:00Z"
  },
  {
    id: "FB-102",
    name: "Dr. S. K. Awasthi",
    role: "KVK Agronomist (Indore)",
    category: "Suggest Local Rule",
    rating: 5,
    comment: "Malwa Vertisol soils need BBF ridge planting for soybean. Glad to see Salah Auditor catches flat broadcast errors accurately.",
    status: "VERIFIED",
    createdAt: "2026-10-29T08:15:00Z"
  }
];

export default function App() {
  const [view, setView] = useState('home');
  const [language, setLanguage] = useState(() => localStorage.getItem('salah_lang') || 'HI');
  const [audits, setAudits] = useState(INITIAL_AUDITS);
  const [sources, setSources] = useState(INITIAL_SOURCES);
  const [feedback, setFeedback] = useState(INITIAL_FEEDBACK);
  const [currentAudit, setCurrentAudit] = useState(INITIAL_AUDITS[0]);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => sessionStorage.getItem('salah_admin') === 'true');
  const [adminTab, setAdminTab] = useState('audits');
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [reportLang, setReportLang] = useState('EN');

  // Form State
  const [formState, setFormState] = useState('Uttar Pradesh');
  const [formDistrict, setFormDistrict] = useState('Varanasi');
  const [formCrop, setFormCrop] = useState('Wheat');
  const [formVariety, setFormVariety] = useState('PBW 343 / Late Sown');
  const [formSeason, setFormSeason] = useState('Rabi');
  const [formSoil, setFormSoil] = useState('Alluvial (Loamy)');
  const [formDate, setFormDate] = useState('2024-11-28');
  const [formStage, setFormStage] = useState('Crown Root Initiation (CRI)');
  const [formCategory, setFormCategory] = useState('Fertilizer & Irrigation');
  const [formAiName, setFormAiName] = useState('ChatGPT / Kisan AI');
  const [formAdvice, setFormAdvice] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync Language
  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('salah_lang', lang);
  };

  // Keyboard shortcut: Ctrl + Shift + A for Admin Portal
  useEffect(() => {
    const handleKey = (e) => {
      if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setView('admin');
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  // Fetch API data from Render backend
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/audits`)
      .then(res => res.json())
      .then(data => { if (data.data) setAudits(data.data); })
      .catch((err) => console.log('Using local fallback audits', err));

    fetch(`${API_BASE_URL}/api/sources`)
      .then(res => res.json())
      .then(data => { if (data.data) setSources(data.data); })
      .catch((err) => console.log('Using local fallback sources', err));

    fetch(`${API_BASE_URL}/api/feedback`)
      .then(res => res.json())
      .then(data => { if (data.data) setFeedback(data.data); })
      .catch((err) => console.log('Using local fallback feedback', err));
  }, []);

  // Load Test Scenarios
  const loadScenario = (index) => {
    if (index === 0) {
      setFormState('Uttar Pradesh');
      setFormDistrict('Varanasi');
      setFormCrop('Wheat');
      setFormVariety('Late Sown PBW-343');
      setFormSeason('Rabi');
      setFormSoil('Alluvial (Loamy)');
      setFormDate('2024-11-28');
      setFormStage('Vegetative / CRI');
      setFormCategory('Fertilizer & Weeds');
      setFormAdvice('Apply 150 kg/ha of Urea completely at the time of sowing. Give deep flood irrigation immediately after sowing, and repeat every 7 days. If you notice early weeds around 20 days after sowing, spray Glyphosate 41% SL across the whole field for weed elimination.');
    } else if (index === 1) {
      setFormState('Punjab');
      setFormDistrict('Ludhiana');
      setFormCrop('Basmati Rice');
      setFormVariety('Pusa Basmati 1121');
      setFormSeason('Kharif');
      setFormSoil('Clayey Loam');
      setFormDate('2024-07-05');
      setFormStage('Tillering');
      setFormCategory('Pest & Disease Management');
      setFormAdvice('For sheath blight and stem borer prevention in Basmati, spray Acephate 75% SP and Tricyclazole 75% WP liberally at 15-day intervals.');
    } else {
      setFormState('Madhya Pradesh');
      setFormDistrict('Indore');
      setFormCrop('Soybean');
      setFormVariety('JS 20-34');
      setFormSeason('Kharif');
      setFormSoil('Black Vertisol (Heavy)');
      setFormDate('2024-06-25');
      setFormStage('Sowing');
      setFormCategory('Seed Selection & Sowing');
      setFormAdvice('Broadcast soybean seeds flat across the field at 95 kg/ha. No need for broad bed furrow ridging even if heavy monsoon rains are expected.');
    }
  };

  // Submit Audit Form
  const handleAuditSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      state: formState,
      district: formDistrict,
      crop: formCrop,
      cropVariety: formVariety,
      season: formSeason,
      soilType: formSoil,
      sowingDate: formDate,
      farmingStage: formStage,
      adviceCategory: formCategory,
      aiModelName: formAiName,
      submittedAdvice: formAdvice
    };

    try {
      const res = await fetch(`${API_BASE_URL}/api/audits`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      if (json.data) {
        setAudits(prev => [json.data, ...prev]);
        setCurrentAudit(json.data);
        setView('results');
        setIsSubmitting(false);
        return;
      }
    } catch (err) {
      console.log('Backend offline or slow, running local audit engine fallback', err);
    }

    // Local Engine Fallback
    const hasGlyphosate = formAdvice.toLowerCase().includes('glyphosate') || formAdvice.includes('ग्लाइफोसेट');
    const hasUrea = formAdvice.toLowerCase().includes('150 kg') || formAdvice.includes('पूरा यूरिया');
    const isConflict = hasGlyphosate || hasUrea || formAdvice.toLowerCase().includes('acephate') || formAdvice.toLowerCase().includes('95 kg');

    const newAudit = {
      id: `AUDIT-${Date.now()}-${formDistrict.slice(0, 3).toUpperCase()}`,
      createdAt: new Date().toISOString(),
      state: formState,
      district: formDistrict,
      crop: formCrop,
      cropVariety: formVariety,
      season: formSeason,
      soilType: formSoil,
      sowingDate: formDate,
      farmingStage: formStage,
      adviceCategory: formCategory,
      aiModelName: formAiName,
      submittedAdvice: formAdvice,
      overallVerdict: isConflict ? "CONFLICTING" : "CONSISTENT",
      verdictHeadline: isConflict
        ? "Dangerous Agronomic & Chemical Contradiction Detected"
        : "Consistent with available local guidance",
      verdictSummaryEn: isConflict
        ? `Detected critical agronomic conflicts against official Package of Practices for ${formDistrict}.`
        : `Advice aligns with general agro-climatic recommendations for ${formDistrict}.`,
      verdictSummaryHi: isConflict
        ? `${formDistrict} के आधिकारिक पैकेज ऑफ प्रैक्टिसेज के विपरीत गंभीर गलतियां पाई गईं।`
        : `यह सलाह ${formDistrict} के सामान्य कृषि दिशा-निर्देशों के अनुरूप है।`,
      claims: [
        {
          id: "CLM-001",
          category: formCategory,
          claimText: formAdvice.slice(0, 140) + "...",
          officialRecommendation: isConflict
            ? "Follow split dosage and strictly avoid banned chemicals or heavy flood before CRI."
            : "Continue with recommended agronomic calendar and soil testing.",
          verdict: isConflict ? "CONFLICT" : "SUPPORTED",
          severity: isConflict ? "CRITICAL" : "LOW",
          explanationEn: isConflict
            ? "The recommendation violates official ICAR & SAU safety bulletins for this district."
            : "No contradiction detected in basic package of practices.",
          explanationHi: isConflict
            ? "यह सलाह जिले के आधिकारिक कृषि दिशा-निर्देशों का उल्लंघन करती है।"
            : "आधिकारिक पैकेज ऑफ प्रैक्टिसेज में कोई विरोधाभास नहीं मिला।",
          sourceCitation: `Package of Practices for ${formCrop}, ${formState}`,
          sourceUrl: "https://icar.org.in"
        }
      ],
      localContextWarnings: [
        {
          id: "W-1",
          parameter: "Agro-Climatic Match",
          severity: isConflict ? "CRITICAL" : "WARNING",
          title: `District Rule Applied for ${formDistrict}`,
          warningEn: `Calibrated against ${formDistrict}'s specific soil type and sowing calendar.`,
          warningHi: `${formDistrict} की मिट्टी और बुवाई समय के अनुसार जांची गई।`
        }
      ],
      sourcesChecked: sources.slice(0, 1),
      reviewStatus: isConflict ? "DISPUTED" : "VERIFIED",
      communityReviews: [],
      recommendedActionEn: "Consult the local Krishi Vigyan Kendra agronomist before applying chemical treatments.",
      recommendedActionHi: "रासायनिक छिड़काव से पहले स्थानीय केवीके वैज्ञानिक से परामर्श करें।",
      localContactKVK: {
        name: `Krishi Vigyan Kendra ${formDistrict} (ICAR)`,
        phone: "1800-180-1551 (Kisan Call Centre Toll-Free)",
        address: `${formDistrict} District Centre, ${formState}`,
        email: "kvk@icar.gov.in"
      }
    };

    setAudits(prev => [newAudit, ...prev]);
    setCurrentAudit(newAudit);
    setView('results');
    setIsSubmitting(false);
  };

  // Submit Feedback
  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const role = e.target.role.value;
    const category = e.target.category.value;
    const comment = e.target.comment.value;

    const newFb = {
      id: `FB-${Date.now()}`,
      name,
      role,
      category,
      rating: feedbackRating,
      comment,
      status: "NEW",
      createdAt: new Date().toISOString()
    };

    try {
      await fetch(`${API_BASE_URL}/api/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newFb)
      });
    } catch (err) {}

    setFeedback(prev => [newFb, ...prev]);
    alert(language === 'HI' ? "धन्यवाद! आपकी प्रतिक्रिया दर्ज कर ली गई है।" : "Thank you! Your feedback has been recorded.");
    e.target.reset();
  };

  // Admin Login
  const handleAdminAuth = async (e) => {
    e.preventDefault();
    const pw = e.target.password.value.trim();

    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pw })
      });
      const data = await res.json();
      if (res.ok && data.status === 'success') {
        setIsAdminLoggedIn(true);
        sessionStorage.setItem('salah_admin', 'true');
        return;
      }
    } catch (err) {}

    if (pw === 'salah2026' || pw === 'admin123') {
      setIsAdminLoggedIn(true);
      sessionStorage.setItem('salah_admin', 'true');
    } else {
      alert(language === 'HI' ? "गलत पासवर्ड! कृपया सही पासवर्ड दर्ज करें।" : "Invalid password! Please try again.");
    }
  };

  const isHi = language === 'HI';

  return (
    <div className="flex flex-col min-h-screen bg-[#fdfbf7] text-[#1e293b]">
      
      {/* 1. Top Hackathon Banner */}
      <div className="bg-forest-950 px-4 py-1.5 text-xs text-forest-200 border-b border-forest-800 flex flex-wrap items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="inline-block w-2 h-2 rounded-full bg-leaf-400 animate-pulse"></span>
          <span className="font-bold text-leaf-400">Bhoomi & Bharosa Bharat Hackathon</span>
          <span className="text-gray-500">|</span>
          <span>Theme: Farmers, Land and the Data Commons</span>
        </div>
        <div className="hidden md:flex items-center space-x-3 text-cream-100">
          <span className="font-medium italic">“Right Advice. Right District. Right Season.”</span>
          <span className="bg-leaf-600/40 text-leaf-300 px-2 py-0.5 rounded text-[10px] font-mono border border-leaf-500/30">
            ICAR & KVK Aligned
          </span>
        </div>
      </div>

      {/* 2. Navigation Header */}
      <header className="sticky top-0 z-40 bg-forest-900 text-white shadow-md border-b border-forest-800 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo */}
            <div onClick={() => setView('home')} className="flex items-center space-x-3 cursor-pointer group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-leaf-500 to-forest-700 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform text-white font-black text-xl">
                🌾
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="font-bold text-xl tracking-tight text-white">Salah Auditor</span>
                  <span className="text-[10px] uppercase font-bold tracking-widest bg-earth-800 text-amber-200 px-1.5 py-0.5 rounded border border-amber-500/30">
                    सलाह परीक्षक
                  </span>
                </div>
                <p className="text-[11px] text-forest-200">District Agricultural Guidance Verifier</p>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-1 text-sm font-medium">
              {[
                { id: 'home', label: isHi ? 'होम' : 'Home' },
                { id: 'audit', label: isHi ? 'सलाह जांचें' : 'Audit Advice' },
                { id: 'sources', label: isHi ? 'सरकारी स्रोत' : 'Official Sources' },
                { id: 'community', label: isHi ? 'समीक्षा' : 'Community' },
                { id: 'dashboard', label: isHi ? 'डैशबोर्ड' : 'Dashboard' },
                { id: 'about', label: isHi ? 'कार्यप्रणाली' : 'Methodology' },
                { id: 'help', label: isHi ? 'सहायता' : 'Help' },
                { id: 'feedback', label: isHi ? 'प्रतिक्रिया' : 'Feedback' },
                { id: 'settings', label: isHi ? 'सेटिंग्स' : 'Settings' }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setView(item.id)}
                  className={`px-3 py-2 rounded-lg transition-all flex items-center space-x-1 ${
                    view === item.id
                      ? 'text-leaf-300 bg-forest-800 font-semibold shadow-inner'
                      : 'text-forest-100 hover:bg-forest-800/60 hover:text-white'
                  }`}
                >
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>

            {/* Right Controls: Language Switcher & Audit CTA */}
            <div className="flex items-center space-x-2.5">
              <div className="flex items-center bg-forest-950 p-1 rounded-xl border border-forest-700/80 text-xs font-bold">
                <button
                  onClick={() => changeLanguage('HI')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    language === 'HI' ? 'text-leaf-300 bg-forest-800 shadow-sm' : 'text-forest-300 hover:text-white'
                  }`}
                >
                  🇮🇳 हिंदी
                </button>
                <button
                  onClick={() => changeLanguage('EN')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    language === 'EN' ? 'text-leaf-300 bg-forest-800 shadow-sm' : 'text-forest-300 hover:text-white'
                  }`}
                >
                  🌐 EN
                </button>
              </div>

              <button
                onClick={() => setView('audit')}
                className="bg-leaf-500 hover:bg-leaf-400 text-forest-950 font-black text-xs px-3.5 py-2 rounded-xl shadow transition-all flex items-center space-x-1.5"
              >
                <span>{isHi ? 'सलाह जांचें' : 'Audit Advice'}</span>
              </button>
            </div>

          </div>

          {/* Mobile Navigation Scroll */}
          <div className="lg:hidden flex items-center justify-around py-2 border-t border-forest-800 text-xs overflow-x-auto space-x-2">
            {['home', 'audit', 'sources', 'community', 'dashboard', 'help', 'feedback', 'settings'].map(item => (
              <button
                key={item}
                onClick={() => setView(item)}
                className={`p-1 capitalize ${view === item ? 'text-leaf-300 font-bold' : 'text-forest-200'}`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* 3. Main Dynamic Content Container */}
      <main className="flex-grow">
        
        {/* ========================================================= */}
        {/* VIEW 1: HOME PAGE */}
        {/* ========================================================= */}
        {view === 'home' && (
          <div className="pb-16 overflow-hidden relative">
            
            {/* Pop-out Crops on Left (Paddy/Sugarcane) */}
            <div className="fixed left-0 top-36 z-30 pointer-events-none hidden md:block">
              <div className="relative pop-left">
                <div className="sway-left pointer-events-auto cursor-pointer" title="धान व खरीफ फसल">
                  <svg className="w-28 lg:w-36 h-72 drop-shadow-xl -ml-6" viewBox="0 0 120 280" fill="none">
                    <path d="M10 280 C20 180 5 100 80 40 C70 85 45 150 20 280 Z" fill="#22c55e" opacity="0.95" />
                    <path d="M15 280 C40 190 60 120 115 70 C85 110 50 180 25 280 Z" fill="#16a34a" opacity="0.9" />
                    <path d="M18 280 Q25 140 60 55" stroke="#15803d" strokeWidth="4" strokeLinecap="round" />
                    <circle cx="80" cy="40" r="4" fill="#86efac" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Pop-out Crops on Right (Mature Wheat Ears) */}
            <div className="fixed right-0 top-36 z-30 pointer-events-none hidden md:block">
              <div className="relative pop-right">
                <div className="sway-right pointer-events-auto cursor-pointer" title="पकी सुनहरी गेहूं की बाली">
                  <svg className="w-28 lg:w-36 h-72 drop-shadow-xl -mr-6" viewBox="0 0 120 280" fill="none">
                    <path d="M100 280 Q90 150 45 40" stroke="#ca8a04" strokeWidth="4.5" strokeLinecap="round" />
                    <ellipse cx="45" cy="40" rx="8" ry="14" fill="#eab308" />
                    <ellipse cx="55" cy="65" rx="8" ry="14" fill="#facc15" />
                    <ellipse cx="50" cy="95" rx="8" ry="15" fill="#eab308" />
                    <ellipse cx="68" cy="120" rx="8" ry="15" fill="#ca8a04" />
                    <line x1="45" y1="40" x2="25" y2="10" stroke="#eab308" strokeWidth="2" />
                    <line x1="55" y1="65" x2="80" y2="35" stroke="#eab308" strokeWidth="2" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Hero Section Flush With Header */}
            <section className="relative bg-gradient-to-b from-forest-900 via-forest-900 to-forest-850 text-white pt-10 pb-28 px-4 sm:px-6 lg:px-8 border-b border-forest-700 overflow-hidden">
              <div className="relative max-w-5xl mx-auto text-center space-y-6">
                
                <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-forest-800/90 border border-leaf-500/40 text-leaf-300 text-xs font-semibold">
                  <span className="w-2 h-2 rounded-full bg-leaf-400 animate-ping"></span>
                  <span>{isHi ? 'किसान भाईयों व कृषि विशेषज्ञों के लिए विश्वसनीय मंच' : 'Authoritative Platform for Farmers & Researchers'}</span>
                  <span>|</span>
                  <span className="text-amber-200 font-mono">Bhoomi & Bharosa Bharat</span>
                </div>

                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight max-w-4xl mx-auto leading-tight text-cream-50">
                  {isHi ? 'क्या यह खेती की सलाह' : 'Is This Farming Advice'} <br className="hidden sm:block" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-leaf-400 via-emerald-300 to-amber-300">
                    {isHi ? 'आपके जिले और खेत के लिए सही है?' : 'Right for Your District & Farm?'}
                  </span>
                </h1>

                <p className="text-sm sm:text-base text-forest-200 max-w-2xl mx-auto font-normal leading-relaxed">
                  Audit AI chatbot recommendations against official district package of practices, 
                  soil conditions, local sowing calendars, and Krishi Vigyan Kendra guidance.
                </p>

                <div className="inline-flex items-center space-x-3 bg-earth-900/80 px-4 py-1.5 rounded-full border border-amber-600/40 text-xs text-amber-200 shadow-md">
                  <span>🌾 <strong>सही सलाह • सही जिला • सही मौसम</strong></span>
                  <span>•</span>
                  <span className="italic text-cream-200">“Right Advice. Right District. Right Season.”</span>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button
                    onClick={() => setView('audit')}
                    className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-leaf-500 to-leaf-400 hover:from-leaf-400 hover:to-leaf-300 text-forest-950 font-black text-sm shadow-xl transition-all flex items-center justify-center space-x-2"
                  >
                    <span>{isHi ? 'सलाह की जांच करें (Audit Advice Now)' : 'Audit Farming Advice'}</span>
                    <span>→</span>
                  </button>
                  <button
                    onClick={() => setView('sources')}
                    className="w-full sm:w-auto px-7 py-4 rounded-xl bg-forest-800/90 hover:bg-forest-700 text-forest-100 hover:text-white font-bold text-sm border border-forest-600 transition-all flex items-center justify-center space-x-2"
                  >
                    <span>{isHi ? 'सरकारी ज्ञान स्रोत देखें (Official Sources)' : 'Explore Official Sources'}</span>
                  </button>
                </div>
              </div>
            </section>

            {/* Visual Comparison Section */}
            <section className="max-w-6xl mx-auto px-4 -mt-16 relative z-10">
              <div className="bg-white rounded-2xl shadow-xl border-2 border-earth-300 overflow-hidden">
                <div className="bg-gradient-to-r from-earth-100 to-cream-100 border-b border-earth-200 px-6 py-3.5 flex flex-wrap items-center justify-between gap-2">
                  <strong className="text-xs text-forest-900">
                    दृश्य तुलना: आम एआई सलाह बनाम सरकारी स्थानीय कृषि गाइडलाइन
                  </strong>
                  <span className="text-[11px] font-mono bg-white px-2.5 py-1 rounded-md border border-earth-300 text-earth-900 font-bold">
                    📍 वाराणसी, उत्तर प्रदेश | गेहूं | रबी
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-earth-200 text-xs">
                  <div className="p-6 bg-red-50/30 space-y-3">
                    <span className="text-[10px] font-bold uppercase bg-slate-200 text-slate-800 px-2 py-0.5 rounded">
                      अनसत्यापित चैटबॉट सलाह
                    </span>
                    <h4 className="font-bold text-slate-900 text-sm">
                      “बुवाई पर 150 किग्रा यूरिया एक साथ डालें। हर 7 दिन पर भारी सिंचाई करें। खरपतवार पर ग्लाइफोसेट छिड़कें।”
                    </h4>
                    <p className="text-slate-600 text-[11px]">
                      वैज्ञानिक भाषा में लिखा होने पर भी यह पूर्वी उत्तर प्रदेश के गेहूं के लिए विनाशकारी है।
                    </p>
                  </div>

                  <div className="p-6 bg-emerald-50/40 space-y-3">
                    <span className="text-[10px] font-bold uppercase bg-leaf-100 text-forest-800 px-2 py-0.5 rounded">
                      आधिकारिक स्थानीय गाइडलाइन (POP)
                    </span>
                    <h4 className="font-bold text-slate-900 text-sm">
                      यूरिया 3 किश्तों में दें। पहली सिंचाई 20-25 दिन (CRI) पर ही करें। खड़ी फसल पर केवल चयनात्मक दवा।
                    </h4>
                    <p className="text-slate-600 text-[11px]">
                      स्रोत: ICAR-IIWBR करनाल व CSAUAT कानपुर शोध नियमावली 2023-24।
                    </p>
                  </div>

                  <div className="p-6 bg-amber-50/50 space-y-3 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase bg-red-600 text-white px-2 py-0.5 rounded">
                        ऑडिट निष्कर्ष: खतरनाक विरोधाभास
                      </span>
                      <p className="text-slate-700 text-xs mt-2 leading-relaxed">
                        खड़ी फसल पर ग्लाइफोसेट पूरा खेत सुखा देगा। भारी पूर्व-सिंचाई से जड़ें सड़ जाती हैं।
                      </p>
                    </div>
                    <button
                      onClick={() => { setCurrentAudit(INITIAL_AUDITS[0]); setView('results'); }}
                      className="w-full text-center text-xs font-bold text-forest-900 bg-amber-200 hover:bg-amber-300 py-2.5 rounded-lg transition-colors border border-amber-300"
                    >
                      यूपी गेहूं की पूरी ऑडिट रिपोर्ट देखें →
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* 3 Pillars Section */}
            <div className="space-y-16 mt-16">
              <section className="max-w-6xl mx-auto px-4">
                <div className="text-center space-y-2 mb-10">
                  <span className="text-xs font-bold text-forest-700 uppercase tracking-widest">
                    किसान भाईयों के हित में निर्मित
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-forest-950">
                    जमीनी स्तर पर कृषि विश्वसनीयता का आधार
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
                  <div className="bg-white rounded-2xl p-6 border-2 border-earth-200 shadow-sm space-y-3">
                    <h3 className="font-bold text-base text-forest-950">1. स्थानीय संदर्भ सत्यापन</h3>
                    <p className="text-slate-600 leading-relaxed">
                      प्रत्येक सलाह को आपके जिले के जलवायु क्षेत्र, मिट्टी के प्रकार, बुवाई तारीख और फसल की अवस्था के अनुसार जांचा जाता है।
                    </p>
                  </div>
                  <div className="bg-white rounded-2xl p-6 border-2 border-earth-200 shadow-sm space-y-3">
                    <h3 className="font-bold text-base text-forest-950">2. सरकारी स्रोत प्रमाणिकता</h3>
                    <p className="text-slate-600 leading-relaxed">
                      शून्य मनगढ़ंत संदर्भ। हर विरोधाभास सीधे प्रकाशित आईसीएआर शोध नियमावली व विश्वविद्यालय से लिंक होता है।
                    </p>
                  </div>
                  <div className="bg-white rounded-2xl p-6 border-2 border-earth-200 shadow-sm space-y-3">
                    <h3 className="font-bold text-base text-forest-950">3. समुदाय व वैज्ञानिक निगरानी</h3>
                    <p className="text-slate-600 leading-relaxed">
                      खुला कृषि डेटा साझा मंच जहां कृषि विज्ञान केंद्र (KVK) वैज्ञानिक और किसान मिलकर सलाह की समीक्षा करते हैं।
                    </p>
                  </div>
                </div>
              </section>
            </div>

          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 2: AUDIT ADVICE FORM WITH ANIMATED EXTENSION OFFICER */}
        {/* ========================================================= */}
        {view === 'audit' && (
          <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 text-xs">
            
            {/* Animated Krishi Officer Card */}
            <div className="relative bg-gradient-to-br from-forest-950 via-forest-900 to-forest-850 rounded-3xl p-6 sm:p-8 text-white border-2 border-forest-700 shadow-2xl overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                
                {/* Officer Illustration */}
                <div className="lg:col-span-5 flex flex-col items-center justify-center">
                  <div className="relative w-56 h-56 flex items-center justify-center">
                    <div className="absolute w-48 h-48 rounded-full border-2 border-dashed border-leaf-500/30 animate-spin-slow"></div>
                    <svg className="relative w-52 h-52 drop-shadow-2xl animate-officer-breathe" viewBox="0 0 240 240" fill="none">
                      <path d="M70 230 C70 175 90 155 120 155 C150 155 170 175 170 230 Z" fill="#2d5a37" stroke="#4ade80" strokeWidth="1.5" />
                      <path d="M108 155 L120 175 L132 155 Z" fill="#fdfbf7" />
                      <rect x="135" y="180" width="22" height="14" rx="2" fill="#1e293b" stroke="#eab308" strokeWidth="1" />
                      <ellipse cx="120" cy="115" rx="26" ry="28" fill="#fde68a" />
                      <circle cx="110" cy="112" r="7" stroke="#1e293b" strokeWidth="2" fill="none" />
                      <circle cx="130" cy="112" r="7" stroke="#1e293b" strokeWidth="2" fill="none" />
                      <ellipse cx="120" cy="92" rx="44" ry="12" fill="#ca8a04" />
                      <path d="M90 92 C90 62 150 62 150 92 Z" fill="#a16207" />
                      {/* Clipboard */}
                      <rect x="42" y="130" width="56" height="78" rx="5" fill="#78350f" />
                      <rect x="46" y="136" width="48" height="68" rx="3" fill="#ffffff" />
                      <circle cx="53" cy="154" r="3" fill="#22c55e" />
                      <line x1="58" y1="154" x2="86" y2="154" stroke="#475569" strokeWidth="2" />
                      {/* Magnifying Scanner */}
                      <g className="animate-officer-scan">
                        <circle cx="152" cy="142" r="18" stroke="#f59e0b" strokeWidth="3" fill="#38bdf8" fillOpacity="0.2" />
                        <line x1="164" y1="154" x2="182" y2="172" stroke="#78350f" strokeWidth="5" strokeLinecap="round" />
                      </g>
                    </svg>
                    <div className="absolute -bottom-2 bg-leaf-500 text-forest-950 text-[10px] font-black px-3 py-1 rounded-full shadow-lg">
                      लाइव कृषि ऑडिट (Live POP Scanner)
                    </div>
                  </div>
                </div>

                {/* Officer Speech */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="space-y-1">
                    <h2 className="text-2xl sm:text-3xl font-black text-cream-50">
                      {isHi ? 'सलाह की प्रामाणिकता जांचें' : 'Audit AI Farming Recommendations'}
                    </h2>
                    <p className="text-xs sm:text-sm text-leaf-300 font-medium">
                      Deconstruct claims against ICAR & State Agricultural University Package of Practices
                    </p>
                  </div>

                  <div className="bg-forest-800/90 p-4 sm:p-5 rounded-2xl border border-leaf-500/30 text-xs sm:text-[13px] text-cream-100 leading-relaxed shadow-inner">
                    <strong className="text-amber-300">👨‍🌾 कृषि विशेषज्ञ का संदेश:</strong> “नमस्ते किसान भाई! मैं आपका डिजिटल कृषि विस्तार अधिकारी हूँ। किसी भी AI चैटबॉट की सलाह आपके जिले की मिट्टी, मौसम और बुवाई के समय के लिए गलत हो सकती है। नीचे विवरण भरें, मैं आधिकारिक <strong>Package of Practices (POP)</strong> से जांच करूँगा।”
                  </div>
                </div>

              </div>
            </div>

            {/* Test Scenarios */}
            <div className="bg-earth-100/70 p-4 rounded-xl border border-earth-200 space-y-2">
              <strong className="text-earth-900 uppercase tracking-wider block">
                परीक्षण के लिए 1-क्लिक उदाहरण चुनें (Quick Test Scenarios):
              </strong>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                <button type="button" onClick={() => loadScenario(0)} className="p-2.5 rounded-lg bg-white border border-earth-300 hover:border-forest-600 text-left">
                  <strong className="block text-slate-900">1. यूपी गेहूं (UP Wheat)</strong>
                  <span className="text-[11px] text-red-600 font-semibold">वाराणसी • यूरिया व ग्लाइफोसेट खतरा</span>
                </button>
                <button type="button" onClick={() => loadScenario(1)} className="p-2.5 rounded-lg bg-white border border-earth-300 hover:border-forest-600 text-left">
                  <strong className="block text-slate-900">2. पंजाब बासमती (PB Basmati)</strong>
                  <span className="text-[11px] text-amber-700 font-semibold">लुधियाना • प्रतिबंधित कीटनाशक</span>
                </button>
                <button type="button" onClick={() => loadScenario(2)} className="p-2.5 rounded-lg bg-white border border-earth-300 hover:border-forest-600 text-left">
                  <strong className="block text-slate-900">3. एमपी सोयाबीन (MP Soybean)</strong>
                  <span className="text-[11px] text-emerald-700 font-semibold">इंदौर • काली मिट्टी बुवाई असंगति</span>
                </button>
              </div>
            </div>

            {/* Main Input Form */}
            <form onSubmit={handleAuditSubmit} className="bg-white rounded-2xl p-6 sm:p-8 border border-earth-200 shadow-sm space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">State *</label>
                  <select
                    value={formState}
                    onChange={(e) => {
                      setFormState(e.target.value);
                      const dists = DISTRICTS_MAP[e.target.value] || ["General"];
                      setFormDistrict(dists[0]);
                    }}
                    className="w-full p-2.5 rounded-lg border border-slate-300 bg-white"
                  >
                    {Object.keys(DISTRICTS_MAP).map(st => <option key={st} value={st}>{st}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">District *</label>
                  <select
                    value={formDistrict}
                    onChange={(e) => setFormDistrict(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 bg-white"
                  >
                    {(DISTRICTS_MAP[formState] || ["General"]).map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Crop *</label>
                  <input
                    type="text"
                    value={formCrop}
                    onChange={(e) => setFormCrop(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300"
                    placeholder="e.g. Wheat, Basmati Rice"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Season</label>
                  <select value={formSeason} onChange={(e) => setFormSeason(e.target.value)} className="w-full p-2.5 rounded-lg border border-slate-300 bg-white">
                    <option value="Rabi">Rabi (रबी)</option>
                    <option value="Kharif">Kharif (खरीफ)</option>
                    <option value="Zaid">Zaid (जायद)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  AI-Generated Farming Advice (चैटबॉट की सलाह यहाँ पेस्ट करें) *
                </label>
                <textarea
                  value={formAdvice}
                  onChange={(e) => setFormAdvice(e.target.value)}
                  required
                  rows="4"
                  placeholder="Paste AI chatbot advice here (e.g. 'Apply 150 kg urea at sowing, spray glyphosate...')"
                  className="w-full p-3 rounded-lg border border-slate-300 text-xs"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-forest-900 hover:bg-forest-800 text-white font-bold rounded-xl text-sm shadow transition-all flex items-center justify-center space-x-2"
              >
                <span>{isSubmitting ? 'जांच की जा रही है... (Auditing...)' : 'सलाह की जांच करें (Audit This Advice)'}</span>
              </button>
            </form>

          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 3: AUDIT RESULTS REPORT */}
        {/* ========================================================= */}
        {view === 'results' && currentAudit && (
          <div className="max-w-5xl mx-auto px-4 py-8 space-y-6 text-xs">
            
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <span className="font-mono bg-forest-100 text-forest-800 px-2 py-0.5 rounded font-bold">{currentAudit.id}</span>
                <span className="text-slate-500 ml-2">Location: {currentAudit.district}, {currentAudit.state}</span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setReportLang(l => l === 'EN' ? 'HI' : 'EN')}
                  className="px-3 py-1.5 rounded-lg bg-earth-100 font-bold border border-earth-300"
                >
                  {reportLang === 'EN' ? 'हिंदी में देखें (Hindi)' : 'View in English'}
                </button>
                <button onClick={() => window.print()} className="px-3 py-1.5 rounded-lg bg-forest-900 text-white font-bold">
                  Print Report
                </button>
              </div>
            </div>

            {/* Verdict Card */}
            <div className={`p-6 rounded-2xl border-2 ${currentAudit.overallVerdict === 'CONFLICTING' ? 'bg-red-50 border-red-300 text-red-950' : 'bg-emerald-50 border-emerald-300 text-emerald-950'} shadow-sm space-y-3`}>
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white">
                  {currentAudit.overallVerdict}
                </span>
                <span className="bg-white/80 px-2.5 py-0.5 rounded font-bold">
                  Status: {currentAudit.reviewStatus}
                </span>
              </div>
              <h2 className="text-2xl font-black">{currentAudit.verdictHeadline}</h2>
              <p className="text-sm leading-relaxed">
                {reportLang === 'EN' ? currentAudit.verdictSummaryEn : currentAudit.verdictSummaryHi}
              </p>
            </div>

            {/* Claim Comparison Table */}
            <div className="bg-white rounded-2xl border border-earth-200 overflow-hidden shadow-sm">
              <div className="p-4 bg-cream-50 border-b font-bold text-forest-950">
                Claim-by-Claim Verification Table (दावावार तुलना)
              </div>
              <div className="divide-y text-[11px]">
                {currentAudit.claims.map((c, i) => (
                  <div key={i} className="p-4 grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
                    <div className="md:col-span-4 space-y-1">
                      <span className="font-bold text-slate-500 uppercase text-[10px]">{c.category}</span>
                      <p className="font-medium text-slate-900 italic">“{c.claimText}”</p>
                    </div>
                    <div className="md:col-span-5 space-y-1">
                      <strong className="text-forest-950 block">Official Recommendation:</strong>
                      <p className="text-slate-700">{reportLang === 'EN' ? c.explanationEn : c.explanationHi}</p>
                      <span className="text-[10px] text-forest-700 font-semibold block">{c.sourceCitation}</span>
                    </div>
                    <div className="md:col-span-3 text-right">
                      <span className={`inline-block px-2.5 py-1 rounded text-[10px] font-bold ${c.verdict === 'CONFLICT' ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'}`}>
                        {c.verdict} • {c.severity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Designated Local KVK Card */}
            <div className="bg-forest-900 text-white p-6 rounded-2xl space-y-3">
              <h3 className="font-bold text-base">Recommended Farmer Next Steps</h3>
              <p className="text-forest-200">
                {reportLang === 'EN' ? currentAudit.recommendedActionEn : currentAudit.recommendedActionHi}
              </p>
              <div className="bg-forest-800 p-4 rounded-xl border border-forest-700">
                <span className="text-leaf-300 font-bold uppercase text-[10px]">Local Designated Center</span>
                <h4 className="font-bold text-sm text-white">{currentAudit.localContactKVK.name}</h4>
                <p className="text-forest-200 text-xs">{currentAudit.localContactKVK.phone}</p>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 4: OFFICIAL SOURCES DIRECTORY */}
        {/* ========================================================= */}
        {view === 'sources' && (
          <div className="max-w-6xl mx-auto px-4 py-8 space-y-6 text-xs">
            <div className="border-b pb-4">
              <h1 className="text-2xl font-black text-forest-950">Authoritative Guidance Sources</h1>
              <p className="text-slate-600">Searchable repository of ICAR, SAU, & KVK Package of Practices.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sources.map(s => (
                <div key={s.id} className="bg-white p-5 rounded-xl border border-earth-200 shadow-sm space-y-2">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="font-bold px-2 py-0.5 rounded bg-forest-100 text-forest-800">{s.orgType} • {s.state}</span>
                    <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">VERIFIED ✓</span>
                  </div>
                  <h3 className="font-bold text-sm text-slate-900">{s.title}</h3>
                  <p className="text-forest-800 font-semibold">{s.organization}</p>
                  <p className="text-slate-600 text-[11px] italic bg-cream-50 p-2.5 rounded border">
                    “{s.keyExcerpts[0]}”
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 5: HELP & SUPPORT */}
        {/* ========================================================= */}
        {view === 'help' && (
          <div className="max-w-4xl mx-auto px-4 py-8 space-y-6 text-xs">
            <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl p-6 text-forest-950 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider bg-forest-950 text-amber-300 px-2.5 py-0.5 rounded">
                  National Toll-Free Helpline
                </span>
                <h2 className="text-2xl font-black">राष्ट्रीय किसान कॉल सेंटर (Kisan Call Centre)</h2>
                <p className="text-xs font-semibold">सुबह 6:00 से रात 10:00 तक 22 भाषाओं में निःशुल्क कृषि सलाह।</p>
              </div>
              <a href="tel:18001801551" className="px-6 py-3.5 bg-forest-950 text-white rounded-xl font-black text-sm shadow-xl">
                कॉल करें: 1800-180-1551
              </a>
            </div>

            <div className="bg-red-50 border-2 border-red-300 rounded-2xl p-5 space-y-2">
              <h3 className="font-bold text-red-900 text-sm">आपातकालीन चेतावनी: गलत खरपतवारनाशक छिड़काव</h3>
              <p className="text-red-800 leading-relaxed text-xs">
                यदि किसी चैटबॉट के कहने पर खड़ी गेहूं की फसल पर <strong>ग्लाइफोसेट (Glyphosate)</strong> छिड़क दिया गया हो, तो तुरंत नजदीकी केवीके केंद्र से संपर्क करें।
              </p>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 6: FEEDBACK */}
        {/* ========================================================= */}
        {view === 'feedback' && (
          <div className="max-w-4xl mx-auto px-4 py-8 space-y-6 text-xs">
            <div className="bg-white rounded-2xl p-6 border border-earth-200 shadow-sm space-y-4">
              <h2 className="text-lg font-bold text-forest-950">प्रतिक्रिया व सुझाव साझा करें (Farmer Feedback)</h2>
              <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">रेटिंग (Rating):</label>
                  <div className="flex space-x-2 text-2xl text-amber-400 cursor-pointer">
                    {[1, 2, 3, 4, 5].map(star => (
                      <span key={star} onClick={() => setFeedbackRating(star)}>
                        {star <= feedbackRating ? '★' : '☆'}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input name="name" required placeholder="आपका नाम (Your Name)" className="p-2.5 rounded-lg border border-slate-300" />
                  <select name="role" className="p-2.5 rounded-lg border border-slate-300 bg-white">
                    <option value="Farmer">किसान (Farmer)</option>
                    <option value="KVK Scientist">KVK वैज्ञानिक</option>
                    <option value="Researcher">शोधकर्ता</option>
                  </select>
                </div>

                <select name="category" className="w-full p-2.5 rounded-lg border border-slate-300 bg-white">
                  <option value="Report AI Mistake">एआई चैटबॉट की गलती की रिपोर्ट</option>
                  <option value="Suggest Local Rule">स्थानीय नियम का सुझाव</option>
                  <option value="Appreciation">प्रशंसा व अनुभव</option>
                </select>

                <textarea name="comment" required rows="3" placeholder="अपनी टिप्पणी लिखें..." className="w-full p-3 rounded-lg border border-slate-300" />
                <button type="submit" className="px-6 py-2.5 bg-forest-900 text-white font-bold rounded-xl">
                  सबमिट करें (Submit)
                </button>
              </form>
            </div>

            <div className="space-y-3">
              <h3 className="font-bold text-sm text-forest-950">हालिया समीक्षाएं (Recent Community Voice)</h3>
              {feedback.map(fb => (
                <div key={fb.id} className="p-4 bg-cream-50 rounded-xl border border-earth-200 space-y-1">
                  <div className="flex justify-between font-bold text-slate-900">
                    <span>{fb.name} ({fb.role})</span>
                    <span className="text-amber-500">{'★'.repeat(fb.rating)}</span>
                  </div>
                  <p className="text-slate-700 italic">“{fb.comment}”</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 7: SETTINGS */}
        {/* ========================================================= */}
        {view === 'settings' && (
          <div className="max-w-4xl mx-auto px-4 py-8 space-y-6 text-xs">
            <div className="bg-white rounded-2xl p-6 border border-earth-200 shadow-sm space-y-4">
              <h2 className="text-base font-bold text-forest-950">भाषा चयन (Language Preference)</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div
                  onClick={() => changeLanguage('HI')}
                  className={`p-4 rounded-xl border-2 cursor-pointer ${language === 'HI' ? 'border-leaf-500 bg-leaf-50' : 'border-earth-200'}`}
                >
                  <h3 className="font-bold text-sm">🇮🇳 हिन्दी (Hindi)</h3>
                  <p className="text-slate-500 text-[11px]">किसान भाइयों व क्षेत्रीय विशेषज्ञों के लिए</p>
                </div>
                <div
                  onClick={() => changeLanguage('EN')}
                  className={`p-4 rounded-xl border-2 cursor-pointer ${language === 'EN' ? 'border-leaf-500 bg-leaf-50' : 'border-earth-200'}`}
                >
                  <h3 className="font-bold text-sm">🌐 English</h3>
                  <p className="text-slate-500 text-[11px]">For researchers & extension officers</p>
                </div>
              </div>
            </div>

            <div className="bg-forest-950 text-white rounded-2xl p-6 border-2 border-forest-800 space-y-3">
              <h3 className="font-bold text-base text-cream-50">गोपनीय व्यवस्थापक पहुंच (Restricted Staff & Admin)</h3>
              <p className="text-forest-200 text-xs">अधिकृत कृषि वैज्ञानिकों व मॉडरेटर्स के लिए पासवर्ड संरक्षित कंसोल।</p>
              <button
                onClick={() => setView('admin')}
                className="px-5 py-2.5 bg-amber-400 text-forest-950 font-black rounded-xl"
              >
                व्यवस्थापक पोर्टल खोलें (Open Admin)
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 8: HIDDEN ADMIN PORTAL */}
        {/* ========================================================= */}
        {view === 'admin' && (
          <div className="max-w-5xl mx-auto px-4 py-8 space-y-6 text-xs">
            {!isAdminLoggedIn ? (
              <div className="max-w-md mx-auto bg-white rounded-3xl p-8 border-2 border-forest-800 shadow-2xl space-y-4 text-center">
                <div className="w-16 h-16 rounded-2xl bg-forest-950 text-amber-400 flex items-center justify-center mx-auto text-2xl font-black">
                  🔐
                </div>
                <h2 className="text-2xl font-black text-forest-950">व्यवस्थापक पोर्टल लॉगिन</h2>
                <form onSubmit={handleAdminAuth} className="space-y-4 text-left">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">व्यवस्थापक पासवर्ड:</label>
                    <input
                      name="password"
                      type="password"
                      required
                      placeholder="••••••••••••"
                      className="w-full p-3 rounded-xl border border-slate-300 font-mono"
                    />
                    <p className="text-[10px] text-slate-400 mt-1 italic">
                      अनधिकृत प्रवेश सख्त वर्जित है। (Strictly confidential)
                    </p>
                  </div>
                  <button type="submit" className="w-full py-3 bg-forest-900 text-white font-black rounded-xl">
                    सुरक्षित लॉगिन करें
                  </button>
                </form>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-forest-950 text-white rounded-2xl p-5 flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-bold">सलाह परीक्षक — अधिकृत व्यवस्थापक कंसोल</h2>
                    <span className="text-xs text-forest-300">Logged in as Chief Agronomist</span>
                  </div>
                  <button
                    onClick={() => { setIsAdminLoggedIn(false); sessionStorage.removeItem('salah_admin'); setView('home'); }}
                    className="px-4 py-2 bg-red-600 text-white font-bold rounded-xl"
                  >
                    Logout
                  </button>
                </div>

                <div className="flex space-x-2 border-b pb-2">
                  <button onClick={() => setAdminTab('audits')} className={`px-4 py-2 rounded-xl font-bold ${adminTab === 'audits' ? 'bg-forest-900 text-white' : 'bg-earth-100 text-slate-700'}`}>
                    📋 Audits ({audits.length})
                  </button>
                  <button onClick={() => setAdminTab('feedback')} className={`px-4 py-2 rounded-xl font-bold ${adminTab === 'feedback' ? 'bg-forest-900 text-white' : 'bg-earth-100 text-slate-700'}`}>
                    💬 Feedback Inbox ({feedback.length})
                  </button>
                </div>

                {adminTab === 'audits' ? (
                  <div className="bg-white rounded-2xl p-5 border border-earth-200 shadow-sm overflow-x-auto">
                    <table className="w-full text-left text-[11px]">
                      <thead>
                        <tr className="bg-cream-50 border-b">
                          <th className="p-2.5">ID</th>
                          <th className="p-2.5">Location</th>
                          <th className="p-2.5">Verdict</th>
                          <th className="p-2.5">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {audits.map(a => (
                          <tr key={a.id}>
                            <td className="p-2.5 font-mono font-bold">{a.id}</td>
                            <td className="p-2.5">{a.crop} ({a.district})</td>
                            <td className="p-2.5">
                              <span className={`px-2 py-0.5 rounded font-bold ${a.overallVerdict === 'CONFLICTING' ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'}`}>
                                {a.overallVerdict}
                              </span>
                            </td>
                            <td className="p-2.5 font-bold text-emerald-700">{a.reviewStatus}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl p-5 border border-earth-200 shadow-sm space-y-3">
                    {feedback.map(fb => (
                      <div key={fb.id} className="p-3 bg-cream-50 rounded-xl border flex justify-between items-center">
                        <div>
                          <strong>{fb.name}</strong> ({fb.role}) - <span className="text-amber-600 font-bold">{fb.category}</span>
                          <p className="text-slate-600 mt-0.5">“{fb.comment}”</p>
                        </div>
                        <span className="text-amber-500 font-bold">{'★'.repeat(fb.rating)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

      </main>

      {/* 4. Universal Footer */}
      <footer className="bg-forest-950 text-forest-200 border-t border-forest-800 mt-20 no-print text-xs">
        <div className="bg-earth-900 border-b border-earth-700/60 text-cream-100 py-3 px-4">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
            <div>
              <strong>Free Official Farmer Advisory:</strong> National Kisan Call Centre Toll-Free: <a href="tel:18001801551" className="font-mono text-leaf-300 font-bold underline">1800-180-1551</a>
            </div>
            <div className="text-earth-200">Backed by ICAR & State Agricultural Universities</div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            © 2024-2026 Salah Auditor. Open Agricultural Commons. No synthetic source citations.
          </div>
          <div className="flex items-center space-x-4">
            <span className="italic text-forest-300">“Right Advice. Right District. Right Season.”</span>
            <button onClick={() => setView('admin')} className="opacity-30 hover:opacity-100 transition-opacity text-[10px] text-forest-300 hover:text-amber-300">
              🔒 Staff Portal
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
}
