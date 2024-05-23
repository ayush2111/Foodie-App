const mongoose = require("mongoose");

const mongoURI =
  "mongodb+srv://ayudp2111:ayudp2111@cluster0.6oowfme.mongodb.net/Foodie?retryWrites=true&w=majority&appName=Cluster0";

const mongoDB = async () => {
  mongoose.set("strictQuery", false);
  await mongoose.connect(
    mongoURI,
    { useNewUrlParser: true },
    async (err, result) => {
      if (err) console.log("Error connecting to MongoDB:", err);
      else {
        console.log("Connected to MongoDB");
        const fetched_data = await mongoose.connection.db.collection("My_Data");
        fetched_data.find({}).toArray(async function (err, data) {
          const foodcategory = await mongoose.connection.db.collection(
            "Food_Category"
          );
          foodcategory.find({}).toArray(async function (err, catdata) {
            if (err) console.log(err);
            else {
              global.My_Data = data;
              global.Food_Category = catdata;
              // console.log(global.My_Data);
            }
          });
        });
      }
    }
  );
};

module.exports = mongoDB;
