import { useState } from "react";
import type { Movie } from "../../types/movie";
import fetchMovies from "../../services/movieService";
import SearchBar from "../SearchBar/SearchBar";
import { Toaster, toast } from "react-hot-toast";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";
import css from './App.module.css'

export default function App() {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [isLoading, setIsLoading] = useState(false); 
    const [isError, setIsError] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

    const handleSearch = async (searchTopic: string) => {
        try {
            setIsError(false); 
            setMovies([]);
        setIsLoading(true);
        const newMovies = await fetchMovies(searchTopic);
        if (newMovies.length === 0) {
            toast.error('No movies found for your request.')
        } else {
            setMovies(newMovies);
        }
        } catch {
            setIsError(true);
        }
        finally {
            setIsLoading(false);
        }
    }

    const openModal = (movie: Movie) => setSelectedMovie(movie); 
    const closeModal = () => setSelectedMovie(null);

    return (
        <div className={css.app}>
            <SearchBar onSubmit={handleSearch} />
            {isError ? <ErrorMessage /> : isLoading ? <Loader /> : <MovieGrid movies={movies} onSelect={openModal} />}
            <Toaster />
           { selectedMovie && <MovieModal movie={selectedMovie} onClose ={closeModal} />}
        </div>
    )
}