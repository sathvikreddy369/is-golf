'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { authApi } from '@/lib/api/endpoints';
import { tokenStorage } from '@/lib/auth/token';
import { LoginInput, loginSchema } from '@/lib/validations/auth';

export default function LoginPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (values: LoginInput) => {
    const response = await authApi.login(values);
    tokenStorage.set(response.data.token);
    router.push('/dashboard');
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-md items-center px-6">
      <div className="card w-full">
        <h1 className="font-display text-3xl font-extrabold">Welcome back</h1>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <input className="w-full rounded-xl border border-brand-100 px-4 py-3" placeholder="Email" {...register('email')} />
            <p className="mt-1 text-xs text-coral">{errors.email?.message}</p>
          </div>
          <div>
            <input type="password" className="w-full rounded-xl border border-brand-100 px-4 py-3" placeholder="Password" {...register('password')} />
            <p className="mt-1 text-xs text-coral">{errors.password?.message}</p>
          </div>
          <button disabled={isSubmitting} className="btn-primary w-full">
            {isSubmitting ? 'Signing in...' : 'Login'}
          </button>
        </form>
        <p className="mt-4 text-sm text-ink/70">
          New here? <Link href="/signup" className="font-semibold text-brand-700">Create account</Link>
        </p>
      </div>
    </main>
  );
}
