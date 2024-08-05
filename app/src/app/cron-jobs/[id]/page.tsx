"use client";

import React from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { CreateCronJobRequest, UpdateCronJobRequest } from '../types';
import { CronJobForm } from '../components/CronJobForm';
import DashboardLayout from '@/app/home/page';
import { useGetAllCronJobsQuery, useGetCronJobByIdQuery, useUpdateCronJobByIdMutation, useCreateCronJobMutation } from '@/redux/services/cronJobsApi';
import { getAllTemplates } from '../hooks/cron-templates';

function CronJob() {
    const params = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();
    const cronJobId = params?.id as string;
    const templateName = searchParams?.get('template');

    const { data: cronJob, isLoading: isLoadingJob, refetch } = useGetCronJobByIdQuery(cronJobId, { skip: !cronJobId || !!templateName });
    const [updateCronJobById, { isLoading: isUpdating }] = useUpdateCronJobByIdMutation();
    const [createCronJob, { isLoading: isCreating }] = useCreateCronJobMutation();
    const { data: allJobs, isLoading: isLoadingJobs, refetch: refetchJobs } = useGetAllCronJobsQuery({});

    const templates = getAllTemplates();
    const selectedTemplate = templateName ? templates.find(t => t.name === decodeURIComponent(templateName)) : null;

    const initialJob = React.useMemo(() => {
        if (selectedTemplate) {
            return {
                id: '',
                schedule: selectedTemplate.schedule,
                command: selectedTemplate.command || '',
                name: selectedTemplate.name,
                user_id: '',
                created_at: '',
                updated_at: '',
                is_active: false,
                description: selectedTemplate.description,
                bash_script: selectedTemplate.bash_script,
                last_run_at: undefined,
            };
        }
        return cronJob || {
            id: '',
            schedule: '',
            command: '',
            name: '',
            user_id: '',
            created_at: '',
            updated_at: '',
            is_active: false,
            description: undefined,
            bash_script: undefined,
            last_run_at: undefined,
        };
    }, [selectedTemplate, cronJob]);

    const onSubmit = async (data: CreateCronJobRequest | UpdateCronJobRequest) => {
        console.log('Saving job data:', data);
        try {
            if (cronJobId && !templateName) {
                const body = {
                    ...data,
                    is_active: (data as UpdateCronJobRequest).is_active,
                    id: cronJobId
                };
                await updateCronJobById(body).unwrap();
                refetch();
                refetchJobs();
                console.log('Job updated successfully');
            } else {
                const newJobData: CreateCronJobRequest = {
                    ...data,
                };
                await createCronJob(newJobData).unwrap();
                refetchJobs();
                console.log(templateName ? 'New job created from template' : 'New job created');
                router.push('/cron-jobs');
            }
        } catch (error) {
            console.error('Error saving job:', error);
        }
    };

    if (isLoadingJob || isLoadingJobs || isUpdating || isCreating) {
        return <div>Loading...</div>;
    }

    return (
        <DashboardLayout>
            <CronJobForm 
                initialJob={initialJob}
                onSubmit={onSubmit}
                isNewJob={!cronJobId || !!templateName}
            />
        </DashboardLayout>
    );
}

export default CronJob;