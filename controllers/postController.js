let posts = [
    { id: 1, title: 'What the name of the cat that lives in 404?', address: '123 Cat St, NYC', time: '3:00 PM', answer: 'Kou', llmBreakable: true, ambiguousMode: true },
    { id: 2, title: 'What is soursop best for?', address: '456 Fruit Ave, NYC', time: '4:00 PM', answer: 'Cocktail', llmBreakable: false, ambiguousMode: false },
];

// @desc: Get all posts
// @route: GET /api/posts
// @access: Public

export const getPosts = (req, res, next) => {
    const limit = parseInt(req.query.limit);

    if (!isNaN(limit) && limit > 0) {
        return res.status(200).json(posts.slice(0, limit));
    } 

    res.status(200).json(posts);
}

// @desc: Get single post
// @route: GET /api/posts/:id
export const getPost = (req, res, next) => {
    const id = parseInt(req.params.id);
    const post = posts.find((post) => post.id === id);

    if (!post) {
        const error = new Error('Post not found');
        error.status = 404;
        return next(error);
    }

    res.json(post);
}

// @desc: Create a post
// @route: POST /api/posts
export const createPost = (req, res, next) => {
    const newPost = {
        id: posts.length + 1,
        title: req.body.title,
        address: req.body.address || 'TBA',
        time: req.body.time || 'TBA',
        answer: req.body.answer,
        llmBreakable: req.body.llmBreakable || false,
        ambiguousMode: req.body.ambiguousMode || false
    };

    if (!newPost.title) {
        const error = new Error('Title is required');
        error.status = 400;
        return next(error);
    }

    posts.push(newPost);
    res.status(201).json(newPost);
}

// @desc: Update a post
// @route: PUT /api/posts/:id
export const updatePost = (req, res, next) => {
    const id = parseInt(req.params.id);
    const post = posts.find((post) => post.id === id);

    if (!post) {
        return res
        .status(404)
        .json({ message: 'Post not found' });
    }

    if (!req.body.title) {
        return res
        .status(400)
        .json({ message: 'Title is required' });
    }

    post.title = req.body.title;
    if (req.body.address) {
        post.address = req.body.address;
    }
    if (req.body.time) {
        post.time = req.body.time;
    }
    if (req.body.answer) {
        post.answer = req.body.answer;
    }
    if (req.body.llmBreakable !== undefined) {
        post.llmBreakable = req.body.llmBreakable;
    }
    if (req.body.ambiguousMode !== undefined) {
        post.ambiguousMode = req.body.ambiguousMode;
    }
    res.status(200).json(post);
}

// @desc: Delete a post
// @route: DELETE /api/posts/:id
export const deletePost = (req, res, next) => {
    const id = parseInt(req.params.id);
    const postIndex = posts.findIndex((post) => post.id === id);

    if (postIndex === -1) {
        return res
        .status(404)
        .json({ message: 'Post not found' });
    }

    posts.splice(postIndex, 1);
    res.status(200).json({ message: 'Post deleted successfully' });
}