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
import CreateCronJob from './create/page';
import { useGetAllCronJobsQuery } from '@/redux/services/cronJobsApi';
import { useNavigation } from '@/lib/hook/use-navigation-hook';

const ITEMS_PER_PAGE = 8;

export interface CronJob {
    id: string;
    name: string;
    description: string;
    schedule: string;
    command: string;
    is_active: boolean;
    last_run: string;
    next_run: string;
    tag: string;
}

export enum JobStatus {
    RUNNING = 'Running',
    STOPPED = 'Stopped',
}

function CronJobs() {
    const [currentPage, setCurrentPage] = useState(1);
    const router = useRouter();
    const { data: allJobs, isLoading } = useGetAllCronJobsQuery({});
    const { navigateToCreateCronJob, navigateToEditCronJob } = useNavigation();
    const {
        filteredAndSortedData: filteredAndSortedJobs,
        searchTerm,
        handleSearchChange,
        handleSortChange,
    } = useSortableSearchableData<CronJob>(
        allJobs || [],
        ['name', 'description'],
        { key: 'name', direction: 'asc' }
    );

    const totalPages = Math.ceil(filteredAndSortedJobs.length / ITEMS_PER_PAGE);
    const paginatedJobs = filteredAndSortedJobs.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const paginatedJobs2: any[] = [];

    const handlePageChange = (pageNumber: React.SetStateAction<number>) => {
        setCurrentPage(pageNumber);
    };

    function onEditCronJob(id: string) {
        router.push('/cron-jobs/' + id);
    }

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    return (
        <>
            {paginatedJobs2.length > 0 ? (
                <DashboardLayout>
                    <div className='flex flex-col p-4 sm:p-6 md:p-8'>
                        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0'>
                            <div className='flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 w-full'>
                                <h1 className='text-xl lg:text-3xl font-bold'>Cron Jobs</h1>
                                <div className="relative w-full sm:w-64">
                                    <Search className='absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                                    <Input
                                        type="text"
                                        placeholder="Search jobs..."
                                        value={searchTerm}
                                        onChange={handleSearchChange}
                                        className="pl-8 w-full"
                                    />
                                </div>
                                <Select
                                    onValueChange={(value) => handleSortChange(value.split('_')[0] as 'name' | 'tag')}
                                    defaultValue="name_asc"
                                >
                                    <SelectTrigger className="w-full sm:w-[180px]">
                                        <SelectValue placeholder="Sort by" />
                                    </SelectTrigger>
                                    <SelectContent >
                                        <SelectItem value="name_asc">Name (A-Z)</SelectItem>
                                        <SelectItem value="name_desc">Name (Z-A)</SelectItem>
                                        <SelectItem value="tag_asc">Status (A-Z)</SelectItem>
                                        <SelectItem value="tag_desc">Status (Z-A)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button variant={'outline'} onClick={navigateToCreateCronJob} className="w-full sm:w-auto">
                                Create <PlusIcon className='ml-2 h-4 w-4' />
                            </Button>
                        </div>
                        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8'>
                            {paginatedJobs2.map((job, index) => (
                                <CronJobCard key={index} job={job} JobStatus={JobStatus} onEditCronJob={onEditCronJob} isLoading={isLoading} />
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
            ) : (
                <CreateCronJob />
            )}
        </>
    );
}

export default CronJobs;