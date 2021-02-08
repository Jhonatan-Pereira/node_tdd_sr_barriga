module.exports = function ValidatorError(message) {
  this.name = 'ValidatorError'
  this.message = message
}