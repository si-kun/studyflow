import { ReactNode } from "react";
import NewMemoSecTitle from "../title/NewMemoSecTitle";

interface NewMemoSectionProps {
  children: ReactNode;
  title: string;
}

const NewMemoSection = ({ children, title }: NewMemoSectionProps) => {
  return (
    <section className="flex flex-col space-y-2">
      <NewMemoSecTitle title={title} /> {children}
    </section>
  );
};

export default NewMemoSection;
