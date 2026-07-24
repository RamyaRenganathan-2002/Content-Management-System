const prisma = require('../config/prismaClient');

// Public — get all pages (list view)
exports.getPages = async (req, res, next) => {
    try {
        const pages = await prisma.page.findMany({
            select: { id: true, title: true, slug: true, updatedAt: true }
        });
        res.json({ success: true, pages });
    } catch (err) {
        next(err);
    }
};

// Public — get one page by slug, with its blocks (for public frontend rendering)
exports.getPageBySlug = async (req, res, next) => {
    try {
        const page = await prisma.page.findUnique({
            where: { slug: req.params.slug },
            include: { blocks: { orderBy: { order: 'asc' } } }
        });

        if (!page) {
            return res.status(404).json({ success: false, message: 'Page not found' });
        }

        res.json({ success: true, page });
    } catch (err) {
        next(err);
    }
};

// Admin-only — get one page by id (for edit form pre-fill)
exports.getPageById = async (req, res, next) => {
  try {
    const page = await prisma.page.findUnique({
      where: { id: req.params.id },
      include: { blocks: { orderBy: { order: 'asc' } } }
    });

    if (!page) {
      return res.status(404).json({ success: false, message: 'Page not found' });
    }

    res.json({ success: true, page });
  } catch (err) {
    next(err);
  }
};

// Admin-only — create a page with blocks
exports.createPage = async (req, res, next) => {
    try {
        const { title, slug, blocks = [] } = req.body;

        const page = await prisma.page.create({
            data: {
                title,
                slug,
                blocks: {
                    create: blocks.map((b, i) => ({
                        type: b.type,
                        data: b.data,
                        order: b.order ?? i
                    }))
                }
            },
            include: { blocks: true }
        });

        res.status(201).json({ success: true, page });
    } catch (err) {
        next(err);
    }
};

// Admin-only — update a page (replaces all blocks for simplicity)
exports.updatePage = async (req, res, next) => {
    try {
        const { title, slug, blocks } = req.body;
        const { id } = req.params;

        // Delete old blocks, recreate new ones — simplest way to keep block order/content in sync
        await prisma.block.deleteMany({ where: { pageId: id } });

        const page = await prisma.page.update({
            where: { id },
            data: {
                title,
                slug,
                blocks: {
                    create: (blocks || []).map((b, i) => ({
                        type: b.type,
                        data: b.data,
                        order: b.order ?? i
                    }))
                }
            },
            include: { blocks: true }
        });

        res.json({ success: true, page });
    } catch (err) {
        next(err);
    }
};

// Admin-only — delete a page
exports.deletePage = async (req, res, next) => {
    try {
        await prisma.page.delete({ where: { id: req.params.id } });
        res.json({ success: true, message: 'Page deleted' });
    } catch (err) {
        next(err);
    }
};