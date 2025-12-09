import React, { createContext, useEffect, useState } from "react";
import { useHistory } from 'react-router-dom'
import authRequestSender from './requests'

const AuthContext = createContext();

export const AuthActionType = {
    GET_LOGGED_IN: "GET_LOGGED_IN",
    LOGIN_USER: "LOGIN_USER",
    LOGOUT_USER: "LOGOUT_USER",
    REGISTER_USER: "REGISTER_USER",
    SET_GUEST_MODE: "SET_GUEST_MODE",
    SET_ERROR: "SET_ERROR",
    CLEAR_ERROR: "CLEAR_ERROR"
}

function AuthContextProvider(props) {
    const [auth, setAuth] = useState({
        user: null,
        loggedIn: false,
        isGuest: false,
        errorMessage: null,
        isLoading: false
    });
    const history = useHistory();

    useEffect(() => {
        auth.getLoggedIn();
    }, []);

    const authReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            case AuthActionType.GET_LOGGED_IN: {
                return setAuth({
                    ...auth,
                    user: payload.user,
                    loggedIn: payload.loggedIn,
                    errorMessage: null,
                    isLoading: false
                });
            }
            case AuthActionType.LOGIN_USER: {
                return setAuth({
                    ...auth,
                    user: payload.user,
                    loggedIn: payload.loggedIn,
                    errorMessage: payload.errorMessage,
                    isLoading: false
                });
            }
            case AuthActionType.LOGOUT_USER: {
                return setAuth({
                    user: null,
                    loggedIn: false,
                    isGuest: false,
                    errorMessage: null,
                    isLoading: false
                });
            }
            case AuthActionType.REGISTER_USER: {
                return setAuth({
                    ...auth,
                    user: payload.user,
                    loggedIn: payload.loggedIn,
                    errorMessage: payload.errorMessage,
                    isLoading: false
                });
            }
            case AuthActionType.SET_GUEST_MODE: {
                return setAuth({
                    user: null,
                    loggedIn: false,
                    isGuest: true,
                    errorMessage: null,
                    isLoading: false
                });
            }
            case AuthActionType.SET_ERROR: {
                return setAuth({
                    ...auth,
                    errorMessage: payload.errorMessage,
                    isLoading: false
                });
            }
            case AuthActionType.CLEAR_ERROR: {
                return setAuth({
                    ...auth,
                    errorMessage: null
                });
            }
            default:
                return auth;
        }
    }

    auth.getLoggedIn = async function () {
        try {
            const response = await authRequestSender.getLoggedIn();
            if (response.status === 200) {
                authReducer({
                    type: AuthActionType.GET_LOGGED_IN,
                    payload: {
                        loggedIn: response.data.loggedIn,
                        user: response.data.user
                    }
                });
            }
        } catch (error) {
            console.log("Not logged in:", error.message);
        }
    }

    auth.registerUser = async function(userName, email, password, passwordVerify, avatar) {
        console.log("REGISTERING USER");
        try{   
            const response = await authRequestSender.registerUser(userName, email, password, passwordVerify, avatar);   
            if (response.status === 200) {
                console.log("Registered Successfully");
                authReducer({
                    type: AuthActionType.REGISTER_USER,
                    payload: {
                        user: response.data.user,
                        loggedIn: true,
                        errorMessage: null
                    }
                });
                history.push("/");
            }
        } catch(error){
            console.error("Registration error:", error);
            authReducer({
                type: AuthActionType.REGISTER_USER,
                payload: {
                    user: auth.user,
                    loggedIn: false,
                    errorMessage: error.response?.data?.errorMessage || "Registration failed"
                }
            });
        }
    }

    auth.loginUser = async function(email, password) {
        console.log("LOGIN USER");
        authReducer({
            type: AuthActionType.CLEAR_ERROR,
            payload: {}
        });
        
        try {
            const response = await authRequestSender.loginUser(email, password);
            if (response.status === 200) {
                authReducer({
                    type: AuthActionType.LOGIN_USER,
                    payload: {
                        user: response.data.user,
                        loggedIn: true,
                        errorMessage: null
                    }
                });
                history.push("/playlists");
            }
        } catch(error){
            console.error("Login error:", error);
            authReducer({
                type: AuthActionType.LOGIN_USER,
                payload: {
                    user: auth.user,
                    loggedIn: false,
                    errorMessage: error.data?.errorMessage || error.message || "Login failed"
                }
            });
        }
    }

    auth.logoutUser = async function() {
        try {
            const response = await authRequestSender.logoutUser();
            if (response.status === 200) {
                authReducer({
                    type: AuthActionType.LOGOUT_USER,
                    payload: null
                });
                history.push("/");
            }
        } catch (error) {
            console.error("Logout error:", error);
            authReducer({
                type: AuthActionType.LOGOUT_USER,
                payload: null
            });
            history.push("/");
        }
    }

    auth.setGuestMode = function () {
        authReducer({
            type: AuthActionType.SET_GUEST_MODE,
            payload: {}
        });
    }

    auth.getUserInitials = function() {
        if (auth.user && auth.user.userName) {
            return auth.user.userName.charAt(0).toUpperCase();
        }
        return "?";
    }

    auth.clearError = function() {
        authReducer({
            type: AuthActionType.CLEAR_ERROR,
            payload: {}
        });
    }

    return (
        <AuthContext.Provider value={{
            auth
        }}>
            {props.children}
        </AuthContext.Provider>
    );
}

export default AuthContext;
export { AuthContextProvider };