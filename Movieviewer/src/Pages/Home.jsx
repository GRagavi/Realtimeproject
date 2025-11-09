import { title } from "process";
import Moviecard from "../components/Moviecard";
import { useState } from "react";


function Home() {
    const [searchQuery, setSearchQuery]=useState("");
    
    const movies=[
            {id:1, title:"Vettaikaran", releaseyear:"2009", rating:"9"},
            {id:2, title:"Mersal", releaseyear:"2017", rating:"8"},
            {id:3, title:"Sarkar", releaseyear:"2018", rating:"7"},
            {id:4, title:"Bigil", releaseyear:"2019", rating:"8"},
            {id:5, title:"Master", releaseyear:"2021", rating:"9"}];

    function handleSearch(event){

    }

    return <div className="home-page">
                <form>
                    <input type="text" placeholder="Search movies..." className="search-form"/>
                    <button type="submit" onClick={handleSearch} className="search-button">Search</button>
                </form>
                <div className="movies-grid">
                    {
                        movies.map((movie)=>(
                            <Moviecard movie={movie} key={movie.id}/>
                        ))
                    }
                </div>
            </div>
}
export default Home;