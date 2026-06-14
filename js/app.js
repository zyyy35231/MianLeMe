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

    // 首次使用引导：无API Key时弹窗提示
    if (!MianBa.state.apiKey) {
      var self = this;
      setTimeout(function() {
        var overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        overlay.innerHTML =
          '<div class="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 fade-in-up">' +
          '  <div class="text-center mb-4">' +
          '    <i data-lucide="zap" class="w-12 h-12 text-orange-400 mx-auto mb-3"></i>' +
          '    <h3 class="text-lg font-semibold text-slate-800">欢迎使用面了么</h3>' +
          '    <p class="text-sm text-slate-500 mt-2">检测到你尚未设置 DeepSeek API Key。</p>' +
          '    <p class="text-sm text-slate-500 mt-1">未设置时将使用<strong class="text-orange-500">内置模拟试题</strong>，</p>' +
          '    <p class="text-sm text-slate-500">也可以随时在左下角设置中接入 API 获得真实 AI 面试体验。</p>' +
          '  </div>' +
          '  <div class="flex flex-col gap-2">' +
          '    <button id="welcome-setup-btn" class="btn-primary w-full">设置 API Key</button>' +
          '    <button id="welcome-skip-btn" class="w-full py-2 text-sm text-slate-400 hover:text-slate-600">先体验模拟面试</button>' +
          '  </div>' +
          '</div>';
        document.body.appendChild(overlay);
        lucide.createIcons();

        var close = function() { overlay.remove(); };
        overlay.querySelector('#welcome-setup-btn').onclick = function() { close(); MianBa.ui.showApiKeyModal(); };
        overlay.querySelector('#welcome-skip-btn').onclick = close;
        overlay.onclick = function(e) { if (e.target === overlay) close(); };
      }, 500);
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
    }
  },
};

document.addEventListener('DOMContentLoaded', function() {
  MianBa.app.init();
});
