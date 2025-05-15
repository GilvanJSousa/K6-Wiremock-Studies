import http from 'k6/http';
import { check, sleep } from 'k6';
import { Counter } from 'k6/metrics';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";

// Contador para monitorar o número total de requisições
const requestCounter = new Counter('total_requests');

// Configurar um teste com diferentes estágios de carga
export const options = {
    stages: [
        { duration: '10s', target: 10 },  // Ramp-up para 10 usuários em 10 segundos
        { duration: '30s', target: 50 },  // Ramp-up para 50 usuários em 30 segundos
        { duration: '1m', target: 50 },   // Manter 50 usuários por 1 minuto
        { duration: '20s', target: 0 },   // Ramp-down para 0 usuários em 20 segundos
    ],
    thresholds: {
        http_req_duration: ['p(95)<2000'], // 95% das requisições devem ser concluídas em menos de 2s
        http_req_failed: ['rate<0.1'],      // Taxa de falha deve ser inferior a 10%
    },
};

export default function () {
    // URL base e parâmetros comuns
    const baseUrl = 'https://fakerapi.it/api/v1';
    const commonParams = {
        _locale: 'pt_BR',
        _seed: Math.floor(Math.random() * 1000000) // Seed aleatório para diversificar dados
    };
    
    // Selecionar um recurso aleatoriamente para melhor distribuição de carga
    const recursos = ['persons', 'companies', 'products', 'addresses', 'books', 'texts', 'users', 'places', 'images'];
    const recursoAleatorio = recursos[Math.floor(Math.random() * recursos.length)];
    
    // Variar a quantidade de itens solicitados
    const quantity = Math.floor(Math.random() * 20) + 1; // Entre 1 e 20 itens
    
    // Construir parâmetros finais
    const params = {
        ...commonParams,
        _quantity: quantity
    };
    
    // Adicionar parâmetros específicos para imagens, se necessário
    if (recursoAleatorio === 'images') {
        params._type = Math.random() > 0.5 ? 'any' : 'pokemon';
        
        // Chance aleatória de definir dimensões personalizadas
        if (Math.random() > 0.7) {
            params._width = Math.floor(Math.random() * 400) + 100;
            params._height = Math.floor(Math.random() * 300) + 100;
        }
    }
    
    // Fazer a requisição
    const url = `${baseUrl}/${recursoAleatorio}`;
    const response = http.get(url, { params });
    
    // Incrementar o contador de requisições
    requestCounter.add(1);
    
    // Verificar a resposta com tratamento de erro para parsing JSON
    let bodyValidation = false;
    try {
        const body = response.json();
        bodyValidation = body.data && Array.isArray(body.data) && body.data.length > 0;
    } catch (e) {
        console.log(`Erro ao processar JSON para ${recursoAleatorio}: ${e.message}`);
        console.log(`Primeiros 100 caracteres da resposta: ${response.body.substring(0, 100)}...`);
        bodyValidation = false;
    }
    
    check(response, {
        'status é 200': (r) => r.status === 200,
        'corpo contém dados': () => bodyValidation,
        'tempo de resposta aceitável': (r) => r.timings.duration < 1500,
    });
    
    // Tempo variável de espera entre requisições para simular comportamento real
    sleep(Math.random() * 3 + 0.5); // Entre 0.5 e 3.5 segundos
}

export function handleSummary(data) {
    return {
      "../report/faker-api-carga-test.html": htmlReport(data), // Caminho relativo para a pasta report existente
      stdout: textSummary(data, { indent: " ", enableColors: true }),
    };
} 