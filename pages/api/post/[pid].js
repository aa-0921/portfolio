// RESTfulパターンで設定することができる。

// この書き方が良いかな
// /api/posts/index.js
// /api/posts/[postId].js

export default (req, res) => {
  const {
    query: { pid },
  } = req;

  res.end(`Post: ${pid}`);
};
