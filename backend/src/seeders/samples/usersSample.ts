// ====================================================================
//? import
// ====================================================================

import { UserInterface } from "src/modules/users/interfaces/user.interface";


import { Roles } from "src/modules/users/enums/roles.enum";
import { Gender } from "src/modules/users/enums/gender.enum";
// ====================================================================
export const sampleUsers: UserInterface[] = [
    {
        id: '20261234',
        name: 'Sara',
        role: Roles.STUDENT,
        birthDate: new Date('2004-01-01'),
        email: 'sara@gmail.com',
        gender: Gender.FEMALE,
        password: '$2b$08$aOc.CwK/vqj/R/QHoaWxJ.KkIry58pOShrI8T6vaKX0wqhQOG.V/C',
        currentSemesterCredit: 0,
        totalCredit: 0,
    },
    {
        id: '20261155',
        name: 'Ahmad',
        role: Roles.STUDENT,
        birthDate: new Date('2003-05-12'),
        email: 'ahmad@gmail.com',
        gender: Gender.MALE,
        password: '$2b$08$aOc.CwK/vqj/R/QHoaWxJ.KkIry58pOShrI8T6vaKX0wqhQOG.V/C',
        currentSemesterCredit: 12,
        totalCredit: 60,
    },
    {
        id: '20261144',
        name: 'Tiana',
        role: Roles.STUDENT,
        birthDate: new Date('2004-08-20'),
        email: 'tiana@gmail.com',
        gender: Gender.FEMALE,
        password: '$2b$08$aOc.CwK/vqj/R/QHoaWxJ.KkIry58pOShrI8T6vaKX0wqhQOG.V/C',
        currentSemesterCredit: 15,
        totalCredit: 75,
    },
    {
        id: '20261133',
        name: 'Omar',
        role: Roles.STUDENT,
        birthDate: new Date('2002-11-15'),
        email: 'omar@gmail.com',
        gender: Gender.MALE,
        password: '$2b$08$aOc.CwK/vqj/R/QHoaWxJ.KkIry58pOShrI8T6vaKX0wqhQOG.V/C',
        currentSemesterCredit: 18,
        totalCredit: 90,
    },
    {
        id: '20261122',
        name: 'Maya',
        role: Roles.STUDENT,
        birthDate: new Date('2003-03-30'),
        email: 'maya@gmail.com',
        gender: Gender.FEMALE,
        password: '$2b$08$aOc.CwK/vqj/R/QHoaWxJ.KkIry58pOShrI8T6vaKX0wqhQOG.V/C',
        currentSemesterCredit: 9,
        totalCredit: 45,
    },
    {
        id: '10001234',
        name: 'Admin',
        role: Roles.ADMIN,
        birthDate: new Date('1990-01-01'),
        email: 'admin@gmail.com',
        gender: Gender.FEMALE,
        password: '$2b$08$aOc.CwK/vqj/R/QHoaWxJ.KkIry58pOShrI8T6vaKX0wqhQOG.V/C',
        currentSemesterCredit: 0,
        totalCredit: 0,
    },
];