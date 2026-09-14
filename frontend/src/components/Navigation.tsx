import {NavLink} from 'react-router';

export default function Navigation() {

    return(
        <nav>
            <div>
                <div>
                    <nav>
                        <ul>
                            <li><NavLink to="/">Home</NavLink></li>
                            <li><NavLink to="/about">About</NavLink></li>
                        </ul>
                    </nav>
                </div>
            </div>
        </nav>
    )
}