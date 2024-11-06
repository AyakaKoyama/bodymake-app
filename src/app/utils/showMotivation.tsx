//データ取得＆表示処理

export default async function showMotivation() {
  const res = await fetch("/api/supabaseFunctions", {
    method: "GET",
  });
  const data = await res.json();

  // created_atとdisplay_dateをDateオブジェクトに変換
  const formattedData = data.data.map(
    (d: { created_at: string; display_date: string }) => ({
      ...d,
      createdAtDate: new Date(d.created_at),
      displayDate: new Date(d.display_date),
    })
  );
  console.log(formattedData);

  return formattedData;
}
