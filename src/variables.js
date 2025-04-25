module.exports = function (instance) {
    let self = instance
    let variables = []

    variables.push({ variableId: `destination`, name: `Selected Destination` })
    variables.push({ variableId: `destination_name`, name: `Selected Destination Name` })

    self.setVariableDefinitions(variables)
}