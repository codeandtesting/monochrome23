# 🚀 Production Roadmap: От Презентации к Real SaaS

## 📊 Текущее состояние (MVP Presentation)

### ❌ Критические проблемы:
1. **Нет backend** - все в localStorage (данные теряются при очистке браузера)
2. **Hardcoded API key** - DeepSeek API key в коде (security риск)
3. **Нет аутентификации** - любой может зайти в dashboard
4. **Нет persistence** - все данные только локально
5. **Нет реальных поддоменов** - все роуты на одном домене
6. **Нет платежей** - монетизация не реализована
7. **Нет тестов** - ручное тестирование
8. **Нет CI/CD** - деплой вручную
9. **Hardcoded значения** - много магических чисел и строк
10. **Нет error handling** - приложение падает при ошибках

### ✅ Что уже работает:
- React UI/UX (современный дизайн)
- AI Wizard flow
- Manual Onboarding flow
- AI Suggestions system
- Color schemes (12 штук)
- Dashboard layout
- Quick Edit functionality
- Chat interface

---

## 🎯 Целевое состояние (Production SaaS)

### ✅ Production требования:
1. ✅ **Backend API** - Node.js + Express + PostgreSQL
2. ✅ **User Authentication** - JWT + Refresh tokens
3. ✅ **Real Persistence** - база данных вместо localStorage
4. ✅ **Multi-tenancy** - изоляция данных пользователей
5. ✅ **Subdomain System** - каждый сайт на поддомене
6. ✅ **Payment Integration** - Stripe для подписок
7. ✅ **Email Service** - SendGrid/Resend для уведомлений
8. ✅ **File Upload** - S3/Cloudinary для изображений
9. ✅ **Rate Limiting** - защита API
10. ✅ **Monitoring** - Sentry + Analytics
11. ✅ **CI/CD Pipeline** - GitHub Actions
12. ✅ **Testing** - Unit + Integration + E2E
13. ✅ **Documentation** - API docs + User guides
14. ✅ **Security** - HTTPS, CORS, sanitization

---

## 📋 ДЕТАЛЬНЫЙ ПЛАН РЕАЛИЗАЦИИ

---

## PHASE 0: Подготовка и Planning (1 неделя)

### Шаг 0.1: Анализ и аудит кода
**Время:** 1 день

**Задачи:**
- [ ] Проверить все файлы на hardcoded значения
- [ ] Составить список всех TODO и FIXME
- [ ] Идентифицировать все localStorage использования
- [ ] Найти все API calls (DeepSeek)
- [ ] Проверить все секреты в коде

**Инструменты:**
```bash
# Найти hardcoded значения
grep -r "localhost:" src/
grep -r "sk-" src/  # API keys
grep -r "TODO\|FIXME" src/

# Найти localStorage
grep -r "localStorage" src/

# Проверить package.json зависимости
npm audit
```

**Результат:** Документ `AUDIT.md` со списком проблем

---

### Шаг 0.2: Setup Git & Version Control
**Время:** 2 часа

**Задачи:**
- [ ] Создать `.gitignore` правильно
- [ ] Убедиться что нет секретов в git
- [ ] Создать branches: `main`, `develop`, `staging`
- [ ] Настроить branch protection rules

**`.gitignore`:**
```
# Dependencies
node_modules/
.pnp
.pnp.js

# Testing
coverage/

# Production
build/
dist/

# Environment
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Secrets
*.pem
*.key
config/secrets.js
```

**Git workflow:**
```bash
git checkout -b develop
git checkout -b staging
git push -u origin develop staging
```

---

### Шаг 0.3: Environment Variables Setup
**Время:** 1 час

**Задачи:**
- [ ] Создать `.env.example` для документации
- [ ] Переместить все секреты в `.env`
- [ ] Настроить Vite env variables
- [ ] Создать separate `.env` для dev/staging/prod

**Файлы:**

**`.env.example`:**
```env
# API URLs
VITE_API_URL=http://localhost:5000/api
VITE_FRONTEND_URL=http://localhost:3000

# DeepSeek AI
VITE_DEEPSEEK_API_KEY=sk-your-key-here

# Feature Flags
VITE_ENABLE_AI_SUGGESTIONS=true
VITE_ENABLE_PAYMENTS=false
VITE_ENABLE_ANALYTICS=false

# App Config
VITE_APP_NAME=Monochrome
VITE_MAX_SITES_FREE=1
VITE_MAX_SITES_PRO=10
```

**`.env.development`:**
```env
VITE_API_URL=http://localhost:5000/api
VITE_FRONTEND_URL=http://localhost:3000
VITE_ENABLE_AI_SUGGESTIONS=true
VITE_ENABLE_PAYMENTS=false
```

