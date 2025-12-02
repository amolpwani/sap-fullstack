# 🚀 SAP BAS Quick Start Guide

## 30-Second Setup

```bash
# 1. Clone repository
git clone <your-repo-url>
cd sap-cap-react-project

# 2. Setup backend
cd backend
npm install
npx cds-deploy --to sqlite

# 3. Setup frontend
cd ../frontend
npm install
cd ..

# 4. Run (open 2 terminals)
# Terminal 1:
cd backend && npm run dev

# Terminal 2:
cd frontend && npm run dev
```

## Access URLs
- **Frontend**: Port 3000 (click "Open in New Tab" notification)
- **Backend**: Port 5001
- **API**: `/catalog/Employees`

## Common Issues

### Database Error
```bash
cd backend && npx cds-deploy --to sqlite
```

### Port Busy
```bash
kill -9 $(lsof -ti:5001)
kill -9 $(lsof -ti:3000)
```

### Module Not Found
```bash
rm -rf node_modules package-lock.json && npm install
```

## Dev Space Requirements
- Type: **Full Stack Cloud Application**
- Extensions: MTA Tools, CDS Graphical Modeler

## Project Structure
```
sap-cap-react-project/
├── backend/          # SAP CAP (Port 5001)
├── frontend/         # React (Port 3000)
├── Specs/           # Documentation
└── mta.yaml         # Cloud Foundry config
```

## Next Steps
1. ✅ Application running in BAS
2. 📖 Read full guide: `DEPLOYMENT_GUIDE.md`
3. ☁️ Deploy to CF: `mbt build && cf deploy mta_archives/*.mtar`

---
**Need help?** Check `README.md` or `DEPLOYMENT_GUIDE.md`

