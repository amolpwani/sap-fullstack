const cds = require('@sap/cds')

module.exports = cds.service.impl(function () {
  const { Question, Response } = this.entities

  // Submit multiple responses
  this.on('submitResponse', async (req) => {
    const { responses } = req.data
    const userId = req.user?.id || 'anonymous'
    const timestamp = new Date().toISOString()

    try {
      for (const response of responses) {
        // Check if response already exists
        const existing = await SELECT.one.from(Response)
          .where({ questionId: response.questionId, submittedBy: userId })

        if (existing) {
          // Update existing response
          await UPDATE(Response)
            .set({
              responseText: response.responseText,
              fileName: response.fileName || null,
              updatedAt: timestamp,
              status: 'submitted'
            })
            .where({ ID: existing.ID })
        } else {
          // Create new response
          await INSERT.into(Response).entries({
            questionId: response.questionId,
            responseText: response.responseText,
            fileName: response.fileName || null,
            submittedBy: userId,
            submittedAt: timestamp,
            updatedAt: timestamp,
            status: 'submitted'
          })
        }
      }
      return 'Responses submitted successfully'
    } catch (error) {
      req.error(500, `Failed to submit responses: ${error.message}`)
    }
  })

  // Get responses by user
  this.on('getResponsesByUser', async (req) => {
    const { userId } = req.data
    const responses = await SELECT.from(Response)
      .where({ submittedBy: userId || 'anonymous' })
    
    return responses.map(r => ({
      questionId: r.questionId,
      responseText: r.responseText,
      fileName: r.fileName,
      submittedAt: r.submittedAt
    }))
  })

  // Add question validation
  this.before('CREATE', Question, req => {
    if (!req.data.fieldType) {
      req.data.fieldType = 'text'
    }
    if (req.data.required === undefined) {
      req.data.required = false
    }
  })
})