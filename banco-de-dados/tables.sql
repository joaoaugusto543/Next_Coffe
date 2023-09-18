CREATE TABLE products(
  id VARCHAR(200) NOT NULL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  image VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  price VARCHAR(200) NOT NULL,
  discount FLOAT,
  type VARCHAR(200) NOT NULL
);

CREATE TABLE assessment(
  id VARCHAR(200) NOT NULL PRIMARY KEY,
  id_product VARCHAR(200) NOT NULL,
  five INT NOT NULL DEFAULT 0,
  four INT NOT NULL DEFAULT 0,
  three INT NOT NULL DEFAULT 0,
  two INT NOT NULL DEFAULT 0,
  one INT NOT NULL DEFAULT 0,
  total FLOAT NOT NULL DEFAULT 0,
  FOREIGN KEY (id_product) REFERENCES products(id)
);

CREATE TABLE users(
  id VARCHAR(200) NOT NULL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  image VARCHAR(200) NOT NULL,
  email VARCHAR(200) UNIQUE NOT NULL,
  password VARCHAR(200) NOT NULL,
  admin BOOL NOT NULL DEFAULT false,
  favorites JSON[] NOT NULL DEFAULT '{}'
);

CREATE TABLE historic(
  id VARCHAR(200) NOT NULL PRIMARY KEY,
  products TEXT[] NOT NULL,
  id_user VARCHAR(200) NOT NULL,
  FOREIGN KEY(id_user) REFERENCES users(id),
  open BOOL NOT NULL DEFAULT true
)

CREATE TABLE comments(
  id VARCHAR(200) NOT NULL PRIMARY KEY,
  id_product VARCHAR(200) NOT NULL,
  id_user VARCHAR(200) NOT NULL,
  name VARCHAR(200) NOT NULL,
  image VARCHAR(200) NOT NULL,
  assessment FLOAT NOT NULL,
  comment TEXT NOT NULL,
  FOREIGN KEY (id_product) REFERENCES products(id),
  FOREIGN KEY (id_user) REFERENCES users(id)
);
