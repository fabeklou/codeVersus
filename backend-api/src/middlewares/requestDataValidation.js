const requestDataValidation = (validationSchema) => async (req, res, next) => {
  try {
    const requestData = {
      body: req.body,
      query: req.query,
      params: req.params
    }
    await validationSchema.validate(requestData, { abortEarly: true });
    next()
  } catch (error) {
    return res.status(400).json({ error });
  }
};

export default requestDataValidation;
