export interface Employee {
  ID: string
  firstName: string
  lastName: string
  email: string
  role: string
  billable: boolean
  hourlyRate: number
  createdAt?: string
  fullName?: string
}