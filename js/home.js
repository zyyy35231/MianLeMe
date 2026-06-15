// ===== 面了么 - 首页模块 =====
MianBa.home = {
  render: function(container) {
    container.innerHTML =
      '<div class="p-8">' +
      '  <div class="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-12 text-center text-white mb-8">' +
      '    <h1 class="text-4xl font-bold mb-3">面了么 —— AI校招面试教练</h1>' +
      '    <p class="text-blue-100 text-lg mb-2">每一次模拟，都离Offer更近</p>' +
      '    <p class="text-blue-200 text-sm mb-8">让每一次面试都胸有成竹</p>' +
      '    <button id="btn-cta" class="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-xl font-semibold text-lg transition">立即体验 →</button>' +
      '  </div>' +
      '  <div class="grid grid-cols-3 gap-6 mb-8">' +
      '    <div class="card p-6 text-center">' +
      '      <i data-lucide="file-search" class="w-10 h-10 text-blue-500 mx-auto mb-3"></i>' +
      '      <h3 class="font-semibold text-lg mb-2">简历智能分析</h3>' +
      '      <p class="text-slate-500 text-sm">AI深度诊断简历弱点，多维度评分，精准定位改进方向</p>' +
      '    </div>' +
      '    <div class="card p-6 text-center">' +
      '      <i data-lucide="mic" class="w-10 h-10 text-blue-500 mx-auto mb-3"></i>' +
      '      <h3 class="font-semibold text-lg mb-2">AI模拟面试</h3>' +
      '      <p class="text-slate-500 text-sm">5大岗位类型，3级难度可选，沉浸式真实面试体验</p>' +
      '    </div>' +
      '    <div class="card p-6 text-center">' +
      '      <i data-lucide="bar-chart-2" class="w-10 h-10 text-blue-500 mx-auto mb-3"></i>' +
      '      <h3 class="font-semibold text-lg mb-2">多维度报告</h3>' +
      '      <p class="text-slate-500 text-sm">雷达图+逐题点评+弱点标注，全面评估面试表现</p>' +
      '    </div>' +
      '  </div>' +
      '</div>';
    lucide.createIcons();
    document.getElementById('btn-cta').onclick = function() {
      MianBa.app.switchTab('resume');
    };
  },
};
