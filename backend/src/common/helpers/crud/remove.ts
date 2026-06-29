//===================================================================================================
//? Import Sections
//===================================================================================================

import { ConflictError, NotFoundError, ValidationError } from "../../errors";
import { WhereOptions } from 'sequelize';
import type { UserHelperModel } from "./types";

//===================================================================================================
//? function to Remove data
//===================================================================================================

export const remove = async (
    model: UserHelperModel,
    where: WhereOptions
): Promise<number> => {
    // unique value is basically the primary key of the model

    const modelClassName = model.name;
    const dataName = (modelClassName?.replace(/Model$/, "") || "").toLowerCase();

    try {
        if (!where || Object.keys(where).length === 0) {
            throw new ValidationError("common.errors.missingField");
        }

        // Ensure the record exists
        const fieldExists = await model.findOne({
            where,
        });

        if (!fieldExists) {
            throw new NotFoundError("common.errors.notFound");
        }

        // Delete the record
        const deletedField = await model.destroy({
            where,
        });

        if (deletedField === 0) {
            throw new ConflictError("common.crud.notRemoved");
        }

        return deletedField;

        // ------------------------------------------------------------------------
    } catch (error: unknown) {
        console.error(`Error occured while removing ${dataName}.`, error);
        throw error;
    }
};
