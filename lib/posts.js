//libディレクトリ内には、他のファイルで使用する関数を定義しておいておく。
import fs from "fs";
import path from "path";
import matter from "gray-matter";
//マークダウンレンダリング関連
import remark from "remark";
import html from "remark-html";
import fetch from "node-fetch";
const base64 = require("js-base64").Base64;

const postsDirectory = path.join(process.cwd(), "posts");

export function getSortedPostsData() {
  // Get file names under /posts
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.map((fileName) => {
    // Remove ".md" from file name to get id
    const id = fileName.replace(/\.md$/, "");

    // Read markdown file as string
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);

    // Combine the data with the id
    return {
      id,
      ...matterResult.data,
    };
  });
  // Sort posts by date
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export async function getAllPostIds() {
  // const fileNames = fs.readdirSync(postsDirectory);

  const repoUrl =
    "https://api.github.com/repos/aa-0921/nextjs-blog/contents/posts";
  const response = await fetch(repoUrl);
  const files = await response.json();
  const fileNames = files.map((file) => file.name);
  // Returns an array that looks like this:
  // [
  //   {
  //     params: {
  //       id: 'ssg-ssr'
  //     }
  //   },
  //   {
  //     params: {
  //       id: 'pre-rendering'
  //     }
  //   }
  // ]
  return fileNames.map((fileName) => {
    return {
      // それぞれのデータには必ずparamsをつける
      params: {
        id: fileName.replace(/\.md$/, ""),
      },
    };
  });
}

export async function getPostData(id) {
  //fullPathはpostsディレクトリまでのパスと、idにもとづいたファイル名のパス
  // const fullPath = path.join(postsDirectory, `${id}.md`);
  // utf8という形式のエンコードでファイルの中身を読み取る
  // const fileContents = fs.readFileSync(fullPath, "utf8");

  const repoUrl = `https://api.github.com/repos/aa-0921/nextjs-blog/contents/posts/${id}.md`;

  const response = await fetch(repoUrl);
  const file = await response.json();
  const fileContents = base64.decode(file.content);

  // Use gray-matter to parse the post metadata section（titleやdateを解析）
  const matterResult = matter(fileContents);

  // Use remark to convert markdown into HTML string
  // remarkメソッドが非同期処理になるので、async functionになる
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  // Combine the data with the id
  return {
    id,
    contentHtml,
    // スプレッド構文でオブジェクとを展開
    ...matterResult.data,
  };
}
