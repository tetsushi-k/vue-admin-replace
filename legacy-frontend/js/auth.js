(function () {
  var TOKEN_KEY = 'admin_token';
  var LEGACY_KEYS = ['legacy_token', 'vue_token'];

  function migrateToken() {
    var existing = localStorage.getItem(TOKEN_KEY);
    if (existing) {
      return existing;
    }
    for (var i = 0; i < LEGACY_KEYS.length; i++) {
      var token = localStorage.getItem(LEGACY_KEYS[i]);
      if (token) {
        localStorage.setItem(TOKEN_KEY, token);
        localStorage.removeItem(LEGACY_KEYS[i]);
        return token;
      }
    }
    return null;
  }

  function getToken() {
    return localStorage.getItem(TOKEN_KEY);
  }

  function setToken(token) {
    localStorage.setItem(TOKEN_KEY, token);
    for (var i = 0; i < LEGACY_KEYS.length; i++) {
      localStorage.removeItem(LEGACY_KEYS[i]);
    }
  }

  function clearToken() {
    localStorage.removeItem(TOKEN_KEY);
    for (var i = 0; i < LEGACY_KEYS.length; i++) {
      localStorage.removeItem(LEGACY_KEYS[i]);
    }
  }

  function resolveApiBaseUrl() {
    if (window.API_BASE_URL) {
      return window.API_BASE_URL;
    }
    if (window.location.port === '8081') {
      return 'http://localhost:8000';
    }
    return window.location.origin;
  }

  window.LegacyAuth = {
    TOKEN_KEY: TOKEN_KEY,
    migrateToken: migrateToken,
    getToken: getToken,
    setToken: setToken,
    clearToken: clearToken,
    resolveApiBaseUrl: resolveApiBaseUrl,
  };
})();
