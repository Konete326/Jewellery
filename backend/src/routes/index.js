import { Router } from 'express';
import healthRoutes from '../modules/health/health.routes.js';
import productRoutes from '../modules/products/product.routes.js';
import inquiryRoutes from '../modules/inquiries/inquiry.routes.js';
import orderRoutes from '../modules/orders/order.routes.js';
import galleryRoutes from '../modules/gallery/gallery.routes.js';

const apiRouter = Router();

apiRouter.use('/health', healthRoutes);
apiRouter.use('/products', productRoutes);
apiRouter.use('/inquiries', inquiryRoutes);
apiRouter.use('/orders', orderRoutes);
apiRouter.use('/gallery', galleryRoutes);

export default apiRouter;

