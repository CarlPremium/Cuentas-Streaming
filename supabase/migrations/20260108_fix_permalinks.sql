-- Migration to fix localhost permalinks
-- Run this in Supabase SQL Editor or via migration

-- Update all posts with localhost permalinks to production URL
UPDATE posts
SET permalink = REPLACE(permalink, 'http://localhost:3000', 'https://www.cuentasgiveaway.fun')
WHERE permalink LIKE 'http://localhost:3000%';

-- Verify the update
SELECT id, title, permalink
FROM posts
LIMIT 10;
