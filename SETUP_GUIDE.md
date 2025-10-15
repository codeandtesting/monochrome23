# ✨ ProgressIT AI Chatbot - Setup Complete!

## 🎉 What's Been Done

Your website now has an **AI-powered chatbot** using **DeepSeek API** that:

✅ **Only talks about ProgressIT** - Uses all the company information from `ai.txt`  
✅ **Smart redirects** - When people ask off-topic questions, it redirects them to:
   - 📞 Call: +37120531400
   - ✉️ Email: info@progressit.online  
   - 📅 Book Call: https://www.progressit.online/book-call  
   - 🌐 Website: https://www.progressit.online

✅ **Trained on your company** - Knows about:
   - All services (Blockchain, Casino, Gaming, Mobile, Web)
   - Pricing estimates
   - Technologies
   - Contact information
   - 15+ years experience, 500+ projects

---

## 🚀 How to Run

**Option 1: Simple**
```bash
npm run dev
```

**Option 2: Quick Start**
```bash
start.bat
```

Then open: **http://localhost:3000** (or 3001 if 3000 is busy)

---

## 🤖 How the AI Works

### Smart Behavior:

**✅ GOOD Questions (AI answers):**
- "Do you build DeFi platforms?"
- "How much does an NFT marketplace cost?"
- "What technologies do you use?"
- "Tell me about ProgressIT's casino development"
- "Can you help with mobile app development?"

**❌ OFF-TOPIC Questions (AI redirects to contact):**
- "How do I learn Python?"
- "What's the weather?"
- "Tell me about Bitcoin"
- "Who is the president?"

### Example Conversation:

**User:** "Do you build crypto casinos?"  
**AI:** "Yes! ProgressIT specializes in crypto casino development including provably fair games, white-label solutions, and complete platforms. We've built 50+ casino platforms with features like KYC/AML, multi-currency support, and live dealer integration. Crypto casino projects typically range from $100,000 - $1,000,000+. Would you like to schedule a call to discuss your casino project? Book here: https://www.progressit.online/book-call"

**User:** "How do I mine Bitcoin?"  
**AI:** "I'm specifically here to help you learn about ProgressIT and our software development services. For questions outside of our services, I'd recommend scheduling a call with our team:

📞 **Call us:** +37120531400  
📅 **Book a consultation:** https://www.progressit.online/book-call  
✉️ **Email:** info@progressit.online

Is there anything about ProgressIT's services I can help you with?"

---

## 📁 Files Created/Modified

### New Files:
- `src/api/deepseek.js` - DeepSeek API integration
- `src/config/systemPrompt.js` - AI system prompt with all company info
- `SETUP_GUIDE.md` - This file

### Modified Files:
- `src/App.jsx` - Updated to use DeepSeek AI
- `package.json` - Added axios dependency
- `README.md` - Updated with AI configuration info

### Existing (Used for Training):
- `ai.txt` - Complete ProgressIT company information (1600 lines!)

---

## 🎨 Customization

### To Update Company Information:

1. Edit `ai.txt` with new details
2. Copy relevant sections to `src/config/systemPrompt.js`
3. Restart the dev server

### To Change AI Behavior:

Edit `src/config/systemPrompt.js` - this controls:
- What questions the AI answers
- How it redirects off-topic questions
- Contact information it provides
- Tone and style of responses

### To Change API Key:

Edit `src/api/deepseek.js` line 4:
```javascript
const API_KEY = 'your-new-api-key-here';
```

---

## 🔧 Technical Details

**Stack:**
- React 18
- Vite 5
- Tailwind CSS
- DeepSeek AI API
- Axios

**API:** DeepSeek Chat Model (`deepseek-chat`)
- Temperature: 0.7 (balanced creativity)
- Max Tokens: 500 (concise responses)
- Context: Full conversation history + system prompt

**Security Note:**  
For production, move the API key to environment variables and set up a backend proxy to hide it from the client side.

---

## 🌐 The Website is LIVE!

Open your browser to:  
**http://localhost:3000**

Try asking:
- "What services do you offer?"
- "How much does a DeFi platform cost?"
- "Do you develop casino games?"
- "Tell me about ProgressIT"
- "How do I learn Python?" (watch it redirect!)

---

## 📞 Contact Info (Auto-Provided by AI)

The chatbot automatically provides these when needed:
- **Phone:** +37120531400
- **Email:** info@progressit.online
- **Book Call:** https://www.progressit.online/book-call
- **Get Quote:** https://www.progressit.online/get-quote
- **Website:** https://www.progressit.online

---

## 🎯 Next Steps (Optional)

1. **Test the chatbot** - Ask it various questions
2. **Customize the design** - Edit `src/App.jsx` Tailwind classes
3. **Add more features** - Contact forms, pricing calculator, etc.
4. **Deploy** - Vercel, Netlify, or your preferred platform

---

## 🚀 Ready to Deploy?

```bash
npm run build
```

This creates a production build in `dist/` folder ready to deploy!

---

**Enjoy your AI-powered ProgressIT chatbot! 🎉**

