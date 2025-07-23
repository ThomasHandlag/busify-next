"use client";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Form, FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const LoginForm = () => {
  const formSchema = z.object({
    username: z.string().min(2).max(50),
    password: z.string().min(6).max(100),
    confirmPassword: z.string().min(6).max(100),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log("Form submitted:", data);
  };

  return (
    <div className="flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-center text-green-700 mb-2">Sign in to Busify</h2>
          <p className="text-center text-gray-500 mb-8">Welcome back! Please enter your details to continue.</p>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
            >
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username <span className="text-red-500">*</span></FormLabel>
                    <Input {...field} type="text" required className="bg-green-50" />
                  </FormItem>
                )}
              />

              <FormField
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password <span className="text-red-500">*</span></FormLabel>
                    <Input {...field} type="password" required className="bg-green-50" />
                  </FormItem>
                )}
              />

              <FormField
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password <span className="text-red-500">*</span></FormLabel>
                    <Input {...field} type="password" required className="bg-green-50" />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg mt-2">Login</Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
