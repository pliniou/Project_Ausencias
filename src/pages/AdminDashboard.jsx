import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";

const AdminDashboard = () => {
    const { getAllUsers, registerUser, deleteUser, changePassword } = useAuth();
    const { employees } = useData();
    const [users, setUsers] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

    // Form State
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user');
    const [employeeId, setEmployeeId] = useState('none');

    const [error, setError] = useState('');

    const loadUsers = () => {
        const u = getAllUsers();
        setUsers(u);
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const empId = employeeId === 'none' ? null : employeeId;
            await registerUser(username, password, role, empId);
            setIsOpen(false);
            loadUsers();
            // Reset form
            setUsername('');
            setPassword('');
            setRole('user');
            setEmployeeId('none');
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDelete = (id) => {
        if (confirm('Tem certeza?')) {
            deleteUser(id);
            loadUsers();
        }
    };

    const handlePasswordReset = async (id) => {
        const newPass = prompt("Nova senha para o usuário:");
        if (newPass) {
            await changePassword(id, newPass);
            alert("Senha alterada com sucesso!");
        }
    };

    const getEmployeeName = (empId) => {
        const emp = employees.find(e => e.id === empId);
        return emp ? emp.name : '-';
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold tracking-tight text-[#003399]">Gestão de Usuários</h2>
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-[#FFCC00] text-black hover:bg-[#E6B800]">Novo Usuário</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Cadastrar Novo Usuário</DialogTitle>
                            <DialogDescription>
                                Crie um acesso para um funcionário ou administrador.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleRegister} className="space-y-4">
                            <div className="space-y-2">
                                <Label>Usuário</Label>
                                <Input value={username} onChange={e => setUsername(e.target.value)} required />
                            </div>
                            <div className="space-y-2">
                                <Label>Senha</Label>
                                <Input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                            </div>
                            <div className="space-y-2">
                                <Label>Nível de Acesso</Label>
                                <Select value={role} onValueChange={setRole}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="admin">Super Admin</SelectItem>
                                        <SelectItem value="user">Usuário (Gestor)</SelectItem>
                                        <SelectItem value="viewer">Visualizador</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Vincular a Funcionário</Label>
                                <Select value={employeeId} onValueChange={setEmployeeId}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">Nenhum</SelectItem>
                                        {employees.map(emp => (
                                            <SelectItem key={emp.id} value={emp.id}>{emp.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            {error && <p className="text-destructive text-sm">{error}</p>}
                            <Button type="submit" className="w-full">Cadastrar</Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="glass-card rounded-lg p-1">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Usuário</TableHead>
                            <TableHead>Função</TableHead>
                            <TableHead>Funcionário Vinculado</TableHead>
                            <TableHead>Criado Em</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map(u => (
                            <TableRow key={u.id}>
                                <TableCell className="font-medium">{u.username}</TableCell>
                                <TableCell>{u.role}</TableCell>
                                <TableCell>{getEmployeeName(u.employee_id)}</TableCell>
                                <TableCell>{u.created_at ? format(new Date(u.created_at), 'dd/MM/yyyy') : '-'}</TableCell>
                                <TableCell className="text-right gap-2 flex justify-end">
                                    <Button variant="outline" size="sm" onClick={() => handlePasswordReset(u.id)}>Senha</Button>
                                    {u.username !== 'admin' && (
                                        <Button variant="destructive" size="sm" onClick={() => handleDelete(u.id)}>Excluir</Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default AdminDashboard;
