//データ挿入処理
export default async function AddMotivation(value: string) {
  // fetch関数を使用して手順2で作成したAPIエンドポイントにリクエストを送信
  const res = await fetch(`${process.env.API_URL}/api/supabaseFunctions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ value }),
  });
  console.log("API_URL:", process.env.API_URL);
  const data = await res.json();
  return data;
}
