import { Response } from 'express';
import prisma from '../config/db';
import { AuthRequest } from '../middleware/auth';
import { updateStreak } from '../middleware/streak';

export const toggleDsaProgress = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Unauthenticated.' });
    const { topicName } = req.body;
    if (!topicName) return res.status(400).json({ success: false, message: 'Topic name required.' });

    const currentStreak = await updateStreak(req.user.userId);

    const userObj = await prisma.user.findUnique({ where: { id: req.user.userId } });
    if (!userObj) return res.status(404).json({ success: false, message: 'User not found.' });

    let progress: string[] = JSON.parse(userObj.progressDsa || '[]');
    const hasTopic = progress.includes(topicName);
    if (hasTopic) {
      progress = progress.filter(t => t !== topicName);
    } else {
      progress.push(topicName);
    }

    const updated = await prisma.user.update({
      where: { id: req.user.userId },
      data: {
        progressDsa: JSON.stringify(progress)
      }
    });

    return res.json({
      success: true,
      streak: currentStreak,
      progress: {
        dsa: progress,
        fullstack: JSON.parse(updated.progressFullstack),
        aptitude: JSON.parse(updated.progressAptitude)
      }
    });
  } catch (error) {
    console.error('toggleDsaProgress error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update progress.' });
  }
};

export const toggleFullStackProgress = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Unauthenticated.' });
    const { topicName } = req.body;
    if (!topicName) return res.status(400).json({ success: false, message: 'Topic name required.' });

    const currentStreak = await updateStreak(req.user.userId);

    const userObj = await prisma.user.findUnique({ where: { id: req.user.userId } });
    if (!userObj) return res.status(404).json({ success: false, message: 'User not found.' });

    let progress: string[] = JSON.parse(userObj.progressFullstack || '[]');
    const hasTopic = progress.includes(topicName);
    if (hasTopic) {
      progress = progress.filter(t => t !== topicName);
    } else {
      progress.push(topicName);
    }

    const updated = await prisma.user.update({
      where: { id: req.user.userId },
      data: {
        progressFullstack: JSON.stringify(progress)
      }
    });

    return res.json({
      success: true,
      streak: currentStreak,
      progress: {
        dsa: JSON.parse(updated.progressDsa),
        fullstack: progress,
        aptitude: JSON.parse(updated.progressAptitude)
      }
    });
  } catch (error) {
    console.error('toggleFullStackProgress error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update progress.' });
  }
};

export const toggleAptitudeProgress = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Unauthenticated.' });
    const { topicTitle, questionIndex } = req.body;
    if (!topicTitle || questionIndex === undefined) {
      return res.status(400).json({ success: false, message: 'Topic title and question index required.' });
    }

    const currentStreak = await updateStreak(req.user.userId);

    const userObj = await prisma.user.findUnique({ where: { id: req.user.userId } });
    if (!userObj) return res.status(404).json({ success: false, message: 'User not found.' });

    const questionKey = `${topicTitle}-${questionIndex}`;
    let progress: string[] = JSON.parse(userObj.progressAptitude || '[]');
    const hasQuestion = progress.includes(questionKey);
    if (hasQuestion) {
      progress = progress.filter(q => q !== questionKey);
    } else {
      progress.push(questionKey);
    }

    const updated = await prisma.user.update({
      where: { id: req.user.userId },
      data: {
        progressAptitude: JSON.stringify(progress)
      }
    });

    return res.json({
      success: true,
      streak: currentStreak,
      progress: {
        dsa: JSON.parse(updated.progressDsa),
        fullstack: JSON.parse(updated.progressFullstack),
        aptitude: progress
      }
    });
  } catch (error) {
    console.error('toggleAptitudeProgress error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update progress.' });
  }
};

export const updateGoal = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Unauthenticated.' });
    const { goal } = req.body;
    if (!goal) return res.status(400).json({ success: false, message: 'Goal required.' });

    await prisma.user.update({
      where: { id: req.user.userId },
      data: { targetGoal: goal }
    });

    return res.json({ success: true, message: 'Goal updated successfully.' });
  } catch (error) {
    console.error('updateGoal error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update goal.' });
  }
};

export const resetProgress = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Unauthenticated.' });

    await prisma.user.update({
      where: { id: req.user.userId },
      data: {
        progressDsa: '[]',
        progressFullstack: '[]',
        progressAptitude: '[]'
      }
    });

    return res.json({ success: true, message: 'Progress reset successfully.' });
  } catch (error) {
    console.error('resetProgress error:', error);
    return res.status(500).json({ success: false, message: 'Failed to reset progress.' });
  }
};

export const saveNotes = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Unauthenticated.' });
    const { notes } = req.body;

    await prisma.user.update({
      where: { id: req.user.userId },
      data: { notes: notes || '' }
    });

    return res.json({ success: true, message: 'Notes saved successfully.' });
  } catch (error) {
    console.error('saveNotes error:', error);
    return res.status(500).json({ success: false, message: 'Failed to save notes.' });
  }
};

export const requestMentorship = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Unauthenticated.' });

    await prisma.user.update({
      where: { id: req.user.userId },
      data: { mentorshipRequested: true }
    });

    return res.json({ success: true, message: 'Selection audit requested.' });
  } catch (error) {
    console.error('requestMentorship error:', error);
    return res.status(500).json({ success: false, message: 'Failed to request mentorship.' });
  }
};
