"use server";

import axios from "@/lib/axios";
import {FormState} from "@/lib/actions";
import {selectorItem} from "@/components/UI/DataSelectorWrapper";
import {getCookies} from "@/lib/auth";

// COMPANY ACTIONS START

export const createCompany = async (
    initialState: FormState,
    formData: FormData,
) => {
    const newCompanyName = formData.get("company_name") as string;

    try {

        if (!newCompanyName.trim()) {
            return {
                message: '',
                errors: "Company name cannot be empty!"
            }
        }

        const requestData = {
            name: newCompanyName.trim(),
        };

        const jsession = await getCookies();

        await axios.post('/companies', requestData, {
            headers: {
                Cookie: `JSESSIONID=${jsession?.value}`
            }
        });

        return {
            message: "You've successfully create a company!",
            errors: ""
        }

    } catch (error) {
        return {
            message: '',
            errors: 'Error creating company! '
        };
    }
};

export const deleteCompany = async (selectedCompany: selectorItem) => {

    try {
        const jsession = await getCookies();

        await axios.delete(`/companies/${selectedCompany.id}`, {
            headers: {
                Cookie: `JSESSIONID=${jsession?.value}`
            }
        });
        
        return {
            message: "Company was successfully deleted!",
            errors: ""
        }

    } catch (error) {
        return {
            message: '',
            errors: 'Failed to delete the company!'
        };
    }
}

export const editCompany = async (updatedCompanyName: string, selectedCompany: selectorItem) => {

    try {
        const requestedData = {
            id: selectedCompany.id,
            name: updatedCompanyName
        }

        const jsession = await getCookies();

        await axios.put(`/companies`, requestedData, {
            headers: {
                Cookie: `JSESSIONID=${jsession?.value}`
            }
        });

        return {
            message: "Company was successfully updated! ",
            errors: ""
        }
    } catch (error) {
        return {
            message: '',
            errors: 'Failed to update the company'
        };
    }
}

// COMPANY ACTIONS END

// USER ACTIONS START

export const deleteUser = async (initialState: FormState, userId: number)=> {
    try {
        const jsession = await getCookies();

        await axios.delete(`/users/${userId}`, {
            headers: {
                Cookie: `JSESSIONID=${jsession?.value}`
            }
        })

        return {
            message: "User was successfully deleted! ",
            errors: ""
        }

    } catch (error) {
        return {
            message: '',
            errors: 'Failed to deleted the chosen user!'
        };
    }
}

export const promoteUser = async (initialState: FormState, userId: number) => {

    const requestedData = {
        userId,
        role: "EMPLOYEE",
    }

    try {
        const jsession = await getCookies();

        await axios.put(`/users/add-role`, requestedData, {
            headers: {
                Cookie: `JSESSIONID=${jsession}`
            },

        });

        return {
            message: "User was successfully promoted! ",
            errors: ""
        }

    } catch (error) {
        return {
            message: '',
            errors: 'Failed to promote the chosen user!'
        };
    }
}

// USER ACTIONS END

// EMPLOYEE ACTIONS START

export const deleteEmployee = async (initialState: FormState, employeeId: number)=> {
    try {
        const jsession = await getCookies();

        await axios.delete(`/office-employees/${employeeId}`, {
            headers: {
                Cookie: `JSESSIONID=${jsession?.value}`
            }
        })

        return {
            message: "Employee was successfully deleted! ",
            errors: ""
        }

    } catch (error) {
        return {
            message: '',
            errors: 'Failed to deleted the chosen employee!'
        };
    }
}

export const demoteEmployee = async (initialState: FormState, userId: number) => {

    const requestedData = {
        userId,
        role: "USER",
    }

    try {
        const jsession = await getCookies();

        await axios.put(`/office-employees/demote/${userId}`, requestedData,{
            headers: {
                Cookie: `JSESSIONID=${jsession?.value}`
            }
        })

        return {
            message: "Employee was successfully demoted! ",
            errors: ""
        }

    } catch (error) {
        return {
            message: '',
            errors: 'Failed to demote the chosen employee!'
        };
    }
}

// EMPLOYEE ACTIONS END

// OFFICE ACTIONS START

export const addOffice = async (companyId: number, officeLocation: string) => {

    try {
        const requestedData = {
            address: officeLocation,
            companyId
        }

        const jsession = await getCookies();

        await axios.post(`/offices`, requestedData, {
            headers: {
                Cookie: `JSESSIONID=${jsession?.value}`
            }
        });

        return {
            message: "New office was successfully added! ",
            errors: ""
        }
    } catch (error) {
        return {
            message: '',
            errors: 'Failed to add a new office to the company!'
        };
    }
}

export const editOffice = async (officeId: number, companyId: {  id: number; name: string; }, initialState: FormState, formData: FormData) => {

    try {
        const requestedData = {
            id: officeId,
            address: formData.get('address'),
            companyId
        }

        const jsession = await getCookies();

        await axios.put(`/offices`, requestedData, {
            headers: {
                Cookie: `JSESSIONID=${jsession?.value}`
            }
        });

        return {
            message: "New office was successfully added! ",
            errors: ""
        }
    } catch (error) {
        console.log(error);
        return {
            message: '',
            errors: 'Failed to add a new office to the company!'
        };
    }
}

export const deleteOffice = async (initialState: FormState, officeId: number)=> {
    try {
        const jsession = await getCookies();

        await axios.delete(`/office/${officeId}`,{
            headers: {
                Cookie: `JSESSIONID=${jsession?.value}`
            }
        });

        return {
            message: "Office was successfully deleted! ",
            errors: ""
        }
    } catch (error) {
        return {
            message: '',
            errors: 'Failed to delete the chosen office!'
        };
    }
}

// OFFICE ACTIONS END