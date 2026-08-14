import { List } from '@game-guide-hub/icons';
import type { GuideSection as GuideSectionModel } from '../../../entities/guide/model/types';

interface GuideTocProps {
  readonly sections: readonly GuideSectionModel[];
}

export function GuideToc({ sections }: GuideTocProps) {
  return (
    <nav className="guide-toc" aria-label="攻略目录">
      <div className="guide-rail-heading">
        <List aria-hidden="true" size={16} />
        <span>本篇目录</span>
      </div>
      <ol>
        {sections.map((section, index) => (
          <li key={section.id}>
            <a href={`#${section.id}`}>
              <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
              {section.title}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
