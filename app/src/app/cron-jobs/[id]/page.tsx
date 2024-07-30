"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CronJobData, JobStatus } from '../types';
import { ArrowLeft } from 'lucide-react';
import { CronJobForm } from '../components/CronJobForm';
import DashboardLayout from '@/app/home/page';

interface CronJobProps {
    initialJob?: Partial<CronJobData>;
}

const defaultCronJob: CronJobData = {
    id: '',
    name: '',
    description: '',
    schedule: '',
    command: '',
    bashScript: '',
    isActive: true,
    lastRun: new Date().toISOString(),
    nextRun: new Date().toISOString(),
    status: JobStatus.STOPPED,
};

function CronJob({ initialJob = {} }: CronJobProps) {
    const router = useRouter();
    const combinedInitialJob = { ...defaultCronJob, ...initialJob };

    const onSubmit = (data: CronJobData) => {
        console.log('Saving job data:', data);
        router.push('/cron-jobs');
    };

    const isNewJob = !initialJob.id;

    return (
        <DashboardLayout>
            <CronJobForm initialJob={combinedInitialJob} onSubmit={onSubmit} isNewJob={isNewJob} />
        </DashboardLayout>
    );
}

export default CronJob;