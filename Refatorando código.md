# Análise
**Responsabilidade:** Controla o fluxo de informações entre os modelos (dados) e as views (interface), como esperado em uma arquitetura MVC.

**Conformidade com MVC:**

   * **Violações Notadas:** O user-controller.js utiliza diretamente métodos User.create, User.update, User.delete e User.paginate, que deveriam ser implementados em um Data Access Object (DAO), como user-dao.js. Controllers não devem manipular diretamente os dados, mas sim delegar a responsabilidade ao DAO.
  
**Outros Problemas Notados:**
Métodos como User.create e User.update não estão implementados no user-model.js, o que causará erros de execução.



Para melhorar a conformidade do seu **Controller** (`user-controller.js`) com o padrão MVC, você deve delegar todas as operações de manipulação de dados ao **Data Access Object (DAO)**, que no seu caso é a classe `UserDao`. A ideia é que o **Controller** se responsabilize apenas pelo fluxo de dados e a lógica de negócio, enquanto o **DAO** gerencia o acesso ao banco de dados.

### Por que Delegar ao DAO?

- **Separação de Responsabilidades**: O DAO é responsável pelo acesso ao banco de dados, enquanto o Controller deve focar na lógica de manipulação de dados e respostas HTTP.
- **Facilidade de Manutenção**: Se houver mudanças no banco de dados (por exemplo, o tipo de banco), somente o DAO precisará ser alterado, sem afetar o Controller.
- **Melhoria na Testabilidade**: Separar o código ajuda a isolar a lógica, facilitando a criação de testes para cada camada.

### Implementação da Melhoria

Aqui estão alguns exemplos específicos de como modificar o `user-controller.js` para delegar operações de dados ao DAO.

---

#### 1. Refatorando `list` para Usar o `UserDao`

No código original, o método `list` acessa diretamente `User.paginate` para buscar os dados:

```javascript
function list(req, res) {
    const { page = 1, filter = '' } = req.query;
    const users = User.paginate(parseInt(page), filter); // Não recomendado no Controller
    res.render('users', { users });
}
```

**Refatoração**: Use o `UserDao` para buscar os dados no banco:

```javascript
import { UserDao } from '../models/user-dao.js';
const userDao = new UserDao(); // Cria uma instância do DAO

function list(req, res) {
    const { page = 1, filter = '' } = req.query;
    const users = userDao.paginate(parseInt(page), filter); // Usa o método do DAO
    res.render('users', { users });
}
```

---

#### 2. Refatorando `create` para Delegar ao `UserDao`

Originalmente, o método `create` tenta salvar diretamente no banco chamando `User.create`, o que não é responsabilidade do Controller. Veja o código original:

```javascript
function create(req, res) {
    if (req.method === 'GET') {
        res.render('userForm');
    } else {
        const { name, cpf, profile, emails, phones } = req.body;
        const userId = User.create({ name, cpf, profile }); // Direto no Model
        emails.forEach(email => Email.add(userId, email));
        phones.forEach(phone => Phone.add(userId, phone));
        res.redirect('/users');
    }
}
```

**Refatoração**: Use o `UserDao` para salvar os dados no banco.

```javascript
import { UserDao } from '../models/user-dao.js';
const userDao = new UserDao();

function create(req, res) {
    if (req.method === 'GET') {
        res.render('userForm');
    } else {
        const { name, cpf, profile, emails, phones } = req.body;
        const newUser = { name, cpf, profile }; // Dados do novo usuário

        try {
            const userId = userDao.save(newUser); // Salva no DAO

            // Relaciona os e-mails e telefones com o usuário salvo
            emails.forEach(email => userDao.addEmail(userId, email));
            phones.forEach(phone => userDao.addPhone(userId, phone));

            res.redirect('/users');
        } catch (error) {
            res.status(500).send("Erro ao criar usuário");
        }
    }
}
```

