CREATE TABLE IF NOT EXISTS users (
  id STRING PRIMARY KEY,
  first_name STRING,
  last_name STRING,
  email STRING,
  password STRING
)
CLUSTERED INTO {{ users and users.shards or 3 }} SHARDS
WITH (
  column_policy='strict'
)