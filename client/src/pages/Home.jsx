import globals from '../globals';

const gColors = globals.globalColors

import { MagnifyingGlassCircleIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

const Home = () => {
    return (
    <>
        <div className={`flex-1 flex flex-col mt-2 mb-2 ml-5 mr-10 p-2 border-b-4 border-l-2 border-r-1 border-black border-black rounded-lg text-center min-h-200 w-400 ${gColors.stoneBackgroundGradient}`} style={{}}>
        <h1 className="text-stone-200 text-3xl mt-10 mb-2">header</h1> 

            {/*Main*/}
            <div className="mb-10 mt-5 border-b-4 border-x-2 border-t-2 mx-5 bg-stone-900 rounded-lg w-[80%] self-center text-stone-500">

                {/*Steam Profile Search Bar*/}
                <div className="flex flex-row">
                    <MagnifyingGlassCircleIcon class="h-8 w-8 text-stone-400 mx-2 my-0.5" />
                    <input 
                    type="search"
                    placeholder="Search for Player Profile via SteamURL"
                    className="peer bg-inherit w-full text-white mx-0.5 focus:outline-none focus:ring-0 text-sm font-bold"
                    /> 
                </div>
            </div>

            {/*Preview of Site Functionality*/}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 ml-5 mr-5 gap-y-10 gap-x-2"> 
                
                {/*Most Recent Patch Notes*/}
                <div className="w-flex min-h-50 self-center text-center grid grid-rows-2 justify-center rounded-lg text-stone-500">
                    <h2 className="h-[50%] text-2xl text-stone-200 underline font-bold">ʀᴇᴄᴇɴᴛ ᴘᴀᴛᴄʜ</h2>
                    <div className="text-stone-200">INSERT PATCH NOTES EMBED HERE</div>
                </div>

                {/*Undecided*/}
                <div className="w-flex min-h-50 self-center text-center grid grid-rows-2 justify-center rounded-lg text-stone-500">
                    <h2 className="h-[50%] text-2xl text-stone-200 underline font-bold">ᴛɪᴛʟᴇ</h2>
                        <div className="text-stone-200"></div>
                </div>

                {/*Undecided*/}
                <div className="w-flex min-h-50 self-center text-center grid grid-rows-2 justify-center rounded-lg text-stone-500">
                    <h2 className="h-[50%] text-2xl text-stone-200 underline font-bold">ᴛɪᴛʟᴇ</h2>
                        <div className="text-stone-200"></div>
                </div>

                {/*Undecided*/}
                <div className="w-flex min-h-50 self-center text-center grid grid-rows-2 justify-center rounded-lg text-stone-500">
                    <h2 className="h-[50%] text-2xl text-stone-200 underline font-bold">ᴛɪᴛʟᴇ</h2>
                        <div className="text-stone-200"></div>
                </div>
                
            </div>
         </div>

        {/*Right Side AdSpace*/}
         <div className={`mt-2 mb-2 border-b-4 border-r-1 rounded-lg mr-5 w-[15%] ${gColors.stoneBackgroundGradient2}`}>
            AdSpace
         </div>
    </>
        
    )
}


export default Home