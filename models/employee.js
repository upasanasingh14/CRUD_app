const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const imageSchema = new Schema({
    filename: String,
    url: String,
});

const employeeSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phoneNo: {
        type: Number,
        required: true
    },
    designation: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    course: {
        type: Array,
        required: true
    },
    image: imageSchema,
    created_at: {
        type: Date,
        required: true
    }

});

const Employee = mongoose.model("Employee", employeeSchema);

module.exports = Employee;