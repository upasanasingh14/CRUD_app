const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Login = require("./models/login.js");
const Employee = require("./models/employee.js");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const path = require("path");
const ExpressError = require("./utils/ExpressError.js");
const wrapAsync = require("./utils/wrapAsync.js");


main().then(()=>{
    console.log("connected to DB");
}).catch(err => {
    console.log(err);
});

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/employeesDb");  
}
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded( { extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

app.get("/", (req,res)=>{
    res.send("root route");
});


//login route
app.get("/login", async (req,res)=>{
    res.render("login.ejs", {errorMsg: false});
});

app.post("/login", async (req,res)=>{
    let {username, password } = req.body;
    const loginData = await Login.findOne({username, password});
    if(loginData){
        res.redirect("/employee");
    } else {
        res.render("login.ejs", {errorMsg: true});
    }
});

//EMPLOYEE ROUTES

//Index Route
app.get("/employee", async(req,res)=>{
    const allEmployees = await Employee.find({});
    res.render("employee/index.ejs", { allEmployees });
})

//New Employee Route
app.get("/employee/new", async (req, res)=>{
    res.render("employee/new.ejs");
});

//Show Route
app.get("/employee/:id", async (req, res)=>{
    let { id } = req.params;
    const employee = await Employee.findById(id);
    res.render("employee/edit.ejs", {employee});
   
});

//create Route
app.post("/employee",async (req, res)=>{
    // let { title, description, image, price, location } = req.body;
    console.log(req.body);
    const newEmployee = new Employee({...req.body.employee, created_at: new Date()});
    await newEmployee.save();
   res.redirect("/employee");
});

//edit Route
app.get("/employee/:id/edit", async (req, res)=>{
    let { id } = req.params;
    const employee = await Employee.findById(id);
    res.render("employee/edit.ejs", { employee });
});

//Update Route
app.put("/employee/:id", async (req, res)=>{
    let { id } = req.params;
    await Employee.findByIdAndUpdate(id, {...req.body.employee});
    res.redirect("/employee");
});

//Delete Route
app.delete("/employee/:id", async (req, res)=>{
    let { id } = req.params;
    let deletedEmployee = await Employee.findByIdAndDelete(id);
    console.log(deletedEmployee);
    res.redirect("/employee");
});

app.all("*",(req,res,next)=>{
    next(new ExpressError(404, "Page not found!"));
});

app.use((err,req,res,next)=>{
    let {status = 500, message="Something went Wrong!"} = err;
    res.status(status).send(message);
});

app.listen(8081, ()=>{
    console.log("Server is listening..");
});