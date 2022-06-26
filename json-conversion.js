let person = { name: 'John', age: 30 };
console.log(JSON.stringify(person));

person = { _id: 12345, name: 'John', age: 30, toJSON() { return {id: this._id, name: this.name}; } };
console.log(JSON.stringify(person));

const personJson = () => JSON.stringify(person);
console.log(JSON.parse(personJson()));
