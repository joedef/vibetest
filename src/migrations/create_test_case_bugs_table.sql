CREATE TABLE IF NOT EXISTS test_case_bugs (
    id SERIAL PRIMARY KEY,
    test_case_id INTEGER NOT NULL,
    bug_id INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (test_case_id) REFERENCES test_cases(id) ON DELETE CASCADE,
    FOREIGN KEY (bug_id) REFERENCES bugs(id) ON DELETE CASCADE,
    UNIQUE(test_case_id, bug_id)
); 