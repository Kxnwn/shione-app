import api from "../../api/api"

export const loginUser = async (
    email: string,
    password: string
) => {
    try {
        const response = await api.post(
            "/auth/login",
            {
                email,
                password
            }
        )
        
        return response.data

    } catch (error: any) {

        console.log(
            "STATUS:",
            error.response?.status
        )

        console.log(
            "DATA:",
            error.response?.data
        )

        throw error
    }
}

export const registerUser = async (
    name: string,
    email: string,
    password: string
) => {

    try {
        const response = await api.post(
        "/auth/register",
        {
            name,
            email,
            password
        }
    )

    return response.data;
    
    } catch (error: any) {
        console.log(
            "STATUS:",
            error.response?.status
        )

        console.log(
            "DATA:",
            error.response?.data
        )

        throw error
    }
    }
    
