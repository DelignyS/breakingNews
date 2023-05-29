import fs from 'node:fs/promises';
import express from "express";
const data = await fs.readFile('articles.json', 'utf8'); // returns Promise <pending>
const articles = JSON.parse(data);
const app = express();
app.use(express.json());
// Read all articles
app.get('/articles', (req, res, next) => {
    res.status(200).json(articles);
});
// Create article
app.post('/articles', async (req, res, next) => {
    const body = req.body;
    const article = {
        id: articles.length + 1,
        title: body.title,
        url: body.url,
    };
    articles.push(article);
    await fs.writeFile('articles.json', JSON.stringify(articles, null, '\t'), 'utf-8');
    res.status(201).json(article);
});
// Update article - articleId
app.put('/articles/:articleId', async (req, res, next) => {
    const params = req.params;
    const body = req.body;
    const articleId = params.articleId; // const { articleId } = params;
    const id = Number.parseInt(articleId, 10);
    const article = articles.find((a) => a.id === id); // article avec id === 1;
    if (!article) {
        res.status(404).json({ message: 'Article not found' });
    }
    else {
        Object.assign(article, body);
        await fs.writeFile('articles.json', JSON.stringify(articles, null, '\t'), 'utf-8');
        res.status(200).json(article);
    }
});
// Delete article - articleId
app.delete('/articles/:articleId', async (req, res, next) => {
    const params = req.params;
    const articleId = params.articleId; // const { articleId } = params;
    const id = Number.parseInt(articleId, 10);
    const articleIndex = articles.findIndex((a) => a.id === id); // article avec id === 1;
    if (articleIndex < 0) {
        res.status(404).json({ message: 'Article not found' });
    }
    else {
        articles.splice(articleIndex, 1);
        await fs.writeFile('articles.json', JSON.stringify(articles, null, '\t'), 'utf-8');
        res.status(204).json({ message: 'Article deleted' });
    }
});
app.listen(3000, () => {
    console.log('Server is listening on port 3000');
});
