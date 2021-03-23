import logo from "./logo.svg";
import "./App.css";
import axios from "axios";

const loadScript = (src) => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

const subscribePlan = async (id) => {
  var options = {
    key: "rzp_test_U4ecQLSDWLmtEp",
    subscription_id: id,
    name: "Law Masko",
    description: "Test Subscription",
    image: { logo },
    handler: async function (response) {
      console.log(response);
      const data = {
        subscriptionId: id,
        razorpayPaymentId: response.razorpay_payment_id,
        razorpaySubscriptionId: response.razorpay_subscription_id,
        razorpaySignature: response.razorpay_signature,
      };

      const result = await axios.post(
        "http://localhost:5000/payment/successSubscription",
        data
      );
      console.log(result);
      alert(result.data.msg);
    },
    prefill: {
      name: "Law Masko",
      email: "careers@lawmasko.com",
      contact: "9999999999",
    },
    notes: {
      address: "India",
    },
    theme: {
      color: "#61dafb",
    },
  };

  displayRazorpay(options);
};

const orderProduct = async (price) => {
  const result = await axios
    .post("http://localhost:5000/payment/orders", {
      price: price,
    })
    .then((response) => response.data);

  if (!result) {
    alert("Server error. Are you online?");
    return;
  }

  const { amount, id: order_id, currency } = result;

  const options = {
    key: "rzp_test_U4ecQLSDWLmtEp",
    amount: amount.toString(),
    currency: currency,
    name: "Law Masko",
    description: "Test Transaction",
    image: { logo },
    order_id: order_id,
    handler: async function (response) {
      console.log(response);
      const data = {
        orderCreationId: order_id,
        razorpayPaymentId: response.razorpay_payment_id,
        razorpayOrderId: response.razorpay_order_id,
        razorpaySignature: response.razorpay_signature,
      };

      const result = await axios.post(
        "http://localhost:5000/payment/successOrder",
        data
      );

      alert(result.data.msg);
    },
    prefill: {
      name: "Law Masko",
      email: "careers@lawmasko.com",
      contact: "9999999999",
    },
    notes: {
      address: "India",
    },
    theme: {
      color: "#61dafb",
    },
  };
  displayRazorpay(options);
};

const displayRazorpay = async (options) => {
  const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

  if (!res) {
    alert("Could not load RazorPay!");
    return;
  }

  const paymentObject = new window.Razorpay(options);
  paymentObject.open();
};

const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Buy React now!</p>
        <button className="App-link" onClick={() => orderProduct(500)}>
          Pay ₹500
        </button>
        <button
          className="App-link"
          onClick={() => subscribePlan("sub_Gq7BFCUNS7o0Ri")}
        >
          Subscribe ₹10 per month
        </button>
      </header>
    </div>
  );
};

export default App;
