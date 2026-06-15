// ===== 面了么 - 企业HR端 =====
MianBa.enterprise = {
  render: function(container) {
    // 权限检查
    if (!MianBa.user.isLoggedIn() || MianBa.user.getPlan() !== 'enterprise') {
      container.innerHTML =
        '<div class="p-8 flex flex-col items-center justify-center" style="min-height:60vh;">' +
        '  <i data-lucide="building-2" class="w-16 h-16 text-slate-300 mb-4"></i>' +
        '  <p class="text-slate-500 text-lg mb-2">旗舰版专属功能</p>' +
        '  <p class="text-slate-400 text-sm mb-4">升级至旗舰版，解锁HR管理后台</p>' +
        '  <button onclick="MianBa.app.switchTab(\'pricing\')" class="btn-accent">了解旗舰版 →</button>' +
        '</div>';
      lucide.createIcons();
      return;
    }

    var stats = MianBa.MockEnterprise.stats;
    var positions = MianBa.MockEnterprise.positions;

    container.innerHTML =
      '<div class="p-8">' +
      '  <h2 class="text-2xl font-bold text-slate-800 mb-6">企业HR管理后台</h2>' +
      // 统计卡片
      '  <div class="grid grid-cols-3 gap-4 mb-6">' +
      '    <div class="card p-5 text-center">' +
      '      <div class="text-3xl font-bold text-blue-600">' + stats.positions + '</div>' +
      '      <div class="text-sm text-slate-500 mt-1">发布岗位数</div>' +
      '    </div>' +
      '    <div class="card p-5 text-center">' +
      '      <div class="text-3xl font-bold text-green-600">' + stats.candidates + '</div>' +
      '      <div class="text-sm text-slate-500 mt-1">候选人总数</div>' +
      '    </div>' +
      '    <div class="card p-5 text-center">' +
      '      <div class="text-3xl font-bold text-orange-500">' + stats.pending + '</div>' +
      '      <div class="text-sm text-slate-500 mt-1">待筛选</div>' +
      '    </div>' +
      '  </div>' +
      // 岗位列表
      '  <h3 class="text-lg font-semibold text-slate-800 mb-3">岗位管理</h3>' +
      '  <div class="space-y-3">' +
      positions.map(function(p, i) {
        return '<div class="card">' +
          '<div class="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-slate-50" onclick="MianBa.enterprise._togglePosition(this)">' +
          '  <div class="flex items-center gap-4">' +
          '    <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center"><i data-lucide="briefcase" class="w-5 h-5 text-blue-500"></i></div>' +
          '    <div>' +
          '      <p class="font-medium text-slate-800">' + p.title + '</p>' +
          '      <p class="text-xs text-slate-400">' + p.department + ' · ' + p.candidates + '位候选人</p>' +
          '    </div>' +
          '  </div>' +
          '  <div class="flex items-center gap-4">' +
          '    <span class="text-sm font-bold text-blue-600">最高 ' + p.topScore + ' 分</span>' +
          '    <span class="collapse-arrow text-slate-400 text-xs">▼</span>' +
          '  </div>' +
          '</div>' +
          '<div class="collapse-content px-5" style="max-height:0">' +
          '  <div class="pb-4 pt-2 border-t border-slate-100">' +
          '    <p class="text-sm text-slate-600 mb-2">🏆 排名第一：<strong>' + p.topName + '</strong>（综合得分 ' + p.topScore + ' 分）</p>' +
          '    <p class="text-xs text-slate-400 mb-3">模拟面试过程中AI自动评估STAR完整性、专业深度和逻辑表达</p>' +
          '    <button class="text-sm text-blue-500 hover:text-blue-600">查看完整排名 →</button>' +
          '  </div>' +
          '</div>' +
          '</div>';
      }).join('') +
      '  </div>' +
      // 预约演示
      '  <div class="mt-8 text-center">' +
      '    <button id="btn-demo" class="btn-primary flex items-center gap-2 mx-auto"><i data-lucide="video" class="w-4 h-4"></i> 预约产品演示</button>' +
      '    <p class="text-xs text-slate-400 mt-2">或联系专属客服获取定制化方案</p>' +
      '  </div>' +
      '</div>';

    lucide.createIcons();

    var self = this;
    document.getElementById('btn-demo').onclick = function() {
      var html =
        '<p class="text-sm text-slate-600 mb-3">填写信息，我们的企业顾问将为您安排专属演示。</p>' +
        '<div class="mb-3"><input id="demo-company" class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" placeholder="公司名称"></div>' +
        '<div class="mb-3"><input id="demo-contact" class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" placeholder="联系人"></div>' +
        '<div class="mb-3"><input id="demo-phone" class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" placeholder="手机号码"></div>';
      MianBa.ui.modal('预约产品演示', html, function() {
        MianBa.ui.toast('已收到您的预约，我们将在1个工作日内联系您！', 'success');
      });
    };
  },

  _togglePosition: function(btn) {
    var content = btn.nextElementSibling;
    var arrow = btn.querySelector('.collapse-arrow');
    if (content.style.maxHeight === '0px' || content.style.maxHeight === '') {
      content.style.maxHeight = content.scrollHeight + 'px';
      if (arrow) arrow.textContent = '▲';
    } else {
      content.style.maxHeight = '0px';
      if (arrow) arrow.textContent = '▼';
    }
  },
};
