import React from "react";
import { NavLink } from "react-router-dom";
import "./TheHeader.css";

const TheHeader: React.FC = () => {

    return (
        <nav className="navbar">
            <ul>
                <li>
                    <NavLink 
                        to='/'
                        className={({isActive}) => isActive ? 'active' : undefined}
                        end
                    >
                        Home
                    </NavLink>
                </li>
                <li>
                    <NavLink 
                        to='/auth' 
                        className={({isActive}) => isActive ? 'active' : undefined}
                    >
                        Auth
                    </NavLink>
                </li>
                <li>
                    <NavLink 
                        to='/products' 
                        className={({isActive}) => isActive ? 'active' : undefined}
                    >
                        Products
                    </NavLink>
                </li>
            </ul>
        </nav>
    )
}

export default TheHeader;