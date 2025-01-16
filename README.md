# SlinkIt 🔗✨

A modern URL shortener that makes your long URLs short and sweet! 

## Features 🚀

- **Custom Aliases** 📝 - Create memorable short URLs with custom aliases
- **URL Management** 🎯 - Track and manage all your shortened URLs
- **User Authentication** 🔐 - Secure login system to manage your links
- **Instant Redirection** ⚡ - Lightning-fast redirects to your target URLs
- **Responsive Design** 📱 - Works beautifully across all devices

## Tech Stack 💻

### Frontend 🎨
- React
- Shadcn UI
- React Router
- React Hook Form
- Tailwind CSS
- Axios

### Backend ⚙️
- Express.js
- Prisma
- CORS
- Cookie Parser
- dotenv
- JWT
- Nodemailer

## Getting Started 🌟

### Prerequisites
- Node.js
- PostgreSQL
- npm/yarn

### Installation 📥

1. Clone the repository
```bash
git clone https://github.com/pratyush2374/SlinkIt.git
```

2. Frontend Setup 🎨
```bash
cd frontend
npm install
npm run build
npm start
```
Server will run on port 5173

3. Backend Setup ⚙️
```bash
cd backend
npm install
npm start
```
Server will run on port 3000

### Environment Variables 🔐

#### Frontend (.env)
```
VITE_BACKEND_URL=http://localhost:3000
VITE_FRONTEND_URL=http://localhost:5173
VITE_FRONTEND_URL_PLAIN=localhost:5173
```

#### Backend (.env)
```
PORT=3000
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/SlinkIt"
CLIENT_URL=http://localhost:5173
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_app_specific_password
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
FORGOT_PASSWORD_SECRET=your_forgot_password_secret
```

## Contributing 🤝

I'm always looking for ways to make SlinkIt better! Feel free to:
- Open issues
- Submit PRs
- Suggest new features
- Report bugs

Let's make URL shortening more awesome together! Feel free to reach out if you want to collaborate.

## Author ✍️

**Pratyush Sharma**

## Acknowledgments 🙏

Thanks to all the amazing open-source libraries and tools that made this project possible!

---

Made with ❤️ and JavaScript