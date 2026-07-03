import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

//models
import { SemestersModel } from '../semesters/semesters.model';

//helpers
import { CrudHelper } from '../../common/helpers/crud.helper';

//dtos
import { GetSemestersQueryDto, CreateSemesterDto, UpdateSemesterDto } from './dtos/semesters.dto';

//interface
import { ServiceResult } from '../../common/interfaces/service-result.interface';
import { Semester, GetSemesters } from './interfaces/semesters.interface';

// =========================================================================
@Injectable()
export class SemestersService {
    constructor(
        @InjectModel(SemestersModel)
        private readonly semestersModel: typeof SemestersModel,

        private readonly crudHelper: CrudHelper,
    ) { }

    // =========================================================================
    //? get current active semester
    // =========================================================================
    async getCurrentSemester(): Promise<ServiceResult<Semester | null>> {
        const today = new Date();
        const semester = await this.semestersModel.findOne({
            where: {
                startDate: { [Op.lte]: today },
                endDate: { [Op.gte]: today },
            }
        });

        if (!semester) {
            return {
                message: "No active semester found",
                data: null,
            };
        }

        return {
            message: "Current semester fetched successfully",
            data: {
                id: semester.id,
                title: semester.title,
                startDate: semester.startDate,
                endDate: semester.endDate,
                maxCredits: semester.maxCredits,
            }
        };
    }

    // =========================================================================
    //? get all semesters (with optional pagination)
    // =========================================================================
    async getAllSemesters(query?: GetSemestersQueryDto): Promise<ServiceResult<GetSemesters>> {
        const whereClause: any = {};
        if (query?.title) {
            whereClause.title = { [Op.iLike]: `%${query.title}%` };
        }
        if (query?.date) {
            const dateVal = new Date(query.date);
            whereClause.startDate = { [Op.lte]: dateVal };
            whereClause.endDate = { [Op.gte]: dateVal };
        }

        const page = query?.page ? Number(query.page) : undefined;
        const limit = query?.limit ? Number(query.limit) : undefined;


        // apply pagination for returned semesters
        if (page !== undefined && limit !== undefined) {
            const offset = (page - 1) * limit;
            const result = await this.semestersModel.findAndCountAll({
                where: whereClause,
                order: [['startDate', 'DESC']],
                limit,
                offset,
            });

            if (!result || result.count === 0) {
                return {
                    message: "No Semesters found",
                    data: { semesters: [], totalRows: 0 }
                };
            }

            const formatted = result.rows.map((semester) => ({
                id: semester.id,
                title: semester.title,
                startDate: semester.startDate,
                endDate: semester.endDate,
                maxCredits: semester.maxCredits,
            }));

            return {
                message: `${formatted.length} Semesters fetched successfully`,
                data: { semesters: formatted, totalRows: result.count },
            };


        } else {
            const result = await this.semestersModel.findAll({
                where: whereClause,
                order: [['startDate', 'DESC']]
            });
            if (!result) return { message: "No Semesters found", data: { semesters: [] } };

            const formatted = result.map((semester) => ({
                id: semester.id,
                title: semester.title,
                startDate: semester.startDate,
                endDate: semester.endDate,
                maxCredits: semester.maxCredits,
            }));

            return {
                message: `${formatted.length} Semesters fetched successfully`,
                data: { semesters: formatted, totalRows: formatted.length },
            };
        }
    }

    // =========================================================================
    //? create a new semester
    // =========================================================================
    async createSemester(data: CreateSemesterDto): Promise<ServiceResult<null>> {

        const { title, startDate, endDate, maxCredits } = data;

        await this.crudHelper.add(this.semestersModel, {
            id: uuidv4().substring(0, 8),
            title,
            startDate,
            endDate,
            maxCredits,
        }, {
            nonDuplicateFields: ["title"],
        });

        return {
            message: "Semester created successfully",
            data: null,
        };
    }

    // =========================================================================
    //? update semester details
    // =========================================================================
    async updateSemester(data: UpdateSemesterDto): Promise<ServiceResult<boolean>> {

        const { id, title, startDate, endDate, maxCredits } = data;

        const result = await this.crudHelper.update(this.semestersModel, {
            id,
            title,
            startDate,
            endDate,
            maxCredits,
        }, {
            nonDuplicateFields: ["title"],
        });

        return {
            message: result.updated ? "Semester updated successfully" : "No changes were made",
            data: result.updated,
        };
    }
}
