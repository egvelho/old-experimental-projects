import { ClassConstructor } from "class-transformer";
import { ValidationError } from "class-validator";
export declare function parse<ClassType extends Object, Groups extends string[] = string[]>(constructor: ClassConstructor<ClassType>, object: ClassType, groups?: Groups): Promise<[ClassType, ValidationError[]]>;
