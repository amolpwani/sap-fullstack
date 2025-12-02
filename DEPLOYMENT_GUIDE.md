# 🚀 Deployment Guide: Push to Git & Run in SAP Business Application Studio

This guide walks you through pushing your SAP CAP + React project to a Git repository and running it in SAP Business Application Studio (BAS).

---

## 📦 Part 1: Push to Git Repository

### Option A: GitHub

1. **Create a new repository on GitHub**
   - Go to https://github.com/new
   - Repository name: `sap-cap-react-project`
   - Description: "SAP CAP Employee Training Management with React"
   - Choose Public or Private
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
   - Click "Create repository"

2. **Add remote and push**
   ```bash
   git remote add origin https://github.com/YOUR-USERNAME/sap-cap-react-project.git
   git branch -M main
   git push -u origin main
   ```

3. **Verify**
   - Refresh your GitHub repository page
   - You should see all your files

### Option B: GitLab

1. **Create a new project on GitLab**
   - Go to https://gitlab.com/projects/new
   - Project name: `sap-cap-react-project`
   - Choose visibility level
   - **Uncheck** "Initialize repository with a README"
   - Click "Create project"

2. **Add remote and push**
   ```bash
   git remote add origin https://gitlab.com/YOUR-USERNAME/sap-cap-react-project.git
   git branch -M main
   git push -u origin main
   ```

### Option C: Azure DevOps

1. **Create a new repository**
   - Go to your Azure DevOps organization
   - Create new project: `sap-cap-react-project`
   - Go to Repos → Files
   - Copy the repository URL

2. **Add remote and push**
   ```bash
   git remote add origin https://dev.azure.com/YOUR-ORG/sap-cap-react-project/_git/sap-cap-react-project
   git branch -M main
   git push -u origin main
   ```

---

## 🌐 Part 2: Run in SAP Business Application Studio

### Prerequisites
- SAP BTP account (trial or enterprise)
- Access to SAP Business Application Studio

### Step 1: Access SAP BAS

1. **Login to SAP BTP Cockpit**
   - Trial: https://cockpit.hanatrial.ondemand.com
   - Enterprise: https://account.hana.ondemand.com

2. **Open SAP Business Application Studio**
   - Navigate to your subaccount
   - Go to "Services" → "Instances and Subscriptions"
   - Click on "SAP Business Application Studio"
   - Or directly: https://YOUR-SUBDOMAIN.eu10.hana.ondemand.com/

### Step 2: Create Dev Space

1. **Create a new Dev Space**
   - Click "Create Dev Space"
   - Name: `CAP-React-Dev`
   - Type: Select **"Full Stack Cloud Application"**
   - Additional Extensions (optional but recommended):
     - ✅ MTA Tools
     - ✅ CDS Graphical Modeler
     - ✅ SAP HANA Tools
   - Click "Create Dev Space"

2. **Wait for Dev Space to start**
   - Status will change from "STARTING" to "RUNNING"
   - Click on the Dev Space name to open it

### Step 3: Clone Your Repository

1. **Open Terminal in BAS**
   - Menu: Terminal → New Terminal
   - Or press: `Ctrl + ` (backtick)

2. **Clone your repository**
   ```bash
   git clone https://github.com/YOUR-USERNAME/sap-cap-react-project.git
   cd sap-cap-react-project
   ```

3. **Verify files**
   ```bash
   ls -la
   ```

### Step 4: Install Dependencies

1. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Deploy Database**
   ```bash
   npx cds-deploy --to sqlite
   ```
   
   This will:
   - Create the SQLite database
   - Create tables based on schema.cds
   - Load initial data from CSV files

3. **Install Frontend Dependencies**
   ```bash
   cd ../frontend
   npm install
   cd ..
   ```

### Step 5: Run the Application in BAS

#### Option A: Run Both Servers (Recommended)

1. **Open two terminals in BAS**
   - Terminal 1: Backend
   - Terminal 2: Frontend

2. **Terminal 1 - Start Backend**
   ```bash
   cd backend
   npm run dev
   ```
   
   You should see:
   ```
   [cds] - server listening on { url: 'http://localhost:5001' }
   ```

3. **Terminal 2 - Start Frontend**
   ```bash
   cd frontend
   npm run dev
   ```
   
   You should see:
   ```
   VITE ready in XXXms
   ➜  Local:   http://localhost:3000/
   ```

4. **Access the Application**
   - BAS will show a notification: "A service is listening on port 3000"
   - Click "Open in New Tab" or "Open in Preview"
   - Your application will open in a new browser tab

#### Option B: Using CDS Watch (Backend Only)

```bash
cd backend
cds watch
```

This will:
- Start the backend server
- Watch for file changes
- Auto-reload on changes

### Step 6: Port Forwarding in BAS

BAS automatically handles port forwarding, but you can manage it manually:

1. **View Ports**
   - Menu: View → Ports
   - Or click the "Ports" icon in the bottom panel

