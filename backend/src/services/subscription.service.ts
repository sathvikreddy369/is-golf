type PlanType = 'MONTHLY' | 'YEARLY';
import { StatusCodes } from 'http-status-codes';
import { env } from '../config/env';
import { prisma } from '../config/prisma';
import { ApiError } from '../utils/apiError';

const PRICES: Record<PlanType, number> = {
  MONTHLY: 29,
  YEARLY: 299
};

const getRenewalDate = (planType: PlanType): Date => {
  const now = new Date();
  if (planType === 'MONTHLY') {
    now.setMonth(now.getMonth() + 1);
    return now;
  }

  now.setFullYear(now.getFullYear() + 1);
  return now;
};

const mockRazorpayOrder = (amount: number) => {
  return {
    id: `order_${Date.now()}`,
    amount: amount * 100,
    currency: 'INR'
  };
};

export const createSubscription = async (
  userId: string,
  input: { planType: PlanType; charityPercentage: number; simulateSuccess: boolean }
) => {
  if (input.charityPercentage < env.CHARITY_MIN_PERCENTAGE) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      `Minimum charity contribution is ${(env.CHARITY_MIN_PERCENTAGE * 100).toFixed(0)}%`
    );
  }

  const amount = PRICES[input.planType];
  const poolContribution = amount * env.DRAW_POOL_PERCENTAGE;
  const charityContribution = amount * input.charityPercentage;
  const order = mockRazorpayOrder(amount);

  const payment = await prisma.payment.create({
    data: {
      userId,
      subscriptionAmount: amount,
      charityContribution,
      poolContribution,
      razorpayOrderId: order.id,
      status: 'CREATED'
    }
  });

  if (input.simulateSuccess) {
    await prisma.$transaction([
      prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: 'SUCCESS',
          razorpayPaymentId: `pay_${Date.now()}`,
          razorpaySignature: 'simulated_signature'
        }
      }),
      prisma.subscription.upsert({
        where: { userId },
        create: {
          userId,
          planType: input.planType,
          price: amount,
          status: 'ACTIVE',
          renewalDate: getRenewalDate(input.planType),
          charityPercentage: input.charityPercentage
        },
        update: {
          planType: input.planType,
          price: amount,
          status: 'ACTIVE',
          renewalDate: getRenewalDate(input.planType),
          charityPercentage: input.charityPercentage
        }
      })
    ]);
  }

  return {
    order,
    paymentId: payment.id,
    simulated: input.simulateSuccess
  };
};

export const getSubscriptionStatus = async (userId: string) => {
  const subscription = await prisma.subscription.findUnique({
    where: { userId }
  });

  if (!subscription) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Subscription not found');
  }

  return subscription;
};

export const cancelSubscription = async (userId: string) => {
  const subscription = await prisma.subscription.findUnique({ where: { userId } });
  if (!subscription) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Subscription not found');
  }

  return prisma.subscription.update({
    where: { userId },
    data: {
      status: 'CANCELED'
    }
  });
};

export const handleWebhookSimulation = async (payload: {
  orderId: string;
  paymentId: string;
  signature: string;
  status: 'SUCCESS' | 'FAILED';
}) => {
  const payment = await prisma.payment.findFirst({ where: { razorpayOrderId: payload.orderId } });
  if (!payment) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Payment order not found');
  }

  const updated = await prisma.payment.update({
    where: { id: payment.id },
    data: {
      razorpayPaymentId: payload.paymentId,
      razorpaySignature: payload.signature,
      status: payload.status
    }
  });

  return updated;
};
