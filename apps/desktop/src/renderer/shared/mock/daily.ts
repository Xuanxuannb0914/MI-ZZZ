export interface DailyTask {
  readonly id: string;
  readonly title: string;
  readonly detail: string;
  readonly isComplete: boolean;
}

export interface DailySchedule {
  readonly day: string;
  readonly materials: readonly string[];
  readonly priority: string;
  readonly energy: number;
}

export const dailySchedules: readonly DailySchedule[] = [
  { day: '周一', materials: ['强攻认证章', '击破组件'], priority: '代理人晋升', energy: 200 },
  { day: '周二', materials: ['异常认证章', '支援组件'], priority: '核心技素材', energy: 180 },
  { day: '周三', materials: ['防护认证章', '音擎能源'], priority: '音擎突破', energy: 160 },
  { day: '周四', materials: ['强攻认证章', '异常组件'], priority: '主力角色技能', energy: 220 },
  { day: '周五', materials: ['击破认证章', '支援组件'], priority: '辅助角色技能', energy: 180 },
  { day: '周六', materials: ['全部职业素材', '丁尼'], priority: '缺口资源补齐', energy: 240 },
  { day: '周日', materials: ['全部职业素材', '音擎能源'], priority: '下周资源预存', energy: 200 },
];

export const todaysMaterials = ['攻击认证章', '异常组件', '音擎能源模块'];
export const todaysFarming = [
  '实战模拟：代理人晋升',
  '定期清剿：猎人与獠牙',
  '专业挑战：恶名杜拉汉',
];
export const weeklyTasks: readonly DailyTask[] = [
  { id: 'hollow-zero', title: '零号空洞悬赏', detail: '完成 4 / 5 项目标', isComplete: false },
  { id: 'notorious-hunt', title: '恶名狩猎', detail: '领取 2 / 3 次奖励', isComplete: false },
  { id: 'ridu-fund', title: '丽都城每周任务', detail: '已完成', isComplete: true },
];
export const dailyTasks: readonly DailyTask[] = [
  { id: 'coffee', title: '在 Coff Cafe 喝咖啡', detail: '+60 电量', isComplete: true },
  { id: 'scratch-card', title: '完成刮刮卡', detail: '每日奖励', isComplete: true },
  { id: 'errands', title: '完成每日委托', detail: '完成 3 / 4 项', isComplete: false },
  { id: 'battery', title: '消耗电量', detail: '180 / 240', isComplete: false },
];
