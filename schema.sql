DROP TABLE IF EXISTS contacts;

CREATE TABLE contacts (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  name        TEXT    NOT NULL,
  phone       TEXT    NOT NULL,
  business    TEXT,
  budget      TEXT,
  message     TEXT,
  ip          TEXT,
  user_agent  TEXT,
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_contacts_created_at ON contacts(created_at DESC);
CREATE INDEX idx_contacts_phone      ON contacts(phone);
