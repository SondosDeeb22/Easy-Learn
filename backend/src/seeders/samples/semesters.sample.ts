// ====================================================================
//? import
// ====================================================================

import { Semester } from "../../modules/semesters/interfaces/semesters.interface";

// ====================================================================
export const sampleSemesters: Semester[] = [
    {
        id: '20000001',
        title: 'Fall 2023-2024',
        startDate: new Date('2023-09-01'),
        endDate: new Date('2024-01-15'),
        maxCredits: 18,
    },
    {
        id: '20000002',
        title: 'Spring 2023-2024',
        startDate: new Date('2024-02-01'),
        endDate: new Date('2024-06-30'),
        maxCredits: 18,
    },
    {
        id: '20000003',
        title: 'Summer 2024',
        startDate: new Date('2024-07-01'),
        endDate: new Date('2024-08-31'),
        maxCredits: 9,
    },
    {
        id: '20000004',
        title: 'Fall 2024-2025',
        startDate: new Date('2024-09-01'),
        endDate: new Date('2025-01-15'),
        maxCredits: 18,
    },
    {
        id: '20000005',
        title: 'Spring 2024-2025',
        startDate: new Date('2025-02-01'),
        endDate: new Date('2025-06-30'),
        maxCredits: 18,
    },
    {
        id: '20000006',
        title: 'Summer 2025',
        startDate: new Date('2025-07-01'),
        endDate: new Date('2025-08-31'),
        maxCredits: 9,
    },
    {
        id: '20000007',
        title: 'Fall 2025-2026',
        startDate: new Date('2025-09-01'),
        endDate: new Date('2026-01-30'),
        maxCredits: 18,
    },
    {
        id: '20000008',
        title: 'Spring 2025-2026',
        startDate: new Date('2026-02-01'),
        endDate: new Date('2026-07-15T23:59:59.000Z'),
        maxCredits: 18,
    },
    {
        id: '20000009',
        title: 'Summer 2026',
        startDate: new Date('2026-07-01'),
        endDate: new Date('2026-08-31'),
        maxCredits: 9,
    },
    {
        id: '20000010',
        title: 'Fall 2026-2027',
        startDate: new Date('2026-09-01'),
        endDate: new Date('2027-01-15'),
        maxCredits: 18,
    },
];