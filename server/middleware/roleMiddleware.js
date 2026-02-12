const roleMiddleware = (allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: 'Доступ запрещён: недостаточно прав'
      });
    }
    next();
  };
};

module.exports = roleMiddleware;