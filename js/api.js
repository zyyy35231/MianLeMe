// ===== 面了么 - API调用与模拟降级 =====
MianBa.api = {
  // 通用API调用（带超时）
  _call: function(systemPrompt, userMessage, callback) {
    var apiKey = MianBa.storage.getApiKey();
    if (!apiKey) {
      callback(new Error('NO_API_KEY'), null);
      return;
    }

    var controller = new AbortController();
    var timeout = setTimeout(function() { controller.abort(); }, MianBa.Config.API_TIMEOUT);

    fetch(MianBa.Config.API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + apiKey,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
      signal: controller.signal,
    })
    .then(function(res) {
      clearTimeout(timeout);
      if (!res.ok) throw new Error('API HTTP ' + res.status);
      return res.json();
    })
    .then(function(data) {
      var content = data.choices && data.choices[0] && data.choices[0].message.content;
      callback(null, content);
    })
    .catch(function(err) {
      clearTimeout(timeout);
      callback(err, null);
    });
  },

  // 测试API Key
  testConnection: function(apiKey, callback) {
    fetch(MianBa.Config.API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + apiKey,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [{ role: 'user', content: 'Hi' }],
        max_tokens: 5,
      }),
      signal: AbortSignal.timeout(8000),
    })
    .then(function(res) {
      callback(res.ok, res.ok ? '连接成功！API Key 有效' : '连接失败: HTTP ' + res.status);
    })
    .catch(function(err) {
      callback(false, '连接失败: ' + err.message);
    });
  },

  // 构建面试System Prompt
  _buildInterviewPrompt: function(position, difficulty, weaknesses, positionDesc) {
    var weakStr = '';
    if (weaknesses && weaknesses.length > 0) {
      weakStr = '用户简历存在以下弱点，请针对性出题：\n' + weaknesses.map(function(w, i) { return (i + 1) + '. ' + w; }).join('\n') + '\n\n';
    }

    var descStr = '';
    if (positionDesc) {
      descStr = '【岗位详细要求】\n' + positionDesc + '\n\n请严格按照上述岗位要求出题，考察候选人是否满足这些具体条件。\n\n';
    }

    return '你是【' + position + '】的校招面试官，当前难度为【' + difficulty + '】。请用中文进行面试。\n\n' +
      descStr +
      '## 出题规则\n' +
      '- 第1题固定为"请做自我介绍"\n' +
      weakStr +
      '- 初级难度：侧重基础概念、行为面试题、学习能力考察\n' +
      '- 中级难度：侧重项目深挖、场景分析题、技术方案设计\n' +
      '- 高级难度：侧重系统设计、架构思维、压力题和综合能力\n\n' +
      '## 追问策略（根据回答质量动态决定，1-3次）\n' +
      '- 回答充分、STAR完整 → 不追问，直接进入下一题\n' +
      '- 回答尚可但有提升空间 → 追问1次，深挖细节\n' +
      '- 回答模糊、缺乏细节 → 追问2-3次，逐步引导完善\n' +
      '- 第一次追问：深挖实现细节（"具体是怎么实现的？用了什么技术？"）\n' +
      '- 第二次追问：索要量化数据（"有具体数据吗？提升了多少？"）\n' +
      '- 第三次追问（极少使用）：换角度追问（"如果换个场景呢？你觉得还有什么可以改进的？"）\n\n' +
      '## 评估规则\n' +
      '- 检查回答的STAR完整性：是否说明了背景(S)、任务(T)、行动(A)、结果(R)\n' +
      '- 关注回答的逻辑性、专业深度、表达清晰度\n' +
      '- 当面试进度达到设定题数时，设置suggestEnd为true\n\n' +
      '## 输出格式\n' +
      '严格按照以下JSON格式返回（不要包含markdown代码块标记）：\n' +
      '{"reply":"面试官说的话","followUp":true/false,"starIssues":["缺失的STAR环节"],"suggestEnd":false}';
  },

  // 分析简历
  analyzeResume: function(resumeText, position, callback) {
    var systemPrompt =
      '你是资深HR。请分析以下简历，并只返回JSON格式（不要markdown代码块标记）：\n' +
      '{\n' +
      '  "score":{"completeness":0-100,"professionalism":0-100,"highlight":0-100,"match":0-100},\n' +
      '  "weaknesses":["弱点1","弱点2","弱点3","弱点4"],\n' +
      '  "suggestions":["建议1","建议2","建议3","建议4"]\n' +
      '}\n' +
      '评分说明：completeness=信息完整性, professionalism=专业程度, highlight=亮点突出度, match=岗位匹配度。\n' +
      '目标岗位：' + position + '。';

    this._call(systemPrompt, resumeText, function(err, result) {
      if (err) {
        console.warn('API不可用，使用模拟简历分析:', err.message);
        MianBa.ui.toast('已切换到模拟模式分析简历', 'info');
        setTimeout(function() { callback(null, MianBa.MockResumeResult); }, 1500);
        return;
      }
      try {
        // 清理可能的markdown代码块
        var clean = result.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        var parsed = JSON.parse(clean);
        callback(null, parsed);
      } catch (e) {
        console.warn('简历分析JSON解析失败，使用模拟数据');
        setTimeout(function() { callback(null, MianBa.MockResumeResult); }, 1500);
      }
    });
  },

  // 面试对话
  interviewReply: function(messages, position, difficulty, weaknesses, positionDesc, callback) {
    var systemPrompt = this._buildInterviewPrompt(position, difficulty, weaknesses, positionDesc);

    // 只发最近5条消息节省token
    var recent = messages.slice(-5);
    var userMessage = JSON.stringify(recent.map(function(m) {
      return { role: m.role, content: m.content };
    }));

    this._call(systemPrompt, userMessage, function(err, result) {
      if (err) {
        console.warn('API不可用，使用模拟面试:', err.message);
        MianBa.ui.toast('已切换到模拟面试模式', 'info');
        setTimeout(function() {
          callback(null, MianBa.api._mockInterviewReply(messages, position));
        }, 1000 + Math.random() * 1000);
        return;
      }
      try {
        var clean = result.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        var parsed = JSON.parse(clean);
        callback(null, parsed);
      } catch (e) {
        console.warn('面试回复JSON解析失败，使用模拟数据');
        setTimeout(function() {
          callback(null, MianBa.api._mockInterviewReply(messages, position));
        }, 1000);
      }
    });
  },

  // 模拟面试回复（API降级时使用）
  _mockInterviewReply: function(messages, position) {
    var questions = MianBa.MockQuestions[position] || MianBa.MockQuestions['综合岗'];
    var msgCount = messages.length;

    // 第一条消息：自我介绍
    if (msgCount === 0) {
      return {
        reply: '你好！欢迎参加' + position + '的面试。首先，请做一个简单的自我介绍。',
        followUp: false, starIssues: [], suggestEnd: false,
        _wasFollowUp: false, _questionIndex: 0,
      };
    }

    // 找最后一条AI消息的 _questionIndex
    var lastQIdx = -1;
    var lastWasFollowUp = false;
    for (var i = msgCount - 1; i >= 0; i--) {
      if (messages[i].role === 'assistant') {
        lastQIdx = messages[i]._questionIndex !== undefined ? messages[i]._questionIndex : 0;
        lastWasFollowUp = messages[i]._wasFollowUp || false;
        break;
      }
    }

    var lastMsg = messages[msgCount - 1];
    var isUserReply = lastMsg && lastMsg.role === 'user' && lastMsg.content !== '[跳过此题]';

    // 统计当前题目已经追问了多少次
    var followUpCount = 0;
    for (var i = msgCount - 1; i >= 0; i--) {
      if (messages[i].role === 'assistant' && messages[i]._wasFollowUp) {
        followUpCount++;
      } else if (messages[i].role === 'assistant' && !messages[i]._wasFollowUp) {
        break;
      }
    }

    // 根据回答长度动态决定追问上限（回答越短→追问越多）
    var lastAnswerLen = (lastMsg && lastMsg.content) ? lastMsg.content.length : 0;
    var maxFollowUps;
    if (lastAnswerLen < 30) {
      maxFollowUps = 3;      // 回答很短，多追问
    } else if (lastAnswerLen < 80) {
      maxFollowUps = 2;      // 中等长度
    } else if (lastAnswerLen < 150) {
      maxFollowUps = 1;      // 较长回答
    } else {
      maxFollowUps = 0;      // 足够详细，不追问
    }

    // 追问逻辑
    if (isUserReply && followUpCount < maxFollowUps && lastQIdx >= 0 && lastQIdx < questions.length) {
      var curQ = questions[lastQIdx];
      if (curQ) {
        var followUpText;
        if (followUpCount === 0 && curQ.followUp) {
          followUpText = curQ.followUp;
        } else if (followUpCount === 1) {
          followUpText = '请再具体一些，有没有量化的数据或实际的案例能支撑你的说法？';
        } else {
          followUpText = '如果换个角度来思考这个问题呢？你还有什么想补充的吗？';
        }
        if (followUpText && Math.random() > 0.3) {
          return {
            reply: followUpText,
            followUp: true, starIssues: ['需要更具体的细节或数据支撑'], suggestEnd: false,
            _wasFollowUp: true, _questionIndex: lastQIdx,
          };
        }
      }
    }

    // 下一题：如果上一轮是追问，说明当前题目已完成，题号+1
    var nextIdx = lastWasFollowUp ? lastQIdx + 1 : lastQIdx + 1;
    if (nextIdx >= questions.length) nextIdx = questions.length - 1;

    var nextQ = questions[nextIdx];
    var suggestEnd = msgCount >= 10;

    return {
      reply: nextQ ? nextQ.q : '感谢你参加今天的面试，我们会在3个工作日内反馈结果。',
      followUp: false, starIssues: [], suggestEnd: suggestEnd,
      _wasFollowUp: false, _questionIndex: nextIdx,
    };
  },
};
