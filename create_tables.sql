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