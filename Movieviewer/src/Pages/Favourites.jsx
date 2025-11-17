
import '../css/Favourites.css'
import {useMovieContext} from '../contexts/Moviecontext.jsx';
import Moviecard from '../components/Moviecard.jsx';


function Favourites(){
    const {favourites} = useMovieContext();

    if(favourites.length > 0){
        return <div className="Favourites-page">
            <h1>Favourites Page</h1>
            <p>Your favourites are here...</p>
            <div className="movies-grid">
                {favourites.map((movie) => <Moviecard key={movie.id} movie={movie}/>)} 
            </div>
        </div>
    }

    return <div className="Favourites-empty">
              <h1>Favourites Page</h1>
              <p>Please add your favourites here...</p>
            </div>   
}

export default Favourites;