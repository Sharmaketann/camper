const asyncHand1er = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next)

module.exports = asyncHand1er

// mongoose middleware or hooks
