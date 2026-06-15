// ===== 面了么 - UI工具模块 =====
MianBa.ui = {
  toast: function(message, type) {
    type = type || 'info';
    var toast = document.createElement('div');
    toast.className = 'toast toast-' + type + ' fade-in-up';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(function() {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(20px)';
      setTimeout(function() { toast.remove(); }, 300);
    }, 3000);
  },

  modal: function(title, contentHtml, onConfirm) {
    var overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML =
      '<div class="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 fade-in-up">' +
      '  <div class="flex items-center justify-between mb-4">' +
      '    <h3 class="text-lg font-semibold text-slate-800">' + title + '</h3>' +
      '    <button class="modal-close text-slate-400 hover:text-slate-600 text-xl leading-none">&times;</button>' +
      '  </div>' +
      '  <div class="modal-body mb-4">' + contentHtml + '</div>' +
      '  <div class="flex justify-end gap-3">' +
      '    <button class="modal-cancel px-4 py-2 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50 text-sm">取消</button>' +
      '    <button class="modal-confirm btn-primary text-sm">确认</button>' +
      '  </div>' +
      '</div>';
    document.body.appendChild(overlay);

    var closeModal = function() { overlay.remove(); };
    overlay.querySelector('.modal-close').onclick = closeModal;
    overlay.querySelector('.modal-cancel').onclick = closeModal;
    overlay.onclick = function(e) { if (e.target === overlay) closeModal(); };
    overlay.querySelector('.modal-confirm').onclick = function() {
      if (onConfirm) onConfirm(overlay);
      closeModal();
    };
    return overlay;
  },

  showApiKeyModal: function() {
    var currentKey = MianBa.storage.getApiKey();

    var html =
      '<div class="mb-3">' +
      '  <label class="block text-sm font-medium text-slate-700 mb-1">DeepSeek API Key</label>' +
      '  <input id="api-key-input" type="password" class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" value="' + (currentKey || '') + '" placeholder="sk-...">' +
      '</div>' +
      '<div id="api-test-result" class="text-xs mb-3"></div>' +
      '<button id="btn-test-connection" class="w-full px-4 py-2 rounded-lg border border-blue-300 text-blue-600 hover:bg-blue-50 text-sm mb-3">测试连接</button>';

    var overlay = MianBa.ui.modal('设置 API Key', html, function(overlay) {
      var input = overlay.querySelector('#api-key-input');
      var newKey = input.value.trim();
      MianBa.storage.setApiKey(newKey);
      MianBa.state.apiKey = newKey;
      if (newKey) {
        MianBa.ui.toast('API Key 已保存', 'success');
      } else {
        MianBa.ui.toast('API Key 已清除', 'info');
      }
    });

    // 绑定测试连接按钮（需要在modal渲染后）
    setTimeout(function() {
      var testBtn = document.getElementById('btn-test-connection');
      if (testBtn) {
        testBtn.onclick = function() {
          var input = document.getElementById('api-key-input');
          var key = input.value.trim();
          if (!key) { MianBa.ui.toast('请先输入API Key', 'error'); return; }
          var resultDiv = document.getElementById('api-test-result');
          resultDiv.innerHTML = '<span class="text-slate-400">正在测试...</span>';
          MianBa.api.testConnection(key, function(ok, msg) {
            resultDiv.innerHTML = ok
              ? '<span class="text-green-600">连接成功</span>'
              : '<span class="text-red-500">' + msg + '</span>';
          });
        };
      }
    }, 100);
  },

  showLoading: function(container, message) {
    container.innerHTML =
      '<div class="flex flex-col items-center justify-center py-12">' +
      '  <div class="w-8 h-8 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mb-3"></div>' +
      '  <p class="text-slate-500 text-sm">' + (message || '加载中...') + '</p>' +
      '</div>';
  },

  renderSidebar: function(activeTab) {
    // 用户区
    var userArea = document.getElementById('sidebar-user-area');
    if (userArea && MianBa.user) {
      MianBa.user.renderUserArea();
    }

    // 主导航
    var mainTabs = [
      { id: 'home', label: '首页', icon: 'home' },
      { id: 'resume', label: '简历分析', icon: 'file-text' },
      { id: 'interview', label: '模拟面试', icon: 'mic' },
      { id: 'report', label: '面试报告', icon: 'bar-chart-2' },
    ];
    // 增值功能
    var extraTabs = [
      { id: 'match', label: '岗位匹配', icon: 'target' },
      { id: 'pricing', label: '会员定价', icon: 'gem' },
    ];
    // 企业版Tab（仅Enterprise可见）
    if (MianBa.user && MianBa.user.getPlan() === 'enterprise') {
      extraTabs.push({ id: 'enterprise', label: '企业版', icon: 'building-2' });
    }

    var nav = document.getElementById('nav-tabs');
    if (!nav) return;
    nav.innerHTML = '';

    // 渲染主功能
    mainTabs.forEach(function(tab) {
      var isActive = tab.id === activeTab;
      var btn = document.createElement('button');
      btn.className = 'nav-item w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-sm ' +
        (isActive ? 'active' : 'text-slate-300 hover:bg-slate-700');
      btn.innerHTML = '<i data-lucide="' + tab.icon + '" class="w-4 h-4"></i>' + tab.label;
      btn.onclick = function() { MianBa.app.switchTab(tab.id); };
      nav.appendChild(btn);
    });

    // 分隔线
    var divider = document.createElement('div');
    divider.className = 'border-t border-slate-700 my-2';
    nav.appendChild(divider);

    // 渲染增值功能
    extraTabs.forEach(function(tab) {
      var isActive = tab.id === activeTab;
      var btn = document.createElement('button');
      btn.className = 'nav-item w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-sm ' +
        (isActive ? 'active' : 'text-slate-300 hover:bg-slate-700');
      btn.innerHTML = '<i data-lucide="' + tab.icon + '" class="w-4 h-4"></i>' + tab.label;
      btn.onclick = function() { MianBa.app.switchTab(tab.id); };
      nav.appendChild(btn);
    });

    lucide.createIcons();
  },
};
