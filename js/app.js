// ===== 面了么 - 主应用入口 =====
MianBa.state = {
  currentTab: 'home',
  apiKey: '',
  interviewInProgress: false,
  interviewConfig: {},
  messages: [],
  answers: [],
  questionIndex: 0,
  roundIndex: 0,
  timerSeconds: 0,
  timerInterval: null,
  reportData: null,
  resumeWeaknesses: null,
  customPositionDesc: '',
};

MianBa.app = {
  init: function() {
    MianBa.state.apiKey = MianBa.storage.getApiKey();
    MianBa.state.reportData = MianBa.storage.getLastReport();

    var settingsBtn = document.getElementById('btn-settings');
    if (settingsBtn) {
      settingsBtn.onclick = MianBa.ui.showApiKeyModal;
    }
    this.switchTab('home');

    // 首次登录引导
    var user = MianBa.user && MianBa.user.getCurrent();
    if (!user || !user.isLoggedIn) {
      var self = this;
      setTimeout(function() {
        var overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        overlay.innerHTML =
          '<div class="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 fade-in-up">' +
          '  <div class="text-center mb-4">' +
          '    <div class="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">' +
          '      <i data-lucide="user" class="w-7 h-7 text-blue-500"></i>' +
          '    </div>' +
          '    <h3 class="text-lg font-semibold text-slate-800">欢迎使用面了么</h3>' +
          '    <p class="text-sm text-slate-500 mt-1">登录后可记录练习数据，解锁更多功能</p>' +
          '  </div>' +
          '  <div class="mb-3">' +
          '    <label class="block text-xs font-medium text-slate-600 mb-1">姓名</label>' +
          '    <input id="welcome-name" class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="你的昵称">' +
          '  </div>' +
          '  <div class="mb-3">' +
          '    <label class="block text-xs font-medium text-slate-600 mb-1">邮箱</label>' +
          '    <input id="welcome-email" type="email" class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="your@email.com">' +
          '  </div>' +
          '  <div class="flex flex-col gap-2">' +
          '    <button id="welcome-login-btn" class="btn-primary w-full">开始使用</button>' +
          '    <button id="welcome-skip-btn" class="w-full py-2 text-sm text-slate-400 hover:text-slate-600">跳过，先体验</button>' +
          '  </div>' +
          '</div>';
        document.body.appendChild(overlay);
        lucide.createIcons();

        var close = function() { overlay.remove(); };
        overlay.querySelector('#welcome-login-btn').onclick = function() {
          var name = overlay.querySelector('#welcome-name').value.trim();
          var email = overlay.querySelector('#welcome-email').value.trim();
          if (!name) { MianBa.ui.toast('请输入姓名', 'error'); return; }
          if (!email) { MianBa.ui.toast('请输入邮箱', 'error'); return; }
          MianBa.user.login(name, email);
          MianBa.ui.renderSidebar(MianBa.state.currentTab);
          close();
        };
        overlay.querySelector('#welcome-skip-btn').onclick = close;
        overlay.onclick = function(e) { if (e.target === overlay) close(); };
      }, 600);
    }

    // 未设置API Key时提示
    if (!MianBa.state.apiKey) {
      setTimeout(function() {
        var overlay2 = document.createElement('div');
        overlay2.className = 'modal-overlay';
        overlay2.innerHTML =
          '<div class="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 fade-in-up">' +
          '  <div class="text-center mb-4">' +
          '    <i data-lucide="zap" class="w-12 h-12 text-orange-400 mx-auto mb-3"></i>' +
          '    <h3 class="text-lg font-semibold text-slate-800">接入API获得真实AI体验</h3>' +
          '    <p class="text-sm text-slate-500 mt-2">检测到你尚未设置 DeepSeek API Key，当前将使用<strong class="text-orange-500">内置模拟试题</strong>。</p>' +
          '    <p class="text-sm text-slate-500 mt-1">你也可以在左下角设置中随时接入 API。</p>' +
          '  </div>' +
          '  <div class="flex flex-col gap-2">' +
          '    <button id="api-setup-btn" class="btn-primary w-full">设置 API Key</button>' +
          '    <button id="api-skip-btn" class="w-full py-2 text-sm text-slate-400 hover:text-slate-600">先体验模拟面试</button>' +
          '  </div>' +
          '</div>';
        document.body.appendChild(overlay2);
        lucide.createIcons();

        var close2 = function() { overlay2.remove(); };
        overlay2.querySelector('#api-setup-btn').onclick = function() { close2(); MianBa.ui.showApiKeyModal(); };
        overlay2.querySelector('#api-skip-btn').onclick = close2;
        overlay2.onclick = function(e) { if (e.target === overlay2) close2(); };
      }, 1500);
    }
  },

  switchTab: function(tabId) {
    // 面试进行中不允许切换（只允许切回面试tab）
    if (MianBa.state.interviewInProgress && tabId !== 'interview') {
      MianBa.ui.toast('面试进行中，请先结束面试再切换', 'error');
      return;
    }

    MianBa.state.currentTab = tabId;
    MianBa.ui.renderSidebar(tabId);

    var container = document.getElementById('content-area');
    if (!container) return;

    switch (tabId) {
      case 'home': MianBa.home.render(container); break;
      case 'resume': MianBa.resume.render(container); break;
      case 'interview': MianBa.interview.render(container); break;
      case 'report': MianBa.report.render(container); break;
      case 'match': MianBa.match.render(container); break;
      case 'pricing': MianBa.pricing.render(container); break;
      case 'dashboard': MianBa.dashboard.render(container); break;
      case 'enterprise': MianBa.enterprise.render(container); break;
    }
  },
};

document.addEventListener('DOMContentLoaded', function() {
  MianBa.app.init();
});
