class email {
    constructor(prefix, domain){
        this.prefix = prefix;
        this.domain = domain;      
    }

    toString() {
       return `${this.prefix}@${this.domain}`;        
    }

    // Método para validar o formato do e-mail
    static validarEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }
}

export {
    email
}

// Exemplo de uso:
// const email = new Email('exemplo', 'dominio.com');
// console.log(email.toString()); // Saída: exemplo@dominio.com

// Validação de e-mail
// console.log(Email.validarEmail('exemplo@dominio.com')); // Saída: true
// console.log(Email.validarEmail('email_invalido')); // Saída: false