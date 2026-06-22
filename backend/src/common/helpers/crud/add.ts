//===================================================================================================
//? Import Sections
//===================================================================================================

import type { Model } from "sequelize";

import { validateEnum } from "./validateEnumValue";

import { InternalServerError, ConflictError, ValidationError } from "../../errors";

import type { UserHelperAddOptions, UserHelperModel } from "./types";

import { v4 as uuidv4 } from "uuid";
//===================================================================================================
//? function to ADD data
//===================================================================================================

export const add = async (
    model: UserHelperModel,
    payload: Record<string, unknown>,
    options?: UserHelperAddOptions
): Promise<void> => {
    const dbModelAttr = model.getAttributes();
    const body: Record<string, unknown> = { ...payload };

    try {
        // ---------------------------------------------------------------------
        // required fields (from model metadata)

        const requiredFields: string[] = [];

        for (const [name, attr] of Object.entries(dbModelAttr)) {
            const field = attr as unknown as {
                allowNull?: boolean;
                defaultValue?: unknown;
                autoIncrement?: boolean;
                primaryKey?: boolean;
            };

            if (!field.allowNull && field.defaultValue === undefined && !field.autoIncrement && !field.primaryKey) {
                requiredFields.push(name);
            }
        }

        for (const field of requiredFields) {
            if (body[field] === undefined || body[field] === null || body[field] === "") {
                throw new ValidationError("common.errors.validation.fillAllFields");
            }
        }

        // Normalize empty strings to null (only for optional fields)
        for (const key of Object.keys(body)) {
            if (!requiredFields.includes(key) && body[key] === "") {
                body[key] = null;
            }
        }

        // ---------------------------------------------------------------------
        // enum validation

        if (options?.enumFields) {
            for (const rule of options.enumFields) {
                const value = body[rule.field];

                if ((value === undefined || value === null || value === "") && !rule.optional) {
                    throw new ValidationError("common.errors.validation.missingField");
                }
                if (value != null && value !== "") {
                    if (typeof value !== "string" && typeof value !== "number") {
                        throw new ValidationError("common.errors.validation.invalidField");
                    }
                    if (!validateEnum(value, rule.enumObj as Record<string, string | number>)) {
                        throw new ValidationError("common.errors.validation.invalidField");
                    }
                }
            }
        }

        // ---------------------------------------------------------------------
        // primary key generation

        // extract primary key name and attribute from db model
        const pkEntry = Object.entries(dbModelAttr).find(([_, field]) => (field as unknown as { primaryKey?: boolean }).primaryKey);

        // continue if the model has pk
        if (pkEntry) {
            const [pkName, pkAttr] = pkEntry as [string, unknown]; // extract pk name and attr

            //assert that pkAttr is object that may contain those properties
            const pkAttrTyped = pkAttr as {
                autoIncrement?: boolean;
                defaultValue?: unknown;
            };

            // check if valid pk value was provided in the request 
            const hasPk = body[pkName] != null && body[pkName] !== "";

            // If the PK not provided, not auto-increment, and has no default value, 
            // we generate a uuid 
            if (!hasPk && !pkAttrTyped.autoIncrement && pkAttrTyped.defaultValue === undefined) {
                body[pkName] = uuidv4();
            }


        }

        // ---------------------------------------------------------------------
        // apply transform (if existed)

        const finalData = options?.transform ? await options.transform(body) : body;

        // ---------------------------------------------------------------------
        // non-duplicate checks (run AFTER transform so normalized values are checked)

        if (options?.nonDuplicateFields) {
            for (const field of options.nonDuplicateFields) {
                const value = finalData?.[field];
                if (value == null || value === "") continue;

                const exists = (await model.findOne({
                    where: { [field]: value } as unknown as Record<string, unknown>,
                    attributes: [field],
                })) as Model | null;

                if (exists) {
                    throw new ConflictError("common.errors.validation.duplicate");
                }
            }
        }

        await model.create(finalData as never);

        // ---------------------------------------------------------------
    } catch (error: unknown) {
        // ---------------------------------------------------------------------
        // centralized error mapping

        if (error instanceof ValidationError || error instanceof ConflictError || error instanceof InternalServerError) {
            throw error;
        }



        throw new InternalServerError("common.errors.internal");
    }
};
