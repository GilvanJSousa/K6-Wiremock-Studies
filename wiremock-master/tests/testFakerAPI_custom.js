import http from 'k6/http';
import { check, sleep } from 'k6';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";

export const options = {
    vus: 30, // Número de usuários virtuais
    duration: '8s', // Duração do teste
};

export default function () {
    // Configurações comuns
    const baseUrl = 'https://fakerapi.it/api/v1';
    const params = {
        _locale: 'pt_BR',
        _quantity: 10,
        _seed: 54321
    };

    // Testar a API Custom com diferentes tipos de dados
    testCustomUsers();
    testCustomProducts();
    testCustomCreditCards();
    
    sleep(1);
    
    function testCustomUsers() {
        // Definir os campos personalizados para o teste de usuários
        const customParams = {
            ...params,
            firstName: 'firstName',
            lastName: 'lastName',
            email: 'email',
            phone: 'phoneNumber',
            birthday: 'date',
            gender: 'gender',
            username: 'userName',
            password: 'password'
        };
        
        const url = `${baseUrl}/custom`;
        const response = http.get(url, { params: customParams });
        
        // Tratamento de erro para parsing JSON
        let result;
        try {
            result = response.json();
        } catch (e) {
            console.log(`Erro ao processar JSON em Custom Users: ${e.message}`);
            console.log(`Primeiros 100 caracteres da resposta: ${response.body.substring(0, 100)}...`);
            
            // Verificar apenas o status da resposta quando não for possível fazer parsing do JSON
            check(response, {
                'Custom Users - status is 200': (r) => r.status === 200,
            });
            return;
        }
        
        check(response, {
            'Custom Users - status is 200': (r) => r.status === 200,
            'Custom Users - data exists': (r) => result.data !== undefined,
            'Custom Users - correct quantity': (r) => result.data.length === params._quantity,
            'Custom Users - has correct structure': (r) => 
                result.data[0].firstName !== undefined && 
                result.data[0].lastName !== undefined &&
                result.data[0].email !== undefined &&
                result.data[0].username !== undefined
        });
    }
    
    function testCustomProducts() {
        // Definir os campos personalizados para o teste de produtos
        const customParams = {
            ...params,
            productName: 'word',
            price: 'price',
            category: 'word',
            ean: 'ean13',
            description: 'text',
            inStock: 'boolean',
            rating: 'numberBetween|1,5'
        };
        
        const url = `${baseUrl}/custom`;
        const response = http.get(url, { params: customParams });
        
        // Tratamento de erro para parsing JSON
        let result;
        try {
            result = response.json();
        } catch (e) {
            console.log(`Erro ao processar JSON em Custom Products: ${e.message}`);
            console.log(`Primeiros 100 caracteres da resposta: ${response.body.substring(0, 100)}...`);
            
            // Verificar apenas o status da resposta quando não for possível fazer parsing do JSON
            check(response, {
                'Custom Products - status is 200': (r) => r.status === 200,
            });
            return;
        }
        
        check(response, {
            'Custom Products - status is 200': (r) => r.status === 200,
            'Custom Products - data exists': (r) => result.data !== undefined,
            'Custom Products - correct quantity': (r) => result.data.length === params._quantity,
            'Custom Products - has correct structure': (r) => 
                result.data[0].productName !== undefined && 
                result.data[0].price !== undefined &&
                result.data[0].description !== undefined &&
                result.data[0].rating !== undefined
        });
    }
    
    function testCustomCreditCards() {
        // Definir os campos personalizados para o teste de cartões de crédito
        const customParams = {
            ...params,
            cardType: 'creditCardType',
            cardNumber: 'creditCardNumber',
            expiryDate: 'date',
            owner: 'name',
            cvv: 'numberBetween|100,999',
            active: 'boolean'
        };
        
        const url = `${baseUrl}/custom`;
        const response = http.get(url, { params: customParams });
        
        // Tratamento de erro para parsing JSON
        let result;
        try {
            result = response.json();
        } catch (e) {
            console.log(`Erro ao processar JSON em Custom Credit Cards: ${e.message}`);
            console.log(`Primeiros 100 caracteres da resposta: ${response.body.substring(0, 100)}...`);
            
            // Verificar apenas o status da resposta quando não for possível fazer parsing do JSON
            check(response, {
                'Custom Credit Cards - status is 200': (r) => r.status === 200,
            });
            return;
        }
        
        check(response, {
            'Custom Credit Cards - status is 200': (r) => r.status === 200,
            'Custom Credit Cards - data exists': (r) => result.data !== undefined,
            'Custom Credit Cards - correct quantity': (r) => result.data.length === params._quantity,
            'Custom Credit Cards - has correct structure': (r) => 
                result.data[0].cardType !== undefined && 
                result.data[0].cardNumber !== undefined &&
                result.data[0].cvv !== undefined
        });
    }
}

export function handleSummary(data) {
    return {
      "../report/faker-api-custom-test.html": htmlReport(data), // Caminho relativo para a pasta report existente
      stdout: textSummary(data, { indent: " ", enableColors: true }),
    };
} 