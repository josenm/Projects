
import React from 'react'
import { Route, RouteProps, Redirect } from "react-router-dom";
interface Props {
    needToBeAdmin?: boolean;
    authenticated: boolean;
    isAdmin?: boolean;
}



export const PrivateRoute = (props: RouteProps & Props) => {


    if (props.authenticated === true) {
        if (props.needToBeAdmin && props.isAdmin) {
            return <Route {...props} />;
        }
        else if (props.needToBeAdmin && !props.isAdmin) {
            return <Redirect to="/medicion/Dashboard" />

        }
        else if (!props.needToBeAdmin && props.isAdmin) {
            return <Redirect to="/admin/usuarios" />
        }

        return <Route {...props} />;

    }
    return <Redirect to="/" />;
};

