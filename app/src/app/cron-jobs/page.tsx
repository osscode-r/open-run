"use client";
import React, { useState } from 'react';
import PaginateComp from '@/components/paginate';
import { useSortableSearchableData } from './hooks/useSortableSearchData';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../home/page';
import CreateCronJob from './create/page';
import { useGetAllCronJobsQuery } from '@/redux/services/cronJobsApi';
import { CronJob } from './types';
import CronJobList from './components/CronJobsList';
import CronJobsHeader from './components/CronJobsHeader';

const ITEMS_PER_PAGE = 8;

function CronJobs() {
    const [currentPage, setCurrentPage] = useState(1);
    const router = useRouter();
    const { data: allJobs, isLoading } = useGetAllCronJobsQuery({});
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

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const onEditCronJob = (id: string) => {
        router.push('/cron-jobs/' + id);
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if ((paginatedJobs || []).length === 0) {
        return <CreateCronJob />;
    }

    return (
        <DashboardLayout>
            <div className='flex flex-col'>
                <CronJobsHeader
                    searchTerm={searchTerm}
                    handleSearchChange={handleSearchChange}
                    handleSortChange={handleSortChange}
                    onCreateClick={() => router.push('/cron-jobs/create')}
                />
                <CronJobList jobs={paginatedJobs} onEditCronJob={onEditCronJob} />
                { totalPages > 1 &&
                    <div className="mt-8 flex justify-center">
                        <PaginateComp
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </div>
                }
            </div>
        </DashboardLayout>
    );
}

export default CronJobs;