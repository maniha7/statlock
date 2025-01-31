import logo from '../assets/logo.png'
import globals from '../globals';
import discord from '../assets/discordlogo2.png'
import steam from '../assets/steam_login.png'
import insta from '../assets/instagram_logo.png'


const gColors = globals.globalColors

const customFont = {
    fontFamily: "'Colus', Colus-Regular",
    fontSize: "20px",
    color: "#333",
  };

import { Link } from "react-router-dom";

export default function Nav(){
    return(
    <>
    <section className="grid grid-cols-2">
        <div className={`w-30 md:w-175 lg:w-175 h-flex p-2 ml-5 mt-2 border-b-4 border-r-2 border-black rounded-lg ${gColors.stoneBackgroundGradient} mb-5`}>
            <div className="flex flex-col md:flex-row lg:flex-row xl:flex-row space-y-1 md:space-x-10 lg:space-x-10">
                <Link to='/'><div className="flex bold hover:underline hover:opacity-80  text-transparent bg-clip-text bg-gradient-to-r from-orange-200 to-stone-500"><img src={logo} className="h-5 w-5 mr-2 mt-1"  /> STATLOCK </div></Link>

                <Link to='/stats'><div className="hover:underline hover:opacity-80 text-white hover:text-stone-200 font-display">stats</div></Link>
                
                <Link to='/builds'><div className="hover:underline hover:opacity-80 text-white hover:text-stone-200">ʙᴜɪʟᴅꜱ</div></Link>

                <Link to='/matches'><div className="hover:underline hover:opacity-80 text-white hover:text-stone-200">ᴍᴀᴛᴄʜᴇꜱ</div></Link>

                <Link to='/rankings'><div className="hover:underline hover:opacity-80 text-white hover:text-stone-200">ʀᴀɴᴋɪɴɢꜱ</div></Link>

                <Link to='/patchnotes'><div className="hover:underline hover:opacity-80 text-white hover:text-stone-200">ᴘᴀᴛᴄʜ ɴᴏᴛᴇꜱ</div></Link>

                <Link to='/items'><div className="hover:underline hover:opacity-80 text-white hover:text-stone-200">ɪᴛᴇᴍꜱ</div></Link>

                


            </div>

            
        </div>
        
        <div className="flex justify-end">
        
            <div className={`ml-5 mt-2 mr-5 rounded-lg p-2 flex flex-col md:flex-row lg:flex-row xl:flex-row space-x-10 border-b-4 border-r-2 h-12 sm:h-flex ${gColors.stoneBackgroundGradient}`}>
                <div>
                <a><img className="h-7 w-flex mt-0.5 ml-2 hover:opacity-80" src={steam} /></a>
                </div>

                <div className="mr-2 flex flex-row space-x-3">
                   <a href="https://discord.gg/rUYKVZeCYt"><img src={discord} className="w-7 h-flex hover:p-0.5 hover:opacity-80" /></a>
                </div>
            </div>
        </div>
        
    </section>        
    </>
    )
}


