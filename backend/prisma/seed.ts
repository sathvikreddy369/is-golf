import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const charities = [
    {
      name: 'First Tee Youth Access',
      description: 'Expands youth access to education and sports through community golf programs.',
      image: 'https://images.unsplash.com/photo-1486218119243-13883505764c?w=800',
      website: 'https://example.org/first-tee',
      active: true
    },
    {
      name: 'Green Future Foundation',
      description: 'Funds urban green-space restoration and climate-resilient local infrastructure.',
      image: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=800',
      website: 'https://example.org/green-future',
      active: true
    },
    {
      name: 'Community Health Drive',
      description: 'Supports preventive healthcare camps and wellness education for underserved families.',
      image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800',
      website: 'https://example.org/community-health',
      active: true
    }
  ];

  for (const charity of charities) {
    await prisma.charity.upsert({
      where: { name: charity.name },
      update: charity,
      create: charity
    });
  }

  // Seed a default admin for initial access in development.
  await prisma.user.upsert({
    where: { email: 'admin@golfcharity.app' },
    update: {},
    create: {
      email: 'admin@golfcharity.app',
      fullName: 'Platform Admin',
      password: '$2a$10$Ne2gtwefO34Mti9m8NML8ud8ZPPE9VYjZ4Q2D7Fv1YqSQXHGTKl82',
      role: 'ADMIN'
    }
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
