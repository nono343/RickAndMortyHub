import React, { useEffect, useState } from 'react';
import axios from 'axios';

const RickAndMortyData = () => {
  const [characters, setCharacters] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('name');
  const [filterValue, setFilterValue] = useState('');
  const [filterOptions, setFilterOptions] = useState([]);

  useEffect(() => {
    // Obtener las opciones de filtro avanzado desde la API
    axios
      .get('https://rickandmortyapi.com/api/character')
      .then((response) => {
        const filterOptions = {
          status: [],
          species: [],
          type: [],
          gender: [],
          location: [],
        };

        response.data.results.forEach((character) => {
          filterOptions.status.push(character.status);
          filterOptions.species.push(character.species);
          filterOptions.type.push(character.type);
          filterOptions.gender.push(character.gender);
          filterOptions.location.push(character.location.name);
        });

        // Eliminar duplicados y ordenar
        for (const option in filterOptions) {
          filterOptions[option] = [...new Set(filterOptions[option])].sort();
        }

        setFilterOptions(filterOptions);
      })
      .catch((error) => {
        console.error('Error fetching filter options:', error);
      });
  }, []);

  useEffect(() => {
    // Realizar la búsqueda
    handleSearch();
  }, [currentPage, selectedFilter, filterValue]);

  const handleSearch = () => {
    let apiUrl = `https://rickandmortyapi.com/api/character/?name=${searchTerm}&page=${currentPage}`;

    if (selectedFilter !== 'name' && filterValue) {
      apiUrl += `&${selectedFilter}=${filterValue}`;
    }

    axios
      .get(apiUrl)
      .then((response) => {
        setCharacters(response.data.results);
        setTotalPages(response.data.info.pages);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  };

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

  return (
    <div className="container-md">
      <form className="d-flex" role="search">
        <input
          className="form-control me-2"
          type="search"
          placeholder="Search by name"
          aria-label="Search"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
        <select
          className="form-select"
          value={selectedFilter}
          onChange={(event) => setSelectedFilter(event.target.value)}
        >
          <option value="name">Name</option>
          <option value="status">Status</option>
          <option value="species">Species</option>
          <option value="type">Type</option>
          <option value="gender">Gender</option>
          <option value="location">Location</option>
        </select>
        {selectedFilter !== 'name' && (
          <select
            className="form-select"
            value={filterValue}
            onChange={(event) => setFilterValue(event.target.value)}
          >
            <option value="">Select an option</option>
            {filterOptions[selectedFilter].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        )}

        <button
          className="btn btn-outline-success"
          type="button"
          onClick={handleSearch}
        >
          Search
        </button>
      </form>

      <h1 className="mt-4">Rick and Morty Characters</h1>
      <div className="row">
        {characters.map((character) => (
          <div className="col-4 col-md-3 mb-4" key={character.id}>
            <div className="card" style={{ maxWidth: '18rem' }}>
              <img
                src={character.image}
                className="card-img-top"
                alt={character.name}
              />
              <div className="card-body">
                <h5 className="card-title">{character.name}</h5>
                <p className="card-text">Status: {character.status}</p>
                <p className="card-text">Species: {character.species}</p>
                {/* Agrega más información del personaje aquí si es necesario */}
                <a href="#" className="btn btn-primary">
                  Ir al perfil
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
      {!searchTerm && (
        <nav aria-label="...">
          <ul className="pagination justify-content-center">
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button
                className="page-link"
                onClick={handlePreviousPage}
              >
                Previous
              </button>
            </li>
            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
              <button
                className="page-link"
                onClick={handleNextPage}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
};

export default RickAndMortyData;
