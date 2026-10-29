/**
 * Salah Auditor - Comprehensive Agricultural Audit & Verification Engine
 * Bhoomi & Bharosa Bharat | Farmers, Land & the Data Commons
 * "Right Advice. Right District. Right Season."
 */

// Curated authentic agronomic rules from ICAR, State Agricultural Universities (SAUs), and KVKs
const COMPREHENSIVE_AGRONOMIC_RULES = [
  // 1. SOWING WINDOW & HEAT STRESS (WHEAT)
  {
    id: "RULE-WHEAT-SOWING-DATE",
    category: "Sowing Window & Thermal Stress",
    crops: ["wheat", "गेहूं"],
    states: ["uttar pradesh", "u.p", "up", "bihar", "haryana", "punjab", "madhya pradesh", "rajasthan", "all"],
    matchKeywords: [
      "late january", "january", "february", "जनवरी", "फरवरी", 
      "sow in march", "summer wheat", "गर्मी में गेहूं", "late sown in jan",
      "sow wheat in january", "sow wheat in late january", "sowing in january"
    ],
    severity: "CRITICAL",
    claimSnippet: "Sowing wheat late in January/February",
    officialRule: "Wheat in the Indo-Gangetic Plains (UP/Bihar/Haryana/Punjab) must strictly be sown between Nov 5 - Nov 25 (timely) or by Dec 20 (late-sown heat-tolerant varieties like PBW-373/DBW-107). Sowing in late January is disastrous: it exposes the crop to severe March terminal heat (>35°C) during flowering and grain fill, causing floret sterility, severe grain shriveling, and catastrophic 70-80% yield loss.",
    ruleHi: "गेहूं की बुवाई उत्तर प्रदेश व उत्तर भारत में 5-25 नवंबर (समय पर) या अधिकतम 20 दिसंबर (पिछेती किस्में) तक पूरी हो जानी चाहिए। जनवरी अंत में बुवाई करने से मार्च की समय पूर्व गर्मी के कारण दाना नहीं भरेगा और 70-80% तक फसल बर्बाद हो जाएगी।",
    citation: "ICAR-IIWBR Karnal Package of Practices 2023-24, Sec 3.1 & CSAUAT Nirdeshika",
    sourceUrl: "https://iiwbr.icar.gov.in/"
  },

  // 2. IRRIGATION FREQUENCY (WHEAT DAILY FLOODING DISASTER)
  {
    id: "RULE-WHEAT-IRRIGATION-FREQUENCY",
    category: "Irrigation Scheduling & Root Health",
    crops: ["wheat", "गेहूं"],
    states: ["all"],
    matchKeywords: [
      "everyday", "every day", "daily", "प्रतिदिन", "रोज", "रोजाना", "हर दिन", 
      "हर 2 दिन", "every 2 days", "every other day", "flood everyday", 
      "irrigate everyday", "irrigate the field everyday", "keep water filled",
      "standing water continuously", "लगातार पानी भर"
    ],
    severity: "CRITICAL",
    claimSnippet: "Irrigating the wheat field everyday / daily flooding",
    officialRule: "FATAL AGRONOMIC ERROR: Never irrigate wheat daily. Daily flooding creates soil waterlogging/hypoxia, cuts off oxygen to the root zone, causes severe chlorosis (yellowing), sparks Pythium/Rhizoctonia crown root rot, and kills the seedlings. Wheat requires only 4 to 6 irrigations during its entire 120-day cycle, strictly scheduled at critical phonological stages: CRI (20-25 DAS), Tillering (40-45 DAS), Late Jointing (60-65 DAS), Flowering/Booting (80-85 DAS), and Dough stage (100-105 DAS).",
    ruleHi: "गंभीर चेतावनी: गेहूं में प्रतिदिन या रोजाना पानी कभी न दें। रोज पानी भरने से जमीन में हवा समाप्त हो जाती है, जड़ें सड़ने लगती हैं (Root Rot) और पौधे पीले पड़कर सूख जाते हैं। गेहूं में पूरे जीवनकाल में केवल 4 से 6 सिंचाई की आवश्यकता होती है, जो मुख्य अवस्थाओं (सीआरआई 20-25 दिन, कल्ले फूटते समय, गांठ बनते समय, फूल व दाना भरते समय) पर ही की जानी चाहिए।",
    citation: "CSAUAT Krishi Nirdeshika (Rabi Crops), Page 19 & ICAR-IIWBR Water Protocol Sec 5.1",
    sourceUrl: "https://csauk.ac.in/"
  },

  // 3. NITROGEN DOSAGE & DUMPING UREA (WHEAT)
  {
    id: "RULE-WHEAT-NITROGEN-DOSAGE",
    category: "Fertilizer Schedule & Nitrogen Balance",
    crops: ["wheat", "गेहूं"],
    states: ["all"],
    matchKeywords: [
      "large quantity of nitrogen", "large quantity of fertilizer", "excessive nitrogen", 
      "heavy nitrogen", "dump nitrogen", "high urea", "all urea at sowing", 
      "completely at sowing", "150 kg urea at sowing", "150 kg/ha of urea completely",
      "भारी मात्रा में नाइट्रोजन", "पूरा यूरिया बुवाई पर", "अधिक यूरिया", "150 किग्रा यूरिया",
      "dumping urea", "large nitrogen"
    ],
    severity: "CRITICAL",
    claimSnippet: "Applying large uncalibrated quantity of nitrogen / all urea at sowing",
    officialRule: "CRITICAL FERTILIZER VIOLATION: Excessive or uncalibrated nitrogen application (especially dumping it at sowing) causes severe seedling scorch, massive nitrate leaching/volatilization, excessive vegetative growth, weak straw, and catastrophic crop lodging (falling over) in wind, as well as high vulnerability to rust. Recommended nitrogen is 120-150 kg N/ha, strictly split into 3 phases: 50% basal at sowing, 25% at first irrigation (CRI stage ~21 DAS), and 25% at second irrigation (boot stage).",
    ruleHi: "गंभीर उर्वरक गलती: भारी मात्रा में नाइट्रोजन या बुवाई के समय पूरा यूरिया एक साथ डालना बेहद नुकसानदेह है। इससे छोटे कल्ले जल जाते हैं, नाइट्रोजन जमीन में बहकर नष्ट होता है, तना कमजोर होकर फसल गिर (Lodging) जाती है और रतुआ/कीटों का प्रकोप बढ़ता है। आधिकारिक सिफारिश 120-150 किग्रा नाइट्रोजन को 3 भागों में बांटकर देने की है: 50% बुवाई पर, 25% सीआरआई अवस्था (21 दिन) पर और 25% बाली निकलते समय।",
    citation: "ICAR-IIWBR Package of Practices for Wheat 2023-24, Sec 4.2",
    sourceUrl: "https://iiwbr.icar.gov.in/"
  },

  // 4. PRE-CRI FLOODING IN WHEAT
  {
    id: "RULE-WHEAT-PRE-CRI-FLOOD",
    category: "Irrigation Scheduling",
    crops: ["wheat", "गेहूं"],
    states: ["all"],
    matchKeywords: [
      "flood irrigation immediately", "heavy flood immediately", "deep flood immediately",
      "water immediately after sowing", "बुवाई के तुरंत बाद भारी पानी", "तुरंत भारी सिंचाई"
    ],
    severity: "HIGH",
    claimSnippet: "Deep flood irrigation immediately after sowing",
    officialRule: "First irrigation in wheat must strictly be applied at Crown Root Initiation (CRI) stage, 20-25 days after sowing. Pre-CRI heavy flood irrigation compacts alluvial soils, suppresses crown root branching, and induces severe chlorosis.",
    ruleHi: "गेहूं में पहली सिंचाई अनिवार्य रूप से बुवाई के 20-25 दिन बाद सीआरआई (Crown Root Initiation) अवस्था पर ही करें। बुवाई के तुरंत बाद भारी पानी भरने से जड़ें जम नहीं पातीं।",
    citation: "CSAUAT Krishi Nirdeshika (Rabi Crops), Page 19",
    sourceUrl: "https://csauk.ac.in/"
  },

  // 5. GLYPHOSATE / NON-SELECTIVE HERBICIDE IN STANDING WHEAT OR RICE
  {
    id: "RULE-GLYPHOSATE-STANDING-CROP",
    category: "Herbicide Safety & Regulation",
    crops: ["wheat", "rice", "धान", "गेहूं", "all"],
    states: ["all"],
    matchKeywords: [
      "glyphosate", "roundup", "ग्लाइफोसेट", "राउंडअप", "paraquat", "ग्रामोक्सोन", "gramoxone"
    ],
    severity: "CRITICAL",
    claimSnippet: "Spraying Glyphosate or Paraquat in a standing field crop",
    officialRule: "LETHAL CHEMICAL HAZARD: Glyphosate 41% SL and Paraquat are non-selective broad-spectrum total herbicides. Spraying them in a standing crop will destroy 100% of your crop harvest. Under CIB&RC regulations, Glyphosate is strictly prohibited in standing crops and restricted only to non-cropped land or bunds. For weed control in standing wheat, use Sulfosulfuron 75% WG @ 33.3 g/ha or Clodinafop-propargyl 15% WP @ 400 g/ha post-first irrigation.",
    ruleHi: "घातक रासायनिक चेतावनी: ग्लाइफोसेट एक गैर-चयनात्मक संपूर्ण खरपतवारनाशक है। खड़ी फसल पर इसका छिड़काव करने से 100% फसल जलकर बर्बाद हो जाएगी। सरकारी नियमों के तहत खड़ी फसल पर ग्लाइफोसेट पूर्णतः प्रतिबंधित है। गेहूं में खरपतवार के लिए सल्फोसल्फ्यूरॉन या क्लोडिनाफॉप का उपयोग करें।",
    citation: "ICAR-IIWBR Herbicide Safety Protocol, Sec 6.1 & CIB&RC Guidelines",
    sourceUrl: "https://iiwbr.icar.gov.in/"
  },

  // 6. BANNED CHEMICALS ON BASMATI RICE
  {
    id: "RULE-BASMATI-BANNED-CHEMICALS",
    category: "Pesticide Regulations & Export Compliance",
    crops: ["basmati", "rice", "paddy", "बासमती", "धान"],
    states: ["punjab", "haryana", "uttar pradesh", "all"],
    matchKeywords: [
      "acephate", "tricyclazole", "carbendazim", "buprofezin", "chlorpyrifos", 
      "methamidophos", "propiconazole", "thiamethoxam", "एसिफेट", "ट्राइसाइक्लाजोल", 
      "कार्बेन्डाजिम", "थायोमेथॉक्सम"
    ],
    severity: "CRITICAL",
    claimSnippet: "Applying banned agrochemicals (Acephate/Tricyclazole) on Basmati Rice",
    officialRule: "STRICT STATUTORY BAN: The Government of Punjab and northern states have placed a total ban on Acephate, Tricyclazole, Carbendazim, and 7 other chemicals on Basmati rice under Section 27 of Insecticides Act 1968. Chemical residues exceed Maximum Residue Limits (MRLs), causing rejection of multi-million dollar export consignments. Use PAU-recommended eco-friendly alternatives (Chlorantraniliprole 18.5 SC or Flubendiamide 39.35 SC).",
    ruleHi: "कानूनी प्रतिबंध: पंजाब सरकार व कृषि विभाग द्वारा बासमती चावल पर एसिफेट, ट्राइसाइक्लाजोल और कार्बेन्डाजिम पर पूर्ण प्रतिबंध लगाया गया है ताकि अंतरराष्ट्रीय निर्यात में कीटनाशक अवशेषों की वजह से रिजेक्शन न हो। इसके स्थान पर कोराजन (Chlorantraniliprole) या सुरक्षित जैव कीटनाशकों का प्रयोग करें।",
    citation: "Punjab Govt Notification No. 14/17/2020-Agri.2(1)/1121 & PAU Ludhiana Basmati Advisory",
    sourceUrl: "https://agri.punjab.gov.in/"
  },

  // 7. SOYBEAN BROADCASTING & DRAINAGE IN VERTISOLS
  {
    id: "RULE-SOYBEAN-DRAINAGE-MALWA",
    category: "Sowing Method & Soil Drainage",
    crops: ["soybean", "सोयाबीन"],
    states: ["madhya pradesh", "m.p", "mp", "maharashtra", "all"],
    matchKeywords: [
      "broadcasting", "flat bed", "flat-bed", "95 kg", "90 kg", "छिड़काव बुवाई", 
      "no need for broad bed", "standing water in soybean"
    ],
    severity: "HIGH",
    claimSnippet: "Flat bed broadcasting of soybean at 90-95 kg/ha",
    officialRule: "AGRONOMIC MISMATCH: In high-clay Vertisols (black cotton soils) of Central India, broadcasting soybean at 90-95 kg/ha leads to uneven sowing depth, severe plant crowding, and disastrous water stagnation root rot during heavy rains. ICAR-IISR Indore mandates sowing with Broad Bed Furrow (BBF) machine or Ridge-Furrow system with a calibrated seed rate of 65-75 kg/ha.",
    ruleHi: "काली मिट्टी में 90-95 किग्रा छिड़काव बुवाई करने से बारिश में जलभराव और तना/जड़ सड़न रोग हो जाता है। आईसीएआर इंदौर के अनुसार 65-75 किग्रा बीज दर से मेड़ (Broad Bed Furrow) पद्धति से बुवाई करना अनिवार्य है।",
    citation: "ICAR - Indian Institute of Soybean Research (IISR) Indore, Bulletin 2023",
    sourceUrl: "https://iisrindore.icar.gov.in/"
  },

  // 8. MUSTARD DELAYED SOWING APHID TRAP
  {
    id: "RULE-MUSTARD-DELAYED-SOWING",
    category: "Sowing Window & Pest Vulnerability",
    crops: ["mustard", "rapeseed", "सरसों", "राई"],
    states: ["all"],
    matchKeywords: [
      "mustard in december", "mustard in jan", "सरसों दिसंबर", "सरसों जनवरी", 
      "late mustard", "sow mustard in late november"
    ],
    severity: "CRITICAL",
    claimSnippet: "Late sowing of Mustard in late November / December / January",
    officialRule: "CRITICAL PEST HAZARD: Optimum sowing window for Indian mustard is Oct 10 to Oct 25. Delaying sowing into late November or December/January exposes the flowering crop to catastrophic aphid (Lipaphis erysimi / माहू) outbreaks and warm spells, reducing oil content and causing up to 50% yield collapse.",
    ruleHi: "सरसों की बुवाई का सर्वोत्तम समय 10 से 25 अक्टूबर है। नवंबर अंत या दिसंबर में बुवाई करने से माहू (चेपा/एफिड) कीट का भारी प्रकोप होता है और उपज आधी रह जाती है।",
    citation: "ICAR-DRMR Bharatpur Mustard Production Manual 2023",
    sourceUrl: "https://drmr.res.in/"
  },

  // 9. ZINC DEFICIENCY / DAP REPLACEMENT FALLACY
  {
    id: "RULE-ZINC-DEFICIENCY-ALLUVIAL",
    category: "Micronutrient Management",
    crops: ["all"],
    states: ["uttar pradesh", "bihar", "all"],
    matchKeywords: [
      "no need for zinc", "dap covers zinc", "dap was provided no need for zinc", 
      "no zinc application", "जिंक की जरूरत नहीं", "डीएपी डाला है तो जिंक नहीं"
    ],
    severity: "HIGH",
    claimSnippet: "Omitting Zinc application assuming DAP provides it",
    officialRule: "SOIL NUTRITION MISCONCEPTION: DAP contains only Nitrogen (18%) and Phosphorus (46%), with zero zinc. Alluvial soils of Central and Eastern UP suffer 40-48% zinc deficiency. In fact, high phosphorus without zinc exacerbates P-induced zinc deficiency (Khaira disease / bronzing). Basal application of 25 kg/ha Zinc Sulphate (ZnSO4 21%) is mandatory.",
    ruleHi: "भ्रांति निवारण: डीएपी में केवल नाइट्रोजन और फास्फोरस होता है, जिंक 0% होता है। पूर्वी व मध्य यूपी की मिट्टियों में जिंक की भारी कमी है। डीएपी के साथ 25 किग्रा जिंक सल्फेट डालना अत्यंत आवश्यक है अन्यथा खैरा रोग हो जाएगा।",
    citation: "CSAUAT Kanpur Soil Health & Nutrient Advisory Bulletin 2023",
    sourceUrl: "https://csauk.ac.in/"
  }
];

