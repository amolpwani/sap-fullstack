import type { Question, Response } from './types'

interface ODataResponse<T> {
  value: T[]
}

export async function fetchQuestions(): Promise<Question[]> {
  const res = await fetch('/questionnaire/Questions?$orderby=orderIndex asc')
  if (!res.ok) throw new Error(`Failed to fetch questions: ${res.status}`)
  const data = (await res.json()) as ODataResponse<Question>
  return data.value
}

export async function fetchResponses(): Promise<Response[]> {
  const res = await fetch('/questionnaire/Responses')
  if (!res.ok) throw new Error(`Failed to fetch responses: ${res.status}`)
  const data = (await res.json()) as ODataResponse<Response>
  return data.value
}

export async function submitResponses(responses: Array<{
  questionId: string
  responseText: string
  fileName?: string
}>): Promise<string> {
  const res = await fetch('/questionnaire/submitResponse', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ responses })
  })
  if (!res.ok) throw new Error(`Failed to submit responses: ${res.status}`)
  const data = await res.json()
  return data.value || 'Success'
}