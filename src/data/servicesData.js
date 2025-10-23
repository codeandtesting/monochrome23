// База данных всех услуг
// Можно легко расширить до 1000+ услуг

export const SERVICES_CATEGORIES = [
  'Blockchain & Web3',
  'Casino & Gaming', 
  'Mobile Development',
  'Web Development',
  'Enterprise Solutions',
  'AI & Machine Learning',
  'Cloud Services',
  'Security',
  'Other'
];

export const DEFAULT_SERVICES = [
  // Blockchain & Web3
  { id: 1, title: 'Smart Contract Development', description: 'Custom smart contracts for Ethereum, BSC, Polygon', category: 'Blockchain & Web3', active: true },
  { id: 2, title: 'DeFi Platform Development', description: 'Decentralized finance platforms with staking, lending, swapping', category: 'Blockchain & Web3', active: true },
  { id: 3, title: 'NFT Marketplace', description: 'Full-featured NFT marketplace with minting, trading, auctions', category: 'Blockchain & Web3', active: true },
  { id: 4, title: 'Web3 Wallet Integration', description: 'MetaMask, WalletConnect, Phantom integration', category: 'Blockchain & Web3', active: true },
  { id: 5, title: 'DAO Development', description: 'Decentralized autonomous organizations with governance', category: 'Blockchain & Web3', active: true },
  { id: 6, title: 'Token Creation (ERC20/BEP20)', description: 'Custom cryptocurrency tokens with tokenomics', category: 'Blockchain & Web3', active: true },
  { id: 7, title: 'Blockchain Consulting', description: 'Strategic consulting for blockchain integration', category: 'Blockchain & Web3', active: true },
  { id: 8, title: 'Cross-chain Bridges', description: 'Secure bridges between different blockchain networks', category: 'Blockchain & Web3', active: true },

  // Casino & Gaming
  { id: 9, title: 'Online Casino Platform', description: 'Full casino with slots, poker, roulette, blackjack', category: 'Casino & Gaming', active: true },
  { id: 10, title: 'Sports Betting Platform', description: 'Live betting, odds management, multiple sports', category: 'Casino & Gaming', active: true },
  { id: 11, title: 'Slot Games Development', description: 'Custom HTML5 slot games with provably fair mechanics', category: 'Casino & Gaming', active: true },
  { id: 12, title: 'Live Casino Integration', description: 'Integration with Evolution Gaming, Pragmatic Live', category: 'Casino & Gaming', active: true },
  { id: 13, title: 'Poker Room Platform', description: 'Multi-table poker with tournaments and cash games', category: 'Casino & Gaming', active: true },
  { id: 14, title: 'Crypto Casino', description: 'Cryptocurrency-based casino with instant payouts', category: 'Casino & Gaming', active: true },
  { id: 15, title: 'Gaming License Consulting', description: 'Help with Curacao, Malta, UK licensing', category: 'Casino & Gaming', active: true },
  { id: 16, title: 'P2E Game Development', description: 'Play-to-earn games with NFT integration', category: 'Casino & Gaming', active: true },
  { id: 17, title: 'Game Backend Infrastructure', description: 'Scalable servers, matchmaking, leaderboards', category: 'Casino & Gaming', active: true },

  // Mobile Development
  { id: 18, title: 'iOS App Development', description: 'Native Swift/Objective-C applications', category: 'Mobile Development', active: true },
  { id: 19, title: 'Android App Development', description: 'Native Kotlin/Java applications', category: 'Mobile Development', active: true },
  { id: 20, title: 'React Native Development', description: 'Cross-platform apps for iOS and Android', category: 'Mobile Development', active: true },
  { id: 21, title: 'Flutter Development', description: 'Beautiful cross-platform apps with Flutter', category: 'Mobile Development', active: true },
  { id: 22, title: 'Mobile Game Development', description: 'Unity, Unreal Engine mobile games', category: 'Mobile Development', active: true },
  { id: 23, title: 'App Store Optimization', description: 'ASO, keywords, screenshots, ratings', category: 'Mobile Development', active: true },
  { id: 24, title: 'Mobile App UI/UX Design', description: 'Beautiful, intuitive mobile interfaces', category: 'Mobile Development', active: true },
  { id: 25, title: 'Push Notifications Setup', description: 'Firebase, OneSignal integration', category: 'Mobile Development', active: true },

  // Web Development
  { id: 26, title: 'React.js Development', description: 'Modern React applications with hooks, context', category: 'Web Development', active: true },
  { id: 27, title: 'Next.js Development', description: 'SSR, SSG, SEO-optimized websites', category: 'Web Development', active: true },
  { id: 28, title: 'Vue.js Development', description: 'Reactive web applications with Vue 3', category: 'Web Development', active: true },
  { id: 29, title: 'Node.js Backend', description: 'RESTful APIs, GraphQL, microservices', category: 'Web Development', active: true },
  { id: 30, title: 'E-commerce Development', description: 'Shopify, WooCommerce, custom stores', category: 'Web Development', active: true },
  { id: 31, title: 'CMS Development', description: 'WordPress, Strapi, Contentful integration', category: 'Web Development', active: true },
  { id: 32, title: 'Landing Page Design', description: 'High-converting landing pages', category: 'Web Development', active: true },
  { id: 33, title: 'Web App Performance Optimization', description: 'Speed optimization, Core Web Vitals', category: 'Web Development', active: true },

  // Enterprise Solutions
  { id: 34, title: 'CRM System Development', description: 'Custom CRM for sales, marketing, support', category: 'Enterprise Solutions', active: true },
  { id: 35, title: 'ERP System Integration', description: 'SAP, Oracle, Odoo integration', category: 'Enterprise Solutions', active: true },
  { id: 36, title: 'Business Process Automation', description: 'Workflow automation, RPA', category: 'Enterprise Solutions', active: true },
  { id: 37, title: 'Data Analytics Dashboard', description: 'Real-time analytics with charts, reports', category: 'Enterprise Solutions', active: true },
  { id: 38, title: 'Custom API Development', description: 'RESTful, GraphQL, WebSocket APIs', category: 'Enterprise Solutions', active: true },
  { id: 39, title: 'Microservices Architecture', description: 'Scalable microservices with Docker, Kubernetes', category: 'Enterprise Solutions', active: true },
  { id: 40, title: 'Legacy System Modernization', description: 'Migrate old systems to modern tech', category: 'Enterprise Solutions', active: true },

  // AI & Machine Learning
  { id: 41, title: 'ChatGPT Integration', description: 'Custom AI chatbots with OpenAI, Claude', category: 'AI & Machine Learning', active: true },
  { id: 42, title: 'Computer Vision Solutions', description: 'Image recognition, object detection', category: 'AI & Machine Learning', active: true },
  { id: 43, title: 'Natural Language Processing', description: 'Text analysis, sentiment analysis, translation', category: 'AI & Machine Learning', active: true },
  { id: 44, title: 'Recommendation Systems', description: 'Personalized recommendations for e-commerce', category: 'AI & Machine Learning', active: true },
  { id: 45, title: 'Predictive Analytics', description: 'ML models for forecasting, prediction', category: 'AI & Machine Learning', active: true },

  // Cloud Services
  { id: 46, title: 'AWS Cloud Setup', description: 'EC2, S3, Lambda, RDS configuration', category: 'Cloud Services', active: true },
  { id: 47, title: 'Google Cloud Platform', description: 'GCP infrastructure, Firebase integration', category: 'Cloud Services', active: true },
  { id: 48, title: 'Azure Cloud Solutions', description: 'Microsoft Azure deployment and management', category: 'Cloud Services', active: true },
  { id: 49, title: 'Docker Containerization', description: 'Containerize applications with Docker', category: 'Cloud Services', active: true },
  { id: 50, title: 'Kubernetes Orchestration', description: 'K8s cluster setup and management', category: 'Cloud Services', active: true },

  // Security
  { id: 51, title: 'Smart Contract Audit', description: 'Security audit for blockchain contracts', category: 'Security', active: true },
  { id: 52, title: 'Penetration Testing', description: 'Security testing for web/mobile apps', category: 'Security', active: true },
  { id: 53, title: 'SSL/TLS Setup', description: 'HTTPS, security certificates configuration', category: 'Security', active: true },
  { id: 54, title: 'Authentication Systems', description: 'OAuth, JWT, 2FA implementation', category: 'Security', active: true },
  { id: 55, title: 'GDPR Compliance', description: 'Data protection and privacy compliance', category: 'Security', active: true },

  // Other
  { id: 56, title: 'Technical Consulting', description: 'Technology strategy and consulting', category: 'Other', active: true },
  { id: 57, title: 'Code Review', description: 'Professional code review and refactoring', category: 'Other', active: true },
  { id: 58, title: 'DevOps Setup', description: 'CI/CD pipelines, deployment automation', category: 'Other', active: true },
  { id: 59, title: 'Database Design', description: 'PostgreSQL, MongoDB, MySQL optimization', category: 'Other', active: true },
  { id: 60, title: 'API Integration', description: 'Third-party API integration (Stripe, PayPal, etc)', category: 'Other', active: true },
];

// Функция для получения следующего ID
export const getNextServiceId = (services) => {
  if (services.length === 0) return 1;
  return Math.max(...services.map(s => s.id)) + 1;
};

