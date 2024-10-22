import { supabase } from "../../src/utils/supabase";
import type { NextApiRequest, NextApiResponse } from "next";

// API Routeとしてエクスポートされる関数
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { value } = req.body;

    // supabaseを使用してデータを挿入
    try {
      const { data, error } = await supabase
        .from("motivation_bodymake")
        .insert([{ value }]);

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
  }
}
