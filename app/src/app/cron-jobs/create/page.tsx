"use client";

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import CronJobTemplates from '../components/CronJobTemplates';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { emptyJob } from '../types';
import { CronJobForm } from '../components/CronJobForm';
import DashboardLayout from '@/app/home/page';
import { useGetAllCronJobsQuery, useCreateCronJobMutation } from '@/redux/services/cronJobsApi';
import { CreateCronJobRequest, UpdateCronJobRequest } from '../types';
import { useRouter } from 'next/navigation';

function CreateCronJob() {
    const [createCronJob, { isLoading: isCreating }] = useCreateCronJobMutation();
    const { data: allJobs, isLoading: isLoadingJobs, refetch: refetchJobs } = useGetAllCronJobsQuery({});
    const router = useRouter();

    const onSubmit = async (data: CreateCronJobRequest | UpdateCronJobRequest) => {
        console.log('Saving job data:', data);
        try {
            const newJobData: CreateCronJobRequest = {
                ...data,
            };
            await createCronJob(newJobData).unwrap();
            refetchJobs();
            router.push('/cron-jobs');
        } catch (error) {
            console.error('Error saving job:', error);
        }
    };

    if (isLoadingJobs || isCreating) {
        return <div>Loading...</div>;
    }

    return (
        <DashboardLayout>
            <div className='mx-0'>
                <Card className='border-0 bg-inherit'>
                    <CardHeader>
                        <CardTitle>Create a New Cron Job</CardTitle>
                        <CardDescription>Select a template or create a custom cron job</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="template">
                            <TabsList className="grid w-fit grid-cols-2">
                                <TabsTrigger value="template">Use Template</TabsTrigger>
                                <TabsTrigger value="custom">Create Custom</TabsTrigger>
                            </TabsList>
                            <TabsContent value="template">
                                <CronJobTemplates />
                            </TabsContent>
                            <TabsContent value="custom">
                                <CronJobForm initialJob={emptyJob} onSubmit={onSubmit} isNewJob />
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}

export default CreateCronJob;