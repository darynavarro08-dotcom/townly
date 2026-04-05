import { Skeleton } from "@/components/ui/skeleton";

export default function DocumentsLoading() {
    return (
        <div className="p-6 md:p-8 space-y-6 max-w-5xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100 fill-mode-both">
                <div className="space-y-2">
                    <Skeleton className="h-9 w-56" />
                    <Skeleton className="h-5 w-80" />
                </div>
                <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-24 rounded-lg" />
                    <Skeleton className="h-10 w-32 rounded-lg" />
                </div>
            </div>

            <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="bg-white rounded-xl p-4 border shadow-sm flex items-center justify-between animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both" style={{ animationDelay: `${(i + 2) * 100}ms` }}>
                        <div className="flex items-center gap-4">
                            <Skeleton className="h-10 w-10 rounded-lg" />
                            <div className="space-y-1.5">
                                <Skeleton className="h-5 w-48" />
                                <Skeleton className="h-4 w-32" />
                            </div>
                        </div>
                        <Skeleton className="h-8 w-8 rounded-full" />
                    </div>
                ))}
            </div>
        </div>
    );
}
