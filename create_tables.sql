CREATE TABLE IF NOT EXISTS posts (
    id SERIAL PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    address TEXT DEFAULT 'TBA',
    time VARCHAR(50) DEFAULT 'TBA',
    visible BOOLEAN DEFAULT FALSE,
    ambiguous_mode BOOLEAN DEFAULT FALSE,
    llm_breakable BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS post_break_counts (
    post_id INTEGER PRIMARY KEY REFERENCES posts(id),
    break_count INTEGER DEFAULT 0,
    attempts INTEGER DEFAULT 0
);