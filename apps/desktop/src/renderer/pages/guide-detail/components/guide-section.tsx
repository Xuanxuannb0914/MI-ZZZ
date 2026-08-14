import type { GuideSection as GuideSectionModel } from '../../../entities/guide/model/types';
import { GuideCallout } from './guide-callout';

interface GuideSectionProps {
  readonly section: GuideSectionModel;
  readonly index: number;
}

export function GuideSection({ section, index }: GuideSectionProps) {
  return (
    <section id={section.id} className="guide-section scroll-mt-layout">
      <div className="guide-section__heading">
        <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
        <h2>{section.title}</h2>
      </div>
      <div className="guide-prose">
        {section.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      {section.id === 'checklist' ? (
        <GuideCallout title="版本核对">
          内容会随版本节奏调整，请在实战前以游戏内公告与角色界面为准。
        </GuideCallout>
      ) : null}
    </section>
  );
}
