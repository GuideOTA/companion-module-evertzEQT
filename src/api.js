const { InstanceStatus, TCPHelper } = require('@companion-module/base')

module.exports = {

	async processData(data) {
		let self = this

		// responses may be fragmented in multiple packets
		// wait until we have a complete response contained between . and \r

		self.response += data.toString('utf-8')

		if (self.config.verbose) {
			self.log('debug', 'Received data: ' + self.response)
		}

		if (self.response.slice(0, 1) == '.' && self.response.slice(-1) == '\r') {
			// we now have all the pieces
			if (self.config.verbose) {
				self.log('debug', 'Received complete response: ' + self.response)
			}

			let TEMP_DESTINATIONS = []
			let TEMP_SOURCES = []

			let lines = self.response.split('\r')
			for (let i = 0; i < lines.length; i++) {
				let line = lines[i]
				if (line) {
					if (line.slice(0, 4) == '.RAD') {
						// destination name
						let id = line.split(',')[0].slice(4)
						let label = line.split(',')[1]
						TEMP_DESTINATIONS.push({ id: id, label: '[' + id + '] ' + label })
					} else if (line.slice(0, 4) == '.RAS') {
						// source name
						let id = line.split(',')[0].slice(4)
						let label = line.split(',')[1]
						TEMP_SOURCES.push({ id: id, label: '[' + id + '] ' + label })
					} else if (line == '.E') {
						self.log('error', 'Received error from Evertz.  Are maximums too high?')
					}
				}
			}

			self.response = '' // clear response buffer

			let update = false

			// update destinations and sources, if they are different
			if (JSON.stringify(TEMP_DESTINATIONS) !== JSON.stringify(self.CHOICES_DESTINATIONS)) {
				//and temp is not empty
				if (TEMP_DESTINATIONS.length > 0) {
					self.CHOICES_DESTINATIONS = TEMP_DESTINATIONS
					update = true
				}
			}

			if (JSON.stringify(TEMP_SOURCES) !== JSON.stringify(self.CHOICES_SOURCES)) {
				//and temp is not empty
				if (TEMP_SOURCES.length > 0) {
					self.CHOICES_SOURCES = TEMP_SOURCES
					update = true
				}
			}

			if (update) {
				self.initActions()
			}
		}
	},

	async sendCommand(instance, cmd) {
		// Ensure cmd is a string
		cmd = String(cmd)
	
		// Add a carriage return if it doesn't already end with one
		if (cmd.slice(-1) !== '\r') {
			cmd += '\r'
		}
	
		// Check if the socket is connected and valid
		if (instance.socket && !instance.socket.destroyed) {
			try {
				// Send the command using the write method
				instance.socket.write(cmd, 'latin1', (err) => {
					if (err) {
						instance.log('error', `Failed to send command: ${err.message}`)
					} else {
						instance.log('debug', `Command sent: ${cmd}`)
					}
				})
	
				// Store the last command for debugging purposes
				instance.lastCommand = cmd
			} catch (error) {
				instance.log('error', `Error while sending command: ${error.message}`)
			}
		} else {
			instance.log('error', 'Socket is not connected or has been destroyed. Cannot send command.')
		}
	}
}
