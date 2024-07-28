import React, { useEffect } from 'react'
import { useToast } from "@/components/ui/use-toast"

function ErrorHandler({ error, title }: { error: string, title: string }) {
    const { toast } = useToast()
    useEffect(() => {
        if (error) {
            toast({
                title: title,
                description: error,
                variant: "destructive",
            });
        }
    }, [error, title, toast]);
    return null
}

export default ErrorHandler