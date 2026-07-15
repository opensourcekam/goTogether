module.exports = require('./envs/' + (process.env.NODE_ENV || 'development' + '.json'))
