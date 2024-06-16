// tools.seed.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const tools = [
    'React',
    'Next',
    'Vue',
    'Nuxt',
    'Astro',
    'JavaScript',
    'TypeScript',
    'scss',
    'WebAudio (Tone.js)',
    'WebGL (Three.js)',
    'GSAP',
    'Vite',
    'webpack',
    'PHP',
    'nestJs',
    'CodeIgniter',
    'Laravel',
    'WordPress',
    'docker',
    'GitHub',
    'GitLab',
  ];

  for (const toolName of tools) {
    await prisma.tool.create({
      data: {
        toolName,
      },
    });
  }

  console.log('Seed completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
