import globals from '../globals';


import { Link } from "react-router-dom";

const gColors = globals.globalColors

export default function Footer(){
    return(

        <div className="self-center">
            <div className={`mt-2 mb-2 p-2 border-b-4 border-black w-[100%] px-10 text-lg font-bold border-stone-800`} style={{}}>
                <div className="text-white flex flex-col sm:flex-col md:flex-row lg:flex-row xl:flex-row justify-center font-display">

                    <Link to='/privacy'><div className="mx-10 hover:underline hover:opacity-80 hover:text-stone-200 transition duration-300 ease-in-out hover:-translate-y-0.5 hover:scale-110">ᴘʀɪᴠᴀᴄʏ</div></Link>

                    <Link to='/support'><div className="mx-10 hover:underline hover:opacity-80 hover:text-stone-200 transition duration-300 ease-in-out hover:-translate-y-0.5 hover:scale-110">ꜱᴜᴘᴘᴏʀᴛ</div></Link>

                    <Link to='/about'><div className="mx-10 hover:underline hover:opacity-80 hover:text-stone-200 transition duration-300 ease-in-out hover:-translate-y-0.5 hover:scale-110">ᴀʙᴏᴜᴛ</div></Link>

                    <Link to='/contact'><div className="mx-10 hover:underline hover:opacity-80 hover:text-stone-200 transition duration-300 ease-in-out hover:-translate-y-0.5 hover:scale-110">ᴄᴏɴᴛᴀᴄᴛ</div></Link>

                </div>
            </div>
        </div>

    )
}
