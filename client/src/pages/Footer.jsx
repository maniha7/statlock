import globals from '../globals';

import { Link } from "react-router-dom";

const gColors = globals.globalColors

export default function Footer(){
    return(
        <>
        <div className="self-center">
            <div className={`mt-2 mb-2 p-2 border-b-4 border-black rounded-lg w-[100%] px-10 ${gColors.stoneBackgroundGradient}`} style={{}}>
                <div className="text-white space-x-20 flex flex-col md:flex-row lg:flex-row xl:flex-row justify-center">

                    <Link to='/privacy'><div className="hover:underline hover:opacity-80 hover:text-stone-200 ">ᴘʀɪᴠᴀᴄʏ</div></Link>

                    <Link to='/support'><div className="hover:underline hover:opacity-80 hover:text-stone-200 ">ꜱᴜᴘᴘᴏʀᴛ</div></Link>

                    <Link to='/about'><div className="hover:underline hover:opacity-80 hover:text-stone-200 ">ᴀʙᴏᴜᴛ</div></Link>

                    <Link to='/contact'><div className="hover:underline hover:opacity-80 hover:text-stone-200 ">ᴄᴏɴᴛᴀᴄᴛ</div></Link>

                </div>
            </div>
        </div>
        </>
    )
}
