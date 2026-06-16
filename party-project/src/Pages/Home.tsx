import { Link, useSearchParams } from "react-router-dom";
import { easeInOut, motion } from "motion/react"
import Button from "../Components/Button";

function Home() { // Home page that leads to the events guests are invited to 
    const [searchParams] = useSearchParams()
    const token = searchParams.get("token")

    // If the guest arrived via an invite link, then display their respective parties
    // Otherwise sends them to the general event page
    const eventsPath = token ? `/invite/${token}` : "/events"

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.3,
                ease: easeInOut,
            }
        }
    }
    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    }

    return (
        <motion.div
            className="flex flex-col items-center justify-start pt-32 2xl:pt-64 gap-2 text-white h-screen"
            variants={container}
            initial="hidden"
            animate="show"
        >
            <motion.p variants={item} className="text-xl text-mauve-700">
                Du är härmed inbjuden till...
            </motion.p>
            <motion.h1 variants={item} className="font-bold text-8xl text-mauve-700 m-2">
                Pauls födelsedagsfester
            </motion.h1>
            <motion.h1 variants={item} className="font-bold text-9xl text-pink-600 m-2">
                60 år
            </motion.h1>
            <motion.p variants={item} className="text-2xl text-mauve-600 p-4">
                Följ med på en oförglömlig upplevelse för att hylla sex fantastiska decennier
            </motion.p>

            <motion.div variants={item}>
                <Link to={eventsPath}>
                    <Button text={token ? "Se mina inbjudningar" : "Utforska alla fester"} />
                </Link>
            </motion.div>
        </motion.div>
    )
}

export default Home