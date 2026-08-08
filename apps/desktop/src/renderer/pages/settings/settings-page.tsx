import type { LucideIcon } from '@game-guide-hub/icons';
import {
  Database,
  Info,
  Languages,
  RotateCcw,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Trash2,
} from '@game-guide-hub/icons';
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
  Tabs,
} from '@game-guide-hub/ui';
import type { ReactNode } from 'react';
import { useAppStore } from '../../app/stores/app-store';
import { Page } from '../../shared/ui/page';
import { PageTransition } from '../../shared/ui/page-transition';

interface SettingRowProps {
  readonly icon: LucideIcon;
  readonly title: string;
  readonly description: string;
  readonly children: ReactNode;
}

function SettingRow({ icon: Icon, title, description, children }: SettingRowProps) {
  return (
    <div className="flex flex-col gap-content border-b border-border-subtle py-panel last:border-0 xl:flex-row xl:items-center">
      <span className="ggh-icon-container" aria-hidden="true">
        <Icon size={18} />
      </span>
      <div className="min-w-0 flex-1">
        <h2 className="text-label font-semibold">{title}</h2>
        <p className="mt-compact text-caption text-text-secondary">{description}</p>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

export default function SettingsPage() {
  const themeMode = useAppStore((state) => state.themeMode);
  const performanceMode = useAppStore((state) => state.performanceMode);
  const animationEnabled = useAppStore((state) => state.animationEnabled);
  const setThemeMode = useAppStore((state) => state.setThemeMode);
  const setPerformanceMode = useAppStore((state) => state.setPerformanceMode);
  const setAnimationEnabled = useAppStore((state) => state.setAnimationEnabled);
  const clearLibraryState = useAppStore((state) => state.clearLibraryState);

  return (
    <PageTransition>
      <Page className="page-surface page-settings max-w-foundation">
        <header>
          <p className="text-caption font-semibold text-content-electric">系统控制台</p>
          <h1 className="mt-control text-title1 font-semibold">设置</h1>
          <p className="mt-compact text-body text-text-secondary">
            管理主题、性能、动画与当前设备上的本地资料。
          </p>
        </header>
        <section className="ggh-glass glass-medium rounded-xl border border-border-subtle px-panel">
          <SettingRow
            icon={Sparkles}
            title="主题"
            description="深色主题为当前推荐；浅色映射已作为未来扩展基础。"
          >
            <Tabs
              label="主题模式"
              value={themeMode}
              onValueChange={setThemeMode}
              items={[
                { value: 'dark', label: '深色' },
                { value: 'light', label: '浅色' },
              ]}
            />
          </SettingRow>
          <SettingRow
            icon={SlidersHorizontal}
            title="性能模式"
            description="平衡模式会减少透明度和持续动效，适合低功耗设备。"
          >
            <Tabs
              label="性能模式"
              value={performanceMode}
              onValueChange={setPerformanceMode}
              items={[
                { value: 'quality', label: '画质优先' },
                { value: 'balanced', label: '平衡' },
              ]}
            />
          </SettingRow>
          <SettingRow
            icon={Sparkles}
            title="界面动画"
            description="关闭后保留必要状态反馈，并停用装饰性过渡。"
          >
            <Button
              variant={animationEnabled ? 'primary' : 'secondary'}
              onClick={() => setAnimationEnabled(!animationEnabled)}
              aria-pressed={animationEnabled}
            >
              {animationEnabled ? '已启用' : '已关闭'}
            </Button>
          </SettingRow>
          <SettingRow
            icon={Languages}
            title="语言"
            description="Alpha 1.0 的全部界面与本地资料均使用简体中文。"
          >
            <Button variant="secondary" disabled>
              简体中文
            </Button>
          </SettingRow>
          <SettingRow
            icon={Database}
            title="本地缓存"
            description="清除收藏与最近浏览，不会删除应用资源。"
          >
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="danger">
                  <Trash2 aria-hidden="true" size={15} />
                  清除资料
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogTitle>清除本地资料？</DialogTitle>
                <DialogDescription>
                  收藏角色、攻略、活动、配队与最近浏览记录将被移除。此操作不会影响游戏账号。
                </DialogDescription>
                <div className="mt-panel flex justify-end gap-control">
                  <DialogClose asChild>
                    <Button variant="secondary">取消</Button>
                  </DialogClose>
                  <DialogClose asChild>
                    <Button variant="danger" onClick={clearLibraryState}>
                      <RotateCcw aria-hidden="true" size={15} />
                      确认清除
                    </Button>
                  </DialogClose>
                </div>
              </DialogContent>
            </Dialog>
          </SettingRow>
        </section>
        <section className="border-t border-border-subtle py-panel">
          <h2 className="flex items-center gap-control text-label font-semibold">
            <Info aria-hidden="true" size={17} className="text-content-electric" />
            关于
          </h2>
          <dl className="mt-panel grid grid-cols-[auto_1fr] gap-x-layout gap-y-control text-body">
            <dt className="text-text-tertiary">产品</dt>
            <dd className="text-right">Asteris</dd>
            <dt className="text-text-tertiary">工作区</dt>
            <dd className="text-right">绝区零</dd>
            <dt className="text-text-tertiary">应用版本</dt>
            <dd className="text-right">Alpha 1.0.0</dd>
            <dt className="text-text-tertiary">资料模式</dt>
            <dd className="text-right">本地 Mock · 离线可用</dd>
          </dl>
          <p className="mt-section flex items-start gap-control text-caption text-text-tertiary">
            <ShieldCheck aria-hidden="true" size={15} className="mt-compact shrink-0" />
            本产品为非官方伴侣原型，与 HoYoverse 无关联。未来账号能力当前仅保留架构位置。
          </p>
        </section>
      </Page>
    </PageTransition>
  );
}
