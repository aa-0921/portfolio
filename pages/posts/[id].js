import Layout from "../../components/layout";
import { getAllPostIds, getPostData } from "../../lib/posts";
import Head from "next/head";
//日付コンポーネントのインポート
import Date from "../../components/date";
import utilStyles from "../../styles/utils.module.css";
export default function Post({ postData }) {
  // postDataはgetStaticPropsがリターンしている値
  return (
    <Layout>
      <Head>
        <title>{postData.title}</title>
      </Head>
      <article>
        <h1 className={utilStyles.headingXl}>{postData.title}</h1>
        <div className={utilStyles.lightText}>
          <Date dateString={postData.date} />
        </div>
        <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
      </article>
    </Layout>
  );
}
//①動的ルートでパス一覧（どんなページを表示する可能性があるのか）を取得
export async function getStaticPaths() {
  const paths = await getAllPostIds();
  return {
    paths,
    // こちらにfalseを設定することで、存在しないページに遷移しようとしたときには404ページを返す。（trueにすると自分でページを用意したりできる）
    fallback: false,
  };
}

//そのページのIDに基づいたデータを返す。propsにして、function Postに渡す
export async function getStaticProps({ params }) {
  // libディレクトリ内のgetPostDataメソッドでtitle,dataを取得
  // 呼び出している、getPostDataメソッドがasync/awaitなので、awaitをつける必要がある。
  const postData = await getPostData(params.id);
  return {
    // 必ずpropsを返す必要がある。
    props: {
      postData,
    },
  };
}
