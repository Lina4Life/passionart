# PassionArt Community Feature

A Reddit-like chat blog community platform integrated into the PassionArt website, designed for artists and art galleries with multi-language support, paid artwork verification, and Google Ads integration.

## 🎨 Features

### Core Features
- **Reddit-style Community System**: Categories, posts, comments, voting
- **Multi-language Support**: 11 languages including EN, FR, ES, DE, IT, PT, RU, JA, KO, ZH, AR
- **Paid Artwork Verification**: €5 fee for original artwork posts
- **Content Moderation**: Manual verification system for paid content
- **Google Ads Integration**: Revenue generation through advertisements
- **Real-time Voting**: Upvote/downvote system for posts and comments
- **Nested Comments**: Threaded discussion system
- **Post Types**: Text, Image, Link, and Original Artwork posts

### Payment System
- **€5 Verification Fee**: Required for original artwork posts
- **Payment Before Verification**: Artists pay before content review
- **Stripe Integration**: Secure payment processing
- **Payment Tracking**: Full transaction history and status

### Moderation Dashboard
- **Verification Queue**: Review paid artwork submissions
- **Approval/Rejection System**: Moderator controls with reason tracking
- **Payment Verification**: Confirm payment before content approval
- **Quality Control**: Checklist-based verification process

## 🚀 Installation & Setup

### 1. Database Setup

First, run the community database schema:

```sql
-- Run this in your PostgreSQL database
\i backend/models/community/community.sql
```

This creates all necessary tables:
- `community_categories` - Art communities/subreddits
- `community_posts` - User posts with payment tracking
- `community_comments` - Threaded comment system
- `community_votes` - Voting system
- `community_payments` - Payment transactions
- `community_moderation` - Moderation logs
- `community_ads` - Advertisement system
- `community_translations` - Multi-language content

### 2. Backend Setup

The community routes are already integrated into the main backend. Make sure you have:

```javascript
// In backend/app.js - already added
const communityRoutes = require('./routes/community/community.routes');
app.use('/api/community', communityRoutes);
```

### 3. Frontend Setup

The community is integrated as a new tab in the main navigation:

```jsx
// In frontend/src/App.jsx - already added
import Community from './pages/community/Community';

// Routes added:
<Route path="/community" element={<Community />} />
<Route path="/community/:categorySlug" element={<Community />} />
```

### 4. Environment Variables

Add to your `.env` file:

```env
# Payment Processing
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...

# Google Ads (optional)
GOOGLE_ADS_CLIENT_ID=your_google_ads_client_id
GOOGLE_ADS_DEVELOPER_TOKEN=your_developer_token
```

## 🎯 Usage

### For Users

1. **Browse Communities**: Visit `/community` to see all art categories
2. **Create Posts**: Click "Create Post" in any category
3. **Artwork Submission**: 
   - Select "Original Artwork" post type
   - Pay €5 verification fee
   - Wait for moderator approval
4. **Voting & Comments**: Engage with community content
5. **Multi-language**: Use language selector for preferred language

### For Moderators

1. **Access Moderation**: Go to `/admin` and find "Community Moderation"
2. **Review Queue**: See all paid artwork awaiting verification
3. **Verification Process**:
   - Review artwork quality and originality
   - Check payment confirmation
   - Approve or reject with reason
4. **Quality Control**: Use verification checklist

### For Administrators

1. **Category Management**: Create and manage art communities
2. **User Moderation**: Handle reports and user issues
3. **Payment Monitoring**: Track revenue from verification fees
4. **Analytics**: Monitor community engagement and growth

## 💰 Revenue Model

### Verification Fees
- **€5 per artwork post**: Artists pay for verification
- **Quality Assurance**: Manual review ensures high-quality content
- **Revenue Stream**: Sustainable funding for platform maintenance

### Google Ads Integration
```jsx
// Ad placement example
<div className="google-ad">
  <ins className="adsbygoogle"
       style={{display: 'block'}}
       data-ad-client="ca-pub-xxxxxxxxxx"
       data-ad-slot="xxxxxxxxxx"
       data-ad-format="auto"></ins>
</div>
```

## 🌍 Multi-Language System

### Supported Languages
- 🇺🇸 English (en)
- 🇫🇷 Français (fr) 
- 🇪🇸 Español (es)
- 🇩🇪 Deutsch (de)
- 🇮🇹 Italiano (it)
- 🇵🇹 Português (pt)
- 🇷🇺 Русский (ru)
- 🇯🇵 日本語 (ja)
- 🇰🇷 한국어 (ko)
- 🇨🇳 中文 (zh)
- 🇸🇦 العربية (ar)

### Adding Translations
1. Edit `LanguageProvider.jsx`
2. Add new language to `languages` object
3. Add translations to `getTranslations` function
4. Update UI components to use `t()` function

## 🔧 API Endpoints

### Public Endpoints
```
GET /api/community/categories - Get all categories
GET /api/community/categories/:slug/posts - Get posts in category
GET /api/community/posts/:id/comments - Get post comments
```

### Authenticated Endpoints
```
POST /api/community/posts - Create new post
POST /api/community/posts/:id/payment - Process payment
POST /api/community/posts/:id/vote - Vote on post
POST /api/community/posts/:id/comments - Add comment
```

### Moderator Endpoints
```
GET /api/community/moderation/pending - Get pending posts
POST /api/community/moderation/posts/:id - Approve/reject post
```

## 🎨 Customization

### Styling
- Edit `Community.css` for main community styles
- Edit `ModerationDashboard.css` for admin styles
- Customize color scheme and branding

### Categories
- Add new art categories in the database
- Customize category icons and descriptions
- Set up category-specific rules

### Payment Integration
- Configure Stripe for different regions
- Add PayPal or other payment methods
- Customize verification fees per category

## 🔒 Security Features

- **Payment Verification**: Confirm payment before content approval
- **Content Moderation**: Human review of all paid content
- **User Authentication**: Secure login and authorization
- **CSRF Protection**: Secure form submissions
- **Input Validation**: Prevent malicious content

## 📱 Mobile Responsive

The community is fully responsive with:
- Mobile-first design approach
- Touch-friendly voting buttons
- Optimized image galleries
- Collapsible navigation
- Swipe gestures for categories

## 🚀 Future Enhancements

- **Real-time Chat**: Live chat rooms per category
- **Video Posts**: Support for video artwork
- **NFT Integration**: Connect with blockchain art markets
- **AI Moderation**: Automated content screening
- **Advanced Analytics**: Detailed engagement metrics
- **Mobile App**: Native iOS/Android applications

## 📞 Support

For technical support or feature requests, contact the development team or create an issue in the project repository.

---

Built with ❤️ for the art community by PassionArt Team
