const cds = require('@sap/cds')

module.exports = cds.service.impl(function () {
  const { Question, Submission, Response } = this.entities

  // Submit complete questionnaire
  this.on('submitQuestionnaire', async (req) => {
    const { responses } = req.data
    const userId = req.user?.id || 'anonymous'
    const timestamp = new Date().toISOString()
    const submissionId = cds.utils.uuid()

    try {
      const db = await cds.connect.to('db')
      
      // Create new submission
      await db.run(
        INSERT.into('questionnaire.Submission').entries({
          ID: submissionId,
          submittedBy: userId,
          submittedAt: timestamp,
          status: 'submitted'
        })
      )

      // Insert all responses for this submission
      for (const response of responses) {
        await db.run(
          INSERT.into('questionnaire.Response').entries({
            submission_ID: submissionId,
            questionId: response.questionId,
            questionNumber: response.questionNumber || '',
            questionText: response.questionText || '',
            responseText: response.responseText,
            fileName: response.fileName || null
          })
        )
      }
      
      return submissionId
    } catch (error) {
      console.error('Submit error:', error)
      req.error(500, `Failed to submit questionnaire: ${error.message}`)
    }
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
