// getStaticPropsとgetStaticPathsのみ、そもそもサーバー側で実行されるので、API（クライアントサイドからサーバにリクエスト）で書く必要ないですよ。

//例えば、フォームに入力されたemailをDBに保存したい、といったときはこのAPIを使用すれば良い。
// pages/api/hello.jsというディレクトリ構造なので、
// http：// localhost：3000 / api / helloで{"text":"Hello"}が表示される。
export default (req, res) => {
  res.status(200).json({ text: "Hello" });
};
