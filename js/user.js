// ===== 面了么 - 用户系统模块 =====
MianBa.user = {
  // 获取当前用户（未登录返回null）
  getCurrent: function() {
    return MianBa.storage.getUser();
  },

  // 是否已登录
  isLoggedIn: function() {
    var user = this.getCurrent();
    return !!(user && user.isLoggedIn);
  },

  // 获取用户plan
  getPlan: function() {
    var user = this.getCurrent();
    return (user && user.plan) ? user.plan : 'free';
  },

  // 获取plan配置
  getPlanConfig: function() {
    return MianBa.Config.PLANS[this.getPlan()] || MianBa.Config.PLANS.free;
  },

  // 登录/注册（合二为一）
  login: function(name, email) {
    var user = {
      isLoggedIn: true,
      name: name,
      email: email,
      plan: 'free',
      practiceCount: 0,
      totalMinutes: 0,
      joinDate: new Date().toISOString().slice(0, 10),
    };
    MianBa.storage.saveUser(user);
    MianBa.ui.toast('欢迎，' + name + '！', 'success');
  },

  // 升级plan
  upgradePlan: function(plan) {
    var user = this.getCurrent();
    if (!user) return;
    user.plan = plan;
    MianBa.storage.saveUser(user);
    var planName = MianBa.Config.PLANS[plan].name;
    MianBa.ui.toast('已升级至 ' + planName + '！', 'success');
  },

  // 检查岗位匹配是否超限
  canUseMatch: function() {
    var planConfig = this.getPlanConfig();
    var todayCount = MianBa.storage.getTodayMatchCount();
    return todayCount < planConfig.matchPerDay;
  },

  // 显示登录/注册弹窗
  showLoginModal: function() {
    var html =
      '<div class="text-center mb-4">' +
      '  <div class="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">' +
      '    <i data-lucide="user" class="w-7 h-7 text-blue-500"></i>' +
      '  </div>' +
      '  <h3 class="text-lg font-semibold text-slate-800">欢迎使用面了么</h3>' +
      '  <p class="text-sm text-slate-500 mt-1">输入信息即可开始，无需密码</p>' +
      '</div>' +
      '<div class="mb-3">' +
      '  <label class="block text-xs font-medium text-slate-600 mb-1">姓名</label>' +
      '  <input id="login-name" class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="你的昵称">' +
      '</div>' +
      '<div class="mb-3">' +
      '  <label class="block text-xs font-medium text-slate-600 mb-1">邮箱</label>' +
      '  <input id="login-email" type="email" class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="your@email.com">' +
      '</div>';

    var self = this;
    MianBa.ui.modal('登录 / 注册', html, function(overlay) {
      var name = overlay.querySelector('#login-name').value.trim();
      var email = overlay.querySelector('#login-email').value.trim();
      if (!name) { MianBa.ui.toast('请输入姓名', 'error'); return; }
      if (!email) { MianBa.ui.toast('请输入邮箱', 'error'); return; }
      self.login(name, email);
      MianBa.ui.renderSidebar(MianBa.state.currentTab);
    });
  },

  // 渲染侧边栏用户区
  renderUserArea: function() {
    var user = this.getCurrent();
    var container = document.getElementById('sidebar-user-area');
    if (!container) return;

    if (user && user.isLoggedIn) {
      var planConfig = MianBa.Config.PLANS[user.plan] || MianBa.Config.PLANS.free;
      var initials = user.name.charAt(0).toUpperCase();
      var planColor = user.plan === 'enterprise' ? 'bg-purple-500' : user.plan === 'pro' ? 'bg-amber-500' : 'bg-slate-400';
      container.innerHTML =
        '<div class="flex items-center gap-3 px-3 py-2.5 cursor-pointer hover:bg-slate-700 rounded-lg transition" onclick="MianBa.app.switchTab(\'dashboard\')" title="点击进入个人中心">' +
        '  <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">' + initials + '</div>' +
        '  <div class="flex-1 min-w-0">' +
        '    <p class="text-sm text-white truncate">' + user.name + '</p>' +
        '    <span class="inline-block px-1.5 py-0.5 rounded text-[10px] font-medium text-white ' + planColor + '">' + planConfig.name + '</span>' +
        '    <span class="block text-[10px] text-slate-400 mt-0.5">个人中心 →</span>' +
        '  </div>' +
        '</div>';
    } else {
      container.innerHTML =
        '<button onclick="MianBa.user.showLoginModal()" class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-700 transition text-sm">' +
        '  <i data-lucide="log-in" class="w-4 h-4"></i> 登录 / 注册' +
        '</button>';
    }
    lucide.createIcons();
  },
};
