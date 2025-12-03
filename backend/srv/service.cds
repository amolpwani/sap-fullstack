using { questionnaire as model } from '../db/schema';

service QuestionnaireService @(path: '/questionnaire') {
  entity Questions as projection on model.Question;
  entity Submissions as projection on model.Submission;
  entity Responses as projection on model.Response;
  
  // Custom actions
  action submitQuestionnaire(responses: array of {
    questionId: String;
    questionNumber: String;
    questionText: String;
    responseText: String;
    fileName: String;
  }) returns String;
}
