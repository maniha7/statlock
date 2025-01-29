import logo from '../assets/logo.png'
import globals from '../globals';

const gColors = globals.globalColors

import { Link } from "react-router-dom";

export default function Nav(){
    return(
    <>
        <div className="w-50 md:w-175 lg:w-175 h-flex p-2 ml-5 mt-2 border-b-4 border-r-2 border-black rounded-lg bg-stone-800 mb-5">
            <div className="flex flex-col md:flex-row lg:flex-row xl:flex-row space-y-1 md:space-x-10 lg:space-x-10">
                <Link to='/'><div className="flex bold hover:underline hover:opacity-80  text-transparent bg-clip-text bg-gradient-to-r from-orange-200 to-stone-500"><img src={logo} className="h-5 w-5 mr-2 mt-1" /> STATLOCK </div></Link>

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


