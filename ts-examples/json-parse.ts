var strArray: string[] = [
  'ticket:updated',
  '{"id":"62d68c30f2014a3989905ee7","version":1,"title":"concert","price":99,"userId":"62d68c30f2014a3989905ee6","orderId":"62d68c30f2014a3989905ee9"}',
];

console.log('Object [0]:', strArray[0]);
console.log('Object [1]:', JSON.parse(strArray[1]));
