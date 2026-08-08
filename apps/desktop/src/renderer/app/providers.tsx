import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MotionConfig } from 'framer-motion';
import type { PropsWithChildren } from 'react';
import { HashRouter } from 'react-router-dom';
import { StartupProvider } from '../hooks/use-startup';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <MotionConfig reducedMotion="user">
      <QueryClientProvider client={queryClient}>
        <StartupProvider>
          <HashRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
            {children}
          </HashRouter>
        </StartupProvider>
      </QueryClientProvider>
    </MotionConfig>
  );
}
