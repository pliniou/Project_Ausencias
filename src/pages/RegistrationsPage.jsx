import { useState } from 'react';
import { Plus, Trash2, Users, Calendar, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ConfirmDeleteDialog } from '@/components/ui/ConfirmDeleteDialog';
import { useData } from '@/context/DataContext';
import { departments, roles } from '@/lib/mockData';
import { formatDateBR } from '@/lib/dateUtils';
import { toast } from '@/hooks/use-toast';

export default function RegistrationsPage() {
    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h1 className="text-2xl font-display font-bold text-foreground">
                    Cadastros
                </h1>
                <p className="text-muted-foreground mt-1">
                    Gerencie colaboradores, feriados e eventos da empresa
                </p>
            </div>

            <Tabs defaultValue="employees" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="employees" className="gap-2">
                        <Users className="h-4 w-4" />
                        Colaboradores
                    </TabsTrigger>
                    <TabsTrigger value="holidays" className="gap-2">
                        <Calendar className="h-4 w-4" />
                        Feriados
                    </TabsTrigger>
                    <TabsTrigger value="events" className="gap-2">
                        <Building className="h-4 w-4" />
                        Eventos
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="employees">
                    <EmployeesTab />
                </TabsContent>

                <TabsContent value="holidays">
                    <HolidaysTab />
                </TabsContent>

                <TabsContent value="events">
                    <EventsTab />
                </TabsContent>
            </Tabs>
        </div>
    );
}

