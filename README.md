# ProgressIT - AI-Powered Chatbot Website

A modern, sleek website for ProgressIT featuring an AI-powered chatbot built with React, Vite, and DeepSeek AI.

## 🚀 Features

- **AI-Powered Chatbot**: Integrated with DeepSeek API for intelligent conversations
- **Smart Responses**: Only answers questions about ProgressIT services
- **Auto-Redirect**: Guides off-topic questions to contact sales team
- **Modern React App**: Built with Vite for lightning-fast development
- **Elegant UI**: Sleek black theme with Tailwind CSS
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Company Knowledge Base**: Trained on comprehensive ProgressIT information

## 📋 Prerequisites

Before you begin, ensure you have installed:
- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) (comes with Node.js)

## 🛠️ Installation & Running

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

The app will run on **http://localhost:3000** 🎉

## 📁 Project Structure

```
monochrome/
├── src/
│   ├── App.jsx              # Main component with chatbot
│   ├── main.jsx             # React entry point
│   └── index.css            # Tailwind CSS imports
├── index.html               # HTML template
├── package.json             # Dependencies
├── vite.config.js           # Vite configuration
├── tailwind.config.js       # Tailwind configuration
├── postcss.config.js        # PostCSS configuration
└── README.md                # This file
```

## 🤖 AI Chatbot Configuration

### DeepSeek API Key

The chatbot uses DeepSeek AI. The API key is currently hardcoded in `src/api/deepseek.js` for MVP simplicity.

**Current API Key:** `sk-6b1b04bc414e4dad860b5ee6c024b4ea`

### System Prompt

The chatbot's behavior is controlled by the system prompt in `src/config/systemPrompt.js`. This prompt:
- Contains all ProgressIT company information (from `ai.txt`)
- Instructs the AI to only answer ProgressIT-related questions
- Redirects off-topic questions to contact/book a call
- Encourages visitors to schedule consultations

To update company information:
1. Edit `ai.txt` with new company details
2. Update `src/config/systemPrompt.js` with the new information

### Chatbot Behavior

✅ **Answers questions about:**
- ProgressIT services (blockchain, casino, gaming, mobile, web development)
- Pricing estimates
- Technologies used
- Company experience and portfolio
- How to get started

❌ **Redirects these to contact sales:**
- General programming help
- Questions about other companies
- Off-topic questions
- Personal advice

**Contact Info Provided:**
- Phone: +37120531400
- Email: info@progressit.online
- Book Call: https://www.progressit.online/book-call
- Website: https://www.progressit.online

### Styling

The website uses Tailwind CSS. You can customize:
- **Colors & Layout**: Modify the Tailwind classes in `src/App.jsx`
- **Theme**: Edit `tailwind.config.js` to add custom colors, fonts, etc.
- **Custom CSS**: Add global styles to `src/index.css`

## 🌐 Building for Production

### Build the App

```bash
npm run build
```

This creates an optimized build in the `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

### Deploy

Deploy the `dist` folder to services like:
- **Vercel** (recommended for Vite)
- **Netlify**
- **GitHub Pages**
- **Cloudflare Pages**

## 📝 Available Scripts

- `npm run dev` - Start development server (port 3000)
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

## 🐛 Troubleshooting

### Port Already in Use

If port 3000 is already in use, edit `vite.config.js` and change the port:

```javascript
server: {
  port: 3001  // or any other port
}
```

### Module Not Found Errors

Make sure you've installed all dependencies:
```bash
npm install
```

### Tailwind Styles Not Working

Make sure you have the Tailwind directives in `src/index.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## 📄 License

MIT License - feel free to use this project for your own purposes!

## 🤝 Support

For questions or issues, please contact Progress IT Innovation Lab.

---

Built with ❤️ using React, Vite, and Tailwind CSS