**Modificação no `UserDao`**:
Para suportar o relacionamento com e-mails e telefones, adicione os métodos `addEmail` e `addPhone` no `UserDao`.

---

#### 3. Refatorando `edit` para Usar o DAO

No código original, o método `edit` chama `User.findById` e `User.update` diretamente. Refatore para delegar isso ao DAO.

```javascript
function edit(req, res) {
    const userId = req.params.id;

    if (req.method === 'GET') {
        const user = User.findById(userId); // Direto no Model
        const emails = Email.getByUser(userId);
        const phones = Phone.getByUser(userId);
        res.render('userForm', { user, emails, phones });
    } else {
        const { name, emails, phones } = req.body;
        User.update(userId, { name }); // Direto no Model
        emails.forEach(email => Email.add(userId, email));
        phones.forEach(phone => Phone.add(userId, phone));
        res.redirect('/users');
    }
}
```

**Refatoração**: Mova todas as operações de dados para o DAO.

```javascript
function edit(req, res) {
    const userId = req.params.id;

    if (req.method === 'GET') {
        const user = userDao.findById(userId); // Busca no DAO
        const emails = userDao.getEmailsByUser(userId); // Novo método no DAO
        const phones = userDao.getPhonesByUser(userId); // Novo método no DAO
        res.render('userForm', { user, emails, phones });
    } else {
        const { name, emails, phones } = req.body;
        userDao.update(userId, { name }); // Atualiza no DAO
        emails.forEach(email => userDao.addEmail(userId, email));
        phones.forEach(phone => userDao.addPhone(userId, phone));
        res.redirect('/users');
    }
}
```

**Novos Métodos no `UserDao`**:
Implemente `getEmailsByUser` e `getPhonesByUser` para buscar e-mails e telefones de um usuário.

---

#### 4. Refatorando `remove` para Usar o DAO

O método `remove` também está chamando `User.delete` diretamente. Refatore para utilizar o `UserDao`.

```javascript
function remove(req, res) {
    const userId = req.params.id;
    User.delete(userId); // Direto no Model
    res.redirect('/users');
}
```

**Refatoração**:

```javascript
function remove(req, res) {
    const userId = req.params.id;
    userDao.delete(userId); // Usa o método no DAO
    res.redirect('/users');
}
```

---

### Implementação dos Novos Métodos no `UserDao`

Para suportar as refatorações acima, adicione os seguintes métodos ao `UserDao`:

```javascript
class UserDao {
    // ... outros métodos ...

    addEmail(userId, email) {
        const stmt = db.prepare('INSERT INTO emails (user_id, email, is_main) VALUES (?, ?, ?)');
        stmt.run(userId, email, false);
    }

    addPhone(userId, phone) {
        const stmt = db.prepare('INSERT INTO phones (user_id, phone, is_main) VALUES (?, ?, ?)');
        stmt.run(userId, phone, false);
    }

    getEmailsByUser(userId) {
        const stmt = db.prepare('SELECT * FROM emails WHERE user_id = ?');
        return stmt.all(userId);
    }

    getPhonesByUser(userId) {
        const stmt = db.prepare('SELECT * FROM phones WHERE user_id = ?');
        return stmt.all(userId);
    }
}
```

---

### Benefícios da Refatoração

1. **Código Limpo e Modular**: O Controller agora se concentra apenas na lógica de controle e delega as operações de dados ao DAO, mantendo as responsabilidades bem definidas.
2. **Facilidade de Testes**: Como o Controller e o DAO estão desacoplados, você pode testar cada componente de forma independente.
3. **Facilidade para Alterações no Banco de Dados**: Qualquer mudança nas operações de dados (como a estrutura das tabelas) pode ser feita no `UserDao` sem impactar o `Controller`. 

Essas mudanças mantêm o Controller alinhado com o padrão MVC, fazendo com que ele atue como uma ponte entre as Views e o DAO, enquanto o DAO gerencia o acesso aos dados de forma isolada.