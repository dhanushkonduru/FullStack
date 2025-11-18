function requestLogger(req, res, next) {
  const start = Date.now();
  const { method, originalUrl } = req;
  res.on('finish', () => {
    const durationMs = Date.now() - start;
    const { statusCode } = res;
    console.log(`${method} ${originalUrl} ${statusCode} - ${durationMs}ms`);
  });
  next();
}

module.exports = requestLogger;


