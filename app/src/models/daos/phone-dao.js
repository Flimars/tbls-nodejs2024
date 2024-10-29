import{db} from "../../config/database.js";

class PhoneDao{
    list(userId){
        const stmt = db.prepare('Select * from phones where user_id = ?');
        return stmt.all(userId);
    }

    save({userId , phone , isMain= o}){
        const stmt = db.prepare('INSERT INTO phones (userId , phone , is_primary) VALUES (@userId, @phone , @isMain)');
        stmt.run({userId, phone,isMain});
    }

    Update(user_id,oldPhone, newPhone){
        const stmt =db.prepare('UPDATE phones SET phone = @newPhone WHERE user_id = @user_id AND phone = @oldPhone');
        stmt.run({user_id,oldPhone,newPhone});
    }

    setPrimary(user_id, phone){
        db.prepare('UPDATE phones SET is_primary =0 WHERE user_id = ?').run(userId);
        db.prepare('UPDATE phones SET is_primary = 1 WHERE user_id = ? AND phone = ?').run(userId,phone);

    }

    delete(userId, phone){
        const stmt = db.prepare('UPDATE FROM phones WHERE user_id = ? AND phone = ?');
        stmt.run(userId, phone);
    }
}

export {PhoneDao};