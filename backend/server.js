/**
 * Salah Auditor - Node.js Backend Server
 * Bhoomi & Bharosa Bharat | Farmers, Land & the Data Commons
 * "Right Advice. Right District. Right Season."
 */

const http = require('http');
const url = require('url');
const { SalahAuditEngine } = require('./auditEngine');

const PORT = process.env.PORT || 5000;
const auditEngine = new SalahAuditEngine();

// In-Memory Database initialized with real-world demonstration benchmarks
const AUDITS_DATABASE = [
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
    additionalContext: "Field is located near Gangetic plain alluvial belt. Sowing was delayed by 12 days due to late paddy harvesting.",
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
        sourceUrl: "https://iiwbr.icar.gov.in/",
        pageOrSection: "Page 14, Section 4.2",
        excerptSnippet: "Nitrogen must be split into three applications: 1/2 as basal at sowing, 1/4 at first irrigation (CRI stage), and 1/4 at second irrigation (booting stage). Never apply entire nitrogen at sowing."
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
        sourceCitation: "CSAUAT Krishi Nirdeshika (Rabi Crops), Page 19 & ICAR-IIWBR Sec 5.1",
        sourceUrl: "https://csauk.ac.in/",
        pageOrSection: "Page 19, Water Management",
        excerptSnippet: "First irrigation in wheat must strictly be applied at the Crown Root Initiation (CRI) stage, which occurs 20 to 25 days after sowing (DAS)."
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
        sourceUrl: "https://iiwbr.icar.gov.in/",
        pageOrSection: "Page 22, Section 6.1 (Herbicide Safety)",
        excerptSnippet: "Non-selective systemic herbicides such as Glyphosate are strictly prohibited in standing crops."
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
        createdAt: "2024-10-19T08:15:00Z",
        verifiedBadge: true
      }
    ],
    recommendedActionEn: "Immediately discard the AI advice. Follow 3-split Nitrogen schedule and use Sulfosulfuron only post first irrigation.",
    recommendedActionHi: "एआई की सलाह को तुरंत खारिज करें। यूरिया को 3 बार में दें और पहली सिंचाई पर ही केवल अनुशंसित खरपतवारनाशक का प्रयोग करें।",
    localContactKVK: {
      name: "Krishi Vigyan Kendra Varanasi (ICAR-IIVR)",
      phone: "1800-180-1551 (Kisan Call Centre)",
      address: "Kallipur, Mirzamurad, Varanasi, UP - 221307",
      email: "kvk.varanasi@icar.gov.in"
    }
  }
];

const SOURCES_DATABASE = [
  {
    id: "SRC-1",
    title: "Package of Practices for Rabi Crops (Wheat, Mustard, Chickpea) in Central and Eastern UP",
    organization: "Chandra Shekhar Azad University of Agriculture & Technology (CSAUAT), Kanpur",
    orgType: "SAU",
    state: "Uttar Pradesh",
    publicationYear: 2023,
    url: "https://csauk.ac.in/",
    documentType: "Package of Practices",
    verificationStatus: "VERIFIED",
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
    verificationStatus: "VERIFIED",
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
    verificationStatus: "VERIFIED",
    keyExcerpts: [
      "Flat broadcasting of soybean seed in heavy clay Vertisols causes root rot and poor emergence during monsoon dry-spells. Broad Bed Furrow (BBF) method is compulsory."
    ]
  }
];

