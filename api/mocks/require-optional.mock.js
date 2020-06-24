module.exports = name => {
  throw new Error(`optional package does not exist ${name}`);
};

module.exports.exists = () => false;
