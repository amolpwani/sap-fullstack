import React, { useEffect, useState } from 'react'
import { fetchQuestions, fetchSubmissions, submitQuestionnaire } from './api'
import type { Question, Submission } from './types'
import './styles.css'

const App: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([])
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [responses, setResponses] = useState<Map<string, string>>(new Map())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'form' | 'history'>('form')
  const [expandedSubmission, setExpandedSubmission] = useState<string | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  // Auto-dismiss success message after 5 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(null)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [success])

  async function loadData() {
    try {
      setLoading(true)
      setError(null)
      const [questionsData, submissionsData] = await Promise.all([
        fetchQuestions(),
        fetchSubmissions()
      ])
      setQuestions(questionsData)
      setSubmissions(submissionsData)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (questionId: string, value: string) => {
    setResponses(prev => new Map(prev).set(questionId, value))
  }

  const handleReset = () => {
    setResponses(new Map())
    setError(null)
    setSuccess(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    try {
      setLoading(true)
      
      // Validate required fields
      const missingRequired = questions.filter(q => 
        q.required && !responses.get(q.ID)?.trim()
      )

      if (missingRequired.length > 0) {
        setError(`Please answer all required questions: ${missingRequired.map(q => q.questionNumber).join(', ')}`)
        setLoading(false)
        return
      }

      // Prepare responses with question details
      const responseData = Array.from(responses.entries())
        .filter(([_, value]) => value.trim())
        .map(([questionId, responseText]) => {
          const question = questions.find(q => q.ID === questionId)
          return {
            questionId,
            questionNumber: question?.questionNumber || '',
            questionText: question?.questionText || '',
            responseText,
            fileName: ''
          }
        })

      if (responseData.length === 0) {
        setError('Please answer at least one question')
        setLoading(false)
        return
      }

      const submissionId = await submitQuestionnaire(responseData)
      setSuccess(`✓ Questionnaire submitted successfully! Submission ID: ${submissionId.substring(0, 8)}...`)
      setResponses(new Map()) // Clear form after successful submission
      await loadData() // Reload to show new submission
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const renderField = (question: Question) => {
    const value = responses.get(question.ID) || ''
    const commonProps = {
      value,
      onChange: (e: any) => handleInputChange(question.ID, e.target.value),
      required: question.required,
      disabled: loading
    }

    switch (question.fieldType) {
      case 'textarea':
        return (
          <textarea
            {...commonProps}
            className="sap-textarea"
            rows={4}
            placeholder="Enter your response..."
          />
        )

      case 'dropdown':
        const dropdownOptions = question.options ? JSON.parse(question.options) : []
        return (
          <select {...commonProps} className="sap-select">
            <option value="">Select Region</option>
            {dropdownOptions.map((opt: string) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        )

      case 'radio':
        const radioOptions = question.options ? JSON.parse(question.options) : []
        return (
          <div className="sap-radio-group">
            {radioOptions.map((opt: string) => (
              <label key={opt} className="sap-radio-label">
                <input
                  type="radio"
                  name={question.ID}
                  value={opt}
                  checked={value === opt}
                  onChange={(e) => handleInputChange(question.ID, e.target.value)}
                  required={question.required}
                  disabled={loading}
                  className="sap-radio"
                />
                <span className="sap-radio-text">{opt}</span>
              </label>
            ))}
          </div>
        )

      case 'file':
        return (
          <div className="sap-file-upload">
            <input
              type="file"
              id={`file-${question.ID}`}
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) {
                  handleInputChange(question.ID, file.name)
                }
              }}
              disabled={loading}
              className="sap-file-input"
            />
            <label htmlFor={`file-${question.ID}`} className="sap-file-label">
              <span className="sap-file-icon">📎</span>
              Choose File
            </label>
            {value && <span className="sap-file-name">{value}</span>}
          </div>
        )

      default: // text
        return (
          <input
            {...commonProps}
            type="text"
            className="sap-input"
            placeholder="Enter your response..."
          />
        )
    }
  }

  const groupedQuestions = questions.reduce((acc, q) => {
    if (!acc[q.section]) {
      acc[q.section] = []
    }
    acc[q.section].push(q)
    return acc
  }, {} as Record<string, Question[]>)

  const formatDateTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  if (loading && questions.length === 0) {
    return (
      <div className="sap-container">
        <div className="sap-loading">Loading questionnaire...</div>
      </div>
    )
  }

  return (
    <div className="sap-container">
      {/* Header */}
      <header className="sap-header">
        <div className="sap-header-content">
          <div className="sap-logo">
            <svg width="40" height="40" viewBox="0 0 40 40">
              <rect width="40" height="40" fill="#0070F2" rx="4"/>
              <text x="50%" y="50%" fill="white" fontSize="24" fontWeight="bold" textAnchor="middle" dy=".35em">Q</text>
            </svg>
          </div>
          <h1 className="sap-title">QuestionnaireUI</h1>
          <div className="sap-user-badge">DU</div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="sap-nav">
        <button
          className={`sap-nav-btn ${viewMode === 'form' ? 'active' : ''}`}
          onClick={() => setViewMode('form')}
        >
          📝 Fill Questionnaire
        </button>
        <button
          className={`sap-nav-btn ${viewMode === 'history' ? 'active' : ''}`}
          onClick={() => setViewMode('history')}
        >
          📊 Submission History ({submissions.length})
        </button>
      </nav>

      {/* Main Content */}
      <main className="sap-main">
        {error && (
          <div className="sap-message sap-message-error">
            <span className="sap-message-icon">⚠️</span>
            {error}
            <button className="sap-message-close" onClick={() => setError(null)}>×</button>
          </div>
        )}

        {success && (
          <div className="sap-toast-container">
            <div className="sap-toast sap-toast-success">
              <div className="sap-toast-icon">✓</div>
              <div className="sap-toast-content">
                <div className="sap-toast-title">Success!</div>
                <div className="sap-toast-message">{success}</div>
              </div>
              <button className="sap-toast-close" onClick={() => setSuccess(null)}>×</button>
              <div className="sap-toast-progress"></div>
            </div>
          </div>
        )}

        {viewMode === 'form' ? (
          <form onSubmit={handleSubmit} className="sap-form">
            <div className="sap-form-header">
              <h2>Global Customs and Trade Compliance</h2>
              <p className="sap-form-subtitle">
                Please complete all required fields marked with <span className="sap-required">*</span>
              </p>
            </div>

            {Object.entries(groupedQuestions).map(([section, sectionQuestions]) => (
              <div key={section} className="sap-section">
                <div className="sap-section-header">
                  <h3 className="sap-section-title">{section}</h3>
                </div>

                <div className="sap-section-content">
                  {sectionQuestions.map(question => (
                    <div key={question.ID} className="sap-form-group">
                      <label className="sap-label">
                        <span className="sap-question-number">{question.questionNumber}</span>
                        {question.questionText}
                        {question.required && <span className="sap-required"> *</span>}
                      </label>
                      
                      {question.helpText && (
                        <div className="sap-help-text">{question.helpText}</div>
                      )}

                      {renderField(question)}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div className="sap-form-actions">
              <button
                type="button"
                className="sap-btn sap-btn-secondary"
                onClick={handleReset}
                disabled={loading}
              >
                Reset Form
              </button>
              <button
                type="submit"
                className="sap-btn sap-btn-primary"
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Submit Responses'}
              </button>
            </div>
          </form>
        ) : (
          <div className="sap-history">
            <div className="sap-history-header">
              <h2>Submission History</h2>
              <p className="sap-history-subtitle">
                View all your questionnaire submissions. Click on a row to expand and see responses.
              </p>
            </div>

            {submissions.length === 0 ? (
              <div className="sap-empty-state">
                <div className="sap-empty-icon">📋</div>
                <h3>No submissions yet</h3>
                <p>Fill out the questionnaire to see your submissions here</p>
                <button
                  className="sap-btn sap-btn-primary"
                  onClick={() => setViewMode('form')}
                >
                  Go to Questionnaire
                </button>
              </div>
            ) : (
              <div className="sap-table-container">
                <table className="sap-table">
                  <thead>
                    <tr>
                      <th style={{ width: '60px' }}>#</th>
                      <th style={{ width: '150px' }}>Submission ID</th>
                      <th style={{ width: '120px' }}>Submitted By</th>
                      <th style={{ width: '220px' }}>Submission Time</th>
                      <th style={{ width: '100px' }}>Responses</th>
                      <th style={{ width: '100px' }}>Status</th>
                      <th style={{ width: '80px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {submissions.map((submission, index) => (
                      <React.Fragment key={submission.ID}>
                        <tr 
                          className={`sap-table-row ${expandedSubmission === submission.ID ? 'expanded' : ''}`}
                          onClick={() => setExpandedSubmission(
                            expandedSubmission === submission.ID ? null : submission.ID
                          )}
                        >
                          <td className="sap-table-cell">
                            <span className="sap-row-number">{index + 1}</span>
                          </td>
                          <td className="sap-table-cell">
                            <span className="sap-submission-id">{submission.ID.substring(0, 8)}...</span>
                          </td>
                          <td className="sap-table-cell">
                            <span className="sap-user-name">{submission.submittedBy}</span>
                          </td>
                          <td className="sap-table-cell">
                            <span className="sap-timestamp">
                              🕐 {formatDateTime(submission.submittedAt)}
                            </span>
                          </td>
                          <td className="sap-table-cell">
                            <span className="sap-response-count">
                              {submission.responses?.length || 0} answers
                            </span>
                          </td>
                          <td className="sap-table-cell">
                            <span className={`sap-status sap-status-${submission.status}`}>
                              {submission.status}
                            </span>
                          </td>
                          <td className="sap-table-cell">
                            <button 
                              className="sap-expand-btn"
                              onClick={(e) => {
                                e.stopPropagation()
                                setExpandedSubmission(
                                  expandedSubmission === submission.ID ? null : submission.ID
                                )
                              }}
                            >
                              {expandedSubmission === submission.ID ? '▼' : '▶'}
                            </button>
                          </td>
                        </tr>
                        {expandedSubmission === submission.ID && (
                          <tr className="sap-expanded-row">
                            <td colSpan={7}>
                              <div className="sap-expanded-content">
                                <h4>Responses for Submission #{index + 1}</h4>
                                <table className="sap-inner-table">
                                  <thead>
                                    <tr>
                                      <th>Question #</th>
                                      <th>Question</th>
                                      <th>Response</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {submission.responses?.map(response => (
                                      <tr key={response.ID}>
                                        <td>
                                          <span className="sap-question-badge">{response.questionNumber}</span>
                                        </td>
                                        <td>{response.questionText}</td>
                                        <td>
                                          <strong>{response.responseText}</strong>
                                          {response.fileName && (
                                            <span className="sap-file-badge">
                                              📎 {response.fileName}
                                            </span>
                                          )}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="sap-footer">
        <p>© 2025 Questionnaire System | Powered by SAP CAP & React</p>
      </footer>
    </div>
  )
}

export default App
