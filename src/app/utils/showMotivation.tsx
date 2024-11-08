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
      displayDate: d.display_date ? new Date(d.display_date) : null  // display_dateが存在する場合のみ変換
    })
  );

  console.log(formattedData);

  return formattedData;
}
