'use strict';
const { Pointer } = require('pointer-wallet');

const pointer = new Pointer(process.env.POINTER_SECRET_KEY);

class BookingCarService {
  static async PaymentPointerWallet({
    amount,
    currency,
    message,
    userID,
    orderID,
    returnUrl,
    name,
    image,
    description,
    quantity,
    price,
  }) {
    // get userId
    // get bookingId

    /// ===================================================
    console.log('Nhan thong tin payment::', {
      amount,
      currency,
      message,
      userID,
      orderID,
      returnUrl,
      name,
      image,
      description,
      quantity,
      price,
    });
    const { url } = await pointer.createPayment({
      amount: amount,
      currency: currency,
      message: message,
      userID: userID,
      orderID: orderID,
      returnUrl: returnUrl,
      orders: [
        {
          name: name,
          image: image,
          description: description,
          quantity: quantity,
          price: price,
        },
      ],
    });
    console.log(url);
    return url;
  }

  /**
    * @param transactionID: _id
    * @returns { "url":"https://pointer.io.vn/payment-gateway?token={token}", "status":200 }
    */
  static async CancelPaymentPointerWallet({ _id }) {
    const data = await pointer.cancelOrder(_id);
    console.log(data);
    return data
  }
}

class BookingBusService {
  static async PaymentPointerWallet({
    amount,
    currency,
    message,
    userID,
    orderID,
    returnUrl,
    name,
    image,
    description,
    quantity,
    price,
  }) {
    // get userId
    // get bookingId
    /// ===================================================
    console.log('Nhan thong tin payment::', {
      amount,
      currency,
      message,
      userID,
      orderID,
      returnUrl,
      name,
      image,
      description,
      quantity,
      price,
    });
    const { url } = await pointer.createPayment({
      amount: amount,
      currency: currency,
      message: message,
      userID: userID,
      orderID: orderID,
      returnUrl: returnUrl,
      orders: [
        {
          name: name,
          image: image,
          description: description,
          quantity: quantity,
          price: price,
        },
      ],
    });
    console.log(url);
    return url;
  }

  /**
    * @param transactionID: _id
    * @returns { "url":"https://pointer.io.vn/payment-gateway?token={token}", "status":200 }
    */
  static async CancelPaymentPointerWallet({ _id }) {
    const data = await pointer.cancelOrder(_id);
    console.log(data);
    return data
  }
}

class BookingTrainService {}

module.exports = {
  BookingCarService,
  BookingBusService,
  BookingTrainService,
};
