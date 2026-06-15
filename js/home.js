// ===== 面了么 - 首页模块 =====
MianBa.home = {
  render: function(container) {
    container.innerHTML =
      '<div class="p-8">' +
      // Hero区
      '  <div class="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-10 text-center text-white mb-10">' +
      '    <h1 class="text-3xl font-bold mb-2">面了么 —— AI校招面试教练</h1>' +
      '    <p class="text-blue-100 text-lg mb-6">每一次模拟，都离Offer更近</p>' +
      '    <button id="btn-cta" class="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-xl font-semibold text-base transition">立即体验 →</button>' +
      '  </div>' +
      // 功能快捷入口
      '  <div class="grid grid-cols-2 gap-4 mb-4">' +
      // 简历分析
      '    <div class="card p-5 cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all group" onclick="MianBa.app.switchTab(\'resume\')">' +
      '      <div class="flex items-start gap-4">' +
      '        <div class="w-11 h-11 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-blue-100 transition">' +
      '          <i data-lucide="file-search" class="w-5 h-5 text-blue-500"></i>' +
      '        </div>' +
      '        <div class="flex-1">' +
      '          <h3 class="font-semibold text-slate-800 mb-1">简历智能分析</h3>' +
      '          <p class="text-sm text-slate-500 mb-3">上传简历，AI多维度诊断弱点，给出优化建议</p>' +
      '          <span class="text-xs text-blue-500 group-hover:text-blue-600">立即分析 →</span>' +
      '        </div>' +
      '      </div>' +
      '    </div>' +
      // 模拟面试
      '    <div class="card p-5 cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all group" onclick="MianBa.app.switchTab(\'interview\')">' +
      '      <div class="flex items-start gap-4">' +
      '        <div class="w-11 h-11 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-blue-100 transition">' +
      '          <i data-lucide="mic" class="w-5 h-5 text-blue-500"></i>' +
      '        </div>' +
      '        <div class="flex-1">' +
      '          <h3 class="font-semibold text-slate-800 mb-1">AI模拟面试</h3>' +
      '          <p class="text-sm text-slate-500 mb-3">5大岗位 × 3级难度，沉浸式真实面试体验</p>' +
      '          <span class="text-xs text-blue-500 group-hover:text-blue-600">开始面试 →</span>' +
      '        </div>' +
      '      </div>' +
      '    </div>' +
      // 面试报告
      '    <div class="card p-5 cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all group" onclick="MianBa.app.switchTab(\'report\')">' +
      '      <div class="flex items-start gap-4">' +
      '        <div class="w-11 h-11 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-blue-100 transition">' +
      '          <i data-lucide="bar-chart-2" class="w-5 h-5 text-blue-500"></i>' +
      '        </div>' +
      '        <div class="flex-1">' +
      '          <h3 class="font-semibold text-slate-800 mb-1">面试报告</h3>' +
      '          <p class="text-sm text-slate-500 mb-3">多维评分雷达图 + 逐题回顾 + 提升建议</p>' +
      '          <span class="text-xs text-blue-500 group-hover:text-blue-600">查看报告 →</span>' +
      '        </div>' +
      '      </div>' +
      '    </div>' +
      // 岗位匹配
      '    <div class="card p-5 cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all group" onclick="MianBa.app.switchTab(\'match\')">' +
      '      <div class="flex items-start gap-4">' +
      '        <div class="w-11 h-11 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-blue-100 transition">' +
      '          <i data-lucide="target" class="w-5 h-5 text-blue-500"></i>' +
      '        </div>' +
      '        <div class="flex-1">' +
      '          <h3 class="font-semibold text-slate-800 mb-1">岗位匹配预测</h3>' +
      '          <p class="text-sm text-slate-500 mb-3">JD + 简历匹配分析，精准定位能力差距</p>' +
      '          <span class="text-xs text-blue-500 group-hover:text-blue-600">开始匹配 →</span>' +
      '        </div>' +
      '      </div>' +
      '    </div>' +
      // 会员定价
      '    <div class="card p-5 cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all group" onclick="MianBa.app.switchTab(\'pricing\')">' +
      '      <div class="flex items-start gap-4">' +
      '        <div class="w-11 h-11 bg-amber-50 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-amber-100 transition">' +
      '          <i data-lucide="gem" class="w-5 h-5 text-amber-500"></i>' +
      '        </div>' +
      '        <div class="flex-1">' +
      '          <h3 class="font-semibold text-slate-800 mb-1">会员方案</h3>' +
      '          <p class="text-sm text-slate-500 mb-3">免费版 / Pro版 / 旗舰版，按需选择</p>' +
      '          <span class="text-xs text-amber-500 group-hover:text-amber-600">查看定价 →</span>' +
      '        </div>' +
      '      </div>' +
      '    </div>' +
      // 个人中心（仅登录后可见）
      (MianBa.user && MianBa.user.isLoggedIn()
        ? '    <div class="card p-5 cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all group" onclick="MianBa.app.switchTab(\'dashboard\')">' +
          '      <div class="flex items-start gap-4">' +
          '        <div class="w-11 h-11 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-green-100 transition">' +
          '          <i data-lucide="user" class="w-5 h-5 text-green-500"></i>' +
          '        </div>' +
          '        <div class="flex-1">' +
          '          <h3 class="font-semibold text-slate-800 mb-1">个人中心</h3>' +
          '          <p class="text-sm text-slate-500 mb-3">练习统计、进步趋势、历史记录</p>' +
          '          <span class="text-xs text-green-500 group-hover:text-green-600">查看数据 →</span>' +
          '        </div>' +
          '      </div>' +
          '    </div>'
        : '') +
      '  </div>' +
      '</div>';

    lucide.createIcons();
    document.getElementById('btn-cta').onclick = function() {
      MianBa.app.switchTab('resume');
    };
  },
};
