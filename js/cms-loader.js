(function() {
  'use strict';

  const AUTH = 'Basic ' + btoa(':pr2026');

  async function loadContent() {
    try {
      const res = await fetch('/api/admin/content', {
        headers: { 'Authorization': AUTH }
      });
      const data = await res.json();
      if (!data.success) return;

      document.querySelectorAll('[data-cms]').forEach(el => {
        const [section, key] = el.dataset.cms.split('.');
        if (data.data[section] && data.data[section][key]) {
          el.textContent = data.data[section][key];
        }
      });
    } catch (err) {
      console.warn('CMS content load failed:', err);
    }
  }

  async function loadTheme() {
    try {
      const res = await fetch('/api/admin/theme', {
        headers: { 'Authorization': AUTH }
      });
      const data = await res.json();
      if (!data.success) return;

      const themeMap = {
        'primary_color': '--c-purple',
        'secondary_color': '--c-purple-d',
        'accent_color': '--c-purple-l',
        'bg_dark': '--c-black'
      };

      (data.data || []).forEach(item => {
        const cssVar = themeMap[item.key] || item.key;
        if (cssVar.startsWith('--')) {
          document.documentElement.style.setProperty(cssVar, item.value);
        }
      });
    } catch (err) {
      console.warn('CMS theme load failed:', err);
    }
  }

  async function loadClients() {
    try {
      const res = await fetch('/api/admin/clients', {
        headers: { 'Authorization': AUTH }
      });
      const data = await res.json();
      if (!data.success) return;

      if (window.renderClientsFromCMS) {
        window.renderClientsFromCMS(data.data);
      }
    } catch (err) {
      console.warn('CMS clients load failed:', err);
    }
  }

  async function loadTeam() {
    try {
      const res = await fetch('/api/admin/team', {
        headers: { 'Authorization': AUTH }
      });
      const data = await res.json();
      if (!data.success) return;

      if (window.renderTeamFromCMS) {
        window.renderTeamFromCMS(data.data);
      }
    } catch (err) {
      console.warn('CMS team load failed:', err);
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    loadTheme();
    loadContent();
    loadClients();
    loadTeam();
  });
})();
