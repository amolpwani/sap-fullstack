const cds = require('@sap/cds')

module.exports = cds.service.impl(function () {
  const { Employee } = this.entities

  this.before('CREATE', Employee, req => {
    if (!req.data.role) req.data.role = 'Developer'
  })

  this.after('READ', 'Employees', each => {
    if (each) each.fullName = `${each.firstName} ${each.lastName}`
  })
})