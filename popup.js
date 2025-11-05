document.addEventListener('DOMContentLoaded', () => {
  const hideFgwp = document.getElementById('hideFgwp');
  const hideLuna = document.getElementById('hideLuna');
  const hideFgwp_Full = document.getElementById('hideFgwp_Full');
  const hideGameNightBanner = document.getElementById('hideGameNightBanner');
  const hideBenefitsBanner = document.getElementById('hideBenefitsBanner');
  const hideFeaturedContent = document.getElementById('hideFeaturedContent');
  const saveButton = document.getElementById('save');

  // Einstellungen laden
  chrome.storage.local.get(['hideFgwp', 'hideLuna', 'hideFgwp_Full', 'hideGameNightBanner', 'hideBenefitsBanner', 'hideFeaturedContent'], (data) => {
    console.log('Loaded settings:', data);
    hideFgwp.checked = data.hideFgwp || false;
    hideLuna.checked = data.hideLuna || false;
    hideFgwp_Full.checked = data.hideFgwp_Full || false;
    hideBenefitsBanner.checked = data.hideBenefitsBanner || false;
    hideGameNightBanner.checked = data.hideGameNightBanner || false;
    hideFeaturedContent.checked = data.hideFeaturedContent || false;
  });

  // Einstellungen speichern
  saveButton.addEventListener('click', () => {
    const settings = {
      hideFgwp: hideFgwp.checked,
      hideLuna: hideLuna.checked,
      hideFgwp_Full: hideFgwp_Full.checked,
      hideBenefitsBanner: hideBenefitsBanner.checked,
      hideGameNightBanner: hideGameNightBanner.checked,
      hideFeaturedContent: hideFeaturedContent.checked
    };
    console.log('Save settings:', settings);
    chrome.storage.local.set(settings, () => {
      if (chrome.runtime.lastError) {
        console.error('Error while saving:', chrome.runtime.lastError);
      } else {
        console.log('Settings successfully saved');
        // Nachricht an Content-Skript senden für CSS-Alert und Update
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (tabs[0]) {
            chrome.tabs.sendMessage(tabs[0].id, { 
              action: 'updateSettings', 
              settings,
              showAlert: { message: 'Settings saved' }
            });
          }
        });
        window.close();
      }
    });
  });
});

document.addEventListener('click', (e) => {
  if (e.target.tagName === 'A' && e.target.href.startsWith('http')) {
    e.preventDefault();
    chrome.tabs.create({ url: e.target.href });
  }
});
