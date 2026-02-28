'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'

export async function signUp(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const name = formData.get('name') as string

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: name,
            },
            emailRedirectTo: `${(await headers()).get('origin')}/auth/callback`,
        },
    })

    if (error) {
        throw new Error(error.message)
    }

    if (data.session) {
        revalidatePath('/', 'layout')
        redirect('/onboarding')
    }

    return { success: true, message: 'Check your email to confirm your account!' }
}

export async function signIn(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        throw new Error(error.message)
    }

    revalidatePath('/', 'layout')
    return redirect('/dashboard')
}

import { revalidatePath } from 'next/cache'

export async function signInWithOAuth(provider: 'google' | 'github') {
    const supabase = await createClient()

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
            redirectTo: `${(await headers()).get('origin')}/auth/callback`,
        },
    })

    if (error) {
        throw new Error(error.message)
    }

    if (data.url) {
        redirect(data.url)
    }
}

export async function signOut() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    revalidatePath('/', 'layout')
    return redirect('/')
}

export async function signInAsDemo() {
    const supabase = await createClient()
    const email = 'demo@example.com'
    const password = 'demo-password-123'

    // Try signing in
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (signInError) {
        // If sign in fails, try signing up
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: 'Demo User',
                },
            },
        })

        if (signUpError) throw new Error(signUpError.message)

        // Use the user from sign up or wait for them to confirm if setting not yet applied
        const user = signUpData.user
        if (!user) throw new Error("Could not create demo user")

        // Ensure demo community exists
        let demoCommunity = (await db.select().from(communities).where(eq(communities.name, 'Demo Community')).limit(1))[0]
        if (!demoCommunity) {
            demoCommunity = (await db.insert(communities).values({
                name: 'Demo Community',
                joinCode: 'DEMO12',
            }).returning())[0]
        }

        // Upsert user into our DB
        await db.insert(users).values({
            supabaseId: user.id,
            name: 'Demo User',
            email: email,
            role: 'admin',
            communityId: demoCommunity.id,
        }).onConflictDoUpdate({
            target: users.supabaseId,
            set: {
                communityId: demoCommunity.id,
                role: 'admin',
            }
        })

        // If no session was created, we need to sign in again after sign up
        if (!signUpData.session) {
            const { error: secondSignInError } = await supabase.auth.signInWithPassword({
                email,
                password,
            })
            if (secondSignInError) throw new Error(secondSignInError.message)
        }
    }

    revalidatePath('/', 'layout')
    return redirect('/dashboard')
}
