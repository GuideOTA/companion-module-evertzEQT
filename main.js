const { InstanceBase, Regex, runEntrypoint, InstanceStatus } = require('@companion-module/base')
const UpgradeScripts = require('./upgrades')
const UpdateActions = require('./actions')
const UpdateFeedbacks = require('./feedbacks')
const UpdateVariableDefinitions = require('./variables')

class ModuleInstance extends InstanceBase {
	constructor(internal) {
		super(internal)
	}

	async init(config) {
		this.config = config

		this.updateStatus(InstanceStatus.Ok)

		this.updateActions() // export actions
		this.updateFeedbacks() // export feedbacks
		this.updateVariableDefinitions() // export variable definitions
	}
	// When module gets deleted
	async destroy() {
		this.log('debug', 'destroy')
	}

	async configUpdated(config) {
		this.config = config
	}

	// Return config fields for web config
	getConfigFields() {
			let self = this
	
			return [
				{
					type: 'static-text',
					id: 'info',
					width: 12,
					label: 'Information',
					value: 'This modules controls Evertz EQX series routers using the Quartz protocol.',
				},
				{
					type: 'static-text',
					id: 'hr1',
					width: 12,
					label: ' ',
					value: '<hr />',
				},
				{
					type: 'textinput',
					id: 'host',
					label: 'IP Address',
					width: 4,
					default: '',
					regex: Regex.IP,
				},
				{
					type: 'textinput',
					id: 'port',
					label: 'Port',
					width: 3,
					default: '23',
				},
				{
					type: 'static-text',
					id: 'hostinfo',
					width: 5,
					label: ' ',
					value: 'The port number is typically 23.',
				},
				{
					type: 'number',
					id: 'max_destinations',
					label: 'Max Destinations',
					width: 4,
					default: 100,
					required: true,
				},
				{
					type: 'number',
					id: 'max_sources',
					label: 'Max Sources',
					width: 4,
					default: 100,
					required: true,
				},
				{
					type: 'static-text',
					id: 'hr2',
					width: 12,
					label: ' ',
					value: '<hr />',
				},
				//polling
				{
					type: 'checkbox',
					id: 'polling',
					label: 'Enable Polling',
					width: 3,
					default: false,
				},
				{
					type: 'number',
					id: 'pollInterval',
					label: 'Polling Interval (ms)',
					width: 3,
					default: 10000,
					min: 100,
					max: 60000,
					required: true,
					isVisible: (config) => config.polling == true,
				},
				{
					type: 'static-text',
					id: 'pollinginfo',
					width: 6,
					label: ' ',
					value: 'By enabling polling, the module can retrieve the latest data from the router. Currently, it retrieves only the Source and Destination names.',
				},
				{
					type: 'static-text',
					id: 'hr3',
					width: 12,
					label: ' ',
					value: '<hr />',
				},
				{
					type: 'checkbox',
					id: 'verbose',
					label: 'Enable Verbose Logging',
					default: false,
					width: 3,
				},
				{
					type: 'static-text',
					id: 'info3',
					width: 9,
					label: ' ',
					value: `Enabling Verbose Logging will push all incoming and outgoing data to the log, which is helpful for debugging.`,
				},
			]
	}

	updateActions() {
		UpdateActions(this)
	}

	updateFeedbacks() {
		UpdateFeedbacks(this)
	}

	updateVariableDefinitions() {
		UpdateVariableDefinitions(this)
	}
}

runEntrypoint(ModuleInstance, UpgradeScripts)