**`.env.production`:**
```env
VITE_API_URL=https://api.monochrome.ai
VITE_FRONTEND_URL=https://monochrome.ai
VITE_ENABLE_AI_SUGGESTIONS=true
VITE_ENABLE_PAYMENTS=true
VITE_ENABLE_ANALYTICS=true
```

**Обновить код:**
```javascript
// src/config/env.js
export const ENV = {
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  FRONTEND_URL: import.meta.env.VITE_FRONTEND_URL || 'http://localhost:3000',
  DEEPSEEK_API_KEY: import.meta.env.VITE_DEEPSEEK_API_KEY,
  FEATURES: {
    AI_SUGGESTIONS: import.meta.env.VITE_ENABLE_AI_SUGGESTIONS === 'true',
    PAYMENTS: import.meta.env.VITE_ENABLE_PAYMENTS === 'true',
    ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === 'true'
  },
  APP_NAME: import.meta.env.VITE_APP_NAME || 'Monochrome',
  LIMITS: {
    MAX_SITES_FREE: parseInt(import.meta.env.VITE_MAX_SITES_FREE) || 1,
    MAX_SITES_PRO: parseInt(import.meta.env.VITE_MAX_SITES_PRO) || 10
  }
};
```

---

### Шаг 0.4: Купить домен и настроить DNS
**Время:** 2 часа

**Задачи:**
- [ ] Купить домен `monochrome.ai` (Namecheap/GoDaddy)
- [ ] Создать Cloudflare account
- [ ] Перенести nameservers на Cloudflare
- [ ] Настроить DNS записи

**DNS Records на Cloudflare:**
```
Type    Name    Content                     Proxy   TTL
A       @       76.76.21.21 (Vercel IP)    Yes     Auto
CNAME   www     monochrome.ai               Yes     Auto
CNAME   *       monochrome.ai               Yes     Auto (для поддоменов)
TXT     @       v=spf1 include:_spf...      No      Auto
```

**Стоимость:**
- Домен: ~$12/год
- Cloudflare: Бесплатно

---

### Шаг 0.5: Создать проекты на хостингах
**Время:** 3 часа

**Задачи:**
- [ ] Создать Vercel account (для frontend)
- [ ] Создать Railway/Render account (для backend)
- [ ] Создать Supabase account (для PostgreSQL)
- [ ] Создать Upstash account (для Redis)
- [ ] Создать Cloudinary account (для images)

**Аккаунты:**
1. **Vercel** - https://vercel.com
   - Подключить GitHub repo
   - Настроить custom domain

2. **Railway** - https://railway.app
   - Создать new project
   - Добавить PostgreSQL plugin

3. **Supabase** - https://supabase.com
   - Создать organization
   - Создать project

4. **Upstash** - https://upstash.com
   - Создать Redis database

5. **Cloudinary** - https://cloudinary.com
   - Получить API credentials

---

## PHASE 1: Backend Foundation (3-4 недели)

---

### Шаг 1.1: Инициализация Backend проекта
**Время:** 1 день

**Структура:**
```
monochrome/
├── frontend/          # текущий React app
│   ├── src/
│   ├── public/
│   └── package.json
│
└── backend/           # новый Node.js backend
    ├── src/
    │   ├── config/
    │   │   ├── database.js
    │   │   ├── redis.js
    │   │   └── env.js
    │   ├── models/
    │   │   ├── User.js
    │   │   ├── Site.js
    │   │   ├── ChatMessage.js
    │   │   └── Subscription.js
    │   ├── routes/
    │   │   ├── auth.js
    │   │   ├── sites.js
    │   │   ├── chat.js
    │   │   └── subscriptions.js
    │   ├── controllers/
    │   │   ├── authController.js
    │   │   ├── siteController.js
    │   │   └── chatController.js
    │   ├── middleware/
    │   │   ├── auth.js
    │   │   ├── validation.js
    │   │   ├── rateLimit.js
    │   │   └── errorHandler.js
    │   ├── services/
    │   │   ├── emailService.js
    │   │   ├── deploymentService.js
    │   │   ├── dnsService.js
    │   │   └── aiService.js
    │   ├── utils/
    │   │   ├── logger.js
    │   │   ├── validators.js
    │   │   └── helpers.js
    │   └── server.js
    ├── tests/
    │   ├── unit/
    │   ├── integration/
    │   └── e2e/
    ├── .env.example
    ├── .gitignore
    ├── package.json
    ├── Dockerfile
    └── docker-compose.yml
```

