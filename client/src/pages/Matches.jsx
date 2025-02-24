import { useEffect, useState } from "react";
import { getMatchHistory } from "../Util/ApiUtil";
import { getHeroMap } from "../Util/ProfileUtil";

import globals from '../globals';
import statlockLogo from '../assets/statlock_logo2.png'; // Ensure correct import path
const gColors = globals.globalColors;

const Matches = ({ accountId }) => {
    const [matches, setMatches] = useState([]);
    const [heroes, setHeroes] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            if (!accountId) return;
            setLoading(true);
            const history = await getMatchHistory(accountId);
            const heroData = await getHeroMap(); // Fetch hero names & images
            setMatches(history);
            setHeroes(heroData);
            setLoading(false);
        }

        fetchData();
    }, [accountId]);

    return (
        <div className={`rounded-lg text-stone-200 flex`}>
            {loading ? (
                // Centered Spinning Logo While Loading
                <div className="flex justify-center items-center w-full py-10">
                    <img 
                        src={statlockLogo} 
                        className="w-50 h-50 animate-spin"
                    />
                </div>
            ) : matches.length === 0 ? (
                <p>No match history available.</p>
            ) : (
                <ul className="space-y-2 flex flex-col">
                    {matches.map((match, index) => {
                        const hero = heroes[match.hero_id] || { name: "Unknown Hero", image: "" };

                        return (
                            <section key={index}>
                                <div className="">
                                    <div className="flex flex-row">
                                        <p className="text-sm bg-stone-900 border-stone-500 w-flex p-1 border-x-2 border-t-1 text-center rounded-t-md forevs2">{match.match_id}</p>
                                    </div>
                                    <li className={`p-2 border-b-4 border-x-2 border-t-1 rounded-b-md rounded-r-md text-stone-200 border-stone-500 flex space-x-3 bg-stone-900 flex-col`}>
                                        
                                        {/* Hero Image */}
                                        <img
                                            src={hero.image}
                                            alt={hero.name}
                                            className={`w-12 h-12 rounded-lg border-y-2 border-x-1 ${gColors.stoneBackgroundGradient}`} /* Make Border Color Based on Win/Loss */
                                            onError={(e) => e.currentTarget.style.display = 'none'} // Hide if image fails to load
                                        />

                                        {/* Hero Name & Match Details */}
                                        <div className="">
                                            <p className="text-lg font-bold">{hero.name}</p>
                                            <p>KDA: {match.kills}/{match.deaths}/{match.assists}</p>
                                        </div>
                                    </li>
                                </div>
                            </section>
                        );
                    })}
                </ul>
            )}
        </div>
    );
};

export default Matches;