import globals from '../globals';

const gColors = globals.globalColors


const Home = () => {
    return (
    <>
        <div className={`mt-2 mb-2 ml-5 mr-10 p-2 border-b-4 border-l-1 border-black rounded-lg text-center w-400 ${gColors.stoneBackgroundGradient2}`} style={{}}>
            <div className="text-3xl mt-10 font-display">
                Test
            </div>
         </div>

         <div className={`mt-2 mb-2 border-b-4 border-r-1 rounded-lg mr-5 w-[15%] ${gColors.stoneBackgroundGradient2}`}>
            AdSpace
         </div>
    </>
        
    )
}


export default Home