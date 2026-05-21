import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('password123', 12);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@eventx.dev' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@eventx.dev',
      password,
      role: 'admin',
    },
  });

  const teacher = await prisma.user.upsert({
    where: { email: 'teacher@eventx.dev' },
    update: {},
    create: {
      name: 'Sarah Teacher',
      email: 'teacher@eventx.dev',
      password,
      role: 'teacher',
    },
  });

  const student = await prisma.user.upsert({
    where: { email: 'student@eventx.dev' },
    update: {},
    create: {
      name: 'Alex Student',
      email: 'student@eventx.dev',
      password,
      role: 'student',
    },
  });

  const adminId = admin.id;

  const events = [
    {
      title: 'Annual Debate Championship',
      description: 'Inter-school debate competition covering topics from climate change to AI ethics. Teams of four will compete in a knockout format across three rounds.',
      type: 'debate',
      venue: 'School Auditorium',
      startDate: new Date('2026-06-15'),
      endDate: new Date('2026-06-16'),
      status: 'upcoming',
      createdBy: adminId,
    },
    {
      title: 'Summer Sports Meet 2026',
      description: 'Three-day athletics extravaganza featuring track events, team sports, and swimming competitions. All students are encouraged to participate.',
      type: 'sports',
      venue: 'School Sports Complex',
      startDate: new Date('2026-06-20'),
      endDate: new Date('2026-06-22'),
      status: 'upcoming',
      createdBy: adminId,
    },
    {
      title: 'Science & Technology Exhibition',
      description: 'Showcasing student innovations in robotics, renewable energy, and software development. Judges from local universities will evaluate projects.',
      type: 'exhibition',
      venue: 'Science Block',
      startDate: new Date('2026-05-28'),
      endDate: new Date('2026-05-29'),
      coverImage: null,
      status: 'upcoming',
      createdBy: adminId,
    },
    {
      title: 'Cultural Fest 2026 – Navras',
      description: 'A two-day celebration of music, dance, drama, and fine arts. Includes inter-house competitions and a grand finale performance.',
      type: 'cultural',
      venue: 'Open Air Theatre',
      startDate: new Date('2026-03-01'),
      endDate: new Date('2026-03-02'),
      status: 'completed',
      createdBy: adminId,
    },
    {
      title: 'Parent-Teacher Conference',
      description: 'Quarterly meeting to discuss student progress, upcoming events, and collaborative strategies for academic excellence.',
      type: 'academic',
      venue: 'School Hall',
      startDate: new Date('2026-07-05'),
      endDate: new Date('2026-07-05'),
      status: 'upcoming',
      createdBy: adminId,
    },
    {
      title: 'Inter-House Quiz Finals',
      description: 'The grand finale of the annual quiz competition. Questions cover general knowledge, science, history, and current affairs.',
      type: 'academic',
      venue: 'Library Conference Room',
      startDate: new Date('2026-02-20'),
      endDate: new Date('2026-02-20'),
      status: 'completed',
      createdBy: adminId,
    },
  ];

  await prisma.liveUpdate.deleteMany();
  await prisma.announcement.deleteMany();
  await prisma.registration.deleteMany();
  await prisma.event.deleteMany();

  const createdEvents: { id: string; title: string }[] = [];
  for (const event of events) {
    const created = await prisma.event.create({ data: event });
    createdEvents.push({ id: created.id, title: created.title });
  }

  const debateEvent = createdEvents.find((e) => e.title.includes('Debate'));
  const sportsEvent = createdEvents.find((e) => e.title.includes('Sports'));
  const scienceEvent = createdEvents.find((e) => e.title.includes('Science'));
  const culturalEvent = createdEvents.find((e) => e.title.includes('Cultural'));

  const announcements = [
    { title: 'Registration Open for Debate Championship', content: 'Registration for the Annual Debate Championship is now open! Form your teams of four and register before June 10th.', eventId: debateEvent?.id, priority: 'high', createdBy: adminId },
    { title: 'Sports Meet Schedule Released', content: 'The full schedule for the Summer Sports Meet is now live. Check event details for your track assignments and team fixtures.', eventId: sportsEvent?.id, priority: 'medium', createdBy: adminId },
    { title: 'Science Exhibition Extended to Two Days', content: 'Due to overwhelming response, the Science & Technology Exhibition has been extended to a full two-day event. More workshops added!', eventId: scienceEvent?.id, priority: 'urgent', createdBy: adminId },
    { title: 'Cultural Fest – Grand Finale Tonight', content: 'Don\'t miss the grand finale of Navras Cultural Fest at 6 PM in the Open Air Theatre. Live performances, prizes, and surprises!', eventId: culturalEvent?.id, priority: 'urgent', createdBy: adminId },
    { title: 'School Holiday – Maintenance Day', content: 'The school will remain closed on June 5th for campus maintenance. All events scheduled for that day will be rescheduled.', eventId: null, priority: 'low', createdBy: adminId },
  ];

  for (const a of announcements) {
    await prisma.announcement.create({ data: a });
  }

  const now = new Date();
  const liveUpdates = [
    { eventId: sportsEvent!.id, type: 'announcement', content: 'The 100m heats have been rescheduled to 11 AM.', timestamp: new Date(now.getTime() - 3600000) },
    { eventId: sportsEvent!.id, type: 'score', content: 'Blue House leads the points table with 245 points.', timestamp: new Date(now.getTime() - 1800000) },
    { eventId: scienceEvent!.id, type: 'highlight', content: 'Team Alpha just demoed a working Mars rover prototype. Judges are impressed!', timestamp: new Date(now.getTime() - 7200000) },
    { eventId: culturalEvent!.id, type: 'photo', content: 'Check out the backstage preparations for the grand finale!', timestamp: new Date(now.getTime() - 86400000) },
  ];

  for (const u of liveUpdates) {
    await prisma.liveUpdate.create({ data: u });
  }

  console.log('Seeded users:');
  console.log(`  Admin:   admin@eventx.dev / password123`);
  console.log(`  Teacher: teacher@eventx.dev / password123`);
  console.log(`  Student: student@eventx.dev / password123`);
  console.log('');
  console.log(`Seeded ${events.length} events`);
  console.log(`Seeded ${announcements.length} announcements`);
  console.log(`Seeded ${liveUpdates.length} live updates`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
