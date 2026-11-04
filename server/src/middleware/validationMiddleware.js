'use strict';

const { validationResult } = require('express-validator');
const { errorResponse } = require('../utils/apiResponse');

/**
 * validate - Run express-validator results and return 422 on failure
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((err) => ({
      field: err.path || err.param,
      message: err.msg,
      value: err.value,
    }));

    return errorResponse(res, 'Validation failed', 422, formattedErrors);
  }

  next();
};

module.exports = { validate };
