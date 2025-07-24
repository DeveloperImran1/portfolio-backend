import { model, Schema } from "mongoose";
import { IPayment, PAYMENT_STATUS } from "./payment.interface";

const paymentSchema = new Schema<IPayment>(
  {
    booking: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
      unique: true,
      required: true,
    },
    transactionId: {
      type: String,
      unique: true,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(PAYMENT_STATUS),
      default: PAYMENT_STATUS.UNPAID,
    },
    amount: {
      type: Number,
      required: true,
    },
    invoiceUrl: {
      type: String,
    },
    paymentGatewayData: Schema.Types.Mixed, // amra interface a paymentGatewayData er type hisabe any use koresi. Tai aikhane Schema.Types.Mixed hobe. Thats mean jekono kiso aste pare.
  },
  { timestamps: true }
);

export const Payment = model<IPayment>("Payment", paymentSchema);
