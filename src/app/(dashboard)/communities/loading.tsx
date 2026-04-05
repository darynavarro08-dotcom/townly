import { Skeleton } from "@/components/ui/skeleton";

export default function CommunitiesLoading() {
    return (
        <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100 fill-mode-both">
                <div className="space-y-2">
                    <Skeleton className="h-9 w-64" />
                    <Skeleton className="h-5 w-80" />
                </div>
            </div>

            <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="bg-white rounded-2xl p-6 border shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both" style={{ animationDelay: `${(i + 2) * 100}ms` }}>
                        <div className="flex items-center gap-4">
                            <Skeleton className="h-16 w-16 rounded-xl" />
                            <div className="space-y-2 flex-1">
                                <Skeleton className="h-6 w-1/3" />
                                <Skeleton className="h-4 w-1/2" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
