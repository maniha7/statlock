import logo from '../assets/logo.png'
import globals from '../globals';
import discord from '../assets/discordlogo2.png'
import steam from '../assets/steam_logo.png'
import insta from '../assets/instagram_logo.png'
import youtube from '../assets/youtube_logo.png'

const gColors = globals.globalColors

const customFont = {
    fontFamily: "'Colus', Colus-Regular",
    fontSize: "20px",
    color: "#333",
  };

import { Link } from "react-router-dom";

export default function Nav(props){
    return(
    <>
    <section ref={props.r} className="grid grid-cols-2">
        <div className={`w-30 md:w-175 lg:w-185 h-flex p-2 ml-5 mt-2 border-b-4 border-r-2 border-black rounded-lg ${gColors.stoneBackgroundGradient} mb-5`}>
            <div className="flex flex-col md:flex-row lg:flex-row xl:flex-row space-y-1 md:space-x-10 lg:space-x-10">
                <Link to='/'><div className="flex bold hover:underline hover:opacity-80  text-transparent bg-clip-text bg-gradient-to-r from-orange-200 to-stone-500 font-display "><img src={logo} className="h-5 w-5 mr-2 mt-1"  /> STATLOCK </div></Link>

                <Link to='/stats'><div className="hover:underline hover:opacity-80 text-white hover:text-stone-200 font-display text-md font-bold transition duration-300 ease-in-out hover:-translate-y-0.5 hover:scale-110">ꜱᴛᴀᴛꜱ</div></Link>
                
                <Link to='/builds'><div className="hover:underline hover:opacity-80 text-white hover:text-stone-200 font-display text-md font-bold transition duration-300 ease-in-out hover:-translate-y-0.5 hover:scale-110">ʙᴜɪʟᴅꜱ</div></Link>

                <Link to='/matches'><div className="hover:underline hover:opacity-80 text-white hover:text-stone-200 font-display text-md font-bold transition duration-300 ease-in-out hover:-translate-y-0.5 hover:scale-110">ᴍᴀᴛᴄʜᴇꜱ</div></Link>

                <Link to='/rankings'><div className="hover:underline hover:opacity-80 text-white hover:text-stone-200 font-display text-md font-bold transition duration-300 ease-in-out hover:-translate-y-0.5 hover:scale-110">ʀᴀɴᴋɪɴɢꜱ</div></Link>

                <Link to='/patchnotes'><div className="hover:underline hover:opacity-80 text-white hover:text-stone-200 font-display text-md font-bold transition duration-300 ease-in-out hover:-translate-y-0.5 hover:scale-110">ᴘᴀᴛᴄʜ ɴᴏᴛᴇꜱ</div></Link>

                <Link to='/items'><div className="hover:underline hover:opacity-80 text-white hover:text-stone-200 font-display text-md font-bold transition duration-300 ease-in-out hover:-translate-y-0.5 hover:scale-110">ɪᴛᴇᴍꜱ</div></Link>

                


            </div>

            
        </div>
        
        <div className="flex justify-end">
            <div className={`ml-5 mt-2 mr-5 mb-2 rounded-lg flex flex-col md:flex-row lg:flex-row xl:flex-row space-x-5 border-b-4 border-r-2 h-12 sm:h-flex px-4 ${gColors.stoneBackgroundGradient}`}>
                <a href="https://store.steampowered.com/" className="mt-2">
                <button className="transition duration-300 ease-in-out hover:-translate-y-0.5 hover:scale-110 hover:opacity-80 hover:cursor-pointer">
                    <div className={`rounded-sm h-7 w-22 flex flex-wrap`} style={{backgroundColor:gColors.deadLockLight}}>
                        <img className={`h- w-6 mt-0.5`} src={steam} />
                <h1 className="font-display font-bold text-lg mr-1 ml-1 hover:underline" style={{textDecorationColor:gColors.stoneBackgroundGradient}}>ʟᴏɢɪɴ</h1>
            </div>
                </button>
                </a>

                <div className="mr-2 flex flex-row space-x-3 mt-2">
                   <a href="https://discord.gg/rUYKVZeCYt"><img src={discord} className="w-7 h-flex transition duration-300 ease-in-out hover:-translate-y-0.5 hover:scale-110 hover:opacity-80" /></a>
                </div>

                <div className="mr-2 ml-2 mt-3">
                   <a href=""><img src={youtube} className="w-7 h-flex transition duration-300 ease-in-out hover:-translate-y-0.5 hover:scale-110 hover:opacity-80" /></a>
                </div>
            </div>
        </div>
        
    </section>        
    </>
    )
}


