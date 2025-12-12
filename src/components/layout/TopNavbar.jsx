import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, CalendarDays, Plane, Users, Moon, Sun, Coffee, ShieldCheck, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import logoBBTS from '../../res/BBTS-horizontal-traco-branca.png';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const navigation = [
    { name: 'Início', href: '/', icon: LayoutDashboard },
    { name: 'Calendário', href: '/calendario', icon: CalendarDays },
    { name: 'Afastamentos', href: '/afastamentos', icon: Plane },
    { name: 'Cadastros', href: '/cadastros', icon: Users },
];

export function TopNavbar() {
    const location = useLocation();
    const navigate = useNavigate();
    const { theme, setTheme } = useTheme();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/10 bg-background/80 backdrop-blur-md">
            <div className="container mx-auto flex h-20 items-center justify-between px-4">
                {/* Logo */}
                {/* Logo */}
                <Link to="/" className="flex items-center gap-4 hover:opacity-80 transition-opacity">
                    <img
                        src={logoBBTS}
                        alt="BBTS Logo"
                        className="h-10 w-auto object-contain transition-transform hover:scale-105"
                    />
                    <div className="hidden md:block">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold tracking-widest text-primary uppercase">Portal de Gestão</span>
                            <h1 className="font-display text-lg font-bold text-foreground leading-none tracking-wide">
                                Controle de Afastamentos
                            </h1>
                        </div>
                    </div>
                </Link>

                <div className="flex items-center gap-4">
                    {/* Navigation */}
                    <nav className="flex items-center gap-2">
                        {navigation.map((item) => {
                            const isActive = location.pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    className={cn(
                                        'group flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300',
                                        isActive
                                            ? 'bg-primary/10 text-primary shadow-sm ring-1 ring-primary/20'
                                            : 'text-muted-foreground hover:bg-accent hover:text-foreground hover:translate-y-[-2px]'
                                    )}
                                >
                                    <item.icon className={cn("h-4 w-4 transition-transform group-hover:scale-110", isActive && "text-primary")} />
                                    <span>{item.name}</span>
                                </Link>
                            );
                        })}
                        {user?.role === 'admin' && (
                            <Link
                                to="/admin"
                                className={cn(
                                    'group flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300',
                                    location.pathname === '/admin'
                                        ? 'bg-[#FFCC00]/20 text-[#FFCC00] shadow-sm ring-1 ring-[#FFCC00]/50'
                                        : 'text-muted-foreground hover:bg-accent hover:text-foreground hover:translate-y-[-2px]'
                                )}
                            >
                                <ShieldCheck className="h-4 w-4 transition-transform group-hover:scale-110" />
                                <span>Admin</span>
                            </Link>
                        )}
                    </nav>

                    <div className="flex items-center gap-2">
                        {/* User Info */}
                        {user && (
                            <div className="hidden lg:flex flex-col text-right mr-2">
                                <span className="text-sm font-medium leading-none">{user.username}</span>
                                <span className="text-xs text-muted-foreground">{user.role}</span>
                            </div>
                        )}

                        {/* Theme Toggle */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="rounded-full">
                                    {theme === 'dark' && <Moon className="h-5 w-5" />}
                                    {theme === 'light' && <Sun className="h-5 w-5" />}
                                    {theme === 'sepia' && <Coffee className="h-5 w-5" />}
                                    {theme === 'colorful' && <Sun className="h-5 w-5 text-orange-500" />}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => setTheme('dark')}>
                                    <Moon className="mr-2 h-4 w-4" />
                                    <span>Escuro</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setTheme('sepia')}>
                                    <Coffee className="mr-2 h-4 w-4" />
                                    <span>Dark Sepia</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setTheme('colorful')}>
                                    <Sun className="mr-2 h-4 w-4 text-orange-500" />
                                    <span>Colorido</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <Button variant="ghost" size="icon" onClick={handleLogout} title="Sair">
                            <LogOut className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    );
}
