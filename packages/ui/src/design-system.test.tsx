import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Card } from './card/card';
import { SearchField } from './search/search-field';
import { Tabs } from './tabs/tabs';

describe('design system primitives', () => {
  it('applies a single glass strength to cards', () => {
    render(<Card glass="strong">情报卡片</Card>);

    expect(screen.getByText('情报卡片')).toHaveClass('ggh-glass', 'glass-strong');
  });

  it('keeps search labeling and clear behavior accessible', () => {
    const onValueChange = vi.fn();
    render(
      <SearchField
        label="全局搜索"
        value="星见雅"
        onValueChange={onValueChange}
        placeholder="搜索内容"
      />,
    );

    expect(screen.getByRole('searchbox', { name: '全局搜索' })).toHaveValue('星见雅');
    fireEvent.click(screen.getByRole('button', { name: '清空搜索' }));
    expect(onValueChange).toHaveBeenCalledWith('');
  });

  it('exposes the selected tab state', () => {
    const onValueChange = vi.fn();
    render(
      <Tabs
        label="内容视图"
        value="news"
        items={[
          { value: 'news', label: '公告' },
          { value: 'events', label: '活动' },
        ]}
        onValueChange={onValueChange}
      />,
    );

    expect(screen.getByRole('tab', { name: '公告' })).toHaveAttribute('aria-selected', 'true');
    fireEvent.click(screen.getByRole('tab', { name: '活动' }));
    expect(onValueChange).toHaveBeenCalledWith('events');
  });
});
