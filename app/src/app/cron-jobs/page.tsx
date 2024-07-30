"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusIcon, Search } from 'lucide-react';
import PaginateComp from '@/components/paginate';
import { Input } from "@/components/ui/input";
import CronJobCard from './components/CronJobCard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSortableSearchableData } from './hooks/useSortableSearchData';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../home/page';

const ITEMS_PER_PAGE = 8;

const generateSampleJobs = (count: number) => {
    return Array.from({ length: count }, (_, index) => ({
        id: `${index + 1}`,
        name: `Job ${index + 1}`,
        description: `Job ${index + 1} description`,
        schedule: '0 0 * * *',
        command: `command for job ${index + 1}`,
        isActive: index % 3 === 0,
        lastRun: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
        nextRun: new Date(Date.now() + Math.random() * 10000000000).toISOString(),
        tag: (index % 2) ? JobStatus.RUNNING : JobStatus.STOPPED,
    }));
};

export interface CronJob {
    id: string;
    name: string;
    description: string;
    schedule: string;
    command: string;
    isActive: boolean;
    lastRun: string;
    nextRun: string;
    tag: string;
}

const allJobs = generateSampleJobs(50);

export enum JobStatus {
    RUNNING = 'Running',
    STOPPED = 'Stopped',
}

function CronJobs() {
    const [currentPage, setCurrentPage] = useState(1);
    const router = useRouter();
    const {
        filteredAndSortedData: filteredAndSortedJobs,
        searchTerm,
        handleSearchChange,
        handleSortChange,
    } = useSortableSearchableData(allJobs, ['name', 'description'], { key: 'name', direction: 'asc' });

    const totalPages = Math.ceil(filteredAndSortedJobs.length / ITEMS_PER_PAGE);
    const paginatedJobs = filteredAndSortedJobs.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handlePageChange = (pageNumber: React.SetStateAction<number>) => {
        setCurrentPage(pageNumber);
    };

    function onEditCronJob(id: string) {
        router.push('/cron-jobs/' + id);
    }

    return (
        <DashboardLayout>
            <div className='flex flex-col '>
                <div className='flex justify-between items-center'>
                    <div className='flex items-center my-10 space-x-4'>
                        <h1 className='text-3xl font-bold'>Cron Jobs</h1>
                        <div className="relative">
                            <Search className='absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                            <Input
                                type="text"
                                placeholder="Search jobs..."
                                value={searchTerm}
                                onChange={handleSearchChange}
                                className="pl-8 w-64"
                            />
                        </div>
                        <Select
                            onValueChange={(value) => handleSortChange(value.split('_')[0] as 'name' | 'tag')}
                            defaultValue="name_asc"
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="name_asc">Name (A-Z)</SelectItem>
                                <SelectItem value="name_desc">Name (Z-A)</SelectItem>
                                <SelectItem value="tag_asc">Status (A-Z)</SelectItem>
                                <SelectItem value="tag_desc">Status (Z-A)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <Button variant={'outline'} onClick={() => router.push('/cron-jobs/create')} >Create <PlusIcon className='ml-2 h-4 w-4' /></Button>
                </div>
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8'>
                    {paginatedJobs.map((job, index) => (
                        <CronJobCard key={index} job={job} JobStatus={JobStatus} onEditCronJob={onEditCronJob} />
                    ))}
                </div>
                <div className="mt-8 flex justify-center">
                    <PaginateComp
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            </div>
        </DashboardLayout>
    );
}

export default CronJobs;