const BASE_URL = 'http://localhost:4000/auth'

async function fetchHandler(url, options = {}) {
    try {
        const response = await fetch(`${BASE_URL}${url}`, {
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        });

        const contentLength = response.headers.get('content-length');
        let data = {};
        
        // Try to parse JSON only if there's content
        if (contentLength !== '0' && response.status !== 204) {
            try {
                data = await response.json();
            } catch (jsonError) {
                console.warn('Failed to parse JSON response:', jsonError);
            }
        }

        if (!response.ok) {
            // Create a consistent error object
            const error = new Error(data.errorMessage || `HTTP ${response.status}`);
            error.status = response.status;
            error.data = data;
            throw error;
        }

        return {
            status: response.status,
            data: data,
        };
    } catch (error) {
        // Re-throw the error so it can be caught by the caller
        throw error;
    }
}

// THESE ARE ALL THE REQUESTS WE'LL BE MAKING
export const getLoggedIn = () => fetchHandler(`/loggedIn/`);

export const loginUser = (email, password) => {
    return fetchHandler(`/login/`, {
        method: 'POST',
        body: JSON.stringify({
            email: email,
            password: password
        })
    });
}

export const logoutUser = () => fetchHandler(`/logout/`);

export const registerUser = (userName, email, password, passwordVerify, avatar) => {
    return fetchHandler(`/register/`, {
        method: 'POST',
        body: JSON.stringify({
            userName: userName,
            email: email,
            password: password,
            passwordVerify: passwordVerify,
            avatar: avatar
        })
    });
}
const apis = {
    getLoggedIn,
    registerUser,
    loginUser,
    logoutUser
}

export default apis;