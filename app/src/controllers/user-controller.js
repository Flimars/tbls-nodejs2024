// import User from '../models/user-model.js';
// import Email from '../models/email-model.js';
// import Phone from '../models/phone-model.js';

import { UserDao } from '../models/daos/user-dao.js'; // Importa o DAO para gerenciar o acesso aos dados
import { EmailDao } from '../models/daos/email-dao.js';
import { PhoneDao } from '../models/daos/phone-dao.js';

const userDao = new UserDao();    // Cria uma instância do DAO global
const emailDao = new EmailDao();
const phoneDao = new PhoneDao();

function list(req, res) {
  
  const { page = 1, filter = '' } = req.query;
  const users = userDao.paginate(parseInt(page), filter);   // Usa o método do DAO
  res.render('users', { users });
}

function create(req, res) {
  if (req.method === 'GET') {
    res.render('userForm');
  } else {
    const { name, cpf, profile, emails, phones } = req.body;
    const newUser = { name, cpf, profile };   // Dados do novo usuário
    try {
        const userId = userDao.create({ newUser });   // Salva no DAO

         // Relaciona os e-mails e telefones com o usuário salvo
        emails.forEach(email => Email.add(userId, email));
        phones.forEach(phone => Phone.add(userId, phone));
        res.redirect('/users');
      
    } catch (error) {
      res.status(500).send("Erro ao criar usuário");
    }
  }
}

function edit(req, res) {
  const userId = req.params.id;

  if (req.method === 'GET') {
    const user = userDao.findById(userId);    // Busca no DAO
    const emails = userDao.getByUser(userId); // Novo método no DAO
    const phones = userDao.getByUser(userId); // Novo método no DAO
    res.render('userForm', { user, emails, phones });
  } else {
    const { name, emails, phones } = req.body;
    userDao.update(userId, { name });   // Atualiza no DAO    
    emails.forEach(email => Email.add(userId, email));
    phones.forEach(phone => Phone.add(userId, phone));
    res.redirect('/users');
  }
}

async function detail(req, res) {
  const userId = req.params.id;

  try {
    // Recupera o usuário pelo ID usando UserDao
    const user = await userDao.findById(userId);

    // Se o usuário não existir, retorna um erro 404
    if (!user) {
      return res.status(404).send("Usuário não cadastrado");
    }

    // Recupera os emails e telefones associados ao usuário
    const emails = await emailDao.getByUser(userId);
    const phones = await phoneDao.getByUser(userId);

    // Renderiza a página de detalhes com as informações do usuário, emails e telefones
    res.render('detail', { user, emails, phones });
  } catch (error) {
    console.error("Erro ao buscar detalhes do usuário:", error);
    res.status(500).send("Erro interno no servidor");
  }
}

function remove(req, res) {
  const userId = req.params.id;
  userDao.delete(userId);   // Usa o método no DAO
  res.redirect('/users');
}



export { list, create, edit, detail, remove };

/*
// function detail(req, res){
//   const userId = req.params.id;
//   const user = userDao.findById(userId);
//   const emails = Email.getByUser(userId);
//   const phones = Phone.getByUser(userId);
//   if(user){
//     res.render('detail', {user, email, phone});
//   }else{
//     res.status(404).send("Usuário não cadastrado");
//   }
// }



// import User from '../models/userModel.js';
// import Email from '../models/emailModel.js';
// import Phone from '../models/phoneModel.js';
// import { UserDao } from "../models/user-dao.js";

// class UserController {
//   static list(req, res) {
//     const { page = 1, filter = '' } = req.query;
//     const users = User.paginate(parseInt(page), filter);
//     res.render('users', { users });
//   }

//   static create(req, res) {
//     if (req.method === 'GET') {
//       res.render('userForm');
//     } else {
//       const { name, cpf, profile, emails, phones } = req.body;
//       const userId = User.create({ name, cpf, profile });
//       emails.forEach(email => Email.add(userId, email));
//       phones.forEach(phone => Phone.add(userId, phone));
//       res.redirect('/users');
//     }
//   }

//   static edit(req, res) {
//     const userId = req.params.id;
//     if (req.method === 'GET') {
//       const user = User.findById(userId);
//       const emails = Email.getByUser(userId);
//       const phones = Phone.getByUser(userId);
//       res.render('userForm', { user, emails, phones });
//     } else {
//       const { name, emails, phones } = req.body;
//       User.update(userId, { name });
//       emails.forEach(email => Email.add(userId, email));
//       phones.forEach(phone => Phone.add(userId, phone));
//       res.redirect('/users');
//     }
//   }

//   static delete(req, res) {
//     const userId = req.params.id;
//     User.delete(userId);
//     res.redirect('/users');
//   }
// }

// export default UserController;

/*
import { UserDao } from "../models/user-dao.js";
import { User } from "../models/user-model.js";

function listaUsers(req, res) {
    const userDao = new UserDao();
    const usersRaw = userDao.list();

    // IDEALMENTE MAPEAMOS OS USERS (RAW/ BRUTA-CRUA DO BANCO DE DADOS PARA O MODEL USER)
    const users = usersRaw.map(u => new User(u.name, u.email, u.password, u.created_at));
    // no banco esta salvo como created_at (snake case)
    // no model estamos utilizando camelCase

    const data = {
        title: "WEB II",
        users
    }
    res.render('users-listagem', { data });
    // o return é opcional aqui, cuidado para nao dar dois renders ao mesmo tempo
}

function paginaAddUser(req, res) {
    const data = {
        title: "WEB II - Add User",
    }
    res.render('users-formulario', { data });
}

function addUser(req, res) {
    try {
        console.log({ rota: "/users/add", data: req.body })
        const userDao = new UserDao();

        // const { name, email, password } = req.body;
        // userDao.save({
        //     name, email, password
        // })

        const dados = req.body;
        try {
            const newUser = new User(dados.name, dados.email, dados.password);
            userDao.save(newUser);
        } catch (error) {
            // por exemplo, o cpf já existe 
            res.status(400).send("O CPF JA EXISTE");
        }
        res.redirect("/users");
    } catch (error) {
        res.status(500).send("HOUVE UM ERRO AO ADICIONAR USUARIO");
    }
}


function detalhaUser(req, res) {
    const { id } = req.params;
    // consulta o banco
    // vai carregar o dados
    // vai mandar para a tua view
    res.send("DETALHES DO USUARIO ID " + id);
}

export {
    addUser,        // O cpf tem que  ser unico + o perfil (ADMIN/CLIENTE) já é setado na etapa inicial
    listaUsers,     // paginacao (a cada 5) e filtro (pelo nome)
    paginaAddUser,
    // detalhes de usuario  (ver todos os dados de usuario + telefones, emails)
    // exclusao de usuario  (NAO POSSO REMOVER ADMINS)
    // update de usuario (EXCETO PERFIL (admin/cliente) e CPF, todos os outros dados do usuario, telefones e emails podem ser atualizados inclusive setando qual o email/telefone principal)

    // usuario tem que ter multiplos telefones (apenas 1 principal) 1:m
    // usuario tem que ter multiplos emails (apenas 1 principal)    1:m

    // INDIVIDUAL ou DUPLA E VCS TEM DUAS SEMANAS =)

    detalhaUser,
};
*/