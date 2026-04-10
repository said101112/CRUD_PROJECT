CREATE TABLE IF NOT EXISTS projects (
  id            SERIAL PRIMARY KEY,
  title         VARCHAR(100) NOT NULL,
  description   TEXT NOT NULL,
  status        VARCHAR(20) DEFAULT 'TODO',
  priority      VARCHAR(10) DEFAULT 'MEDIUM',
  category      VARCHAR(50),
  technologies  TEXT,
  created_by    VARCHAR(50) NOT NULL,
  start_date    DATE,
  end_date      DATE,
  duration_days INTEGER GENERATED ALWAYS AS (end_date - start_date) STORED,
  budget        DECIMAL(10,2),
  progress      INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
