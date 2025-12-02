import React, { useEffect, useState } from 'react'
import { fetchEmployees, createEmployee } from './api'
import type { Employee } from './types'

const App: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: '',
    hourlyRate: '60',
    billable: true
  })

  async function load() {
    try {
      setLoading(true)
      const data = await fetchEmployees()
      setEmployees(data)
    } catch (e:any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleChange = (e:any) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = async (e:any) => {
    e.preventDefault()
    try {
      const newEmp = await createEmployee({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        role: form.role,
        hourlyRate: Number(form.hourlyRate),
        billable: form.billable
      })
      setEmployees(prev => [...prev, newEmp])
      setForm({ firstName:'', lastName:'', email:'', role:'', hourlyRate:'60', billable:true })
    } catch (e:any) {
      setError(e.message)
    }
  }

  return (
    <div style={{ fontFamily:'sans-serif', padding:'1.5rem' }}>
      <h1>SAP CAP + React – Employees</h1>
      {error && <p style={{ color:'red' }}>Error: {error}</p>}

      <section style={{ marginBottom:'2rem' }}>
        <h2>Add Employee</h2>
        <form onSubmit={handleSubmit} style={{ display:'grid', gap:'0.5rem', maxWidth:400 }}>
          <input name="firstName" placeholder="First name" value={form.firstName} onChange={handleChange} />
          <input name="lastName" placeholder="Last name" value={form.lastName} onChange={handleChange} />
          <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
          <input name="role" placeholder="Role" value={form.role} onChange={handleChange} />
          <input name="hourlyRate" type="number" value={form.hourlyRate} onChange={handleChange} />
          <label><input type="checkbox" name="billable" checked={form.billable} onChange={handleChange}/> Billable</label>
          <button type="submit">Create</button>
        </form>
      </section>

      <section>
        <h2>Employees</h2>
        <table style={{ borderCollapse:'collapse', width:'100%', maxWidth:800 }}>
          <thead>
            <tr>
              <th>Name</th><th>Email</th><th>Role</th><th>Hourly</th><th>Billable</th>
            </tr>
          </thead>
          <tbody>
            {employees.map(e => (
              <tr key={e.ID}>
                <td>{e.fullName || `${e.firstName} ${e.lastName}`}</td>
                <td>{e.email}</td>
                <td>{e.role}</td>
                <td>{e.hourlyRate}</td>
                <td>{e.billable ? '✅':'❌'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  )
}

export default App
