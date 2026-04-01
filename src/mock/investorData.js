import { regionalDistribution as adminDist } from './adminData';

export const portfolioValue = '$142.8M';
export const yieldValue = '8.4%';
export const riskRating = 'AA+';

export const esgROI = [
    { year: '2022', value: 120 },
    { year: '2023', value: 280 },
    { year: '2024', value: 480 },
    { year: '2025', value: 720 },
    { year: '2026', value: 960 },
];

export const investorRegions = [
    ...adminDist
];

export const roleIntelligence = {
    estYield: '8.4%',
    activeNodes: 24,
    systemHealth: '99.9%',
    userRating: '4.8'
};

export const investorOverviewStats = {
    activePhase: 'Nairobi Phase 4',
    phaseStatus: 'On Schedule'
};
