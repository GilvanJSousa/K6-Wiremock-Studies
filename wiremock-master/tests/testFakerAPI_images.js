import http from 'k6/http';
import { check, sleep } from 'k6';
import { Trend, Rate } from 'k6/metrics';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";

// Definir métricas personalizadas
const imageTrend = new Trend('image_response_time');
const successRate = new Rate('success_rate');
const failureRate = new Rate('failure_rate');

export const options = {
    vus: 20, // Usuários virtuais
    duration: '15s', // Duração do teste
    thresholds: {
        'http_req_duration': ['p(95)<1000'], // 95% das requisições devem completar em menos de 1s
        'success_rate': ['rate>0.95'],       // Taxa de sucesso deve ser superior a 95%
    },
};

export default function () {
    // Configurações básicas
    const baseUrl = 'https://fakerapi.it/api/v1';
    
    // Testar diferentes tipos de imagens
    testAnyImages();
    testPokemonImages();
    testImagesWithSizes();
    
    sleep(1);
    
    function testAnyImages() {
        const params = {
            _locale: 'pt_BR',
            _quantity: 3,
            _seed: 98765,
            _type: 'any' // Tipo padrão
        };
        
        const url = `${baseUrl}/images`;
        const response = http.get(url, { params });
        
        // Tratamento de erro para parsing JSON
        let result;
        try {
            result = response.json();
        } catch (e) {
            console.log(`Erro ao processar JSON em Any Images: ${e.message}`);
            console.log(`Primeiros 100 caracteres da resposta: ${response.body.substring(0, 100)}...`);
            
            // Registrar falha
            failureRate.add(true);
            successRate.add(false);
            imageTrend.add(response.timings.duration);
            
            // Verificar apenas o status da resposta quando não for possível fazer parsing do JSON
            check(response, {
                'Any Images - status is 200': (r) => r.status === 200,
            });
            return;
        }
        
        // Registrar métricas
        imageTrend.add(response.timings.duration);
        
        const success = check(response, {
            'Any Images - status is 200': (r) => r.status === 200,
            'Any Images - data exists': (r) => result.data !== undefined,
            'Any Images - correct quantity': (r) => result.data.length === params._quantity,
            'Any Images - has URLs': (r) => 
                result.data[0].url !== undefined && 
                result.data[0].url.startsWith('http')
        });
        
        successRate.add(success);
        failureRate.add(!success);
    }
    
    function testPokemonImages() {
        const params = {
            _locale: 'pt_BR',
            _quantity: 5,
            _seed: 45678,
            _type: 'pokemon' // Tipo pokemon
        };
        
        const url = `${baseUrl}/images`;
        const response = http.get(url, { params });
        
        // Tratamento de erro para parsing JSON
        let result;
        try {
            result = response.json();
        } catch (e) {
            console.log(`Erro ao processar JSON em Pokemon Images: ${e.message}`);
            console.log(`Primeiros 100 caracteres da resposta: ${response.body.substring(0, 100)}...`);
            
            // Registrar falha
            failureRate.add(true);
            successRate.add(false);
            imageTrend.add(response.timings.duration);
            
            // Verificar apenas o status da resposta quando não for possível fazer parsing do JSON
            check(response, {
                'Pokemon Images - status is 200': (r) => r.status === 200,
            });
            return;
        }
        
        // Registrar métricas
        imageTrend.add(response.timings.duration);
        
        const success = check(response, {
            'Pokemon Images - status is 200': (r) => r.status === 200,
            'Pokemon Images - data exists': (r) => result.data !== undefined,
            'Pokemon Images - correct quantity': (r) => result.data.length === params._quantity,
            'Pokemon Images - has URLs': (r) => 
                result.data[0].url !== undefined && 
                result.data[0].url.includes('pokemon')
        });
        
        successRate.add(success);
        failureRate.add(!success);
    }
    
    function testImagesWithSizes() {
        // Testar com tamanhos específicos
        const params = {
            _locale: 'pt_BR',
            _quantity: 4,
            _seed: 24680,
            _width: 300,
            _height: 200
        };
        
        const url = `${baseUrl}/images`;
        const response = http.get(url, { params });
        
        // Tratamento de erro para parsing JSON
        let result;
        try {
            result = response.json();
        } catch (e) {
            console.log(`Erro ao processar JSON em Sized Images: ${e.message}`);
            console.log(`Primeiros 100 caracteres da resposta: ${response.body.substring(0, 100)}...`);
            
            // Registrar falha
            failureRate.add(true);
            successRate.add(false);
            imageTrend.add(response.timings.duration);
            
            // Verificar apenas o status da resposta quando não for possível fazer parsing do JSON
            check(response, {
                'Sized Images - status is 200': (r) => r.status === 200,
            });
            return;
        }
        
        // Registrar métricas
        imageTrend.add(response.timings.duration);
        
        const success = check(response, {
            'Sized Images - status is 200': (r) => r.status === 200,
            'Sized Images - data exists': (r) => result.data !== undefined,
            'Sized Images - correct quantity': (r) => result.data.length === params._quantity,
            'Sized Images - correct dimensions': (r) => {
                // Verificar se há pelo menos uma imagem e se tem as dimensões corretas
                if (!result.data || result.data.length === 0) return false;
                return result.data[0].width === params._width && 
                       result.data[0].height === params._height;
            }
        });
        
        successRate.add(success);
        failureRate.add(!success);
    }
}

export function handleSummary(data) {
    return {
      "../report/faker-api-images-test.html": htmlReport(data), // Caminho relativo para a pasta report existente
      stdout: textSummary(data, { indent: " ", enableColors: true }),
    };
} 