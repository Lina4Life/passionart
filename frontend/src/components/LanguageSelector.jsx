﻿import React from 'react';
import { useTranslation } from 'react-i18next';
import './LanguageSelector.css';

const LanguageSelector = () => {
  const { i18n, t } = useTranslation();

  const languages = [
    { code: 'en', name: 'English', flag: 'ðŸ‡ºðŸ‡¸' },
    { code: 'fr', name: 'FranÃ§ais', flag: 'ðŸ‡«ðŸ‡·' },
    { code: 'es', name: 'EspaÃ±ol', flag: 'ðŸ‡ªðŸ‡¸' },
    { code: 'ar', name: 'Ø§Ù„Ø¹Ø±Ø¨ÙŠØ©', flag: 'ðŸ‡¸ðŸ‡¦' }
  ];

  const handleLanguageChange = (langCode) => {
    i18n.changeLanguage(langCode);
    // Update document direction for RTL languages
    if (langCode === 'ar') {
      document.dir = 'rtl';
      document.documentElement.setAttribute('lang', 'ar');
    } else {
      document.dir = 'ltr';
      document.documentElement.setAttribute('lang', langCode);
    }
  };

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  return (
    <div className="language-selector">
      <div className="language-dropdown">
        <button className="language-toggle">
          <span className="language-flag">{currentLanguage.flag}</span>
          <span className="language-name">{currentLanguage.name}</span>
          <span className="dropdown-arrow">â–¼</span>
        </button>
        <div className="language-menu">
          {languages.map((language) => (
            <button
              key={language.code}
              className={`language-option ${i18n.language === language.code ? 'active' : ''}`}
              onClick={() => handleLanguageChange(language.code)}
            >
              <span className="language-flag">{language.flag}</span>
              <span className="language-name">{language.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LanguageSelector;

