"use client";

import NewMemoHeader from "@/components/header/NewMemoHeader";
import NewMemoSection from "@/components/section/NewMemoSection";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { createKnowledge } from "@/actions/knowledge/createKnowledge";
import { useAtomValue } from "jotai";
import { userAtom } from "@/atom/user";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const newKnowledgeSchema = z
  .object({
    title: z.string().min(1, "学習テーマは必須です"),
    description: z.string().min(1, "概要、説明は必須です"),
    category: z.string().optional(),
    studyItems: z
      .array(
        z.object({
          title: z.string().min(1, "学習項目は必須です"),
          content: z.string().min(1, "詳細は必須です"),
          isCompleted: z.boolean(),
          understandingLevel: z.number().min(0).max(100),
        })
      )
      .min(1, "最低1つの学習項目が必要です"),
    tags: z.array(z.string()),
  })
  .strict();

type NewMemoFormData = z.infer<typeof newKnowledgeSchema>;

const NewKnowledgePage = () => {
  const [currentTag, setCurrentTag] = useState("");
  const user = useAtomValue(userAtom);

  const [categoryValue, setCategoryValue] = useState("");
  const [selectedCategory, setSelectedCategory] = useState([
    {
      id: 1,
      name: "未分類",
    },
    { id: 2, name: "プログラミング" },
    { id: 3, name: "デザイン" },
    { id: 4, name: "ビジネス" },
  ]);

  const router = useRouter();

  const { control, register, setValue, getValues, watch, handleSubmit, reset } =
    useForm<NewMemoFormData>({
      resolver: zodResolver(newKnowledgeSchema),
      defaultValues: {
        title: "",
        description: "",
        category: "",
        studyItems: [
          { title: "", content: "", isCompleted: false, understandingLevel: 0 },
        ],
        tags: [],
      },
    });

  const { fields, append } = useFieldArray({
    control,
    name: "studyItems",
  });

  const watchedItems = watch("studyItems");
  const watchedTags = watch("tags");

  useEffect(() => {
    watchedItems?.forEach((item, index) => {
      if (item.understandingLevel === 100 && !item.isCompleted) {
        setValue(`studyItems.${index}.isCompleted`, true);
      }
    });
  }, [watchedItems, setValue]);

  const addNewItem = () => {
    append({
      title: "",
      content: "",
      isCompleted: false,
      understandingLevel: 0,
    });
  };

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

  const areAllTitlesFilled = () => {
    const items = getValues("studyItems");
    return (
      items && items.every((item) => item.title && item.title.trim() !== "")
    );
  };

  const submitData = async (data: NewMemoFormData) => {
    if (!user) {
      console.error("user is not defined");
      return;
    }
    const userId = user.id;

    const knowledgeData = {
      title: data.title.trim(),
      description: data.description.trim(),
    };

    const finalCategory =
      categoryValue.trim() ||
      data.category?.trim() ||
      selectedCategory[0].name.trim();

    const categoryName = finalCategory || "未分類";

    const studyItesms = data.studyItems.map((item) => ({
      title: item.title.trim(),
      content: item.content.trim(),
      isCompleted: item.isCompleted,
      understandingLevel: item.understandingLevel,
    }));

    // ここでデータを送信する処理を実装
    try {
      const result = await createKnowledge(
        userId,
        knowledgeData,
        categoryName,
        studyItesms,
        data.tags
      );

      if (result.success) {
        toast.success(result.message);
        reset();
        setCategoryValue("");
        router.replace("/");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("学習メモの作成に失敗しました");
      console.error("Error creating knowledge:", error);
    }
  };

  return (
    <div className="pb-20">
      <NewMemoHeader />

      <form onSubmit={handleSubmit(submitData)} className="px-5 py-6 space-y-8">
        <NewMemoSection title={"学習テーマ"}>
          <Input
            required
            placeholder="学習テーマを入力..."
            className="p-5"
            {...register("title")}
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
            <Controller
              control={control}
              name="category"
              render={({ field }) => (
                <Select
                  disabled={categoryValue.trim() !== ""}
                  value={field.value || ""}
                  onValueChange={(value) => {
                    field.onChange(value); // RHF を更新
                    setCategoryValue(""); // 新規入力をクリア
                  }}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="カテゴリを選択" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedCategory.map((item) => (
                      <SelectItem key={item.id} value={item.name}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <Input
              placeholder="新規カテゴリを入力"
              className="w-[45%]"
              value={categoryValue}
              onChange={(e) => {
                setCategoryValue(e.target.value);
                if (e.target.value.trim() !== "") {
                  setValue("category", "");
                }
              }}
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

              <Card key={index} className="p-4">
                <div className="flex flex-col space-y-3">
                  <div className="flex items-center space-x-2">
                    <Controller
                      name={`studyItems.${index}.isCompleted`}
                      control={control}
                      render={({ field: checkBoxField }) => {
                        const understandingLevel = watch(
                          `studyItems.${index}.understandingLevel`
                        );
                        const shouldBeChecked =
                          understandingLevel === 100 || checkBoxField.value;

                        return (
                          <Checkbox
                            checked={shouldBeChecked}
                            onCheckedChange={(checked) => {
                              checkBoxField.onChange(checked);
                              if (checked) {
                                setValue(
                                  `studyItems.${index}.understandingLevel`,
                                  100
                                );
                              }
                            }}
                          />
                        );
                      }}
                    />
                    <Input
                      placeholder="学習項目を入力"
                      {...register(`studyItems.${index}.title`)}
                    />
                  </div>
                  <Textarea
                    placeholder="詳細な内容、メモを入力..."
                    className="resize-none h-40"
                    {...register(`studyItems.${index}.content`)}
                  />
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500 whitespace-nowrap">
                      理解度:
                    </span>
                    <Controller
                      name={`studyItems.${index}.understandingLevel`}
                      control={control}
                      render={({ field: sliderField }) => {
                        const isCompleted = watch(
                          `studyItems.${index}.isCompleted`
                        );
                        return (
                          <>
                            <Slider
                              defaultValue={[0]}
                              max={100}
                              step={5}
                              value={isCompleted ? [100] : [sliderField.value]}
                              onValueChange={(value) => {
                                sliderField.onChange(value[0]);

                                if (value[0] < 100 && isCompleted) {
                                  setValue(
                                    `studyItems.${index}.isCompleted`,
                                    false
                                  );
                                }
                              }}
                            />
                            <span className="text-sm text-gray-500">
                              {isCompleted ? 100 : sliderField.value}%
                            </span>
                          </>
                        );
                      }}
                    />
                  </div>
                </div>
              </Card>

              <Button
                variant={"outline"}
                disabled={!areAllTitlesFilled()}
                type="button"
                onClick={() => addNewItem()}
                className="border-dashed cursor-pointer hover:bg-green-200 disabled:cursor-not-allowed disabled:hover:bg-transparent"
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

export default NewKnowledgePage;
