# GraphQL Transaction Manager

A modern, full-stack financial transaction management application built with GraphQL, React, and Node.js. This application provides a comprehensive solution for managing personal finances with real-time data visualization and secure authentication.

## 🌟 Features

### Core Functionality
- **Transaction Management**: Create, read, update, and delete financial transactions
- **Category Organization**: Organize transactions by categories (saving, expense, investment)
- **Payment Type Tracking**: Support for cash and card payment methods
- **User Authentication**: Secure user registration and login system
- **Real-time Updates**: GraphQL subscriptions for live data updates
- **Data Visualization**: Interactive charts and graphs using Chart.js

### Technical Features
- **GraphQL API**: Modern, efficient API with type-safe queries and mutations
- **Session Management**: Secure user sessions with MongoDB storage
- **Passport Integration**: Robust authentication with Passport.js
- **Automated Tasks**: Cron job scheduling for periodic operations
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Hot Reload**: Development environment with live reloading

## 🏗️ Architecture

```
graphql_transaction_manager/
├── backend/                 # Node.js GraphQL server
│   ├── db/                 # Database connection
│   ├── models/             # Mongoose data models
│   │   ├── user.model.js   # User schema
│   │   └── transaction.model.js # Transaction schema
│   ├── resolvers/          # GraphQL resolvers
│   ├── typeDefs/           # GraphQL type definitions
│   ├── passport/           # Authentication configuration
│   ├── dummyData/          # Sample data for development
│   ├── cron.js             # Scheduled tasks
│   └── index.js            # Server entry point
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # Reusable React components
│   │   ├── pages/          # Application pages
│   │   ├── graphql/        # GraphQL queries and mutations
│   │   └── utils/          # Utility functions
│   ├── public/             # Static assets
│   └── dist/               # Production build
├── package.json            # Project dependencies
└── .env                    # Environment variables
```

## 🚀 Tech Stack

