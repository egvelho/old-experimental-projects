import {
    ValidationOptions,
    ValidationArguments,
    registerDecorator,
} from "class-validator";
import { getRepository } from "typeorm";
import User from "./user.entity";

export function IsBlocked(validationOptions?: ValidationOptions) {
    return function (object: User, propertyName: string) {
        registerDecorator({
            name: "isBlocked",
            target: object.constructor,
            propertyName: propertyName,
            constraints: [],
            options: validationOptions,
            validator: {
                async validate(value: any, args: ValidationArguments) {
                    if (typeof window === "undefined") {
                        const isBlocked = !(
                            await getRepository(User).findOne({
                                [propertyName]: value,
                            })
                        )?.blocked;
                        return isBlocked;
                    } else {
                        return true;
                    }
                },
            },
        });
    };
}

export function IsEmailVerified(validationOptions?: ValidationOptions) {
    return function (object: User, propertyName: string) {
        registerDecorator({
            name: "isEmailVerified",
            target: object.constructor,
            propertyName: propertyName,
            constraints: [],
            options: validationOptions,
            validator: {
                async validate(value: any, args: ValidationArguments) {
                    if (typeof window === "undefined") {
                        const user = await getRepository(User).findOne({
                            [propertyName]: value,
                        });

                        return !!user?.emailVerified;
                    } else {
                        return true;
                    }
                },
            },
        });
    };
}

export function IsEmailNotVerified(validationOptions?: ValidationOptions) {
    return function (object: User, propertyName: string) {
        registerDecorator({
            name: "isEmailNotVerified",
            target: object.constructor,
            propertyName: propertyName,
            constraints: [],
            options: validationOptions,
            validator: {
                async validate(value: any, args: ValidationArguments) {
                    if (typeof window === "undefined") {
                        const user = await getRepository(User).findOne({
                            [propertyName]: value,
                        });

                        return user?.emailVerified === false;
                    } else {
                        return true;
                    }
                },
            },
        });
    };
}
