import { pool } from '../db.js';

// @desc: Get all posts
// @route: GET /api/posts
// @access: Public
export const getPosts = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit);
        let query = 'SELECT * FROM posts';
        
        if (!isNaN(limit) && limit > 0) {
            query += ' LIMIT $1';
            const { rows } = await pool.query(query, [limit]);
            return res.status(200).json(rows);
        } 

        const { rows } = await pool.query(query);
        res.status(200).json(rows);
    } catch (error) {
        next(error);
    }
}

// @desc: Get single post
// @route: GET /api/posts/:id
export const getPost = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const { rows } = await pool.query('SELECT * FROM posts WHERE id = $1', [id]);

        if (rows.length === 0) {
            const error = new Error('Post not found');
            error.status = 404;
            return next(error);
        }

        res.json(rows[0]);
    } catch (error) {
        next(error);
    }
}

// @desc: Create a post
// @route: POST /api/posts
export const createPost = async (req, res, next) => {
    try {
        const { question, address, time, answer, llm_breakable, ambiguous_mode, visible } = req.body;

        if (!question) {
            const error = new Error('Question is required');
            error.status = 400;
            return next(error);
        }

        const { rows } = await pool.query(
            'INSERT INTO posts (question, address, time, answer, llm_breakable, ambiguous_mode, visible) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [question, address || 'TBA', time || 'TBA', answer, llm_breakable || false, ambiguous_mode || false, visible || false]
        );

        res.status(201).json(rows[0]);
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({
            message: 'An error occurred while creating the post',
            error: error.message,
            stack: error.stack
        });
    }
}

// @desc: Update a post
// @route: PUT /api/posts/:id
export const updatePost = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const { question, address, time, answer, llm_breakable, ambiguous_mode, visible } = req.body;

        if (!question) {
            return res.status(400).json({ message: 'Question is required' });
        }

        const { rows } = await pool.query(
            'UPDATE posts SET question = $1, address = $2, time = $3, answer = $4, llm_breakable = $5, ambiguous_mode = $6, visible = $7 WHERE id = $8 RETURNING *',
            [question, address, time, answer, llm_breakable, ambiguous_mode, visible, id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Post not found' });
        }

        res.status(200).json(rows[0]);
    } catch (error) {
        next(error);
    }
}

// @desc: Delete a post
// @route: DELETE /api/posts/:id
export const deletePost = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const { rowCount } = await pool.query('DELETE FROM posts WHERE id = $1', [id]);

        if (rowCount === 0) {
            return res.status(404).json({ message: 'Post not found' });
        }

        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        next(error);
    }
}
