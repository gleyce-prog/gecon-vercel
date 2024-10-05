import { jwtDecode } from 'jwt-decode';
export const apiUrl = 'http://195.35.40.77:8080/gecon/v1';
export const token = localStorage.getItem('token');
export const jwtToken = token ? jwtDecode(token) : null;
export const modulos = jwtToken?.modulos?.map((modulo) => modulo);
export const proxy = 'https://painel-ativa.vercel.app/api/proxy';