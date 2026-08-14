# Asteris Design System

## Purpose

Asteris is a desktop-first anime game intelligence client. All workspaces share the same visual
grammar: deep-blue atmosphere, restrained neon accents, frosted glass surfaces, Lucide icons, and
motion that communicates hierarchy.

The permanent UI foundation uses three card levels (`Basic`, `Elevated`, `Featured`) and four motion
tiers (`Fast` 150ms, `Normal` 250ms, `Slow` 400ms, `Cinematic` 900ms). Glass is reserved for
navigation, focused widgets, dialogs, and showcase cards.

## Tokens

The source of truth is `packages/theme/src/tokens` and `packages/theme/src/styles.css`. Components
must consume semantic CSS variables or Tailwind aliases; page code must not add raw colors, radii,
shadows, or timing values.

### Color

| Semantic token                   | Dark value             | Usage                            |
| -------------------------------- | ---------------------- | -------------------------------- |
| `primary`                        | `#27D3FF`              | Focus, links, primary actions    |
| `secondary`                      | `#8B5CF6`              | Intelligence, secondary emphasis |
| `accent`                         | `#A3FF12`              | Success, active state, progress  |
| `warning`                        | `#FFB020`              | Time-sensitive reminders         |
| `danger`                         | `#FF5A5F`              | Destructive and error state      |
| `canvas`                         | Deep blue gradient     | Application background           |
| `surface1/2/3`                   | Layered blue-gray      | Content hierarchy                |
| `textPrimary/Secondary/Tertiary` | Light blue-white scale | Type hierarchy                   |

Light theme values are defined in the same semantic slots. Do not branch on a raw color in a
component.

### Glass

Use exactly one of these classes on floating surfaces:

- `glass-light`: 14px blur, low opacity, contextual surfaces.
- `glass-medium`: 22px blur, standard cards and widgets.
- `glass-strong`: 30px blur, dialogs, command popovers, focused panels.

All glass surfaces share a one-pixel border, reflection layer, subtle grain, and elevation shadow
through `.ggh-glass`.

### Layout

- Base unit: 8px.
- Page padding: 32px at desktop.
- Section gap: 24px.
- Workspace grid: 12 columns with 16px gutters.
- Breakpoints: `compact` 1024px, `standard` 1280px, `wide` 1600px, `ultraWide` 1920px.
- Desktop content should use a max width of 1920px and reserve space for the persistent command
  bar/sidebar.

### Radius and elevation

Use `radius-md` for controls, `radius-lg` for compact cards, and `radius-xl` for hero/widget
surfaces. Use `shadow-level-1/2/3` for raised, floating, and dialog layers. Glow is reserved for
focus, active, and intentional hover feedback.

### Typography

The typeface is `Inter` with system fallbacks. Use the semantic scale: `display`, `title1`,
`title2`, `title3`, `bodyLarge`, `body`, `label`, `caption`, and `code`. Keep body text at or above
14px and preserve a 1.5-ish line-height for readable descriptions.

## Icon rules

Lucide is the only icon family. Use `IconContainer` for colored icon surfaces and keep icon sizes on
the 16/20/24px scale. Icon-only controls require an accessible label and a visible focus ring.

## Image rules

Use `ImageFrame` for banner, cover, avatar, thumbnail, and background media. It reserves aspect
ratio, applies a gradient mask and shadow, and lazy-loads by default. Hero media may opt into eager
loading; below-the-fold media stays lazy.

## Accessibility

Use semantic headings, labels, and native controls. Maintain visible `:focus-visible` rings, 4.5:1
primary text contrast, 3:1 secondary text contrast, keyboard navigation, reduced-motion support, and
text alternatives for meaningful images. Never make color the only status signal.

## Future themes

Theme modes are represented by `.theme-light` and `.theme-high-contrast`. New themes should only
remap semantic variables; component class names and layout contracts remain unchanged.

## 内容卡片

材料、公告、攻略与最近阅读统一使用 `ggh-card`/`ggh-widget`
作为容器。内容先显示名称与分类，再显示用途、来源或更新时间。卡片 hover 只使用轻微位移、边缘高光和图片缩放，不使用持续霓虹或影响布局的动画。
