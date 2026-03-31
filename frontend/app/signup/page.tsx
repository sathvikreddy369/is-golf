'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/components/auth/AuthProvider';
import { SignupInput, signupSchema } from '@/lib/validations/auth';

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();
  const [serverError, setServerError] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema)
  });

  const onSubmit = async (values: SignupInput) => {
    setServerError('');
    try {
      await signup(values);
      router.push('/subscription');
    } catch {
      setServerError('Could not create account. Please try with another email.');
    }
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-md items-center px-6">
      <div className="card w-full">
        <h1 className="font-display text-3xl font-extrabold">Start your impact</h1>
        <p className="mt-2 text-sm text-ink/70">Create your account to choose a charity, enter scores, and join monthly draw cycles.</p>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          {serverError ? <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{serverError}</p> : null}
          <div>
            <input className="w-full rounded-xl border border-brand-100 px-4 py-3" placeholder="Full name" {...register('fullName')} />
            <p className="mt-1 text-xs text-coral">{errors.fullName?.message}</p>
          </div>
          <div>
            <input className="w-full rounded-xl border border-brand-100 px-4 py-3" placeholder="Email" {...register('email')} />
            <p className="mt-1 text-xs text-coral">{errors.email?.message}</p>
          </div>
          <div>
            <input type="password" className="w-full rounded-xl border border-brand-100 px-4 py-3" placeholder="Password" {...register('password')} />
            <p className="mt-1 text-xs text-coral">{errors.password?.message}</p>
          </div>
          <button disabled={isSubmitting} className="btn-primary w-full">
            {isSubmitting ? 'Creating account...' : 'Sign up'}
          </button>
        </form>
        <div className="mt-4 rounded-xl border border-brand-100 bg-brand-50 p-3 text-xs text-brand-800">
          Minimum 10% of successful subscriptions support your selected charity.
        </div>
        <p className="mt-4 text-sm text-ink/70">
          Already have an account? <Link href="/login" className="font-semibold text-brand-700">Login</Link>
        </p>
      </div>
    </main>
  );
}
