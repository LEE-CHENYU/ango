import express from 'express';
import { getPosts, getPost, createPost, updatePost, deletePost } from '../controllers/postController.js';
import logger from '../middleware/logger.js';
const router = express.Router();

router.get('/', logger, getPosts);

// Get single posts
router.get('/:id', getPost);

// Create a post
router.post('/', createPost);

// Update a post
router.put('/:id', updatePost);

// Delete a post
router.delete('/:id', deletePost);

export default router;