import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Episodes = () => {
  const [episodes, setEpisodes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [seasonFilter, setSeasonFilter] = useState(''); // Estado para el filtro de temporada

  useEffect(() => {
    // Construye la URL de la API con el filtro de temporada
    let apiUrl = `https://rickandmortyapi.com/api/episode?page=${currentPage}`;

    if (seasonFilter) {
      apiUrl += `&episode=${seasonFilter}`;
    }

    axios
      .get(apiUrl)
      .then((response) => {
        setEpisodes(response.data.results);
        setTotalPages(response.data.info.pages);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, [currentPage, seasonFilter]);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleSeasonFilterChange = (event) => {
    setSeasonFilter(event.target.value);
    setCurrentPage(1); // Reinicia la página cuando cambia el filtro
  };

  return (
    <div className="container-md">
      <h1 className="mt-4">Rick and Morty Episodes</h1>
      <div className="mb-3">
        <label htmlFor="seasonFilter" className="form-label">
          Filter by Season:
        </label>
        <select
          id="seasonFilter"
          className="form-select"
          value={seasonFilter}
          onChange={handleSeasonFilterChange}
        >
          <option value="">All Seasons</option>
          <option value="S01">Season 1</option>
          <option value="S02">Season 2</option>
          <option value="S03">Season 3</option>
          <option value="S04">Season 4</option>
          <option value="S05">Season 5</option>
          {/* Puedes agregar más temporadas según sea necesario */}
        </select>
      </div>
      <div className="row">
        {episodes.map((episode) => (
          <div className="col-4 col-md-3 mb-4" key={episode.id}>
            <div className="card" style={{ maxWidth: '18rem' }}>
              <div className="card-body">
                <h5 className="card-title">{episode.name}</h5>
                <p className="card-text">Air Date: {episode.air_date}</p>
                <p className="card-text">Episode Code: {episode.episode}</p>
                {/* Puedes agregar más información del episodio aquí si es necesario */}
                <a href={episode.url} className="btn btn-primary">
                  View Episode
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
      <nav aria-label="...">
        <ul className="pagination justify-content-center">
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <a className="page-link" onClick={handlePreviousPage}>
              Previous
            </a>
          </li>
          <li
            className={`page-item ${
              currentPage === totalPages ? 'disabled' : ''
            }`}
          >
            <a className="page-link" onClick={handleNextPage}>
              Next
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Episodes;
