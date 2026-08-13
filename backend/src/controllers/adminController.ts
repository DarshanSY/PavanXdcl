import { Response } from 'express';
import prisma from '../config/db';
import { AuthRequest } from '../middleware/auth';

export const getStudents = async (req: AuthRequest, res: Response) => {
  try {
    const studentsList = await prisma.user.findMany({
      where: { role: 'STUDENT' }
    });

    const formatted = studentsList.map(s => ({
      name: s.name,
      email: s.email,
      joinedDate: s.joinedDate,
      streak: s.streak,
      targetGoal: s.targetGoal,
      mentorshipSelected: s.mentorshipSelected,
      mentorshipRequested: s.mentorshipRequested,
      notes: s.notes,
      progress: {
        dsa: JSON.parse(s.progressDsa || '[]'),
        fullstack: JSON.parse(s.progressFullstack || '[]'),
        aptitude: JSON.parse(s.progressAptitude || '[]')
      }
    }));

    return res.json({ success: true, students: formatted });
  } catch (error) {
    console.error('getStudents error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch students.' });
  }
};

export const getStudentByEmail = async (req: AuthRequest, res: Response) => {
  try {
    const { email } = req.params;
    if (!email) return res.status(400).json({ success: false, message: 'Student email required.' });

    const studentObj = await prisma.user.findFirst({
      where: { email: email.toLowerCase(), role: 'STUDENT' }
    });

    if (!studentObj) {
      return res.status(404).json({ success: false, message: 'Student not found.' });
    }

    return res.json({
      success: true,
      student: {
        name: studentObj.name,
        email: studentObj.email,
        joinedDate: studentObj.joinedDate,
        streak: studentObj.streak,
        targetGoal: studentObj.targetGoal,
        mentorshipSelected: studentObj.mentorshipSelected,
        mentorshipRequested: studentObj.mentorshipRequested,
        notes: studentObj.notes,
        progress: {
          dsa: JSON.parse(studentObj.progressDsa || '[]'),
          fullstack: JSON.parse(studentObj.progressFullstack || '[]'),
          aptitude: JSON.parse(studentObj.progressAptitude || '[]')
        }
      }
    });
  } catch (error) {
    console.error('getStudentByEmail error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch student details.' });
  }
};

export const deleteStudent = async (req: AuthRequest, res: Response) => {
  try {
    const { email } = req.params;
    if (!email) return res.status(400).json({ success: false, message: 'Student email required.' });

    const studentObj = await prisma.user.findFirst({
      where: { email: email.toLowerCase(), role: 'STUDENT' }
    });

    if (!studentObj) {
      return res.status(404).json({ success: false, message: 'Student not found.' });
    }

    await prisma.user.delete({
      where: { id: studentObj.id }
    });

    return res.json({ success: true, message: 'Student deleted successfully.' });
  } catch (error) {
    console.error('deleteStudent error:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete student.' });
  }
};

export const resetStudentProgress = async (req: AuthRequest, res: Response) => {
  try {
    const { email } = req.params;
    if (!email) return res.status(400).json({ success: false, message: 'Student email required.' });

    const studentObj = await prisma.user.findFirst({
      where: { email: email.toLowerCase(), role: 'STUDENT' }
    });

    if (!studentObj) {
      return res.status(404).json({ success: false, message: 'Student not found.' });
    }

    await prisma.user.update({
      where: { id: studentObj.id },
      data: {
        progressDsa: '[]',
        progressFullstack: '[]',
        progressAptitude: '[]',
        streak: 0
      }
    });

    return res.json({ success: true, message: 'Student progress reset successfully.' });
  } catch (error) {
    console.error('resetStudentProgress error:', error);
    return res.status(500).json({ success: false, message: 'Failed to reset student progress.' });
  }
};

export const updateStudentMentorship = async (req: AuthRequest, res: Response) => {
  try {
    const { email } = req.params;
    const { selected } = req.body;

    if (!email || selected === undefined) {
      return res.status(400).json({ success: false, message: 'Student email and selected state required.' });
    }

    const studentObj = await prisma.user.findFirst({
      where: { email: email.toLowerCase(), role: 'STUDENT' }
    });

    if (!studentObj) {
      return res.status(404).json({ success: false, message: 'Student not found.' });
    }

    await prisma.user.update({
      where: { id: studentObj.id },
      data: { mentorshipSelected: selected }
    });

    return res.json({ success: true, message: 'Student mentorship status updated successfully.' });
  } catch (error) {
    console.error('updateStudentMentorship error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update student mentorship status.' });
  }
};
