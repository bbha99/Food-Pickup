DROP TABLE IF EXISTS food_quantities CASCADE;
CREATE TABLE food_quantities (
  id SERIAL PRIMARY KEY NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 0,
  food_id INTEGER REFERENCES foods(id) ON DELETE CASCADE,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE
);


-- (2, "banana", 2)
-- (1, "grapes", 2)
