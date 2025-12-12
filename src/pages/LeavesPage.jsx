// Update import to include trash icon if needed
import { useState } from 'react';
import { Plus, List, Grid, Download } from 'lucide-react';
import { formatDateBR } from '@/lib/dateUtils';
import { PermissionGate } from '@/components/PermissionGate';
import { leaveTypeLabels } from '@/lib/types';
import { LeaveForm } from '@/components/leaves/LeaveForm';
import { LeaveCard } from '@/components/leaves/LeaveCard';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useData } from '@/context/DataContext';

export default function LeavesPage() {
    const { leaves, getActiveLeaves, getPlannedLeaves, deleteLeave } = useData();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [viewMode, setViewMode] = useState('grid');

    // ... rest of component until return ...
    const activeLeaves = getActiveLeaves();
    const plannedLeaves = getPlannedLeaves();
    const endedLeaves = leaves.filter(l => l.status === 'ENCERRADO');

    return (
        <div className="space-y-6 animate-fade-in">
            {/* ... header ... */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-display font-bold text-foreground">
                        Afastamentos
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Gerencie todos os afastamentos dos colaboradores
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        className="gap-2"
                        onClick={() => {
                            const header = "RELATÓRIO DE AFASTAMENTOS - BBTS\n--------------------------------\n\n";
                            const content = leaves.map(l => {
                                const type = leaveTypeLabels[l.type] || l.type;
                                const status = l.status === 'ATIVO' ? '[EM ANDAMENTO]' : l.status === 'PLANEJADO' ? '[FUTURO]' : '[ENCERRADO]';
                                return `${status.padEnd(15)} ${l.employeeName} - ${type}\nPeríodo: ${formatDateBR(l.startDate)} a ${formatDateBR(l.endDate)} (${l.daysOff} dias)\n`;
                            }).join('\n--------------------------------\n');

                            const blob = new Blob([header + content], { type: 'text/plain;charset=utf-8' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `afastamentos_${new Date().toISOString().split('T')[0]}.txt`;
                            a.click();
                            URL.revokeObjectURL(url);
                        }}
                    >
                        <Download className="h-4 w-4" />
                        Exportar .TXT
                    </Button>

                    <div className="flex items-center border border-border rounded-lg p-1">
                        <Button
                            variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setViewMode('grid')}
                        >
                            <Grid className="h-4 w-4" />
                        </Button>
                        <Button
                            variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setViewMode('list')}
                        >
                            <List className="h-4 w-4" />
                        </Button>
                    </div>

                    <PermissionGate roles={['admin', 'superadmin']}>
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button className="gap-2">
                                    <Plus className="h-4 w-4" />
                                    Novo Afastamento
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                    <DialogTitle className="font-display">Registrar Novo Afastamento</DialogTitle>
                                </DialogHeader>
                                <LeaveForm onSuccess={() => setIsDialogOpen(false)} />
                            </DialogContent>
                        </Dialog>
                    </PermissionGate>
                </div>
            </div>

            <Tabs defaultValue="active" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="active">
                        Ativos ({activeLeaves.length})
                    </TabsTrigger>
                    <TabsTrigger value="planned">
                        Planejados ({plannedLeaves.length})
                    </TabsTrigger>
                    <TabsTrigger value="ended">
                        Encerrados ({endedLeaves.length})
                    </TabsTrigger>
                    <TabsTrigger value="all">
                        Todos ({leaves.length})
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="active" className="space-y-4">
                    {activeLeaves.length === 0 ? (
                        <EmptyState message="Nenhum afastamento ativo no momento." />
                    ) : (
                        <LeaveGrid leaves={activeLeaves} viewMode={viewMode} onDelete={deleteLeave} />
                    )}
                </TabsContent>

                <TabsContent value="planned" className="space-y-4">
                    {plannedLeaves.length === 0 ? (
                        <EmptyState message="Nenhum afastamento planejado." />
                    ) : (
                        <LeaveGrid leaves={plannedLeaves} viewMode={viewMode} onDelete={deleteLeave} />
                    )}
                </TabsContent>

                <TabsContent value="ended" className="space-y-4">
                    {endedLeaves.length === 0 ? (
                        <EmptyState message="Nenhum afastamento encerrado." />
                    ) : (
                        <LeaveGrid leaves={endedLeaves} viewMode={viewMode} onDelete={deleteLeave} />
                    )}
                </TabsContent>

                <TabsContent value="all" className="space-y-4">
                    {leaves.length === 0 ? (
                        <EmptyState message="Nenhum afastamento registrado." />
                    ) : (
                        <LeaveGrid leaves={leaves} viewMode={viewMode} onDelete={deleteLeave} />
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}

function LeaveGrid({ leaves, viewMode, onDelete }) {
    return (
        <div className={viewMode === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
            : 'space-y-3'
        }>
            {leaves.map((leave) => (
                <LeaveCard key={leave.id} leave={leave} onDelete={onDelete} />
            ))}
        </div>
    );
}

function EmptyState({ message }) {
    return (
        <div className="bg-card rounded-2xl border border-border p-12 text-center">
            <p className="text-muted-foreground">{message}</p>
        </div>
    );
}
