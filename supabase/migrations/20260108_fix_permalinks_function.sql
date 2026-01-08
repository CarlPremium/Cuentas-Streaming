-- Create function to regenerate permalinks with correct base URL
CREATE OR REPLACE FUNCTION fix_post_permalinks()
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
  post_record RECORD;
  new_permalink TEXT;
  production_url TEXT := 'https://www.cuentasgiveaway.fun';
BEGIN
  -- Loop through all posts
  FOR post_record IN
    SELECT p.id, p.slug, u.username
    FROM posts p
    JOIN users u ON p.user_id = u.id
    WHERE p.permalink LIKE 'http://localhost%'
       OR p.permalink NOT LIKE production_url || '%'
  LOOP
    -- Generate new permalink
    new_permalink := production_url || '/' || post_record.username || '/' || post_record.slug;

    -- Update post
    UPDATE posts
    SET permalink = new_permalink
    WHERE id = post_record.id;

    RAISE NOTICE 'Updated post % with new permalink: %', post_record.id, new_permalink;
  END LOOP;

  RAISE NOTICE 'Permalink fix complete!';
END;
$$;

-- Execute the function to fix all permalinks
SELECT fix_post_permalinks();

-- Drop the function after use (optional)
-- DROP FUNCTION IF EXISTS fix_post_permalinks();
