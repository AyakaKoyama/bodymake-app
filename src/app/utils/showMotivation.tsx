//データ取得＆表示処理

export default async function showMotivation() {
  const res = await fetch("/api/supabaseFunctions", {
    method: "GET",
  });
  const data = await res.json();

  // created_atをDateオブジェクトに変換
  const formattedData = data.data.map((d: { created_at: string }) => ({
    ...d,
    createdAtDate: new Date(d.created_at),
  }));
  console.log(formattedData);

  return formattedData;
}
