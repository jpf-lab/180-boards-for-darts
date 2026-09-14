import logo from "../assets/logo.svg"
import OAuth from "./OAuth.tsx";

export default function Header() {

    return (
        <header>
            <img src={logo} alt={"Logo"}/>
            180 Boards for Darts
            <OAuth />
        </header>
    )
}