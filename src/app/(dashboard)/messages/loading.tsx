import { Skeleton } from "@/components/ui/skeleton";

export default function MessagesLoading() {
    return (
        <div className="p-6 md:p-8 space-y-6 max-w-5xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100 fill-mode-both">
                <div className="space-y-2">
                    <Skeleton className="h-9 w-40" />
                    <Skeleton className="h-5 w-64" />
                </div>
                <Skeleton className="h-10 w-36 rounded-lg" />
            </div>

            <div className="bg-white rounded-2xl border shadow-sm flex h-[600px] animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300 fill-mode-both">
                <div className="w-1/3 border-r p-4 space-y-4">
                    <Skeleton className="h-10 w-full rounded-lg" />
                    <div className="space-y-2">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="flex items-center gap-3 p-2 animate-in fade-in duration-500 fill-mode-both" style={{ animationDelay: `${(i + 4) * 100}ms` }}>
                                <Skeleton className="h-10 w-10 rounded-full" />
                                <div className="space-y-2 flex-1">
                                    <Skeleton className="h-4 w-3/4" />
                                    <Skeleton className="h-3 w-1/2" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex-1 p-6 flex flex-col justify-between">
                    <div className="space-y-4">
                        <div className="flex justify-start">
                            <Skeleton className="h-12 w-1/2 rounded-2xl rounded-tl-sm animate-pulse" />
                        </div>
                        <div className="flex justify-end">
                            <Skeleton className="h-12 w-2/3 rounded-2xl rounded-tr-sm animate-pulse" />
                        </div>
                        <div className="flex justify-start">
                            <Skeleton className="h-16 w-3/4 rounded-2xl rounded-tl-sm animate-pulse" />
                        </div>
                    </div>
                    <div className="pt-4 border-t mt-4 flex gap-2">
                        <Skeleton className="h-10 flex-1 rounded-full" />
                        <Skeleton className="h-10 w-10 rounded-full shrink-0" />
                    </div>
                </div>
            </div>
        </div>
    );
}
