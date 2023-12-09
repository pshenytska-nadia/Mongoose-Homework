import { Router } from 'express';
import {
  createArticle,
  updateArticleById,
  deleteArticleById,
  getArticles,
  getArticleById,
} from '../controllers/article.controller.js';
import { checkAuth } from '../middleware/auth.mdware.js';

const articleRouter = Router();

articleRouter
  .get('/', getArticles)
  .get('/:id', getArticleById)
  .post('/', createArticle)
  .put('/:id',checkAuth, updateArticleById)
  .delete('/:id', deleteArticleById);

export default articleRouter;
