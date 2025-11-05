function applySettings(data) {
  console.log('Anwenden der Einstellungen:', data);
  const fgwpSection = document.getElementById('offer-section-FGWP');
  const lunaSection = document.getElementById('offer-section-LUNA');
  const fgwp_fullSection = document.getElementById('offer-section-FGWP_FULL');
  const benefitsBanner = document.querySelector('[data-a-target="benefits-banner"]');
  const GameNightBanner = document.querySelector('[data-a-target="GameNightBannerSectionRootHome"]');
  const featuredContent = document.querySelector('.featured-content');

  if (data.hideFgwp && fgwpSection) {
    fgwpSection.style.display = 'none';
    console.log('FGWP area hidden');
  } else if (data.hideFgwp) {
    console.log('FGWP area not found');
  }
  
  if (data.hideLuna && lunaSection) {
    lunaSection.style.display = 'none';
    console.log('LUNA area hidden');
  } else if (data.hideLuna) {
    console.log('LUNA area not found');
  }
  
  if (data.hideFgwp_Full && fgwp_fullSection) {
    fgwp_fullSection.style.display = 'none';
    console.log('FGWP_FULL area hidden');
  } else if (data.hideFgwp_Full) {
    console.log('FGWP_FULL area not found');
  }
  
  if (data.hideGameNightBanner && GameNightBanner) {
	  GameNightBanner.style.setProperty('display', 'none', 'important');
	  console.log('GameNight Banner hidden');
	} else if (data.hideGameNightBanner) {
	  console.log('GameNight Banner not found');
	}
  
  if (data.hideBenefitsBanner && benefitsBanner) {
	  benefitsBanner.style.setProperty('display', 'none', 'important');
	  console.log('Benefits Banner hidden');
	} else if (data.hideBenefitsBanner) {
	  console.log('Benefits Banner not found');
	}
  
  if (data.hideFeaturedContent && featuredContent) {
    featuredContent.style.display = 'none';
    console.log('Featured Content hidden');
  } else if (data.hideFeaturedContent) {
    console.log('Featured Content not found');
  }
}

// Funktion für CSS-Alert
function showAlert(message) {
  // Entferne bestehende Alerts
  const existingAlert = document.getElementById('custom-alert');
  if (existingAlert) existingAlert.remove();

  // Erstelle Alert-Element
  const alertDiv = document.createElement('div');
  alertDiv.id = 'custom-alert';
  alertDiv.innerText = message;
  alertDiv.style.cssText = `
    position: fixed; top: 20px; right: 20px; background: #4CAF50; color: white;
    padding: 10px 20px; border-radius: 5px; z-index: 10000; font-family: Arial, sans-serif;
    font-size: 16px; box-shadow: 0 2px 5px rgba(0,0,0,0.2); transition: opacity 0.5s ease-in-out;
    opacity: 1;
  `;
  document.body.appendChild(alertDiv);

  // Verblassen nach 3 Sekunden
  setTimeout(() => {
    alertDiv.style.opacity = '0';
    setTimeout(() => alertDiv.remove(), 500);
  }, 3000);
}

// Initiale Anwendung der Einstellungen
chrome.storage.local.get(['hideLuna', 'hideFgwp', 'hideFgwp_Full', 'hideGameNightBanner', 'hideBenefitsBanner', 'hideFeaturedContent'], (data) => {
  console.log('Initial settings:', data);
  applySettings(data);
});

// MutationObserver für dynamische Änderungen
const observer = new MutationObserver(() => {
  chrome.storage.local.get(['hideLuna', 'hideFgwp', 'hideFgwp_Full', 'hideGameNightBanner', 'hideBenefitsBanner', 'hideFeaturedContent'], (data) => {
    applySettings(data);
  });
});
observer.observe(document.body, { childList: true, subtree: true });

// Listener für Einstellungsänderungen und Alerts
chrome.runtime.onMessage.addListener((message) => {
  if (message.action === 'updateSettings') {
    console.log('Receive settings update:', message.settings);
    applySettings(message.settings);
    if (message.showAlert) {
      showAlert(message.showAlert.message);
    }
  }
});