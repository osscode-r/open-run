import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

export const useNavigation = () => {
  const router = useRouter();

  const navigate = useCallback((path: string) => {
    router.push(path);
  }, [router]);

  const goBack = useCallback(() => {
    router.back();
  }, [router]);

  const goHome = useCallback(() => {
    router.push('/');
  }, [router]);

  const navigateToCronJobs = useCallback(() => {
    router.push('/cron-jobs');
  }, [router]);

  const navigateToCreateCronJob = useCallback(() => {
    router.push('/cron-jobs/create');
  }, [router]);

  const navigateToEditCronJob = useCallback((id: string) => {
    router.push(`/cron-jobs/${id}`);
  }, [router]);

  return {
    navigate,
    goBack,
    goHome,
    navigateToCronJobs,
    navigateToCreateCronJob,
    navigateToEditCronJob,
  };
};
