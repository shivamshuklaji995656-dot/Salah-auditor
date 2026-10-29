/**
 * Salah Auditor - Node.js Agricultural Audit Engine
 * Bhoomi & Bharosa Bharat | Farmers, Land & the Data Commons
 */

const DISTRICT_POP_RULES = [
  {
    state: "Uttar Pradesh",
    district: "Varanasi",
    crop: "Wheat",
    claimCategory: "Herbicide Safety",
    keywords: ["glyphosate", "roundup", "ग्लाइफोसेट"],
    contradictionSeverity: "CRITICAL",
    officialRule: "Glyphosate is a non-selective total herbicide. Spraying it in a standing wheat crop will kill 100% of the plants. Use Sulfosulfuron or Clodinafop-propargyl post-first irrigation.",
    ruleHi: "गंभीर चेतावनी: ग्लाइफोसेट गैर-चयनात्मक है। खड़ी गेहूं की फसल पर छिड़कने से 100% फसल नष्ट हो जाएगी। इसके बजाय सल्फोसल्फ्यूरॉन या क्लोडिनाफॉप का उपयोग करें।",
    citation: "ICAR-IIWBR Herbicide Safety Protocol, Sec 6.1 & CSAUAT Nirdeshika",
    sourceUrl: "https://iiwbr.icar.gov.in/"
  },
  {
    state: "Uttar Pradesh",
    district: "Varanasi",
    crop: "Wheat",
    claimCategory: "Fertilizer Schedule",
    keywords: ["150 kg", "entire urea", "all urea at sowing", "पूरा यूरिया", "एक साथ यूरिया"],
    contradictionSeverity: "CRITICAL",
    officialRule: "Split Nitrogen into 3 applications: 50% basal at sowing, 25% at CRI stage (21 DAS), and 25% at booting stage. Never dump full nitrogen at sowing.",
    ruleHi: "नाइट्रोजन को 3 भागों में बांटें: 50% बुवाई पर, 25% पहले पानी (CRI ~21 दिन) पर और 25% कल्ले फूटने पर। बुवाई पर पूरा यूरिया कभी न डालें।",
    citation: "ICAR-IIWBR Package of Practices for Wheat 2023-24, Sec 4.2",
    sourceUrl: "https://iiwbr.icar.gov.in/"
  },
  {
    state: "Uttar Pradesh",
    district: "Varanasi",
    crop: "Wheat",
    claimCategory: "Irrigation Scheduling",
    keywords: ["flood irrigation immediately", "every 7 days", "हर 7 दिन", "तुरंत भारी पानी"],
    contradictionSeverity: "HIGH",
    officialRule: "First irrigation must strictly be applied at Crown Root Initiation (CRI) 20-25 days after sowing. Pre-CRI heavy flood irrigation suffocates roots.",
    ruleHi: "गेहूं में पहली सिंचाई अनिवार्य रूप से बुवाई के 20-25 दिन बाद सीआरआई (CRI) अवस्था पर ही करें। समय पूर्व भारी पानी भरने से जड़ें सड़ने लगती हैं।",
    citation: "CSAUAT Krishi Nirdeshika (Rabi Crops), Page 19",
    sourceUrl: "https://csauk.ac.in/"
  },
  {
    state: "Punjab",
    district: "Ludhiana",
    crop: "Basmati Rice",
    claimCategory: "Pesticide Regulations",
    keywords: ["acephate", "tricyclazole", "एसिफेट", "ट्राइसाइक्लाजोल"],
    contradictionSeverity: "CRITICAL",
    officialRule: "Acephate and Tricyclazole are strictly banned by the Government of Punjab on Basmati rice under Section 27 of Insecticides Act 1968 due to export residue rejections.",
    ruleHi: "पंजाब सरकार द्वारा कीटनाशक अधिनियम की धारा 27 के तहत बासमती चावल पर एसिफेट व ट्राइसाइक्लाजोल पूर्णतः प्रतिबंधित हैं क्योंकि इनसे निर्यात में रिजेक्शन होता है।",
    citation: "Punjab Govt Notification No. 14/17/2020-Agri.2(1)/1121 & PAU Ludhiana Advisory",
    sourceUrl: "https://agri.punjab.gov.in/"
  },
  {
    state: "Madhya Pradesh",
    district: "Indore",
    crop: "Soybean",
    claimCategory: "Sowing Method & Drainage",
    keywords: ["broadcasting", "95 kg", "छिड़काव बुवाई", "90 kg"],
    contradictionSeverity: "HIGH",
    officialRule: "In heavy black Vertisols of Malwa (Indore), flat broadcasting at high seed rates leads to waterlogging rot. ICAR-IISR mandates Broad Bed Furrow (BBF) or Ridge-Furrow sowing @ 65-70 kg/ha.",
    ruleHi: "मालवा (इंदौर) की भारी काली मिट्टी में 95 किग्रा छिड़काव बुवाई से जलभराव और सड़न रोग होता है; आईसीएआर 65-70 किग्रा मेड़ (BBF) विधि की सिफारिश करता है।",
    citation: "ICAR - Indian Institute of Soybean Research (IISR) Indore, Bulletin 2023",
    sourceUrl: "https://iisrindore.icar.gov.in/"
  }
];

