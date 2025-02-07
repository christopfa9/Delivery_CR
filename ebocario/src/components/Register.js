import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import app from '../firebase-config';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const auth = getAuth(app);
    const navigate = useNavigate();
    const db = getFirestore(app);

    const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);
    const isValidPassword = (password) => password.length > 5 && !/\s/.test(password);

    const handleRegister = async (event) => {
        event.preventDefault();
        setError('');
        if (!isValidEmail(email)) {
            setError('Correo inválido');
            return;
        }
        if (!isValidPassword(password)) {
            setError('La contraseña debe contener 6 caracteres mínimo');
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            await setDoc(doc(db, "Users", user.uid), {
                name: name,
                email: user.email,
                role: 'user',
                createdAt: new Date()
            });
            navigate('/landing');
        } catch (error) {
            console.error('Error signing up:', error.message);
            setError(error.message);
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <form onSubmit={handleRegister} className="card p-4">
                        {error && <div className="alert alert-danger">{error}</div>}
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label">Nombre</label>
                            <input type="text" className="form-control" id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input type="email" className="form-control" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Contraseña</label>
                            <input type="password" className="form-control" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        </div>
                        <button type="submit" className="btn btn-primary">Register</button>
                        <p>¿Ya tiene cuenta? <Link to="/login">Inicie sesión</Link></p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;