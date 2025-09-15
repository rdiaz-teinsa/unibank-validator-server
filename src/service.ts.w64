const Service = require('node-windows').Service;
const svc = new Service({
    name:'Teinsa Validator',
    description: 'Sistema de Validación de Átomos',
    script: 'D:\\apps\\server\\dist\\index.js'
});

svc.on('install',function(){
    svc.start();
});

svc.install();
