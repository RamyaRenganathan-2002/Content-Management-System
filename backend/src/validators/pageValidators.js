const { z } = require('zod');

const blockSchema = z.object({
    type: z.enum(['header', 'paragraph', 'list', 'table', 'equation', 'docs']),
    data: z.any(), // shape varies per type, validated loosely on purpose
    order: z.number()
});

const createPageSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    slug: z.string().min(1, 'Slug is required'),
    blocks: z.array(blockSchema).optional()
});

const updatePageSchema = createPageSchema.partial();

module.exports = { createPageSchema, updatePageSchema };