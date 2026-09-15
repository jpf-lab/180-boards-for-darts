import axios from "axios";
import {useEffect} from "react";
import type {user} from "../types/types.ts";

type OAuthProps = user & {

}

export default function OAuth(props: OAuthProps) {

    function getOpen(){
        return window.location.host === 'localhost:5173' ?
            'http://localhost:8080'
            :
            window.location.origin
    }

    function login() {
        window.open(getOpen() + '/oauth2/authorization/github', '_self')
    }

    function logout() {
        window.open(getOpen() + '/logout', '_self')
    }

    function loadUser() {
        axios.get("api/auth/me")
            .then(r =>
                props.setUser({
                    name: r.data
                })
            )
            .catch(e => {
                props.setUser(undefined)
                console.error(e)
            })
    }

    useEffect(() => {
        loadUser()
    }, []);

    return (
        <>
            {props.user?.name &&
                <>
                    <span>Hallo {props.user.name}</span>
                    <button onClick={logout}>Logout!</button>
                </>
            }
            {!props.user?.name &&
                <button onClick={login}>Login</button>
            }
        </>
    )
}