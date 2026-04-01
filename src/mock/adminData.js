export const platformHealthData = [
    { month: 'Jan', value: 48 },
    { month: 'Feb', value: 55 },
    { month: 'Mar', value: 62 },
    { month: 'Apr', value: 60 },
    { month: 'May', value: 65 },
    { month: 'Jun', value: 82 },
];

export const systemAlerts = [
    { type: 'error', message: 'Supply chain delay in Phase 4 - Steel delivery late.' },
    { type: 'success', message: 'All Franchisee training nodes reporting 100% uptime.' },
];

export const housingProgress = [
    { month: 'Jan', completed: 45, inProgress: 30, planned: 20 },
    { month: 'Feb', completed: 55, inProgress: 25, planned: 25 },
    { month: 'Mar', completed: 60, inProgress: 35, planned: 20 },
    { month: 'Apr', completed: 60, inProgress: 40, planned: 10 },
    { month: 'May', completed: 75, inProgress: 35, planned: 15 },
    { month: 'Jun', completed: 85, inProgress: 40, planned: 15 },
];

export const regionalDistribution = [
    { city: 'Nairobi', units: 1240, status: 'ontrack', color: 'green' },
    { city: 'Mombasa', units: 850, status: 'delayed', color: 'yellow' },
    { city: 'Kisumu', units: 620, status: 'ontrack', color: 'green' },
    { city: 'Nakuru', units: 440, status: 'planning', color: 'blue' },
];

export const supplyChainData = [
    { material: 'Steel', rfq: 480, delivery: 420, target: 550 },
    { material: 'Cement', rfq: 760, delivery: 740, target: 980 },
    { material: 'Glass', rfq: 280, delivery: 260, target: 380 },
    { material: 'Timber', rfq: 500, delivery: 490, target: 510 },
];

export const vendors = [
    { name: 'Global Steel Co.', category: 'Structural', contract: '#CON-101', status: 'active', value: '$1.2M' },
    { name: 'EcoCement Ltd', category: 'Foundation', contract: '#CON-102', status: 'review', value: '$840k' },
    { name: 'SafeGlass Mfg', category: 'Fenestration', contract: '#CON-103', status: 'active', value: '$450k' },
    { name: 'TimberTech Solutions', category: 'Finishings', contract: '#CON-104', status: 'active', value: '$320k' },
    { name: 'PowerGrid Connect', category: 'Infrastructure', contract: '#CON-105', status: 'pending', value: '$2.1M' },
];

export const inventoryAlerts = [
    { item: 'Window Frames (M-Type)', percent: 20 },
    { item: 'Roofing Sheets (Galv)', percent: 18 },
];

export const academyStats = [
    { label: 'Total Trainees', value: '1,420', icon: 'Users', color: 'blue' },
    { label: 'Certified Teams', value: '185', icon: 'CheckCircle', color: 'green' },
    { label: 'Active Courses', value: '12', icon: 'Briefcase', color: 'purple' },
    { label: 'Next Session', value: 'Jan 28', icon: 'GraduationCap', color: 'orange' },
];

export const franchisePerformance = [
    { region: 'East Africa', status: 'Leading', delta: '+15%' },
    { region: 'West Africa', status: 'Emerging', delta: '+8%' },
    { region: 'South Asia', status: 'High Growth', delta: '+22%' },
];

export const climateData = [
    { year: '2022', value: 100 },
    { year: '2023', value: 250 },
    { year: '2024', value: 420 },
    { year: '2025', value: 680 },
    { year: '2026', value: 980 },
];

export const carbonCredits = [
    { company: 'ClimateCorp', date: 'Jan 15, 2026', tx: 'TX-492', mt: '1,240 MT', status: 'verified' },
    { company: 'EcoInvest', date: 'Dec 22, 2025', tx: 'TX-491', mt: '890 MT', status: 'verified' },
    { company: 'Global Fund', date: 'Nov 10, 2025', tx: 'TX-490', mt: '2,100 MT', status: 'pending' },
    { company: 'Direct Offset', date: 'Oct 05, 2025', tx: 'TX-489', mt: '540 MT', status: 'verified' },
];

export const adminOverviewStats = [
    { label: 'Total Projects', value: '42', icon: 'ClipboardList', delta: '+3' },
    { label: 'Platform Revenue', value: '$24.5M', icon: 'BarChart2', delta: '+12%' },
    { label: 'Global Users', value: '8.2k', icon: 'Users', delta: '+5%' },
    { label: 'Active Hubs', value: '4', icon: 'MapPin', delta: null }
];

export const adminProcurementStats = {
    inStockRate: '94.2%',
    inStockDelta: '+2.4%',
    inStockCompare: 'vs last month'
};

export const adminAcademyStats = {
    standardModel: 'Standard Model A',
    premiumModel: 'Model M - 2 Bed'
};

export const adminClimateStats = {
    sustainabilityScore: '82%'
};