**Команды:**
```bash
cd monochrome
mkdir backend
cd backend
npm init -y

# Установить зависимости
npm install express cors dotenv
npm install pg sequelize  # PostgreSQL ORM
npm install redis ioredis  # Redis client
npm install jsonwebtoken bcryptjs  # Auth
npm install helmet express-rate-limit  # Security
npm install morgan winston  # Logging
npm install joi  # Validation
npm install axios  # HTTP client

# Dev dependencies
npm install -D nodemon
npm install -D jest supertest  # Testing
npm install -D eslint prettier
```

**package.json scripts:**
```json
{
  "scripts": {
    "dev": "nodemon src/server.js",
    "start": "node src/server.js",
    "test": "jest --coverage",
    "test:watch": "jest --watch",
    "lint": "eslint src/",
    "format": "prettier --write 'src/**/*.js'"
  }
}
```

---

### Шаг 1.2: Setup Database (PostgreSQL)
**Время:** 2 дня

**Задачи:**
- [ ] Подключиться к Supabase/Railway PostgreSQL
- [ ] Создать Sequelize models
- [ ] Написать migrations
- [ ] Создать seeders для тестовых данных

**`src/config/database.js`:**
```javascript
const { Sequelize } = require('sequelize');
const logger = require('../utils/logger');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: (msg) => logger.debug(msg),
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    logger.info('✅ Database connected successfully');

    // Sync models (только в dev!)
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      logger.info('✅ Database synced');
    }
  } catch (error) {
    logger.error('❌ Database connection failed:', error);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
```

**`src/models/User.js`:**
```javascript
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  username: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    validate: {
      isAlphanumeric: true,
      len: [3, 50]
    }
  },
  firstName: {
    type: DataTypes.STRING
  },
  lastName: {
    type: DataTypes.STRING
  },
  emailVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  role: {
    type: DataTypes.ENUM('user', 'admin'),
    defaultValue: 'user'
  }
}, {
  timestamps: true,
  underscored: true,
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        user.password = await bcrypt.hash(user.password, 12);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        user.password = await bcrypt.hash(user.password, 12);
      }
    }
  }
});

// Instance methods
User.prototype.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

User.prototype.toJSON = function() {
  const values = { ...this.get() };
  delete values.password;
  return values;
};

module.exports = User;
```

**`src/models/Site.js`:**
```javascript
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Site = sequelize.define('Site', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  slug: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  subdomain: {
    type: DataTypes.STRING(100),
    unique: true
  },
  customDomain: {
    type: DataTypes.STRING
  },

  // Site data (JSONB для гибкости)
  hero: {
    type: DataTypes.JSONB,
    defaultValue: {}
  },
  services: {
    type: DataTypes.JSONB,
    defaultValue: { enabled: true, list: [] }
  },
  contacts: {
    type: DataTypes.JSONB,
    defaultValue: {}
  },
  social: {
    type: DataTypes.JSONB,
    defaultValue: {}
  },
  stats: {
    type: DataTypes.JSONB,
    defaultValue: { enabled: false, items: [] }
  },
  testimonials: {
    type: DataTypes.JSONB,
    defaultValue: { enabled: false, items: [] }
  },
  portfolio: {
    type: DataTypes.JSONB,
    defaultValue: []
  },

  // Design
  design: {
    type: DataTypes.JSONB,
    defaultValue: {
      colorScheme: 'default',
      activeLanding: 'client'
    }
  },

  // SEO
  seo: {
    type: DataTypes.JSONB,
    defaultValue: {}
  },

  // Status
  status: {
    type: DataTypes.ENUM('draft', 'published', 'archived'),
    defaultValue: 'draft'
  },
  deploymentStatus: {
    type: DataTypes.ENUM('pending', 'deploying', 'deployed', 'failed'),
    defaultValue: 'pending'
  },
  deploymentUrl: {
    type: DataTypes.TEXT
  },
  publishedAt: {
    type: DataTypes.DATE
  }
}, {
  timestamps: true,
  underscored: true,
  indexes: [
    { fields: ['user_id'] },
    { fields: ['slug'] },
    { fields: ['subdomain'] },
    { fields: ['status'] }
  ]
});

module.exports = Site;
```

**Создать associations:**
```javascript
// src/models/index.js
const User = require('./User');
const Site = require('./Site');
const ChatMessage = require('./ChatMessage');
const Subscription = require('./Subscription');

// Relationships
User.hasMany(Site, { foreignKey: 'userId', as: 'sites' });
Site.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Site.hasMany(ChatMessage, { foreignKey: 'siteId', as: 'messages' });
ChatMessage.belongsTo(Site, { foreignKey: 'siteId', as: 'site' });

User.hasOne(Subscription, { foreignKey: 'userId', as: 'subscription' });
Subscription.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = {
  User,
  Site,
  ChatMessage,
  Subscription
};
```

