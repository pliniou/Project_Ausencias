import { cn } from '@/lib/utils';

const variantStyles = {
    default: 'bg-card',
    primary: 'bg-gradient-to-br from-primary to-primary/80',
    success: 'bg-gradient-to-br from-status-active to-status-active/80',
    warning: 'bg-gradient-to-br from-leave-court to-leave-court/80',
    danger: 'bg-gradient-to-br from-destructive to-destructive/80',
};

const textStyles = {
    default: 'text-foreground',
    primary: 'text-primary-foreground',
    success: 'text-primary-foreground',
    warning: 'text-primary-foreground',
    danger: 'text-primary-foreground',
};

export function StatCard({ title, value, subtitle, icon, variant = 'default', className }) {
    return (
        <div className={cn('stat-card', variantStyles[variant], className)}>
            <div className="flex items-start justify-between">
                <div>
                    <p className={cn('text-sm font-medium opacity-80', textStyles[variant])}>{title}</p>
                    <p className={cn('mt-2 text-3xl font-display font-bold', textStyles[variant])}>{value}</p>
                    {subtitle && (
                        <p className={cn('mt-1 text-sm opacity-70', textStyles[variant])}>{subtitle}</p>
                    )}
                </div>
                <div className={cn('rounded-xl p-3', variant === 'default' ? 'bg-primary/10' : 'bg-white/20')}>
                    <div className={cn(variant === 'default' ? 'text-primary' : 'text-white')}>
                        {icon}
                    </div>
                </div>
            </div>
        </div>
    );
}
