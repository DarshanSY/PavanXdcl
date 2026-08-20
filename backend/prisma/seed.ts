import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dsaVideos from '../../shared/data/dsaVideos';
import fullstackVideos from '../../shared/data/fullstackVideos';
import questionsData from '../../shared/data/questions.json';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. Seed admin
  const adminEmail = 'admin@pavanxdcl.in';
  const hashedAdminPassword = await bcrypt.hash('PavanAdmin@2026', 10);
  const existingAdmin = await prisma.user.findFirst({
    where: { email: adminEmail }
  });

  if (!existingAdmin) {
    await prisma.user.create({
      data: {
        name: 'Pavan Prakash',
        email: adminEmail,
        password: hashedAdminPassword,
        joinedDate: 'July 2026',
        streak: 1,
        targetGoal: 'FAANG',
        role: 'ADMIN',
        mentorshipSelected: true,
        notes: 'Admin Workspace'
      }
    });
    console.log('Admin account created successfully.');
  } else {
    await prisma.user.update({
      where: { id: existingAdmin.id },
      data: { password: hashedAdminPassword, role: 'ADMIN' }
    });
    console.log('Admin account updated with verified credentials.');
  }

  // 1b. Seed demo student
  const studentEmail = 'student@pavanxdcl.in';
  const hashedStudentPassword = await bcrypt.hash('password123', 10);
  const existingStudent = await prisma.user.findFirst({
    where: { email: studentEmail }
  });

  if (!existingStudent) {
    await prisma.user.create({
      data: {
        name: 'Demo Student',
        email: studentEmail,
        password: hashedStudentPassword,
        joinedDate: 'July 2026',
        streak: 3,
        targetGoal: 'FAANG',
        role: 'STUDENT',
        mentorshipSelected: false,
        notes: 'Demo Student Workspace'
      }
    });
    console.log('Demo student account created successfully.');
  } else {
    await prisma.user.update({
      where: { id: existingStudent.id },
      data: { password: hashedStudentPassword, role: 'STUDENT' }
    });
    console.log('Demo student account updated with verified credentials.');
  }

  // 2. Seed DSA Content
  const dsaCount = await prisma.dsaContent.count();
  if (dsaCount === 0) {
    console.log('Seeding DSA content...');
    for (let i = 0; i < dsaVideos.length; i++) {
      const item = dsaVideos[i];
      await prisma.dsaContent.create({
        data: {
          id: `dsa-static-${i}`,
          module: item.module,
          topic: item.topic,
          icon: item.icon,
          description: item.description,
          videos: JSON.stringify(item.videos)
        }
      });
    }
    console.log('DSA content seeded.');
  }

  // 3. Seed FullStack Content
  const fsCount = await prisma.fsContent.count();
  if (fsCount === 0) {
    console.log('Seeding Full Stack content...');
    for (let i = 0; i < fullstackVideos.length; i++) {
      const item = fullstackVideos[i];
      await prisma.fsContent.create({
        data: {
          id: `fs-static-${i}`,
          topic: item.topic,
          description: item.description,
          videos: JSON.stringify(item.videos)
        }
      });
    }
    console.log('Full Stack content seeded.');
  }

  // 4. Seed Aptitude Content
  const aptCount = await prisma.aptitudeTopic.count();
  if (aptCount === 0) {
    console.log('Seeding Aptitude content...');
    for (let i = 0; i < questionsData.length; i++) {
      const item = questionsData[i];
      await prisma.aptitudeTopic.create({
        data: {
          id: `static-${i}`,
          title: item.title,
          emoji: item.emoji || '🧠',
          description: item.description || '',
          badge: item.badge || 'Practice',
          questions: JSON.stringify(item.questions)
        }
      });
    }
    console.log('Aptitude content seeded.');
  }

  // 5. Seed Success Stories
  const storiesCount = await prisma.successStory.count();
  if (storiesCount === 0) {
    console.log('Seeding Success Stories...');
    const initialStories = [
      {
        id: 'story-1',
        title: 'Placed in LG Soft',
        sender: 'Harshith',
        message: 'Hey bhaiya, got selected at LG Soft! 🚀 The DSA placement sheet and your lectures literally saved my coding rounds. Thanks a ton!',
        time: '11:42 AM',
        visible: true
      },
      {
        id: 'story-2',
        title: 'Placed in TCS NQT Prime',
        sender: 'Narasimha',
        message: 'Hey Pavan bhaiya, finally placed in TCS Prime category! Aptitude Lab questions match 90% of the pattern. Blessed to have your mentorship.',
        time: '2:15 PM',
        visible: true
      },
      {
        id: 'story-3',
        title: 'Placed in Genpact',
        sender: 'Swetha',
        message: 'Bhaiya got the offer letter from Genpact today! 😭 I did not know anything about tree traversals, your graph tutorials made it so easy.',
        time: '6:03 PM',
        visible: true
      },
      {
        id: 'story-4',
        title: 'Placed in LG',
        sender: 'Sumanth',
        message: 'Placed in LG! ⚡ Solving the 500+ question sheet did it. Standard structures were asked in technical round.',
        time: '10:11 AM',
        visible: true
      },
      {
        id: 'story-5',
        title: 'Placed in Sasken',
        sender: 'Tejaswini',
        message: 'Selected in Sasken as Developer! Thank you for the interview prep guidance. Mock interviews helped build my confidence.',
        time: '4:30 PM',
        visible: true
      },
      {
        id: 'story-6',
        title: 'Placed in Surya AI',
        sender: 'Kushwanth',
        message: 'Bhaiya! Placed in Surya AI! The compensation is awesome. The dynamic programming section in the doc is pure gold.',
        time: '1:05 PM',
        visible: true
      },
      {
        id: 'story-7',
        title: 'Placed in Deloitte',
        sender: 'Lalasa',
        message: 'Placed in Deloitte! TCS Ninja was my first round but cracked this. Aptitude logic questions were exact. Thank you pavanxdcl team!',
        time: '5:20 PM',
        visible: true
      },
      {
        id: 'story-8',
        title: 'Placed in PayU',
        sender: 'Afsaan',
        message: 'Placed in PayU! The package is great! 🚀 Thank you for forcing me to solve daily LeetCode medium questions.',
        time: '3:40 PM',
        visible: true
      }
    ];

    for (const story of initialStories) {
      await prisma.successStory.create({
        data: {
          id: story.id,
          title: story.title,
          sender: story.sender,
          message: story.message,
          time: story.time,
          visible: story.visible,
          photo: ''
        }
      });
    }
    console.log('Success Stories seeded.');
  }

  console.log('Seeding complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