2. **Exposed Ports**
   - Port 5001: Backend CAP service
   - Port 3000: Frontend React app

3. **Make Port Public (if needed)**
   - Right-click on the port
   - Select "Port Visibility" → "Public"

### Step 7: Test the Application

1. **Frontend (Port 3000)**
   - Should display the Employee Management UI
   - You should see 4 initial employees from the CSV

2. **Backend API (Port 5001)**
   - Access: `https://your-bas-url/catalog`
   - Test endpoint: `https://your-bas-url/catalog/Employees`

3. **Test CRUD Operations**
   - ✅ List employees
   - ✅ Add new employee
   - ✅ View employee details

---

## 🔧 Troubleshooting in BAS

### Issue 1: Port Already in Use

```bash
# Find process using the port
lsof -ti:5001

# Kill the process
kill -9 $(lsof -ti:5001)
```

### Issue 2: Database Not Found

```bash
cd backend
npx cds-deploy --to sqlite
```

### Issue 3: Module Not Found

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

### Issue 4: Port Not Accessible

1. Check if the server is running
2. Check the Ports view in BAS
3. Try making the port public
4. Restart the Dev Space if needed

### Issue 5: CORS Errors

The frontend is configured to proxy requests to the backend. If you see CORS errors:

1. Check `frontend/vite.config.ts` proxy settings
2. Ensure backend is running on port 5001
3. Restart both servers

---

## ☁️ Part 3: Deploy to Cloud Foundry (Optional)

### Prerequisites
- SAP BTP Cloud Foundry space
- Cloud Foundry CLI installed in BAS (usually pre-installed)

### Step 1: Login to Cloud Foundry

```bash
cf login -a https://api.cf.eu10.hana.ondemand.com
```

Enter your credentials when prompted.

### Step 2: Install MTA Build Tool (if not installed)

```bash
npm install -g mbt
```

### Step 3: Build MTA Archive

```bash
mbt build
```

This creates: `mta_archives/sap-cap-react-project_1.0.0.mtar`

### Step 4: Deploy to Cloud Foundry

```bash
cf deploy mta_archives/sap-cap-react-project_1.0.0.mtar
```

Wait for deployment to complete (5-10 minutes).

### Step 5: Access Deployed Application

```bash
cf apps
```

Note the route URL and access your application:
- Frontend: `https://sap-cap-frontend-YOUR-SPACE.cfapps.eu10.hana.ondemand.com`
- Backend: `https://sap-cap-backend-YOUR-SPACE.cfapps.eu10.hana.ondemand.com`

---

## 📊 Comparison: Local vs BAS vs Cloud Foundry

| Feature | Local | SAP BAS | Cloud Foundry |
|---------|-------|---------|---------------|
| Setup Time | 5 min | 10 min | 30 min |
| Database | SQLite | SQLite | HANA/PostgreSQL |
| Scalability | Single user | Single user | Multi-user |
| Persistence | Yes | Session-based | Yes |
| Internet Access | Not required | Required | Required |
| Cost | Free | Free (trial) | Paid (after trial) |
| Best For | Development | Development | Production |

---

## 🎯 Quick Reference Commands

### Git Commands
```bash
# Check status
git status

# Pull latest changes
git pull

# Commit changes
git add .
git commit -m "Your message"
git push
```

### BAS Commands
```bash
# Backend
cd backend
npm install
npx cds-deploy --to sqlite
npm run dev

# Frontend
cd frontend
npm install
npm run dev
```

### Cloud Foundry Commands
```bash
# Login
cf login

# List apps
cf apps

# View logs
cf logs sap-cap-backend --recent

# Restart app
cf restart sap-cap-backend

# Delete app
cf delete sap-cap-backend
```

---

## 📞 Support & Resources

### Documentation
- [SAP CAP Documentation](https://cap.cloud.sap/docs/)
- [SAP BAS Guide](https://help.sap.com/docs/SAP%20Business%20Application%20Studio)
- [Cloud Foundry Docs](https://docs.cloudfoundry.org/)

### Community
- [SAP Community](https://community.sap.com/)
- [Stack Overflow - SAP CAP](https://stackoverflow.com/questions/tagged/sap-cap)

### Troubleshooting
- Check `/Specs/Requirements.md` for detailed requirements
- Review logs in BAS terminal
- Check Cloud Foundry logs: `cf logs APP-NAME --recent`

---

## ✅ Checklist

### Before Pushing to Git
- [ ] All files committed
- [ ] .gitignore configured
- [ ] README.md complete
- [ ] No sensitive data in code

### Before Running in BAS
- [ ] Dev Space created
- [ ] Repository cloned
- [ ] Dependencies installed
- [ ] Database deployed

### Before Cloud Foundry Deployment
- [ ] MTA build successful
- [ ] CF login successful
- [ ] Target space selected
- [ ] Services configured

---

**🎉 Congratulations! Your SAP CAP + React application is now running in SAP Business Application Studio!**

For questions or issues, refer to the main README.md or open an issue in the repository.

