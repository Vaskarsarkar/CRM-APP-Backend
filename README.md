CRM Application - BackendThis is the backend server for a Customer Relationship Management (CRM) System. It provides a robust RESTful API to handle user authentication, role-based access control, and a ticket management system for tracking and resolving customer issues.🛠️ Tech StackRuntime: Node.jsFramework: Express.jsDatabase: MongoDB (with Mongoose ODM)Security: JWT (JSON Web Tokens) & BcryptEnvironment Management: Dotenv✨ Key FeaturesRole-Based Access Control (RBAC): Distinct workflows for Customers, Engineers, and Admins.Authentication & Authorization: Secure login/signup with encrypted passwords and token-based session management.Ticket Lifecycle Management: * Customers can create and view tickets.Engineers can update ticket status and details.Admins have full control over users and ticket assignments.Status Tracking: Real-time updates for tickets (OPEN, IN_PROGRESS, BLOCKED, CLOSED).🚦 Getting Started1. PrerequisitesNode.js installed (v14+ recommended)MongoDB installed locally or a MongoDB Atlas URI2. InstallationClone the repository and install dependencies:Bashgit clone https://github.com/Vaskarsarkar/CRM-APP-Backend.git
cd CRM-APP-Backend
npm install
3. Environment SetupCreate a .env file in the root directory and add the following:Code snippetPORT=8080
DB_URL=mongodb://localhost/crm_db
SECRET=your_jwt_secret_key
4. Running the AppBash# Start the server
npm start
The server will be running at http://localhost:8080.📑 API Endpoints (Quick Reference)MethodEndpointDescriptionPOST/crm/api/v1/auth/signupRegister a new userPOST/crm/api/v1/auth/signinLogin and receive JWTGET/crm/api/v1/usersGet all users (Admin only)GET/crm/api/v1/ticketsView all tickets (Filtered by role)POST/crm/api/v1/ticketsCreate a new ticket (Customer)PUT/crm/api/v1/tickets/:idUpdate ticket details📁 Project StructurePlaintext├── configs/        # Database and App configurations
├── controllers/    # Request handling logic
├── middlewares/    # Auth and validation checks
├── models/         # Mongoose schemas (User, Ticket)
├── routes/         # API route definitions
├── utils/          # Constants and helper functions
└── server.js       # Entry point
