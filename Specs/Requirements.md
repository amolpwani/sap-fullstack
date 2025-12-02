# Requirements (System Spec)
**Owner:** Project Team
**Last Updated:** 2025-12-02 21:00:00

## 1. Overview
SAP CAP (Cloud Application Programming Model) backend with React frontend for dynamic questionnaire system. The system provides a professional SAP Fiori-inspired interface for filling out questionnaires with multiple field types, storing responses, and viewing response history.

## 2. Functional Requirements
- REQ-1.0: Backend CAP service for questionnaire system
  - RATIONALE: Provide OData API for questionnaires and responses
  - ACCEPTANCE: 
    - Backend runs on port 5001
    - OData service accessible at /questionnaire
    - CRUD operations supported for Questions and Responses
    - Custom actions for submitting responses

- REQ-2.0: React frontend with professional SAP Fiori UI
  - RATIONALE: User-friendly interface to fill questionnaires and view responses
  - ACCEPTANCE:
    - Frontend runs on port 3000
    - Professional SAP Fiori-inspired design
    - Communicates with backend API
    - Responsive design for mobile and desktop

- REQ-3.0: Dynamic form field types
  - RATIONALE: Support various question types for flexible questionnaires
  - ACCEPTANCE:
    - Text input (single line)
    - Textarea (multi-line)
    - Dropdown/Select with options
    - Radio buttons with options
    - File upload capability

- REQ-4.0: Response management
  - RATIONALE: Store and retrieve user responses
  - ACCEPTANCE:
    - Responses saved to database
    - View response history
    - Edit existing responses
    - Track submission timestamps

## 3. Non-Functional Requirements
- NFR-1.0: Performance - API response time < 500ms
- NFR-2.0: Development mode with hot-reload for both frontend and backend

## 4. Interfaces / APIs
- IF-1.0: OData V4 Service
  **Inputs:** HTTP requests (GET, POST, PUT, DELETE)
  **Outputs:** JSON responses with employee training data
  **Errors:** Standard HTTP error codes (400, 404, 500)

## 5. Data & Schemas
- SCH-1.0: Question entity
  - Fields: ID, section, questionText, questionNumber, fieldType, options, required, helpText, orderIndex
  - Storage: SQLite database (development)

- SCH-2.0: Response entity
  - Fields: ID, questionId, responseText, fileName, submittedBy, submittedAt, updatedAt, status
  - Storage: SQLite database (development)

## 6. Dependencies & Constraints
- Node.js runtime
- @sap/cds ^7.0.0
- React ^18.3.0
- Vite ^5.0.0
- SQLite3 ^5.1.7

### 6.1 Port Configuration
- Backend CAP service: Port 5001
- Frontend Vite dev server: Port 3000
- Frontend proxies `/catalog` requests to `http://localhost:5001`

### 6.2 Run Instructions
- Backend: `cd backend && npm install && npm run dev`
- Frontend: `cd frontend && npm install && npm run dev`

### 6.3 SAP Business Application Studio Compatibility
- Project is fully compatible with SAP BAS
- Can be deployed to Cloud Foundry using MTA (Multi-Target Application)
- BAS provides built-in CAP tools and extensions
- Port forwarding automatically handled by BAS

### 6.4 Deployment Options
- **Local Development:** Windows/Mac/Linux with Node.js
- **SAP BAS:** Cloud-based IDE with CAP tools pre-installed
- **Cloud Foundry:** Production deployment on SAP BTP using MTA

### 6.5 Git Repository
- Version control with Git
- Compatible with GitHub, GitLab, Azure DevOps, SAP Git
- `.gitignore` configured for Node.js and SAP projects

## 7. Test Strategy
- Unit tests: Component and service logic
- Integration tests: API endpoint validation
- E2E test cases: Full user workflow from frontend to backend

## 8. Open Questions
- Q-1: Production deployment configuration? — Status: Open

