import { useEffect, useState } from "react";
import { getMatchHistory } from "../../Util/ApiUtil";
import { getHeroMap } from "../../Util/ProfileUtil";
import rankData from '../../assets/rankings.json';
import souls from '../../assets/souls.png'

import globals from '../../globals';
import statlockLogo from '../../assets/statlock_logo2.png';
const gColors = globals.globalColors;

const Matches = ({ accountId }) => {
    const [matches, setMatches] = useState([]);
    const [heroes, setHeroes] = useState({});
    const [loading, setLoading] = useState(true);
    const [visibleMatches, setVisibleMatches] = useState(5);

    useEffect(() => {
        async function fetchData() {
            if (!accountId) return;
            setLoading(true);
            const history = await getMatchHistory(accountId);
            const heroData = await getHeroMap();
            setMatches(history);
            setHeroes(heroData);
            setLoading(false);
        }
        fetchData();
    }, [accountId]);

    const loadMoreMatches = () => {
        setVisibleMatches((prev) => prev + 5);
    };

    function getRankFromBadge(averageMatchBadge) {
        const rank = rankData.find((r, index) => {
            const nextRank = rankData[index + 1];
            return (
                averageMatchBadge >= r.tier * 10 &&
                (!nextRank || averageMatchBadge < nextRank.tier * 10)
            );
        });
    
        if (!rank) return null;
        
        const subrank = Math.min(Math.floor((averageMatchBadge % 10) / 2), 5) + 1; // Determine subrank
        return rank.images[`small_subrank${subrank}`] || rank.images.small;
    }
    return (
        <div className="rounded-lg text-stone-200 flex flex-col">
            {loading ? (
                <div className="flex justify-center items-center w-full py-10">
                    <img src={statlockLogo} className="w-50 h-50 animate-spin bg-stone-700 rounded-full" />
                </div>
            ) : matches.length === 0 ? (
                <p>No match history available.</p>
            ) : (
                <ul className="space-y-2 flex flex-col">
                    {matches.slice(0, visibleMatches).map((match, index) => {
                        const hero = heroes[match.hero_id] || { name: "Unknown Hero", image: "" };
                        const rankImage = getRankFromBadge(match.average_match_badge);
                        const kills = match.player_kills || 0;
                        const deaths = match.player_deaths || 0;
                        const assists = match.player_assists || 0;
                        const kda = deaths === 0 ? "Perfect" : ((kills + assists) / deaths).toFixed(2);

                        const matchDuration = Math.floor(match.match_duration_s / 60); 
                        const soulsPer10Min = matchDuration > 0 ? ((match.net_worth / matchDuration) * 1).toFixed(0) : "N/A";
                        
                        return (
                            <section key={index} className="flex">
                                <div className="">
                                    <div className="flex flex-row space-x-1">
                                        <p className="text-sm bg-stone-900 border-stone-500 w-flex p-1 border-x-2 border-t-1 text-center rounded-t-md forevs2">
                                            {match.match_id}
                                        </p>
                                    </div>

                                    <div className={`p-2 border-b-4 border-x-2 border-t-1 rounded-b-md rounded-r-md text-stone-200 flex space-x-3 bg-stone-900 flex-wrap border-stone-500`}>
                                        <div className="flex flex-col">
                                            {/* Hero Image */}
                                            <img
                                                src={hero.image}
                                                alt={hero.name}
                                                className={`w-14 h-14 rounded-lg border-y-2 border-x-1 mt-1 ${gColors.stoneBackgroundGradient}`} 
                                                style={{ borderColor: match.match_result === 1 ? "green" : "red" }}
                                                onError={(e) => e.currentTarget.style.display = 'none'}
                                            />

                                            {/* Rank Image */}
                                            {rankImage && (
                                                <img
                                                    src={rankImage}
                                                    alt="Rank Badge"
                                                    className={`w-flex h-10 rounded-lg mt-3 flex self-center`} 
                                                />
                                            )}

                                        </div>

                                        {/* Mode & KDA */}
                                        <div className="flex flex-col border-r-1 pr-3 border-stone-500 gap-y-0.5">
                                            <h2 
                                            style={{ color: match.match_result === 1 ? "green" : "red" }}
                                            className="forevs2 underline">{match.game_mode}</h2>
                                            <p className="forevs text-sm flex">
                                                <div className="font-bold text-center">
                                                    {match.player_kills} / {match.player_deaths} / {match.player_assists}
                                                    <div className="text-xs border-t-1 border-stone-500 text-center pt-0.5">{kda} KDA</div>
                                                    
                                                </div>
                                            </p>
                                        </div>
                                        
                                        {/* Match Stats */}
                                        <section className="flex justify-center mt-3 border-stone-500">
                                            <div className="flex flex-col">
                                                <div className="flex flex-row gap-x-1">
                                                    <img src={souls} className="ml-1" />
                                                    <p className="text-sm text-center forevs2 flex">{match.net_worth} </p>
                                                </div>
                                                
                                                <div className="text-sm text-center forevs2 mt-1 my-1 pt-1 border-t-1 border-stone-500">
                                                        {soulsPer10Min}
                                                        <div className="text-green-300">avg. souls / m</div>
                                                    </div>
                                                <p className="text-sm text-center forevs2 pt-1 border-t-1 border-stone-500">{matchDuration} mins</p>
                                            </div>
                                        </section>

                                        {/* Build / Items */}
                                        <section className="flex justify-end border-l-1 border-stone-500">
                                            <div className="flex flex-row mt-2 space-x-10 mx-5 my-2">

                                                {/* Weapon Items */}
                                                <div className="grid grid-cols-2 items-center text-center gap-2">
                                                    <div className="border-1 border-orange-400 w-12 h-12 rounded-md">
                                                        box
                                                    </div>
                                                    <div className="border-1 border-orange-400 w-12 h-12 rounded-md">
                                                        vox
                                                    </div>
                                                    <div className="border-1 border-orange-400 w-12 h-12 rounded-md">
                                                        vox
                                                    </div>
                                                    <div className="border-1 border-orange-400 w-12 h-12 rounded-md">
                                                        vox
                                                    </div>
                                                </div>

                                                {/* Vitality Items */}
                                                <div className="grid grid-cols-2 items-center text-center gap-2">
                                                    <div className="border-1 border-green-700 w-12 h-12 rounded-md">
                                                        box
                                                    </div>
                                                    <div className="border-1 border-green-700 w-12 h-12 rounded-md">
                                                        vox
                                                    </div>
                                                    <div className="border-1 border-green-700 w-12 h-12 rounded-md">
                                                        vox
                                                    </div>
                                                    <div className="border-1 border-green-700 w-12 h-12 rounded-md">
                                                        vox
                                                    </div>
                                                </div>

                                                {/* Spirit Items */}
                                                <div className="grid grid-cols-2 items-center text-center gap-2">
                                                    <div className="border-1 border-purple-400 w-12 h-12 rounded-md">
                                                        box
                                                    </div>
                                                    <div className="border-1 border-purple-400 w-12 h-12 rounded-md">
                                                        vox
                                                    </div>
                                                    <div className="border-1 border-purple-400 w-12 h-12 rounded-md">
                                                        vox
                                                    </div>
                                                    <div className="border-1 border-purple-400 w-12 h-12 rounded-md">
                                                        vox
                                                    </div>
                                                </div>
                                                
                                                {/* Flex Items */}
                                                <div className="grid grid-cols-2 items-center text-center gap-2">
                                                    <div className="border-1 border-stone-500 w-12 h-12 rounded-md">
                                                        box
                                                    </div>
                                                    <div className="border-1 border-stone-500 w-12 h-12 rounded-md">
                                                        vox
                                                    </div>
                                                    <div className="border-1 border-stone-500 w-12 h-12 rounded-md">
                                                        vox
                                                    </div>
                                                    <div className="border-1 border-stone-500 w-12 h-12 rounded-md">
                                                        vox
                                                    </div>
                                                </div>
                                            </div>
                                        </section>
                                    </div>
                                </div>
                            </section>
                        );
                    })}
                </ul>
            )}

            {/* Show More Button */}
            {visibleMatches < matches.length && (
                <button
                    onClick={loadMoreMatches}
                    className="mt-10 self-center text-stone-200 forevs2
                    transition duration-200 ease-in-out hover:scale-105 hover:underline hover:cursor-pointer hover:opacity-80"
                >
                    Show More Matches
                </button>
            )}
        </div>
    );
};

export default Matches;
