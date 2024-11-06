//データ挿入処理
export default async function AddMotivation(
  value: string,
  displayDate: string
) {
  // fetch関数を使用して手順2で作成したAPIエンドポイントにリクエストを送信
  const res = await fetch("/api/supabaseFunctions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({ value, display_date: displayDate }),
  });
  console.log(res);
  const data = await res.json();

  if (res.status !== 200) {
    throw new Error(data.error ? data.error : "Something went wrong.");
  }
  return data;
}
