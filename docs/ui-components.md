# Asteris UI Components

The shared component package is `packages/ui`. Components are intentionally small, typed, and
token-driven.

## Foundations

- `Button`: primary, secondary, quiet, danger; compact/default/comfortable sizes; disabled and
  loading states.
- `Card`: `light`, `medium`, and `strong` glass strengths; optional interactive hover contract;
  loading fallback.
- `Input`: semantic error state and focus treatment.
- `SearchField`: labeled local search input with clear action and keyboard support.
- `IconContainer`: primary, secondary, accent, and warning tones with active/disabled states.
- `Avatar`: Radix-backed image and fallback rendering.
- `ImageFrame`: banner/cover/avatar/thumbnail/background aspect ratios, gradient mask, lazy loading,
  and hover zoom.
- `Banner`: 带版本/活动信息的可复用大图横幅，支持 artwork、描述和 CTA 插槽。
- `ScrollArea`: 带可访问区域名称和键盘焦点的滚动容器，适合目录、历史和高密度列表。

## Feedback and navigation

- `Badge`: neutral, info, success, warning, and danger status labels.
- `Progress`: primary or accent progress bar with native progress semantics.
- `Skeleton`: reduced-motion-safe loading placeholder.
- `Loading`: labeled status spinner.
- `EmptyState`: icon, title, description, and optional action.
- `Tabs`: keyboard-friendly native buttons with `role="tab"` and `aria-selected`.
- `Dialog`, `Dropdown`, `Select`, `Tooltip`: Radix primitives with the shared glass and elevation
  language.

## Usage contract

1. Import from `@game-guide-hub/ui`; do not duplicate primitive markup in a page.
2. Use semantic Tailwind aliases (`bg-surface-1`, `text-text-secondary`, `border-border-subtle`)
   instead of raw values.
3. Put icons inside `IconContainer` when the icon is a visual status or navigation affordance.
4. Supply an accessible label for icon-only actions and meaningful image `alt` text.
5. Use `glass-light`, `glass-medium`, or `glass-strong` consistently with the surface hierarchy.
6. Use `Banner` for workspace-level hero content and `ScrollArea` for nested long lists; avoid
   inventing page-local glass or scrolling primitives.
