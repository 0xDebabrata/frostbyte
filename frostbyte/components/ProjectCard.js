import Link from "next/link"
import { Space_Grotesk } from "@next/font/google"

const space = Space_Grotesk({ subsets: ["latin"] })

export default function Card({ id, name }) {
  return (
    <Link href={`/project/${id}`}>
      <div className="text-xl m-2 bg-zinc-700 border border-zinc-600 rounded p-4 pr-10 duration-150 hover:bg-zinc-600">
        <h2 className={`${space.className} text-zinc-200 text-base`}>{ name }</h2>
      </div>
    </Link>
  );
}