class SalahAuditEngine {
  auditAdvice(adviceText, context) {
    const textLower = (adviceText || "").toLowerCase();
    const evaluatedClaims = [];
    let conflictsCount = 0;
    let criticalCount = 0;

    // Check against matching district rules
    DISTRICT_POP_RULES.forEach((rule, idx) => {
      const matchState = !context.state || rule.state.toLowerCase() === context.state.toLowerCase();
      const matchDistrict = !context.district || rule.district.toLowerCase() === context.district.toLowerCase() || rule.district === "General";
      const matchCrop = !context.crop || rule.crop.toLowerCase().includes(context.crop.toLowerCase()) || context.crop.toLowerCase().includes(rule.crop.toLowerCase());

      const keywordMatched = rule.keywords.some(k => textLower.includes(k.toLowerCase()));

      if (keywordMatched) {
        conflictsCount++;
        if (rule.contradictionSeverity === "CRITICAL") criticalCount++;

        evaluatedClaims.push({
          claim_id: `CLM-${idx + 1}`,
          category: rule.claimCategory,
          claim_text: `AI Advice recommendation regarding ${rule.claimCategory.toLowerCase()}`,
          verdict: "CONFLICT",
          severity: rule.contradictionSeverity,
          official_recommendation: rule.officialRule,
          official_recommendation_hi: rule.ruleHi,
          explanation: rule.officialRule,
          explanation_hi: rule.ruleHi,
          citation: rule.citation,
          source_url: rule.sourceUrl
        });
      }
    });

    // If no conflicts detected, generate baseline evaluation
    if (evaluatedClaims.length === 0) {
      evaluatedClaims.push({
        claim_id: "CLM-001",
        category: "General Practice",
        claim_text: adviceText.slice(0, 120) + "...",
        verdict: "SUPPORTED",
        severity: "LOW",
        official_recommendation: "Advice is consistent with general agronomic boundaries for this region.",
        official_recommendation_hi: "यह सलाह क्षेत्र की सामान्य कृषि गाइडलाइन के अनुरूप प्रतीत होती है।",
        explanation: "No direct chemical, sowing date, or dosage violation detected against indexed Package of Practices.",
        explanation_hi: "पैकेज ऑफ प्रैक्टिसेज के विरुद्ध कोई सीधा रासायनिक या बुवाई उल्लंघन नहीं पाया गया।",
        citation: "District Agro-Climatic Advisory Portal",
        source_url: "https://icar.org.in"
      });
    }

    let overallVerdict = "CONSISTENT";
    if (criticalCount > 0) {
      overallVerdict = "CONFLICTING";
    } else if (conflictsCount > 0) {
      overallVerdict = "POTENTIAL_MISMATCH";
    }

    return {
      overall_verdict: overallVerdict,
      conflicts_count: conflictsCount,
      critical_count: criticalCount,
      claims_evaluated: evaluatedClaims
    };
  }
}

module.exports = { SalahAuditEngine, DISTRICT_POP_RULES };
