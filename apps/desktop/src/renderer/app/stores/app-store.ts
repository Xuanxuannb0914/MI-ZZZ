import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppStore {
  readonly favoriteAgentIds: readonly string[];
  readonly favoriteGuideIds: readonly string[];
  readonly favoriteEventIds: readonly string[];
  readonly favoriteTeamIds: readonly string[];
  readonly historyAgentIds: readonly string[];
  readonly historyGuideIds: readonly string[];
  readonly completedDailyTaskIds: readonly string[];
  readonly completedWeeklyTaskIds: readonly string[];
  readonly searchKeyword: string;
  readonly recentSearches: readonly string[];
  readonly isSidebarOpen: boolean;
  readonly isSidebarCollapsed: boolean;
  readonly themeMode: 'dark' | 'light';
  readonly performanceMode: 'quality' | 'balanced';
  readonly animationEnabled: boolean;
  readonly setSearchKeyword: (keyword: string) => void;
  readonly addRecentSearch: (keyword: string) => void;
  readonly toggleFavoriteAgent: (agentId: string) => void;
  readonly toggleFavoriteGuide: (guideId: string) => void;
  readonly toggleFavoriteEvent: (eventId: string) => void;
  readonly toggleFavoriteTeam: (teamId: string) => void;
  readonly recordAgentVisit: (agentId: string) => void;
  readonly recordGuideVisit: (guideId: string) => void;
  readonly toggleDailyTask: (taskId: string) => void;
  readonly toggleWeeklyTask: (taskId: string) => void;
  readonly setSidebarOpen: (isOpen: boolean) => void;
  readonly toggleSidebarCollapsed: () => void;
  readonly setThemeMode: (themeMode: 'dark' | 'light') => void;
  readonly setPerformanceMode: (performanceMode: 'quality' | 'balanced') => void;
  readonly setAnimationEnabled: (animationEnabled: boolean) => void;
  readonly clearLibraryState: () => void;
}

