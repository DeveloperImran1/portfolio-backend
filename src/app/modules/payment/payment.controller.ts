import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { envVars } from "../../../config/env";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { PaymentServices } from "./payment.services";

// Situation 1:
// Front-end (localhost:5173) -> User -> tour -> Booking(PENDING) -> Payment(UNPAID) -> SSL Commerz page -> Payment complete -> Backend (localhost: 5000) -> Update Payment(PAID) & Update Booking(PAID) -> redirect to front-end -> Front-end(localhost:5173/payment/success)

// Situation 2:
// Front-end (localhost:5173) -> User -> tour -> Booking(PENDING) -> Payment(UNPAID) -> SSL Commerz page -> Payment complete -> Backend (localhost: 5000) -> Update Payment(FAIL/CANCEL) & Update Booking(FAIL/CANCEL) -> redirect to front-end -> Front-end(localhost:5173/payment/fail or cancel)

const successPayment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;
    const result = await PaymentServices.successPayment(
      query as Record<string, string>
    );

    if (result?.success) {
      res.redirect(
        `${envVars.SSL.SSL_SUCCESS_FRONTEND_URL}?transactionId=${query.transactionId}&message=${result?.message}&amount=${query.amount}&status=success`
      );
    }
  }
);

const failPayment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;
    const result = await PaymentServices.failPayment(
      query as Record<string, string>
    );

    if (!result?.success) {
      res.redirect(
        `${envVars.SSL.SSL_FAIL_FRONTEND_URL}?transactionId=${query.transactionId}&message=${result?.message}&amount=${query.amount}&status=fail`
      );
    }
  }
);

const cancelPayment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;
    const result = await PaymentServices.cancelPayment(
      query as Record<string, string>
    );

    if (!result?.success) {
      res.redirect(
        `${envVars.SSL.SSL_CANCEL_FRONTEND_URL}?transactionId=${query.transactionId}&message=${result?.message}&amount=${query.amount}&status=cancel`
      );
    }
  }
);

// Upore amra koreci jokhon booking korbe user, tokhon booking hoia payment korar jonno ssl commerz er api a hit korbe. Tarpor responce asbe, sei repoonce er upor depend kore successPayment, failpayment, cancelPayment api call hobe and payment, booking er status update kore front-end a redirect kortese.
// But jodi user akbar bookin kore, kono karone payment cancel kore ba fail hoi. Tahole user next time abar set ageb booking a payment korte chaile. initPayment api use hobe. Ai api er maddhome front-end theke booking id ta asbe. Sei id dia check korbo, asolei ki DB te ai booking er kono fail ba cancel howa payment ase kina. Jodi thake tahole ssl coomerze er payment korar api te abar hit kore payment korte dibo user ke. Jodi payment kore tahole respopnse er maddhome payment and booking er status update kore front-end a redirect kore dibo success page a.
const initPayment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const bookingId = req.params.bookingId;
    const result = await PaymentServices.initPayment(bookingId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Payment done successfully",
      data: result,
    });
  }
);

export const PaymentController = {
  successPayment,
  failPayment,
  cancelPayment,
  initPayment,
};
