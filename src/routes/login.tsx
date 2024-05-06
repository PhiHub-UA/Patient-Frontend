import { createFileRoute } from "@tanstack/react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axios from "@/api/axios";
import { useNavigate } from "@tanstack/react-router";

const registerSchema = z.object({
  username: z.string().min(2).max(50),
  password: z.string().min(8).max(50),
  phone: z.number(),
  email: z.string().email(),
  age: z.number().min(1).max(120),
  role: z.string().default("user"),
});

const loginSchema = z.object({
  username: z.string().min(2).max(50),
  password: z.string().min(8).max(50),
});

export const Route = createFileRoute("/login")({
  component: LoginRegister,
});

function LoginRegister() {
  const navigate = useNavigate({ from: "/login" });

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      phone: 0,
      email: "",
      age: 0,
      role: "user",
    },
  });

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = (data: z.infer<typeof registerSchema>) => {
    register.mutate(data);
  };

  const loginSubmit = (data: z.infer<typeof loginSchema>) => {
    login.mutate(data);
  };

  const login = useMutation({
    mutationKey: ["login"],
    mutationFn: async (data: z.infer<typeof loginSchema>) => {
      const res = await axios.post("/auth/login", data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return res;
    },
    onSuccess: (res) => {
      localStorage.setItem("token", res.data.token);
      setTimeout(() => {
        navigate({ to: "/" });
      }, 2000);
    },
    onError: (err) => {
      console.error(err);
    },
  });

  const register = useMutation({
    mutationKey: ["register"],
    mutationFn: async (data: z.infer<typeof registerSchema>) => {
      try {
        await axios.post("/auth/register", data, {
          headers: {
            "Content-Type": "application/json",
          },
        });
      } catch (err) {
        console.error(err);
      }
    },
  });

  return (
    <Tabs
      defaultValue="register"
      className="w-[50rem] justify-center items-center "
    >
      <TabsList className="flex justify-center items-center">
        <TabsTrigger value="register">Register</TabsTrigger>
        <TabsTrigger value="login">Login</TabsTrigger>
      </TabsList>
      <TabsContent
        value="register"
        className="flex justify-center items-center"
      >
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mb-2"
          >
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="username" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="password" type="password" {...field} />
                  </FormControl>
                  <FormDescription>
                    Must be at least 8 characters long.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="1234567890"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>Must be 9 digits long.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="mail@gmail.com" {...field} />
                  </FormControl>
                  <FormDescription>Must be a valid email.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Age</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>Must be a valid age.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <FormControl>
                    <Input disabled {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="pb-2">
              Register
            </Button>
            {register.isError && (
              <p className="text-warning text-xl">Invalid credentials</p>
            )}
            {register.isSuccess && (
              <p className="text-success text-xl">Successfully registered</p>
            )}
          </form>
        </Form>
      </TabsContent >
      <TabsContent value="login" className="flex justify-center items-center">
        <Form {...loginForm}>
          <form
            className="space-y-4 mb-2"
            onSubmit={loginForm.handleSubmit(loginSubmit)}
          >
            <FormField
              control={loginForm.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="username" {...field} />
                  </FormControl>
                  <FormDescription>Enter your username.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={loginForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="password" type="password" {...field} />
                  </FormControl>
                  <FormDescription>Enter your password.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="pb-2">
              Login
            </Button>
          </form>
        </Form>
        {login.isError && (
          <p className="text-warning text-xl">Invalid credentials</p>
        )}
        {login.isSuccess && (
          <p className="text-success text-xl">Succesfully logged in</p>
        )}
      </TabsContent>
    </Tabs>
  );
}
