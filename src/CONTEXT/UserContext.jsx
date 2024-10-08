import { createContext, useContext, useEffect, useState } from "react";
import api from "../configs/api";
import { useNavigate, Navigate } from "react-router-dom";

const UserContext = createContext()

const UserProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null)
    const [token, setToken] = useState('')
    const nav = useNavigate()

    const logout = () => {
        api.get('/logout').then(() => {
            setCurrentUser(null)
            setToken('')
            localStorage.removeItem('token')
            nav('/login')
        })
    }

    useEffect(() => {
        if (token || !!localStorage.getItem('token')) {
            api.get('/currentUser', { headers: { Authorization: `Bearer ${token}` } })
                .then(res => setCurrentUser(res.data.user))
                .catch(() => {
                    setToken('')
                    localStorage.removeItem('token')
                    nav('/login')
                })
        }
    }, [token])

    return <UserContext.Provider value={{ token, currentUser, setToken, logout }}>
        {children}
    </UserContext.Provider>
}


export default UserProvider
export const useUser = () => useContext(UserContext)


