import { Skeleton } from "@/components/ui/skeleton";

export default function EventsLoading() {
    return (
        <div className="p-6 md:p-8 space-y-6 max-w-5xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100 fill-mode-both">
                <div className="space-y-2">
                    <Skeleton className="h-9 w-32" />
                    <Skeleton className="h-5 w-56" />
                </div>
                <Skeleton className="h-10 w-28 rounded-lg" />
            </div>
            <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-white rounded-2xl p-6 border shadow-sm flex gap-5 animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both" style={{ animationDelay: `${(i + 2) * 100}ms` }}>
                        <div className="w-16 h-16 rounded-xl bg-slate-100 shrink-0 flex flex-col items-center justify-center space-y-1">
                            <Skeleton className="h-3 w-8" />
                            <Skeleton className="h-6 w-6" />
                        </div>
                        <div className="flex-1 space-y-2">
                            <Skeleton className="h-5 w-2/3" />
                            <Skeleton className="h-4 w-1/2" />
                            <Skeleton className="h-3 w-1/3" />
                        </div>
                        <Skeleton className="h-9 w-20 rounded-lg self-center" />
                    </div>
                ))}
            </div>
        </div>
    );
}
