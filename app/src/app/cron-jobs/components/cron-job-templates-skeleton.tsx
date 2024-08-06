import React from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

function CronJobTemplateSkeleton() {
  return (
    <Card className="hover:cursor-pointer transition-colors duration-200">
      <CardHeader>
        <Skeleton className="h-6 w-3/4" />
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </CardContent>
      <CardFooter>
        <Skeleton className="h-10 w-28" />
      </CardFooter>
    </Card>
  );
}

function CronJobTemplatesSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mt-8">
      {[...Array(6)].map((_, index) => (
        <CronJobTemplateSkeleton key={index} />
      ))}
    </div>
  );
}

export default CronJobTemplatesSkeleton;
