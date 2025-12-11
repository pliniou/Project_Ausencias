import initSqlJs from 'sql.js';

class Database {
    constructor() {
        this.db = null;
        this.SQL = null;
    }

    async init() {
        if (this.db) return;

        try {
            // Locate WASM file. In production (GitHub Pages), it's at the root or base path.
            // But we must assume it is accessible via fetch.
            // Vite handles assets in public/ automatically.
            this.SQL = await initSqlJs({
                locateFile: file => `./${file}`
            });

            // Load saved database from localStorage/IndexedDB if exists
            const savedDb = localStorage.getItem('sqlite_db_dump');
            if (savedDb) {
                const uInt8Array = new Uint8Array(JSON.parse(savedDb));
                this.db = new this.SQL.Database(uInt8Array);
            } else {
                this.db = new this.SQL.Database();
                this.initSchema();
            }

            console.log("Database initialized");
        } catch (error) {
            console.error("Failed to initialize database:", error);
            throw error;
        }
    }

    initSchema() {
        // Create Users table
        this.db.run(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                role TEXT CHECK(role IN ('admin', 'user', 'viewer')) NOT NULL,
                employee_id TEXT, -- Link to mockData employee ID
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Check if Admin exists, if not create default
        // Default: admin / admin123 (hashed handled by AuthContext but we insert pre-hashed here for bootstrap is tricky without bcrypt here)
        // We will handle bootstrapping in AuthContext to ensure correct hashing.
    }

    query(sql, params = []) {
        if (!this.db) throw new Error("Database not initialized");

        // Prepare statement
        const stmt = this.db.prepare(sql);
        stmt.bind(params);

        const results = [];
        while (stmt.step()) {
            results.push(stmt.getAsObject());
        }
        stmt.free();
        return results;
    }

    run(sql, params = []) {
        if (!this.db) throw new Error("Database not initialized");
        this.db.run(sql, params);
        this.save();
    }

    // Save current DB state to localStorage (Basic persistence)
    // For large DBs, IndexedDB is better, but for this simpler task localStorage might suffice if small.
    // However, binary in localStorage is inefficient.
    save() {
        if (!this.db) return;
        const data = this.db.export();
        // Convert Uint8Array to Array for JSON storage (inefficient but works for now)
        // Ideally use 'localforage' or raw IndexedDB for binary.
        // Given constraints and ease: JSON stringify Array.
        localStorage.setItem('sqlite_db_dump', JSON.stringify(Array.from(data)));
    }
}

export const db = new Database();
