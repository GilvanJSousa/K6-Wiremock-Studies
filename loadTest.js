//entenderemos melhor sobre options no modulo 3

import sleep from 'k6';
//Carga constante
export const options = {
    vus: 1,
    duration: '10s',
}

// Carga variavel
export default options2 = {
    stages: [
        { duration: '5m', target: 100 }, // ramp-up
        { duration: '10m', target: 100 }, // ramp-down
        { duration: '5m', target: 0 }, // ramp-down
    ]
}
