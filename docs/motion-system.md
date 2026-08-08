# Asteris Motion System

## Principles

Motion is spatial feedback, not decoration. Use short transitions for controls, medium transitions
for cards, and route transitions for page continuity. Avoid animating layout dimensions; prefer
opacity, transform, filter, and shadow.

## Presets

Shared Framer Motion presets live in `apps/desktop/src/renderer/shared/animation/motion-presets.ts`.

| Preset                              | Purpose                             |
| ----------------------------------- | ----------------------------------- |
| `fade`                              | Quiet visibility changes            |
| `slide`                             | Section and list entrance           |
| `scale`                             | Dialog and focused surface entrance |
| `float`                             | Very limited ambient hero motion    |
| `hoverCard` / `cardHoverMotion`     | Card lift and press feedback        |
| `hoverButton` / `buttonHoverMotion` | Button hover and press              |
| `hoverIcon`                         | Icon container feedback             |
| `page` / `pageMotion`               | Route enter and exit                |
| `sidebar` / `sidebarExpandMotion`   | Sidebar collapse continuity         |
| `dialog`                            | Dialog open/close                   |
| `cardStagger`                       | Small, bounded list stagger         |
| `sectionReveal`                     | Dashboard section reveal            |

Durations and easing curves are sourced from `packages/theme/src/tokens/motion.ts`. New presets must
reference those tokens rather than introducing local timing constants.

CSS motion also uses the same semantic source: `fast`, `normal`, `slow`, `route`, `loading`, and
`ambient`, plus the `pressed`, `hover`, and `raised` transform distances. This keeps hover lift,
press feedback, and loading sweeps consistent across framework and stylesheet boundaries.

## Accessibility and performance

Every CSS animation is disabled or shortened by `prefers-reduced-motion: reduce`. Continuous motion
is limited to ambient scenes and loading indicators. Pause scene loops while the document is hidden,
and dispose requestAnimationFrame, event listeners, materials, geometry, and renderers on unmount.
