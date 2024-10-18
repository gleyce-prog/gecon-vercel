import React, { useState, useEffect } from 'react';
import { Table, Form, Pagination } from 'react-bootstrap';
import Buttons from './Buttons/Ações';
import { api } from '../lib/Axios';

const PaginationControls = ({ currentPage, totalItems, itemsPerPage, onPageChange }) => {
  const indexOfLastItem = currentPage * itemsPerPage;
  const pageNumbers = Array.from({ length: Math.ceil(totalItems / itemsPerPage) }, (_, index) => index + 1);

  return (
    <div className="d-flex align-items-center justify-content-between">
      <span>Mostrando {Math.min(indexOfLastItem, totalItems)} de {totalItems} itens</span>
      <Pagination>
        <Pagination.Prev onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} />
        {pageNumbers.map(number => (
          <Pagination.Item key={number} active={number === currentPage} onClick={() => onPageChange(number)}>
            {number}
          </Pagination.Item>
        ))}
        <Pagination.Next onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === Math.ceil(totalItems / itemsPerPage)} />
      </Pagination>
    </div>
  );
};

const handleSearch = (data, searchTerm, setFilteredData, setCurrentPage) => {
  const filteredResults = filterData(data, searchTerm || '');
  setFilteredData(filteredResults);
  setCurrentPage(1);
};

const filterData = (data, searchTerm) => {
  const regex = new RegExp(searchTerm.split(/\s+/).map(term => `(${term})`).join('.*'), 'i');
  return data.filter(item => {
    for (let key in item) {
      const value = item[key];
      if (value !== null && value !== undefined && regex.test(value.toString())) {
        return true;
      }
    }
    return false;
  });
};

const normalizeString = (str) => {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
};

const handleSort = (columnValue, sortColumn, sortDirection, setSortColumn, setSortDirection) => {
  if (columnValue === sortColumn) {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  } else {
    setSortColumn(columnValue);
    setSortDirection('asc');
  }
};

const sortData = (data, sortColumn, sortDirection) => {
  const sortedData = [...data];
  if (sortColumn) {
    sortedData.sort((a, b) => {
      const columnA = a[sortColumn];
      const columnB = b[sortColumn];

      if (columnA === undefined || columnB === undefined) return 0;

      // Verifique se ambos os valores são números
      const isNumberA = !isNaN(columnA) && columnA !== null && columnA !== '';
      const isNumberB = !isNaN(columnB) && columnB !== null && columnB !== '';

      if (isNumberA && isNumberB) {
        return sortDirection === 'asc' ? columnA - columnB : columnB - columnA;
      } else {
        return sortDirection === 'asc'
          ? columnA.toString().localeCompare(columnB.toString())
          : columnB.toString().localeCompare(columnA.toString());
      }
    });
  }
  return sortedData;
};

const fetchData = (setData, setFilteredData, setOriginalData, currentPage, itemsPerPage, sortDirection) => {
  let currentItems = [];
  try {
    api(true).get(`/usuario?pageNumber=${currentPage}&pageSize=${itemsPerPage}&sortType=${sortDirection}`)
      .then(response => {

        const totalItems = Math.ceil(response.data.total / itemsPerPage);
        currentItems = response.data.items;
        const loadNextPages = async () => {
          for (let i = 2; i <= totalItems; i++) {
            const nextResponse = await api(true).get(`/usuario?pageNumber=${i}&pageSize=${itemsPerPage}&sortType=${sortDirection}`);
            currentItems = currentItems.concat(nextResponse.data.items);
          }
          const sortedData = [...currentItems].sort((a, b) => a.id - b.id); // Ordena os dados pelo id
          setData(sortedData);
          setFilteredData(sortedData);
          setOriginalData(sortedData);
        }
        loadNextPages();
      })
      .catch(error => console.error('Erro:', error));

  } catch (error) {
    console.error('Erro ao buscar os dados:', error);
  }
};

