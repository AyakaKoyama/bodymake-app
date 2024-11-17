import Link from "next/link";

export default function Home() {
  return (
    <>
      <h1 className="text-3xl font-bold underline">Bodymake-app</h1>
      <Link href="/register">登録画面へ</Link>
    </>
  );
}
