/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { BOOKING_STATUS } from "../booking/booking.interface";
import { Booking } from "../booking/booking.model";
import { ISSLCommerz } from "../sslCommerz/sslCommerz.interface";
import { SSLServices } from "../sslCommerz/sslCommerz.services";
import { PAYMENT_STATUS } from "./payment.interface";
import { Payment } from "./payment.model";

const successPayment = async (query: Record<string, string>) => {
  const session = await Booking.startSession();
  session.startTransaction();

  try {
    // --------------> start main code for this api
    // Update Booking Status to COnfirm
    // Update Payment Status to PAID

    const updatedPayment = await Payment.findOneAndUpdate(
      { transactionId: query?.transactionId },
      { status: PAYMENT_STATUS.PAID },
      { new: true, runValidators: true, session }
    );

    await Booking.findByIdAndUpdate(
      updatedPayment?.booking,
      { status: BOOKING_STATUS.COMPLETE },
      { new: true, runValidators: true, session } // aikhane session ta add koresi.
    );

    // --------------> end main code for this api

    // sobar last a and return er age ai code gulo likhte hobe..
    await session.commitTransaction();
    session.endSession();

    return {
      success: true,
      message: "Payment Successfylly",
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    throw error;
  }
};

const failPayment = async (query: Record<string, string>) => {
  const session = await Booking.startSession();
  session.startTransaction();

  try {
    const updatedPayment = await Payment.findOneAndUpdate(
      { transactionId: query?.transactionId },
      { status: PAYMENT_STATUS.FAILED },
      { runValidators: true, session }
    );

    await Booking.findByIdAndUpdate(
      updatedPayment?.booking,
      { status: BOOKING_STATUS.FAILED },
      { runValidators: true, session }
    );

    await session.commitTransaction();
    session.endSession();

    return {
      success: false,
      message: "Payment failed",
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    throw error;
  }
};

const cancelPayment = async (query: Record<string, string>) => {
  const session = await Booking.startSession();
  session.startTransaction();

  try {
    const updatedPayment = await Payment.findOneAndUpdate(
      { transactionId: query?.transactionId },
      { status: PAYMENT_STATUS.CANCELLED },
      { runValidators: true, session }
    );

    await Booking.findByIdAndUpdate(
      updatedPayment?.booking,
      { status: BOOKING_STATUS.CANCEL },
      { runValidators: true, session }
    );

    await session.commitTransaction();
    session.endSession();

    return {
      success: false,
      message: "Payment cancel",
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    throw error;
  }
};

const initPayment = async (bookingId: string) => {
  const payment = await Payment.findOne({ booking: bookingId });

  if (!payment) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Payment not found. You have not booked this tour"
    );
  }

  const booking = await Booking.findById(bookingId).populate(
    "user",
    "name email phone address"
  );

  const userName = (booking?.user as any).name;
  const userAddress = (booking?.user as any).address;
  const userEmail = (booking?.user as any).email;
  const userPhone = (booking?.user as any).phone;

  const sslPayload: ISSLCommerz = {
    name: userName,
    email: userEmail,
    address: userAddress,
    phoneNumber: userPhone,
    amount: payment?.amount,
    transactionId: payment?.transactionId,
  };

  const sslPayment = await SSLServices.sslPaymentInit(sslPayload);

  return { paymentUrl: sslPayment?.GatewayPageURL };
};

export const PaymentServices = {
  successPayment,
  failPayment,
  cancelPayment,
  initPayment,
};
