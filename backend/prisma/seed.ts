import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting comprehensive seed...');

  // ================ CHARITIES ================
  const charities = [
    {
      name: 'First Tee Youth Access',
      category: 'Youth Development',
      description: 'Expands youth access to education and sports through community golf programs.',
      image: 'https://images.unsplash.com/photo-1486218119243-13883505764c?w=800',
      website: 'https://example.org/first-tee',
      featured: true,
      location: 'Bengaluru',
      upcomingEventTitle: 'Weekend Scholarship Cup',
      upcomingEventDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14),
      impactMetric: '1,800 students supported this quarter',
      active: true
    },
    {
      name: 'Green Future Foundation',
      category: 'Climate Action',
      description: 'Funds urban green-space restoration and climate-resilient local infrastructure.',
      image: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=800',
      website: 'https://example.org/green-future',
      featured: false,
      location: 'Pune',
      upcomingEventTitle: 'City Lake Regeneration Drive',
      upcomingEventDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 21),
      impactMetric: '52 acres restored with community volunteers',
      active: true
    },
    {
      name: 'Community Health Drive',
      category: 'Healthcare',
      description: 'Supports preventive healthcare camps and wellness education for underserved families.',
      image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800',
      website: 'https://example.org/community-health',
      featured: false,
      location: 'Hyderabad',
      upcomingEventTitle: 'Women Health Screening Camp',
      upcomingEventDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10),
      impactMetric: '12,000 health checkups funded annually',
      active: true
    }
  ];

  console.log('📍 Seeding charities...');
  let firstCharityId = '';
  for (const charity of charities) {
    const created = await prisma.charity.upsert({
      where: { name: charity.name },
      update: charity,
      create: charity
    });
    if (!firstCharityId) firstCharityId = created.id;
    console.log(`  ✓ ${charity.name}`);
  }

  // ================ USERS ================
  console.log('👥 Seeding users...');

  // Hash password for testuser1 (password: "Test@123")
  const hashedPassword = await bcrypt.hash('Test@123', 10);

  // Admin user with hashed password (Admin@123)
  const adminPassword = await bcrypt.hash('Admin@123', 10);
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@golfcharity.app' },
    update: { password: adminPassword },
    create: {
      email: 'admin@golfcharity.app',
      fullName: 'Platform Admin',
      password: adminPassword,
      role: 'ADMIN',
      isActive: true,
      emailNotifications: true
    }
  });
  console.log(`  ✓ Admin: ${adminUser.email}`);

  // Test user 1 (regular user with subscription)
  const testUser1 = await prisma.user.upsert({
    where: { email: 'testuser1@example.com' },
    update: {},
    create: {
      email: 'testuser1@example.com',
      fullName: 'John Doe',
      password: hashedPassword,
      role: 'USER',
      isActive: true,
      emailNotifications: true,
      charityId: firstCharityId
    }
  });
  console.log(`  ✓ User: ${testUser1.email}`);

  // Test user 2 (regular user with subscription)
  const testUser2 = await prisma.user.upsert({
    where: { email: 'testuser2@example.com' },
    update: {},
    create: {
      email: 'testuser2@example.com',
      fullName: 'Jane Smith',
      password: hashedPassword,
      role: 'USER',
      isActive: true,
      emailNotifications: true,
      charityId: firstCharityId
    }
  });
  console.log(`  ✓ User: ${testUser2.email}`);

  // Test user 3 (inactive user for testing status management)
  const testUser3 = await prisma.user.upsert({
    where: { email: 'testuser3@example.com' },
    update: {},
    create: {
      email: 'testuser3@example.com',
      fullName: 'Bob Johnson',
      password: hashedPassword,
      role: 'USER',
      isActive: false,
      emailNotifications: false,
      charityId: firstCharityId
    }
  });
  console.log(`  ✓ User (inactive): ${testUser3.email}`);

  // ================ SUBSCRIPTIONS ================
  console.log('📝 Seeding subscriptions...');

  const sub1 = await prisma.subscription.upsert({
    where: { userId: testUser1.id },
    update: {},
    create: {
      userId: testUser1.id,
      planType: 'MONTHLY',
      price: new Decimal('199'),
      status: 'ACTIVE',
      renewalDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      charityPercentage: new Decimal('10')
    }
  });
  console.log(`  ✓ Subscription (Monthly): ${testUser1.email}`);

  const sub2 = await prisma.subscription.upsert({
    where: { userId: testUser2.id },
    update: {},
    create: {
      userId: testUser2.id,
      planType: 'YEARLY',
      price: new Decimal('1999'),
      status: 'ACTIVE',
      renewalDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
      charityPercentage: new Decimal('10')
    }
  });
  console.log(`  ✓ Subscription (Yearly): ${testUser2.email}`);

  // ================ PAYMENTS ================
  console.log('💳 Seeding payments...');

  await prisma.payment.create({
    data: {
      userId: testUser1.id,
      subscriptionAmount: new Decimal('199'),
      charityContribution: new Decimal('19.90'),
      poolContribution: new Decimal('40'),
      razorpayOrderId: 'order_test_001',
      razorpayPaymentId: 'pay_test_001',
      razorpaySignature: 'sig_test_001',
      status: 'SUCCESS'
    }
  });
  console.log(`  ✓ Payment 1: $199 (Monthly subscription)`);

  await prisma.payment.create({
    data: {
      userId: testUser2.id,
      subscriptionAmount: new Decimal('1999'),
      charityContribution: new Decimal('199.90'),
      poolContribution: new Decimal('400'),
      razorpayOrderId: 'order_test_002',
      razorpayPaymentId: 'pay_test_002',
      razorpaySignature: 'sig_test_002',
      status: 'SUCCESS'
    }
  });
  console.log(`  ✓ Payment 2: $1999 (Yearly subscription)`);

  // ================ SCORES ================
  console.log('🎯 Seeding game scores...');

  // Add multiple scores for testUser1
  for (let i = 0; i < 5; i++) {
    await prisma.score.create({
      data: {
        userId: testUser1.id,
        value: Math.floor(Math.random() * 45) + 1,
        date: new Date(Date.now() - 1000 * 60 * 60 * 24 * i)
      }
    });
  }
  console.log(`  ✓ Added 5 scores for ${testUser1.email}`);

  // Add multiple scores for testUser2
  for (let i = 0; i < 3; i++) {
    await prisma.score.create({
      data: {
        userId: testUser2.id,
        value: Math.floor(Math.random() * 45) + 1,
        date: new Date(Date.now() - 1000 * 60 * 60 * 24 * i)
      }
    });
  }
  console.log(`  ✓ Added 3 scores for ${testUser2.email}`);

  // ================ DRAWS ================
  console.log('🎰 Seeding draws...');

  // Create a simulated draw
  const draw1 = await prisma.draw.create({
    data: {
      mode: 'RANDOM',
      status: 'SIMULATED',
      winningValues: [12, 25, 33],
      poolAmount: new Decimal('5000')
    }
  });
  console.log(`  ✓ Simulated Draw 1: Mode=RANDOM, Pool=$5000`);

  // Create a published draw
  const draw2 = await prisma.draw.create({
    data: {
      mode: 'WEIGHTED',
      status: 'PUBLISHED',
      winningValues: [8, 15, 28, 42],
      poolAmount: new Decimal('8500')
    }
  });
  console.log(`  ✓ Published Draw 2: Mode=WEIGHTED, Pool=$8500`);

  // ================ DRAW RESULTS ================
  console.log('🏆 Seeding draw results...');

  // Results for draw1
  await prisma.drawResult.create({
    data: {
      drawId: draw1.id,
      tier: 'MATCH_3',
      winnerIds: [testUser1.id],
      totalPrize: new Decimal('1000'),
      perWinner: new Decimal('1000')
    }
  });
  console.log(`  ✓ Draw Result 1: MATCH_3 - 1 winner, $1000`);

  await prisma.drawResult.create({
    data: {
      drawId: draw1.id,
      tier: 'MATCH_5',
      winnerIds: [testUser2.id],
      totalPrize: new Decimal('3000'),
      perWinner: new Decimal('3000')
    }
  });
  console.log(`  ✓ Draw Result 2: MATCH_5 - 1 winner, $3000`);

  // Results for draw2
  await prisma.drawResult.create({
    data: {
      drawId: draw2.id,
      tier: 'MATCH_4',
      winnerIds: [testUser1.id, testUser2.id],
      totalPrize: new Decimal('2000'),
      perWinner: new Decimal('1000')
    }
  });
  console.log(`  ✓ Draw Result 3: MATCH_4 - 2 winners, $1000 each`);

  // ================ WINNERS ================
  console.log('👑 Seeding winners...');

  await prisma.winner.create({
    data: {
      userId: testUser1.id,
      drawId: draw1.id,
      tier: 'MATCH_3',
      amount: new Decimal('1000'),
      verificationStatus: 'APPROVED',
      payoutStatus: 'PAID'
    }
  });
  console.log(`  ✓ Winner 1: ${testUser1.email} - $1000 - PAID`);

  await prisma.winner.create({
    data: {
      userId: testUser2.id,
      drawId: draw1.id,
      tier: 'MATCH_5',
      amount: new Decimal('3000'),
      verificationStatus: 'PENDING',
      payoutStatus: 'PENDING'
    }
  });
  console.log(`  ✓ Winner 2: ${testUser2.email} - $3000 - PENDING`);

  await prisma.winner.create({
    data: {
      userId: testUser1.id,
      drawId: draw2.id,
      tier: 'MATCH_4',
      amount: new Decimal('1000'),
      verificationStatus: 'APPROVED',
      payoutStatus: 'PENDING'
    }
  });
  console.log(`  ✓ Winner 3: ${testUser1.email} - $1000 (Draw 2) - PENDING`);

  console.log('\n✅ Seed completed successfully!\n');
  console.log('Test Credentials:');
  console.log('  Admin: admin@golfcharity.app / Admin@123');
  console.log('  User 1: testuser1@example.com / Test@123');
  console.log('  User 2: testuser2@example.com / Test@123');
  console.log('  User 3: testuser3@example.com / Test@123 (inactive)\n');
}

import { Decimal } from '@prisma/client/runtime/library';

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error('❌ Seed error:', error);
    await prisma.$disconnect();
    process.exit(1);
  });
