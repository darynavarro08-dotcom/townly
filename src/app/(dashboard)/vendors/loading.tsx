import { Skeleton } from "@/components/ui/skeleton";

export default function VendorsLoading() {
    return (
        <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100 fill-mode-both">
                <div className="space-y-2">
                    <Skeleton className="h-9 w-40" />
                    <Skeleton className="h-5 w-64" />
                </div>
                <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-24 rounded-lg" />
                    <Skeleton className="h-10 w-32 rounded-lg" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="bg-white rounded-2xl p-6 border shadow-sm space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both" style={{ animationDelay: `${(i + 2) * 100}ms` }}>
                        <div className="flex items-center gap-4">
                            <Skeleton className="h-14 w-14 rounded-xl" />
                            <div className="space-y-2 flex-1">
                                <Skeleton className="h-5 w-full" />
                                <Skeleton className="h-4 w-3/4" />
                            </div>
                        </div>
                        <div className="space-y-2 pt-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-5/6" />
                        </div>
                        <div className="pt-4 border-t space-y-2">
                            <Skeleton className="h-4 w-1/2" />
                            <Skeleton className="h-4 w-2/3" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
