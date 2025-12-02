import type { Employee } from './types'

interface ODataResponse<T> {
  value: T[]
}

export async function fetchEmployees(): Promise<Employee[]> {
  const res = await fetch('/catalog/Employees')
  if (!res.ok) throw new Error(`Failed to fetch employees: ${res.status}`)
  const data = (await res.json()) as ODataResponse<Employee>
  return data.value
}

export async function createEmployee(emp: Partial<Employee>): Promise<Employee> {
  const res = await fetch('/catalog/Employees', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(emp)
  })
  if (!res.ok) throw new Error(`Failed to create employee: ${res.status}`)
  return (await res.json()) as Employee
}