const FEEDBACK_DATABASE = [
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

function sendJson(res, statusCode, data) {
  const body = JSON.stringify(data);
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, DELETE',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  });
  res.end(body);
}

const server = http.createServer((req, res) => {
  const parsed = url.parse(req.url, true);
  const path = parsed.pathname;

  // Handle CORS Pre-flight
  if (req.method === 'OPTIONS') {
    res.writeHead(200, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, DELETE',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    return res.end();
  }

  // GET ENDPOINTS
  if (req.method === 'GET') {
    if (path === '/api/audits') {
      return sendJson(res, 200, { status: "success", count: AUDITS_DATABASE.length, data: AUDITS_DATABASE });
    }
    if (path.startsWith('/api/audits/')) {
      const id = path.replace('/api/audits/', '');
      const found = AUDITS_DATABASE.find(a => a.id === id);
      if (found) return sendJson(res, 200, { status: "success", data: found });
      return sendJson(res, 404, { status: "error", message: "Audit not found" });
    }
    if (path === '/api/sources') {
      return sendJson(res, 200, { status: "success", count: SOURCES_DATABASE.length, data: SOURCES_DATABASE });
    }
    if (path === '/api/feedback') {
      return sendJson(res, 200, { status: "success", count: FEEDBACK_DATABASE.length, data: FEEDBACK_DATABASE });
    }
    if (path === '/api/dashboard/stats') {
      const total = AUDITS_DATABASE.length;
      const mismatches = AUDITS_DATABASE.filter(a => a.overallVerdict === 'CONFLICTING' || a.overallVerdict === 'POTENTIAL_MISMATCH').length;
      return sendJson(res, 200, {
        status: "success",
        data: {
          totalAudits: total,
          mismatches,
          sourcesCount: SOURCES_DATABASE.length,
          feedbackCount: FEEDBACK_DATABASE.length
        }
      });
    }

    return sendJson(res, 200, {
      status: "online",
      name: "Salah Auditor Node.js API",
      endpoints: ["/api/audits", "/api/sources", "/api/feedback", "/api/dashboard/stats"]
    });
  }

  // POST ENDPOINTS
  if (req.method === 'POST') {
    let bodyStr = '';
    req.on('data', chunk => { bodyStr += chunk; });
    req.on('end', () => {
      let payload = {};
      try { payload = JSON.parse(bodyStr); } catch (e) {}

      if (path === '/api/audits') {
        const result = auditEngine.auditAdvice(payload.submittedAdvice || '', {
          state: payload.state || 'Uttar Pradesh',
          district: payload.district || 'Varanasi',
          crop: payload.crop || 'Wheat'
        });

        const newRecord = {
          id: `AUDIT-${Date.now()}-${(payload.district || 'VAR').slice(0, 3).toUpperCase()}`,
          createdAt: new Date().toISOString(),
          state: payload.state || 'Uttar Pradesh',
          district: payload.district || 'Varanasi',
          crop: payload.crop || 'Wheat',
          cropVariety: payload.cropVariety || 'Standard',
          season: payload.season || 'Rabi',
          soilType: payload.soilType || 'Alluvial (Loamy)',
          sowingDate: payload.sowingDate || '',
          farmingStage: payload.farmingStage || 'Vegetative',
          adviceCategory: payload.adviceCategory || 'General',
          aiModelName: payload.aiModelName || 'Generic Farming Chatbot',
          submittedAdvice: payload.submittedAdvice || '',
          overallVerdict: result.overall_verdict,
          verdictHeadline: result.verdict_headline || (result.overall_verdict === 'CONFLICTING'
            ? 'Dangerous Agronomic & Chemical Contradiction Detected'
            : (result.overall_verdict === 'POTENTIAL_MISMATCH'
                ? 'Potential Local Context Mismatch Detected'
                : 'Consistent with available local guidance')),
          verdictSummaryEn: `Evaluated ${result.claims_evaluated.length} claim(s). Identified ${result.conflicts_count} local mismatch(es).`,
          verdictSummaryHi: `सलाह में ${result.claims_evaluated.length} दावों की जांच की गई, ${result.conflicts_count} स्थानीय विसंगतियां पाई गईं।`,
          claims: result.claims_evaluated.map(c => ({
            id: c.claim_id,
            category: c.category,
            claimText: c.claim_text,
            officialRecommendation: c.official_recommendation,
            verdict: c.verdict,
            severity: c.severity,
            explanationEn: c.explanation,
            explanationHi: c.explanation_hi,
            sourceCitation: c.citation,
            sourceUrl: c.source_url
          })),
          localContextWarnings: [
            {
              id: 'W-1',
              parameter: 'Agro-Climatic Match',
              severity: result.overall_verdict === 'CONFLICTING' ? 'CRITICAL' : 'WARNING',
              title: `District Rule Applied for ${payload.district || 'Uttar Pradesh'}`,
              warningEn: `Advice was cross-referenced against ${payload.district || 'State'} Package of Practices.`,
              warningHi: `यह सलाह ${payload.district || 'क्षेत्रीय'} आधिकारिक पैकेज ऑफ प्रैक्टिसेज से जांची गई।`
            }
          ],
          sourcesChecked: [SOURCES_DATABASE[0]],
          reviewStatus: result.overall_verdict === 'CONFLICTING' ? 'DISPUTED' : 'VERIFIED',
          communityReviews: [],
          recommendedActionEn: result.overall_verdict === 'CONFLICTING'
            ? "Immediately discard the AI advice. Follow official ICAR-IIWBR / SAU package of practices and contact local KVK center at 1800-180-1551."
            : "Follow official ICAR recommendations and consult the designated local KVK center.",
          recommendedActionHi: result.overall_verdict === 'CONFLICTING'
            ? "इस एआई सलाह को तुरंत निरस्त करें। केवल आधिकारिक पैकेज ऑफ प्रैक्टिसेज और नजदीकी केवीके की सलाह (टोल-फ्री 1800-180-1551) का पालन करें।"
            : "आधिकारिक आईसीएआर दिशा-निर्देशों का पालन करें और नजदीकी केवीके केंद्र से संपर्क करें।",
          localContactKVK: {
            name: `Krishi Vigyan Kendra ${payload.district || 'Varanasi'} (ICAR)`,
            phone: "1800-180-1551 (Kisan Call Centre Toll-Free)",
            address: `${payload.district || 'Varanasi'} District Extension Centre`,
            email: "kvk@icar.gov.in"
          }
        };

        AUDITS_DATABASE.unshift(newRecord);
        return sendJson(res, 201, { status: "success", data: newRecord });
      }

      if (path === '/api/feedback') {
        const newFb = {
          id: `FB-${Date.now()}`,
          name: payload.name || 'Anonymous Farmer',
          role: payload.role || 'Farmer',
          category: payload.category || 'General Feedback',
          rating: Number(payload.rating) || 5,
          comment: payload.comment || '',
          status: 'NEW',
          createdAt: new Date().toISOString()
        };
        FEEDBACK_DATABASE.unshift(newFb);
        return sendJson(res, 201, { status: "success", data: newFb });
      }

      if (path === '/api/admin/login') {
        const pw = (payload.password || '').trim();
        if (pw === 'salah2026' || pw === 'admin123') {
          return sendJson(res, 200, {
            status: "success",
            authenticated: true,
            token: "admin-token-valid-2026",
            adminName: "Chief Agronomy Moderator (ICAR/KVK)"
          });
        }
        return sendJson(res, 401, {
          status: "error",
          message: "गलत पासवर्ड! कृपया सही व्यवस्थापक पासवर्ड दर्ज करें। (Invalid Admin Password)"
        });
      }

      if (path === '/api/admin/audit-status') {
        const audit = AUDITS_DATABASE.find(a => a.id === payload.auditId);
        if (audit) {
          audit.reviewStatus = payload.status;
          return sendJson(res, 200, { status: "success", data: audit });
        }
        return sendJson(res, 404, { status: "error", message: "Audit not found" });
      }

      if (path === '/api/admin/delete-audit') {
        const idx = AUDITS_DATABASE.findIndex(a => a.id === payload.auditId);
        if (idx !== -1) AUDITS_DATABASE.splice(idx, 1);
        return sendJson(res, 200, { status: "success", message: "Audit deleted" });
      }

      return sendJson(res, 404, { status: "error", message: "Endpoint not found" });
    });
    return;
  }

  sendJson(res, 404, { status: "error", message: "Method not allowed" });
});

server.listen(PORT, () => {
  console.log(`===================================================`);
  console.log(`🌾 Salah Auditor Backend running on port ${PORT}`);
  console.log(`   Healthcheck: http://localhost:${PORT}/api/audits`);
  console.log(`===================================================`);
});
