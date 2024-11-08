import { supabase } from "../../src/utils/supabase";
import type { NextApiRequest, NextApiResponse } from "next";

// API Routeとしてエクスポートされる関数
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { value, display_date } = req.body;
    console.log(value, display_date);

    // supabaseを使用してデータを挿入
    try {
      const { data, error } = await supabase
        .from("motivation_bodymake")
        .insert([{ value, display_date }]);

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      // 挿入したデータを返す
      return res.status(200).json({ data: data ? data[0] : null });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      // エラーハンドリング
      return res.status(500).json({ error: "Something went wrong." });
    }
  } else if (req.method === "GET") {
    // supabaseを使用してデータを取得
    try {
      const { data, error } = await supabase
        .from("motivation_bodymake")
        .select("*");

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      // 取得したデータを返す
      return res.status(200).json({ data });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      // エラーハンドリング
      return res.status(500).json({ error: "Something went wrong." });
    }
  } else if (req.method === "DELETE") {
    const { id } = req.body;
    console.log(id);

    const { data, error } = await supabase
      .from("motivation_bodymake")
      .delete()
      .eq("id", id);

    if (error) {
      return res.status(500).json({ error: error.message });
    }
    
    return res.status(200).json({ data });
  } else {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
}
