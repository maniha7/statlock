import { useEffect, useState } from "react";
import { getMatchHistory } from "../../Util/ApiUtil";
import { getHeroMap } from "../../Util/ProfileUtil";
import rankData from '../../assets/rankings.json';

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
                        
                        return (
                            <section key={index} className="flex">
                                <div className="">
                                    <div className="flex flex-row">
                                        <p className="text-sm bg-stone-900 border-stone-500 w-flex p-1 border-x-2 border-t-1 text-center rounded-t-md forevs2">{match.match_id}</p>
                                    </div>
                                    <div className={`p-2 border-b-4 border-x-2 border-t-1 rounded-b-md rounded-r-md text-stone-200 flex space-x-3 bg-stone-900 flex-wrap border-stone-500`}>
                                        <div className="flex flex-col">
                                            {/* Hero Image */}
                                            <img
                                                src={hero.image}
                                                alt={hero.name}
                                                className={`w-12 h-12 rounded-lg border-y-2 border-x-1 ${gColors.stoneBackgroundGradient}`} 
                                                style={{ borderColor: match.match_result === 1 ? "green" : "red" }}
                                                onError={(e) => e.currentTarget.style.display = 'none'}
                                            />

                                            {/* Rank Image */}
                                            {rankImage && (
                                                <img
                                                    src={rankImage}
                                                    alt="Rank Badge"
                                                    className={`w-flex h-8 rounded-lg mt-2`} 
                                                />
                                            )}

                                        </div>
                                        <div className="">
                                            <h2 
                                            style={{ color: match.match_result === 1 ? "green" : "red" }}
                                            className="forevs2 underline">{match.game_mode}</h2>
                                            <p className="forevs text-sm flex">
                                                <div className="font-bold">
                                                    {match.player_kills} / {match.player_deaths} / {match.player_assists}
                                                </div>
                                            </p>
                                        </div>

                                        <div className="flex justify-end">
                                            test
                                        </div>
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
