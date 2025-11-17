import {createContext, useEffect, useContext, useState} from "react";
const Moviecontext = createContext();
export const useMovieContext = () => useContext(Moviecontext);


export const MoviecontextProvider = ({children}) => {
    const [favourites, setFavourites] = useState([]);
    useEffect(()=>{
        const storedFavourites = localStorage.getItem("favourites");
        if(storedFavourites) setFavourites(JSON.parse(storedFavourites));
    },[]);

     useEffect(()=>{localStorage.setItem("favourites", JSON.stringify(favourites))},
               [favourites]);
    
    const addToFavourites = (movie) => {
        setFavourites((prevFavourites) => [...prevFavourites, movie]);
    }
    const removeFromFavouites = (movieID) =>{
        setFavourites((prevFavourites) => prevFavourites.filter(movie => movie.id !== movieID));

    }
    const isFavourite = (movieID)=>{

        return favourites.some(movie => movie.id === movieID);
    }

    const value = {favourites, addToFavourites, removeFromFavouites, isFavourite};

    return <Moviecontext.Provider value={value}>
        {children}
    </Moviecontext.Provider>

}