const { sendCommand } = require('./api')
module.exports = function (instance) {
    let self = instance
    let actions = {}

    actions['select_route'] = {
        name: 'Route Crosspoint',
        description: 'Select a Route',
        options: [
            {
                type: 'number',
                label: 'source',
                id: 'src',
                default: 1,
                min: 1,
                max: self.maxSources, // Use instance.maxSources
                range: false,
                isVisible: (options) => options.useVariable === false || options.useVariable === undefined,
            },
            {
                type: 'textinput',
                label: 'source',
                id: 'srcvar',
                default: '',
                useVariables: true,
                isVisible: (options) => options.useVariable === true,
            },
            {
                type: 'checkbox',
                label: 'Use Variable',
                id: 'useVariable',
                default: false,
            },
            {
                type: 'number',
                label: 'destination',
                id: 'dst',
                default: 1,
                min: 1,
                max: self.maxDestinations, // Use instance.maxDestinations
                range: false,
                isVisible: (options) => options.useVariable === false || options.useVariable === undefined,
            },
            {
                type: 'textinput',
                label: 'destination',
                id: 'dstvar',
                default: '',
                useVariables: true,
                isVisible: (options) => options.useVariable === true,
            },
            {
                type: 'textinput',
                id: 'levels',
                label: 'Levels',
                width: 6,
                default: 'V',
                useVariables: true,
            },
        ],
        callback: async function (action) {
            let options = action.options
            let levels = await self.parseVariablesInString(options.levels)
            let command
            if (!options.useVariable) {
                cmd = `.S${levels}${options.dst},${options.src}`
            } else {
                cmd = `.S${levels}${options.dstvar},${options.srcvar}`
            }
            await sendCommand(self, cmd)
        },
    }

    self.setActionDefinitions(actions)
}
