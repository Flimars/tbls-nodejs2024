/*
// DAO DATA ACCESS OBJECT

// DAO X REPOSITORY


    DAO => RELACIONADO DIRETAMENTE AO BANCO DE DADOS** DA TUA APLICAÇÃO
        LIST USER

    REPOSITORY => RELACIONA OS DADOS COM REGRAS NEGOCIO
        LIST ACTIVE USERS

    PARA MAIORIA DOS CASOS, EXEMPLOS, AULAS, PROJETOS REAIS
        ELES REPRESENTAM A MESMA


    ** PERSISTENCIA DE DADOS


    SERVICE VS REPOSITORY
        SERVICE SE COMPORTA DE MANEIRA PARECIDA COM A DO CONTROLLER EM UM MVC
        O REPOSITORY ELE MISTURA O ACESSO A INFORMAÇÃO (BANCO DE DADOS) COM FILTROS, REGRAS, ETC

*/


import { db } from "../../config/database.js";

class UserDao {

    list() {
        const stmt = db.prepare('SELECT * FROM users LIMIT 100');
        const users = stmt.all();
        console.log({ users })
        
        return users;
    }

    save({ name, email, password, profile, createdAt }) {
        const stmt = db.prepare('INSERT INTO users (name, email, password, profile, created_at) VALUES (@name, @email, @password, @profile, @createdAt)');
        stmt.run({name, email, password, profile, createdAt});
    }

    findById(id) {
        const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
        return stmt.get(id);
    }

    update(id, updatedData) {
        const { name } = updatedData;
        const stmt = db.prepare('UPDATE users SET name = ? WHERE id = ?');
        stmt.run(name, id);
    }
    
    delete(id) {
        const stmt = db.prepare('DELETE FROM users WHERE id = ?');
        stmt.run(id);
    }

    paginate(page, filter) {
        const limit = 5;
        const offset = (page - 1) * limit;
        
        // Consulta para obter os itens paginados
        const stmtItems = db.prepare(`
            SELECT * FROM users
            WHERE name LIKE ?
            LIMIT ? OFFSET ?
        `);
        const items = stmtItems.all(`%${filter}%`, limit, offset);
        
        // Consulta para contar o total de itens correspondentes ao filtro
        const stmtCount = db.prepare(`
            SELECT COUNT(*) as total FROM users
            WHERE name LIKE ?
        `);
        const { total } = stmtCount.get(`%${filter}%`);
        
        return { items, total };
    }
}

export {
    UserDao
}