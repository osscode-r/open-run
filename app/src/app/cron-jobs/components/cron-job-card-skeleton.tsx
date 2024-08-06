import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

function CronJobCardSkeleton() {
  return (
    <Card className="hover:bg-muted transition-colors duration-200">
      <CardHeader className="flex justify-between items-center">
        <Skeleton className="h-5 w-1/2" />
        <Skeleton className="h-5 w-16" />
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-5 w-20" />
        </div>
      </CardContent>
    </Card>
  );
}

export default CronJobCardSkeleton;
