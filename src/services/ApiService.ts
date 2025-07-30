// src/services/ApiService.ts

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { REACT_APP_TOTALDOCS_CORE_API_URL } from '../config';
class ApiService {
  private api: AxiosInstance;

   constructor(baseURL: string = REACT_APP_TOTALDOCS_CORE_API_URL) {

    this.api = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      }
    });
  }

  // GET request
  async get<T = any>(endpoint: string, config: AxiosRequestConfig = {}): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.api.get(endpoint, config);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error; // Para garantir que a chamada saiba que houve erro
    }
  }

  // POST request
  async post<T = any>(endpoint: string, data: any = {}, config: AxiosRequestConfig = {}): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.api.post(endpoint, data, config);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // PUT request
  async put<T = any>(endpoint: string, data: any = {}, config: AxiosRequestConfig = {}): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.api.put(endpoint, data, config);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // DELETE request
  async delete<T = any>(endpoint: string, config: AxiosRequestConfig = {}): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.api.delete(endpoint, config);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Trata erros de forma centralizada
  private handleError(error: unknown): void {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;

      if (axiosError.response) {
        console.error('Erro da API:', axiosError.response.data);
        console.error('Status:', axiosError.response.status);

        const errorMessage = (axiosError.response.data as any).message || 'Erro desconhecido';
        throw new Error(errorMessage);

      } else if (axiosError.request) {
        console.error('Sem resposta do servidor:', axiosError.request);
        throw new Error('Servidor não respondeu. Tente novamente mais tarde.');

      } else {
        console.error('Erro na configuração da requisição:', axiosError.message);
        throw new Error('Erro inesperado. Tente novamente.');
      }
    } else {
      console.error('Erro desconhecido:', error);
      throw new Error('Erro inesperado');
    }
  }
}

export default ApiService;
