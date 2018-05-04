CREATE TABLE IF NOT EXISTS tweets (
  uid STRING PRIMARY KEY,
  update_date TIMESTAMP,
  title_text STRING,
  main_text STRING,
  stream_id STRING,
  video_url STRING
)
CLUSTERED INTO {{ tweets and tweets.shards or 3 }} SHARDS
WITH (
  column_policy='strict'
)