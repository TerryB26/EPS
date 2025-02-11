export const appendMetaData = (isRequired) => (req, res, next) => {
    if (isRequired) {
      req.session.metaData = {
        lastUpdatedBy: req.user.id,
        lastUpdatedDate: new Date().toISOString(),
      };
    }
    next();
  };
  
  export const handleDefaultSuccess = (res, statusCode) => {
    res.status(statusCode).json({ success: true });
  };
  
  export const handleErrorResponse = (error, req, res) => {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  };