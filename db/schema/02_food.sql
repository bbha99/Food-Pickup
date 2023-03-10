DROP TABLE IF EXISTS foods CASCADE;
CREATE TABLE foods (
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  image_url VARCHAR(255) NOT NULL,
  price INTEGER NOT NULL DEFAULT 0,
  toggle VARCHAR(255) DEFAULT 'off',
  owner_id INTEGER REFERENCES users(id) ON DELETE CASCADE
);