const TableComponent = ({ apiUrl, columns, title, ModalComponents, dados, showHeader = true, showPagination = true }) => {
  const [originalData, setOriginalData] = useState([]); // Novo estado para dados originais
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [activeModalIndex, setActiveModalIndex] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const itemsPerPageOptions = [10, 20, 30, 40];

  useEffect(() => {
    if (apiUrl) {
      fetchData(setData, setFilteredData, setOriginalData, currentPage, itemsPerPage, sortDirection);
    } else {
      setData(dados);
      setFilteredData(dados);
    }
  }, [apiUrl]);

  const handleSearchChange = (event) => {
    const term = event.target.value.trim();
    setSearchTerm(term);
    handleSearch(originalData, term, setFilteredData, setCurrentPage); // Use os dados originais
  };

  const resetFilters = () => {
    setFilteredData(originalData); // Resetar para os dados originais
    setCurrentPage(1);
    setSearchTerm(''); // Limpar o termo de pesquisa
  };

  const sortedData = sortData(filteredData, sortColumn, sortDirection);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem);

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleShowModal = (index, item = null) => {
    setActiveModalIndex(index);
    setSelectedItem(item);
  };

  const handleCloseModal = () => {
    setActiveModalIndex(null);
    setSelectedItem(null);
  };

  return (
    <div className="container">
      <div className="col-xl-12">
        <div className="card dz-card" id="accordion-three">
          <div className="card-header flex-wrap d-flex justify-content-between align-items-center">
            <div>
              <h4 className="card-title">Listar {title.concat("s")}</h4>
            </div>
            <div className="d-flex align-items-center">
              <Buttons variant="primary" onClick={() => handleShowModal(0)} rota={`/${normalizeString(title)}-cadastrar`} type={'cadastrar'} title={title} />
            </div>
          </div>
          {showHeader && (
            <>
              <div className="d-flex align-items-center justify-content-between">
                <Form.Group className="mb-3" style={{ marginLeft: '20px' }}>
                  <Form.Label>Itens por página</Form.Label>
                  <Form.Select
                    onChange={(e) => handleItemsPerPageChange(parseInt(e.target.value))}
                    style={{ width: '80px', height: '40px' }}
                  >
                    {itemsPerPageOptions.map((option, index) => (
                      <option key={index} value={option}>{option}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3" style={{ margin: '0px 20px' }} >
                  <Form.Label>{'Pesquisar:'}</Form.Label>
                  <Form.Control
                    type={'text'}
                    placeholder={'Buscar ...'}
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                </Form.Group>
              </div>
            </>
          )}
          <div className="card-body pt-0">
            <div className="table-responsive">
              <Table striped bordered hover className="display table">
                <thead>
                  <tr>
                    {columns.map((column, index) => (
                      <th key={index} onClick={() => handleSort(column.value, sortColumn, sortDirection, setSortColumn, setSortDirection)} style={{ cursor: 'pointer' }}>
                        {column.label} {sortColumn === column.value && (
                          <i className={`fas fa-sort-${sortDirection === 'asc' ? 'up' : 'down'}`}></i>
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((item, index) => (
                    <tr key={index}>
                      {columns.map((column, index) => (
                        <td key={index}>
                          {column.value === 'ativo' ? (
                            item[column.value] === true ? (
                              <span className="badge light badge-success" style={{ width: "67px" }}>Ativo</span>
                            ) : (
                              <span className="badge light badge-danger" style={{ width: "67px" }}>Inativo</span>
                            )
                          ) : column.value === 'ações' ? (
                            <div className="d-flex">
                              <Buttons
                                dado={item}
                                rota={`/${normalizeString(title)}-pesquisar`}
                                type={'pesquisar'}
                                onClick={() => handleShowModal(1, item)}
                              />
                              {
                                item["ativo"] === true ? (
                                  <Buttons dado={item} rota={`/${normalizeString(title)}-inativar`} type={'inativar'} />
                                ) :
                                  (
                                    <Buttons dado={item} rota={`/${normalizeString(title)}-ativar`} type={'ativar'} />
                                  )
                              }
                            </div>
                          )
                            : column.value === 'perfil' ? (
                              Array.isArray(item[column.value]) && item[column.value].map((value, index) => (
                                value.ativo ? (
                                  value.id === 1 ? (
                                    <span>Administrador</span>
                                  ) : (
                                    null
                                  )
                                ) : (null)
                              )
                              )) : (
                              item[column.value]?.toString()
                            )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
            {showPagination && (
              <PaginationControls
                currentPage={currentPage}
                totalItems={filteredData.length}
                itemsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        </div>
      </div>
      {ModalComponents && ModalComponents.map((ModalComponent, index) => (
        <ModalComponent
          key={index}
          show={activeModalIndex === index}
          onHide={handleCloseModal}
          item={selectedItem}
        />
      ))}
    </div>
  );
};

export default TableComponent;
