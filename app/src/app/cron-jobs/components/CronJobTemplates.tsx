import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import CronJobTemplatesSkeleton from './cron-job-templates-skeleton';
import { getAllTemplates } from '../hooks/cron-templates';
import PaginateComp from '@/components/paginate';
import { useSortableSearchableData } from '../hooks/useSortableSearchData';
import { CronTemplate } from '../types';
import { SearchBar } from './SearchBar';
import { TemplateGrid } from './CronTemplates';
import { SortOption, SortSelect } from './SortSelect';

const sortOptions: SortOption<CronTemplate>[] = [
    { value: 'name', label: 'Name (A-Z)', direction: 'asc' },
    { value: 'name', label: 'Name (Z-A)', direction: 'desc' },
    { value: 'schedule', label: 'Schedule (A-Z)', direction: 'asc' },
    { value: 'schedule', label: 'Schedule (Z-A)', direction: 'desc' },
];

interface CronJobTemplatesProps {
    isLoading?: boolean;
}

function CronJobTemplates({ isLoading = false }: CronJobTemplatesProps) {
    const ITEMS_PER_PAGE = 9;
    const router = useRouter();
    const templates = getAllTemplates();
    const [currentPage, setCurrentPage] = useState(1);

    const {
        filteredAndSortedData,
        searchTerm,
        handleSearchChange,
        handleSortChange,
        sortConfig,
    } = useSortableSearchableData<CronTemplate>(
        templates,
        ['name', 'description', 'schedule'],
        { key: 'name', direction: 'asc' }
    );

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, sortConfig]);

    const handleSelectTemplate = (templateName: string) => {
        router.push(`/cron-jobs/edit?template=${encodeURIComponent(templateName)}`);
    };

    const totalPages = Math.ceil(filteredAndSortedData.length / ITEMS_PER_PAGE);
    const paginatedTemplates = filteredAndSortedData.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const onSortChange = (newSort: SortOption<CronTemplate>) => {
        handleSortChange(newSort.value as keyof CronTemplate);
    };

    if (isLoading) {
        return <CronJobTemplatesSkeleton />;
    }

    return (
        <>
            <div className="relative mt-10 flex items-center space-x-4">
                <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0 w-full'>
                    <div className='flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 w-full'>
                        <SearchBar
                            searchTerm={searchTerm}
                            handleSearchChange={handleSearchChange}
                            label="Search Cron Job templates..."
                        />
                        <SortSelect<CronTemplate>
                            options={sortOptions}
                            currentSort={{
                                value: sortConfig.key,
                                direction: sortConfig.direction,
                                label: sortOptions.find(option =>
                                    option.value === sortConfig.key &&
                                    option.direction === sortConfig.direction
                                )?.label || ''
                            }}
                            onSortChange={onSortChange}
                            placeholder="Sort templates"
                        />
                    </div>
                </div>
            </div>
            <TemplateGrid
                templates={paginatedTemplates}
                handleSelectTemplate={handleSelectTemplate}
            />
            {totalPages > 1 && (
                <div className="flex justify-center mt-10">
                    <PaginateComp
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            )}
        </>
    );
}

export default CronJobTemplates;