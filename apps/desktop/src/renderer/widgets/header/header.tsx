import { Bell, ChevronDown, Clock3, LayoutGrid, Search, UserRound } from '@game-guide-hub/icons';
import { memo, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppStore } from '../../app/stores/app-store';
import { games } from '../../shared/mock/games';
import { type SearchResult, searchLocal } from '../../shared/search/search-index';
import { SearchBar } from '../../shared/ui/search-bar';

/** 路由首段 → 游戏元信息，用于顶栏当前工作区展示。 */
const gameByRoute = new Map(games.map((game) => [game.route.slice(1), game]));

const timeFormatter = new Intl.DateTimeFormat('zh-CN', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
});

const HeaderClock = memo(function HeaderClock() {
  const [time, setTime] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setTime(new Date()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <time className="command-clock" dateTime={time.toISOString()}>
      <Clock3 aria-hidden="true" size={14} />
      {timeFormatter.format(time)}
    </time>
  );
});

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchKeyword = useAppStore((state) => state.searchKeyword);
  const setSearchKeyword = useAppStore((state) => state.setSearchKeyword);
  const normalizedKeyword = searchKeyword.trim();
  const searchResults = useMemo(() => searchLocal(normalizedKeyword, 6), [normalizedKeyword]);

  const gameKey = location.pathname.split('/')[1] ?? '';
  const currentGame = gameByRoute.get(gameKey);

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  }, []);

  const openResult = (result: SearchResult) => {
    setSearchKeyword('');
    navigate(result.to);
  };

  const openSearch = () => {
    navigate(`/zzz/search?q=${encodeURIComponent(searchKeyword)}`);
  };

  return (
    <header className="ggh-glass glass-strong app-header command-bar sticky top-0 z-sticky">
      <button
        type="button"
        className="command-workspace-switch"
        onClick={() => navigate(currentGame?.route ?? '/zzz')}
        aria-label={`当前工作区：${currentGame?.name ?? '绝区零'}`}
      >
        <span className="command-game-mark">
          {currentGame ? currentGame.shortName.slice(0, 1) : 'Z'}
        </span>
        <span>
          <small>当前游戏</small>
          <strong>{currentGame?.name ?? '绝区零'}</strong>
        </span>
        <ChevronDown aria-hidden="true" size={15} />
      </button>
      <div className="command-search">
        <SearchBar
          value={searchKeyword}
          onChange={setSearchKeyword}
          placeholder="搜索角色、攻略、活动、资讯、音擎、驱动盘"
          label="全局搜索"
          inputRef={searchInputRef}
          onKeyDown={(event) => {
            if (event.key === 'Escape') setSearchKeyword('');
            if (event.key === 'Enter') {
              const firstResult = searchResults[0];
              if (firstResult) openResult(firstResult);
              else openSearch();
            }
          }}
        />
        <kbd>Ctrl K</kbd>
        {normalizedKeyword ? (
          <div
            className="ggh-glass glass-strong command-search-results"
            role="listbox"
            aria-label="本地搜索结果"
          >
            {searchResults.length ? (
              searchResults.map((result) => (
                <button
                  type="button"
                  role="option"
                  aria-selected="false"
                  key={result.id}
                  onClick={() => openResult(result)}
                >
                  <span className="command-search-kind">{result.kind}</span>
                  <span className="command-search-result-copy">
                    <strong>{result.title}</strong>
                    <small>{result.description}</small>
                  </span>
                </button>
              ))
            ) : (
              <p className="command-search-empty">未找到匹配的本地内容</p>
            )}
            <button type="button" className="command-search-all" onClick={openSearch}>
              <Search aria-hidden="true" size={14} />
              查看全部搜索结果
            </button>
          </div>
        ) : null}
      </div>
      <div className="command-actions">
        <span className="command-version">
          <LayoutGrid aria-hidden="true" size={14} />
          版本 2.1<small>风花之诗</small>
        </span>
        <HeaderClock />
        <button
          type="button"
          className="command-icon-button"
          aria-label="通知，2 条未读"
          onClick={() => navigate('/news')}
        >
          <Bell aria-hidden="true" size={18} />
          <span className="command-notification-dot" aria-hidden="true" />
        </button>
        <button
          type="button"
          className="command-avatar"
          aria-label="个人资料"
          onClick={() => navigate('/settings')}
        >
          <UserRound aria-hidden="true" size={17} />
        </button>
      </div>
    </header>
  );
}
