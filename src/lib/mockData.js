// Função auxiliar para gerar datas dinâmicas e evitar dados "velhos"
const today = new Date();
const currentYear = today.getFullYear();

export const employees = [
    {
        id: '1',
        name: 'Plinio Marcos De Abreu Rodrigues',
        role: 'ANALISTA',
        department: 'Jurídico Trabalhista',
        status: 'ATIVO',
        vacationBalance: 30,
        acquisitionPeriodStart: `${currentYear}-01-01`,
        acquisitionPeriodEnd: `${currentYear}-12-31`,
        grantPeriodStart: `${currentYear + 1}-01-01`,
        grantPeriodEnd: `${currentYear + 2}-01-01`,
    },
    {
        id: '2',
        name: 'Gustavo Henaut',
        role: 'GERENTE DE DIVISAO',
        department: 'Jurídico Trabalhista',
        status: 'ATIVO',
        vacationBalance: 20,
        acquisitionPeriodStart: `${currentYear}-06-01`,
        acquisitionPeriodEnd: `${currentYear + 1}-05-31`,
        grantPeriodStart: `${currentYear + 1}-06-01`,
        grantPeriodEnd: `${currentYear + 2}-06-01`,
    },
    {
        id: '3',
        name: 'Keilane de Oliveira Pinheiro',
        role: 'ASSESSOR MASTER',
        department: 'Jurídico Trabalhista',
        status: 'ATIVO',
        vacationBalance: 15,
        acquisitionPeriodStart: `${currentYear}-03-15`,
        acquisitionPeriodEnd: `${currentYear + 1}-03-14`,
        grantPeriodStart: `${currentYear + 1}-03-15`,
        grantPeriodEnd: `${currentYear + 2}-03-15`,
    },
    {
        id: '4',
        name: 'Drielly Alves de Castro',
        role: 'ASSESSOR SENIOR',
        department: 'Jurídico Trabalhista',
        status: 'ATIVO',
        vacationBalance: 30,
        acquisitionPeriodStart: `${currentYear}-01-10`,
        acquisitionPeriodEnd: `${currentYear + 1}-01-09`,
        grantPeriodStart: `${currentYear + 1}-01-10`,
        grantPeriodEnd: `${currentYear + 2}-01-10`,
    },
    {
        id: '5',
        name: 'Elton Carlos Ribeiro da Silva',
        role: 'ASSESSOR SENIOR',
        department: 'Jurídico Trabalhista',
        status: 'ATIVO',
        vacationBalance: 10,
        acquisitionPeriodStart: `${currentYear}-09-01`,
        acquisitionPeriodEnd: `${currentYear + 1}-08-31`,
        grantPeriodStart: `${currentYear + 1}-09-01`,
        grantPeriodEnd: `${currentYear + 2}-09-01`,
    },
    {
        id: '6',
        name: 'Gabriela Fernanda dos Santos C...',
        role: 'ASSESSOR PLENO',
        department: 'Jurídico Trabalhista',
        status: 'ATIVO',
        vacationBalance: 30,
        acquisitionPeriodStart: `${currentYear}-02-20`,
        acquisitionPeriodEnd: `${currentYear + 1}-02-19`,
        grantPeriodStart: `${currentYear + 1}-02-20`,
        grantPeriodEnd: `${currentYear + 2}-02-20`,
    },
    {
        id: '7',
        name: 'Raphaella Medeiros D Abadia Sa...',
        role: 'PRESTADOR DE SERVICO',
        department: 'Jurídico Trabalhista',
        status: 'ATIVO',
        vacationBalance: 0,
        acquisitionPeriodStart: `${currentYear}-01-01`,
        acquisitionPeriodEnd: `${currentYear}-12-31`,
        grantPeriodStart: `${currentYear}-01-01`,
        grantPeriodEnd: `${currentYear}-12-31`,
    },
    {
        id: '8',
        name: 'Douglas De Sousa Oliveira Saraiva',
        role: 'ANALISTA', // Assumindo cargo similar
        department: 'Jurídico Trabalhista',
        status: 'ATIVO',
        vacationBalance: 30,
        acquisitionPeriodStart: `${currentYear}-05-01`,
        acquisitionPeriodEnd: `${currentYear + 1}-04-30`,
        grantPeriodStart: `${currentYear + 1}-05-01`,
        grantPeriodEnd: `${currentYear + 2}-05-01`,
    },
];

