# Clean Minimalistic Template - Art Marketplace & Community Platform

A comprehensive full-stack web application for artists and art enthusiasts to showcase, discover, and trade artwork.

![Clean Minimalistic Template](https://img.shields.io/badge/Status-Live-brightgreen)
![License](https://img.shields.io/badge/License-MIT-blue.svg)
![Author](https://img.shields.io/badge/Author-Youssef%20Mohamed%20Ali-orange)

## 🎨 About Clean Minimalistic Template

Clean Minimalistic Template is a modern art marketplace that connects artists with art lovers worldwide. The platform provides a space for artists to showcase their work, build communities, and sell their creations while offering art enthusiasts a curated experience to discover and purchase unique pieces.

## ✨ Features

- **Artist Portfolio Management**: Upload and showcase artwork with detailed descriptions
- **Art Marketplace**: Browse, search, and purchase artwork
- **Community Features**: Connect with artists and art enthusiasts
- **User Authentication**: Secure registration and login system
- **Responsive Design**: Optimized for desktop and mobile devices
- **Real-time Updates**: Dynamic content updates and notifications

## 🚀 Live Demo

Visit the live platform: [http://217.154.119.33/](http://217.154.119.33/)

## 🛠️ Technology Stack

### Frontend
- **React.js** - Modern JavaScript library for building user interfaces
- **React Router** - Client-side routing
- **CSS3** - Custom styling with responsive design
- **Axios** - HTTP client for API communication

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **SQLite** - Lightweight database for data storage
- **Multer** - File upload handling
- **CORS** - Cross-origin resource sharing

### Deployment
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Linux Server** - Production hosting

## 📋 Prerequisites

Before running this project, make sure you have the following installed:
- Node.js (v14 or higher)
- npm or yarn
- Git

## 🔧 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/clean-minimalistic-template.git
   cd clean-minimalistic-template
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   cd backend
   npm install
   
   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Set up the database**
   ```bash
   cd ../backend
   node setup_database.js
   ```

4. **Start the development servers**
   ```bash
   # Start backend server (from backend directory)
   npm start
   
   # In a new terminal, start frontend (from frontend directory)
   npm start
   ```

5. **Access the application**
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:5000`

## 🐳 Docker Deployment

For production deployment using Docker:

```bash
# Build and run with Docker Compose
docker-compose up --build

# Run in detached mode
docker-compose up -d
```

## 📁 Project Structure

```
clean-minimalistic-template/
├── frontend/           # React.js frontend application
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── pages/      # Page components
│   │   ├── services/   # API service functions
│   │   └── styles/     # CSS files
├── backend/            # Node.js backend API
│   ├── routes/         # API routes
│   ├── database/       # Database setup and migrations
│   └── uploads/        # File upload storage
├── docker-compose.yml  # Docker orchestration
├── Dockerfile         # Docker container configuration
└── README.md          # Project documentation
```

## 🤝 Contributing

We welcome contributions to Clean Minimalistic Template! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### Copyright Notice
© 2025 Youssef Mohamed Ali. All rights reserved.

This software is protected by copyright law. Unauthorized use, reproduction, or distribution outside the terms of the MIT License may result in legal action.

## 👨‍💻 Author

**Youssef Mohamed Ali**
- GitHub: [@Lina4Life](https://github.com/Lina4Life)
- Project: [Clean Minimalistic Template](https://github.com/Lina4Life/clean-minimalistic-template)

## 🙏 Acknowledgments

- Thanks to all contributors and the open-source community
- Inspired by the need to democratize art and connect artists globally
- Built with passion for art and technology

## 📞 Support

For support, bug reports, or feature requests:
- Open an issue on GitHub
- Check the documentation in the `/docs` folder
- Review the copyright and licensing information in [COPYRIGHT.md](COPYRIGHT.md)

---

**Made with ❤️ by Youssef Mohamed Ali**

*Clean Minimalistic Template - Where Art Meets Technology*
