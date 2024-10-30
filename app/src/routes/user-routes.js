import express from 'express';
import { list, create, edit, detail, remove } from '../controllers/user-controller.js';

const router = express.Router();

router.get('/', list);
router.get('/create', create);
router.post('/create', create);
router.get('/edit', edit);
router.post('/edit/id', edit);
router.get('/detail', detail);
router.get('/remove/:id', remove);

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