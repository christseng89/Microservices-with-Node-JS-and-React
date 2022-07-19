var _a, _b;
var emp1 = {};
// ✅ Explicitly checking
if (emp1.department !== undefined) {
    console.log(emp1.department.toLowerCase()); // now string
}
// ✅ Using optional chaining
console.log((_a = emp1.department) === null || _a === void 0 ? void 0 : _a.toLowerCase());
var emp2 = {
    department: "Sales"
};
// ✅ Explicitly checking
if (emp2.department !== undefined) {
    console.log(emp2.department.toLowerCase()); // now string
}
// ✅ Using optional chaining
console.log((_b = emp2.department) === null || _b === void 0 ? void 0 : _b.toLowerCase());
