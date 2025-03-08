import React, { createContext, useState, ReactNode, useContext } from "react";


// Define the types for the user and context value
interface User {
    address: string;
    bio?: string;
    image?: string;
    phoneNumber?: string;
    id?: string;
    email: string;
    name?: string;
    // Add other user fields as needed
}

interface AuthContextType {
    user?: User | null;
    setAuth: (authUser: User | null | any) => void;
    session?: any;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);

    const setAuth = (authUser: User | null) => {
        setUser(authUser);
    };


    return (
        <AuthContext.Provider value={{user, setAuth}}>
        {children}
        </AuthContext.Provider>
)
  
};

// Custom hook to use the AuthContext safely
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
  
    // Ensure that the context is used within the AuthProvider
    if (!context) {
      throw new Error("useAuth must be used within an AuthProvider");
    }
  
    return context;
  };

export default AuthProvider;
