import React from 'react';
import { useAuth } from '@/context/AuthContext';

/**
 * Componente para controlar a visibilidade de elementos baseado nas permissões do usuário.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Elementos a serem renderizados se permitido.
 * @param {string[]} props.roles - Lista de roles permitidas (ex: ['admin', 'superadmin']). Se vazio, permite qualquer usuário autenticado.
 * @param {React.ReactNode} props.fallback - Elemento a ser renderizado caso não permitido (opcional).
 */
export const PermissionGate = ({ children, roles = [], fallback = null }) => {
    const { user } = useAuth();

    if (!user) return fallback;

    // Se roles foram especificadas, verifique se o usuário tem uma delas
    if (roles.length > 0 && !roles.includes(user.role)) {
        return fallback;
    }

    return children;
};
