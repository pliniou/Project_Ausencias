import { useState, useEffect } from 'react';
import { Plus, Trash2, Users, Calendar, Building, Pencil, Palette } from 'lucide-react';
import { PermissionGate } from '@/components/PermissionGate';
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
        <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-display font-bold text-foreground">
                        Cadastros
                    </h1>
                    <p className="text-xs text-muted-foreground">
                        Gerencie colaboradores, feriados e eventos
                    </p>
                </div>
            </div>

            <Tabs defaultValue="employees" className="space-y-4">
                <TabsList className="bg-muted/50 p-1 h-9">
                    <TabsTrigger value="employees" className="gap-2 text-xs h-7 data-[state=active]:bg-background">
                        <Users className="h-3 w-3" />
                        Colaboradores
                    </TabsTrigger>
                    <TabsTrigger value="holidays" className="gap-2 text-xs h-7 data-[state=active]:bg-background">
                        <Calendar className="h-3 w-3" />
                        Feriados
                    </TabsTrigger>
                    <TabsTrigger value="events" className="gap-2 text-xs h-7 data-[state=active]:bg-background">
                        <Building className="h-3 w-3" />
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
    const { employees, addEmployee, updateEmployee, deleteEmployee } = useData();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingSearch, setEditingSearch] = useState(null); // ID if editing
    const [deleteId, setDeleteId] = useState(null);

    // Initial State
    const initialFormState = {
        name: '',
        role: '',
        department: '',
        vacationBalance: 30,
        color: '#003399', // Default Indigo
    };

    const [formData, setFormData] = useState(initialFormState);

    const openEdit = (employee) => {
        setFormData({
            name: employee.name,
            role: employee.role,
            department: employee.department,
            vacationBalance: employee.vacationBalance,
            color: employee.color || '#003399',
        });
        setEditingSearch(employee.id);
        setIsDialogOpen(true);
    };

    const handleOpenChange = (open) => {
        setIsDialogOpen(open);
        if (!open) {
            setFormData(initialFormState);
            setEditingSearch(null);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.role || !formData.department) {
            toast({ title: 'Erro', description: 'Preencha todos os campos obrigatórios.', variant: 'destructive' });
            return;
        }

        if (editingSearch) {
            updateEmployee(editingSearch, formData);
            toast({ title: 'Atualizado!', description: 'Dados do colaborador atualizados.' });
        } else {
            addEmployee({
                ...formData,
                status: 'ATIVO',
            });
            toast({ title: 'Sucesso!', description: 'Colaborador cadastrado.' });
        }

        handleOpenChange(false);
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
                <p className="text-xs text-muted-foreground">
                    {employees.length} cadastrados
                </p>
                <PermissionGate roles={['admin', 'superadmin']}>
                    <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
                        <DialogTrigger asChild>
                            <Button size="sm" className="gap-2 h-8 text-xs">
                                <Plus className="h-3 w-3" />
                                Novo Colaborador
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle className="font-display">
                                    {editingSearch ? 'Editar Colaborador' : 'Cadastrar Colaborador'}
                                </DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-3">
                                <div className="space-y-1">
                                    <Label className="text-xs">Nome Completo *</Label>
                                    <Input
                                        value={formData.name}
                                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                        placeholder="Digite o nome"
                                        className="h-8 text-sm"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <Label className="text-xs">Cargo *</Label>
                                        <Select value={formData.role} onValueChange={(v) => setFormData(prev => ({ ...prev, role: v }))}>
                                            <SelectTrigger className="h-8 text-sm">
                                                <SelectValue placeholder="Selecione" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {roles.map((role) => (
                                                    <SelectItem key={role} value={role}>{role}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs">Departamento *</Label>
                                        <Select value={formData.department} onValueChange={(v) => setFormData(prev => ({ ...prev, department: v }))}>
                                            <SelectTrigger className="h-8 text-sm">
                                                <SelectValue placeholder="Selecione" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {departments.map((dept) => (
                                                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <Label className="text-xs">Saldo Férias</Label>
                                        <Input
                                            type="number"
                                            value={formData.vacationBalance}
                                            onChange={(e) => setFormData(prev => ({ ...prev, vacationBalance: parseInt(e.target.value) || 0 }))}
                                            className="h-8 text-sm"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs">Cor Personalizada</Label>
                                        <div className="flex items-center gap-2">
                                            <Input
                                                type="color"
                                                value={formData.color}
                                                onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                                                className="h-8 w-12 p-1"
                                            />
                                            <span className="text-xs text-muted-foreground">{formData.color}</span>
                                        </div>
                                    </div>
                                </div>
                                <Button type="submit" className="w-full h-8 text-xs">{editingSearch ? 'Salvar Alterações' : 'Cadastrar'}</Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </PermissionGate>
            </div>

            <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
                <Table>
                    <TableHeader className="bg-muted/30">
                        <TableRow className="h-9 hover:bg-transparent">
                            <TableHead className="h-9 text-xs font-semibold py-1">Nome</TableHead>
                            <TableHead className="h-9 text-xs font-semibold py-1">Cargo</TableHead>
                            <TableHead className="h-9 text-xs font-semibold py-1">Dep.</TableHead>
                            <TableHead className="h-9 text-xs font-semibold py-1">Saldo</TableHead>
                            <TableHead className="h-9 text-xs font-semibold py-1">Cor</TableHead>
                            <TableHead className="h-9 text-xs font-semibold py-1">Status</TableHead>
                            <TableHead className="h-9 w-20 py-1"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {employees.map((employee) => (
                            <TableRow key={employee.id} className="h-9 hover:bg-muted/50">
                                <TableCell className="py-1 text-xs font-medium">{employee.name}</TableCell>
                                <TableCell className="py-1 text-xs text-muted-foreground">{employee.role}</TableCell>
                                <TableCell className="py-1 text-xs text-muted-foreground">{employee.department}</TableCell>
                                <TableCell className="py-1 text-xs">{employee.vacationBalance}d</TableCell>
                                <TableCell className="py-1">
                                    <div className="h-3 w-3 rounded-full ring-1 ring-border" style={{ backgroundColor: employee.color || '#003399' }} />
                                </TableCell>
                                <TableCell className="py-1">
                                    <span className={`px-1.5 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider ${employee.status === 'ATIVO'
                                        ? 'bg-emerald-500/10 text-emerald-600'
                                        : 'bg-slate-500/10 text-slate-500'
                                        }`}>
                                        {employee.status}
                                    </span>
                                </TableCell>
                                <TableCell className="py-1">
                                    <PermissionGate roles={['admin', 'superadmin']}>
                                        <div className="flex items-center justify-end gap-1">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6 text-primary hover:text-primary hover:bg-primary/10"
                                                onClick={() => openEdit(employee)}
                                            >
                                                <Pencil className="h-3 w-3" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6 text-destructive hover:text-destructive hover:bg-destructive/10"
                                                onClick={() => setDeleteId(employee.id)}
                                            >
                                                <Trash2 className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    </PermissionGate>
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
                description="Tem certeza? Dados históricos podem ser afetados."
            />
        </div>
    );
}

function HolidaysTab() {
    const { holidays, addHoliday, updateHoliday, deleteHoliday } = useData();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingSearch, setEditingSearch] = useState(null);
    const [deleteId, setDeleteId] = useState(null);

    const initialFormState = {
        date: '',
        name: '',
        type: 'NACIONAL',
    };

    const [formData, setFormData] = useState(initialFormState);

    const openEdit = (holiday) => {
        setFormData({
            date: holiday.date,
            name: holiday.name,
            type: holiday.type,
        });
        setEditingSearch(holiday.id);
        setIsDialogOpen(true);
    };

    const handleOpenChange = (open) => {
        setIsDialogOpen(open);
        if (!open) {
            setFormData(initialFormState);
            setEditingSearch(null);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.date || !formData.name) {
            toast({ title: 'Erro', description: 'Preencha todos os campos.', variant: 'destructive' });
            return;
        }

        if (editingSearch) {
            updateHoliday(editingSearch, formData);
            toast({ title: 'Sucesso!', description: 'Feriado atualizado.' });
        } else {
            addHoliday(formData);
            toast({ title: 'Sucesso!', description: 'Feriado cadastrado.' });
        }
        handleOpenChange(false);
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
                <p className="text-xs text-muted-foreground">{holidays.length} registros</p>
                <PermissionGate roles={['admin', 'superadmin']}>
                    <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
                        <DialogTrigger asChild>
                            <Button size="sm" className="gap-2 h-8 text-xs">
                                <Plus className="h-3 w-3" /> Novo Feriado
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle className="font-display">
                                    {editingSearch ? 'Editar Feriado' : 'Novo Feriado'}
                                </DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-3">
                                <div className="space-y-1">
                                    <Label className="text-xs">Data *</Label>
                                    <Input
                                        type="date"
                                        value={formData.date}
                                        onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                                        className="h-8 text-sm"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs">Nome *</Label>
                                    <Input
                                        value={formData.name}
                                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                        className="h-8 text-sm"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs">Tipo</Label>
                                    <Select value={formData.type} onValueChange={(v) => setFormData(prev => ({ ...prev, type: v }))}>
                                        <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="NACIONAL">Nacional</SelectItem>
                                            <SelectItem value="ESTADUAL">Estadual</SelectItem>
                                            <SelectItem value="MUNICIPAL">Municipal</SelectItem>
                                            <SelectItem value="PONTO_FACULTATIVO">Ponto Facultativo</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Button type="submit" className="w-full h-8 text-xs">{editingSearch ? 'Salvar' : 'Cadastrar'}</Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </PermissionGate>
            </div>

            <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
                <Table>
                    <TableHeader className="bg-muted/30">
                        <TableRow className="h-9">
                            <TableHead className="h-9 text-xs font-semibold py-1">Data</TableHead>
                            <TableHead className="h-9 text-xs font-semibold py-1">Nome</TableHead>
                            <TableHead className="h-9 text-xs font-semibold py-1">Tipo</TableHead>
                            <TableHead className="h-9 w-20 py-1"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {holidays.sort((a, b) => a.date.localeCompare(b.date)).map((holiday) => (
                            <TableRow key={holiday.id} className="h-9 hover:bg-muted/50">
                                <TableCell className="py-1 text-xs">{formatDateBR(holiday.date)}</TableCell>
                                <TableCell className="py-1 text-xs font-medium">{holiday.name}</TableCell>
                                <TableCell className="py-1">
                                    <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-primary/10 text-primary">
                                        {holiday.type.replace('_', ' ')}
                                    </span>
                                </TableCell>
                                <TableCell className="py-1">
                                    <PermissionGate roles={['admin', 'superadmin']}>
                                        <div className="flex items-center justify-end gap-1">
                                            <Button variant="ghost" size="icon" className="h-6 w-6 text-primary hover:bg-primary/10" onClick={() => openEdit(holiday)}>
                                                <Pencil className="h-3 w-3" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive hover:bg-destructive/10" onClick={() => setDeleteId(holiday.id)}>
                                                <Trash2 className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    </PermissionGate>
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
                description="Confirmar exclusão?"
            />
        </div>
    );
}

function EventsTab() {
    const { companyEvents, addCompanyEvent, updateCompanyEvent, deleteCompanyEvent, employees } = useData();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingSearch, setEditingSearch] = useState(null); // ID
    const [deleteId, setDeleteId] = useState(null);

    const initialFormState = {
        date: '',
        name: '',
        type: 'REUNIAO',
        participants: []
    };

    const [formData, setFormData] = useState(initialFormState);

    const openEdit = (event) => {
        setFormData({
            date: event.date,
            name: event.name,
            type: event.type,
            participants: event.participants || []
        });
        setEditingSearch(event.id);
        setIsDialogOpen(true);
    };

    const handleOpenChange = (open) => {
        setIsDialogOpen(open);
        if (!open) {
            setFormData(initialFormState);
            setEditingSearch(null);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.date || !formData.name) {
            toast({ title: 'Erro', description: 'Preencha todos os campos.', variant: 'destructive' });
            return;
        }

        if (editingSearch) {
            updateCompanyEvent(editingSearch, formData);
            toast({ title: 'Sucesso!', description: 'Evento atualizado.' });
        } else {
            addCompanyEvent(formData);
            toast({ title: 'Sucesso!', description: 'Evento cadastrado.' });
        }
        handleOpenChange(false);
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
                <p className="text-xs text-muted-foreground">{companyEvents.length} registros</p>
                <PermissionGate roles={['admin', 'superadmin']}>
                    <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
                        <DialogTrigger asChild>
                            <Button size="sm" className="gap-2 h-8 text-xs">
                                <Plus className="h-3 w-3" /> Novo Evento
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle className="font-display">
                                    {editingSearch ? 'Editar Evento' : 'Novo Evento'}
                                </DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-3">
                                <div className="space-y-1">
                                    <Label className="text-xs">Data *</Label>
                                    <Input type="date" value={formData.date} onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))} className="h-8 text-sm" />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs">Nome *</Label>
                                    <Input value={formData.name} onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))} className="h-8 text-sm" />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs">Tipo</Label>
                                    <Select value={formData.type} onValueChange={(v) => setFormData(prev => ({ ...prev, type: v }))}>
                                        <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="REUNIAO">Reunião</SelectItem>
                                            <SelectItem value="TREINAMENTO">Treinamento</SelectItem>
                                            <SelectItem value="EVENTO">Evento</SelectItem>
                                            <SelectItem value="OUTRO">Outro</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs">Participantes</Label>
                                    <select
                                        className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-xs ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                        multiple
                                        value={formData.participants || []}
                                        onChange={(e) => {
                                            const selected = Array.from(e.target.selectedOptions, option => option.value);
                                            setFormData(prev => ({ ...prev, participants: selected }));
                                        }}
                                        style={{ height: '80px' }}
                                    >
                                        {employees.filter(e => e.status === 'ATIVO').map(emp => (
                                            <option key={emp.id} value={emp.id}>{emp.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <Button type="submit" className="w-full h-8 text-xs">{editingSearch ? 'Salvar' : 'Cadastrar'}</Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </PermissionGate>
            </div>

            <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
                <Table>
                    <TableHeader className="bg-muted/30">
                        <TableRow className="h-9">
                            <TableHead className="h-9 text-xs font-semibold py-1">Data</TableHead>
                            <TableHead className="h-9 text-xs font-semibold py-1">Nome</TableHead>
                            <TableHead className="h-9 text-xs font-semibold py-1">Tipo</TableHead>
                            <TableHead className="h-9 w-20 py-1"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {companyEvents.sort((a, b) => a.date.localeCompare(b.date)).map((event) => (
                            <TableRow key={event.id} className="h-9 hover:bg-muted/50">
                                <TableCell className="py-1 text-xs">{formatDateBR(event.date)}</TableCell>
                                <TableCell className="py-1 text-xs font-medium">
                                    {event.name}
                                    {event.participants?.length > 0 && <span className="ml-1 text-[10px] text-muted-foreground">({event.participants.length})</span>}
                                </TableCell>
                                <TableCell className="py-1">
                                    <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-sky-500/10 text-sky-600">{event.type}</span>
                                </TableCell>
                                <TableCell className="py-1">
                                    <PermissionGate roles={['admin', 'superadmin']}>
                                        <div className="flex items-center justify-end gap-1">
                                            <Button variant="ghost" size="icon" className="h-6 w-6 text-primary hover:bg-primary/10" onClick={() => openEdit(event)}>
                                                <Pencil className="h-3 w-3" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive hover:bg-destructive/10" onClick={() => setDeleteId(event.id)}>
                                                <Trash2 className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    </PermissionGate>
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
                description="Confirmar exclusão?"
            />
        </div>
    );
}
