import express from 'express';
import { askQuestion, finishStory } from '../controllers/aiController.js';
const router = express.Router();

router.post('/askQuestion', askQuestion);
router.post("/finishStory", finishStory);

export default router;