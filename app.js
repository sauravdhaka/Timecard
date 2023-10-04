const xlsx = require('xlsx')
const moment = require('moment')


// reading the file
const workbook = xlsx.readFile('./Assignment_Timecard.xlsx',{cellDates: true})
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];

// Parse the worksheet into JSON data
const jsonData = xlsx.utils.sheet_to_json(worksheet);

// Initialize arrays to store employees for each condition
const consecutiveDaysEmployees = [];
const lessThan10HoursEmployees = [];
const moreThan14HoursEmployees = [];

// functiion to add unique values in array
function addToUniqueArray(value) {
    if (!lessThan10HoursEmployees.includes(value)) {
      lessThan10HoursEmployees.push(value);
    }
  }

// for counting the conjucative consecutiveDays

var lastName  // for the lastName in sheet
var count = 0 // taking the count
var lastDate = 0 // lastDaet of work
var lastMonth = 0 // last month of work

// I am making asumoption that the data in sheet is only in single year tha's why i am not considring the year

// trvershing the data
jsonData.forEach((row) => {
    const name = row['Employee Name']; // name of current employee
    const position = row['Position ID']; // position id of cuurent employee
    const startDay = new Date(row['Time']).getDate() // taking date like which number like 1 2 3 .. 27 28 26 
    const endDay = new Date(row['Time Out']).getDate() // taking end date 
    const startMonth = new Date(row['Time']).getMonth() // taking the month 
    const endMonth = new Date(row['Time Out']).getMonth() // last month
    const hoursWorked = parseFloat(row['Timecard Hours (as Time)']); // taking how much work is done in this shift
    
    // Here algorithm for counting the conjecative days
    if(!lastName){ // if not last name then we assign the current employee name and it's value like date , moth etc..
        lastName = name
        lastDate = startDay
        lastMonth = startMonth
        count = 1
    }
    else if(lastName === name){ /// if name match then we compare if the month is same and the date diffrence is 1
        if(lastDate + 1 === startDay && lastMonth === startMonth){
            count = count + 1 // if match is true then increment the count by 1
        }
        else if(lastDate == startDay && lastMonth === startMonth){
            count = count // if name match but date and month same then keep the same
        }
        else{ // else assign the current employee name and date , month and set count is 1
            lastName = name
            count = 1
            lastDate = startDay
            lastMonth = startMonth
        }
    }
    else{ // if name not match then assing the value accordingly 
            lastName = name
            count = 1
            lastDate = startDay
            lastMonth = startMonth
    }
    // keep changing the last values 
     lastName = name
        lastDate = startDay
        lastMonth = startMonth



    // if count > 7 then we push that employee name and position into array
    if(count > 7){
        consecutiveDaysEmployees.push({name,position})
        count = 1
    }


    

  
    
    // Check for less than 10 hours between shifts but greater than 1 hour (condition b)
    if (hoursWorked < 10 && hoursWorked > 1) {
        addToUniqueArray({ name, position })
    }
  
    // Check for more than 14 hours in a single shift (condition c)
    if (hoursWorked > 14) {
      moreThan14HoursEmployees.push({ name, position });
    }
  });


  // this is for taking only unique values 
  const consecutiveDaysEmployeesSet = new Set()
  consecutiveDaysEmployees.forEach((obj)=>{
    const objKey = JSON.stringify(obj)
    consecutiveDaysEmployeesSet.add(objKey)
  })

  const consecutiveDaysEmployeesUnique = Array.from(consecutiveDaysEmployeesSet,(objKey)=>JSON.parse(objKey))

  const lessThan10HoursEmployeesSet = new Set();

  lessThan10HoursEmployees.forEach((obj)=>{
    const objKey = JSON.stringify(obj);

    lessThan10HoursEmployeesSet.add(objKey)
  })

  const lessThan10HoursEmployeesUnique = Array.from(lessThan10HoursEmployeesSet,(objKey)=> JSON.parse(objKey));

  
  console.log('Employees who has worked for 7 consecutive days: ',consecutiveDaysEmployeesUnique)
  console.log('Employees with less than 10 hours between shifts: ',lessThan10HoursEmployeesUnique)
  console.log('Employees who worked for more than 14 hours in a single shift:', moreThan14HoursEmployees);


