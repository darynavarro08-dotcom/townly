import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
    return (
        <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100 fill-mode-both">
                <Skeleton className="h-9 w-64" />
                <Skeleton className="h-5 w-80" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-32 w-full rounded-2xl animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both" style={{ animationDelay: `${(i + 2) * 100}ms` }} />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-500 delay-500 fill-mode-both">
                <div className="lg:col-span-2 space-y-6">
                    <Skeleton className="h-96 w-full rounded-2xl" />
                </div>
                <div className="space-y-6">
                    <Skeleton className="h-96 w-full rounded-2xl" />
                </div>
            </div>
        </div>
    );
}
