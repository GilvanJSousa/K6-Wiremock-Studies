import http from 'k6/http';
import { check, sleep } from 'k6';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";

export const options = {
    vus: 5, // Número de usuários virtuais
    duration: '10s', // Duração do teste (corrigido para incluir 's')
};

export default function () {
    // Configurações comuns
    const baseUrl = 'https://fakerapi.it/api/v1';
    const params = {
        _locale: 'pt_BR', // Localização para português do Brasil
        _quantity: 5, // Quantidade de itens a retornar
        _seed: 12345 // Seed para manter resultados consistentes
    };

    // Testes para diferentes recursos da FakerAPI
    testPersons();
    testCompanies();
    testProducts();
    testAddresses();
    testBooks();
    
    sleep(1);
    
    function testPersons() {
        const url = `${baseUrl}/persons`;
        const response = http.get(url, { params });
        
        // Tratamento de erro para parsing JSON
        let result;
        try {
            result = response.json();
        } catch (e) {
            console.log(`Erro ao processar JSON em persons: ${e.message}`);
            console.log(`Primeiros 100 caracteres da resposta: ${response.body.substring(0, 100)}...`);
            
            // Verificar apenas o status da resposta quando não for possível fazer parsing do JSON
            check(response, {
                'Persons - status is 200': (r) => r.status === 200,
            });
            return;
        }
        
        check(response, {
            'Persons - status is 200': (r) => r.status === 200,
            'Persons - data exists': (r) => result.data !== undefined,
            'Persons - correct quantity': (r) => result.data.length === params._quantity,
            'Persons - has correct structure': (r) => 
                result.data[0].id !== undefined && 
                result.data[0].firstname !== undefined &&
                result.data[0].email !== undefined
        });
    }
    
    function testCompanies() {
        const url = `${baseUrl}/companies`;
        const response = http.get(url, { params });
        
        // Tratamento de erro para parsing JSON
        let result;
        try {
            result = response.json();
        } catch (e) {
            console.log(`Erro ao processar JSON em companies: ${e.message}`);
            console.log(`Primeiros 100 caracteres da resposta: ${response.body.substring(0, 100)}...`);
            
            // Verificar apenas o status da resposta quando não for possível fazer parsing do JSON
            check(response, {
                'Companies - status is 200': (r) => r.status === 200,
            });
            return;
        }
        
        check(response, {
            'Companies - status is 200': (r) => r.status === 200,
            'Companies - data exists': (r) => result.data !== undefined,
            'Companies - correct quantity': (r) => result.data.length === params._quantity,
            'Companies - has correct structure': (r) => 
                result.data[0].id !== undefined && 
                result.data[0].name !== undefined &&
                result.data[0].email !== undefined
        });
    }
    
    function testProducts() {
        const url = `${baseUrl}/products`;
        const response = http.get(url, { params });
        
        // Tratamento de erro para parsing JSON
        let result;
        try {
            result = response.json();
        } catch (e) {
            console.log(`Erro ao processar JSON em products: ${e.message}`);
            console.log(`Primeiros 100 caracteres da resposta: ${response.body.substring(0, 100)}...`);
            
            // Verificar apenas o status da resposta quando não for possível fazer parsing do JSON
            check(response, {
                'Products - status is 200': (r) => r.status === 200,
            });
            return;
        }
        
        check(response, {
            'Products - status is 200': (r) => r.status === 200,
            'Products - data exists': (r) => result.data !== undefined,
            'Products - correct quantity': (r) => result.data.length === params._quantity,
            'Products - has correct structure': (r) => 
                result.data[0].id !== undefined && 
                result.data[0].name !== undefined &&
                result.data[0].price !== undefined
        });
    }
    
    function testAddresses() {
        const url = `${baseUrl}/addresses`;
        const response = http.get(url, { params });
        
        // Tratamento de erro para parsing JSON
        let result;
        try {
            result = response.json();
        } catch (e) {
            console.log(`Erro ao processar JSON em addresses: ${e.message}`);
            console.log(`Primeiros 100 caracteres da resposta: ${response.body.substring(0, 100)}...`);
            
            // Verificar apenas o status da resposta quando não for possível fazer parsing do JSON
            check(response, {
                'Addresses - status is 200': (r) => r.status === 200,
            });
            return;
        }
        
        check(response, {
            'Addresses - status is 200': (r) => r.status === 200,
            'Addresses - data exists': (r) => result.data !== undefined,
            'Addresses - correct quantity': (r) => result.data.length === params._quantity,
            'Addresses - has correct structure': (r) => 
                result.data[0].id !== undefined && 
                result.data[0].street !== undefined &&
                result.data[0].city !== undefined
        });
    }
    
    function testBooks() {
        const url = `${baseUrl}/books`;
        const response = http.get(url, { params });
        
        // Tratamento de erro para parsing JSON
        let result;
        try {
            result = response.json();
        } catch (e) {
            console.log(`Erro ao processar JSON em books: ${e.message}`);
            console.log(`Primeiros 100 caracteres da resposta: ${response.body.substring(0, 100)}...`);
            
            // Verificar apenas o status da resposta quando não for possível fazer parsing do JSON
            check(response, {
                'Books - status is 200': (r) => r.status === 200,
            });
            return;
        }
        
        check(response, {
            'Books - status is 200': (r) => r.status === 200,
            'Books - data exists': (r) => result.data !== undefined,
            'Books - correct quantity': (r) => result.data.length === params._quantity,
            'Books - has correct structure': (r) => 
                result.data[0].id !== undefined && 
                result.data[0].title !== undefined &&
                result.data[0].author !== undefined
        });
    }
}

export function handleSummary(data) {
    // Garantir que a pasta report exista
    try {
        return {
            "../report/faker-api-test.html": htmlReport(data), // Caminho relativo para a pasta report existente
            stdout: textSummary(data, { indent: " ", enableColors: true }),
        };
    } catch (e) {
        console.log(`Erro ao gerar o relatório: ${e.message}`);
        return {
            stdout: textSummary(data, { indent: " ", enableColors: true }),
        };
    }
} 