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

// Each submission is a complete form submission
entity Submission {
  key ID          : UUID;
  submittedBy     : String(100);
  submittedAt     : Timestamp;
  status          : String(50); // draft, submitted
  responses       : Composition of many Response on responses.submission = $self;
}

// Each response belongs to a submission
entity Response {
  key ID          : UUID;
  submission      : Association to Submission;
  questionId      : UUID;
  questionNumber  : String(20);
  questionText    : String(500);
  responseText    : String(5000);
  fileName        : String(255);
}