---

### Шаг 1.3: Authentication System (JWT)
**Время:** 3 дня

**Задачи:**
- [ ] Signup endpoint
- [ ] Login endpoint
- [ ] Logout endpoint
- [ ] Refresh token mechanism
- [ ] Email verification
- [ ] Password reset
- [ ] JWT middleware

**`src/routes/auth.js`:**
```javascript
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authMiddleware } = require('../middleware/auth');
const { validate } = require('../middleware/validation');
const { signupSchema, loginSchema } = require('../utils/validators');

// Public routes
router.post('/signup', validate(signupSchema), authController.signup);
router.post('/login', validate(loginSchema), authController.login);
router.post('/refresh-token', authController.refreshToken);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password/:token', authController.resetPassword);
router.get('/verify-email/:token', authController.verifyEmail);

// Protected routes
router.post('/logout', authMiddleware, authController.logout);
router.get('/me', authMiddleware, authController.getCurrentUser);
router.put('/me', authMiddleware, authController.updateProfile);

module.exports = router;
```

**`src/controllers/authController.js`:**
```javascript
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { User } = require('../models');
const emailService = require('../services/emailService');
const logger = require('../utils/logger');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m';
const REFRESH_TOKEN_EXPIRES_IN = '7d';

// Generate tokens
const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN
  });

  const refreshToken = jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN
  });

  return { accessToken, refreshToken };
};

exports.signup = async (req, res, next) => {
  try {
    const { email, password, username, firstName, lastName } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email }, { username }]
      }
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email or username already exists'
      });
    }

    // Create user
    const user = await User.create({
      email,
      password,
      username,
      firstName,
      lastName
    });

    // Generate email verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    // TODO: Save token to Redis with expiry

    // Send verification email
    await emailService.sendVerificationEmail(user.email, verificationToken);

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user.id);

    logger.info(`New user registered: ${user.email}`);

    res.status(201).json({
      success: true,
      message: 'User created successfully. Please verify your email.',
      data: {
        user,
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user.id);

    logger.info(`User logged in: ${user.email}`);

    res.json({
      success: true,
      data: {
        user,
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token required'
      });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, JWT_SECRET);

    // Generate new tokens
    const tokens = generateTokens(decoded.userId);

    res.json({
      success: true,
      data: tokens
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid refresh token'
    });
  }
};

// ... другие методы
```

**`src/middleware/auth.js`:**
```javascript
const jwt = require('jsonwebtoken');
const { User } = require('../models');

exports.authMiddleware = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const token = authHeader.substring(7);

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user
    const user = await User.findByPk(decoded.userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
};

exports.adminMiddleware = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }
  next();
};
```

---

### Шаг 1.4: Sites CRUD API
**Время:** 3 дня

**`src/routes/sites.js`:**
```javascript
const express = require('express');
const router = express.Router();
const siteController = require('../controllers/siteController');
const { authMiddleware } = require('../middleware/auth');
const { validate } = require('../middleware/validation');
const { createSiteSchema, updateSiteSchema } = require('../utils/validators');

// All routes require authentication
router.use(authMiddleware);

router.get('/', siteController.getAllSites);
router.post('/', validate(createSiteSchema), siteController.createSite);
router.get('/:id', siteController.getSite);
router.put('/:id', validate(updateSiteSchema), siteController.updateSite);
router.delete('/:id', siteController.deleteSite);
router.post('/:id/publish', siteController.publishSite);
router.post('/:id/unpublish', siteController.unpublishSite);

// Public route (для отображения сайтов)
router.get('/by-subdomain/:subdomain', siteController.getSiteBySubdomain);

module.exports = router;
```

