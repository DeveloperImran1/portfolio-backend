import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { PAYMENT_STATUS } from "../payment/payment.interface";
import { Payment } from "../payment/payment.model";
import { Tour } from "../tour/tour.model";
import { User } from "../user/user.model";
import { BOOKING_STATUS, IBooking } from "./booking.interface";
import { Booking } from "./booking.model";

const getTransactionId = () => {
  return `tran_${Date.now()}_${Math.ceil(Math.random() * 1000)}`;
};

// Transaction Rollback: --> bolte bujhai ami amon akjon ke bkash a taka send kortesi, but sei user er bkash number nai. Tahole ami taka send korar pore sei taka jodi onno user er bkash a add na hoi kono karone. Tahole sei taka abar back hoia amar account a chole asbe. Ai process kei bole Transaction Rollback.
// Same case ta hosse aikhane, ami booking kortesi, jodi booking korar por payment a kono error hoi. tarpor booking ke update kortesi. But payment create korar somoi error khale seikhane theke return hoia chole jabe. Jar fole full api er kiso kaj holo and kiso kaj holona. Last operation ta missing thake gelo. Jeita howa jabena. Ai issue solve kora jai Transaction rollback er maddhome
/**
 * Transaction Rollback
 * duplicate DB/Virtual DB / Replica DB --> [Create Booking --> Create Payment (aikhane akta error hoisa) --> Update Booking ] --> Set Real DB/Main DB te.
 * Uporer process a dekhte pari Transaction rollback er maddhome operation gulo kora somoi duplicate ba vitrual akta DB create kore nei. And full operation gulo hoi sei virtual db te. Jodi akadhik operation er moddhe kono operation a error hoi. Tahole Sei virtual DB ta vanish ba remove hoia jai. Jemonta hoiase Create Payment korar por.  Ar jodi All statement ba operation successfully korto. Tahole ai duplicate Db ta main DB te ki replace hoia jato ba full api er kaj gulo korar fole changes ta main DB te set hoia jato. Full process ses na hower ag porjonto kono effect portona main db te.
 */

const createBooking = async (payload: Partial<IBooking>, userId: string) => {
  const session = await Booking.startSession();
  session.startTransaction();

  try {
    // api er all code aikhane likhte hobe.

    // [Note: Sudho create and update opration gulote 2nd perameter a {session} ke add korte hobe. Jodi create method hoi, tahole payload gulo akta array er moddhe dita hobe. ar return a akta array pawa jai. Jar 0 number index a operation er data ta thakbe. But  get operation (find, findById, findOne etc)   aigulote 2nd perameter a session ke add korte hobena. ]

    // --------------> start main code for this api

    const transactionId = getTransactionId();

    const user = await User.findById(userId);

    // user profile er moddhe phone and address na thakle, tader ke call or sms dewa issue hobe. Tai age profile update kore lagbe.
    if (!user?.phone || !user?.address) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Please update your profile to back a tour"
      );
    }

    const tour = await Tour.findById(payload.tour).select("costFrom");

    // Jei tour book korbe, sei tour er moddhe costForm na thakle error throw korbe.
    if (!tour?.costFrom) {
      throw new AppError(httpStatus.BAD_REQUEST, "No tour cost found");
    }

    const amount = Number(tour?.costFrom) * Number(payload.guestCount);

    // aikhane payload ta object akare akta aray er moddhe dewa hoisa. Ar end perameter a {session} set koresi. Return oo korbe akta array. Jar 0 number index a amader expected data thakbe.
    const booking = await Booking.create(
      [
        {
          user: userId,
          status: BOOKING_STATUS.PENDING,
          ...payload,
        },
      ],
      { session }
    );

    // Aikhanew same akta array er moddhe payload diasi. Karon aita create method. Jodi onno method hoto, tahole airokom array er moddhe payload dita hotona.
    const payment = await Payment.create(
      [
        {
          booking: booking?.[0]?._id,
          status: PAYMENT_STATUS.UNPAID,
          transactionId: transactionId,
          amount: amount,
        },
      ],
      { session }
    );

    const updatedBooking = await Booking.findByIdAndUpdate(
      booking?.[0]?._id,
      { payment: payment?.[0]?._id },
      { new: true, runValidators: true, session } // aikhane session ta add koresi.
    )
      .populate("user", "name email phone address") // booking update hoia booking er full data get hoto. But user property er moddhe jei reference id ase. Sei id er data get korar jonno populate use koresi. Ar end perameter a kon kon property ke sudho get korbo seita bole disi. select er kaj kortese 2nd perameter.
      .populate("tour", "title costFrom")
      .populate("payment");

    // --------------> end main code for this api

    // sobar last a and return er age ai code gulo likhte hobe..
    await session.commitTransaction(); // transaction --> jodi all operation right vabe hoi. tahole commitTransaction() hosse ba Virtual DB theke amader Main DB te set hobe.
    session.endSession(); // session ke end kore dita hobe.
    return updatedBooking; // amar api er operatioin sese result return korbo.
  } catch (error) {
    await session.abortTransaction(); // rollback  --> Jodi upore try block er moddhe kono error hoi. Tahole abortTransaction() er maddhome virtual DB vanish hoia jabe. Main db te kisoi ses hobena.
    session.endSession();
    // throw new AppError(httpStatus.BAD_REQUEST, "Transaction rollback error")   // ai error use korbona. Because aita transaction rollback er error. ❌❌
    throw error;
  }
};

const getAllBookings = async () => {
  return {};
};
const getUserBookings = async () => {
  return {};
};
const getSingleBooking = async () => {
  return {};
};
const updateBookingStatus = async () => {
  return {};
};

export const BookingServices = {
  createBooking,
  getAllBookings,
  getUserBookings,
  getSingleBooking,
  updateBookingStatus,
};