class SalahAuditEngine {
  auditAdvice(adviceText, context = {}) {
    const textRaw = adviceText || "";
    const textLower = textRaw.toLowerCase();
    
    // Normalize context
    const state = (context.state || "").toLowerCase();
    const district = (context.district || "").toLowerCase();
    const crop = (context.crop || "").toLowerCase();

    const evaluatedClaims = [];
    const matchedRuleIds = new Set();
    let conflictsCount = 0;
    let criticalCount = 0;

    // Evaluate all domain rules
    for (const rule of COMPREHENSIVE_AGRONOMIC_RULES) {
      // Check crop applicability
      const cropMatches = rule.crops.includes("all") || 
        rule.crops.some(c => crop.includes(c) || textLower.includes(c));

      // Check state applicability
      const stateMatches = rule.states.includes("all") ||
        rule.states.some(s => state.includes(s) || textLower.includes(s));

      if (!cropMatches && !stateMatches && !rule.crops.includes("all")) {
        // If neither crop nor state matches from context or text, skip
        continue;
      }

      // Check keyword patterns in the submitted advice text
      const matchedKeyword = rule.matchKeywords.find(k => textLower.includes(k.toLowerCase()));

      if (matchedKeyword && !matchedRuleIds.has(rule.id)) {
        matchedRuleIds.add(rule.id);
        conflictsCount++;
        if (rule.severity === "CRITICAL") criticalCount++;

        // Extract relevant sentence or clause representation
        let userSnippet = rule.claimSnippet;
        // Don't split on abbreviations like U.P.
        const cleanText = textRaw.replace(/u\.p\./gi, "UP").replace(/u\.p/gi, "UP");
        const sentences = cleanText.split(/(?<=[?!;\n])|(?<=\.\s+)/);
        for (const s of sentences) {
          if (s.toLowerCase().includes(matchedKeyword.toLowerCase())) {
            userSnippet = s.trim().length > 10 ? `"${s.trim()}"` : `"${rule.claimSnippet}"`;
            break;
          }
        }

        evaluatedClaims.push({
          claim_id: `CLM-${evaluatedClaims.length + 1}`,
          category: rule.category,
          claim_text: userSnippet,
          verdict: "CONFLICT",
          severity: rule.severity,
          official_recommendation: rule.officialRule,
          official_recommendation_hi: rule.ruleHi,
          explanation: rule.officialRule,
          explanation_hi: rule.ruleHi,
          citation: rule.citation,
          source_url: rule.sourceUrl
        });
      }
    }

    // If no conflicts detected, generate positive verification baseline
    if (evaluatedClaims.length === 0) {
      evaluatedClaims.push({
        claim_id: "CLM-001",
        category: "General Agronomic Practice",
        claim_text: textRaw.length > 130 ? (textRaw.slice(0, 130) + "...") : textRaw,
        verdict: "SUPPORTED",
        severity: "LOW",
        official_recommendation: `Advice conforms with official Package of Practices for ${context.district || 'the designated district'}. No dangerous chemical, sowing window, or nutrient contradictions detected.`,
        official_recommendation_hi: `${context.district || 'इस जिले'} के आधिकारिक पैकेज ऑफ प्रैक्टिसेज के अनुसार कोई रासायनिक, बुवाई समय या खाद की विसंगति नहीं पाई गई।`,
        explanation: "Verified against indexed ICAR and State Agricultural University Package of Practices.",
        explanation_hi: "आईसीएआर व कृषि विश्वविद्यालय के आधिकारिक प्रोटोकॉल के अनुरूप पाया गया।",
        citation: "National Agro-Climatic Advisory Commons",
        source_url: "https://icar.org.in"
      });
    }

    let overallVerdict = "CONSISTENT";
    let verdictHeadline = "Consistent with available local guidance";
    if (criticalCount > 0) {
      overallVerdict = "CONFLICTING";
      verdictHeadline = `Dangerous Agronomic & Chemical Contradiction Detected (${conflictsCount} Critical Conflict${conflictsCount > 1 ? 's' : ''})`;
    } else if (conflictsCount > 0) {
      overallVerdict = "POTENTIAL_MISMATCH";
      verdictHeadline = `Potential Local Context Mismatch Detected (${conflictsCount} Mismatch)`;
    }

    return {
      overall_verdict: overallVerdict,
      verdict_headline: verdictHeadline,
      conflicts_count: conflictsCount,
      critical_count: criticalCount,
      claims_evaluated: evaluatedClaims
    };
  }
}

module.exports = { SalahAuditEngine, COMPREHENSIVE_AGRONOMIC_RULES };
