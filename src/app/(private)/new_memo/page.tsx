"use client";

import NewMemoHeader from "@/components/header/NewMemoHeader";
import NewMemoSection from "@/components/section/NewMemoSection";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

const newMemoSchema = z.object({
  theme: z.string().min(1, "学習テーマは必須です"),
  description: z.string().min(1, "概要、説明は必須です"),
  category: z.string().optional(),
  items: z.array(
    z.object({
      title: z.string().min(1, "学習項目は必須です"),
      detail: z.string().min(1, "詳細は必須です"),
      isCompleted: z.boolean().default(false),
      understandingLevel: z.number().min(0).max(100).default(0),
    })
  ),
  tags: z.array(z.string()).default([]),
});

type NewMemoFormData = z.infer<typeof newMemoSchema>;

const NewMemoPage = () => {
  const [currentTag, setCurrentTag] = useState("");

  const { control, register, setValue, getValues, watch } =
    useForm<NewMemoFormData>({
      resolver: zodResolver(newMemoSchema),
      defaultValues: {
        theme: "",
        description: "",
        category: "",
        items: [
          { title: "", detail: "", isCompleted: false, understandingLevel: 0 },
        ],
        tags: [],
      },
    });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const addTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && currentTag.trim()) {
      e.preventDefault();
      const currentTags = getValues("tags");
      if (!currentTags.includes(currentTag.trim())) {
        setValue("tags", [...currentTags, currentTag.trim()]);
        setCurrentTag("");
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    const currentTags = getValues("tags");
    setValue(
      "tags",
      currentTags.filter((tag) => tag !== tagToRemove)
    );
  };

  const watchedTags = watch("tags");

  return (
    <div className="pb-20">
      <NewMemoHeader />

      <form className="px-5 py-6 space-y-8">
        <NewMemoSection title={"学習テーマ"}>
          <Input
            required
            placeholder="学習テーマを入力..."
            className="p-5"
            {...register("theme")}
          />
        </NewMemoSection>
        <NewMemoSection title={"概要・説明"}>
          <Textarea
            required
            placeholder="このテーマで学ぶ内容や目標を記録してください"
            className="p-5 max-h-60 min-h-60 resize-none"
            {...register("description")}
          />
        </NewMemoSection>
        <NewMemoSection title={"カテゴリ"}>
          <div className="flex items-center space-x-2">
            <Select>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="カテゴリを選択" />
              </SelectTrigger>
            </Select>
            <Input
              placeholder="新規カテゴリを入力"
              className="w-[45%]"
              {...register("category")}
            />
          </div>
        </NewMemoSection>

        {fields.map((field, index) => (
          <Card key={field.id} className="bg-red-50 p-4">
            <NewMemoSection title={"学習項目"}>
              <span className="text-sm text-gray-500">
                この学習テーマに含まれる内容を追加してください。
                <br />
                各項目は理解したらチェックを入れて進捗を管理できます
              </span>

              <Card className="p-4">
                <div className="flex flex-col space-y-3">
                  <div className="flex items-center space-x-2">
                    <Controller
                      name={`items.${index}.isCompleted`}
                      control={control}
                      render={({ field: checkBoxField }) => (
                        <Checkbox
                          checked={checkBoxField.value}
                          onCheckedChange={checkBoxField.onChange}
                        />
                      )}
                    />
                    <Input
                      placeholder="学習項目を入力"
                      {...register(`items.${index}.title`)}
                    />
                  </div>
                  <Textarea
                    placeholder="詳細な内容、メモを入力..."
                    className="resize-none h-40"
                    {...register(`items.${index}.detail`)}
                  />
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500 whitespace-nowrap">
                      理解度:
                    </span>
                    <Controller
                      name={`items.${index}.understandingLevel`}
                      control={control}
                      render={({ field: sliderField }) => (
                        <>
                          <Slider
                            defaultValue={[0]}
                            max={100}
                            step={5}
                            value={[sliderField.value]}
                            onValueChange={(value) =>
                              sliderField.onChange(value[0])
                            }
                          />
                          <span className="text-sm text-gray-500">
                            {sliderField.value}%
                          </span>
                        </>
                      )}
                    />
                  </div>
                </div>
              </Card>

              <Button
                variant={"outline"}
                className="border-dashed cursor-pointer hover:bg-green-200"
              >
                新しい学習項目を追加
              </Button>
            </NewMemoSection>
          </Card>
        ))}

        <NewMemoSection title={"タグ"}>
          <Input
            placeholder="タグを入力してEnter"
            className="rounded-full"
            onKeyDown={addTag}
            value={currentTag}
            onChange={(e) => setCurrentTag(e.target.value)}
          />
          <span className="text-sm text-gray-500">
            検索しやすくするためのキーワードを追加してください
          </span>

          {watchedTags.length > 0 && (
            <div className="flex items-center space-x-2 overflow-x-auto">
              {watchedTags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-800 px-2 rounded-full text-sm flex items-center"
                >
                  {tag}
                  <Button
                    type="button"
                    className="p-1"
                    variant={"ghost"}
                    onClick={() => removeTag(tag)}
                  >
                    ×
                  </Button>
                </span>
              ))}
            </div>
          )}
        </NewMemoSection>

        <footer className="fixed bottom-0 left-0 right-0 border-t-1 bg-gray-50 p-4">
          <div className="flex items-center justify-between">
            <Button variant={"outline"} className="w-[40%]">
              キャンセル
            </Button>
            <Button
              variant={"secondary"}
              className="bg-indigo-500 text-white w-[55%]"
            >
              メモを作成
            </Button>
          </div>
        </footer>
      </form>
    </div>
  );
};

export default NewMemoPage;
