import React, { useState, useEffect } from 'react';
import { Table, Form, Pagination } from 'react-bootstrap';
import Buttons from './Buttons/Ações';
import { api } from '../lib/Axios';

const PaginationControls = ({ currentPage, totalItems, itemsPerPage, onPageChange }) => {
  const pageNumbers = Array.from({ length: Math.ceil(totalItems / itemsPerPage) }, (_, index) => index + 1);
  
  return (
    <div className="d-flex align-items-center justify-content-between">
      <span>Mostrando {Math.min(currentPage * itemsPerPage, totalItems)} de {totalItems} itens</span>
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

const fetchData = async (setData, setFilteredData, setOriginalData, currentPage, itemsPerPage, sortDirection, setLoading) => {
  setLoading(true);
  try {
    const response = await api(true).get(`/usuario?pageNumber=${currentPage}&pageSize=${itemsPerPage}&sortType=${sortDirection}`);
    const totalItems = Math.ceil(response.data.totalItems / itemsPerPage);
    const datas = [response.data.items];
    
    for (let page = 2; page <= totalItems; page++) {
      const nextResponse = await api(true).get(`/usuario?pageNumber=${page}&pageSize=${itemsPerPage}&sortType=${sortDirection}`);
      datas[0] = datas[0].concat(nextResponse.data.items);
    }

    setData(datas[0]);
    setFilteredData(datas[0]);
    setOriginalData(datas[0]);
    setLoading(false);
  } catch (error) {
    console.error('Erro ao buscar os dados:', error);
    setLoading(false);
  }
};

const TableComponent = ({ apiUrl, columns, title, ModalComponents, dados, showHeader = true, showPagination = true }) => {
  const [originalData, setOriginalData] = useState([]);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [loading, setLoading] = useState(false);
  const itemsPerPageOptions = [10, 20, 30, 40];

  useEffect(() => {
    if (apiUrl) {
      fetchData(setData, setFilteredData, setOriginalData, currentPage, itemsPerPage, sortDirection, setLoading);
    } else {
      setData(dados);
      setFilteredData(dados);
    }
  }, [apiUrl, currentPage, itemsPerPage, sortDirection]);

  const handleSearchChange = (event) => {
    const term = event.target.value.trim();
    setSearchTerm(term);
    const filteredResults = filterData(originalData, term || '');
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

  const handleSort = (columnValue) => {
    if (columnValue === sortColumn) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnValue);
      setSortDirection('asc');
    }
  };

  const sortData = (data) => {
    if (sortColumn) {
      return [...data].sort((a, b) => {
        const columnA = a[sortColumn];
        const columnB = b[sortColumn];
        if (columnA === undefined || columnB === undefined) return 0;
        return sortDirection === 'asc' ? columnA - columnB : columnB - columnA;
      });
    }
    return data;
  };

  const sortedData = sortData(filteredData);
  const currentItems = sortedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="container">
      <div className="col-xl-12">
        <div className="card dz-card">
          <div className="card-header flex-wrap d-flex justify-content-between align-items-center">
            <h4 className="card-title">Listar {title.concat("s")}</h4>
            <Buttons variant="primary" onClick={() => {}} rota={`/${title.toLowerCase()}-cadastrar`} type={'cadastrar'} title={title} />
          </div>
          {showHeader && (
            <div className="d-flex align-items-center justify-content-between">
              <Form.Group className="mb-3" style={{ marginLeft: '20px' }}>
                <Form.Label>Itens por página</Form.Label>
                <Form.Select onChange={(e) => { setItemsPerPage(parseInt(e.target.value)); setCurrentPage(1); }} style={{ width: '80px', height: '40px' }}>
                  {itemsPerPageOptions.map((option, index) => (
                    <option key={index} value={option}>{option}</option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3" style={{ margin: '0px 20px' }}>
                <Form.Label>{'Pesquisar:'}</Form.Label>
                <Form.Control type={'text'} placeholder={'Buscar ...'} value={searchTerm} onChange={handleSearchChange} />
              </Form.Group>
            </div>
          )}
          <div className="card-body pt-0">
            <div className="table-responsive">
              <Table striped bordered hover className="display table">
                <thead>
                  <tr>
                    {columns.map((column, index) => (
                      <th key={index} onClick={() => handleSort(column.value)} style={{ cursor: 'pointer' }}>
                        {column.label} {sortColumn === column.value && <i className={`fas fa-sort-${sortDirection === 'asc' ? 'up' : 'down'}`}></i>}
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
                            <span className={`badge light badge-${item[column.value] ? 'success' : 'danger'}`}>{item[column.value] ? 'Ativo' : 'Inativo'}</span>
                          ) : column.value === 'ações' ? (
                            <div className="d-flex">
                              <Buttons dado={item} rota={`/${title.toLowerCase()}-pesquisar`} type={'pesquisar'} />
                              <Buttons dado={item} rota={`/${item.ativo ? `${title.toLowerCase()}-inativar` : `${title.toLowerCase()}-ativar`}`} type={item.ativo ? 'inativar' : 'ativar'} />
                            </div>
                          ) : (
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
        <ModalComponent key={index} show={false} onHide={() => {}} item={null} />
      ))}
    </div>
  );
};

export default TableComponent;
