// ===== 面霸 - localStorage 读写封装 =====
MianBa.storage = {
  get: function(key) {
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  },

  set: function(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      MianBa.ui && MianBa.ui.toast('存储空间不足，请清理旧记录', 'error');
      return false;
    }
  },

  remove: function(key) {
    localStorage.removeItem(key);
  },

  getApiKey: function() {
    return localStorage.getItem(MianBa.Config.STORAGE_KEYS.API_KEY) || '';
  },

  setApiKey: function(key) {
    localStorage.setItem(MianBa.Config.STORAGE_KEYS.API_KEY, key);
  },

  addHistory: function(record) {
    var history = this.get(MianBa.Config.STORAGE_KEYS.HISTORY) || [];
    history.unshift(record);
    if (history.length > MianBa.Config.MAX_HISTORY) {
      history = history.slice(0, MianBa.Config.MAX_HISTORY);
    }
    this.set(MianBa.Config.STORAGE_KEYS.HISTORY, history);
    return history;
  },

  getHistory: function() {
    return this.get(MianBa.Config.STORAGE_KEYS.HISTORY) || [];
  },

  saveLastReport: function(report) {
    this.set(MianBa.Config.STORAGE_KEYS.LAST_REPORT, report);
  },

  getLastReport: function() {
    return this.get(MianBa.Config.STORAGE_KEYS.LAST_REPORT);
  },
};
