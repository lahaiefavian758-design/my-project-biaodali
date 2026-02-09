
import React from 'react';
import { Scenario } from './types';

export const SCENARIOS: Scenario[] = [
  {
    id: 'report',
    icon: '📊',
    name: '工作汇报',
    desc: '向老板或跨部门同步关键进展',
    taskTitle: '季度重点项目复盘',
    background: '你的项目延期了1周但最终达成目标，老板在周会上要求你复盘。',
    requirement: '清晰说明结果、偏差原因及后续优化方案'
  },
  {
    id: 'negotiate',
    icon: '🤝',
    name: '资源谈判',
    desc: '在排期紧张时争取其他部门配合',
    taskTitle: '技术支持申请',
    background: '由于紧急运营活动，你需要技术部在2天内上线一个小功能，但他们排期已满。',
    requirement: '阐明利弊，说服对方调整优先级'
  },
  {
    id: 'speech',
    icon: '🎤',
    name: '电梯演讲',
    desc: '在极短时间内介绍项目或观点',
    taskTitle: '电梯里的融资机会',
    background: '你在电梯里偶遇了公司的CTO，你有30秒时间引起他对你新想法的兴趣。',
    requirement: '抓住痛点，给出愿景，邀请后续详谈'
  }
];

export const FRAMEWORKS = [
  { icon: '🎯', name: 'PREP框架', desc: '观点表达的万能公式', steps: ['Point观点', 'Reason理由', 'Example例子', 'Point重申'] },
  { icon: '⭐', name: 'STAR法则', desc: '讲述经历的标准结构', steps: ['Situation背景', 'Task任务', 'Action行动', 'Result结果'] },
  { icon: '🔺', name: '金字塔原理', desc: '结论先行，层层展开', steps: ['核心结论', '分论点1', '分论点2', '分论点3'] },
  { icon: '❓', name: 'SCQA模型', desc: '吸引注意力的开场结构', steps: ['Situation情境', 'Complication冲突', 'Question问题', 'Answer答案'] }
];
