import{db} from "../config/database.js";
import{email} from "./email-model.js";

class EmailDao{
    list(userId){
        const stmt = db.prepare('SELECT * FROM emails WHERE user_id = ?');
        return stmt.all(userId);
    }

    save({userId,email, isMain = 0}){
        const stmt=db.prepare('INSERT INTO emails (user_id, email,is_primary) VALUES (@userId, @isMain');
        stmt.run({userId, email, isMain});
    }

    update(userId, oldEmail, newEmail){
        const stmt = db.pragma('UPDATE emails SET email = @newEmail WHERE user_id = @nuserId AND email = @oldEmail');
        stmt.run({userId, oldEmail,newEmail});
    }

    setPrimary(userId, email){
        db.prepare('UPDATE emails SET is_primary = 0 WHERE user_id ?').run(userId);
        db.prepare('UPDATE emails SET is_primary = 1 WHERE user_id =? AND email =?').run(userId,email);
    }

    delete(userId, email){
        const stmt= db.prepare('DELETE FROM emails WHERE user_id = ? AND email = ?');
        stmt.run(userId,email);
    }
}

export {EmailDao};