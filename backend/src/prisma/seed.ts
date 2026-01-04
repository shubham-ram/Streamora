import { PrismaService } from 'src/prisma';

const prisma = new PrismaService();

const categories = [
  { name: 'Gaming', slug: 'gaming' },
  { name: 'Music', slug: 'music' },
  { name: 'Just Chatting', slug: 'just-chatting' },
  { name: 'Art', slug: 'art' },
  { name: 'Sports', slug: 'sports' },
  { name: 'Science & Tech', slug: 'science-tech' },
];

async function main() {
  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: { ...cat, isOfficial: true },
    });
  }
  console.log('✅ Seeded categories');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
