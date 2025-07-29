/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status-codes";
import { uploadBufferToCloudinary } from "../../../config/cloudinary.config";
import AppError from "../../errorHelpers/AppError";
import { generatePdf, IInvoiceData } from "../../utils/invoice";
import { sendEmail } from "../../utils/sendEmail";
import { BOOKING_STATUS } from "../booking/booking.interface";
import { Booking } from "../booking/booking.model";
import { ISSLCommerz } from "../sslCommerz/sslCommerz.interface";
import { SSLServices } from "../sslCommerz/sslCommerz.services";
import { ITour } from "../tour/tour.interface";
import { IUser } from "../user/user.interface";
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

    // ai condition na dilaw hoto. But nicher invoiceData er property type error resolve korar korar jonno condtion diasi.
    if (!updatedPayment) {
      throw new AppError(401, "Payment update failed");
    }

    const updateBooking = await Booking.findByIdAndUpdate(
      updatedPayment?.booking,
      { status: BOOKING_STATUS.COMPLETE },
      { new: true, runValidators: true, session } // aikhane session ta add koresi.
    )
      .populate("tour", "title")
      .populate("user", "name email");

    // ai condition na dilaw hoto. But nicher invoiceData er property type error resolve korar korar jonno condtion diasi.
    if (!updateBooking) {
      throw new AppError(401, "Booking update failed");
    }
    // payment complete hower pore user ke invoice create kore email korte hobe.
    const invoiceData: IInvoiceData = {
      bookingDate: updateBooking?.createdAt as Date,
      guestCount: updateBooking?.guestCount,
      transactionId: updatedPayment?.transactionId,
      totalAmount: updatedPayment?.amount,
      tourTitle: (updateBooking?.tour as unknown as ITour).title,
      userName: (updateBooking?.user as unknown as IUser).name,
    };

    const pdfBuffer = await generatePdf(invoiceData);

    // cloudinary te pdf ta upload korbo
    const cloudinaryResult = await uploadBufferToCloudinary(
      pdfBuffer,
      "invoice"
    );
    if (!cloudinaryResult) {
      throw new AppError(httpStatus.BAD_GATEWAY, "Error Uploading PDF");
    }

    // Payment collection a invoiceUrl take update kore upload kora pdf er link set kore dissi.
    await Payment.findByIdAndUpdate(
      updatedPayment._id,
      {
        invoiceUrl: cloudinaryResult.secure_url,
      },
      { runValidators: true, session }
    );

    await sendEmail({
      to: (updateBooking.user as unknown as IUser).email,
      subject: "Your Booking Invoice",
      templateName: "invoice",
      templateData: invoiceData,
      attachments: [
        {
          filename: "invoice.pdf",
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    });

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

const getInvoiceDownloadUrl = async (paymentId: string) => {
  const payment = await Payment.findById(paymentId).select("invoiceUrl");

  if (!payment) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Payment not found. You have not booked this tour"
    );
  }

  if (!payment.invoiceUrl) {
    throw new AppError(httpStatus.BAD_REQUEST, "No invoice found");
  }

  return payment.invoiceUrl;
};

export const PaymentServices = {
  successPayment,
  failPayment,
  cancelPayment,
  initPayment,
  getInvoiceDownloadUrl,
};
