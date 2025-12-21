# MXWLL Vault Reader

A reading system for public domain scientific texts in the MXWLL Vault.

## Files to Add to Your Project

Copy these files into your existing MXWLL project:

```
src/
  lib/
    vault-content.ts        → Add to your lib folder
  components/
    BookReader.tsx          → Add to your components folder
  app/
    vault/
      [slug]/
        page.tsx            → New dynamic route for reading

content/
  vault/
    origin-of-species.mdx   → Sample book (create this folder)
```

## Dependencies

You need to install these packages:

```bash
npm install gray-matter react-markdown
```

## Adding the Full Darwin Text

The sample file only contains the Introduction. To add the complete text:

### Step 1: Download from Project Gutenberg

Go to: https://www.gutenberg.org/ebooks/1228

Download the "Plain Text UTF-8" version.

### Step 2: Format as MDX

The text needs to be converted to Markdown format:

1. **Keep the frontmatter** at the top of the file (the part between `---` markers)

2. **Chapter headings** become `## Heading`:
   - `INTRODUCTION` → `## Introduction`
   - `CHAPTER I. VARIATION UNDER DOMESTICATION.` → `## Chapter I: Variation Under Domestication`

3. **Sub-sections** become `### Heading`:
   - `CAUSES OF VARIABILITY.` → `### Causes of Variability`

4. **Paragraphs**: Just ensure blank lines between paragraphs

5. **Remove**: 
   - Gutenberg header/footer text
   - Page numbers
   - Any `[Illustration]` markers (or replace with actual images later)

### Step 3: Quick Find/Replace Operations

In your text editor, do these replacements:

```
Find: CHAPTER I.
Replace: ## Chapter I:

Find: CHAPTER II.
Replace: ## Chapter II:

(etc. for all chapters)
```

For sub-section headings, you'll need to manually add `### ` before each one.

### Chapter List for Reference

```
Introduction
Chapter I: Variation Under Domestication
Chapter II: Variation Under Nature
Chapter III: Struggle for Existence
Chapter IV: Natural Selection
Chapter V: Laws of Variation
Chapter VI: Difficulties on Theory
Chapter VII: Instinct
Chapter VIII: Hybridism
Chapter IX: On the Imperfection of the Geological Record
Chapter X: On the Geological Succession of Organic Beings
Chapter XI: Geographical Distribution
Chapter XII: Geographical Distribution—continued
Chapter XIII: Mutual Affinities of Organic Beings
Chapter XIV: Recapitulation and Conclusion
Glossary
```

## Adding More Books

Create a new `.mdx` file in `content/vault/` with this structure:

```mdx
---
slug: book-slug-here
title: Book Title
author: Author Name
authorDates: 1800–1870
year: 1850
yearDisplay: "1850"
series: living-world
description: Short description for the back of the book widget.
---

## Chapter One

Your content here...
```

### Series Options

Use one of these for the `series` field:
- `geometry`
- `natural-philosophy`
- `heavens`
- `forces-fields`
- `living-world`
- `observers`
- `chemistry`
- `medicine`
- `mathematics`
- `scientific-fiction`

## Linking from BookWidget

The BookWidget "Start Reading" button links to `/vault/[slug]`, so ensure your slug matches.

## Registering Books in the Era Pages

To have a book appear in the era browsing pages (Ancient, Renaissance, etc.), you also need to add it to `src/lib/books.ts`:

```typescript
{
  slug: 'origin-of-species',
  title: 'On the Origin of Species',
  author: 'Charles Darwin',
  authorDates: '1809–1882',
  year: 1859,
  yearDisplay: '1859',
  era: 'modern',
  series: 'living-world',
  description: 'Darwin\'s revolutionary work introducing the theory of evolution by natural selection.',
  readingTime: '10-12 hours',
  pageCount: 502,
},
```

The `era` field determines which listing page it appears on:
- `ancient` - Before 1500
- `renaissance` - 1500–1800  
- `modern` - 1800–1950
- `scientific-fiction` - Fiction works

## Future Enhancements (V2)

- [ ] Reading progress for registered users
- [ ] Bookmarks
- [ ] Font size controls
- [ ] Export to Kindle/EPUB
- [ ] Annotations toggle
- [ ] Dark mode for reading
