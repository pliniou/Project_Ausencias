import { ReactNode } from 'react';
import { useAuth } from '@/context/AuthContext';
import { hasPermission } from '@/auth/permissions';

interface PermissionGateProps {
    children: ReactNode;
    permission: string;
    fallback?: ReactNode;
}

/**
 * Componente para controlar a visibilidade de elementos baseado nas permissões do usuário.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Elementos a serem renderizados se permitido.
 * @param {string} props.permission - Permissão necessária (ex: 'LEAVE_DELETE'). 
 * @param {React.ReactNode} props.fallback - Elemento a ser renderizado caso não permitido (opcional).
 */
export const PermissionGate = ({ children, permission, fallback = null }: PermissionGateProps): ReactNode => {
    const { user } = useAuth();

    if (!user) return fallback;

    // Verificar se o usuário tem a permissão necessária
    if (permission && !hasPermission(user, permission)) {
        return fallback;
    }

    return children;
};
