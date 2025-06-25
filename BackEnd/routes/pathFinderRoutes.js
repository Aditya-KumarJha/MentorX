import express from 'express';
import { generatePathFinderData } from '../controllers/pathFinderController.js';

const router = express.Router();

router.post('/generate', generatePathFinderData);

export default router;
