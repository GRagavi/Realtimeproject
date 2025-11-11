import '../css/Moviecard.css'
function Moviecard({movie}){
    
    function handleFavouriteClick(){
        alert(`Favourite clicked for movie: ${movie.title}`);
    }

    return <div className="movie-card">
            <img src={movie.url} alt={movie.title}/>
            <div className="movie-overlay">
                <button className="favourite-btn" onClick={handleFavouriteClick}>
                    ❤️
                </button>
            </div>
            <div className="movie-info">
                <h3>{movie.title}</h3>
                <p><strong>Release Year:</strong>{movie.releaseyear}</p>
                <p><strong>Rating:</strong> {movie.rating}/10</p>
            </div>
        </div>
}
export default Moviecard;