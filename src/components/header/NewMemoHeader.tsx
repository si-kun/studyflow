import React from "react";
import { Button } from "../ui/button";

const NewMemoHeader = () => {
  return (
    <header className="flex items-center justify-between bg-indigo-600 px-10 py-3">
      <h2 className="font-bold text-white text-lg">新しいメモ</h2>
      <Button variant={"outline"} className="rounded-full">
        下書き保存
      </Button>
    </header>
  );
};

export default NewMemoHeader;