const HISTORY_LIMIT = 8;

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      favoriteAgentIds: [],
      favoriteGuideIds: ['miyabi-frostburn'],
      favoriteEventIds: ['astra-event'],
      favoriteTeamIds: ['miyabi-disorder'],
      historyAgentIds: [],
      historyGuideIds: ['miyabi-frostburn', 'battery-plan'],
      completedDailyTaskIds: ['coffee', 'scratch-card'],
      completedWeeklyTaskIds: ['ridu-fund'],
      searchKeyword: '',
      recentSearches: [],
      isSidebarOpen: false,
      isSidebarCollapsed: false,
      themeMode: 'dark',
      performanceMode: 'quality',
      animationEnabled: true,
      setSearchKeyword: (searchKeyword) => set({ searchKeyword }),
      addRecentSearch: (keyword) =>
        set((state) => {
          const normalized = keyword.trim();
          if (!normalized) return state;
          return {
            recentSearches: [
              normalized,
              ...state.recentSearches.filter((item) => item !== normalized),
            ].slice(0, 6),
          };
        }),
      toggleFavoriteAgent: (agentId) =>
        set((state) => ({
          favoriteAgentIds: state.favoriteAgentIds.includes(agentId)
            ? state.favoriteAgentIds.filter((favoriteId) => favoriteId !== agentId)
            : [...state.favoriteAgentIds, agentId],
        })),
      toggleFavoriteGuide: (guideId) =>
        set((state) => ({
          favoriteGuideIds: state.favoriteGuideIds.includes(guideId)
            ? state.favoriteGuideIds.filter((favoriteId) => favoriteId !== guideId)
            : [...state.favoriteGuideIds, guideId],
        })),
      toggleFavoriteEvent: (eventId) =>
        set((state) => ({
          favoriteEventIds: state.favoriteEventIds.includes(eventId)
            ? state.favoriteEventIds.filter((favoriteId) => favoriteId !== eventId)
            : [...state.favoriteEventIds, eventId],
        })),
      toggleFavoriteTeam: (teamId) =>
        set((state) => ({
          favoriteTeamIds: state.favoriteTeamIds.includes(teamId)
            ? state.favoriteTeamIds.filter((favoriteId) => favoriteId !== teamId)
            : [...state.favoriteTeamIds, teamId],
        })),
      recordAgentVisit: (agentId) =>
        set((state) => ({
          historyAgentIds: [
            agentId,
            ...state.historyAgentIds.filter((historyId) => historyId !== agentId),
          ].slice(0, HISTORY_LIMIT),
        })),
      recordGuideVisit: (guideId) =>
        set((state) => ({
          historyGuideIds: [
            guideId,
            ...state.historyGuideIds.filter((historyId) => historyId !== guideId),
          ].slice(0, HISTORY_LIMIT),
        })),
      toggleDailyTask: (taskId) =>
        set((state) => ({
          completedDailyTaskIds: state.completedDailyTaskIds.includes(taskId)
            ? state.completedDailyTaskIds.filter((id) => id !== taskId)
            : [...state.completedDailyTaskIds, taskId],
        })),
      toggleWeeklyTask: (taskId) =>
        set((state) => ({
          completedWeeklyTaskIds: state.completedWeeklyTaskIds.includes(taskId)
            ? state.completedWeeklyTaskIds.filter((id) => id !== taskId)
            : [...state.completedWeeklyTaskIds, taskId],
        })),
      setSidebarOpen: (isSidebarOpen) => set({ isSidebarOpen }),
      toggleSidebarCollapsed: () =>
        set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
      setThemeMode: (themeMode) => set({ themeMode }),
      setPerformanceMode: (performanceMode) => set({ performanceMode }),
      setAnimationEnabled: (animationEnabled) => set({ animationEnabled }),
      clearLibraryState: () =>
        set({
          favoriteAgentIds: [],
          favoriteGuideIds: [],
          favoriteEventIds: [],
          favoriteTeamIds: [],
          historyAgentIds: [],
          historyGuideIds: [],
          completedDailyTaskIds: [],
          completedWeeklyTaskIds: [],
        }),
    }),
    {
      name: 'ggh-zzz-app-state',
      partialize: ({
        favoriteAgentIds,
        favoriteEventIds,
        favoriteGuideIds,
        favoriteTeamIds,
        historyAgentIds,
        historyGuideIds,
        completedDailyTaskIds,
        completedWeeklyTaskIds,
        isSidebarCollapsed,
        themeMode,
        performanceMode,
        animationEnabled,
        recentSearches,
      }) => ({
        favoriteAgentIds,
        favoriteEventIds,
        favoriteGuideIds,
        favoriteTeamIds,
        historyAgentIds,
        historyGuideIds,
        completedDailyTaskIds,
        completedWeeklyTaskIds,
        isSidebarCollapsed,
        themeMode,
        performanceMode,
        animationEnabled,
        recentSearches,
      }),
      version: 4,
      migrate: (persistedState, version) => {
        if (!persistedState || typeof persistedState !== 'object') {
          return persistedState as AppStore;
        }

        const state = persistedState as Partial<AppStore>;
        if (version < 2) {
          return {
            ...state,
            favoriteTeamIds: Array.isArray(state.favoriteTeamIds) ? state.favoriteTeamIds : [],
            themeMode: state.themeMode === 'light' ? 'light' : 'dark',
            performanceMode: state.performanceMode === 'balanced' ? 'balanced' : 'quality',
            animationEnabled: state.animationEnabled !== false,
            completedDailyTaskIds: Array.isArray(state.completedDailyTaskIds)
              ? state.completedDailyTaskIds
              : ['coffee', 'scratch-card'],
            completedWeeklyTaskIds: Array.isArray(state.completedWeeklyTaskIds)
              ? state.completedWeeklyTaskIds
              : ['ridu-fund'],
          } as AppStore;
        }
        return {
          ...state,
          recentSearches: Array.isArray(state.recentSearches) ? state.recentSearches : [],
          completedDailyTaskIds: Array.isArray(state.completedDailyTaskIds)
            ? state.completedDailyTaskIds
            : ['coffee', 'scratch-card'],
          completedWeeklyTaskIds: Array.isArray(state.completedWeeklyTaskIds)
            ? state.completedWeeklyTaskIds
            : ['ridu-fund'],
        } as AppStore;
      },
    },
  ),
);
