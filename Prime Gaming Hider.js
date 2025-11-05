// ==UserScript==
// @name         Prime Gaming Luna Hider (Tampermonkey)
// @namespace    https://rjcncpt.de
// @version      1.5
// @description  Blendet ausgewählte Bereiche auf Prime Gaming aus.
// @author       rjcncpt
// @match        https://luna.amazon.de/claims/home*
// @license      CC0-1.0 License
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==

(function() {
    'use strict';

    // Standard-Konfiguration (wird verwendet, wenn keine Werte gespeichert sind)
    const defaultConfig = {
        hideFgwp: false,              // FGWP-Bereich ausblenden
        hideLuna: false,              // LUNA-Bereich ausblenden
        hideFgwp_Full: false,         // FGWP_FULL-Bereich ausblenden
        hideBenefitsBanner: false,    // Benefits Banner ausblenden
        hideGameNightBanner: false,    // Benefits Banner ausblenden
        hideFeaturedContent: false    // Featured Content ausblenden
    };

    // Einstellungen laden oder Standard verwenden
    const getSettings = () => ({
        hideFgwp: typeof GM_getValue === 'function' ? GM_getValue('hideFgwp', defaultConfig.hideFgwp) : defaultConfig.hideFgwp,
        hideLuna: typeof GM_getValue === 'function' ? GM_getValue('hideLuna', defaultConfig.hideLuna) : defaultConfig.hideLuna,
        hideFgwp_Full: typeof GM_getValue === 'function' ? GM_getValue('hideFgwp_Full', defaultConfig.hideFgwp_Full) : defaultConfig.hideFgwp_Full,
        hideBenefitsBanner: typeof GM_getValue === 'function' ? GM_getValue('hideBenefitsBanner', defaultConfig.hideBenefitsBanner) : defaultConfig.hideBenefitsBanner,
        hideGameNightBanner: typeof GM_getValue === 'function' ? GM_getValue('hideGameNightBanner', defaultConfig.hideGameNightBanner) : defaultConfig.hideGameNightBanner,
        hideFeaturedContent: typeof GM_getValue === 'function' ? GM_getValue('hideFeaturedContent', defaultConfig.hideFeaturedContent) : defaultConfig.hideFeaturedContent
    });

    let settings = getSettings();
    console.log('Prime Gaming Hider - Geladene Einstellungen:', settings);

    // Bereiche ausblenden
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
                element.style.display = section.hide ? 'none' : '';
                console.log(`${section.name}-Bereich ${section.hide ? 'ausgeblendet' : 'angezeigt'}`);
            }
        });
    }

    // Initiale Anwendung
    applySettings();

    // Beobachte DOM-Änderungen (falls Bereiche später geladen werden)
    const observer = new MutationObserver(() => {
        applySettings();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Menü-Kommandos für Einstellungen
    if (typeof GM_registerMenuCommand === 'function') {
        const createMenuCommand = (key, label) => {
            GM_registerMenuCommand(`${label} (${settings[key] ? 'AN' : 'AUS'})`, () => {
                settings[key] = !settings[key];
                GM_setValue(key, settings[key]);
                console.log(`Neue Einstellung für ${key}:`, settings[key]);
                alert(`${label}: ${settings[key] ? 'Aktiviert' : 'Deaktiviert'}. Änderungen werden sofort angewendet.`);
                applySettings();
                
                // Menü aktualisieren (Seite neu laden für neue Menü-Labels)
                setTimeout(() => location.reload(), 1000);
            });
        };

        createMenuCommand('hideFgwp', 'Hide: Slider section');
        createMenuCommand('hideLuna', 'Hide: LUNA Games section');
        createMenuCommand('hideFgwp_Full', 'Hide: PRIME Games section');
        createMenuCommand('hideGameNightBanner', 'Hide: GameNight Banner');
        createMenuCommand('hideBenefitsBanner', 'Hide: Benefits Banner');
        createMenuCommand('hideFeaturedContent', 'Hide: Featured Content');
    } else {
        console.warn('GM_registerMenuCommand nicht verfügbar. Ändere defaultConfig im Code.');
    }
})();