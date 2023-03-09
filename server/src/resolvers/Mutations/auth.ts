import { Context } from "../..";
import validator from "validator";
import bcrypt from "bcryptjs";
import { User, Prisma } from "@prisma/client";

interface userArgs {}

interface signupArgs {
	firstname: string;
	lastname: string;
	username: string;
	gender: string;
	email: string;
	password: string;
}

interface userPayload {
	userErrors: {
		message: string;
	}[];
	user: User | Prisma.Prisma__UserClient<User, never> | null;
}

export const authResolvers = {
	signup: async (
		_: any,
		{
			firstname,
			lastname,
			username,
			password,
			gender,
			email
		}: {
			firstname: string;
			lastname: string;
			username: string;
			password: string;
			gender: string;
			email: string;
		},
		{ prisma }: Context
	) => {
		//Email validation
		const isEmail = validator.isEmail(email);
		if (!isEmail) {
			return {
				userErrors: [
					{
						message: "Please use a valid email"
					}
				],
				user: null
			};
		}

		//Password Validation
		const isValidPassword = validator.isLength(password, { min: 6 });
		if (!isValidPassword) {
			return {
				userErrors: [
					{
						message:
							"Password is not valid, password length must be not less than 6 letters"
					}
				],
				user: null
			};
		}
		//check if
		if (!firstname && !lastname && !username && !gender) {
			return {
				userError: [
					{
						message:
							"Please fill up all the required fields to create an account"
					}
				],
				user: null
			};
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		return {
			userErrors: [],
			user: await prisma.user.create({
				data: {
					firstname,
					lastname,
					username,
					gender,
					email,
					password: hashedPassword
				}
			})
		};
	}
};