**`src/controllers/siteController.js`:**
```javascript
const { Site } = require('../models');
const deploymentService = require('../services/deploymentService');
const dnsService = require('../services/dnsService');
const logger = require('../utils/logger');

exports.createSite = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const siteData = req.body;

    // Check user's site limit based on subscription
    const userSites = await Site.count({ where: { userId } });
    const subscription = await req.user.getSubscription();
    const limit = subscription?.plan === 'pro' ? 10 : 1;

    if (userSites >= limit) {
      return res.status(403).json({
        success: false,
        message: `Site limit reached. Upgrade to create more sites.`
      });
    }

    // Generate unique slug
    const baseSlug = siteData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    let slug = baseSlug;
    let counter = 1;

    while (await Site.findOne({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Create site
    const site = await Site.create({
      ...siteData,
      userId,
      slug,
      subdomain: slug,
      status: 'draft'
    });

    logger.info(`Site created: ${site.name} by user ${userId}`);

    res.status(201).json({
      success: true,
      data: site
    });
  } catch (error) {
    next(error);
  }
};

exports.publishSite = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Find site
    const site = await Site.findOne({
      where: { id, userId }
    });

    if (!site) {
      return res.status(404).json({
        success: false,
        message: 'Site not found'
      });
    }

    // Update status
    site.deploymentStatus = 'deploying';
    await site.save();

    try {
      // 1. Create DNS record
      logger.info(`Creating DNS for ${site.subdomain}.monochrome.ai`);
      const dnsRecord = await dnsService.createSubdomain(site.subdomain);

      // 2. Deploy site
      logger.info(`Deploying site ${site.id}`);
      const deployment = await deploymentService.deploySite(site);

      // 3. Update site
      site.status = 'published';
      site.deploymentStatus = 'deployed';
      site.deploymentUrl = deployment.url;
      site.publishedAt = new Date();
      await site.save();

      logger.info(`Site published successfully: ${site.subdomain}.monochrome.ai`);

      res.json({
        success: true,
        message: 'Site published successfully',
        data: {
          site,
          url: `https://${site.subdomain}.monochrome.ai`
        }
      });
    } catch (deployError) {
      // Rollback on error
      site.deploymentStatus = 'failed';
      await site.save();

      logger.error(`Deployment failed for site ${site.id}:`, deployError);

      throw deployError;
    }
  } catch (error) {
    next(error);
  }
};

// ... другие методы
```

---

### Шаг 1.5: Security & Rate Limiting
**Время:** 2 дня

**Задачи:**
- [ ] Helmet для HTTP headers
- [ ] CORS configuration
- [ ] Rate limiting
- [ ] Input sanitization
- [ ] SQL injection protection
- [ ] XSS protection

**`src/server.js`:**
```javascript
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');

const app = express();

// Security headers
app.use(helmet());

// CORS
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
});

app.use('/api/', limiter);

// Stricter rate limit for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many authentication attempts'
});

app.use('/api/auth/login', authLimiter);
app.use('/api/auth/signup', authLimiter);

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
app.use(morgan('combined'));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/sites', require('./routes/sites'));
app.use('/api/chat', require('./routes/chat'));

// Error handler
app.use(require('./middleware/errorHandler'));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
```

---

## PHASE 2: Frontend Integration (2-3 недели)

### Шаг 2.1: API Client Setup
**Время:** 2 дня

**`src/api/client.js`:**
```javascript
import axios from 'axios';
import { ENV } from '../config/env';

const api = axios.create({
  baseURL: ENV.API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 30000
});

