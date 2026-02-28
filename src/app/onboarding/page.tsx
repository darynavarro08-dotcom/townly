"use client";

import { useState, useEffect } from "react";
import { createCommunity, joinCommunity, searchCommunities, joinCommunityById } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Building, KeyRound, Search, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useDebounce } from "@/hooks/use-debounce";

export default function OnboardingPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<{ id: number; name: string }[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const debouncedSearch = useDebounce(searchQuery, 300);

    useEffect(() => {
        async function performSearch() {
            if (debouncedSearch.length < 2) {
                setSearchResults([]);
                return;
            }
            setIsSearching(true);
            try {
                const results = await searchCommunities(debouncedSearch);
                setSearchResults(results);
            } catch (e) {
                console.error("Search failed", e);
            } finally {
                setIsSearching(false);
            }
        }
        performSearch();
    }, [debouncedSearch]);

    async function handleCreate(formData: FormData) {
        setIsLoading(true);
        try {
            await createCommunity(formData);
        } catch (e: any) {
            toast.error(e.message || "Failed to create community");
            setIsLoading(false);
        }
    }

    async function handleJoin(formData: FormData) {
        setIsLoading(true);
        try {
            await joinCommunity(formData);
        } catch (e: any) {
            toast.error(e.message || "Failed to join community");
            setIsLoading(false);
        }
    }

    async function handleJoinById(id: number) {
        setIsLoading(true);
        try {
            await joinCommunityById(id);
        } catch (e: any) {
            toast.error(e.message || "Failed to join community");
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
            <div className="max-w-4xl w-full text-center mb-12">
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Welcome to Quormet!</h1>
                <p className="text-lg text-slate-500">To get started, simply choose an option below.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl w-full">
                <Card className="flex flex-col border-2 relative overflow-hidden transition-all hover:border-blue-200">
                    <div className="h-2 w-full bg-blue-600 absolute top-0 left-0" />
                    <CardHeader>
                        <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 mb-4">
                            <Building className="h-6 w-6" />
                        </div>
                        <CardTitle>Create a Community</CardTitle>
                        <CardDescription>You will be the administrator of this new workspace.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                        <form action={handleCreate} className="space-y-4">
                            <div className="space-y-2">
                                <label htmlFor="name" className="text-sm font-medium">Community Name</label>
                                <Input id="name" name="name" placeholder="E.g., Sunnyvale HOA" required disabled={isLoading} />
                            </div>
                            <Button type="submit" className="w-full" disabled={isLoading}>
                                Create Community
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <Card className="flex flex-col border-2 relative overflow-hidden transition-all hover:border-emerald-200">
                    <div className="h-2 w-full bg-emerald-600 absolute top-0 left-0" />
                    <CardHeader>
                        <div className="h-12 w-12 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600 mb-4">
                            <KeyRound className="h-6 w-6" />
                        </div>
                        <CardTitle>Join a Community</CardTitle>
                        <CardDescription>Enter a code or search for your community.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 space-y-6">
                        <form action={handleJoin} className="space-y-4">
                            <div className="space-y-2">
                                <label htmlFor="code" className="text-sm font-medium">Join with Code</label>
                                <Input id="code" name="code" placeholder="E.g., A1B2C3" required disabled={isLoading} className="uppercase" maxLength={6} />
                            </div>
                            <Button type="submit" variant="secondary" className="w-full bg-emerald-100 text-emerald-700 hover:bg-emerald-200" disabled={isLoading}>
                                Join with Code
                            </Button>
                        </form>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-slate-50 px-2 text-slate-500 font-medium">Or search</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label htmlFor="search" className="text-sm font-medium">Search by Name</label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                    <Input
                                        id="search"
                                        placeholder="E.g., Sunnyvale"
                                        className="pl-9"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            {isSearching ? (
                                <div className="flex items-center justify-center py-4">
                                    <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
                                </div>
                            ) : searchResults.length > 0 ? (
                                <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
                                    {searchResults.map((community) => (
                                        <div key={community.id} className="flex items-center justify-between p-3 rounded-lg border bg-white hover:border-emerald-200 transition-colors">
                                            <span className="font-medium text-sm">{community.name}</span>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 h-8 font-bold"
                                                onClick={() => handleJoinById(community.id)}
                                                disabled={isLoading}
                                            >
                                                Join
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            ) : debouncedSearch.length >= 2 ? (
                                <p className="text-center text-sm text-slate-500 py-4">No communities found matching &quot;{debouncedSearch}&quot;</p>
                            ) : null}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
