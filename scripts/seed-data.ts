import { createClient } from '@sanity/client';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '6q3wt4eo',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  useCdn: false,
  token: process.env.SANITY_API_ADMIN_TOKEN,
  apiVersion: '2024-01-01',
});

async function seedData() {
  console.log('🌱 Starting to seed Sanity data...\n');

  try {
    // 1. Create Category
    console.log('📁 Creating category...');
    const category = await client.create({
      _type: 'category',
      name: 'Desenvolvimento Web',
      slug: { _type: 'slug', current: 'desenvolvimento-web' },
      description: 'Cursos de programação web moderna com as melhores tecnologias',
    });
    console.log('✅ Category created:', category.name);

    // 2. Create Instructor
    console.log('\n👨‍🏫 Creating instructor...');
    const instructor = await client.create({
      _type: 'instructor',
      name: 'João Silva',
      bio: 'Desenvolvedor Full Stack com 10 anos de experiência em React, Next.js e Node.js. Apaixonado por ensinar e compartilhar conhecimento.',
    });
    console.log('✅ Instructor created:', instructor.name);

    // 3. Create Lessons for Module 1
    console.log('\n📚 Creating lessons...');

    const lesson1 = await client.create({
      _type: 'lesson',
      title: 'O que é Next.js?',
      slug: { _type: 'slug', current: 'o-que-e-nextjs' },
      description: 'Introdução ao framework Next.js e suas principais características',
      videoUrl: 'https://www.youtube.com/watch?v=Sklc_fQBmcs',
      content: [
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Next.js é um framework React para produção. Nesta aula você aprenderá os conceitos fundamentais.' }],
        },
      ],
    });
    console.log('✅ Lesson 1 created:', lesson1.title);

    const lesson2 = await client.create({
      _type: 'lesson',
      title: 'Instalação e Setup',
      slug: { _type: 'slug', current: 'instalacao-setup' },
      description: 'Como configurar seu ambiente de desenvolvimento Next.js',
      videoUrl: 'https://www.youtube.com/watch?v=ZVnjOPwW4ZA',
      content: [
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Aprenda a configurar um projeto Next.js do zero usando as melhores práticas.' }],
        },
      ],
    });
    console.log('✅ Lesson 2 created:', lesson2.title);

    const lesson3 = await client.create({
      _type: 'lesson',
      title: 'Rotas e Navegação',
      slug: { _type: 'slug', current: 'rotas-navegacao' },
      description: 'Entenda o sistema de rotas do Next.js App Router',
      videoUrl: 'https://www.youtube.com/watch?v=nSfu7sHPE1c',
      content: [
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'O App Router do Next.js traz um novo paradigma para criação de rotas.' }],
        },
      ],
    });
    console.log('✅ Lesson 3 created:', lesson3.title);

    const lesson4 = await client.create({
      _type: 'lesson',
      title: 'Server Components',
      slug: { _type: 'slug', current: 'server-components' },
      description: 'Trabalhando com React Server Components',
      videoUrl: 'https://www.youtube.com/watch?v=h7-FLJxwviI',
      content: [
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Server Components permitem renderização no servidor com melhor performance.' }],
        },
      ],
    });
    console.log('✅ Lesson 4 created:', lesson4.title);

    // 4. Create Modules
    console.log('\n📦 Creating modules...');

    const module1 = await client.create({
      _type: 'module',
      title: 'Fundamentos do Next.js',
      lessons: [
        { _type: 'reference', _ref: lesson1._id },
        { _type: 'reference', _ref: lesson2._id },
      ],
    });
    console.log('✅ Module 1 created:', module1.title);

    const module2 = await client.create({
      _type: 'module',
      title: 'Trabalhando com App Router',
      lessons: [
        { _type: 'reference', _ref: lesson3._id },
        { _type: 'reference', _ref: lesson4._id },
      ],
    });
    console.log('✅ Module 2 created:', module2.title);

    // 5. Create Course 1
    console.log('\n🎓 Creating courses...');

    const course1 = await client.create({
      _type: 'course',
      title: 'Introdução ao Next.js 15',
      slug: { _type: 'slug', current: 'introducao-nextjs-15' },
      description: 'Aprenda Next.js 15 do zero com este curso completo. Domine Server Components, App Router e muito mais!',
      price: 49.90,
      category: { _type: 'reference', _ref: category._id },
      instructor: { _type: 'reference', _ref: instructor._id },
      modules: [
        { _type: 'reference', _ref: module1._id },
        { _type: 'reference', _ref: module2._id },
      ],
    });
    console.log('✅ Course 1 created:', course1.title);

    // 6. Create Course 2 with simplified content
    const lesson5 = await client.create({
      _type: 'lesson',
      title: 'Hooks Avançados',
      slug: { _type: 'slug', current: 'hooks-avancados' },
      description: 'useCallback, useMemo, useReducer e custom hooks',
      videoUrl: 'https://www.youtube.com/watch?v=dpw9EHDh2bM',
    });

    const lesson6 = await client.create({
      _type: 'lesson',
      title: 'Context API e Gerenciamento de Estado',
      slug: { _type: 'slug', current: 'context-api-estado' },
      description: 'Gerenciamento de estado global com Context API',
      videoUrl: 'https://www.youtube.com/watch?v=5LrDIWkK_Bc',
    });

    const module3 = await client.create({
      _type: 'module',
      title: 'React Avançado',
      lessons: [
        { _type: 'reference', _ref: lesson5._id },
        { _type: 'reference', _ref: lesson6._id },
      ],
    });

    const course2 = await client.create({
      _type: 'course',
      title: 'React Avançado',
      slug: { _type: 'slug', current: 'react-avancado' },
      description: 'Leve suas habilidades React para o próximo nível com técnicas avançadas',
      price: 79.90,
      category: { _type: 'reference', _ref: category._id },
      instructor: { _type: 'reference', _ref: instructor._id },
      modules: [
        { _type: 'reference', _ref: module3._id },
      ],
    });
    console.log('✅ Course 2 created:', course2.title);

    console.log('\n✨ Seed completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`  - 1 Category: ${category.name}`);
    console.log(`  - 1 Instructor: ${instructor.name}`);
    console.log(`  - 2 Courses: ${course1.title}, ${course2.title}`);
    console.log(`  - 3 Modules`);
    console.log(`  - 6 Lessons`);
    console.log('\n🎉 You can now access the content at http://localhost:3001');

  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
}

seedData();