// Request interceptor - добавить JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and not already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');

        if (!refreshToken) {
          throw new Error('No refresh token');
        }

        // Refresh token
        const response = await axios.post(`${ENV.API_URL}/auth/refresh-token`, {
          refreshToken
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data.data;

        // Save new tokens
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', newRefreshToken);

        // Retry original request
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed - logout user
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
```

**`src/api/services/auth.js`:**
```javascript
import api from '../client';

export const authService = {
  async signup(data) {
    const response = await api.post('/auth/signup', data);
    return response.data;
  },

  async login(credentials) {
    const response = await api.post('/auth/login', credentials);
    const { accessToken, refreshToken, user } = response.data.data;

    // Save tokens
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(user));

    return response.data;
  },

  async logout() {
    await api.post('/auth/logout');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  },

  async getCurrentUser() {
    const response = await api.get('/auth/me');
    return response.data.data;
  }
};
```

**`src/api/services/sites.js`:**
```javascript
import api from '../client';

export const sitesService = {
  async getAll() {
    const response = await api.get('/sites');
    return response.data.data;
  },

  async create(siteData) {
    const response = await api.post('/sites', siteData);
    return response.data.data;
  },

  async update(id, siteData) {
    const response = await api.put(`/sites/${id}`, siteData);
    return response.data.data;
  },

  async delete(id) {
    await api.delete(`/sites/${id}`);
  },

  async publish(id) {
    const response = await api.post(`/sites/${id}/publish`);
    return response.data.data;
  },

  async getBySubdomain(subdomain) {
    const response = await api.get(`/sites/by-subdomain/${subdomain}`);
    return response.data.data;
  }
};
```

---

### Шаг 2.2: Replace localStorage with API
**Время:** 5 дней

**План замены:**

1. **QuickEdit.jsx** - заменить все localStorage.setItem на API calls
2. **MySites.jsx** - загрузка сайтов из API
3. **DashboardHome.jsx** - статистика из API
4. **AI Wizard** - сохранение в API вместо localStorage
5. **Manual Onboarding** - сохранение в API

**Пример миграции QuickEdit.jsx:**

**БЫЛО (localStorage):**
```javascript
const handleSave = () => {
  const activeSite = getActiveSite();
  updateSite(activeSite.id, {
    data: siteData,
    design: designSettings
  });
  setSaved(true);
};
```

**СТАЛО (API):**
```javascript
const handleSave = async () => {
  try {
    setSaving(true);

    await sitesService.update(currentSite.id, {
      hero: siteData.hero,
      services: siteData.services,
      contacts: siteData.contacts,
      social: siteData.social,
      stats: siteData.stats,
      design: designSettings,
      seo: seoData
    });

    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  } catch (error) {
    console.error('Save failed:', error);
    alert('Failed to save changes. Please try again.');
  } finally {
    setSaving(false);
  }
};
```

**Добавить loading states:**
```javascript
const [loading, setLoading] = useState(true);
const [saving, setSaving] = useState(false);
const [publishing, setPublishing] = useState(false);

// Load site data on mount
useEffect(() => {
  const loadSite = async () => {
    try {
      setLoading(true);
      const site = await sitesService.getById(siteId);
      setSiteData(site);
    } catch (error) {
      console.error('Failed to load site:', error);
    } finally {
      setLoading(false);
    }
  };

  loadSite();
}, [siteId]);

if (loading) {
  return <LoadingSpinner />;
}
```

---

### Шаг 2.3: Authentication UI
**Время:** 3 дня

**Создать страницы:**
- [ ] Login page
- [ ] Signup page
- [ ] Forgot password page
- [ ] Reset password page
- [ ] Email verification page

**`src/pages/auth/LoginPage.jsx`:**
```javascript
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../api/services/auth';

export default function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authService.login(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-gray-900 border border-gray-800 rounded-lg p-8">
        <h1 className="text-3xl font-bold mb-2">Welcome back</h1>
        <p className="text-gray-400 mb-8">Log in to your account</p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-6">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <Link to="/forgot-password" className="text-blue-400 hover:text-blue-300">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-medium disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Log in'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-6">
          Don't have an account?{' '}
          <Link to="/signup" className="text-blue-400 hover:text-blue-300">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
```

**Protected Route wrapper:**
```javascript
// src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem('accessToken');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

// Use in App.jsx
<Route path="/dashboard/*" element={
  <ProtectedRoute>
    <Dashboard />
  </ProtectedRoute>
} />
```

---

## PHASE 3: Deployment & DNS (1-2 недели)

### Шаг 3.1: Cloudflare DNS Integration
**Время:** 3 дня

**Backend implementation уже описан в DEPLOYMENT_GUIDE.md**

**Дополнительно - тестирование:**
```javascript
// tests/integration/dns.test.js
const dnsService = require('../../src/services/dnsService');

describe('DNS Service', () => {
  test('should create subdomain', async () => {
    const result = await dnsService.createSubdomain('test-site');

    expect(result.success).toBe(true);
    expect(result.subdomain).toBe('test-site.monochrome.ai');
  });

  test('should verify DNS propagation', async () => {
    const verified = await dnsService.verifyDNS('test-site');
    expect(verified).toBe(true);
  });
});
```

---

### Шаг 3.2: Vercel Deployment Integration
**Время:** 4 дня

**Implementation уже описан в DEPLOYMENT_GUIDE.md**

**Добавить deployment queue (Bull + Redis):**
```javascript
// src/services/deploymentQueue.js
const Queue = require('bull');
const deploymentService = require('./deploymentService');
const logger = require('../utils/logger');

const deploymentQueue = new Queue('site-deployment', {
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
  }
});

// Process jobs
deploymentQueue.process(async (job) => {
  const { siteId } = job.data;

  logger.info(`Processing deployment for site ${siteId}`);

  try {
    const result = await deploymentService.deploySite(site);
    return result;
  } catch (error) {
    logger.error(`Deployment failed for site ${siteId}:`, error);
    throw error;
  }
});

// Add job
exports.addDeploymentJob = (siteId) => {
  return deploymentQueue.add({ siteId }, {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000
    }
  });
};
```

---

## PHASE 4: Payments & Subscriptions (2 недели)

### Шаг 4.1: Stripe Setup
**Время:** 5 дней

**См. DEPLOYMENT_GUIDE.md для полной имплементации**

**Добавить Stripe Webhooks:**
```javascript
// src/routes/webhooks.js
const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { Subscription } = require('../models');

router.post('/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle events
  switch (event.type) {
    case 'customer.subscription.created':
      await handleSubscriptionCreated(event.data.object);
      break;
    case 'customer.subscription.updated':
      await handleSubscriptionUpdated(event.data.object);
      break;
    case 'customer.subscription.deleted':
      await handleSubscriptionDeleted(event.data.object);
      break;
  }

  res.json({ received: true });
});

