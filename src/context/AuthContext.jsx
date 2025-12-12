import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '@/lib/database';
import bcrypt from 'bcryptjs';

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            await db.init();

            // Check if users exist, if not create default users
            const usersCount = db.query("SELECT COUNT(*) as count FROM users");
            if (usersCount[0].count === 0) {
                // Use synchronous hash for initialization to ensure immediate availability
                const defaultHash = bcrypt.hashSync('123456', 10);

                const seedUsers = [
                    { username: 'admin', role: 'admin', name: 'Super Admin' },
                    { username: 'plinio', role: 'admin', name: 'Plinio Marcos De Abreu Rodrigues' },
                    { username: 'gustavo', role: 'admin', name: 'Gustavo Henaut' },
                    { username: 'keilane', role: 'user', name: 'Keilane de Oliveira Pinheiro' },
                    { username: 'drielly', role: 'user', name: 'Drielly Alves de Castro' },
                    { username: 'elton', role: 'user', name: 'Elton Carlos Ribeiro da Silva' },
                    { username: 'gabriela', role: 'user', name: 'Gabriela Fernanda dos Santos Carvalho' },
                    { username: 'raphaella', role: 'user', name: 'Raphaella Medeiros D Abadia Sales' },
                    { username: 'douglas', role: 'user', name: 'Douglas De Sousa Oliveira Saraiva' },
                ];

                seedUsers.forEach(u => {
                    db.run(
                        "INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)",
                        [u.username, defaultHash, u.role]
                    );
                });

            }

            // Restore session
            const savedUser = localStorage.getItem('ausencias_user');
            if (savedUser) {
                setUser(JSON.parse(savedUser));
            }
            setLoading(false);
        };
        initAuth();
    }, []);

    const login = async (username, password) => {
        const result = db.query("SELECT * FROM users WHERE username = ?", [username]);
        if (result.length === 0) {
            throw new Error("Usuário não encontrado");
        }
        const u = result[0];
        const valid = await bcrypt.compare(password, u.password_hash);
        if (!valid) {
            throw new Error("Senha incorreta");
        }

        // Remove password hash from session object for security
        const { password_hash, ...safeUser } = u;
        setUser(safeUser);
        localStorage.setItem('ausencias_user', JSON.stringify(safeUser));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('ausencias_user');
    };

    const registerUser = async (username, password, role, employeeId = null) => {
        // Only Admin can register
        // But we might want to expose this function for the Admin Dashboard

        // Validation
        if (!username || !password || !role) throw new Error("Dados inválidos");

        const existing = db.query("SELECT id FROM users WHERE username = ?", [username]);
        if (existing.length > 0) throw new Error("Usuário já existe");

        const hash = await bcrypt.hash(password, 10);
        db.run(
            "INSERT INTO users (username, password_hash, role, employee_id) VALUES (?, ?, ?, ?)",
            [username, hash, role, employeeId]
        );
        return true;
    };

    const changePassword = async (userId, newPassword) => {
        const hash = await bcrypt.hash(newPassword, 10);
        db.run("UPDATE users SET password_hash = ? WHERE id = ?", [hash, userId]);
    };

    const getAllUsers = () => {
        return db.query("SELECT id, username, role, employee_id, created_at FROM users");
    }

    const deleteUser = (id) => {
        db.run("DELETE FROM users WHERE id = ?", [id]);
    }

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            login,
            logout,
            registerUser,
            changePassword,
            getAllUsers,
            deleteUser
        }}>
            {children}
        </AuthContext.Provider>
    );
}
// Fix: Use AuthContext.Provider, not DataContext.Provider
// And export useAuth

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
