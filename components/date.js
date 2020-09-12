import { parseISO, format } from "date-fns";

// 日付を表示する為のコンポーネント。
export default function Date({ dateString }) {
  // ISO規格のデータをparseする
  const date = parseISO(dateString);
  return <time dateTime={dateString}>{format(date, "LLLL d, yyyy")}</time>;
}
