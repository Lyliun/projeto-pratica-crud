import axios from 'axios';

// Create axios instance with base configuration
export const api = axios.create({
    baseURL: 'http://localhost:3000/api', // URL do backend com prefixo /api
    timeout: 10000, // timeout após 10 segundos
    headers: {
        'Content-Type': 'application/json',
    }
});

// Response interceptor para tratamento de erros
api.interceptors.response.use(
    response => response,
    error => {
        // Timeout de conexão
        if (error.code === 'ECONNABORTED') {
            return Promise.reject({ 
                response: { 
                    data: { erro: 'Tempo limite de conexão excedido. Verifique se o backend está rodando.' } 
                } 
            });
        }
        
        // Erro de rede (servidor offline)
        if (!error.response) {
            return Promise.reject({
                response: {
                    data: { erro: 'Não foi possível conectar ao servidor. Verifique sua conexão ou se o backend está rodando.' }
                }
            });
        }

        // Erros específicos da API
        const errorResponse = error.response;
        if (errorResponse.data && errorResponse.data.erro) {
            return Promise.reject(error);
        }

        // Erros HTTP genéricos
        const genericError = {
            400: 'Requisição inválida.',
            401: 'Não autorizado.',
            403: 'Acesso negado.',
            404: 'Recurso não encontrado.',
            500: 'Erro interno do servidor.',
            503: 'Serviço indisponível.'
        };

        const message = genericError[errorResponse.status] || 'Ocorreu um erro inesperado.';
        error.response.data = { erro: message };
        
        return Promise.reject(error);
    }
);