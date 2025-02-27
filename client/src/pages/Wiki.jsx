import React, { useEffect, useState } from 'react';
import { getHeroes } from '../Util/ApiUtil';
import globals from '../globals';

const gColors = globals.globalColors;

export default function Wiki() {
    const [heroes, setHeroes] = useState([]);
    const [activeSection, setActiveSection] = useState('CHARACTERS'); 
    const [activeHero, setActiveHero] = useState(null); // Stores the selected hero

    console.log(heroes)
    useEffect(() => {
        getAPIData();
    }, []);

    async function getAPIData() {
        const heroRes = await getHeroes();
        setHeroes(heroRes.filter((h) => !h.disabled));
    }

    function renderHeroData() {
        return (
            <div className="flex flex-row space-x-2 bg-stone-900 p-2 rounded-lg border-x-2 border-b-4 border-t-1 border-stone-600">
                {heroes.map((hero) => (
                    
                    <div
                        onClick={() => setActiveHero(hero)} // Update active hero on click
                        key={hero.id}
                        className={`rounded-lg 
                        hover:underline hover:opacity-80 transition duration-100 ease-in-out hover:-translate-y-0.5 hover:scale-100 hover:cursor-pointer ${
                            activeHero && activeHero.id === hero.id ? 'border-indigo-400 border-4 bg-stone-400' : 'border-stone-700 border-4 bg-stone-500'
                        }`}
                    >
                        <img
                            className="w-20"
                            src={hero.images.icon_image_small_webp}
                            alt={hero.name}
                        />
                    </div>
                ))}
            </div>
        );
    }

    function renderHeroContent() {
        if (!activeHero) {
            return <div className="text-stone-200 p-4">Select a hero to see details.</div>;
        }
    
        return (
            <>
            <div className="m-1 text-stone-200 h-full border-stone-500">
                <h2 className="text-4xl underline font-bold text-center forevs2">{activeHero.name}</h2>
                    <img className="w-40" src={activeHero.images?.icon_image_large_webp}/>
            </div>
            <section className="grid grid-cols-2 space-x-2">
                <div className="mt-4 p-3 border-t-2 border-stone-500 text-left bg-stone-900 p-4 rounded-md border-x-1 border-b-2">
                    <h3 className="forevs2 text-2xl underline text-stone-200 mb-1">Lore</h3>
                    <p className="text-stone-300 text-lg mb-5">{activeHero.description?.lore}</p>

                    <h3 className="forevs2 text-2xl underline text-stone-200 mb-1">Role</h3>
                    <p className="text-stone-300 text-lg mb-5">{activeHero.description?.role}</p>

                    <h3 className="forevs2 text-2xl underline text-stone-200 mb-1">Playstyle</h3>
                    <p className="text-stone-300 text-lg mb-5">{activeHero.description?.playstyle}</p>
                </div>

                <div className="mt-4 p-3 border-t-2 border-stone-500 text-left bg-stone-900 p-4 rounded-md border-x-1 border-b-2">
                    <h3 className="forevs2 text-2xl underline text-stone-200 mb-1 text-center">Top Builds</h3>
                </div>
            </section>
            </>
        );
    }

    function renderContent() {
        switch (activeSection) {
            case 'CHARACTERS':
                return (
                    <section>
                        <div className="flex flex-col space-y-5">
                            <nav>{renderHeroData()}</nav>
                            <div className="border-2 border-stone-900 rounded-lg bg-stone-800 p-4 ">
                                {renderHeroContent()}
                            </div>
                        </div>
                    </section>
                );
            case 'MECHANICS':
                return <div className="text-stone-200 p-4">Game Mechanics Information</div>;
            case 'META':
                return <div className="text-stone-200 p-4">Meta Strategies & Tier Lists</div>;
            case 'ITEMS':
                return <div className="text-stone-200 p-4">Item Builds & Descriptions</div>;
            default:
                return <div className="text-stone-200 p-4">Select a section from the navigation.</div>;
        }
    }

    return (
        <section className="flex self-center mt-5 w-full  mb-10 min-h-225">
            <div className={`flex flex-1 p-4 mx-10 rounded-lg border-x-2 border-b-4 border-t-1 border-stone-600  ${gColors.stoneBackgroundGradient2}`}>
                <section className="space-y-10">
                    <div className={`p-1 rounded-lg border-x-2 border-b-4 border-t-1 border-stone-600 h-flex w-full flex justify-start bg-stone-900`}>
                        <nav className="flex flex-col gap-y-3 text-stone-200 p-1 text-lg m-1 forevs2">
                            {['CHARACTERS', 'MECHANICS', 'META', 'ITEMS'].map((section) => (
                                <button
                                    key={section}
                                    className={`hover:underline hover:opacity-80 transition duration-200 ease-in-out hover:-translate-y-0.5 hover:scale-100 hover:cursor-pointer ${
                                        activeSection === section ? 'text-indigo-400' : ''
                                    }`}
                                    onClick={() => setActiveSection(section)}
                                >
                                    {section}
                                </button>
                            ))}
                        </nav>
                    </div>
                </section>

                <section className={`flex flex-1 mx-10 rounded-lg border-2 border-stone-600 ${gColors.stoneBackgroundGradient}`}>
                    <div className="flex justify-center text-center m-5 w-full">
                        {renderContent()}
                    </div>
                </section>
            </div>
        </section>
    );
}