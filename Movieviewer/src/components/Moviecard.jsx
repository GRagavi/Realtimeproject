import '../css/Moviecard.css'
import { useMovieContext } from '../contexts/Moviecontext';

function Moviecard({movie}){
    
    const {favourites, addToFavourites, removeFromFavouites, isFavourite} = useMovieContext();
    const favourite = isFavourite(movie.id);
    function handleFavouriteClick(e){
        e.preventDefault();
        if(favourite){
            removeFromFavouites(movie.id);
        }else{
            addToFavourites(movie);
        }
    }

    return <div className="movie-card">
            <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title}/>
            <div className="movie-overlay">
                <button className={`favourite-btn ${favourite? "active" : ""}`} onClick={handleFavouriteClick}>
                    ❤️
                </button>
            </div>
            <div className="movie-info">
                <h3>{movie.title}</h3>
                <p><strong>Release Year:</strong>{movie.release_date?.split("-")[0]}</p>
                <p><strong>Rating:</strong> {movie.rating}/10</p>
            </div>
        </div>
}
export default Moviecard;