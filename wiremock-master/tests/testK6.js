import http from 'k6/http';

import { check, sleep } from 'k6';

import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";

export const options = {
    vus: 102, // Número de usuários virtuais "VU's"
    duration: '5s', // Duração do teste
}

export default function () {

    const url = 'http://localhost:8080/api/cars';

    const response = http.get(url);

    const cars = response.json();

    check(response, {
        // Verificar se a resposta retornou o código de status HTTP 200 (OK)
        'status is 200': (r) => r.status === 200,

        // Verificar se o tamanho da lista de carros é igual a 3
        'car list size is 5': (r) => cars.length === 5,

        // // Verificar se o primeiro carro da lista tem o nome 'Ferrari'
        // 'first car is Ferrari': (r) => cars[0].name === 'Ferrari',

        // // Verificar se o segundo carro da lista tem o nome 'Renault'
        // 'second car is Renault': (r) => cars[1].name === 'Renault',

        // // Verificar se o terceiro carro da lista tem o nome 'Alpha Romeo'
        // 'third car is Alpha Romeo': (r) => cars[2].name === 'Alpha Romeo'
    })

    sleep(1);

}

export function handleSummary(data) {
    return {
      "report/test-500.pdf": htmlReport(data),
      stdout: textSummary(data, { indent: " ", enableColors: true }),
    };
  }

