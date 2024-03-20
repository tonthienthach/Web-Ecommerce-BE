require("dotenv").config();

const express = require("express");
const { createServer } = require("http");
const session = require("express-session");
const { messageHandler } = require("./controllers/MessageController");
require("./passport");
//connectDB
const { Server } = require("socket.io");

const { DBconnect } = require("./configs/ConnectDB");
DBconnect();

//router
const brandRouter = require("./routes/BrandRoute");

const cateRouter = require("./routes/CateRoute");

const productRouter = require("./routes/ProductRoute");

const AuthenRoute = require("./routes/AuthenRoute");

const CartRoute = require("./routes/CartRoute");

const OrderRoute = require("./routes/OrderRoute");

const AddressRoute = require("./routes/AddressRoute");

const RateRouter = require("./routes/RateRoute");

const UserRoute = require("./routes/UserRoute");

const VoucherRoute = require("./routes/VoucherRoute");

const MessageRoute = require("./routes/MessageRoute");

const PassportAuthRoute = require("./routes/PassportAuth/PassportAuthRoute");

//routes admin
const adminProductRouter = require("./routes/admin/AdminProductRoute");

const adminUserRouter = require("./routes/admin/AdminUserRoute");

const adminOrderRouter = require("./routes/admin/AdminOrderRoute");

const adminDashBoardRouter = require("./routes/admin/DashBoardRoute");

// routes vnpay
const vnpayRoute = require("./routes/vnpay/VNpayRoute");
const cors = require("cors");

const app = express();
const corsOptions = {
  // origin: "http://localhost:3000",
  origin: process.env.DOMAIN,
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use(express.json());

const oneDay = 1000 * 60 * 60 * 24;
app.use(
  session({
    secret: "tech-store",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
  })
);

const httpServer = createServer(app);

// const io = new Server(httpServer);

// messageHandler(io);
const server = app.listen(process.env.PORT || 8080, () => {
  console.log(`API listening on PORT ${process.env.PORT} `);
});

// httpServer.listen(process.env.PORT, () => {
//   console.log(`app is running on port ${process.env.PORT}`);
// });

app.use("/api/brand", brandRouter);

app.use("/api/category", cateRouter);

app.use("/api/product", productRouter);

app.use("/api/admin/product", adminProductRouter);

app.use("/api/admin/order", adminOrderRouter);

app.use("/api/admin/user", adminUserRouter);

app.use("/api/admin/dashboard", adminDashBoardRouter);

app.use("/api/user/", AuthenRoute);

app.use("/api/cart/", CartRoute);

app.use("/api/order/", OrderRoute);

app.use("/api/address/", AddressRoute);

app.use("/api/rate/", RateRouter);

app.use("/api/payment/", vnpayRoute);

app.use("/api/user", UserRoute);

app.use("/api/voucher", VoucherRoute);

app.use("/api/message", MessageRoute);

app.use("/api/auth", PassportAuthRoute);

app.get("/", (req, res) => {
  res.send("hello");
});

// Socket IO
const io = new Server(server);
messageHandler(io);
