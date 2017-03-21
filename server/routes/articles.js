const router = require('koa-router')()
const article = require('../controllers/article')

router.post('/create', article.createArticle)
	.post('/edit', article.editArticle)
	.post('/removeAll', article.removeAll)
	.get('/getAll', article.getAllArticle)
	.get('/:id', article.getArticle)

module.exports = router;
