import logo from '../assets/logo.png'

import { Link } from "react-router-dom";

export default function Nav(){
    return(
    <>
        <div className="
             w-200 h-flex p-2 ml-10 mr-10 mt-2 border-b-2 border-black rounded-lg bg-stone-900 bg-blend-overlay">
            <div className="menu space-x-10 ">
                <Link to='/'><div className="flex bold hover:underline hover:opacity-80 text-blue-900 bolded"><img src={logo} className="h-5 w-5 mr-2 mt-1" /> STATLOCK </div></Link>

                <Link to='/stats'><div className="hover:underline hover:opacity-80 text-white">STATS</div></Link>
                
                <Link><div className="hover:underline hover:opacity-80 text-white">BUILDS</div></Link>

                <Link><div className="hover:underline hover:opacity-80 text-white">MATCHES</div></Link>

                <Link><div className="hover:underline hover:opacity-80 text-white">RANKINGS</div></Link>

                <Link><div className="hover:underline hover:opacity-80 text-white">PATCH NOTES</div></Link>

                <Link><div className="hover:underline hover:opacity-80 text-white">BIGCHUNGUS</div></Link>

            </div>

            
        </div>
    </>
    )
}


