export default async function deleteMotivation(id: string) {
  const res = await fetch(`/api/supabaseFunctions`, {
    method: "DELETE",
    headers: {
        "Content-Type": "application/json",
      },
    body: JSON.stringify({ id }),

  });
  const data = await res.json();
  if (res.status !== 200) {
    throw new Error(data.error ? data.error : "Something went wrong.");
  }
  return data;
}