function EmployeesTab() {
    const { employees, addEmployee, deleteEmployee } = useData();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        role: '',
        department: '',
        vacationBalance: 30,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.role || !formData.department) {
            toast({ title: 'Erro', description: 'Preencha todos os campos obrigatórios.', variant: 'destructive' });
            return;
        }
        addEmployee({
            ...formData,
            status: 'ATIVO',
        });
        toast({ title: 'Sucesso!', description: 'Colaborador cadastrado com sucesso.' });
        setFormData({ name: '', role: '', department: '', vacationBalance: 30 });
        setIsDialogOpen(false);
    };

    const handleDelete = () => {
        if (deleteId) {
            deleteEmployee(deleteId);
            toast({ title: 'Colaborador removido.' });
            setDeleteId(null);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                    {employees.length} colaborador(es) cadastrado(s)
                </p>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="gap-2">
                            <Plus className="h-4 w-4" />
                            Novo Colaborador
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle className="font-display">Cadastrar Colaborador</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label>Nome Completo *</Label>
                                <Input
                                    value={formData.name}
                                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    placeholder="Digite o nome"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Cargo *</Label>
                                <Select value={formData.role} onValueChange={(v) => setFormData(prev => ({ ...prev, role: v }))}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione o cargo" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {roles.map((role) => (
                                            <SelectItem key={role} value={role}>{role}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Departamento *</Label>
                                <Select value={formData.department} onValueChange={(v) => setFormData(prev => ({ ...prev, department: v }))}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione o departamento" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {departments.map((dept) => (
                                            <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Saldo de Férias (dias)</Label>
                                <Input
                                    type="number"
                                    value={formData.vacationBalance}
                                    onChange={(e) => setFormData(prev => ({ ...prev, vacationBalance: parseInt(e.target.value) || 0 }))}
                                />
                            </div>
                            <Button type="submit" className="w-full">Cadastrar</Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="bg-card rounded-2xl border border-border overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nome</TableHead>
                            <TableHead>Cargo</TableHead>
                            <TableHead>Departamento</TableHead>
                            <TableHead>Saldo Férias</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="w-12"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {employees.map((employee) => (
                            <TableRow key={employee.id}>
                                <TableCell className="font-medium">{employee.name}</TableCell>
                                <TableCell>{employee.role}</TableCell>
                                <TableCell>{employee.department}</TableCell>
                                <TableCell>{employee.vacationBalance} dias</TableCell>
                                <TableCell>
                                    <span className={`px-2 py-1 rounded-full text-xs ${employee.status === 'ATIVO'
                                        ? 'bg-status-active/10 text-status-active'
                                        : 'bg-status-ended/10 text-status-ended'
                                        }`}>
                                        {employee.status === 'ATIVO' ? 'Ativo' : 'Inativo'}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-destructive hover:text-destructive"
                                        onClick={() => setDeleteId(employee.id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <ConfirmDeleteDialog
                open={!!deleteId}
                onOpenChange={(open) => !open && setDeleteId(null)}
                onConfirm={handleDelete}
                title="Excluir Colaborador"
                description="Tem certeza que deseja remover este colaborador? Todas os registros de faltas e férias associados serão perdidos."
            />
        </div>
    );
}

function HolidaysTab() {
    const { holidays, addHoliday, deleteHoliday } = useData();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [formData, setFormData] = useState({
        date: '',
        name: '',
        type: 'NACIONAL',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.date || !formData.name) {
            toast({ title: 'Erro', description: 'Preencha todos os campos.', variant: 'destructive' });
            return;
        }
        addHoliday(formData);
        toast({ title: 'Sucesso!', description: 'Feriado cadastrado.' });
        setFormData({ date: '', name: '', type: 'NACIONAL' });
        setIsDialogOpen(false);
    };

    const handleDelete = () => {
        if (deleteId) {
            deleteHoliday(deleteId);
            toast({ title: 'Feriado removido.' });
            setDeleteId(null);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                    {holidays.length} feriado(s) cadastrado(s)
                </p>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="gap-2">
                            <Plus className="h-4 w-4" />
                            Novo Feriado
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle className="font-display">Cadastrar Feriado</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label>Data *</Label>
                                <Input
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Nome *</Label>
                                <Input
                                    value={formData.name}
                                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    placeholder="Ex: Natal"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Tipo</Label>
                                <Select value={formData.type} onValueChange={(v) => setFormData(prev => ({ ...prev, type: v }))}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="NACIONAL">Nacional</SelectItem>
                                        <SelectItem value="ESTADUAL">Estadual</SelectItem>
                                        <SelectItem value="MUNICIPAL">Municipal</SelectItem>
                                        <SelectItem value="PONTO_FACULTATIVO">Ponto Facultativo</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button type="submit" className="w-full">Cadastrar</Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="bg-card rounded-2xl border border-border overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Data</TableHead>
                            <TableHead>Nome</TableHead>
                            <TableHead>Tipo</TableHead>
                            <TableHead className="w-12"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {holidays.sort((a, b) => a.date.localeCompare(b.date)).map((holiday) => (
                            <TableRow key={holiday.id}>
                                <TableCell>{formatDateBR(holiday.date)}</TableCell>
                                <TableCell className="font-medium">{holiday.name}</TableCell>
                                <TableCell>
                                    <span className="px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">
                                        {holiday.type.replace('_', ' ')}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-destructive hover:text-destructive"
                                        onClick={() => setDeleteId(holiday.id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <ConfirmDeleteDialog
                open={!!deleteId}
                onOpenChange={(open) => !open && setDeleteId(null)}
                onConfirm={handleDelete}
                title="Excluir Feriado"
                description="Tem certeza que deseja excluir este feriado?"
            />
        </div>
    );
}

function EventsTab() {
    const { companyEvents, addCompanyEvent, deleteCompanyEvent, employees } = useData();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [formData, setFormData] = useState({
        date: '',
        name: '',
        type: 'REUNIAO',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.date || !formData.name) {
            toast({ title: 'Erro', description: 'Preencha todos os campos.', variant: 'destructive' });
            return;
        }
        addCompanyEvent(formData);
        toast({ title: 'Sucesso!', description: 'Evento cadastrado.' });
        setFormData({ date: '', name: '', type: 'REUNIAO' });
        setIsDialogOpen(false);
    };

    const handleDelete = () => {
        if (deleteId) {
            deleteCompanyEvent(deleteId);
            toast({ title: 'Evento removido.' });
            setDeleteId(null);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                    {companyEvents.length} evento(s) cadastrado(s)
                </p>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="gap-2">
                            <Plus className="h-4 w-4" />
                            Novo Evento
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle className="font-display">Cadastrar Evento</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label>Data *</Label>
                                <Input
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Nome *</Label>
                                <Input
                                    value={formData.name}
                                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    placeholder="Ex: Reunião de Planejamento"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Tipo</Label>
                                <Select value={formData.type} onValueChange={(v) => setFormData(prev => ({ ...prev, type: v }))}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="REUNIAO">Reunião</SelectItem>
                                        <SelectItem value="TREINAMENTO">Treinamento</SelectItem>
                                        <SelectItem value="EVENTO">Evento</SelectItem>
                                        <SelectItem value="OUTRO">Outro</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Participantes (Segure Ctrl para selecionar múltiplos)</Label>
                                <select
                                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    multiple
                                    value={formData.participants || []}
                                    onChange={(e) => {
                                        const selected = Array.from(e.target.selectedOptions, option => option.value);
                                        setFormData(prev => ({ ...prev, participants: selected }));
                                    }}
                                    style={{ height: '120px' }}
                                >
                                    {employees.filter(e => e.status === 'ATIVO').map(emp => (
                                        <option key={emp.id} value={emp.id}>
                                            {emp.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <Button type="submit" className="w-full">Cadastrar</Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="bg-card rounded-2xl border border-border overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Data</TableHead>
                            <TableHead>Nome</TableHead>
                            <TableHead>Tipo</TableHead>
                            <TableHead className="w-12"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {companyEvents.sort((a, b) => a.date.localeCompare(b.date)).map((event) => (
                            <TableRow key={event.id}>
                                <TableCell>{formatDateBR(event.date)}</TableCell>
                                <TableCell className="font-medium">
                                    {event.name}
                                    {event.participants?.length > 0 && (
                                        <span className="ml-2 text-xs text-muted-foreground">({event.participants.length} partes)</span>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <span className="px-2 py-1 rounded-full text-xs bg-leave-study/10 text-leave-study">
                                        {event.type}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-destructive hover:text-destructive"
                                        onClick={() => setDeleteId(event.id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <ConfirmDeleteDialog
                open={!!deleteId}
                onOpenChange={(open) => !open && setDeleteId(null)}
                onConfirm={handleDelete}
                title="Excluir Evento"
                description="Tem certeza que deseja excluir este evento?"
            />
        </div>
    );
}
