using { questionnaire as model } from '../db/schema';

service QuestionnaireService @(path: '/questionnaire') {
  entity Questions as projection on model.Question;
  entity Responses as projection on model.Response;
  
  // Custom actions
  action submitResponse(responses: array of {
    questionId: String;
    responseText: String;
    fileName: String;
  }) returns String;
  
  function getResponsesByUser(userId: String) returns array of {
    questionId: String;
    responseText: String;
    fileName: String;
    submittedAt: String;
  };
}
