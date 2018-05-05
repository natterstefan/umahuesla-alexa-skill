CREATE TABLE IF NOT EXISTS hashtags (
  tag STRING PRIMARY KEY,
  active BOOLEAN
)
CLUSTERED INTO {{ hashtags and hashtags.shards or 3 }} SHARDS
WITH (
  column_policy='strict'
);

INSERT INTO hashtags(tag, active)
VALUES ('uh18', true);