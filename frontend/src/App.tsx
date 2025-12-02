import React, { useEffect, useState } from 'react'
import { fetchQuestions, fetchResponses, submitResponses } from './api'
import type { Question, Response, QuestionWithResponse } from './types'
import './styles.css'

const App: React.FC = () => {
  const [questions, setQuestions] = useState<QuestionWithResponse[]>([])
  const [responses, setResponses] = useState<Map<string, string>>(new Map())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'form' | 'history'>('form')

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      setLoading(true)
      setError(null)
      const [questionsData, responsesData] = await Promise.all([
        fetchQuestions(),
        fetchResponses()
      ])

      // Create a map of responses by questionId
      const responseMap = new Map<string, Response>()
      responsesData.forEach(r => {
        responseMap.set(r.questionId, r)
      })

      // Merge questions with responses
      const merged = questionsData.map(q => ({
        ...q,
        response: responseMap.get(q.ID)
      }))

      setQuestions(merged)

      // Initialize form with existing responses
      const initialResponses = new Map<string, string>()
      merged.forEach(q => {
        if (q.response?.responseText) {
          initialResponses.set(q.ID, q.response.responseText)
        }
      })
      setResponses(initialResponses)
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
        return
      }

      // Prepare responses
      const responseData = Array.from(responses.entries()).map(([questionId, responseText]) => ({
        questionId,
        responseText,
        fileName: ''
      }))

      await submitResponses(responseData)
      setSuccess('✓ Responses submitted successfully!')
      await loadData() // Reload to show updated data
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const renderField = (question: QuestionWithResponse) => {
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
  }, {} as Record<string, QuestionWithResponse[]>)

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
          📊 View Responses
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
          <div className="sap-message sap-message-success">
            <span className="sap-message-icon">✓</span>
            {success}
            <button className="sap-message-close" onClick={() => setSuccess(null)}>×</button>
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

                      {question.response && (
                        <div className="sap-response-info">
                          Last updated: {new Date(question.response.updatedAt || question.response.submittedAt || '').toLocaleString()}
                        </div>
                      )}
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
              <h2>Response History</h2>
              <p className="sap-history-subtitle">
                View your previously submitted responses
              </p>
            </div>

            {questions.filter(q => q.response).length === 0 ? (
              <div className="sap-empty-state">
                <div className="sap-empty-icon">📋</div>
                <h3>No responses yet</h3>
                <p>Fill out the questionnaire to see your responses here</p>
                <button
                  className="sap-btn sap-btn-primary"
                  onClick={() => setViewMode('form')}
                >
                  Go to Questionnaire
                </button>
              </div>
            ) : (
              <div className="sap-history-container">
                <div className="sap-history-summary">
                  <div className="sap-summary-card">
                    <div className="sap-summary-icon">📝</div>
                    <div className="sap-summary-content">
                      <div className="sap-summary-value">{questions.filter(q => q.response).length}</div>
                      <div className="sap-summary-label">Questions Answered</div>
                    </div>
                  </div>
                  <div className="sap-summary-card">
                    <div className="sap-summary-icon">✓</div>
                    <div className="sap-summary-content">
                      <div className="sap-summary-value">{questions.length}</div>
                      <div className="sap-summary-label">Total Questions</div>
                    </div>
                  </div>
                  <div className="sap-summary-card">
                    <div className="sap-summary-icon">🕐</div>
                    <div className="sap-summary-content">
                      <div className="sap-summary-value">
                        {questions.find(q => q.response)?.response?.submittedAt 
                          ? new Date(questions.find(q => q.response)!.response!.submittedAt!).toLocaleDateString()
                          : 'N/A'}
                      </div>
                      <div className="sap-summary-label">Last Submission</div>
                    </div>
                  </div>
                </div>

                <div className="sap-response-list">
                  <h3 className="sap-response-list-title">Submitted Responses</h3>
                  {questions.filter(q => q.response).map((question, index) => (
                    <div key={question.ID} className="sap-response-card">
                      <div className="sap-response-header">
                        <div className="sap-response-number">#{index + 1}</div>
                        <div className="sap-response-question">
                          <span className="sap-question-badge">{question.questionNumber}</span>
                          <span className="sap-response-question-text">{question.questionText}</span>
                        </div>
                      </div>
                      <div className="sap-response-body">
                        <div className="sap-response-answer">
                          <strong>Answer:</strong> {question.response?.responseText}
                        </div>
                        {question.response?.fileName && (
                          <div className="sap-response-attachment">
                            <span className="sap-file-icon">📎</span>
                            <span>Attachment: {question.response.fileName}</span>
                          </div>
                        )}
                      </div>
                      <div className="sap-response-footer">
                        <span className="sap-response-time">
                          🕐 Submitted: {new Date(question.response?.submittedAt || '').toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                        {question.response?.updatedAt && question.response.updatedAt !== question.response.submittedAt && (
                          <span className="sap-response-updated">
                            ✏️ Updated: {new Date(question.response.updatedAt).toLocaleString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
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
