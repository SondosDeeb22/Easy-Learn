import { ModelStatic, Model } from "sequelize";

import { update } from './crud/update';
import { add } from './crud/add';



export class CrudHelper {
    //==========================================================================================================
    //? function to UPDATE data
    //========================================================================================================
    async update(model: ModelStatic<Model<any, any>>, values: Record<string, any>,
        options?: {
            nonDuplicateFields?: string[];
            enumFields?: Array<{ field: string; enumObj: object; optional?: boolean }>;
            disallowFields?: string[];
            transform?: (vals: any) => Promise<any> | any;
        }
    ): Promise<{ updated: boolean; updatedCount: number }> {

        const mappedOptions: {
            nonDuplicateFields?: string[];
            enumFields?: Array<{ field: string; enumObj: object; optional?: boolean }>;
            disallowFields?: string[];
            transform?: (vals: Record<string, unknown>) => Promise<Record<string, unknown>> | Record<string, unknown>;
        } = {};

        if (options?.nonDuplicateFields) mappedOptions.nonDuplicateFields = options.nonDuplicateFields;
        if (options?.enumFields) mappedOptions.enumFields = options.enumFields;
        if (options?.disallowFields) mappedOptions.disallowFields = options.disallowFields;
        if (options?.transform) {
            mappedOptions.transform = options.transform as unknown as (vals: Record<string, unknown>) =>
                Promise<Record<string, unknown>> | Record<string, unknown>;
        }

        return update(
            model as unknown as ModelStatic<Model>,
            values as unknown as Record<string, unknown>,
            options ? mappedOptions : undefined
        );
    }
    //==========================================================================================================
    //? function to ADD data
    //========================================================================================================

    async add(
        model: ModelStatic<Model<any, any>>,
        payload: Record<string, any>,
        options?: {
            nonDuplicateFields?: string[],
            enumFields?: Array<{ field: string; enumObj: object; optional?: boolean }>;
            transform?: (data: any) => Promise<any> | any;
        }
    ): Promise<void> {

        const mappedOptions: {
            nonDuplicateFields?: string[];
            enumFields?: Array<{ field: string; enumObj: object; optional?: boolean }>;
            transform?: (data: Record<string, unknown>) => Promise<Record<string, unknown>> | Record<string, unknown>;
        } = {};

        if (options?.nonDuplicateFields) mappedOptions.nonDuplicateFields = options.nonDuplicateFields;
        if (options?.enumFields) mappedOptions.enumFields = options.enumFields;
        if (options?.transform) {
            mappedOptions.transform = options.transform as unknown as (data: Record<string, unknown>) =>
                Promise<Record<string, unknown>> | Record<string, unknown>;
        }

        await add(
            model as unknown as ModelStatic<Model>,
            payload as unknown as Record<string, unknown>,
            options ? mappedOptions : undefined
        );
    }
}