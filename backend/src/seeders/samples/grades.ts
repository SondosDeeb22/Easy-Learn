
import { Grade } from "../../modules/grades/interfaces/grades.interface";

export const sampleGrades: Grade[] = [
    { letterGrade: 'AA', coefficient: 4.0, minScore: 90, maxScore: 100 },
    { letterGrade: 'BA', coefficient: 3.5, minScore: 85, maxScore: 89 },
    { letterGrade: 'BB', coefficient: 3.0, minScore: 80, maxScore: 84 },
    { letterGrade: 'CB', coefficient: 2.5, minScore: 75, maxScore: 79 },
    { letterGrade: 'CC', coefficient: 2.0, minScore: 70, maxScore: 74 },
    { letterGrade: 'DC', coefficient: 1.5, minScore: 60, maxScore: 69 },
    { letterGrade: 'DD', coefficient: 1.0, minScore: 50, maxScore: 59 },
    { letterGrade: 'FF', coefficient: 0.0, minScore: 0, maxScore: 49 },
];