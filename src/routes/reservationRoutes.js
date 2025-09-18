// FILE: src/routes/reservationRoutes.js
import { Router } from 'express';
import controller from '../controllers/reservationController.js';

const router = Router();

router.get('/', controller.list);
router.get('/:id', controller.get);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.remove);

export default router;
