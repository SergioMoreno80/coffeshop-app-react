import { Navigate, Route, Routes } from 'react-router-dom';
//import { LoginPage } from './auth/pages/LoginPage';
import { Login } from './auth/pages/Login';
import { UserRoutes } from './routes/UserRoutes';
import { useSelector } from 'react-redux';
import { useState } from 'react';

export const AppRoutes = () => {

    const { isAuth, isLoginLoading } = useSelector(state => state.auth);

    if (isLoginLoading) {
        return (
            <div className="container my-4 text-center">
                <div className="spinner-border text-secondary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }
    return (
        <Routes>
            {
                isAuth
                    ? (
                        <Route path='/*' element={<UserRoutes />} />
                    )
                    : <>
                        <Route path='/login' element={<Login />} />
                        <Route path='/*' element={<Navigate to="/login" />} />
                    </>

            }
        </Routes>
    );
}


export const CounterApp = () => {
    const [counter, setCounter] = useState(0);
    const CounterIncrement = () =>{
        setCounter(counter + 1);
        console.log('click')
    }

return <>
<h2>El valor del contador es { counter } </h2>
<button onClick={ () =>{
CounterIncrement()
}} >incrementar contador  + 1 </button>
</>
}