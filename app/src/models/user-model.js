class User {
    constructor(name, email, profile, password,createdAt) {
        this.name = name;
        this.email = email;
        this.profile = profile;
        this.password = password;
        
        if (createdAt) {
            this.createdAt = createdAt;
        } else {
            this.createdAt = Date.now();
        }

        this.createdAt = createdAt ?? Date.now();
    }
}

export default User;