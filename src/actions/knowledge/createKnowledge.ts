"use server";

import prisma from "@/utils/prisma/client";

interface CreateKnowLedgeInput {
  title: string;
  description: string;

  //下3つはサーバーサイドで自動計算するため除外
  // averageUnderstandingLevel
  // DateTime
  // isReviewRequired
}

interface CreateSutudyItemInput {
  title: string;
  content: string;
  isCompleted: boolean;
  understandingLevel: number;
}

interface CreateKnowledgeResult {
  success: boolean;
  message: string;
  data?: any;
}

export const createKnowledge = async (
  userId: string,
  KnowledgeData: CreateKnowLedgeInput, //knowledgeのデータ
  categoryName: string,
  studyItems: CreateSutudyItemInput[], //学習項目の配列
  tags: string[]
):Promise<CreateKnowledgeResult> => {
  const { title, description } = KnowledgeData;

  try {
    //knowledgeの重複チェック
    const existingKnowledge = await prisma.knowledge.findUnique({
      where: {
        title_userId: {
          title,
          userId,
        },
      },
    });

    if (existingKnowledge) {
      return {
        success: false,
        message: "このタイトルの学習メモは既に存在しています",
      };
    }

    //StudyItemの理解度から平均値を自動計算
    const averageUnderstandingLevel = studyItems.reduce(
      (sum, item) => sum + item.understandingLevel,
      0
    );

    //復習が必要かどうかを判定(70%未満の場合)
    const isReviewRequired = averageUnderstandingLevel < 70;

    //トランザクション開始
    const result = await prisma.$transaction(async (tx) => {
      //カテゴリーの取得または新規作成
      const category = await tx.category.upsert({
        where: {
          name_userId: {
            name: categoryName.trim(),
            userId,
          },
        },
        update: {},
        create: {
          name: categoryName.trim(),
          userId,
        },
      });

      //knowledgeの作成
      const knowledge = await tx.knowledge.create({
        data: {
          userId,
          title: title.trim(),
          description: description.trim(),
          averageUnderstandingLevel,
          lastReviewDate: null,
          isReviewRequired,
          categoryId: category.id,
        },
      });

      //studyItemsの一括作成
      const createdStudyItems = await tx.studyItem.createMany({
        data: studyItems.map((item) => ({
          title: item.title.trim(),
          content: item.content.trim(),
          isCompleted: item.isCompleted,
          understandingLevel: item.understandingLevel,
          knowledgeId: knowledge.id,
        })),
      });

      //タグの処理
      const knowledgeTags = [];

      if(tags && tags.length > 0) {
        for(const tagName of tags) {
          const trimmedTagName = tagName.trim();
          if(!trimmedTagName) continue;
          
          const tag = await tx.tag.upsert({
            where: {
              name_userId: {
                name: trimmedTagName,
                userId,
              }
            },
            update: {},
            create: {
              name: trimmedTagName,
              userId,
            }
          })

          const knowledgeTag = await tx.knowledgeTag.create({
            data: {
              knowledgeId: knowledge.id,
              tagId: tag.id,
            }
          })
          knowledgeTags.push(knowledgeTag);
        }
      }

      //トランザクションの結果を返す
      return {
        knowledge,
        studyItemsCount: createdStudyItems.count,
        category,
      };
    });

    //作成されたデータの取得
    const createdKnowledge = await prisma.knowledge.findUnique({
      where: {
        id: result.knowledge.id,
      },
      include: {
        studyItems: true,
        category: true,
        knowledgeTags: {
          include: {
            tag: true,
          }
        },
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    });

    //成功時のレスポンス
    return {
      success: true,
      message: `学習メモ「${title}」を作成しました`,
      data: createdKnowledge
    };
  } catch (error) {
    console.error("Error during knowledge creation:", error);
    return {
      success: false,
      message: "学習メモの作成に失敗しました",
    };
  }
};
