import React, { useEffect, useState } from 'react';
import firebase from '../FirebaseAuth/firebase';

export const AuthContext = React.createContext();
const auth = firebase.auth();

export default function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    async function genericlogin(email, password) {
        return auth.signInWithEmailAndPassword(email, password);
    }

    async function genericSignup(email, password) {
        return auth.createUserWithEmailAndPassword(email, password);
    }

    useEffect(() => {
        function action(user) {
            console.log("User : ", user);
            setCurrentUser(user);
            setLoading(false);
        }
        auth.onAuthStateChanged(action);
    }, [])


    const value = {
        genericlogin,
        genericSignup,
        currentUser
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}
