import { Link } from "react-router-dom";

function Home() {
    return(
        <div className="flex flex-col items-center justify-start pt-64 gap-2 text-white " >
            <p className="text-xl text-mauve-600 ">Du är härmed inbjuden till...</p>
            <h1 className="font-bold text-8xl text-mauve-600 m-2 " >Pauls födelsedagsfester</h1>
            <h1 className="font-bold text-8xl text-pink-500 m-2 " >60 år</h1>
            <p className="text-2xl text-mauve-600 p-4" >Följ med på en oförglömlig upplevelse för att hylla sex fantastiska decennier. </p>
            <Link to="/events">
                <button className="font-semibold text-2xl bg-pink-500 hover:bg-pink-600 hover:scale-110 py-4 px-8 rounded-2xl transition duration-200 mt-8" >Utforska alla fester</button>
            </Link>
        </div>
    )
}

export default Home