type ButtonProps = {
    text: string
}

function Button({ text }: ButtonProps) {
    return(
        <button className="font-semibold text-white text-2xl bg-pink-500 hover:bg-pink-600 hover:scale-110 py-4 px-8 rounded-2xl transition duration-200 mt-8" >
            {text}
        </button>
    )
}

export default Button