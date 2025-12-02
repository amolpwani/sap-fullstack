namespace training;

entity Employee {
  key ID       : UUID;
  firstName    : String(100);
  lastName     : String(100);
  email        : String(150);
  role         : String(100);
  billable     : Boolean;
  hourlyRate   : Decimal(9,2);
  createdAt    : Timestamp;
}
