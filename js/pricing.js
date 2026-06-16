// ===== 面了么 - 会员定价页 =====
MianBa.pricing = {
  render: function(container) {
    var plans = [
      {
        id: 'free', name: '免费版', price: '¥0', period: '永久免费',
        features: ['模拟面试 5题/次', '简历智能分析', '基础面试报告', '岗位匹配 1次/天'],
        disabled: ['深度STAR报告', '无限面试题数', '企业HR管理后台'],
        color: 'slate', recommended: false,
      },
      {
        id: 'pro', name: 'Pro版', price: '¥19', period: '/月',
        features: ['模拟面试 无限题数', '简历智能分析', '深度STAR报告', '岗位匹配 10次/天', 'AI追问增强'],
        disabled: ['企业HR管理后台'],
        color: 'blue', recommended: true,
      },
      {
        id: 'enterprise', name: '旗舰版', price: '¥99', period: '/月',
        features: ['全部Pro功能', '无限岗位匹配', '企业HR管理后台', '候选人筛选排名', '专属客服支持', '可定制面试题库'],
        disabled: [],
        color: 'purple', recommended: false,
      },
    ];

    var currentPlan = MianBa.user ? MianBa.user.getPlan() : 'free';

    container.innerHTML =
      '<div class="p-8">' +
      '  <h2 class="text-2xl font-bold text-slate-800 mb-2 text-center">会员定价</h2>' +
      '  <p class="text-sm text-slate-500 mb-8 text-center">选择适合你的计划，提升面试竞争力</p>' +
      '  <div class="grid grid-cols-3 gap-6 max-w-4xl mx-auto">' +
      plans.map(function(p) {
        var isCurrent = p.id === currentPlan;
        var borderColor = p.color === 'blue' ? 'border-blue-500' : p.color === 'purple' ? 'border-purple-500' : 'border-slate-200';
        var btnClass = p.color === 'blue' ? 'btn-primary' : p.color === 'purple' ? 'bg-purple-500 hover:bg-purple-600 text-white rounded-lg px-6 py-2.5 font-medium transition border-none cursor-pointer' : 'border border-slate-300 text-slate-600 hover:bg-slate-50 rounded-lg px-6 py-2.5 font-medium transition cursor-pointer';
        var badgeColor = p.color === 'blue' ? 'bg-blue-500' : p.color === 'purple' ? 'bg-purple-500' : 'bg-slate-500';

        return '<div class="card relative ' + (p.recommended ? 'border-2 border-blue-500 shadow-lg scale-105' : '') + '">' +
          (p.recommended ? '<div class="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-blue-500 text-white text-xs font-bold rounded-full">🔥 最受欢迎</div>' : '') +
          '  <div class="p-6 text-center">' +
          '    <h3 class="text-lg font-bold text-slate-800 mb-1">' + p.name + '</h3>' +
          '    <div class="mt-4 mb-4">' +
          '      <span class="text-4xl font-bold text-slate-800">' + p.price + '</span>' +
          '      <span class="text-sm text-slate-400">' + p.period + '</span>' +
          '    </div>' +
          '    <ul class="space-y-2.5 mb-6 text-left">' +
          p.features.map(function(f) {
            return '<li class="flex items-center gap-2 text-sm text-slate-600"><i data-lucide="check" class="w-4 h-4 text-green-500 flex-shrink-0"></i>' + f + '</li>';
          }).join('') +
          p.disabled.map(function(d) {
            return '<li class="flex items-center gap-2 text-sm text-slate-400"><i data-lucide="x" class="w-4 h-4 text-slate-300 flex-shrink-0"></i>' + d + '</li>';
          }).join('') +
          '    </ul>' +
          (isCurrent
            ? '<button class="w-full px-6 py-2.5 rounded-lg text-sm font-medium bg-slate-100 text-slate-400 cursor-default" disabled>当前方案</button>'
            : '<button class="w-full px-6 py-2.5 rounded-lg text-sm font-medium ' + btnClass + '" data-plan="' + p.id + '" onclick="MianBa.pricing.upgrade(\'' + p.id + '\')">' + (p.id === 'enterprise' ? '联系销售' : '立即订阅') + '</button>') +
          '  </div>' +
          '</div>';
      }).join('') +
      '  </div>' +
      '</div>';

    lucide.createIcons();
  },

  upgrade: function(planId) {
    var planConfig = MianBa.Config.PLANS[planId];
    if (!planConfig) return;

    if (!MianBa.user.isLoggedIn()) {
      MianBa.ui.toast('请先登录', 'error');
      MianBa.user.showLoginModal();
      return;
    }

    if (planId === 'enterprise') {
      var html =
        '<p class="text-sm text-slate-600 mb-3">请留下联系方式，我们的销售团队将在1个工作日内与您联系。</p>' +
        '<div class="mb-3"><input id="ent-company" class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" placeholder="公司名称"></div>' +
        '<div class="mb-3"><input id="ent-phone" class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" placeholder="手机号码"></div>' +
        '<div class="mb-3"><textarea id="ent-need" class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" rows="2" placeholder="需求描述"></textarea></div>';
      MianBa.ui.modal('预约旗舰版演示', html, function() {
        MianBa.user.upgradePlan('enterprise');
        MianBa.ui.toast('已收到您的预约，销售将尽快联系！', 'success');
        MianBa.ui.renderSidebar(MianBa.state.currentTab);
        setTimeout(function() { MianBa.app.switchTab('pricing'); }, 500);
      });
      return;
    }

    MianBa.user.upgradePlan(planId);
    MianBa.ui.renderSidebar(MianBa.state.currentTab);
    setTimeout(function() { MianBa.app.switchTab('pricing'); }, 500);
  },
};