module.exports = router;
```

---

## PHASE 5: Testing & Quality (2 недели)

### Шаг 5.1: Unit Tests
**Время:** 5 дней

**`tests/unit/services/siteService.test.js`:**
```javascript
const { sitesService } = require('../../../src/services/sitesService');
const { Site } = require('../../../src/models');

jest.mock('../../../src/models');

describe('Sites Service', () => {
  describe('createSite', () => {
    test('should create site with valid data', async () => {
      const mockSite = {
        id: 'uuid',
        name: 'Test Site',
        slug: 'test-site',
        userId: 'user-id'
      };

      Site.create.mockResolvedValue(mockSite);

      const result = await sitesService.create({
        name: 'Test Site',
        userId: 'user-id'
      });

      expect(result).toEqual(mockSite);
      expect(Site.create).toHaveBeenCalledWith(expect.objectContaining({
        name: 'Test Site',
        userId: 'user-id'
      }));
    });

    test('should throw error if user exceeds site limit', async () => {
      Site.count.mockResolvedValue(10); // Already has 10 sites

      await expect(
        sitesService.create({ name: 'Test', userId: 'user-id' })
      ).rejects.toThrow('Site limit exceeded');
    });
  });
});
```

### Шаг 5.2: Integration Tests
**Время:** 5 дней

**`tests/integration/auth.test.js`:**
```javascript
const request = require('supertest');
const app = require('../../src/server');
const { User } = require('../../src/models');

describe('Auth API', () => {
  beforeEach(async () => {
    await User.destroy({ where: {}, force: true });
  });

  describe('POST /api/auth/signup', () => {
    test('should create new user', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send({
          email: 'test@example.com',
          password: 'SecurePass123!',
          username: 'testuser'
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data).toHaveProperty('accessToken');
    });

    test('should reject duplicate email', async () => {
      // Create first user
      await User.create({
        email: 'test@example.com',
        password: 'pass',
        username: 'user1'
      });

      // Try to create duplicate
      const response = await request(app)
        .post('/api/auth/signup')
        .send({
          email: 'test@example.com',
          password: 'pass',
          username: 'user2'
        });

      expect(response.status).toBe(409);
    });
  });
});
```

### Шаг 5.3: E2E Tests (Playwright)
**Время:** 3 дня

**`tests/e2e/onboarding.spec.js`:**
```javascript
const { test, expect } = require('@playwright/test');

test.describe('AI Wizard Onboarding', () => {
  test('should complete full AI wizard flow', async ({ page }) => {
    // 1. Navigate to onboarding
    await page.goto('http://localhost:3000/onboarding/ai-wizard/step1');

    // 2. Fill step 1
    await page.fill('[name="companyName"]', 'Test IT Company');
    await page.fill('[name="businessDescription"]', 'We provide IT services');
    await page.click('button:has-text("Continue")');

    // 3. Wait for AI generation
    await page.waitForSelector('.service-card', { timeout: 30000 });

    // 4. Go to step 3
    await page.click('button:has-text("Continue")');

    // 5. Select color scheme
    await page.click('[data-color="purple"]');

    // 6. Submit
    await page.click('button:has-text("Create Site")');

    // 7. Verify redirect to dashboard
    await expect(page).toHaveURL(/\/dashboard/);
  });
});
```

---

## PHASE 6: DevOps & CI/CD (1 неделя)

### Шаг 6.1: GitHub Actions
**Время:** 2 дня

**`.github/workflows/backend-ci.yml`:**
```yaml
name: Backend CI/CD

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: |
          cd backend
          npm ci

      - name: Run linter
        run: npm run lint

      - name: Run tests
        run: npm test
        env:
          DATABASE_URL: postgres://postgres:postgres@localhost:5432/test

      - name: Upload coverage
        uses: codecov/codecov-action@v3

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'

    steps:
      - uses: actions/checkout@v3

      - name: Deploy to Railway
        run: |
          curl -X POST ${{ secrets.RAILWAY_WEBHOOK_URL }}
```

**`.github/workflows/frontend-ci.yml`:**
```yaml
name: Frontend CI/CD

on:
  push:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: |
          cd frontend
          npm ci

      - name: Run build
        run: npm run build

      - name: Run tests
        run: npm test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'

    steps:
      - uses: actions/checkout@v3

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

---

### Шаг 6.2: Monitoring Setup
**Время:** 2 дня

**Sentry Integration:**
```javascript
// backend/src/config/sentry.js
const Sentry = require('@sentry/node');

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0
});

module.exports = Sentry;
```

