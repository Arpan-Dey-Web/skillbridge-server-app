// src/modules/user/user.routes.ts
import { Router } from 'express';

import { authorize } from '../../middleware/authorize';
import { userController } from './users.controller';

const router = Router();

// Only Admins can see user statistics
router.get('/stats', authorize("ADMIN"), userController.getStats);

export const UserRoutes = router;