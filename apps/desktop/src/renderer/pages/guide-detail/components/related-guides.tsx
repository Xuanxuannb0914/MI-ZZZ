import { ArrowUpRight } from '@game-guide-hub/icons';
import { Link } from 'react-router-dom';
import type { Guide } from '../../../entities/guide/model/types';

interface RelatedGuidesProps {
  readonly guides: readonly Guide[];
}

export function RelatedGuides({ guides }: RelatedGuidesProps) {
  if (!guides.length) return null;

  return (
    <section className="related-guides" aria-labelledby="related-guides-title">
      <p className="guide-rail-kicker">继续阅读</p>
      <h2 id="related-guides-title">相关攻略</h2>
      <div>
        {guides.map((guide) => (
          <Link key={guide.id} to={`/zzz/guides/${guide.id}`}>
            <span>
              <strong>{guide.title}</strong>
              <small>
                {guide.readTime} 分钟阅读 / 更新于 {guide.updatedAt}
              </small>
            </span>
            <ArrowUpRight aria-hidden="true" size={16} />
          </Link>
        ))}
      </div>
    </section>
  );
}
