DROP TABLE IF EXISTS recipe;
CREATE TABLE IF NOT EXISTS recipe (
  id SERIAL PRIMARY KEY,
  mealsname VARCHAR(255),
  category VARCHAR(255),
  area VARCHAR(255),
  instruction TEXT,
  imageurl VARCHAR(255),
  youtube VARCHAR(255)  
);

