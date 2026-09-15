import logo from "../assets/logo.svg"
import OAuth from "./OAuth.tsx";
import type {user} from "../types/types.ts";

type HeaderProps = user

export default function Header(props: HeaderProps) {

    return (
        <header>
            <img src={logo} alt={"Logo"}/>
            180 Boards for Darts
            <OAuth user={props.user} setUser={props.setUser}/>
        </header>
    )
}