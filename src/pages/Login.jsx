import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import logo from '../res/BBTS-central-azul-comercial.png';

const schema = z.object({
    username: z.string().min(2, "Usuário muito curto"),
    password: z.string().min(4, "Senha muito curta"),
});

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = React.useState('');

    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            username: "",
            password: "",
        },
    });

    const onSubmit = async (data) => {
        try {
            setError('');
            await login(data.username, data.password);
            navigate('/');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 flex-col gap-8">
            <img src={logo} alt="BBTS Logo" className="h-24 object-contain" />
            <Card className="w-[350px] shadow-lg animate-fade-in">
                <CardHeader>
                    <CardTitle className="text-2xl text-primary text-center">Login</CardTitle>
                    <CardDescription className="text-center">Acesse o Sistema de Ausências</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Usuário</FormLabel>
                                        <FormControl>
                                            <Input placeholder="admin" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Senha</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="****" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {error && <p className="text-sm text-destructive text-center">{error}</p>}
                            <Button type="submit" className="w-full bg-[#003399] hover:bg-[#002277]">Entrar</Button>
                        </form>
                    </Form>
                </CardContent>
                <div className="p-4 text-center text-xs text-muted-foreground">
                    <p>Login padrão: admin / admin123</p>
                </div>
            </Card>
        </div>
    );
};

export default Login;
