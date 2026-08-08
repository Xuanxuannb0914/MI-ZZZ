export interface NewsEntry {
  readonly id: string;
  readonly title: string;
  readonly kind: '公告' | '资讯' | '维护' | '版本' | '活动';
  readonly date: string;
  readonly summary: string;
}
export const news: readonly NewsEntry[] = [
  {
    id: 'version-2-1',
    title: '2.1 版本养成数据已更新',
    kind: '资讯',
    date: '8 月 5 日',
    summary: '角色优先级、活动日历与刷取建议已同步至最新版本。',
  },
  {
    id: 'hollow-zero',
    title: '零号空洞周常路线推荐',
    kind: '公告',
    date: '8 月 4 日',
    summary: '用更少轮次完成本周目标的路线与祝福选择。',
  },
  {
    id: 'disc-score',
    title: '驱动盘评分模型完成修订',
    kind: '资讯',
    date: '8 月 2 日',
    summary: '异常与冲击词条权重已按当前终局阈值重新校准。',
  },
  {
    id: 'maintenance',
    title: '服务器维护公告：8 月 7 日',
    kind: '维护',
    date: '8 月 1 日',
    summary: '维护期间部分实时数据将暂时不可用， Mock 内容仍可浏览。',
  },
  {
    id: 'patch-2-1-1',
    title: '2.1.1 版本更新说明',
    kind: '版本',
    date: '7 月 31 日',
    summary: '修复部分代理人技能描述与活动进度显示问题。',
  },
  {
    id: 'anniversary-notice',
    title: '周年庆系列活动说明',
    kind: '活动',
    date: '7 月 30 日',
    summary: '签到、委托与限定挑战的开放时间已经公布。',
  },
  {
    id: 'banner-notice',
    title: '独家频段「霜月之愿」开启',
    kind: '活动',
    date: '7 月 29 日',
    summary: '限定 S 级代理人星见雅获取概率限时提升。',
  },
  {
    id: 'known-issues',
    title: '当前版本已知问题说明',
    kind: '公告',
    date: '7 月 28 日',
    summary: '部分界面和战斗表现问题已确认并进入修复流程。',
  },
  {
    id: 'shiyu-refresh',
    title: '式舆防卫危机节点更新',
    kind: '资讯',
    date: '7 月 27 日',
    summary: '新一期敌人配置、增益效果与奖励目标已同步。',
  },
  {
    id: 'anti-cheat',
    title: '公平游戏环境专项公告',
    kind: '公告',
    date: '7 月 25 日',
    summary: '近期违规账号处置结果与安全提醒。',
  },
  {
    id: 'preview-stream',
    title: '2.2 版本前瞻节目预告',
    kind: '版本',
    date: '7 月 24 日',
    summary: '特别节目将在官方频道播出，并发放限时兑换码。',
  },
  {
    id: 'hotfix-combat',
    title: '战斗逻辑热更新完成',
    kind: '维护',
    date: '7 月 23 日',
    summary: '修复特定条件下连携技无法正常触发的问题。',
  },
  {
    id: 'community-event',
    title: '绳网创作征集活动开启',
    kind: '活动',
    date: '7 月 22 日',
    summary: '分享攻略、绘画和录像作品即可参与社区评选。',
  },
  {
    id: 'data-download',
    title: '预下载功能开放说明',
    kind: '资讯',
    date: '7 月 21 日',
    summary: '桌面端现已支持提前下载下一版本资源。',
  },
  {
    id: 'account-security',
    title: '账号安全与设备管理提示',
    kind: '公告',
    date: '7 月 20 日',
    summary: '建议定期检查登录设备并开启安全验证。',
  },
  {
    id: 'compensation',
    title: '维护补偿发放说明',
    kind: '维护',
    date: '7 月 19 日',
    summary: '维护补偿将通过游戏内邮件陆续发放。',
  },
];
