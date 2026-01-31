export function requestLogger(req, _res, next) {
  // lightweight structured log
  const { method, originalUrl } = req;
  const started = Date.now();
  req.on('end', () => {
    const ms = Date.now() - started;
    // eslint-disable-next-line no-console
    console.log(JSON.stringify({ level: 'info', msg: 'request', method, url: originalUrl, ms }));
  });
  next();
}

export function notFoundHandler(req, res, _next) {
  return res.status(404).json({
    success: false,
    error: 'Not Found',
    path: req.originalUrl,
  });
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, _req, res, _next) {
  // eslint-disable-next-line no-console
  console.error('Unhandled error:', err);
  const status = err.status || 500;
  return res.status(status).json({
    success: false,
    error: err.message || 'Internal server error',
  });
}
