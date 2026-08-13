import prisma from '../config/db';

export const updateStreak = async (userId: number): Promise<number> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { streak: true, lastActiveDate: true }
  });

  if (!user) return 0;

  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const todayStr = `${year}-${month}-${day}`;

  if (user.lastActiveDate === todayStr) {
    // Already active today, streak remains the same
    return user.streak;
  }

  let newStreak = user.streak;

  if (!user.lastActiveDate) {
    // First time logging in or active
    newStreak = 1;
  } else {
    // Calculate yesterday's date string
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yYear = yesterday.getFullYear();
    const yMonth = String(yesterday.getMonth() + 1).padStart(2, '0');
    const yDay = String(yesterday.getDate()).padStart(2, '0');
    const yesterdayStr = `${yYear}-${yMonth}-${yDay}`;

    if (user.lastActiveDate === yesterdayStr) {
      // Consecutive day login/activity
      newStreak = user.streak + 1;
    } else {
      // Missed a day or skipped, reset streak to 1
      newStreak = 1;
    }
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      streak: newStreak,
      lastActiveDate: todayStr
    }
  });

  return newStreak;
};
