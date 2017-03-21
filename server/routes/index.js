const router = require('koa-router')()
const article = require('../controllers/article')

router.get('/', article.getAllArticle)
  .get('/index', article.getAllArticle)

module.exports = router;
