"use server"; //module level Server Actions defined by 'use server' React directive

import {z, ZodIssue} from "zod";
import {getCookies, Session, signIn, signOut} from "@/lib/auth";
import {selectorItem} from "@/components/UI/DataSelectorWrapper";
import axios from "@/lib/axios";
import { AxiosError } from "axios";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {item} from "@/components/home/Table";

export type FormState = {
    message: string | { username: string; roles: string[]; };
    errors: ZodIssue[] | string;
}

const loginSchema = z.object({
    username: z.string().trim().min(4, {message: "Username must be at least 4 characters!"}),
    password: z
        .string()
        .trim()
        .min(4, {message: "You've provided an invalid password!"})
});

export const login = async (initialState: FormState, formData: FormData) => {

    const fields = {
        username: (formData.get("username") as string) || "",
        password: (formData.get("password") as string) || ""
    };

    const validateFields = loginSchema.safeParse({
        username: fields.username,
        password: fields.password
    });

    if (!validateFields.success) {
        return {
            errors: validateFields.error.issues,
            message: ""
        };
    }

    try {
        //make an API call to the server to login the user
        const response = await axios.post('/auth/login', fields)

        const jsession = response.headers['set-cookie']![0].split('; ')[0].split('=')[1];

        await signIn(
            {
                username: response.data.username,
                roles: response.data.roles,
                id: response.data.id
            },
            jsession
        )

        return {
            errors: '',
            message: response.data
        }

    } catch (error) {
        if (error instanceof Error) {
            return {
                errors: error.message || "Something went wrong!",
                message: ""
            };
        }

        return {
            errors: "Something went wrong!",
            message: ""
        };
    }
}

const registerSchema = z.object({
    username: z.string().trim().min(4, {message: "You should provide a username with at least 4 characters!"}),
    firstName: z.string(),
    lastName: z.string(),
    password: z
        .string()
        .trim()
        .min(4, {message: "You've provided an invalid password!"}),
    confirmPassword: z
        .string()
        .trim()
});

export const register = async (initialState: FormState, formData: FormData) => {

    const username = formData.get('username') as string;
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const password = formData.get('password')! as string;
    const confirmPassword = formData.get('confirmPassword')! as string;

    const fields = {
        username,
        firstName,
        lastName,
        password,
        confirmPassword
    }

    if (password.trim() !== confirmPassword.trim()) {
        return {
            message: '',
            errors: "Passwords do not match!"
        }
    }

    const validateSchema = registerSchema.safeParse(fields);

    if (!validateSchema.success) {
        return {
            message: "",
            errors: validateSchema.error.issues
        }
    }

    try {
        const response = await axios.post('/auth/signup', fields);

        const jsession = response.headers['set-cookie']![0].split('; ')[0].split('=')[1];

        await signIn(
            {
                username: response.data.username,
                roles: response.data.roles,
                id: response.data.id
            },
            jsession
        )

        return {
            errors: '',
            message: response.data
        }

    } catch (error) {
        if (error instanceof AxiosError) {
            return {
                errors: error.message || "Something went wrong!",
                message: ""
            };
        }

        return {
            errors: "Something went wrong!",
            message: ""
        };
    }
}

export const deleteUser = async (session: Session | null) => {
    const jsession = cookies().get("JSESSIONID")

    try {
		await axios.delete(`/users/${session?.id}`, {
            headers: {
                Cookie: `JSESSIONID=${jsession?.value}`
            }
        });

        await signOut();

	} catch (err) {
		if( err instanceof AxiosError ) {
			throw err;
		}
	}

    redirect('/login');
}

export const getCompanies = async (): Promise<selectorItem[] | null> => {

    try {
        const jsession = await getCookies();

        const response = await axios.get("/companies", {
            headers: {
                Cookie: `JSESSIONID=${jsession?.value}`
            }
        })

        return response.data.map((company: any) => ({
            title: company.name,
            code: company.name,
            id: company.id,
        }));

    } catch (err) {
        if (err instanceof AxiosError) {
            throw err;
        }
    }

    return null;

}

export const getCouriers = async () => {
    try {
        const jsession = cookies().get("JSESSIONID")

        const response = await axios.get("/couriers", {
            headers: {
                Cookie: `JSESSIONID=${jsession?.value}`
            }
        })

        return response.data.map((courier: any) => ({
            title: courier.username,
            username: courier.username,
            id: courier.id,
            companyName: courier.companyName
        }));

    } catch (err) {
        if (err instanceof AxiosError) {
            throw err;
        }
    }
    return null;
}

