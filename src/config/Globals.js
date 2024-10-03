import { jwtDecode } from 'jwt-decode';
export const API_URL = 'http://195.35.40.77:8080/gecon/v1';
export const TOKEN = localStorage.getItem('token');
export const JWT_TOKEN = TOKEN ? jwtDecode(TOKEN) : null;
export const MODULOS = JWT_TOKEN?.modulos?.map((modulo) => modulo);
export const GETBASENAME = () => localStorage.getItem("rota")