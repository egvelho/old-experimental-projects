import {
    ValidationOptions,
    ValidationArguments,
    registerDecorator,
} from "class-validator";
import { getRepository } from "typeorm";
import JWT from "@app/jwt";

export function IsUnique(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: "isUnique",
            target: object.constructor,
            propertyName: propertyName,
            constraints: [],
            options: validationOptions,
            validator: {
                async validate(value: any, args: ValidationArguments) {
                    if (typeof window === "undefined") {
                        return (
                            (await getRepository(
                                object.constructor.name.toLowerCase(),
                            ).findOne({ [propertyName]: value })) === undefined
                        );
                    } else {
                        return true;
                    }
                },
            },
        });
    };
}

export function IsRegistered(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: "isRegistered",
            target: object.constructor,
            propertyName: propertyName,
            constraints: [],
            options: validationOptions,
            validator: {
                async validate(value: any, args: ValidationArguments) {
                    if (typeof window === "undefined") {
                        return (
                            (await getRepository(
                                object.constructor.name.toLowerCase(),
                            ).findOne({ [propertyName]: value })) !== undefined
                        );
                    } else {
                        return true;
                    }
                },
            },
        });
    };
}

export function MatchesJWT(
    property: string,
    matchesJwt: (decodedToken: any) => any,
    validationOptions?: ValidationOptions,
) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: "matchesJWT",
            target: object.constructor,
            propertyName: propertyName,
            constraints: [],
            options: validationOptions,
            validator: {
                async validate(value: any, args: ValidationArguments) {
                    if (typeof window === "undefined") {
                        const encodedToken = (args.object as any)[property];
                        const decodedToken =
                            encodedToken && JWT.decode(encodedToken);

                        return (
                            decodedToken !== undefined &&
                            matchesJwt(decodedToken) === value
                        );
                    } else {
                        return true;
                    }
                },
            },
        });
    };
}
