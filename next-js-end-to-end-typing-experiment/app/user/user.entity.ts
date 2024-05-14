import { Expose } from "class-transformer";
import {
    IsEmail,
    IsPhoneNumber,
    IsString,
    Length,
    Matches,
} from "class-validator";
import { Trim } from "class-sanitizer";
import {
    Unique,
    PrimaryGeneratedColumn,
    Entity,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
} from "typeorm";
import { IsUnique, IsRegistered } from "@app/validators";
import { IsBlocked, IsEmailVerified, IsEmailNotVerified } from "./validators";

@Unique(["uid", "phoneNumber", "email"])
@Entity()
export default class User {
    @Expose({
        groups: ["myself", "admin"],
    })
    @PrimaryGeneratedColumn()
    readonly id?: number;

    @Column()
    uid?: string;

    @Trim()
    @IsString({ groups: ["create-account"] })
    @Length(2, 16, {
        groups: ["create-account"],
        message: ({ constraints: [min, max] }) =>
            `O nome deve conter pelo menos ${min} letras e no máximo ${max} letras.`,
    })
    @Expose({
        groups: ["myself", "admin"],
    })
    @Column()
    name?: string;

    @Trim()
    @IsString({ groups: ["create-account"] })
    @Length(2, 24, {
        groups: ["create-account"],
        message: ({ constraints: [min, max] }) =>
            `O sobrenome deve conter pelo menos ${min} letras e no máximo ${max} letras.`,
    })
    @Expose({
        groups: ["myself", "admin"],
    })
    @Column()
    surname?: string;

    @Trim()
    @IsUnique({
        message: () => "Este número de celular já foi utilizado.",
        groups: ["create-account", "update-phone-number"],
    })
    @IsRegistered({
        message: () => "Este número de celular não está cadastrado.",
        groups: ["login"],
    })
    @IsPhoneNumber("BR", {
        groups: ["login", "create-account", "update-phone-number"],
        message: () => "Este número de celular é inválido.",
    })
    @IsBlocked({
        groups: ["login", "update-phone-number", "recovery-account"],
        message: () => "Seu usuário foi bloqueado.",
    })
    @Expose({
        groups: ["myself", "admin"],
    })
    @Column()
    phoneNumber?: string;

    @IsUnique({
        message: () => "Este email já foi utilizado.",
        groups: ["create-account"],
    })
    @IsRegistered({
        message: () => "Este email não está cadastrado.",
        groups: ["recovery-account"],
    })
    @IsEmail(undefined, {
        groups: ["create-account", "recovery-account"],
        message: () => "Este email é inválido.",
    })
    @IsEmailVerified({
        groups: ["recovery-account"],
        message: () =>
            "Seu endereço de email não foi verificado. Por favor, verifique seu email para continuar.",
    })
    @IsEmailNotVerified({
        groups: ["verify-email"],
        message: () => "Seu endereço de email já foi verificado.",
    })
    @IsBlocked({
        groups: ["recovery-account", "verify-email"],
        message: () => "Seu usuário foi bloqueado.",
    })
    @Expose({
        groups: ["myself", "admin"],
    })
    @Column()
    email?: string;

    @Trim()
    @IsString({ groups: ["create-account"] })
    @Matches(/^\d{3}\.\d{3}\.\d{3}\-\d{2}$/, {
        groups: ["create-account"],
        message: ({ constraints: [min, max] }) => `Este CPF é inválido.`,
    })
    @Expose({
        groups: ["myself", "admin"],
    })
    @Column()
    cpf?: string;

    @Expose({
        groups: ["admin"],
    })
    @Column()
    role?: "admin" | "customer";

    @Expose({
        groups: ["admin"],
    })
    @Column({ default: false })
    emailVerified?: boolean;

    @Expose({
        groups: ["admin"],
    })
    @Column({ default: false })
    blocked?: boolean;

    @Expose({
        groups: ["admin"],
    })
    @CreateDateColumn({ type: "datetime" })
    readonly createdAt?: Date;

    @Expose({
        groups: ["admin"],
    })
    @UpdateDateColumn({ type: "datetime" })
    readonly updatedAt?: Date;
}
