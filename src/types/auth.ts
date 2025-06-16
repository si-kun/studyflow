export interface SignupFormData {
  text: string;
  type: "text" | "email" | "password"
  id: string;
  placeholder: string;
  fieldName: "email" | "password" | "username" | "confirmPassword";
}
export interface SigninFormData {
  text: string;
  type: "email" | "password"
  id: string;
  placeholder: string;
  fieldName: "email" | "password"
}

// export interface User {
//   id: string;
//   email: string;
//   username: string;
//   createdAt: string;
//   updatedAt: string;
// }