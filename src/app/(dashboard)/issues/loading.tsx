import { Skeleton } from "@/components/ui/skeleton";

export default function IssuesLoading() {
    return (
        <div className="p-6 md:p-8 space-y-6 max-w-5xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100 fill-mode-both">
                <div className="space-y-2">
                    <Skeleton className="h-9 w-40" />
                    <Skeleton className="h-5 w-60" />
                </div>
                <Skeleton className="h-10 w-32 rounded-lg" />
            </div>
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-white rounded-xl p-4 border space-y-2 animate-in fade-in zoom-in-95 duration-500 fill-mode-both" style={{ animationDelay: `${(i + 2) * 100}ms` }}>
                        <Skeleton className="h-3 w-20" />
                        <Skeleton className="h-7 w-10" />
                    </div>
                ))}
            </div>
            {/* Issues list */}
            <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="bg-white rounded-2xl p-5 border shadow-sm flex items-start gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both" style={{ animationDelay: `${(i + 4) * 100}ms` }}>
                        <Skeleton className="h-9 w-9 rounded-lg shrink-0" />
                        <div className="flex-1 space-y-2">
                            <Skeleton className="h-5 w-3/4" />
                            <Skeleton className="h-3 w-1/2" />
                        </div>
                        <Skeleton className="h-6 w-20 rounded-full" />
                    </div>
                ))}
            </div>
        </div>
    );
}
