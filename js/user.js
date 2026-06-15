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

  // 发送报告邮件
  sendReportEmail: function() {
    var user = this.getCurrent();
    if (!user || !user.email) {
      MianBa.ui.toast('请先在个人中心查看邮箱信息', 'error');
      return;
    }

    var report = MianBa.storage.getLastReport();
    if (!report) {
      MianBa.ui.toast('还没有面试报告', 'error');
      return;
    }

    // 从服务端配置读取EmailJS凭据
    var ec = MianBa.Config.EMAILJS;
    var publicKey = ec.PUBLIC_KEY;
    var serviceId = ec.SERVICE_ID;
    var templateId = ec.TEMPLATE_ID;

    // 构建HTML邮件
    var scoreColor = report.score >= 80 ? '#10B981' : report.score >= 60 ? '#F59E0B' : '#EF4444';
    var roundsHtml = (report.rounds || []).map(function(r, i) {
      var starBadges = (r.starIssues || []).map(function(s) {
        return '<span style="background:#FFF7ED;color:#EA580C;padding:2px 6px;border-radius:4px;font-size:11px;margin:2px">' + s + '</span>';
      }).join('');
      return '<tr><td style="padding:8px 0;border-bottom:1px solid #eee"><strong>Q' + (i + 1) + '：</strong>' + (r.question || '') + '</td></tr>' +
        '<tr><td style="padding:4px 0 8px 16px;color:#64748B;border-bottom:1px solid #eee">A：' + (r.answer || '') + '</td></tr>' +
        '<tr><td style="padding:4px 0 12px 16px;color:#3B82F6;font-size:13px">点评：' + (r.comment || '') + ' ' + starBadges + '</td></tr>';
    }).join('');

    var weaknessesHtml = (report.weaknesses || []).map(function(w) {
      return '<span style="background:#FEE2E2;color:#DC2626;padding:3px 8px;border-radius:12px;font-size:12px;margin:2px;display:inline-block">' + w + '</span>';
    }).join(' ');

    var suggestionsHtml = (report.suggestions || []).map(function(s, i) {
      return '<li style="margin-bottom:4px;color:#374151">' + s + '</li>';
    }).join('');

    var htmlBody =
      '<div style="max-width:600px;margin:0 auto;font-family:Arial,sans-serif">' +
      '  <div style="background:linear-gradient(135deg,#2563EB,#1D4ED8);color:white;padding:24px;border-radius:12px 12px 0 0;text-align:center">' +
      '    <h1 style="margin:0 0 4px;font-size:22px">面了么 AI 面试报告</h1>' +
      '    <p style="margin:0;opacity:0.85;font-size:14px">每一次模拟，都离Offer更近</p>' +
      '  </div>' +
      '  <div style="background:white;padding:24px;border-left:1px solid #E2E8F0;border-right:1px solid #E2E8F0">' +
      '    <p style="color:#64748B;font-size:13px;margin:0 0 16px">' + (user.name || '用户') + '，你好！以下是你的面试报告摘要。</p>' +
      '    <div style="text-align:center;padding:20px;background:#F8FAFC;border-radius:12px;margin-bottom:16px">' +
      '      <p style="color:#94A3B8;font-size:12px;margin:0 0 4px">综合得分</p>' +
      '      <p style="font-size:48px;font-weight:bold;color:' + scoreColor + ';margin:0">' + (report.score || '?') + '</p>' +
      '      <p style="color:#94A3B8;font-size:12px;margin:4px 0 0">满分 100 · ' + (report.position || '') + ' · ' + (report.difficulty || '') + '</p>' +
      '    </div>' +
      '    <table style="width:100%;border-collapse:collapse;margin-bottom:16px">' +
      '      <tr><td style="padding:6px 0;color:#64748B;font-size:13px">内容完整度</td><td style="text-align:right;font-weight:bold;color:#374151">' + ((report.dimensions && report.dimensions.content) || '-') + '</td></tr>' +
      '      <tr><td style="padding:6px 0;color:#64748B;font-size:13px">表达逻辑</td><td style="text-align:right;font-weight:bold;color:#374151">' + ((report.dimensions && report.dimensions.logic) || '-') + '</td></tr>' +
      '      <tr><td style="padding:6px 0;color:#64748B;font-size:13px">专业深度</td><td style="text-align:right;font-weight:bold;color:#374151">' + ((report.dimensions && report.dimensions.depth) || '-') + '</td></tr>' +
      '      <tr><td style="padding:6px 0;color:#64748B;font-size:13px">STAR结构</td><td style="text-align:right;font-weight:bold;color:#374151">' + ((report.dimensions && report.dimensions.star) || '-') + '</td></tr>' +
      '    </table>' +
      '    <div style="margin-bottom:16px"><p style="font-weight:bold;color:#DC2626;font-size:14px;margin:0 0 8px">薄弱项</p>' + weaknessesHtml + '</div>' +
      '    <div style="margin-bottom:16px"><p style="font-weight:bold;color:#374151;font-size:14px;margin:0 0 8px">逐题回顾</p>' +
      '      <table style="width:100%;font-size:13px">' + roundsHtml + '</table></div>' +
      '    <div><p style="font-weight:bold;color:#16A34A;font-size:14px;margin:0 0 8px">提升建议</p><ul style="padding-left:20px">' + suggestionsHtml + '</ul></div>' +
      '  </div>' +
      '  <div style="background:#F8FAFC;padding:16px 24px;border-radius:0 0 12px 12px;border:1px solid #E2E8F0;text-align:center">' +
      '    <p style="color:#94A3B8;font-size:12px;margin:0">由「面了么」AI面试教练生成 · ' + new Date().toLocaleDateString('zh-CN') + '</p>' +
      '  </div>' +
      '</div>';

    // EmailJS 已配置 → 静默发送
    if (publicKey && serviceId && templateId) {
      MianBa.ui.toast('正在发送邮件到 ' + user.email + '...', 'info');
      emailjs.init(publicKey);
      emailjs.send(serviceId, templateId, {
        to_email: user.email,
        subject: '面了么面试报告 — ' + (report.position || '未指定') + ' ' + report.score + '分',
        html_body: htmlBody,
      }).then(function() {
        MianBa.ui.toast('报告已发送到 ' + user.email, 'success');
      }).catch(function(err) {
        console.warn('EmailJS 发送失败，降级为 mailto:', err);
        MianBa.user._mailtoReport(user, report);
      });
    } else {
      // 未配置 EmailJS → 降级为 mailto
      this._mailtoReport(user, report);
    }
  },

  // mailto 降级方案
  _mailtoReport: function(user, report) {
    var text = '面了么 AI 面试报告\n\n';
    text += '综合得分：' + (report.score || '?') + ' / 100\n';
    text += '岗位：' + (report.position || '') + '  难度：' + (report.difficulty || '') + '\n\n';
    text += '── 四维评分 ──\n';
    var d = report.dimensions || {};
    text += '内容完整度：' + (d.content || '-') + '  表达逻辑：' + (d.logic || '-') + '\n';
    text += '专业深度：' + (d.depth || '-') + '  STAR结构：' + (d.star || '-') + '\n\n';
    text += '── 薄弱项 ──\n';
    (report.weaknesses || []).forEach(function(w, i) { text += (i + 1) + '. ' + w + '\n'; });
    text += '\n── 提升建议 ──\n';
    (report.suggestions || []).forEach(function(s, i) { text += (i + 1) + '. ' + s + '\n'; });
    text += '\n—— 面了么 AI面试教练';

    var subject = encodeURIComponent('面了么面试报告 — ' + (report.position || '未指定') + ' ' + (report.score || '?') + '分');
    var body = encodeURIComponent(text);
    window.open('mailto:' + user.email + '?subject=' + subject + '&body=' + body, '_blank');
    MianBa.ui.toast('已打开邮件客户端，请点击发送', 'info');
  },

  // 退出登录
  logout: function() {
    MianBa.storage.remove(MianBa.Config.STORAGE_KEYS.USER);
    MianBa.ui.toast('已退出登录', 'info');
    MianBa.ui.renderSidebar(MianBa.state.currentTab);
    MianBa.app.switchTab('home');
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
        '<div class="flex items-center gap-2 px-3 py-2.5 cursor-pointer hover:bg-slate-700 rounded-lg transition" onclick="MianBa.app.switchTab(\'dashboard\')" title="点击进入个人中心">' +
        '  <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">' + initials + '</div>' +
        '  <div class="flex-1 min-w-0">' +
        '    <p class="text-sm text-white truncate leading-tight">' + user.name + '</p>' +
        '    <span class="inline-block px-1.5 py-0.5 rounded text-[10px] font-medium text-white ' + planColor + '">' + planConfig.name + '</span>' +
        '  </div>' +
        '  <span class="text-[11px] text-blue-300 flex-shrink-0 hover:text-white" onclick="event.stopPropagation();MianBa.app.switchTab(\'dashboard\')">个人中心 →</span>' +
        '  <span class="text-[10px] text-slate-500 hover:text-red-400 flex-shrink-0 ml-1 cursor-pointer" title="退出登录" onclick="event.stopPropagation();MianBa.user.logout()">退出</span>' +
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
