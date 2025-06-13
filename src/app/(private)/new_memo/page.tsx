import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import React from "react";

const NewMemoPage = () => {
  return (
    <div className="pb-24">
      <header className="flex items-center justify-between bg-indigo-600 px-10 py-3">
        <h2 className="font-bold text-white text-lg">新しいメモ</h2>
        <Button variant={"outline"} className="rounded-full">
          下書き保存
        </Button>
      </header>

      <main className="px-5 py-6 space-y-8">
        <section className="flex flex-col space-y-2">
          <p className="font-bold">学習テーマ</p>
          <Input required placeholder="学習テーマを入力..." className="p-5" />
        </section>
        <section className="flex flex-col space-y-2">
          <p className="font-bold">概要・説明</p>
          <Textarea
            required
            placeholder="このテーマで学ぶ内容や目標を記録してください"
            className="p-5 max-h-60 min-h-60 resize-none"
          />
        </section>
        <section className="flex flex-col space-y-2">
          <p className="font-bold">カテゴリ</p>
          <div className="flex items-center space-x-2">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="カテゴリを選択してください" />
              </SelectTrigger>
            </Select>
            <Input placeholder="新規タグを入力" />
          </div>
        </section>

        <section>
          <Card className="bg-red-50 p-4">
            <p className="font-bold">学習項目</p>
            <span className="text-sm text-gray-500">
              この学習テーマに含まれる内容を追加してください。
              <br />
              各項目は理解したらチェックを入れて進捗を管理できます
            </span>

            <Card className="p-4">
              <div className="flex flex-col space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox />
                  <Input placeholder="学習項目を入力" />
                </div>
                <Textarea placeholder="詳細な内容、メモを入力..." className="resize-none h-40" />
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500 whitespace-nowrap">
                    理解度:
                  </span>
                  <Slider defaultValue={[0]} max={100} step={5} />
                  <span className="text-sm text-gray-500">0%</span>
                </div>
              </div>
            </Card>

            <Button
              variant={"outline"}
              className="border-dashed cursor-pointer hover:bg-green-200"
            >
              新しい学習項目を追加
            </Button>
          </Card>
        </section>

        <section>
          <div className="flex flex-col space-y-2">
            <p className="font-bold">タグ</p>
            <Input placeholder="タグを入力してEnter" className="rounded-full" />
            <span className="text-sm text-gray-500">
              検索しやすくするためのキーワードを追加してください
            </span>
          </div>
        </section>

        <footer className="fixed bottom-0 left-0 right-0 border-t-1 bg-gray-50 p-4">
          <div className="flex items-center justify-between">
            <Button variant={"outline"} className="w-[40%]">キャンセル</Button>
            <Button variant={"secondary"} className="bg-indigo-500 text-white w-[55%]">メモを作成</Button>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default NewMemoPage;
