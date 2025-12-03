export interface Question {
  ID: string
  section: string
  questionText: string
  questionNumber: string
  fieldType: 'text' | 'textarea' | 'dropdown' | 'radio' | 'file'
  options?: string // JSON string array
  required: boolean
  helpText?: string
  orderIndex: number
}

export interface Response {
  ID?: string
  submission_ID?: string
  questionId: string
  questionNumber: string
  questionText: string
  responseText: string
  fileName?: string
}

export interface Submission {
  ID: string
  submittedBy: string
  submittedAt: string
  status: string
  responses?: Response[]
}

export interface QuestionWithResponse extends Question {
  response?: string
}
