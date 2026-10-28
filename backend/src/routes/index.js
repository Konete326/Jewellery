import { Router } from 'express';
import healthRoutes from '../modules/health/health.routes.js';
import productRoutes from '../modules/products/product.routes.js';
import inquiryRoutes from '../modules/inquiries/inquiry.routes.js';
import orderRoutes from '../modules/orders/order.routes.js';
import galleryRoutes from '../modules/gallery/gallery.routes.js';
import userRoutes from '../modules/users/user.routes.js';
import rateRoutes from '../modules/rates/rate.routes.js';
import paymentAccountRoutes from '../modules/payment-accounts/paymentAccount.routes.js';

const apiRouter = Router();

apiRouter.use('/health', healthRoutes);
apiRouter.use('/products', productRoutes);
apiRouter.use('/inquiries', inquiryRoutes);
apiRouter.use('/orders', orderRoutes);
apiRouter.use('/gallery', galleryRoutes);
apiRouter.use('/users', userRoutes);
apiRouter.use('/rates', rateRoutes);
apiRouter.use('/payment-accounts', paymentAccountRoutes);

export default apiRouter;
