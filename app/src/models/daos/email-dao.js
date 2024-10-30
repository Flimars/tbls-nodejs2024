import{db} from "../../config/database.js";

class EmailDao{
    list(userId){
        const stmt = db.prepare('SELECT * FROM emails WHERE user_id = ?');
        return stmt.all(userId);
    }

    save({userId,email, isMain = 0}){
        const stmt=db.prepare('INSERT INTO emails (user_id, email,is_primary) VALUES (@userId, @isMain)');
        stmt.run({userId, email, isMain});
    }

    update(userId, oldEmail, newEmail){
        const stmt = db.prepare('UPDATE emails SET email = @newEmail WHERE user_id = @userId AND email = @oldEmail');
        stmt.run({userId, oldEmail,newEmail});
    }

    getByUser(userId) {
        const stmt = db.prepare(`SELECT * FROM emails WHERE user_id IS ?`);
        return stmt.all(userId) || []; 
    }

    delete(userId, email){
        const stmt= db.prepare('DELETE FROM emails WHERE user_id = ? AND email = ?');
        stmt.run(userId,email);
    }
}

export {EmailDao};