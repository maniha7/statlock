import { useEffect, useState } from "react";
import PropTypes from 'prop-types';
import { getMatchHistory } from "../../Util/ApiUtil";
import { getHeroMap, getMatchMetaData } from "../../Util/ProfileUtil";
import rankData from '../../assets/rankings.json';
import souls from '../../assets/souls.png'

import globals from '../../globals';
import statlockLogo from '../../assets/statlock_logo2.png';
const gColors = globals.globalColors;

const maxPageSize = 10

const Matches = ({ accountId }) => {
    const [matches, setMatches] = useState([]);
    const [displayedMatches, setDisplayedMatches] = useState([])
    const [numMatchesLoaded, setNumMatchesLoaded] = useState(0)
    const [heroes, setHeroes] = useState({});
    const [initLoading, setInitLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false)
    const [moreToLoad, setMoreToLoad] = useState(true)

    useEffect(() => {
        async function fetchData() {

            if (!accountId) return;
            setInitLoading(true);   
            const history = await getMatchHistory(accountId);
            const heroData = await getHeroMap();
            setMatches(history);
            setHeroes(heroData);
            await getPageOfMatches(history)
            setInitLoading(false);
        }
        fetchData();
    }, [accountId]);

    async function loadMoreMatches(){ 
        setLoadingMore(true)
        await getPageOfMatches(matches)
        setLoadingMore(false)
    };


    async function getPageOfMatches(matchData){
        console.log("METADATA FETCH START")
        let i = numMatchesLoaded
        let pageSize = 0
        let newPageData = []
        //get the detailed data for the next page of matches so they can be displayed
        while(i<matchData.length && pageSize < maxPageSize){
            const matchToLoadID = matchData[i].match_id
            const metaData = await getMatchMetaData(matchToLoadID)
            console.log("metadata for match " + matchToLoadID)
            console.log(metaData)
            const matchToDisplay = {...matchData[i], ...metaData}
            newPageData.push(matchToDisplay)
            i++
            pageSize++
        }

        setDisplayedMatches([...displayedMatches, ...newPageData])

        if(i>=matchData.length){
            setMoreToLoad(false)
        }
        setNumMatchesLoaded(i)
        
    }

    function getRankFromBadge(averageMatchBadge) {
        const badgeStr = averageMatchBadge.toString()
        const baseRank = rankData[parseInt(badgeStr.substring(0, badgeStr.length-1))]
        const subRank = badgeStr.substring(badgeStr.length-1)
        const rankImg = baseRank.images[`small_subrank${subRank}`]
        return rankImg
    }


    return (
        <div className="rounded-lg text-stone-200 flex flex-col">
            {initLoading ? (
                <div className="flex justify-center items-center w-full py-10">
                    <img src={statlockLogo} className="w-50 h-50 animate-spin bg-stone-700 rounded-full" />
                </div>
            ) : matches.length === 0 ? (
                <p>No match history available.</p>
            ) : (
                <ul className="space-y-2 flex flex-col">
                    {displayedMatches.map((match, index) => {
                        const hero = heroes[match.hero_id] || { name: "Unknown Hero", image: "" };
                        const rankImage = getRankFromBadge(Math.round( (match.average_badge_team0 + match.average_badge_team1)/2 ));
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
                                            <div className="forevs text-sm flex">
                                                <div className="font-bold text-center">
                                                    {match.player_kills} / {match.player_deaths} / {match.player_assists}
                                                    <p className="text-xs border-t-1 border-stone-500 text-center pt-0.5">{kda} KDA</p>
                                                    
                                                </div>
                                            </div>
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
            {moreToLoad && 
                <div className="self-center">
                {loadingMore?

                    <div className="flex justify-center items-center w-full py-10">
                        <img src={statlockLogo} className="w-12 h-12 animate-spin bg-stone-700 rounded-full" />
                    </div>                    
                :
                    <button
                        onClick={()=>loadMoreMatches()}
                        className="mt-10 self-center text-stone-200 forevs2
                        transition duration-200 ease-in-out hover:scale-105 hover:underline hover:cursor-pointer hover:opacity-80"
                    >
                        Show More Matches
                    </button>
                    

                }
                </div>
            }
        </div>
    );
};
Matches.propTypes = {
    accountId: PropTypes.string.isRequired,
};

export default Matches;