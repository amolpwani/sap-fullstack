# 📋 Dynamic Questionnaire System Guide

## Overview

This application has been transformed into a professional **Dynamic Questionnaire System** with SAP Fiori-inspired UI, replacing the employee management system with a flexible form builder that supports multiple field types.

---

## 🎨 Features

### Professional SAP Fiori UI
- Clean, modern interface inspired by SAP Fiori design system
- Responsive design for desktop and mobile
- Professional color scheme and typography
- Intuitive navigation and user experience

### Dynamic Form Fields
- ✅ **Text Input** - Single-line text fields
- ✅ **Textarea** - Multi-line text areas
- ✅ **Dropdown** - Select from predefined options
- ✅ **Radio Buttons** - Single choice from multiple options
- ✅ **File Upload** - Attach supporting documents

### Response Management
- 📝 Fill out questionnaires with validation
- 💾 Save responses to backend database
- 📊 View response history
- ✏️ Edit existing responses
- 🕐 Track submission timestamps

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- npm or yarn

### Installation

1. **Backend Setup**
   ```bash
   cd backend
   npm install
   npx cds-deploy --to sqlite
   npm run dev
   ```

2. **Frontend Setup** (in new terminal)
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Access Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5001/questionnaire

---

## 📊 Sample Questionnaire

The system comes pre-loaded with a **Global Customs and Trade Compliance** questionnaire featuring:

### Section 8: Global Customs and Trade Compliance

| Question | Type | Required |
|----------|------|----------|
| 8.1 Instructions | Textarea | No |
| 8.2 Manufacturing Region | Dropdown | Yes |
| 8.3 USMCA RVC Qualification | Radio | Yes |
| 8.4 Ford's Vehicle LVC | Radio | Yes |
| 8.5 RVC/LVC Documentation | File Upload | No |
| 8.6 ACESS Free Trade Agreement | Radio | Yes |

---

## 🎯 User Guide

### Filling Out a Questionnaire

1. **Navigate to Form**
   - Click "📝 Fill Questionnaire" tab
   - Questions are organized by sections

2. **Answer Questions**
   - **Text/Textarea**: Type your response
   - **Dropdown**: Select from available options
   - **Radio**: Choose one option
   - **File**: Click "Choose File" to upload

3. **Required Fields**
   - Marked with red asterisk (*)
   - Must be filled before submission

4. **Submit**
   - Click "Submit Responses" button
   - Success message appears on successful submission

### Viewing Response History

1. **Navigate to History**
   - Click "📊 View Responses" tab

2. **Review Responses**
   - See all your previous submissions
   - Organized by section
   - Shows submission timestamps

3. **Edit Responses**
   - Go back to "Fill Questionnaire"
   - Form pre-fills with existing responses
   - Make changes and resubmit

---

## 🔧 API Endpoints

### Questions
```
GET  /questionnaire/Questions
```
Returns all questions ordered by `orderIndex`

### Responses
```
GET  /questionnaire/Responses
```
Returns all responses for the current user

### Submit Responses
```
POST /questionnaire/submitResponse
```
**Body:**
```json
{
  "responses": [
    {
      "questionId": "uuid",
      "responseText": "answer",
      "fileName": "optional-file.pdf"
    }
  ]
}
```

---

## 📁 Project Structure

```
sap-cap-react-project/
├── backend/
│   ├── db/
│   │   ├── data/
│   │   │   └── questionnaire-Question.csv    # Initial questions
│   │   └── schema.cds                         # Data model
│   ├── srv/
│   │   ├── service.cds                        # Service definition
│   │   └── service.js                         # Business logic
│   └── db.sqlite                              # SQLite database
├── frontend/
│   ├── src/
│   │   ├── App.tsx                            # Main component
│   │   ├── api.ts                             # API client
│   │   ├── types.ts                           # TypeScript types
│   │   ├── styles.css                         # SAP Fiori styles
│   │   └── main.tsx                           # Entry point
│   └── package.json
└── Specs/                                      # Documentation
```

---

## 🎨 Customization

### Adding New Questions

1. **Edit CSV File**
   ```
   backend/db/data/questionnaire-Question.csv
   ```

2. **CSV Format**
   ```csv
   ID;section;questionText;questionNumber;fieldType;options;required;helpText;orderIndex
   ```

3. **Field Types**
   - `text` - Single-line input
   - `textarea` - Multi-line input
   - `dropdown` - Select with options
   - `radio` - Radio buttons with options
   - `file` - File upload

4. **Options Format** (for dropdown/radio)
   ```
   ["Option 1","Option 2","Option 3"]
   ```

5. **Redeploy Database**
   ```bash
   cd backend
   npx cds-deploy --to sqlite
   ```

### Styling Customization

Edit `frontend/src/styles.css`:

```css
:root {
  --sap-blue: #0070F2;          /* Primary color */
  --sap-blue-dark: #0054A6;     /* Hover state */
  --sap-gray-100: #F7F7F7;      /* Background */
  /* ... more variables */
}
```

---

## 🔐 Security Considerations

### Current Implementation
- Anonymous user responses
- No authentication required
- Suitable for development/demo

### Production Recommendations
1. **Add Authentication**
   - Implement XSUAA or OAuth
   - Track users by authenticated ID

2. **Add Authorization**
   - Role-based access control
   - Restrict questionnaire access

3. **Data Validation**
   - Server-side validation
   - Input sanitization
   - File upload restrictions

4. **Audit Trail**
   - Log all submissions
   - Track modifications
   - Compliance reporting

---

## 📊 Database Schema

### Question Entity
```cds
entity Question {
  key ID          : UUID;
  section         : String(200);
  questionText    : String(1000);
  questionNumber  : String(20);
  fieldType       : String(50);
  options         : String(2000);
  required        : Boolean;
  helpText        : String(500);
  orderIndex      : Integer;
}
```

### Response Entity
```cds
entity Response {
  key ID          : UUID;
  question        : Association to Question;
  questionId      : UUID;
  responseText    : String(5000);
  fileName        : String(255);
  submittedBy     : String(100);
  submittedAt     : Timestamp;
  updatedAt       : Timestamp;
  status          : String(50);
}
```

---

## 🚀 Deployment

### Local Development
```bash
# Backend
cd backend && npm run dev

# Frontend
cd frontend && npm run dev
```

### SAP Business Application Studio
```bash
git clone https://github.com/amolpwani/sap-fullstack.git
cd sap-fullstack
# Follow same local development steps
```

### Cloud Foundry
```bash
mbt build
cf deploy mta_archives/*.mtar
```

---

## 🐛 Troubleshooting

### Database Issues
```bash
# Reset database
cd backend
rm db.sqlite
npx cds-deploy --to sqlite
```

### Port Conflicts
```bash
# Kill processes
# Windows
netstat -ano | findstr :5001
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:5001 | xargs kill -9
```

### Frontend Not Loading
1. Check backend is running on port 5001
2. Check frontend proxy configuration in `vite.config.ts`
3. Clear browser cache

---

## 📚 Resources

- [SAP CAP Documentation](https://cap.cloud.sap/docs/)
- [SAP Fiori Design Guidelines](https://experience.sap.com/fiori-design/)
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

## 📄 License

MIT License - See LICENSE file for details

---

## 👥 Support

For issues and questions:
- Check `/Specs` directory for requirements
- Review this guide
- Open an issue on GitHub

---

**🎉 Happy Questionnaire Building!**

