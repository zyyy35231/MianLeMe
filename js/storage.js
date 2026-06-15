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
    // 更新统计数据
    var user = this.getUser();
    if (user && user.isLoggedIn) {
      user.practiceCount = (user.practiceCount || 0) + 1;
      user.totalMinutes = (user.totalMinutes || 0) + Math.floor(Math.random() * 15) + 5;
      this.saveUser(user);
    }
    this.set(MianBa.Config.STORAGE_KEYS.LAST_REPORT, report);
  },

  getLastReport: function() {
    return this.get(MianBa.Config.STORAGE_KEYS.LAST_REPORT);
  },

  // 用户数据
  getUser: function() {
    return this.get(MianBa.Config.STORAGE_KEYS.USER);
  },

  saveUser: function(user) {
    this.set(MianBa.Config.STORAGE_KEYS.USER, user);
  },

  // 岗位匹配次数管理
  getTodayMatchCount: function() {
    var data = this.get(MianBa.Config.STORAGE_KEYS.MATCH_COUNT);
    var today = new Date().toDateString();
    var savedDate = this.get(MianBa.Config.STORAGE_KEYS.MATCH_DATE);
    if (savedDate !== today) return 0;
    return data || 0;
  },

  incrementMatchCount: function() {
    var today = new Date().toDateString();
    var count = this.getTodayMatchCount() + 1;
    this.set(MianBa.Config.STORAGE_KEYS.MATCH_COUNT, count);
    this.set(MianBa.Config.STORAGE_KEYS.MATCH_DATE, today);
    return count;
  },
};
