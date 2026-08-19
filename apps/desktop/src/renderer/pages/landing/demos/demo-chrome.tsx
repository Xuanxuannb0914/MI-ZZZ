import { Link } from 'react-router-dom';

interface DemoChromeProps {
  readonly label: string;
}

/** 统一的 Demo 顶部导航栏，包含返回链接和当前 Demo 标识。 */
export function DemoChrome({ label }: DemoChromeProps) {
  return (
    <header className="demo-chrome">
      <div className="demo-chrome-brand">
        <Link to="/demos" className="demo-chrome-back" aria-label="返回 Demo 选择">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M10 2L5 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
        <span className="demo-chrome-badge">{label}</span>
      </div>
    </header>
  );
}