**Frontend:**
```javascript
// frontend/src/config/sentry.js
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
  integrations: [
    new Sentry.BrowserTracing(),
    new Sentry.Replay()
  ],
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0
});
```

---

## PHASE 7: Documentation & Launch (1 неделя)

### Шаг 7.1: API Documentation (Swagger)
**Время:** 2 дня

**`backend/swagger.js`:**
```javascript
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Monochrome API',
      version: '1.0.0',
      description: 'AI-powered website builder API'
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server'
      },
      {
        url: 'https://api.monochrome.ai',
        description: 'Production server'
      }
    ]
  },
  apis: ['./src/routes/*.js']
};

const specs = swaggerJsdoc(options);

module.exports = { swaggerUi, specs };
```

### Шаг 7.2: User Documentation
**Время:** 2 дня

**Создать:**
- [ ] Getting Started guide
- [ ] FAQ
- [ ] Video tutorials
- [ ] Troubleshooting guide

### Шаг 7.3: Pre-Launch Checklist
**Время:** 2 дня

- [ ] ✅ Backend deployed & healthy
- [ ] ✅ Frontend deployed & healthy
- [ ] ✅ Database backed up
- [ ] ✅ DNS configured correctly
- [ ] ✅ SSL certificates active
- [ ] ✅ Monitoring & alerts setup
- [ ] ✅ Error tracking (Sentry)
- [ ] ✅ Analytics (Google Analytics)
- [ ] ✅ Legal pages (Terms, Privacy)
- [ ] ✅ Email templates designed
- [ ] ✅ Customer support setup
- [ ] ✅ Load testing completed
- [ ] ✅ Security audit done
- [ ] ✅ Backup & recovery tested

---

## 📊 ИТОГОВЫЙ TIMELINE

| Phase | Описание | Время | Dependencies |
|-------|----------|-------|--------------|
| 0 | Подготовка | 1 неделя | - |
| 1 | Backend Foundation | 3-4 недели | Phase 0 |
| 2 | Frontend Integration | 2-3 недели | Phase 1 |
| 3 | Deployment & DNS | 1-2 недели | Phase 1, 2 |
| 4 | Payments | 2 недели | Phase 1, 2 |
| 5 | Testing | 2 недели | Phase 1-4 |
| 6 | DevOps & CI/CD | 1 неделя | Phase 1-5 |
| 7 | Documentation & Launch | 1 неделя | All phases |

**TOTAL: 12-16 недель (3-4 месяца)**

---

## 💰 БЮДЖЕТ

### Разработка
| Позиция | Стоимость |
|---------|-----------|
| Backend Developer (3 мес) | $9,000 - $15,000 |
| Frontend Developer (2 мес) | $6,000 - $10,000 |
| DevOps Engineer (1 мес) | $3,000 - $5,000 |
| **Total Development** | **$18,000 - $30,000** |

### Инфраструктура (мес)
| Сервис | Стоимость |
|--------|-----------|
| Vercel Pro | $20 |
| Railway (Backend) | $20 |
| Supabase (Database) | $25 |
| Cloudflare | Free |
| Redis (Upstash) | $10 |
| Cloudinary | $15 |
| SendGrid (Email) | $15 |
| Sentry | $26 |
| Domain | $1 (годовой $12) |
| **Total per month** | **~$132** |

### Первый год
- Development: $18,000 - $30,000
- Infrastructure (12 мес): $1,584
- Marketing: $5,000 - $10,000
- Legal & Accounting: $2,000 - $3,000
- **TOTAL: $26,584 - $44,584**

---

## 🎯 SUCCESS METRICS

### Technical KPIs
- [ ] 99.9% uptime
- [ ] < 500ms API response time
- [ ] < 2s page load time
- [ ] 0 critical bugs
- [ ] 100% test coverage (critical paths)

### Business KPIs
- [ ] 100 beta users (month 1)
- [ ] 1000 registered users (month 3)
- [ ] 50 paying customers (month 6)
- [ ] $2,500 MRR (month 6)
- [ ] 20% conversion rate (free to paid)

---

## 🚀 POST-LAUNCH ROADMAP

### Month 1-3
- Monitor errors & fix bugs
- Gather user feedback
- Optimize performance
- Add requested features

### Month 4-6
- Launch marketing campaigns
- Add integrations (Zapier, etc)
- Improve AI suggestions
- Add analytics dashboard

### Month 7-12
- White-label solution
- API for developers
- Mobile app
- Advanced features

---

**ИТОГ:**

Это детальный план превращения презентации в production-ready SaaS. Каждый шаг четко определен с временем и зависимостями.

**Начать можно с Phase 0** - это не требует затрат и займет ~1 неделю.

Готов помочь с реализацией любого из этих этапов! 🚀
