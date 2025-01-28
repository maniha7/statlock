import logo from '../assets/logo.png'

import { Link } from "react-router-dom";

export default function Nav(){
    return(
    <>
        <div className="w-200 h-flex p-2 ml-10 mr-10 mt-2 border-b-4 border-r-2 border-black rounded-lg bg-stone-800 bg-blend-overlay mb-5">
            <div className="menu space-x-10 text-transparent bg-clip-text bg-gradient-to-r from-orange-200 to-black">
                <Link to='/'><div className="flex bold hover:underline hover:opacity-80 text-white bolded"><img src={logo} className="h-5 w-5 mr-2 mt-1" /> STATLOCK </div></Link>

                <Link to='/stats'><div className="hover:underline hover:opacity-80 text-white hover:text-stone-200">ꜱᴛᴀᴛꜱ</div></Link>
                
                <Link to='/builds'><div className="hover:underline hover:opacity-80 text-white hover:text-stone-200">ʙᴜɪʟᴅꜱ</div></Link>

                <Link to='/matches'><div className="hover:underline hover:opacity-80 text-white hover:text-stone-200">ᴍᴀᴛᴄʜᴇꜱ</div></Link>

                <Link to='/rankings'><div className="hover:underline hover:opacity-80 text-white hover:text-stone-200">ʀᴀɴᴋɪɴɢꜱ</div></Link>

                <Link to='/patchnotes'><div className="hover:underline hover:opacity-80 text-white hover:text-stone-200">ᴘᴀᴛᴄʜ ɴᴏᴛᴇꜱ</div></Link>

                <Link to='/items'><div className="hover:underline hover:opacity-80 text-white hover:text-stone-200">ɪᴛᴇᴍꜱ</div></Link>

            </div>

            
        </div>
    </>
    )
}


