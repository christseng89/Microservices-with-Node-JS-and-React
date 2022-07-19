type Employee = {
  name?: string;
  department?: string;
  country?: string;
};

const emp1: Employee = {};

// ✅ Explicitly checking
if (emp1.department !== undefined) {
  console.log(emp1.department.toLowerCase()); // now string
}

// ✅ Using optional chaining
console.log(emp1.department?.toLowerCase());

const emp2: Employee = {
  department: `Sales`,
};

// ✅ Explicitly checking
if (emp2.department !== undefined) {
  console.log(emp2.department.toLowerCase()); // now string
}

// ✅ Using optional chaining
console.log(emp2.department?.toLowerCase());