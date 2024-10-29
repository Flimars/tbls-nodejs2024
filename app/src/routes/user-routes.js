import express from 'express';
import { list, create, edit, remove } from '../controllers/user-controller.js';

const router = express.Router();

router.get('/users', list);
router.get('/users/create', create);
router.post('/users/create', create);
router.get('/users/edit/:id', edit);
router.post('/users/edit/:id', edit);
router.post('/users/remove/:id', remove);

export default router;


// import com {} importa apenas o Router de dentro do express
// import { Router } from 'express';
// import { listaUsers, paginaAddUser, addUser, detalhaUser } from '../controllers/users-controller.js';

// const router = Router();

// // pagina lista os usuarios
// // router.get('/', (req, res) => {
// //     return listaUsers(req, res);
// // });
// router.get('/', listaUsers);

// router.get('/:id', detalhaUser);

// router.get('/add', paginaAddUser);

// router.post('/add', addUser);

// export default router;