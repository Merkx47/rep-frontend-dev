/**
 * useAuth Hook
 * Convenience hook for accessing auth context
 */

import { useAuthContext } from '@/contexts/AuthContext';

export function useAuth() {
  return useAuthContext();
}

export default useAuth;
