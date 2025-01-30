import globals from '../globals';


const gColors = globals.globalColors

export default function Footer(){
    return(
        <>
        <div className={`mt-2 mb-2 ml-10 mr-10 p-2 border-b-4 border-black rounded-lg text-center ${gColors.stoneBackgroundGradient}`} style={{}}>
            Footer
        </div>
        
        </>
    )
}
