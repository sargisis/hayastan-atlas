-- v7: add category to events
ALTER TABLE events ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'political';

-- Auto-categorize existing events by keywords
UPDATE events SET category = 'war'
  WHERE title ILIKE '%battle%' OR title ILIKE '%war%' OR title ILIKE '%campaign%'
     OR title ILIKE '%invasion%' OR title ILIKE '%conquest%' OR title ILIKE '%defeat%'
     OR title ILIKE '%victory%' OR title ILIKE '%siege%' OR title ILIKE '%revolt%'
     OR title ILIKE '%rebellion%' OR title ILIKE '%crusade%';

UPDATE events SET category = 'religion'
  WHERE title ILIKE '%christian%' OR title ILIKE '%church%' OR title ILIKE '%apostle%'
     OR title ILIKE '%religion%' OR title ILIKE '%faith%' OR title ILIKE '%bishop%'
     OR title ILIKE '%patriarch%' OR title ILIKE '%monastery%' OR title ILIKE '%saint%'
     OR title ILIKE '%bible%' OR title ILIKE '%scripture%';

UPDATE events SET category = 'trade'
  WHERE title ILIKE '%trade%' OR title ILIKE '%silk%' OR title ILIKE '%route%'
     OR title ILIKE '%merchant%' OR title ILIKE '%market%' OR title ILIKE '%commerce%';

UPDATE events SET category = 'culture'
  WHERE title ILIKE '%alphabet%' OR title ILIKE '%art%' OR title ILIKE '%architecture%'
     OR title ILIKE '%literature%' OR title ILIKE '%culture%' OR title ILIKE '%school%'
     OR title ILIKE '%academy%' OR title ILIKE '%book%' OR title ILIKE '%script%'
     OR title ILIKE '%language%';
