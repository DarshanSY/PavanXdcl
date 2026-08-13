import { Response } from 'express';
import prisma from '../config/db';
import { AuthRequest } from '../middleware/auth';

export const getStories = async (req: AuthRequest, res: Response) => {
  try {
    // If user is authenticated and is admin, they can see all stories. Otherwise, only visible ones.
    const isAdmin = req.user && req.user.role === 'ADMIN';
    
    const stories = await prisma.successStory.findMany({
      where: isAdmin ? {} : { visible: true },
      orderBy: { addedAt: 'desc' }
    });

    return res.json({ success: true, stories });
  } catch (error) {
    console.error('getStories error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch success stories.' });
  }
};

export const createStory = async (req: AuthRequest, res: Response) => {
  try {
    const { id, sender, title, message, time, photo, visible } = req.body;
    if (!id || !sender || !title || !message) {
      return res.status(400).json({ success: false, message: 'Please fill in all required fields.' });
    }

    // Determine initial visibility: default to true for admin upload, false for general public if uploaded anonymously
    const isAdmin = req.user && req.user.role === 'ADMIN';
    const initVisible = visible !== undefined ? visible : (isAdmin ? true : false);

    const story = await prisma.successStory.create({
      data: {
        id,
        sender,
        title,
        message,
        time: time || new Date().toLocaleDateString('en-US'),
        photo: photo || '',
        visible: initVisible
      }
    });

    return res.status(201).json({ success: true, message: 'Success story submitted!', story });
  } catch (error) {
    console.error('createStory error:', error);
    return res.status(500).json({ success: false, message: 'Failed to create success story.' });
  }
};

export const updateStory = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { sender, title, message, time, photo, visible } = req.body;

    const dataToUpdate: any = {};
    if (sender !== undefined) dataToUpdate.sender = sender;
    if (title !== undefined) dataToUpdate.title = title;
    if (message !== undefined) dataToUpdate.message = message;
    if (time !== undefined) dataToUpdate.time = time;
    if (photo !== undefined) dataToUpdate.photo = photo;
    if (visible !== undefined) dataToUpdate.visible = visible;

    const story = await prisma.successStory.update({
      where: { id },
      data: dataToUpdate
    });

    return res.json({ success: true, message: 'Success story updated successfully.', story });
  } catch (error) {
    console.error('updateStory error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update success story.' });
  }
};

export const deleteStory = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.successStory.delete({ where: { id } });
    return res.json({ success: true, message: 'Success story deleted successfully.' });
  } catch (error) {
    console.error('deleteStory error:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete success story.' });
  }
};
