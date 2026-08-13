import { Response } from 'express';
import prisma from '../config/db';
import { AuthRequest } from '../middleware/auth';

export const getAnnouncements = async (req: AuthRequest, res: Response) => {
  try {
    const list = await prisma.announcement.findMany({
      where: { active: true }
    });

    // Filter out expired announcements dynamically
    const now = new Date();
    const activeAndNotExpired = list.filter(a => {
      if (a.expiresAt) {
        try {
          const expDate = new Date(a.expiresAt);
          if (now > expDate) return false;
        } catch {
          // If parse fails, assume not expired
        }
      }
      return true;
    });

    return res.json({ success: true, announcements: activeAndNotExpired });
  } catch (error) {
    console.error('getAnnouncements error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch announcements.' });
  }
};

export const getAllAnnouncements = async (req: AuthRequest, res: Response) => {
  try {
    const list = await prisma.announcement.findMany();
    return res.json({ success: true, announcements: list });
  } catch (error) {
    console.error('getAllAnnouncements error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch all announcements.' });
  }
};

export const createAnnouncement = async (req: AuthRequest, res: Response) => {
  try {
    const { id, title, body, type, active, expiresAt } = req.body;
    if (!id || !title || !body) {
      return res.status(400).json({ success: false, message: 'Please fill in all required fields.' });
    }

    const item = await prisma.announcement.create({
      data: {
        id,
        title,
        body,
        type: type || 'info',
        active: active !== undefined ? active : true,
        expiresAt: expiresAt || ''
      }
    });

    return res.status(201).json({ success: true, message: 'Announcement created successfully.', announcement: item });
  } catch (error) {
    console.error('createAnnouncement error:', error);
    return res.status(500).json({ success: false, message: 'Failed to create announcement.' });
  }
};

export const updateAnnouncement = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, body, type, active, expiresAt } = req.body;

    const dataToUpdate: any = {};
    if (title !== undefined) dataToUpdate.title = title;
    if (body !== undefined) dataToUpdate.body = body;
    if (type !== undefined) dataToUpdate.type = type;
    if (active !== undefined) dataToUpdate.active = active;
    if (expiresAt !== undefined) dataToUpdate.expiresAt = expiresAt;

    const item = await prisma.announcement.update({
      where: { id },
      data: dataToUpdate
    });

    return res.json({ success: true, message: 'Announcement updated successfully.', announcement: item });
  } catch (error) {
    console.error('updateAnnouncement error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update announcement.' });
  }
};

export const deleteAnnouncement = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.announcement.delete({ where: { id } });
    return res.json({ success: true, message: 'Announcement deleted successfully.' });
  } catch (error) {
    console.error('deleteAnnouncement error:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete announcement.' });
  }
};
