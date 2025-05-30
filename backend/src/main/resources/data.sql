-- Update existing status values to match the TaskStatus enum
UPDATE tasks
SET status = CASE 
    WHEN LOWER(status) LIKE '%todo%' OR LOWER(status) LIKE '%to do%' OR status IS NULL THEN 'TODO'
    WHEN LOWER(status) LIKE '%progress%' OR LOWER(status) LIKE '%doing%' THEN 'IN_PROGRESS'
    WHEN LOWER(status) LIKE '%review%' THEN 'IN_REVIEW'
    WHEN LOWER(status) LIKE '%done%' OR LOWER(status) LIKE '%complete%' OR LOWER(status) LIKE '%finished%' THEN 'DONE'
    ELSE 'TODO'  -- Default to TODO for any unmatched status
END; 