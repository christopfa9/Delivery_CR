import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, signOut, updateEmail as firebaseUpdateEmail, updatePassword as firebaseUpdatePassword } from "firebase/auth";
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import app from './firebase-config';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const auth = getAuth();
    const db = getFirestore(app);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user);
            if (user) {
                const userDoc = await getDoc(doc(db, 'Users', user.uid));
                if (userDoc.exists()) {
                    setUserRole(userDoc.data().role);
                } else {
                    setUserRole(null);
                }
            } else {
                setUserRole(null);
            }
        });

        return unsubscribe;
    }, [auth, db]);

    const logout = () => {
        return signOut(auth);
    };

    const updateEmail = (email) => {
        if (currentUser) {
            return firebaseUpdateEmail(currentUser, email);
        }
    };

    const updatePassword = (password) => {
        if (currentUser) {
            return firebaseUpdatePassword(currentUser, password);
        }
    };

    const value = { currentUser, userRole, logout, updateEmail, updatePassword };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
