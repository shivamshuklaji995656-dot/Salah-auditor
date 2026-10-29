# Salah Auditor — Check If Farm Advice Fits the Area

> **Hackathon Track:** Bhoomi & Bharosa Bharat  
> **Theme:** Farmers, Land and the Data Commons  
> **Tagline:** *“Right Advice. Right District. Right Season.”*

---

## 1. Core Mission & Problem Statement

AI chatbots and large language models frequently produce fluent, scientific-sounding agricultural advice that is catastrophic when applied to a specific Indian farm. Advice about fertilizer dosage, irrigation frequency, banned chemicals, and sowing dates is fundamentally context-dependent:

- **Microclimate Sensitivity:** A sowing calendar suitable for Punjab will suffer terminal heat scorch in Eastern Uttar Pradesh.
- **Soil Chemistry Differences:** Flood irrigation in Varanasi alluvial loam causes root suffocation (chlorosis); flat broadcasting in Malwa (MP) black Vertisols causes 100% root rot.
- **State Regulatory Bans:** AI often suggests Acephate or Tricyclazole for rice pests, violating Punjab's legal ban under Section 27 of the Insecticides Act 1968.
- **Chemical Disasters:** Recommending non-selective total herbicides like Glyphosate in standing wheat causes total crop death.

**Salah Auditor** decomposes AI farming recommendations into discrete claims, cross-references them against official **Package of Practices (POP)** from ICAR, State Agricultural Universities (SAUs), and Krishi Vigyan Kendras (KVKs), and delivers an explainable, cited audit report with actionable farmer next steps in English and Hindi.

---

## 2. Key Features & Page Directory

| Page | Route | Description |
| :--- | :--- | :--- |
| **Home Landing** | `/` | Hero section, 3 core feature cards, 4-step workflow, and visual comparison preview |
| **Audit Advice Page** | `/audit` | Complete input form (State, District, Crop, Soil, Season, Sowing Date, Stage, Category) + 1-Click Test Scenarios |
| **Audit Results Dashboard** | `/audit/[id]` | Overall verdict, summary metrics, claim-by-claim comparison, local warnings, direct citations, KVK helpline |
| **Official Sources Directory** | `/sources` | Searchable index of ICAR, SAU, & KVK publications, PDF upload chunking, and source submission |
| **Community Review** | `/community` | Multi-role peer review (Farmers, KVK Experts, Researchers) with dispute tracking |
| **Dashboard & Analytics** | `/dashboard` | Recharts charts (Verdict distribution, crop mismatches, district volume), platform KPIs, searchable history |
| **About & Methodology** | `/about` | Technical breakdown of the 6-step pipeline, source credibility ranking, and responsible AI safety rules |

---

## 3. Technology Stack

- **Frontend:** Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Lucide React icons, Recharts visualizations.
- **Audit Engine:** Modular multi-stage pipeline (`src/lib/auditEngine.ts`) with agronomic claim decomposition, localized vector/keyword retrieval, and safety checks.
- **Python Engine & Automated Tests:** `python_engine/audit_engine.py` with full unit test coverage (`tests/test_audit_engine.py`).
- **REST APIs:** Next.js route handlers for audits, sources, community reviews, PDF processing, and dashboard statistics.
- **Database Schema:** PostgreSQL + pgvector schema (`schema.sql`) for persistent storage, user roles, and semantic vector embeddings.

---

## 4. Quick Start & Run Instructions

The project is structured into two clean directories:
- **`backend/`**: Node.js REST API & Agricultural Audit Engine (Runs on `http://localhost:5000`)
- **`frontend/`**: Complete React single-page application with field animations & KVK Officer suite (Runs on `http://localhost:3000`)

### Running the Backend

```bash
cd backend
npm run dev
```
> Starts the Node.js API server on `http://localhost:5000`.

### Running the Frontend (React)

```bash
cd frontend
npm run dev
```
> Starts the modern React application on `http://localhost:3000`.

### Root Shortcut Commands

```bash
npm run dev:backend   # Starts backend server
npm run dev:frontend  # Starts frontend React app
```

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Python Automated Unit Tests
```bash
python -m unittest discover -s tests
```
*Executes test cases verifying UP wheat chemical hazards, Punjab Basmati pesticide bans, MP Vertisol seed rates, and claim decomposition.*

### 3. Start the Next.js Development Server
```bash
npm run dev
```
Open your browser at **`http://localhost:3000`**.

### 4. Build for Production
```bash
npm run build
npm run start
```

---

## 5. Demonstration Benchmark Scenarios

### Benchmark 1: Uttar Pradesh Wheat (Varanasi District)
- **AI Recommendation:** Dump 150 kg/ha urea at sowing, flood irrigate immediately and every 7 days, and spray Glyphosate 41% SL across standing crop.
- **Official Guidance (ICAR-IIWBR & CSAUAT Kanpur):** Split Nitrogen into 3 doses (50% basal, 25% at CRI 21 days, 25% at boot stage). Irrigate strictly at CRI (20-25 days). Glyphosate is a total non-selective herbicide strictly banned in standing crops (use Clodinafop-propargyl).
- **Audit Verdict:** `CONFLICTING` (Critical Agronomic Hazard).

### Benchmark 2: Punjab Basmati Rice (Ludhiana District)
- **AI Recommendation:** Spray Acephate and Tricyclazole for stem borer and neck blast control.
- **Official Guidance (PAU Ludhiana & Dept of Agriculture Notification):** Acephate and Tricyclazole are banned under Section 27 of Insecticides Act due to export residue violations. Use Chlorantraniliprole or bio-parasitoids.
- **Audit Verdict:** `CONFLICTING` (Regulatory Violation).

### Benchmark 3: Madhya Pradesh Soybean (Indore District - Malwa Plateau)
- **AI Recommendation:** Broadcast JS 95-60 at 95 kg/ha on flat beds.
- **Official Guidance (ICAR-IISR Indore):** Malwa's deep black Vertisols suffer heavy water stagnation. Broad Bed Furrow (BBF) machine required with 65-75 kg/ha seed rate.
- **Audit Verdict:** `POTENTIAL_MISMATCH`.

---

## 6. Responsible AI & Safety Standards

1. **Zero Hallucinated Citations:** No fabricated document titles, authors, or DOIs.
2. **Explicit Uncertainty:** Lack of contradiction is never treated as proof of correctness.
3. **Dual Language Accessibility:** Complete verdict, claims, and next steps available in English and Hindi (हिंदी).
4. **Direct Emergency Helpline:** 24/7 prominent display of the national **Kisan Call Centre (1800-180-1551)** for live scientist advice.
