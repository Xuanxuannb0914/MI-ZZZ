import { useQuery } from '@tanstack/react-query';
import { createRequestId } from '../lib/request-id';

export function useDesktopEnvironment() {
  return useQuery({
    queryKey: ['desktop', 'environment'],
    queryFn: () => window.desktop.app.getEnvironment(),
    staleTime: Infinity,
    meta: { requestId: createRequestId() },
  });
}
