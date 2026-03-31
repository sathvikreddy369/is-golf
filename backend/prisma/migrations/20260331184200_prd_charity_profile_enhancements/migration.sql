-- Add PRD-aligned profile and charity metadata fields.
ALTER TABLE "User"
ADD COLUMN "emailNotifications" BOOLEAN NOT NULL DEFAULT true;

ALTER TABLE "Charity"
ADD COLUMN "category" TEXT,
ADD COLUMN "featured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "location" TEXT,
ADD COLUMN "upcomingEventTitle" TEXT,
ADD COLUMN "upcomingEventDate" TIMESTAMP(3),
ADD COLUMN "impactMetric" TEXT;