export const getUsers = async (): Promise<selectorItem[] | null> => {
    try {
        const jsession = cookies().get("JSESSIONID")

        const response = await axios.get("/users", {
            headers: {
                Cookie: `JSESSIONID=${jsession?.value}`
            }
        })

        return response.data.map((user: any) => ({
            title: user.username,
            id: user.id,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            roles: user.roles
        }));

    } catch (err) {
        if (err instanceof AxiosError) {
            throw err;
        }
    }

    return null;
}

// export const getUserId = async (userName: string | undefined, users: selectorItem[]) => {
//     const foundUser = users.find(user => user.title === userName)
//     if (foundUser) return foundUser.id;
//
//     return null;
// }

const createNewOrderSchema = z.object({
    departureAddress: z.string().trim(),
    arrivalAddress: z.string().trim(),
    sentDate: z.date(),
    weight: z.string().trim(),
});

export const getCompanyId = async () => {

    try {
        const jsession = await getCookies();

        const response = await axios.get("/office-employees/logged-employee/company-id", {
            headers: {
                Cookie: `JSESSIONID=${jsession?.value}`
            }
        })

        return response.data;
    } catch (err) {
        if (err instanceof AxiosError) {
            throw err;
        }
    }
    return null;
}

export const createAnOrder = async (
    session: Session | null,
    senderId: string | number | undefined,
    receiverId: string | number | undefined,
    courierId: string | number | undefined,
    initialState: FormState,
    formData: FormData,
) => {

    const departureAddress = formData.get('departureAddress');
    const arrivalAddress = formData.get('arrivalAddress');
    const sentDate = formData.get('sentDate');
    const weight = formData.get('weight');

    //TODO check
    const parsedSentDate = sentDate ? new Date(sentDate.toString()) : null;

    const companyId = await getCompanyId();

    const fields = {
        departureAddress,
        arrivalAddress,
        weight,
        senderId,
        receiverId,
        employeeId: session?.id ,
        sentDate: parsedSentDate,
        courierId,
        companyId
    }

    const validateSchema = createNewOrderSchema.safeParse(fields);
	if (!validateSchema.success ) {
		return {
			message: "",
			errors: validateSchema.error.issues
		}
	}

    try {
        const jsession = await getCookies();

        const response = await axios.post('/shipments', fields, {
            headers: {
                Cookie: `JSESSIONID=${jsession?.value}`
            }
        })

        return {
            message: response.data,
            errors: '',
        }

    } catch (error) {
        if (error instanceof AxiosError && error.response) {
            return {
                errors: error.response.data || "Something went wrong!",
                message: ""
            };

        }
        return {
            errors: "Something went wrong!",
            message: ""
        }
	}
}

const editOrderSchema = z.object({
    departureAddress: z.string().trim(),
    arrivalAddress: z.string().trim(),
    sentDate: z.date(),
    receivedDate: z.date(),
    weight: z.string().trim(),
});


export const editShipment = async (
    initialState: FormState,
	session: Session | null,
	senderId: string | number | undefined,
	receiverId: string | number | undefined,
	courierId: string | number | undefined,
	selectedItemId: number | null,
	formData: FormData,
) => {
	const departureAddress = formData.get('departureAddress');
	const arrivalAddress = formData.get('arrivalAddress');
	const sentDate = formData.get('sentDate');
    const receivedDate = formData.get('receivedDate');

	//const employeeId = await getUserId(session?.username, users);

	 const fields= {
		selectedItemId,
	 	departureAddress,
	 	arrivalAddress,
	 	senderId,
	 	receiverId,
		employeeId: session?.id,
	 	sentDate,
        receivedDate,
	 	courierId
	 }

	const validateSchema = editOrderSchema.safeParse(fields);

	if (!validateSchema.success ) {
		return {
			message: "",
			errors: validateSchema.error.issues
		}
	}

	try {
        const jsession = await getCookies();

        const response = await axios.post('/shipments', fields, {
            headers: {
                Cookie: `JSESSIONID=${jsession?.value}`
            }
        })

		return {
			message: response.data,
			errors: '',
		}

	} catch ( error ) {
        return {
            message: "",
            errors: "Something went wrong!",
        };
    }
}

export const deleteShipment = async (initialState: FormState, shipmentId: number) => {
    try {
        const jsession = await getCookies();

        await axios.delete(`/shipments/${shipmentId}`, {
            headers: {
                Cookie: `JSESSIONID=${jsession?.value}`
            }
        });

        return {
            message: "The shipment was successfully removed!",
            errors: ''
        }

    } catch (error) {
        return {
            message: '',
            errors: "Cannot delete the shipment!"
        }
    }
}