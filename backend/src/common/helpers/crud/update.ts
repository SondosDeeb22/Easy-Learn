//===================================================================================================
//? Import Sections
//===================================================================================================

import type { Model } from "sequelize";
import { Op } from "sequelize";

import { validateEnum } from "./validateEnumValue";

import { ConflictError, NotFoundError, ValidationError } from "../../errors";

import type { UserHelperModel, UserHelperUpdateOptions } from "./types";

//===================================================================================================
//? function to Update data
//===================================================================================================

export const update = async (
    model: UserHelperModel,
    values: Record<string, unknown>,
    options?: UserHelperUpdateOptions
): Promise<{ updated: boolean, updatedCount: number, updatedRows?: Model[] }> => {
    //get the name of the model
    const modelClassName = model.name;
    const dataName = (modelClassName?.replace(/Model$/, "") || "").toLowerCase(); // get the entity name, example: userModel -> user

    try {
        // Check Provided data matches model structure ======================================================================================================

        // get the primary key of the model
        const attrsForPk = model.getAttributes();
        const pkEntry = Object.entries(attrsForPk).find(
            ([_, attributeValue]) => (
                attributeValue as unknown as { primaryKey?: boolean }).primaryKey === true
        );

        if (!pkEntry) {
            throw new ValidationError(
                `can't update ${dataName} : model does not have a primary key defined.`,
            );
        }

        const [pkField] = pkEntry;
        const pkValue = values?.[pkField];

        // check that pkValue is not empty --------------------------------------------------
        if (pkValue === undefined || pkValue === null || pkValue === "") {
            console.log(`missing values ${pkField} : ${pkValue}`)
            throw new ValidationError("common.errors.validation.fillAllFields");
        }

        //check that updated values is provided
        if (!values || Object.keys(values).length === 0) {
            console.log(`updated values not provided ${Object.keys(values).length}`)
            throw new ValidationError("common.errors.validation.fillAllFields");
        }

        // normalize empty strings to null for nullable columns -------------------------------------
        const attrs = model.getAttributes();

        for (const [name, attr] of Object.entries(attrs)) {
            const allowNull = (attr as unknown as { allowNull?: boolean }).allowNull === true;
            const value = values[name];

            if (allowNull && typeof value === "string" && value.trim() === "") {
                values[name] = null;
            }
        }

        // Enum validation --------------------------------------------------------------------------
        if (options?.enumFields && options.enumFields.length > 0) {
            for (const rule of options.enumFields) {
                const value = values[rule.field];
                const hasField = Object.prototype.hasOwnProperty.call(values, rule.field);

                // PATCH semantics: if the client didn't send this field, don't validate it.
                if (!hasField) continue;

                // PATCH semantics: empty/null/undefined means "don't change" — skip validation
                if (value === undefined || value === null || value === "") continue;

                // If the client sent a non-empty value, enforce validity.
                if (typeof value !== "string" && typeof value !== "number") {
                    throw new ValidationError("common.errors.validation.invalidField");
                }
                if (!validateEnum(value, rule.enumObj as Record<string, string | number>)) {
                    throw new ValidationError("common.errors.validation.invalidField");
                }
            }
        }

        // Start the updating process ======================================================================================================

        //check reocred exists --------------------------------------------------------------------
        const existedRecord = await model.findOne({
            where: {
                [pkField]: pkValue,
            } as unknown as Record<string, unknown>,
        });

        if (!existedRecord) {
            throw new NotFoundError("common.errors.notFound");
        }

        //----------------------------------------------------------------------------------------------
        //apply transform (if exists)

        const finalUpdates = options?.transform ? await options.transform(values) : values;

        // get current values of the record to be updated 
        const currentValues = existedRecord?.get({ plain: true }) as Record<string, unknown>;

        const keys = Object.keys(finalUpdates);

        // filter out unchanged values 
        const changedKeys = keys.filter((fieldName) => {

            const currentValue = currentValues[fieldName];
            const newValue = finalUpdates[fieldName]

            if (currentValue === newValue) return false;
            if (currentValue == null || newValue == null) return currentValue !== newValue;

            //handle cases where database stores value as string but payload provides a number
            if (typeof currentValue === "string" && typeof newValue === "number") {
                return currentValue !== String(newValue);
            }
            if (typeof currentValue === "number" && typeof newValue === "string") {
                return String(currentValue) !== newValue;
            }

            return currentValue !== newValue;
        });
        // ------------------------------------

        if (changedKeys.length === 0) {
            return { updated: false, updatedCount: 0, updatedRows: [] };
        }

        //------------------------------------------------------------------------------------------
        // if one of the changed fields is unique column, ensure that the new value doesn't exist in other records 

        if (options?.nonDuplicateFields && options.nonDuplicateFields.length > 0) {
            for (const field of options.nonDuplicateFields) {
                if (!changedKeys.includes(field)) continue;

                const value = finalUpdates[field];
                if (value == null || value === "") continue;

                const duplicate = await model.findOne({
                    where: {
                        [field]: value,
                        [pkField]: { [Op.ne]: pkValue },
                    } as unknown as Record<string, unknown>,
                    attributes: [pkField],
                });

                if (duplicate) {
                    throw new ConflictError("common.errors.validation.duplicate");
                }
            }
        }

        //------------------------------------------------------------------------------------------
        //prepare updates to apply

        const updatesToApply: Record<string, unknown> = {};

        for (const key of changedKeys) updatesToApply[key] = finalUpdates[key];

        const [updatedCount, updatedRows] = (await model.update(updatesToApply as Record<string, unknown>, {
            where: {
                [pkField]: pkValue,
            } as Record<string, unknown>,
            returning: true,
        })) as [number, Model[]?];

        if (updatedCount === 0) {
            return { updated: false, updatedCount: 0, updatedRows: [] };
        }

        return { updated: true, updatedCount, updatedRows };

        //===================================================================================
    } catch (error: unknown) {
        console.error(`Error occured while updating ${dataName}.`, error);
        throw error;
    }
};
