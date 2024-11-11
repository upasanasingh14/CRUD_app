const mongoose = require("mongoose");
const initData = require("./data.js");
const Login = require("../models/login.js");

main()
.then(()=>{
    console.log("connected to db");
})
.catch(err=>{
    console.log(err);
});

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/employeesDb");
}

const initDB = async () => {
    await Login.deleteMany({});
    await Login.insertMany(initData.data);
    console.log("data was initialized");
};

initDB();