import { Router } from 'express';
import { authenticateToken, requireRole } from '../middleware/auth';
import * as authController from '../controllers/authController';
import * as studentController from '../controllers/studentController';
import * as adminController from '../controllers/adminController';
import * as contentController from '../controllers/contentController';
import * as announcementController from '../controllers/announcementController';
import * as storyController from '../controllers/storyController';

const router = Router();

// ─── Authentication Routes ───────────────────────────────────────────────────
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.get('/auth/me', authenticateToken, authController.getMe);

// ─── Student Profile & Progress Routes ───────────────────────────────────────
router.post('/student/progress/dsa', authenticateToken, requireRole('STUDENT'), studentController.toggleDsaProgress);
router.post('/student/progress/fullstack', authenticateToken, requireRole('STUDENT'), studentController.toggleFullStackProgress);
router.post('/student/progress/aptitude', authenticateToken, requireRole('STUDENT'), studentController.toggleAptitudeProgress);
router.post('/student/goal', authenticateToken, requireRole('STUDENT'), studentController.updateGoal);
router.post('/student/reset', authenticateToken, requireRole('STUDENT'), studentController.resetProgress);
router.post('/student/notes', authenticateToken, requireRole('STUDENT'), studentController.saveNotes);
router.post('/student/mentorship-request', authenticateToken, requireRole('STUDENT'), studentController.requestMentorship);

// ─── Admin Management Routes ─────────────────────────────────────────────────
router.get('/admin/students', authenticateToken, requireRole('ADMIN'), adminController.getStudents);
router.get('/admin/students/:email', authenticateToken, requireRole('ADMIN'), adminController.getStudentByEmail);
router.delete('/admin/students/:email/delete', authenticateToken, requireRole('ADMIN'), adminController.deleteStudent);
router.post('/admin/students/:email/reset', authenticateToken, requireRole('ADMIN'), adminController.resetStudentProgress);
router.post('/admin/students/:email/mentorship', authenticateToken, requireRole('ADMIN'), adminController.updateStudentMentorship);

// ─── Curriculum Content Routes ────────────────────────────────────────────────
router.get('/content/dsa', contentController.getDsaContent);
router.post('/content/dsa', authenticateToken, requireRole('ADMIN'), contentController.createDsaContent);
router.put('/content/dsa/:id', authenticateToken, requireRole('ADMIN'), contentController.updateDsaContent);
router.delete('/content/dsa/:id', authenticateToken, requireRole('ADMIN'), contentController.deleteDsaContent);

router.get('/content/fullstack', contentController.getFsContent);
router.post('/content/fullstack', authenticateToken, requireRole('ADMIN'), contentController.createFsContent);
router.put('/content/fullstack/:id', authenticateToken, requireRole('ADMIN'), contentController.updateFsContent);
router.delete('/content/fullstack/:id', authenticateToken, requireRole('ADMIN'), contentController.deleteFsContent);

router.get('/content/aptitude', contentController.getAptContent);
router.post('/content/aptitude', authenticateToken, requireRole('ADMIN'), contentController.createAptTopic);
router.put('/content/aptitude/:id', authenticateToken, requireRole('ADMIN'), contentController.updateAptTopic);
router.delete('/content/aptitude/:id', authenticateToken, requireRole('ADMIN'), contentController.deleteAptTopic);

// ─── Success Stories Routes ──────────────────────────────────────────────────
router.get('/stories', (req, res, next) => {
  // Optional auth check to see if admin is logged in (to get all stories)
  const authHeader = req.headers['authorization'];
  if (authHeader) {
    authenticateToken(req, res, next);
  } else {
    next();
  }
}, storyController.getStories);
router.post('/stories', (req, res, next) => {
  // Allow anyone to submit anonymously, or check authentication if logged in
  const authHeader = req.headers['authorization'];
  if (authHeader) {
    authenticateToken(req, res, next);
  } else {
    next();
  }
}, storyController.createStory);
router.put('/stories/:id', authenticateToken, requireRole('ADMIN'), storyController.updateStory);
router.delete('/stories/:id', authenticateToken, requireRole('ADMIN'), storyController.deleteStory);

// ─── Announcements Routes ────────────────────────────────────────────────────
router.get('/announcements', announcementController.getAnnouncements);
router.get('/admin/announcements', authenticateToken, requireRole('ADMIN'), announcementController.getAllAnnouncements);
router.post('/announcements', authenticateToken, requireRole('ADMIN'), announcementController.createAnnouncement);
router.put('/announcements/:id', authenticateToken, requireRole('ADMIN'), announcementController.updateAnnouncement);
router.delete('/announcements/:id', authenticateToken, requireRole('ADMIN'), announcementController.deleteAnnouncement);

export default router;
