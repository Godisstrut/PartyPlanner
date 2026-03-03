import { Link } from "react-router-dom";

function Home() {
    return(
        <div className="flex flex-col items-center justify-center gap-4 h-screen bg-mist-900 text-white " >
            <h4 className="font-bold text-4xl ">Välkommen</h4>
            <h1 className="font-bold text-6xl text-amber-400 m-2 " >Du är inbjuden till Pauls 60års firande!</h1>
            <Link to="/events">
                <button className="text-2xl bg-orange-400 hover:bg-orange-600 py-4 px-4 rounded-2xl transition-colors m-4 " >Utforska alla fester</button>
            </Link>
        </div>
    )
}

export default Home