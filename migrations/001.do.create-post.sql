CREATE TABLE posts (
  id VARCHAR(36),
  title TEXT NOT NULL,
  content TEXT NOT NULL
)
-- one to many; want to set foreign key of each reply to reference that post's postId
-- 4/13: migrations are schema level
-- seed (insert) at record level
-- 1.) run migration script
-- 2.) look for 'seed' script as well (psql -d <db-name> -f <file-location>)
-- 3.) verify in GUI

-- Get migrations fixed
-- Hit route in postman to see errors until fixed
-- Working Endpoint!
-- 1.) Make router route, make service function to power it then get them to work in Postman
-- 2.) Hook up real endpoints in your client, handlers and fetches

-- how to tie posts and replies with current data structure in App...
-- Set up API endpoints
-- 
-- Seed database with data
-- Posts primary, Replies Foreign

-- 4/18
-- rename postId && replyId to id
-- drop/create/run migrations
-- 1) trigger fetch 2) setState in .then of fetch 3. look at server logs (repeat until working)
-- write smoke test for each component 'does render without errors'
