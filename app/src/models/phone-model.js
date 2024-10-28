

class phone {
    constructor(country, area, number){
        this.country = country;
        this.area = area;
        this.number = number
    }

    toString() {
        const phone = `+${this.country} (${this.area}) ${this.number}`;
        return phone;
    }
}

export default phone;

// Exemplo de uso
// const telefone = new NumeroTelefone(55, 21, '1234-5678', '101');
// console.log(telefone.toString());