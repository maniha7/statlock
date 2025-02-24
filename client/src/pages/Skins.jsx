import globals from '../globals';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
const gColors = globals.globalColors;

const Skins = () => {
    const [mods, setMods] = useState([]);

    useEffect(() => {
        fetch('/assets/mods/saveModInfo.json')
            .then(response => response.json())
            .then(data => setMods(data))
            .catch(error => console.error('Error fetching mods:', error));
    }, []);

    return (
        <>
            <section className={`self-center border-b-4 border-l-2 border-r-1 border-stone-600 rounded-lg md:mx-10 lg:mx-20 xl:mx-20 min-h-210  ${gColors.stoneBackgroundGradient}`} style={{ width: "100%" }}>
                <div className="flex justify-center items-center p-5 border-b-2 mx-10 border-stone-600 mb-5">
                    <div className="flex flex-row space-x-5">
                    {/* Link to Upload Guidelines */}
                    <Link><h1 
                        className="text-center mt-3 forevs2 text-lg text-stone-300
                        transition duration-200 ease-in-out hover:-translate-y-0.5 hover:scale-100 hover:underline"
                        >Upload Guidelines</h1></Link>
                        {/* Upload Functionality */}
                        <button 
                        className={`forevs2 text-stone-200 bg-stone-800 p-2 rounded-lg border-y-2 border-x-1 border-stone-300
                        transition duration-200 ease-in-out hover:-translate-y-0.5 hover:scale-100 hover:underline ${gColors.stoneBackgroundGradient}`}
                        >
                            <Link to="/modupload">
                                ᴜᴘʟᴏᴀᴅ ᴀ ꜱᴋɪɴ
                            </Link>
                        </button>
                        {/* Link to Installation Guide */}
                        <Link to="/modinstall"><h1 
                        className="text-center mt-3 forevs2 text-lg text-stone-300
                        transition duration-200 ease-in-out hover:-translate-y-0.5 hover:scale-100 hover:underline"
                        >Installation Guide</h1></Link>
                        <p className="text-center"></p>

                    </div>
                </div>
                {/* Mod Display Start */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-10 bg-stone-800 mx-10 rounded-lg border-1">
                    {mods.length > 0 ? mods.map((mod, index) => (
                        <div key={index} className={`border-4 rounded-lg border-black text-center p-4 ${gColors.stoneBackgroundGradient2}`}>
                            <div className="h-40 bg-stone-500 rounded mb-4">
                                <img src={`/assets/mods/${mod.fileName}`} alt={mod.title} className="h-full w-full object-cover rounded" />
                            </div>
                            <h2 className="text-xl font-semibold text-white">{mod.title}</h2>
                            <p className="text-gray-400">By {mod.description}</p>
                            <button className="mt-4 bg-indigo-700 hover:bg-indigo-400 text-white font-bold py-1 px-3 rounded hover:cursor-pointer">
                                <a href={`/assets/mods/${mod.fileName}`} download>Download</a>
                            </button>
                        </div>
                    )) : (
                        <p className="text-white text-center col-span-full">No mods uploaded yet. Be the first to upload!</p>
                    )}
                </div>
            </section>
        </>
    );
};

export default Skins;