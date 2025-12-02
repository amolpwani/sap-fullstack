namespace questionnaire;

entity Question {
  key ID          : UUID;
  section         : String(200);
  questionText    : String(1000);
  questionNumber  : String(20);
  fieldType       : String(50); // text, textarea, dropdown, radio, file
  options         : String(2000); // JSON array for dropdown/radio options
  required        : Boolean;
  helpText        : String(500);
  orderIndex      : Integer;
}

entity Response {
  key ID          : UUID;
  question        : Association to Question;
  questionId      : UUID;
  responseText    : String(5000);
  fileName        : String(255);
  submittedBy     : String(100);
  submittedAt     : Timestamp;
  updatedAt       : Timestamp;
  status          : String(50); // draft, submitted
}
