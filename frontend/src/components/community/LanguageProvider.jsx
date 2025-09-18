import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [translations, setTranslations] = useState({});

  const languages = {
    en: { name: 'English', flag: 'ðŸ‡ºðŸ‡¸' },
    fr: { name: 'FranÃ§ais', flag: 'ðŸ‡«ðŸ‡·' },
    es: { name: 'EspaÃ±ol', flag: 'ðŸ‡ªðŸ‡¸' },
    de: { name: 'Deutsch', flag: 'ðŸ‡©ðŸ‡ª' },
    it: { name: 'Italiano', flag: 'ðŸ‡®ðŸ‡¹' },
    pt: { name: 'PortuguÃªs', flag: 'ðŸ‡µðŸ‡¹' },
    ru: { name: 'Ð ÑƒÑÑÐºÐ¸Ð¹', flag: 'ðŸ‡·ðŸ‡º' },
    ja: { name: 'æ—¥æœ¬èªž', flag: 'ðŸ‡¯ðŸ‡µ' },
    ko: { name: 'í•œêµ­ì–´', flag: 'ðŸ‡°ðŸ‡·' },
    zh: { name: 'ä¸­æ–‡', flag: 'ðŸ‡¨ðŸ‡³' },
    ar: { name: 'Ø§Ù„Ø¹Ø±Ø¨ÙŠØ©', flag: 'ðŸ‡¸ðŸ‡¦' }
  };

  // Load translations
  useEffect(() => {
    loadTranslations(currentLanguage);
  }, [currentLanguage]);

  const loadTranslations = async (lang) => {
    try {
      // In a real app, you'd load from files or API
      const translationData = await getTranslations(lang);
      setTranslations(translationData);
    } catch (error) {
      console.error('Error loading translations:', error);
    }
  };

  const getTranslations = async (lang) => {
    // Mock translations - in production, load from files or API
    const translations = {
      en: {
        // Navigation
        'nav.gallery': 'Gallery',
        'nav.community': 'Community',
        'nav.upload': 'Upload',
        'nav.profile': 'Profile',
        'nav.login': 'Login',
        'nav.register': 'Register',
        'nav.logout': 'Logout',
        
        // Community
        'community.title': 'Art Community',
        'community.createPost': 'Create Post',
        'community.joinCommunity': 'Join Community',
        'community.hot': 'Hot',
        'community.new': 'New',
        'community.top': 'Top',
        'community.rising': 'Rising',
        'community.noPostsTitle': 'No posts yet in this community',
        'community.noPostsDesc': 'Be the first to share something amazing!',
        'community.createFirstPost': 'Create First Post',
        'community.by': 'by',
        'community.comments': 'comments',
        'community.views': 'views',
        'community.verified': 'Verified',
        'community.featured': 'Featured',
        'community.artwork': 'Artwork',
        
        // Post Creation
        'post.create.title': 'Create Post',
        'post.create.type': 'Post Type',
        'post.create.textPost': 'Text Post',
        'post.create.imagePost': 'Image Post',
        'post.create.linkPost': 'Link Post',
        'post.create.artworkPost': 'Original Artwork (â‚¬5 fee)',
        'post.create.titleLabel': 'Title',
        'post.create.titlePlaceholder': "What's your post about?",
        'post.create.contentLabel': 'Content',
        'post.create.contentPlaceholder': 'Share your thoughts, techniques, or story...',
        'post.create.artworkNotice': 'Artwork posts require a â‚¬5 verification fee and manual approval by our team.',
        'post.create.cancel': 'Cancel',
        'post.create.submit': 'Create Post',
        'post.create.submitArtwork': 'Create & Pay â‚¬5',
        
        // Payment
        'payment.required': 'Payment Required',
        'payment.artworkFee': 'To publish artwork, a verification fee of â‚¬{amount} is required.',
        'payment.feeExplanation': 'This helps us maintain quality and support our verification team.',
        'payment.payWithStripe': 'Pay â‚¬{amount} with Stripe',
        'payment.cancel': 'Cancel',
        'payment.success': 'Payment successful! Your artwork is now in the verification queue.',
        
        // Categories
        'category.digitalArt': 'Digital Art',
        'category.traditionalArt': 'Traditional Art',
        'category.photography': 'Photography',
        'category.streetArt': 'Street Art',
        'category.galleryNews': 'Gallery News',
        'category.artTechniques': 'Art Techniques',
        'category.artCritiques': 'Art Critiques',
        'category.commissions': 'Commissions',
        'category.artEvents': 'Art Events',
        'category.general': 'General Discussion',
        
        // Moderation
        'mod.title': 'Content Moderation',
        'mod.description': 'Review and verify paid artwork submissions',
        'mod.pendingPosts': 'posts pending review',
        'mod.allCaughtUp': 'All caught up!',
        'mod.noPendingDesc': 'No posts pending verification at the moment.',
        'mod.approve': 'Approve',
        'mod.reject': 'Reject',
        'mod.rejectionReason': 'Reason for rejection:',
        'mod.artworkImages': 'Artwork Images',
        'mod.description': 'Description',
        'mod.submissionDetails': 'Submission Details',
        'mod.artist': 'Artist',
        'mod.category': 'Category',
        'mod.payment': 'Payment',
        'mod.submitted': 'Submitted',
        'mod.tags': 'Tags',
        'mod.verificationChecklist': 'Verification Checklist',
        'mod.originalArtwork': 'Original artwork by the submitter',
        'mod.highQuality': 'High quality and appropriate content',
        'mod.communityGuidelines': 'Follows community guidelines',
        'mod.paymentProcessed': 'Payment has been processed',
        'mod.noCopyright': 'No copyright violations',
        
        // Common
        'common.loading': 'Loading...',
        'common.error': 'An error occurred',
        'common.success': 'Success!',
        'common.members': 'members',
        'common.posts': 'posts'
      },
      
      fr: {
        // Navigation
        'nav.gallery': 'Galerie',
        'nav.community': 'CommunautÃ©',
        'nav.upload': 'TÃ©lÃ©charger',
        'nav.profile': 'Profil',
        'nav.login': 'Connexion',
        'nav.register': 'Inscription',
        'nav.logout': 'DÃ©connexion',
        
        // Community
        'community.title': 'CommunautÃ© Artistique',
        'community.createPost': 'CrÃ©er un Post',
        'community.joinCommunity': 'Rejoindre la CommunautÃ©',
        'community.hot': 'Populaire',
        'community.new': 'Nouveau',
        'community.top': 'Top',
        'community.rising': 'Tendance',
        'community.noPostsTitle': 'Aucun post dans cette communautÃ©',
        'community.noPostsDesc': 'Soyez le premier Ã  partager quelque chose d\'incroyable!',
        'community.createFirstPost': 'CrÃ©er le Premier Post',
        'community.by': 'par',
        'community.comments': 'commentaires',
        'community.views': 'vues',
        'community.verified': 'VÃ©rifiÃ©',
        'community.featured': 'En Vedette',
        'community.artwork': 'Å’uvre d\'Art',
        
        // Post Creation
        'post.create.title': 'CrÃ©er un Post',
        'post.create.type': 'Type de Post',
        'post.create.textPost': 'Post Texte',
        'post.create.imagePost': 'Post Image',
        'post.create.linkPost': 'Post Lien',
        'post.create.artworkPost': 'Å’uvre Originale (5â‚¬ de frais)',
        'post.create.titleLabel': 'Titre',
        'post.create.titlePlaceholder': 'De quoi parle votre post?',
        'post.create.contentLabel': 'Contenu',
        'post.create.contentPlaceholder': 'Partagez vos pensÃ©es, techniques, ou histoire...',
        'post.create.artworkNotice': 'Les posts d\'Å“uvres d\'art nÃ©cessitent des frais de vÃ©rification de 5â‚¬ et une approbation manuelle par notre Ã©quipe.',
        'post.create.cancel': 'Annuler',
        'post.create.submit': 'CrÃ©er le Post',
        'post.create.submitArtwork': 'CrÃ©er & Payer 5â‚¬',
        
        // Add more French translations...
      },
      
      es: {
        // Navigation
        'nav.gallery': 'GalerÃ­a',
        'nav.community': 'Comunidad',
        'nav.upload': 'Subir',
        'nav.profile': 'Perfil',
        'nav.login': 'Iniciar SesiÃ³n',
        'nav.register': 'Registrarse',
        'nav.logout': 'Cerrar SesiÃ³n',
        
        // Community
        'community.title': 'Comunidad de Arte',
        'community.createPost': 'Crear PublicaciÃ³n',
        'community.joinCommunity': 'Unirse a la Comunidad',
        'community.hot': 'Popular',
        'community.new': 'Nuevo',
        'community.top': 'Top',
        'community.rising': 'Tendencia',
        'community.noPostsTitle': 'AÃºn no hay publicaciones en esta comunidad',
        'community.noPostsDesc': 'Â¡SÃ© el primero en compartir algo increÃ­ble!',
        'community.createFirstPost': 'Crear Primera PublicaciÃ³n',
        'community.by': 'por',
        'community.comments': 'comentarios',
        'community.views': 'vistas',
        'community.verified': 'Verificado',
        'community.featured': 'Destacado',
        'community.artwork': 'Obra de Arte',
        
        // Add more Spanish translations...
      }
      
      // Add more languages as needed
    };
    
    return translations[lang] || translations.en;
  };

  const t = (key, params = {}) => {
    let translation = translations[key] || key;
    
    // Replace parameters in translation
    Object.keys(params).forEach(param => {
      translation = translation.replace(`{${param}}`, params[param]);
    });
    
    return translation;
  };

  const changeLanguage = (lang) => {
    setCurrentLanguage(lang);
    localStorage.setItem('preferred-language', lang);
  };

  // Load saved language preference
  useEffect(() => {
    const savedLang = localStorage.getItem('preferred-language');
    if (savedLang && languages[savedLang]) {
      setCurrentLanguage(savedLang);
    }
  }, []);

  const value = {
    currentLanguage,
    languages,
    t,
    changeLanguage
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

// Language Selector Component
export const LanguageSelector = () => {
  const { currentLanguage, languages, changeLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="language-selector">
      <button 
        className="language-button"
        onClick={() => setIsOpen(!isOpen)}
      >
        {languages[currentLanguage].flag} {languages[currentLanguage].name}
      </button>
      
      {isOpen && (
        <div className="language-dropdown">
          {Object.entries(languages).map(([code, lang]) => (
            <button
              key={code}
              className={`language-option ${code === currentLanguage ? 'active' : ''}`}
              onClick={() => {
                changeLanguage(code);
                setIsOpen(false);
              }}
            >
              {lang.flag} {lang.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

