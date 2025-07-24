import axios from "axios";
import type { Movie } from "../types/movie";
const token = import.meta.env.VITE_TMDB_TOKEN;

interface FetchMoviesParams {
    query: string;
    page: number;
};

interface FetchMoviesResponse {
    results: Movie[];
    total_pages: number;
};


export default async function fetchMovies(query: string, page: number): Promise<{movies: Movie[]; totalPages: number}> {

    const myParams: { params: FetchMoviesParams; headers: {Authorization: string}} = {
        params: {
            query: query,
            page: page,
        },
        headers: {
            Authorization: `Bearer ${token}`,
          }
    };

    const response = await axios.get<FetchMoviesResponse>('https://api.themoviedb.org/3/search/movie', myParams);
    return {
        movies: response.data.results,
        totalPages: response.data.total_pages,
    };
};