import type { Question, Submission, Response } from './types'

interface ODataResponse<T> {
  value: T[]
}

export async function fetchQuestions(): Promise<Question[]> {
  const res = await fetch('/questionnaire/Questions?$orderby=orderIndex asc')
  if (!res.ok) throw new Error(`Failed to fetch questions: ${res.status}`)
  const data = (await res.json()) as ODataResponse<Question>
  return data.value
}

export async function fetchSubmissions(): Promise<Submission[]> {
  const res = await fetch('/questionnaire/Submissions?$orderby=submittedAt desc&$expand=responses')
  if (!res.ok) throw new Error(`Failed to fetch submissions: ${res.status}`)
  const data = (await res.json()) as ODataResponse<Submission>
  return data.value
}

export async function submitQuestionnaire(responses: Array<{
  questionId: string
  questionNumber: string
  questionText: string
  responseText: string
  fileName?: string
}>): Promise<string> {
  const res = await fetch('/questionnaire/submitQuestionnaire', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ responses })
  })
  if (!res.ok) throw new Error(`Failed to submit questionnaire: ${res.status}`)
  const data = await res.json()
  return data.value || 'Success'
}
