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
import { CronJob, CreateCronJobRequest, UpdateCronJobRequest, createCronJobRequestSchema, updateCronJobRequestSchema } from '../types';

interface CronJobFormProps {
    initialJob: Partial<CronJob | CreateCronJobRequest>;
    onSubmit: (data: CreateCronJobRequest | UpdateCronJobRequest) => void;
    isNewJob: boolean;
}

export function CronJobForm({ initialJob, onSubmit, isNewJob }: CronJobFormProps) {
    const [yamlView, setYamlView] = useState(false);
    const [yamlContent, setYamlContent] = useState('');
    const [yamlError, setYamlError] = useState('');

    const form = useForm<CreateCronJobRequest | UpdateCronJobRequest>({
        resolver: zodResolver(isNewJob ? createCronJobRequestSchema : updateCronJobRequestSchema),
        defaultValues: initialJob,
    });

    const watchedData = form.watch();

    useEffect(() => {
        setYamlContent(yaml.dump(watchedData));
    }, [watchedData]);

    const handleYamlChange = (newValue: string) => {
        setYamlContent(newValue);
        try {
            const parsed = yaml.load(newValue) as Partial<CreateCronJobRequest | UpdateCronJobRequest>;
            Object.entries(parsed).forEach(([key, value]) => {
                form.setValue(key as any, value as any);
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
                    {isNewJob ? 'Create New Cron Job' : `Edit Cron Job: ${initialJob.name}`}
                </h1>
                <div>
                    <Button variant={'secondary'} size={'lg'} onClick={() => setYamlView(!yamlView)} className='mr-2'>
                        {yamlView ? 'Normal View' : 'Developer View'}
                    </Button>
                    <Button size={'lg'} onClick={form.handleSubmit(onSubmit)}>
                        {isNewJob ? 'Create' : 'Save'}
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="col-span-1 space-y-5">
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
                            {!isNewJob && (
                                <FormField
                                    control={form.control}
                                    name="is_active"
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
                            )}
                            {!isNewJob && 'last_run_at' in initialJob && (
                                <div className='col-span-2 grid grid-cols-1 lg:grid-cols-2 space-y-5'>
                                    <div className='mt-5'>
                                        <FormLabel>Last Run</FormLabel>
                                        <p>{new Date(initialJob.last_run_at as string).toLocaleString()}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="col-span-1 space-y-5">
                            <FormField
                                control={form.control}
                                name="bash_script"
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
                        </div>
                    </div>
                </form>
            )}
        </Form>
    );
}