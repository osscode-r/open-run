"use client";

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import CronJobTemplates from '../components/CronJobTemplates';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { CronJob } from '../types';
import { CronJobForm } from '../components/CronJobForm';
import DashboardLayout from '@/app/home/page';

const emptyJob: Partial<CronJob> = {
    name: '',
    description: '',
    schedule: '',
    command: '',
    bash_script: '',
    is_active: true,
    last_run_at: ""
};

function CreateCronJob() {
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
                                <CronJobForm initialJob={emptyJob} onSubmit={() => { }} isNewJob />
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}

export default CreateCronJob;