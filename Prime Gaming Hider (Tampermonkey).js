// ==UserScript==
// @name         Prime Gaming Luna Hider (Tampermonkey)
// @namespace    https://rjcncpt.de
// @version      1.1.1
// @description  Hides selected areas on Prime Gaming website.
// @author       rjcncpt
// @match        https://luna.amazon.de/claims/home*
// @license      CC0-1.0 License
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==

(function() {
    'use strict';

    // Default configuration (used when no values are stored)
    const defaultConfig = {
        hideFgwp: false,              // Hide FGWP section
        hideLuna: false,              // Hide LUNA section
        hideFgwp_Full: false,         // Hide FGWP_FULL section
        hideBenefitsBanner: false,    // Hide Benefits Banner
        hideGameNightBanner: false,   // Hide GameNight Banner
        hideFeaturedContent: false    // Hide Featured Content
    };

    // Load settings or use defaults
    const getSettings = () => ({
        hideFgwp: typeof GM_getValue === 'function' ? GM_getValue('hideFgwp', defaultConfig.hideFgwp) : defaultConfig.hideFgwp,
        hideLuna: typeof GM_getValue === 'function' ? GM_getValue('hideLuna', defaultConfig.hideLuna) : defaultConfig.hideLuna,
        hideFgwp_Full: typeof GM_getValue === 'function' ? GM_getValue('hideFgwp_Full', defaultConfig.hideFgwp_Full) : defaultConfig.hideFgwp_Full,
        hideBenefitsBanner: typeof GM_getValue === 'function' ? GM_getValue('hideBenefitsBanner', defaultConfig.hideBenefitsBanner) : defaultConfig.hideBenefitsBanner,
        hideGameNightBanner: typeof GM_getValue === 'function' ? GM_getValue('hideGameNightBanner', defaultConfig.hideGameNightBanner) : defaultConfig.hideGameNightBanner,
        hideFeaturedContent: typeof GM_getValue === 'function' ? GM_getValue('hideFeaturedContent', defaultConfig.hideFeaturedContent) : defaultConfig.hideFeaturedContent
    });

    let settings = getSettings();
    console.log('Prime Gaming Hider – Loaded settings:', settings);

    // Apply visibility settings to page sections
    function applySettings() {
        const sections = [
            { id: 'offer-section-FGWP', hide: settings.hideFgwp, name: 'FGWP' },
            { id: 'offer-section-LUNA', hide: settings.hideLuna, name: 'LUNA' },
            { id: 'offer-section-FGWP_FULL', hide: settings.hideFgwp_Full, name: 'FGWP_FULL' },
            { selector: '[data-a-target="benefits-banner"]', hide: settings.hideBenefitsBanner, name: 'Benefits Banner', useSelector: true },
            { selector: '[data-a-target="GameNightBannerSectionRootHome"]', hide: settings.hideGameNightBanner, name: 'GameNight Banner', useSelector: true },
            { selector: '.featured-content', hide: settings.hideFeaturedContent, name: 'Featured Content', useSelector: true }
        ];

        sections.forEach(section => {
            const element = section.useSelector 
                ? document.querySelector(section.selector)
                : document.getElementById(section.id);

            if (element) {
                element.style.setProperty('display', section.hide ? 'none' : '', 'important');
                console.log(`${section.name} section ${section.hide ? 'hidden' : 'visible'}`);
            }
        });
    }

    // Apply initial settings
    applySettings();

    // Watch for DOM changes (in case sections load later)
    const observer = new MutationObserver(() => {
        applySettings();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Register Tampermonkey menu commands
    if (typeof GM_registerMenuCommand === 'function') {
        const createMenuCommand = (key, label) => {
            GM_registerMenuCommand(`${label} (${settings[key] ? 'ON' : 'OFF'})`, () => {
                settings[key] = !settings[key];
                GM_setValue(key, settings[key]);
                console.log(`New setting for ${key}:`, settings[key]);
                alert(`${label}: ${settings[key] ? 'Activated' : 'Disabled'}. Changes take effect immediately.`);
                applySettings();

                // Reload page to refresh menu labels
                setTimeout(() => location.reload(), 1000);
            });
        };

        createMenuCommand('hideBenefitsBanner', 'Hide: Benefits Banner');
        createMenuCommand('hideFeaturedContent', 'Hide: Featured Content');
        createMenuCommand('hideFgwp', 'Hide: Top Games To Claim');
        createMenuCommand('hideGameNightBanner', 'Hide: GameNight Banner');
        createMenuCommand('hideLuna', 'Hide: LUNA Games Section');
        createMenuCommand('hideFgwp_Full', 'Hide: PRIME Games Section');
    } else {
        console.warn('GM_registerMenuCommand is not available. Modify defaultConfig in the code instead.');
    }
})();
