import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

//models
import { SemestersModel } from '../semesters/semesters.model';

//interface
import { ServiceResult } from '../../common/interfaces/service-result.interface';
import { Semester } from './interfaces/semesters.interface';

// =========================================================================
@Injectable()
export class SemestersService {
    constructor(
        @InjectModel(SemestersModel)
        private readonly semestersModel: typeof SemestersModel,
    ) { }

    // =========================================================================
    //? get all semesters
    // =========================================================================

    async getAllSemesters(): Promise<ServiceResult<Semester[] | []>> {

        const result = await this.semestersModel.findAll();
        if (!result) return { message: "No Semesters found", data: [] };

        const formatted = result.map((semester) => ({
            id: semester.id,
            title: semester.title,
        }));
        return {
            message: `${formatted.length} Semesters fetched successfully`,
            data: formatted,
        }


    }
}
