// import User from '../models/user-model.js';
// import Email from '../models/email-model.js';
// import Phone from '../models/phone-model.js';

// src/controllers/user-controller.js
import { UserDao } from '../models/daos/user-dao.js';
import { EmailDao } from '../models/daos/email-dao.js';
import { PhoneDao } from '../models/daos/phone-dao.js';

const userDao = new UserDao();
const emailDao = new EmailDao();
const phoneDao = new PhoneDao();

function list(req, res) {
  const { page = 1, filter = '' } = req.query;
  const { items: users, total } = userDao.paginate(parseInt(page), filter);

  res.render('users', { users, total, page: parseInt(page), filter });
}

function create(req, res) {
  if (req.method === 'GET') {
    res.render('userForm');
  } else {
    const { name, cpf, profile, emails, phones } = req.body;
    const newUser = { name, cpf, profile, createdAt: new Date().toISOString() }; // Adiciona createdAt para o método save
    try {
      userDao.save(newUser); // Usa save em vez de create

      const userId = userDao.findByCpf(cpf)?.id; // Supondo que você tenha uma função findByCpf para recuperar o ID do novo usuário após o save
      if (userId) {
        emails.forEach(email => emailDao.save({ userId, email }));
        phones.forEach(phone => phoneDao.save({ userId, phone }));
      }

      res.redirect('/users');
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
      res.status(500).send("Erro ao criar usuário");
    }
  }
}


function edit(req, res) {
  const userId = req.params.id;
  if (req.method === 'GET') {
    const user = userDao.findById(userId);
    const emails = emailDao.getByUser(userId);
    const phones = phoneDao.getByUser(userId);
    console.log({emails});
    res.render('editForm', { user, emails, phones });

  } else {
    const { name, emails, phones } = req.body;
    userDao.update(userId, { name });
    emails.forEach(email => emailDao.add(userId, email));
    phones.forEach(phone => phoneDao.add(userId, phone));
    res.redirect('/users');
  }
}

async function detail(req, res) {
  const userId = req.params.id;
  try {
    const user = await userDao.findById(userId);
    if (!user) {
      return res.status(404).send("Usuário não cadastrado");
    }
    const emails = await emailDao.getByUser(userId);
    const phones = await phoneDao.getByUser(userId);
    res.render('detailForm', { user, emails, phones });
  } catch (error) {
    console.error("Erro ao buscar detalhes do usuário:", error);
    res.status(500).send("Erro interno no servidor");
  }
}

function remove(req, res) {
  const userId = req.params.id;
  userDao.delete(userId);
  res.redirect('/users');
}

export { list, create, edit, detail, remove };
