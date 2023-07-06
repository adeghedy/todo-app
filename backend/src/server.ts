const port: number = parseInt(process.env.PORT as string) || 3002;
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = require("./app");

dotenv.config({ path: ".env" });

const DB = process.env.DATABASE_URL as string;

mongoose.set("strictQuery", false);

mongoose
  .connect(DB)
  .then(() => console.log("DB connection successful!"))
  .catch((e: any) => {
    console.log("Error: ", e);
  });

app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
