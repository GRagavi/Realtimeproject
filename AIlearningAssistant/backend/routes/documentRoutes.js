import express from 'express';
import {uploadDocument, getDocument, getDocuments, deleteDocument, updateDocument} from '../controllers/documentController.js';
import protect from '../middleware/auth.js';
import upload from '../config/multer.js';


const router = express.Router();
router.use(protect);
router.post('/upload', upload.single('file'), uploadDocument);
router.get('/:id', getDocument);
router.get('/', getDocuments);
router.delete('/:id', deleteDocument);
router.put('/:id', updateDocument);
// Add your document routes here, for example:
// router.post('/upload', protect, uploadDocument);
// router.get('/', protect, getUserDocuments);

export default router;