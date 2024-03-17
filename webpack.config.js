const path = require("path");

module.exports = {
  entry: "./server.js", // Đường dẫn tới tệp nhập
  output: {
    path: path.resolve(__dirname, "dist"), // Thư mục đầu ra sau khi build
    filename: "bundle.js", // Tên tệp đầu ra
  },
  module: {
    rules: [
      // Các quy tắc cho việc xử lý các tệp như JavaScript, CSS, vv.
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
};
