const router = require('express').Router();
const apiRoutes = require('./api')

router.use('/api', apiRoutes);

router.use((req, res) => res.send(`Uh Oh You Got The Wrong Route`));

module.exports = router;