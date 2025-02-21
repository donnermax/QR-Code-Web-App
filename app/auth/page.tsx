"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleAuth = async (type: "login" | "signup") => {
    setLoading(true);
    let response: any = null;

    if (type === "signup") {
      response = await supabase.auth
        .signUp({ email, password })
        .catch((err) => {
          toast({
            title: "Error",
            description: err.message,
            variant: "destructive",
          });
          return null;
        });
    } else {
      response = await supabase.auth
        .signInWithPassword({ email, password })
        .catch((err) => {
          // Instead of throwing the error, show a toast and return null.
          toast({
            title: "Error",
            description: "Sorry, please check your credentials and try again.",
            variant: "destructive",
          });
          return null;
        });
    }

    if (!response) {
      // The error was handled by .catch above; simply exit.
      setLoading(false);
      return;
    }

    // If Supabase returns an error object in the response, handle it here.
    if (response.error) {
      console.log("Auth error detected:", response.error);
      toast({
        title: "Error",
        description: "Sorry, please check your credentials and try again.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    // If all goes well, display a success message.
    toast({
      title: type === "signup" ? "Account created!" : "Welcome back!",
      description:
        type === "signup"
          ? "Please check your email to verify your account."
          : "Successfully logged in.",
    });

    if (type === "login") {
      router.push("/dashboard");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md p-6">
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value="login" className="space-y-4">
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                className="w-full"
                onClick={() => handleAuth("login")}
                disabled={loading}
              >
                {loading ? "Loading..." : "Login"}
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="signup" className="space-y-4">
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                className="w-full"
                onClick={() => handleAuth("signup")}
                disabled={loading}
              >
                {loading ? "Loading..." : "Sign Up"}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
