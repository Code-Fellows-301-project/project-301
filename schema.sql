DROP TABLE IF EXISTS recipe;
CREATE TABLE IF NOT EXISTS recipe (
 id SERIAL PRIMARY KEY,
 mealsName VARCHAR(255),
  category VARCHAR(255),
  area VARCHAR(255),
  instruction TEXT,
  imageUrl VARCHAR(255)
  youtube VARCHAR(255)
  
);
INSERT INTO recipe (mealsName, category,area, instruction ,imageUrl,youtube )
VALUES('mansef','meat','jordan','mansef is delicuos','image link','youtube link');