### Backend
- **[Node.js](https://nodejs.org/)** - Runtime environment
- **[Apollo Server](https://www.apollographql.com/docs/apollo-server/)** - GraphQL server implementation
- **[Express.js](https://expressjs.com/)** - Web application framework
- **[MongoDB](https://www.mongodb.com/)** - NoSQL database
- **[Mongoose](https://mongoosejs.com/)** - MongoDB object modeling
- **[Passport.js](http://www.passportjs.org/)** - Authentication middleware
- **[GraphQL](https://graphql.org/)** - Query language and runtime

### Frontend
- **[React 19](https://react.dev/)** - UI library
- **[Apollo Client](https://www.apollographql.com/docs/react/)** - GraphQL client
- **[React Router](https://reactrouter.com/)** - Client-side routing
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Chart.js](https://www.chartjs.org/)** - Data visualization
- **[Framer Motion](https://www.framer.com/motion/)** - Animation library
- **[Vite](https://vitejs.dev/)** - Build tool and dev server

### Development Tools
- **[Nodemon](https://nodemon.io/)** - Development server with auto-restart
- **[ESLint](https://eslint.org/)** - Code linting
- **[PostCSS](https://postcss.org/)** - CSS processing

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas)
- **Git**

## 🔧 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd graphql_transaction_manager
```

### 2. Install Dependencies
```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### 3. Environment Configuration
Create a `.env` file in the root directory:

```env
# Database
MONGO_URI=mongodb://localhost:27017/transaction-manager
# or for MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/transaction-manager

# Session
SESSION_SECRET=your-super-secure-session-secret

# Server
PORT=4000
NODE_ENV=development

# Google AI (if using AI features)
GOOGLE_AI_API_KEY=your-google-ai-api-key
```

Create a `.env` file in the `frontend` directory:
```env
VITE_API_URL=http://localhost:4000/graphql
```

### 4. Start the Application

#### Development Mode
```bash
# Start backend server
npm run dev

# In a new terminal, start frontend
cd frontend
npm run dev
```

#### Production Mode
```bash
# Build the application
npm run build

# Start production server
npm start
```

## 🎯 Usage

### Access the Application
- **Frontend**: http://localhost:5173 (development)
- **GraphQL Playground**: http://localhost:4000/graphql
- **Backend API**: http://localhost:4000

### Key Features Walkthrough

1. **User Registration/Login**
   - Create an account or login with existing credentials
   - Secure session management with MongoDB storage

2. **Transaction Management**
   - Add new transactions with description, amount, and category
   - Choose payment method (cash or card)
   - Categorize as saving, expense, or investment

3. **Dashboard Analytics**
   - View transaction summaries with interactive charts
   - Filter transactions by category, date, or payment type
   - Real-time updates as data changes

4. **Profile Management**
   - Update user profile information
   - View transaction history and statistics

## 📊 GraphQL Schema

### Types
```graphql
type User {
  id: ID!
  username: String!
  email: String!
  transactions: [Transaction!]!
}

type Transaction {
  id: ID!
  description: String!
  amount: Float!
  category: CategoryType!
  paymentType: PaymentType!
  date: String!
  user: User!
}

enum CategoryType {
  SAVING
  EXPENSE
  INVESTMENT
}

enum PaymentType {
  CASH
  CARD
}
```

### Example Queries
```graphql
# Get all transactions
query GetTransactions {
  transactions {
    id
    description
    amount
    category
    paymentType
    date
  }
}

# Add new transaction
mutation CreateTransaction($input: TransactionInput!) {
  createTransaction(input: $input) {
    id
    description
    amount
    category
  }
}
```

## 🔐 Authentication

The application uses **Passport.js** with session-based authentication:

- Sessions are stored in MongoDB using `connect-mongodb-session`
- User passwords are hashed using `bcryptjs`
- GraphQL context includes user information for authorized requests
- Protected routes require valid authentication

## 📈 Performance Features

- **GraphQL Efficiency**: Only fetch required data fields
- **Real-time Updates**: Subscriptions for live data synchronization
- **Caching**: Apollo Client intelligent caching
- **Optimized Builds**: Vite for fast development and optimized production builds
- **Database Indexing**: Optimized MongoDB queries with proper indexing

## 🎨 UI/UX Features

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Dark/Light Theme**: User preference-based theming
- **Smooth Animations**: Framer Motion for enhanced user experience
- **Interactive Charts**: Real-time data visualization with Chart.js
- **Toast Notifications**: User feedback with react-hot-toast
- **Loading States**: Proper loading indicators throughout the app

## 🛠️ Development

### Project Structure Best Practices
- **Modular Architecture**: Separated concerns between backend and frontend
- **GraphQL Schema-First**: Type-safe development with GraphQL
- **Component-Based**: Reusable React components
- **Environment Configuration**: Flexible deployment configurations

### Available Scripts
```bash
npm run dev      # Start development server with nodemon
npm run start    # Start production server
npm run build    # Build both backend and frontend for production
```

## 🚀 Deployment

### Deploy to Vercel (Recommended for Frontend)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Deploy Backend to Railway/Render
1. Create account and connect repository
2. Set environment variables
3. Deploy with automatic builds

### Environment Variables for Production
```env
MONGO_URI=your-production-mongodb-uri
SESSION_SECRET=your-production-session-secret
NODE_ENV=production
PORT=4000
```

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines
- Follow ESLint configuration
- Write meaningful commit messages
- Add tests for new features
- Update documentation for API changes

## 📝 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Apollo GraphQL** team for excellent GraphQL tools
- **React** team for the amazing frontend library
- **MongoDB** for the flexible database solution
- **Tailwind CSS** for the utility-first CSS framework
- **Chart.js** for beautiful data visualizations

## 📞 Support

For support, email your-email@example.com or create an issue in the GitHub repository.

---

**Built with ❤️ by [Your Name]**

> A modern solution for personal financial management with the power of GraphQL and React.