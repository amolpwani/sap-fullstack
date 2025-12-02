# SAP CAP + React Employee Training Management

A full-stack application built with SAP Cloud Application Programming (CAP) Model for the backend and React for the frontend.

## 📋 Overview

This project provides a complete employee training management system with:
- **Backend**: SAP CAP with OData V4 services
- **Frontend**: React with TypeScript and Vite
- **Database**: SQLite (development) / HANA (production)
- **Features**: CRUD operations for employee records

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Git

### Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd sap-cap-react-project
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Deploy Database Schema**
   ```bash
   npx cds-deploy --to sqlite
   ```

4. **Start Backend Server** (Port 5001)
   ```bash
   npm run dev
   ```

5. **Install Frontend Dependencies** (in a new terminal)
   ```bash
   cd frontend
   npm install
   ```

6. **Start Frontend Server** (Port 3000)
   ```bash
   npm run dev
   ```

7. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5001/catalog

## 🌐 SAP Business Application Studio (BAS)

### Setup in BAS

1. **Create Dev Space**
   - Go to SAP BAS: https://your-bas-url.cfapps.sap.hana.ondemand.com
   - Create a new Dev Space with **Full Stack Cloud Application** template
   - Wait for the Dev Space to start

2. **Clone Repository**
   ```bash
   git clone <your-repo-url>
   cd sap-cap-react-project
   ```

3. **Install Dependencies**
   ```bash
   # Backend
   cd backend
   npm install
   npx cds-deploy --to sqlite
   
   # Frontend
   cd ../frontend
   npm install
   ```

4. **Run in BAS**
   
   **Option A: Using Terminal (Recommended)**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev
   
   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

   **Option B: Using CDS Watch (Backend only)**
   ```bash
   cd backend
   cds watch
   ```

5. **Access Application in BAS**
   - BAS will show port forwarding notifications
   - Click on "Open in New Tab" for port 3000 (frontend)
   - Backend will be accessible at the forwarded port 5001

### Port Configuration in BAS

BAS automatically forwards ports. The application uses:
- **Backend**: Port 5001
- **Frontend**: Port 3000

## ☁️ Cloud Foundry Deployment

### Prerequisites
- SAP BTP account (trial or enterprise)
- Cloud Foundry CLI installed
- MTA Build Tool installed

### Deploy to Cloud Foundry

1. **Login to Cloud Foundry**
   ```bash
   cf login -a <api-endpoint>
   ```

2. **Build MTA Archive**
   ```bash
   mbt build
   ```

3. **Deploy to Cloud Foundry**
   ```bash
   cf deploy mta_archives/sap-cap-react-project_1.0.0.mtar
   ```

4. **Access Deployed Application**
   ```bash
   cf apps
   ```
   Note the route URL and access your application.

## 📁 Project Structure

```
sap-cap-react-project/
├── backend/                 # SAP CAP Backend
│   ├── db/
│   │   ├── data/           # Initial CSV data
│   │   │   └── training-Employee.csv
│   │   └── schema.cds      # Data model
│   ├── srv/
│   │   ├── service.cds     # Service definition
│   │   └── service.js      # Service implementation
│   ├── .cdsrc.json         # CAP configuration
│   └── package.json
├── frontend/               # React Frontend
│   ├── src/
│   │   ├── App.tsx         # Main component
│   │   ├── api.ts          # API client
│   │   ├── types.ts        # TypeScript types
│   │   └── main.tsx        # Entry point
│   ├── index.html
│   ├── vite.config.ts      # Vite configuration
│   └── package.json
├── Specs/                  # Documentation
│   ├── Requirements.md
│   ├── ChangeLog.md
│   └── Glossary.md
├── mta.yaml               # Multi-Target Application descriptor
├── .gitignore
└── README.md
```

## 🔧 Configuration

### Backend Configuration (`.cdsrc.json`)
```json
{
  "odata": { "version": "v4" },
  "requires": {
    "db": { "kind": "sqlite", "model": ["db/schema.cds"] }
  },
  "server": {
    "port": 5001
  }
}
```

### Frontend Configuration (`vite.config.ts`)
- Development server on port 3000
- Proxies `/catalog` requests to backend (port 5001)

## 📊 Initial Data

The project includes sample employee data in `backend/db/data/training-Employee.csv`:
- Amol Wani (Director) - $120/hr
- Prashant Sharma (Lead) - $80/hr
- Shubham Gupta (Senior Developer) - $60/hr
- Jolly Patil (UI/UX Designer) - $55/hr

## 🛠️ Available Scripts

### Backend
- `npm run dev` - Start development server with cds-serve
- `npm start` - Start production server
- `npx cds-deploy --to sqlite` - Deploy database schema

### Frontend
- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🔐 Authentication

Currently using **mocked authentication** for development. For production:
1. Configure XSUAA service in `mta.yaml`
2. Update authentication strategy in backend
3. Implement login flow in frontend

## 📝 API Endpoints

### OData V4 Service
- **Base URL**: `/catalog`
- **Entity**: `Employees`

**Operations:**
- `GET /catalog/Employees` - List all employees
- `GET /catalog/Employees(ID)` - Get employee by ID
- `POST /catalog/Employees` - Create new employee
- `PATCH /catalog/Employees(ID)` - Update employee
- `DELETE /catalog/Employees(ID)` - Delete employee

## 🐛 Troubleshooting

### Database Table Not Found
```bash
cd backend
npx cds-deploy --to sqlite
```

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :5001
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:5001 | xargs kill -9
```

### BAS Port Forwarding Issues
- Check the "Ports" view in BAS
- Manually expose ports if needed
- Ensure firewall allows port forwarding

## 📚 Resources

- [SAP CAP Documentation](https://cap.cloud.sap/docs/)
- [SAP Business Application Studio](https://help.sap.com/docs/SAP%20Business%20Application%20Studio)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

- Project Team

## 🆘 Support

For issues and questions:
1. Check the `/Specs` directory for detailed requirements
2. Review the troubleshooting section
3. Open an issue in the repository

---

**Happy Coding! 🚀**

