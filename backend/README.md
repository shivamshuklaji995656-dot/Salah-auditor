# Salah Auditor - Backend API Server

Bhoomi & Bharosa Bharat | Farmers, Land and the Data Commons
"Right Advice. Right District. Right Season."

## 🚀 How to Run Backend

```bash
cd backend
npm run dev
```

The backend server starts on `http://localhost:5000` with zero external dependencies (pure Node.js).

### Endpoints
- `GET /api/audits` - List all verified and historical audits
- `POST /api/audits` - Submit AI advice for district-specific audit
- `GET /api/sources` - Search authoritative Package of Practices
- `GET /api/feedback` - Retrieve community and farmer feedback
- `POST /api/feedback` - Submit new farmer feedback
- `POST /api/admin/login` - Authenticate admin with password (`salah2026`)
