const { InstanceStatus, TCPHelper } = require('@companion-module/base')

module.exports = {


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
