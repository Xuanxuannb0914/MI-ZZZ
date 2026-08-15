import { Disc3, RotateCcw, Search, ShieldCheck } from '@game-guide-hub/icons';
import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useMemo, useState } from 'react';
import { type Enemy, type EnemyCategory, enemies } from '../../shared/mock/enemies';
import { EmptyState } from '../../shared/ui/empty-state';

const categories: readonly ('全部' | EnemyCategory)[] = ['全部', '普通敌人', '精英敌人', 'Boss'];

function EnemyModel({ enemy }: { readonly enemy: Enemy }) {
  const material = (
    <meshStandardMaterial
      color={enemy.color}
      emissive={enemy.color}
      emissiveIntensity={0.22}
      roughness={0.35}
      metalness={0.45}
    />
  );
  return (
    <mesh rotation={[0.25, 0.45, 0]}>
      {enemy.geometry === 'sphere' ? (
        <sphereGeometry args={[1.3, 32, 32]} />
      ) : enemy.geometry === 'cone' ? (
        <coneGeometry args={[1.25, 2.8, 6]} />
      ) : (
        <boxGeometry args={[2.1, 2.1, 2.1]} />
      )}
      {material}
    </mesh>
  );
}

export function MonsterViewer() {
  const [category, setCategory] = useState<(typeof categories)[number]>('全部');
  const [keyword, setKeyword] = useState('');
  const [selectedId, setSelectedId] = useState(enemies[0]?.id ?? '');
  const list = useMemo(
    () =>
      enemies.filter(
        (enemy) =>
          (category === '全部' || enemy.category === category) &&
          (!keyword || `${enemy.name} ${enemy.area}`.includes(keyword)),
      ),
    [category, keyword],
  );
  const selected = list.find((enemy) => enemy.id === selectedId) ?? list[0];
  if (!selected)
    return (
      <EmptyState
        title="没有匹配敌人"
        description="清除搜索或选择其他分类。"
        actionLabel="清除筛选"
        onAction={() => {
          setKeyword('');
          setCategory('全部');
        }}
      />
    );
  return (
    <section
      className="mt-panel grid min-h-[34rem] gap-content xl:grid-cols-[15rem_minmax(0,1fr)_18rem]"
      aria-label="怪物图鉴"
    >
      <aside className="border-r border-border-subtle pr-content">
        <label className="sr-only" htmlFor="enemy-search">
          搜索敌人
        </label>
        <div className="flex items-center gap-compact border-b border-border-subtle pb-content">
          <Search size={15} />
          <input
            id="enemy-search"
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            className="min-w-0 flex-1 bg-transparent text-label outline-none"
            placeholder="搜索敌人"
          />
        </div>
        <div className="mt-content flex flex-wrap gap-compact">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              className={
                category === item
                  ? 'text-content-electric text-caption font-semibold'
                  : 'text-caption text-text-tertiary hover:text-text-primary'
              }
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>
        <div className="mt-panel divide-y divide-border-subtle">
          {list.map((enemy) => (
            <button
              key={enemy.id}
              type="button"
              onClick={() => setSelectedId(enemy.id)}
              className={
                selected.id === enemy.id
                  ? 'w-full py-content text-left text-content-electric'
                  : 'w-full py-content text-left text-text-secondary hover:text-text-primary'
              }
            >
              <span className="text-label font-semibold">{enemy.name}</span>
              <small className="mt-compact block text-caption text-text-tertiary">
                {enemy.category} · {enemy.rank} 级
              </small>
            </button>
          ))}
        </div>
      </aside>
      <div className="relative overflow-hidden bg-surface-1">
        <Canvas camera={{ position: [0, 0, 5], fov: 40 }}>
          <ambientLight intensity={1.6} />
          <pointLight position={[3, 4, 4]} intensity={18} color={selected.color} />
          <EnemyModel enemy={selected} />
          <OrbitControls enablePan={false} autoRotate autoRotateSpeed={0.6} />
        </Canvas>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between p-panel text-caption text-text-secondary">
          <span>
            <Disc3 className="mr-compact inline" size={15} />
            本地几何模型接口
          </span>
          <span>拖拽旋转 · 滚轮缩放</span>
        </div>
      </div>
      <aside className="border-l border-border-subtle pl-content">
        <p className="text-caption font-semibold text-content-electric">
          {selected.category} · {selected.rank} 级
        </p>
        <h2 className="mt-control text-title2 font-semibold">{selected.name}</h2>
        <p className="mt-content text-body leading-relaxed text-text-secondary">
          {selected.description}
        </p>
        <dl className="mt-panel space-y-content text-caption">
          <Row label="区域" value={selected.area} />
          <Row label="属性" value={selected.attribute} />
          <Row label="弱点" value={selected.weakTo.join('、')} />
          <Row label="抗性" value={selected.resistances.join('、')} />
        </dl>
        <div className="mt-panel border-l-2 border-content-electric pl-content">
          <p className="text-label font-semibold">
            <ShieldCheck className="mr-compact inline" size={15} />
            机制与建议
          </p>
          <p className="mt-compact text-caption leading-relaxed text-text-secondary">
            {selected.mechanic}
          </p>
        </div>
        <p className="mt-panel text-caption text-text-tertiary">
          掉落：{selected.drops.join('、')}
        </p>
        <button
          type="button"
          className="mt-panel inline-flex items-center gap-compact text-caption text-text-secondary hover:text-text-primary"
          onClick={() => setSelectedId(selected.id)}
        >
          <RotateCcw size={14} />
          重置查看
        </button>
      </aside>
    </section>
  );
}
function Row({ label, value }: { readonly label: string; readonly value: string }) {
  return (
    <div className="flex justify-between gap-content">
      <dt className="text-text-tertiary">{label}</dt>
      <dd className="text-right text-text-primary">{value}</dd>
    </div>
  );
}
