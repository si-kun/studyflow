import { FieldValues, Path, UseFormRegister } from "react-hook-form";
import { Input } from "../ui/input";

interface AuthInputProps<T extends FieldValues> {
  text: string;
  id: string;
  placeholder: string;
  type: "text" | "email" | "password";
  register: UseFormRegister<T>,
  fieldName: Path<T>
  error: string
}

const AuthInput = <T extends FieldValues>({
  text,
  id,
  placeholder,
  type,
  register,
  fieldName,
  error
}: AuthInputProps<T>) => {
  return (
    <div className="flex flex-col relative">
      <label htmlFor={id}>{text}</label>
      <Input id={id} type={type} placeholder={placeholder} {...register(fieldName)} />
      <span className="absolute top-1 right-0 text-xs text-red-500">{error}</span>
    </div>
  );
};

export default AuthInput;
