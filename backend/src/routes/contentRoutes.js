const express = require('express');
const router = express.Router();

const protectRoute = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');
const { createPageSchema, updatePageSchema } = require('../validators/pageValidators');

const {
    getPages,
    getPageBySlug,
    getPageById,
    createPage,
    updatePage,
    deletePage
} = require('../controllers/contentController');

// Public routes
router.get('/pages', getPages);
router.get('/pages/id/:id', protectRoute, getPageById);
router.get('/pages/:slug', getPageBySlug);

// Admin-only routes
router.post('/pages', protectRoute, validate(createPageSchema), createPage);
router.put('/pages/:id', protectRoute, validate(updatePageSchema), updatePage);
router.delete('/pages/:id', protectRoute, deletePage);

module.exports = router;