import { Swords, UsersRound } from '@game-guide-hub/icons';
import { Card } from '@game-guide-hub/ui';
import { Link, Navigate, useParams } from 'react-router-dom';
import { agents, teams } from '../../shared/content';
import { Page } from '../../shared/ui/page';
import { PageTransition } from '../../shared/ui/page-transition';
import { Tag } from '../../shared/ui/tag';

function findTeamById(id: string) {
  return teams.find((team) => team.id === id);
}

export default function TeamsPage() {
  const { id } = useParams();
  const selected = id ? findTeamById(id) : undefined;
  if (id && !selected) return <Navigate replace to="/zzz/teams" />;
  return (
    <PageTransition>
      <Page className="page-surface content-catalog">
        <header className="content-catalog-header">
          <div>
            <p className="text-caption font-semibold text-content-electric">配队资料库 · 本地 Mock</p>
            <h1 className="mt-control text-title1 font-semibold">配队中心</h1>
            <p className="mt-compact text-body text-text-secondary">
              围绕核心角色、辅助位与循环思路整理的队伍方案。
            </p>
          </div>
          <span className="ggh-icon-container ggh-icon-container-accent" aria-hidden="true">
            <Swords size={20} />
          </span>
        </header>
        {selected ? <TeamDetail teamId={selected.id} /> : null}
        <div className="grid gap-content lg:grid-cols-2 xl:grid-cols-3">
          {teams.map((team) => (
            <Link key={team.id} to={`/zzz/teams/${team.id}`} className="group block">
              <Card interactive className="team-showcase-card h-full">
                <div className="flex items-start justify-between gap-content">
                  <span className="ggh-icon-container ggh-icon-container-secondary" aria-hidden="true">
                    <UsersRound size={18} />
                  </span>
                  <Tag>{team.focus}</Tag>
                </div>
                <h2 className="mt-panel text-title3 font-semibold">{team.name}</h2>
                <p className="mt-compact line-clamp-2 text-caption text-text-secondary">
                  {team.description}
                </p>
                <div className="team-member-row mt-panel">
                  {team.members.map((member) => {
                    const agent = agents.find((candidate) => candidate.name === member);
                    return (
                      <span key={member} className="team-member-chip">
                        {agent ? <img src={agent.avatar} alt="" loading="lazy" /> : null}
                        {member}
                      </span>
                    );
                  })}
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </Page>
    </PageTransition>
  );
}

function TeamDetail({ teamId }: { readonly teamId: string }) {
  const team = findTeamById(teamId);
  if (!team) return null;
  const members = team.agentIds.length
    ? team.agentIds.map((id) => agents.find((agent) => agent.id === id)).filter(Boolean)
    : team.members.map((name) => agents.find((agent) => agent.name === name)).filter(Boolean);
  return (
    <Card glass="strong" className="content-detail-panel">
      <div className="flex flex-wrap items-start justify-between gap-panel">
        <div>
          <p className="text-caption text-content-electric">{team.focus}</p>
          <h2 className="mt-control text-title2 font-semibold">{team.name}</h2>
          <p className="mt-compact max-w-3xl text-body text-text-secondary">{team.description}</p>
        </div>
        <Link to="/zzz/teams" className="text-caption text-text-secondary hover:text-text-primary">
          返回配队列表
        </Link>
      </div>
      <div className="team-detail-members mt-panel">
        {members.map((member) =>
          member ? (
            <Link key={member.id} to={`/zzz/agents/${member.id}`} className="team-detail-member">
              <img src={member.avatar} alt="" loading="lazy" />
              <span>
                <strong>{member.name}</strong>
                <small>{member.specialty} · {member.attribute}</small>
              </span>
            </Link>
          ) : null,
        )}
      </div>
      <div className="mt-panel grid gap-content lg:grid-cols-2">
        <TeamList label="队伍优势" items={team.advantages} />
        <TeamList label="操作注意" items={team.cautions} />
      </div>
    </Card>
  );
}

function TeamList({ label, items }: { readonly label: string; readonly items: readonly string[] }) {
  return <div className="rounded-md border border-border-subtle bg-surface-1 p-content"><p className="text-caption text-text-tertiary">{label}</p><ul className="mt-control space-y-compact text-caption text-text-primary">{items.map((item) => <li key={item}>{item}</li>)}</ul></div>;
}
