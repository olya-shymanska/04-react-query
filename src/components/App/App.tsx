import { useEffect, useState } from "react";
import type { Movie } from "../../types/movie";
import fetchMovies from "../../services/movieService";
import SearchBar from "../SearchBar/SearchBar";
import { Toaster, toast } from "react-hot-toast";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";
import css from './App.module.css'
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import ReactPaginate from 'react-paginate';

export default function App() {
    const [topic, setTopic] = useState(''); 
    const [page, setPage] = useState(1);
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

    const {data, isError, isLoading, isSuccess} = useQuery({
        queryKey: ['movies', topic, page],
        queryFn: () => fetchMovies(topic, page),
        enabled: topic !== '',
        placeholderData: keepPreviousData,
    })

    const handleSearch = (topic: string) => {
        setTopic(topic);
        setPage(1);
    }

    useEffect(() => {
        if (isSuccess && data.movies.length === 0) {
            toast.error('No movies found for your request.')
        }
    }, [isSuccess, data]);

    const totalPages = data?.totalPages ?? 0;

    const openModal = (movie: Movie) => setSelectedMovie(movie); 
    const closeModal = () => setSelectedMovie(null);

    return (
        <div className={css.app}>
            <SearchBar onSubmit={handleSearch} />
            { isSuccess && totalPages && totalPages > 1  && (<ReactPaginate pageCount={totalPages}
                pageRangeDisplayed={5}
                marginPagesDisplayed={1}
                onPageChange={({ selected }) => setPage(selected + 1)}
                forcePage={page - 1}
                containerClassName={css.pagination}
                activeClassName={css.active}
                nextLabel="→"
                previousLabel="←"
            />)}
            {isLoading &&  <Loader />}
            {isError && <ErrorMessage />}
            {isSuccess && (data.movies.length > 0 &&  (<MovieGrid movies={data.movies} onSelect={openModal} />) ) }
            <Toaster />
            {selectedMovie && <MovieModal movie={selectedMovie} onClose={closeModal} />}
        </div>
    )
}
