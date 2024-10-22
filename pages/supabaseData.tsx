//データ挿入処理
const addMotivation = async (value: string) => {
  // fetch関数を使用して手順2で作成したAPIエンドポイントにリクエストを送信
  const res = await fetch("/api/supabaseFunctions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ value }),
  });

  const data = await res.json();
  return data;
};

export default addMotivation;
