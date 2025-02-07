import { useState } from "react"
import patchData from '../assets/patch_notes.json'
import globals from '../globals';
const gColors = globals.globalColors



const categoryColors = {
    "Character Patches": "text-[#f0dfbf]",      
    "Weapon Item Patches": "text-[#d08d3e]", 
    "Vitality Item Patches": "text-[#74b01c]", 
    "Spirit Item Patches": "text-[#c288f0]",
    "General Updates": "text-[#f0dfbf]",         
};


const groupUpdates = (lines) => {
    const characterUpdates = {};
    const generalUpdates = [];

    lines.forEach(line => {
        const splitLine = line.split(":");
        const firstWord = splitLine[0]?.replace("-", "").trim();
        const updateText = splitLine.slice(1).join(":").trim();

        if (splitLine.length > 1 && /^[A-Z][a-z]+/.test(firstWord)) {
            if (!characterUpdates[firstWord]) {
                characterUpdates[firstWord] = [];
            }
            characterUpdates[firstWord].push(updateText);
        } else {
            generalUpdates.push(line);
        }
    });

    return { characterUpdates, generalUpdates };
};

export default function Patches() {
    const [patches] = useState(patchData);
    const [openPatch, setOpenPatch] = useState(null);
    const [visibleCount, setVisibleCount] = useState(5);

    const togglePatch = (index) => {
        setOpenPatch(openPatch === index ? null : index);
    }

    const loadMorePatches = () => {
        setVisibleCount(prevCount => prevCount + 5);
    }

    return (
        <>
            <div className={`flex-1 flex flex-col mt-2 ml-5 mr-10 p-2 border-b-4 border-l-2 border-r-1 border-stone-600 rounded-lg min-h-170 w-400 ${gColors.stoneBackgroundGradient3}`}>
                <h1 className="text-5xl font-bold mt-5 text-stone-200 forevs2 underline text-center">Patch Notes</h1>
                <div className="grid grid-cols-1 justify-center ml-5 mr-5 mb-5">
                    {patches.slice(0, visibleCount).map((patch, index) => (    
                        <div key={index} className="mt-5 space-y-1">
                            <button 
                                onClick={() => togglePatch(index)}
                                className="w-full text-left bg-stone-700 hover:bg-stone-700 p-3 rounded-md transition duration-200 ease-in-out hover:-translate-y-0.5 hover:scale-100"
                            >
                                <h3 className="text-stone-400 text-2xl forevs2">
                                    {patch.title}
                                </h3>
                                <span className="text-indigo-400 text-md forevs2">
                                    {openPatch === index ? "▲ Collapse" : "▼ Expand"}
                                </span>
                            </button>

                            {openPatch === index && (
                                <div className="p-4 border-l-4 border-b-2 border-stone-600 bg-stone-800 rounded-lg">
                                    <a href={patch.url} target="_blank" rel="noopener noreferrer" className="hover:underline text-indigo-400 text-md forevs2">
                                        Deadlock Forums Link
                                    </a>

                                    {Object.entries(patch.categories).map(([category, lines]) => (
                                        lines.length > 0 && (
                                            <div key={category} className="mt-4">
                                                <h4 className={`text-2xl font-bold underline forevs2 ${categoryColors[category] || "text-white"}`}>{category}:</h4>

                                                {(() => {
                                                    const { characterUpdates, generalUpdates } = groupUpdates(lines);

                                                    return (
                                                        <>
                                                            {Object.entries(characterUpdates).map(([character, updates]) => (
                                                                <div key={character} className="mt-3">
                                                                    <h5 className="text-xl font-bold text-stone-200 forevs2 underline">{character}</h5>
                                                                    <ul className="ml-6 space-y-0.5 text-lg text-stone-300 list-disc">
                                                                        {updates.map((update, idx) => (
                                                                            <li className="ml-2" key={idx}>{update}</li>
                                                                        ))}
                                                                    </ul>
                                                                </div>
                                                            ))}

                                                            {generalUpdates.length > 0 && (
                                                                <div>
                                                                    <ul className="ml-2 space-y-1 text-lg text-stone-300 list-disc">
                                                                        {generalUpdates.map((update, idx) => (
                                                                            <div className="ml-2 my-1" key={idx}>{update}</div>
                                                                        ))}
                                                                    </ul>
                                                                </div>
                                                            )}
                                                        </>
                                                    );
                                                })()}
                                            </div>
                                        )
                                    ))}
                                </div>
                            )}
                            <br />
                        </div>
                    ))}
                </div>
                <div className="flex justify-center mb-2">
                {visibleCount < patches.length && (
                    <button 
                        onClick={loadMorePatches}
                        className="m-2 text-indigo-400 forevs2 text-xl hover:underline transition duration-300 ease-in-out hover:-translate-y-0.5 hover:scale-110 hover:cursor-pointer"
                    >
                        Load More
                    </button>
                )}
                </div>
            </div>


    
            {/* AdSpace */}
            <div className={`mt-2 mb-2 border-b-4 border-r-1 rounded-lg mr-5 w-[15%] ${gColors.stoneBackgroundGradient2}`}>
                AdSpace
            </div>
        </>
        );
    }