export const leaves = [
    // Dados de exemplo mantidos mas vinculados a IDs novos se necessário
    // Por enquanto limpo para startar limpo ou mantenho fictício
    {
        id: '1',
        employeeId: '1', // Plinio
        employeeName: 'Plinio Marcos De Abreu Rodrigues',
        employeeRole: 'ANALISTA',
        type: 'FERIAS',
        startDate: `${currentYear + 1}-01-15`,
        endDate: `${currentYear + 1}-01-29`,
        daysOff: 15,
        workDaysOff: 11,
        efficiency: 100,
        status: 'PLANEJADO',
    }
];

export const holidays = [
    { id: '1', date: `${currentYear + 1}-01-01`, name: 'Ano Novo', type: 'NACIONAL' },
    { id: '2', date: `${currentYear + 1}-02-16`, name: 'Carnaval', type: 'NACIONAL' },
    { id: '3', date: `${currentYear + 1}-02-17`, name: 'Carnaval', type: 'NACIONAL' },
    { id: '4', date: `${currentYear + 1}-02-18`, name: 'Quarta-feira de Cinzas', type: 'PONTO_FACULTATIVO' },
    { id: '5', date: `${currentYear + 1}-04-03`, name: 'Sexta-feira Santa', type: 'NACIONAL' },
    { id: '6', date: `${currentYear + 1}-04-21`, name: 'Tiradentes', type: 'NACIONAL' },
    { id: '7', date: `${currentYear + 1}-05-01`, name: 'Dia do Trabalho', type: 'NACIONAL' },
    { id: '8', date: `${currentYear + 1}-06-04`, name: 'Corpus Christi', type: 'NACIONAL' },
    { id: '9', date: `${currentYear + 1}-09-07`, name: 'Independência do Brasil', type: 'NACIONAL' },
    { id: '10', date: `${currentYear + 1}-10-12`, name: 'Nossa Senhora Aparecida', type: 'NACIONAL' },
    { id: '11', date: `${currentYear + 1}-11-02`, name: 'Finados', type: 'NACIONAL' },
    { id: '12', date: `${currentYear + 1}-11-15`, name: 'Proclamação da República', type: 'NACIONAL' },
    { id: '13', date: `${currentYear + 1}-11-20`, name: 'Consciência Negra', type: 'NACIONAL' },
    { id: '14', date: `${currentYear + 1}-12-25`, name: 'Natal', type: 'NACIONAL' },
];

export const companyEvents = [
    { id: '1', date: '2026-01-15', name: 'Reunião de Planejamento Anual', type: 'REUNIAO' },
    { id: '2', date: '2026-02-10', name: 'Treinamento de Segurança', type: 'TREINAMENTO' },
    { id: '3', date: '2026-03-20', name: 'Confraternização de Aniversário', type: 'EVENTO' },
];

export const departments = [
    'Jurídico Trabalhista',
    'Administrativo',
    'Operações',
];

export const roles = [
    'GERENTE DE DIVISAO',
    'ASSESSOR MASTER',
    'ASSESSOR SENIOR',
    'ASSESSOR PLENO',
    'ANALISTA',
    'PRESTADOR DE SERVICO',
];

export const leaveTypes = [
    'FERIAS',
    'LICENCA_MEDICA',
    'LICENCA_MATERNIDADE',
    'LICENCA_PATERNIDADE',
    'CASAMENTO',
    'FALECIMENTO',
    'ESTUDO',
    'DOACAO_SANGUE',
    'COMPARECIMENTO_JUIZO',
    'ALISTAMENTO_ELEITORAL',
    'ABONO',
    'ACIDENTE_TRABALHO',
    'DISPENSA',
    'FOLGA',
    'OUTRO',
];
