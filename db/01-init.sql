CREATE TABLE securities (
    id SERIAL PRIMARY KEY,
    symbol TEXT NOT NULL,
    security_name TEXT NOT NULL,
    sector TEXT,
    country TEXT,
    trend REAL
);

CREATE TABLE time_series (
    id SERIAL PRIMARY KEY,
    security_id INT REFERENCES securities(id),
    date DATE NOT NULL,
    close_price NUMERIC(10, 2),
    volume BIGINT
);