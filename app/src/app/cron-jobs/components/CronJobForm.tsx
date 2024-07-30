"use client";

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import yaml from 'js-yaml';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { AceEditorComponent } from '../../../components/ui/CodeEditor';
import { CronJobData, cronJobSchema, JobStatus } from '../types';
import { filterJobDataForYaml } from '../hooks/filter-cron-job-fields';

interface CronJobFormProps {
    initialJob: Partial<CronJobData>;
    onSubmit: (data: CronJobData) => void;
    isNewJob: boolean;
}

export function CronJobForm({ initialJob, onSubmit, isNewJob }: CronJobFormProps) {
    const [yamlView, setYamlView] = useState(false);
    const [yamlContent, setYamlContent] = useState('');
    const [yamlError, setYamlError] = useState('');

    const form = useForm<CronJobData>({
        resolver: zodResolver(cronJobSchema),
        defaultValues: initialJob,
    });

    const watchedData = form.watch();

    useEffect(() => {
        const filteredData = filterJobDataForYaml(watchedData);
        setYamlContent(yaml.dump(filteredData));
    }, [watchedData]);

    const handleYamlChange = (newValue: string) => {
        setYamlContent(newValue);
        try {
            const parsed = yaml.load(newValue) as Partial<CronJobData>;
            Object.entries(parsed).forEach(([key, value]) => {
                form.setValue(key as keyof CronJobData, value as any);
            });
            setYamlError('');
        } catch (e) {
            setYamlError('Invalid YAML: ' + JSON.stringify(e, null, 4));
        }
    };

    return (
        <Form {...form}>
            <div className="mb-4 justify-between flex">
                <h1 className='text-3xl font-bold mb-6 mt-2'>
                    {isNewJob ? '' : `Edit Cron Job: ${initialJob.name}`}
                </h1>
                <div>
                    <Button variant='outline' onClick={() => setYamlView(!yamlView)} className='mr-2'>
                        {yamlView ? 'Normal View' : 'Developer View'}
                    </Button>
                    <Button onClick={form.handleSubmit(onSubmit)}>
                        {initialJob.id ? 'Save' : 'Create'}
                    </Button>
                </div>
            </div>
            {yamlView ? (
                <div className='space-y-4'>
                    <AceEditorComponent
                        mode="yaml"
                        onChange={handleYamlChange}
                        value={yamlContent}
                        name="yaml-editor"
                    />
                    {yamlError && <pre className="text-destructive whitespace-pre-wrap">{yamlError}</pre>}
                </div>
            ) : (
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="schedule"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Schedule (Cron Expression)</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="bashScript"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Bash Script</FormLabel>
                                <FormControl>
                                    <AceEditorComponent
                                        mode="sh"
                                        onChange={field.onChange}
                                        value={field.value || ''}
                                        name="bash-editor"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="command"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Run Command</FormLabel>
                                <FormControl>
                                    <Textarea {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="isActive"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <FormLabel className="text-base">Active</FormLabel>
                                    <FormDescription>
                                        Toggle to activate or deactivate the cron job
                                    </FormDescription>
                                </div>
                                <FormControl>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <div>
                        <FormLabel>Status</FormLabel>
                        <p>{form.watch('status')}</p>
                    </div>

                    <div>
                        <FormLabel>Last Run</FormLabel>
                        <p>{new Date(form.watch('lastRun')).toLocaleString()}</p>
                    </div>

                    <div>
                        <FormLabel>Next Run</FormLabel>
                        <p>{new Date(form.watch('nextRun')).toLocaleString()}</p>
                    </div>
                </form>
            )}
        </Form>
    );
}