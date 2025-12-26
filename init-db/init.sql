 -- Drop the table if it exists to start fresh

DROP TABLE IF EXISTS todo;


-- Create the table with created_at and updated columns

CREATE TABLE todo (

  id SERIAL PRIMARY KEY,

  username VARCHAR(20) NOT NULL,

  task VARCHAR(50) NOT NULL,

  done BOOLEAN NOT NULL DEFAULT FALSE,

  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP

);


-- Insert initial data

INSERT INTO todo (username, task, done) VALUES

('cei', 'homework', false),

('cei', 'teaching', false);


-- Verify the data

SELECT * FROM todo;


-- 1. Create a function that sets the updated_at column to NOW()

CREATE OR REPLACE FUNCTION update_modified_column()

RETURNS TRIGGER AS $$

BEGIN

    NEW.updated_at = now();

    RETURN NEW;

END;

$$ language 'plpgsql';


-- 2. Create a trigger that runs that function before any UPDATE

CREATE TRIGGER update_todo_modtime

    BEFORE UPDATE ON todo

    FOR EACH ROW

    EXECUTE PROCEDURE update_modified_column(); 