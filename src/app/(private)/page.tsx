import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CircleCheckBig, Search } from "lucide-react";
import Link from "next/link";

const DAMMY_DATA = [
  {
    title: "総メモ数",
    amount: 24,
  },
  {
    title: "復習予定",
    amount: 3,
  },
  {
    title: "理解度平均",
    amount: 85,
  },
];

const FOOTER_LINKS = [
  {
    title: "ホーム",
    href: "/",
  },
  {
    title: "メモ",
    href: "/memo",
  },
  {
    title: "タスク",
    href: "/task",
  },
  {
    title: "設定",
    href: "/setting",
  },
];

const DAMMY_CONTENT =
  "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Adipisci sit suscipit dignissimos ab eum laudantium dolor omnis placeat, saepe veritatis quis ipsum ipsa repellat! Veritatis nam pariatur molestias accusamus laboriosam!";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー部分 */}
      <Card className="rounded-t-none bg-indigo-400 p-5 shadow-none rounded-b-3xl">
        <div className="space-y-4">
          <h1 className="text-2xl text-white font-bold">Study Flow</h1>

          {/* 検索バー */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
            <Input
              placeholder="メモやタスクを検索..."
              className="rounded-full text-gray-700  placeholder-gray-500 border-none bg-white/90 pl-8 focus:bg-white"
            />
          </div>

          {/* 統計カード */}
          <div className="grid grid-cols-3 gap-4">
            {DAMMY_DATA.map((data) => (
              <Card
                key={data.title}
                className="bg-white/20 backdrop-blur-sm py-3 px-2 border-0"
              >
                <div className="flex flex-col items-center ">
                  <span className="text-white font-bold">{data.amount}</span>
                  <span className="text-white text-xs">{data.title}</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Card>

      {/* メインコンテンツ */}
      <main className="p-5 flex flex-col space-y-8 pb-24">
        {/* 復習セクション */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-lg">復習が必要</h2>
            <Link href={""} className="text-sm">
              すべて見る
            </Link>
          </div>
          <div className="w-full overflow-x-auto ">
            <div className="flex space-x-4 pb-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <Card key={index} className="p-4 bg-pink-300/50 min-w-[300px]">
                  <div className="flex flex-col gap-3">
                    <h2 className="font-bold">カードタイトル</h2>
                    <p className="text-sm">{DAMMY_CONTENT.slice(0, 70)}</p>
                    <div className="flex items-center gap-2">
                      <Progress value={40} />
                      <span className="text-sm">40%</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <p className="font-bold">最近のメモ</p>
            <Link href={""} className="text-sm">
              すべて見る
            </Link>
          </div>
          <div className="flex flex-col gap-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <Card key={index}>
                <div className="flex flex-col gap-3">
                  <CardHeader className="flex items-center justify-between">
                    <h2 className="font-bold">カードタイトル</h2>
                    <span className="text-xs bg-indigo-100 px-1.5 py-1 rounded-md text-indigo-500">
                      カテゴリ
                    </span>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{DAMMY_CONTENT.slice(0, 70)}</p>
                  </CardContent>
                  <CardFooter>
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-gray-200/80 px-1.5 py-0.5 text-gray-500 rounded-sm">
                          タグ
                        </span>
                        <span className="text-xs bg-gray-200/80 px-1.5 py-0.5 text-gray-500 rounded-sm">
                          タグ
                        </span>
                      </div>
                      <span className="text-gray-500 text-xs">日付</span>
                    </div>
                  </CardFooter>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <p className="font-bold">今日のタスク</p>
            <Link href={""} className="text-sm">
              すべて見る
            </Link>
          </div>
          <div className="flex flex-col gap-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <Card key={index}>
                <CardContent>
                  <div className="flex items-center">
                    <Button
                      variant={"ghost"}
                      size="icon"
                      className="bg-none block"
                    >
                      <CircleCheckBig />
                    </Button>
                    <div>
                      <p className="font-bold">タスクタイトル</p>
                      <span className="text-xs bg-red-100 px-2 py-1 font-semibold text-red-600 rounded-md">
                        高
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3">
        <nav className="flex items-center justify-between max-w-md mx-auto">
          {FOOTER_LINKS.map((link) => (
            <Link key={link.title} href={link.href} className="text-sm">
              {link.title}
            </Link>
          ))}
        </nav>
      </footer>
    </div>
  );
}
