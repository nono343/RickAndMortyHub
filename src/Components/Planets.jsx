import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Locations = () => {
  const [locations, setLocations] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('name');
  const [filterValue, setFilterValue] = useState('');
  const [filterOptions, setFilterOptions] = useState({ type: [], dimension: [] });

  useEffect(() => {
    axios
      .get('https://rickandmortyapi.com/api/location')
      .then((response) => {
        const options = {
          type: [],
          dimension: [],
        };

        response.data.results.forEach((location) => {
          options.type.push(location.type);
          options.dimension.push(location.dimension);
        });

        for (const option in options) {
          options[option] = [...new Set(options[option])].sort();
        }

        setFilterOptions(options);
      })
      .catch((error) => {
        console.error('Error fetching filter options:', error);
      });
  }, []);

  useEffect(() => {
    handleSearch();
  }, [currentPage, selectedFilter, filterValue, searchTerm]);

  const handleSearch = () => {
    let apiUrl = `https://rickandmortyapi.com/api/location/?name=${searchTerm}&page=${currentPage}`;

    if (selectedFilter !== 'name' && filterValue) {
      apiUrl += `&${selectedFilter}=${filterValue}`;
    }

    axios
      .get(apiUrl)
      .then((response) => {
        setLocations(response.data.results);
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

  const handleFilterChange = (event) => {
    setSelectedFilter(event.target.value);
    setFilterValue('');
  };

  const handleFilterValueChange = (event) => {
    setFilterValue(event.target.value);
  };

  return (
    <div className="container-md">
      <form className="d-flex" role="search">
        <select
          className="form-select"
          value={selectedFilter}
          onChange={(event) => handleFilterChange(event)}
        >
          <option value="name">Name</option>
          {Object.keys(filterOptions).map((option) => (
            <option key={option} value={option}>
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </option>
          ))}
        </select>
        {selectedFilter !== 'name' && (
          <select
            className="form-select"
            value={filterValue}
            onChange={(event) => handleFilterValueChange(event)}
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

      <h1 className="mt-4">Rick and Morty Locations</h1>
      <div className="row">
        {locations.map((location) => (
          <div className="col-4 col-md-3 mb-4" key={location.id}>
            <div className="card" style={{ maxWidth: '18rem' }}>
              <img
                src={location.image}
                className="card-img-top"
                alt={location.name}
              />
              <div className="card-body">
                <h5 className="card-title">{location.name}</h5>
                <p className="card-text">Type: {location.type}</p>
                <p className="card-text">Dimension: {location.dimension}</p>
                {/* Puedes agregar más información de la ubicación aquí si es necesario */}
                <a href="#" className="btn btn-primary">
                  Go somewhere
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
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
          <li
            className={`page-item ${
              currentPage === totalPages ? 'disabled' : ''
            }`}
          >
            <button
              className="page-link"
              onClick={handleNextPage}
            >
              Next
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Locations;
