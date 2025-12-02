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
  questionId: string
  responseText: string
  fileName?: string
  submittedBy?: string
  submittedAt?: string
  updatedAt?: string
  status?: string
}

export interface QuestionWithResponse extends Question {
  response?: Response
}