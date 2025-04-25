const { combineRgb } = require('@companion-module/base')

module.exports = function (instance) {
    let self = instance
    let feedbacks = {}

    feedbacks['example_feedback'] = {
        type: 'boolean',
        label: 'Example Feedback',
        description: 'An example feedback',
        options: [
            {
                type: 'textinput',
                label: 'Example Option',
                id: 'example_option',
                default: '',
            },
        ],
        callback: (feedback) => {
            return feedback.options.example_option === 'expected_value'
        },
    }

    self.setFeedbackDefinitions(feedbacks)
}
