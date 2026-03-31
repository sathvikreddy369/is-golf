-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "PlanType" AS ENUM ('MONTHLY', 'YEARLY');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('ACTIVE', 'CANCELED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('CREATED', 'SUCCESS', 'FAILED');

-- CreateEnum
CREATE TYPE "DrawMode" AS ENUM ('RANDOM', 'WEIGHTED');

-- CreateEnum
CREATE TYPE "DrawStatus" AS ENUM ('SIMULATED', 'PUBLISHED');

-- CreateEnum
CREATE TYPE "WinnerTier" AS ENUM ('MATCH_3', 'MATCH_4', 'MATCH_5');

-- CreateEnum
CREATE TYPE "VerificationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "PayoutStatus" AS ENUM ('PENDING', 'PAID');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "charityId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "planType" "PlanType" NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "status" "SubscriptionStatus" NOT NULL DEFAULT 'ACTIVE',
    "renewalDate" TIMESTAMP(3) NOT NULL,
    "charityPercentage" DECIMAL(5,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Score" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Score_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Draw" (
    "id" TEXT NOT NULL,
    "mode" "DrawMode" NOT NULL,
    "status" "DrawStatus" NOT NULL,
    "winningValues" INTEGER[],
    "poolAmount" DECIMAL(12,2) NOT NULL,
    "drawDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Draw_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DrawResult" (
    "id" TEXT NOT NULL,
    "drawId" TEXT NOT NULL,
    "tier" "WinnerTier" NOT NULL,
    "winnerIds" TEXT[],
    "totalPrize" DECIMAL(12,2) NOT NULL,
    "perWinner" DECIMAL(12,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DrawResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Charity" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "website" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Charity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Winner" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "drawId" TEXT NOT NULL,
    "tier" "WinnerTier" NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "proofImage" TEXT,
    "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'PENDING',
    "payoutStatus" "PayoutStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Winner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "subscriptionAmount" DECIMAL(10,2) NOT NULL,
    "charityContribution" DECIMAL(10,2) NOT NULL,
    "poolContribution" DECIMAL(10,2) NOT NULL,
    "razorpayOrderId" TEXT NOT NULL,
    "razorpayPaymentId" TEXT,
    "razorpaySignature" TEXT,
    "status" "PaymentStatus" NOT NULL DEFAULT 'CREATED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_userId_key" ON "Subscription"("userId");

-- CreateIndex
CREATE INDEX "Score_userId_createdAt_idx" ON "Score"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "Draw_drawDate_idx" ON "Draw"("drawDate");

-- CreateIndex
CREATE INDEX "DrawResult_drawId_tier_idx" ON "DrawResult"("drawId", "tier");

-- CreateIndex
CREATE UNIQUE INDEX "Charity_name_key" ON "Charity"("name");

-- CreateIndex
CREATE INDEX "Winner_userId_drawId_idx" ON "Winner"("userId", "drawId");

-- CreateIndex
CREATE INDEX "Payment_userId_createdAt_idx" ON "Payment"("userId", "createdAt");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_charityId_fkey" FOREIGN KEY ("charityId") REFERENCES "Charity"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Score" ADD CONSTRAINT "Score_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DrawResult" ADD CONSTRAINT "DrawResult_drawId_fkey" FOREIGN KEY ("drawId") REFERENCES "Draw"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Winner" ADD CONSTRAINT "Winner_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
