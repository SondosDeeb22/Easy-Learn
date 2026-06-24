// ====================================================================
//? import
// ====================================================================
import { GPARecord } from "../../modules/grades/interfaces/gpa-records.interface";

// ====================================================================
export const sampleGPARecords: GPARecord[] = [
    // Sara Latifi (20261234)
    {
        id: '30000001-0000-0000-0000-000000000001',
        studentId: '20261234',
        semesterId: '20000007',
        gpa: 3.75,
        qualityPoints: 56.25,
        totalCredits: 15,
    },
    // Ahmad Dwikat (20261155)
    {
        id: '30000002-0000-0000-0000-000000000002',
        studentId: '20261155',
        semesterId: '20000007',
        gpa: 3.40,
        qualityPoints: 51.00,
        totalCredits: 15,
    },
    // Tiana Brown (20261144)
    {
        id: '30000003-0000-0000-0000-000000000003',
        studentId: '20261144',
        semesterId: '20000007',
        gpa: 2.84,
        qualityPoints: 34.08,
        totalCredits: 12,
    },
    // Lina (20261111)
    {
        id: '30000004-0000-0000-0000-000000000004',
        studentId: '20261111',
        semesterId: '20000007',
        gpa: 4.00,
        qualityPoints: 70,
        totalCredits: 35,
    },
    {
        id: '30000005-0000-0000-0000-000000000005',
        studentId: '20261111',
        semesterId: '20000006',
        gpa: 2.5,
        qualityPoints: 60,
        totalCredits: 10,
    },
    {
        id: '30000005-0000-0000-0000-000000000006',
        studentId: '20261111',
        semesterId: '20000005',
        gpa: 1.5,
        qualityPoints: 30,
        totalCredits: 18,
    },
];
