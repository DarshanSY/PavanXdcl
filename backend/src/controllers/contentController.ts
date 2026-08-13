import { Response } from 'express';
import prisma from '../config/db';
import { AuthRequest } from '../middleware/auth';

// ─── DSA Content ─────────────────────────────────────────────────────────────
export const getDsaContent = async (req: AuthRequest, res: Response) => {
  try {
    const list = await prisma.dsaContent.findMany();
    const formatted = list.map(item => ({
      ...item,
      videos: JSON.parse(item.videos || '[]')
    }));
    return res.json({ success: true, content: formatted });
  } catch (error) {
    console.error('getDsaContent error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch DSA content.' });
  }
};

export const createDsaContent = async (req: AuthRequest, res: Response) => {
  try {
    const { id, module, topic, icon, description, videos } = req.body;
    if (!id || !module || !topic || !icon || !description) {
      return res.status(400).json({ success: false, message: 'Please fill in all required fields.' });
    }

    const item = await prisma.dsaContent.create({
      data: {
        id,
        module,
        topic,
        icon,
        description,
        videos: JSON.stringify(videos || [])
      }
    });

    return res.status(201).json({
      success: true,
      message: 'DSA Content created successfully.',
      content: { ...item, videos: JSON.parse(item.videos) }
    });
  } catch (error) {
    console.error('createDsaContent error:', error);
    return res.status(500).json({ success: false, message: 'Failed to create DSA content.' });
  }
};

export const updateDsaContent = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { module, topic, icon, description, videos } = req.body;

    const dataToUpdate: any = {};
    if (module !== undefined) dataToUpdate.module = module;
    if (topic !== undefined) dataToUpdate.topic = topic;
    if (icon !== undefined) dataToUpdate.icon = icon;
    if (description !== undefined) dataToUpdate.description = description;
    if (videos !== undefined) dataToUpdate.videos = JSON.stringify(videos);

    const item = await prisma.dsaContent.update({
      where: { id },
      data: dataToUpdate
    });

    return res.json({
      success: true,
      message: 'DSA Content updated successfully.',
      content: { ...item, videos: JSON.parse(item.videos) }
    });
  } catch (error) {
    console.error('updateDsaContent error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update DSA content.' });
  }
};

export const deleteDsaContent = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.dsaContent.delete({ where: { id } });
    return res.json({ success: true, message: 'DSA Content deleted successfully.' });
  } catch (error) {
    console.error('deleteDsaContent error:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete DSA content.' });
  }
};

// ─── FullStack Content ────────────────────────────────────────────────────────
export const getFsContent = async (req: AuthRequest, res: Response) => {
  try {
    const list = await prisma.fsContent.findMany();
    const formatted = list.map(item => ({
      ...item,
      videos: JSON.parse(item.videos || '[]')
    }));
    return res.json({ success: true, content: formatted });
  } catch (error) {
    console.error('getFsContent error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch Full Stack content.' });
  }
};

export const createFsContent = async (req: AuthRequest, res: Response) => {
  try {
    const { id, topic, description, videos } = req.body;
    if (!id || !topic || !description) {
      return res.status(400).json({ success: false, message: 'Please fill in all required fields.' });
    }

    const item = await prisma.fsContent.create({
      data: {
        id,
        topic,
        description,
        videos: JSON.stringify(videos || [])
      }
    });

    return res.status(201).json({
      success: true,
      message: 'Full Stack Content created successfully.',
      content: { ...item, videos: JSON.parse(item.videos) }
    });
  } catch (error) {
    console.error('createFsContent error:', error);
    return res.status(500).json({ success: false, message: 'Failed to create Full Stack content.' });
  }
};

export const updateFsContent = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { topic, description, videos } = req.body;

    const dataToUpdate: any = {};
    if (topic !== undefined) dataToUpdate.topic = topic;
    if (description !== undefined) dataToUpdate.description = description;
    if (videos !== undefined) dataToUpdate.videos = JSON.stringify(videos);

    const item = await prisma.fsContent.update({
      where: { id },
      data: dataToUpdate
    });

    return res.json({
      success: true,
      message: 'Full Stack Content updated successfully.',
      content: { ...item, videos: JSON.parse(item.videos) }
    });
  } catch (error) {
    console.error('updateFsContent error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update Full Stack content.' });
  }
};

export const deleteFsContent = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.fsContent.delete({ where: { id } });
    return res.json({ success: true, message: 'Full Stack Content deleted successfully.' });
  } catch (error) {
    console.error('deleteFsContent error:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete Full Stack content.' });
  }
};

// ─── Aptitude Content ─────────────────────────────────────────────────────────
export const getAptContent = async (req: AuthRequest, res: Response) => {
  try {
    const list = await prisma.aptitudeTopic.findMany();
    const formatted = list.map(item => ({
      ...item,
      questions: JSON.parse(item.questions || '[]')
    }));
    return res.json({ success: true, content: formatted });
  } catch (error) {
    console.error('getAptContent error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch Aptitude content.' });
  }
};

export const createAptTopic = async (req: AuthRequest, res: Response) => {
  try {
    const { id, title, emoji, description, badge, questions } = req.body;
    if (!id || !title) {
      return res.status(400).json({ success: false, message: 'Please fill in all required fields.' });
    }

    const item = await prisma.aptitudeTopic.create({
      data: {
        id,
        title,
        emoji: emoji || '🧠',
        description: description || '',
        badge: badge || 'Practice',
        questions: JSON.stringify(questions || [])
      }
    });

    return res.status(201).json({
      success: true,
      message: 'Aptitude Topic created successfully.',
      content: { ...item, questions: JSON.parse(item.questions) }
    });
  } catch (error) {
    console.error('createAptTopic error:', error);
    return res.status(500).json({ success: false, message: 'Failed to create Aptitude topic.' });
  }
};

export const updateAptTopic = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, emoji, description, badge, questions } = req.body;

    const dataToUpdate: any = {};
    if (title !== undefined) dataToUpdate.title = title;
    if (emoji !== undefined) dataToUpdate.emoji = emoji;
    if (description !== undefined) dataToUpdate.description = description;
    if (badge !== undefined) dataToUpdate.badge = badge;
    if (questions !== undefined) dataToUpdate.questions = JSON.stringify(questions);

    const item = await prisma.aptitudeTopic.update({
      where: { id },
      data: dataToUpdate
    });

    return res.json({
      success: true,
      message: 'Aptitude Topic updated successfully.',
      content: { ...item, questions: JSON.parse(item.questions) }
    });
  } catch (error) {
    console.error('updateAptTopic error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update Aptitude topic.' });
  }
};

export const deleteAptTopic = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.aptitudeTopic.delete({ where: { id } });
    return res.json({ success: true, message: 'Aptitude Topic deleted successfully.' });
  } catch (error) {
    console.error('deleteAptTopic error:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete Aptitude topic.' });
  }
};
