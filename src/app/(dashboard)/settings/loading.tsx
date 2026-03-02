import { Skeleton } from "@/components/ui/skeleton";

export default function SettingsLoading() {
    return (
        <div className="p-6 md:p-8 space-y-8 max-w-5xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100 fill-mode-both">
                <Skeleton className="h-9 w-32" />
                <Skeleton className="h-5 w-64" />
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                <aside className="w-full md:w-64 space-y-1 shrink-0">
                    {[...Array(5)].map((_, i) => (
                        <Skeleton key={i} className="h-10 w-full rounded-md animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both" style={{ animationDelay: `${(i + 2) * 100}ms` }} />
                    ))}
                </aside>
                <div className="flex-1 space-y-6">
                    <div className="bg-white rounded-2xl p-6 border shadow-sm space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300 fill-mode-both">
                        <div className="space-y-2">
                            <Skeleton className="h-6 w-48" />
                            <Skeleton className="h-4 w-full max-w-md" />
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-10 w-full rounded-md" />
                            </div>
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-10 w-full rounded-md" />
                            </div>
                            <Skeleton className="h-10 w-32 rounded-md" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
