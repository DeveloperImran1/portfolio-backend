import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { PaymentController } from "./payment.controller";

const router = Router();

router.post("/success", PaymentController.successPayment);
router.post("/fail", PaymentController.failPayment);
router.post("/cancel", PaymentController.cancelPayment);
router.post("/init-payment/:bookingId", PaymentController.initPayment);

// User tar booking korar por payment er invoice pdf ta get korte parbe ai api dia.
router.get(
  "/invoice/:paymentId",
  checkAuth(...Object.values(Role)),
  PaymentController.getInvoiceDownloadUrl
);

export const PaymentRoutes = router;
