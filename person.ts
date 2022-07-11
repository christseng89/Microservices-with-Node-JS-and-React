abstract class Person {
  name: string;
  constructor(name: string) {
    this.name = name;
  }

  display(): void{
    console.log(this.name);
  }

  abstract find(string): Person;
}

class Employee extends Person { 
  empCode: number;
  
  constructor(name: string, code: number) { 
    super(name); // must call super()
    this.empCode = code;
  }

  find(name:string): Person { 
    // execute AJAX request to find an employee from a db
    return new Employee(name, 1);
  }
}

let emp: Person = new Employee("James", 100);
emp.display(); //James
console.log('emp :', emp)

let emp2: Person = emp.find('Steve');
emp2.display(); //Steve
console.log('emp2 :', emp2)

// James
// emp : Employee { name: 'James', empCode: 100 }
// Steve
// emp2 : Employee { name: 'Steve', empCode: 1 }
