import{db} from "../../config/database.js";

class PhoneDao{
    list(userId){
        const stmt = db.prepare('Select * from phones where user_id = ?');
        return stmt.all(userId);
    }

    save({userId , phone , isMain= 0}){
        const stmt = db.prepare('INSERT INTO phones (user_id , phone , is_primary) VALUES (@userId, @phone , @isMain)');
        stmt.run({userId, phone,isMain});
    }

    update(user_id,oldPhone, newPhone){
        const stmt =db.prepare('UPDATE phones SET phone = @newPhone WHERE user_id = @user_id AND phone = @oldPhone');
        stmt.run({user_id,oldPhone,newPhone});
    }

    getByUser(userId) {
        const stmt = db.prepare(`SELECT * FROM phones WHERE user_id IS ?`);
        return stmt.all(userId) || []; 
    }

    delete(userId, phone){
        const stmt = db.prepare('DELETE FROM phones WHERE user_id = ? AND phone = ?');
        stmt.run(userId, phone);
    }
}

export {PhoneDao};