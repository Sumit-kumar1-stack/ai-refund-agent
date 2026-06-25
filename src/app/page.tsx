"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

import VoiceButton from "@/components/VoiceButton";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

type Message = {
  role: "assistant" | "user";
  text: string;
};

export default function Home() {
  const [input, setInput] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [decision, setDecision] =
    useState("Waiting");

  const [messages, setMessages] =
    useState<Message[]>([
      {
        role: "assistant",
        text:
          "Hello! I can help process your refund request. Enter your order number or use one of the test orders below.",
      },
    ]);

  /* Load chat history */

  useEffect(() => {
    async function loadHistory() {
      try {
        const res =
          await fetch(
            "/api/chat-history"
          );

        if (!res.ok)
          return;

        const data =
          await res.json();

        if (
          Array.isArray(data)
        ) {
          setMessages(
            data.map(
              (msg: any) => ({
                role:
                  msg.role ===
                  "USER"
                    ? "user"
                    : "assistant",

                text:
                  msg.content,
              })
            )
          );
        }
      } catch (error) {
        console.error(
          "History Error:",
          error
        );
      }
    }

    loadHistory();
  }, []);

  async function processRefund(
    orderNumber: string
  ) {
    if (
      !orderNumber ||
      loading
    )
      return;

    setMessages(
      (prev) => [
        ...prev,
        {
          role: "user",
          text:
            orderNumber,
        },
      ]
    );

    setLoading(true);

    try {
      const response =
        await fetch(
          "http://localhost:3000/api/refund/check",
          {
            method:
              "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                orderNumber,
              }),
          }
        );

      const data =
        await response.json();

      if (
        !response.ok
      ) {
        throw new Error(
          data.error ||
            "Request failed"
        );
      }

      const reply =
        data.explanation;

      setDecision(
        data.decision
      );

      setMessages(
        (prev) => [
          ...prev,
          {
            role:
              "assistant",

            text:
              reply,
          },
        ]
      );

      /* Speak */

      if (
        "speechSynthesis" in
        window
      ) {
        window.speechSynthesis.cancel();

        const speech =
          new SpeechSynthesisUtterance(
            reply
          );

        speech.rate = 1;

        window
          .speechSynthesis
          .speak(
            speech
          );
      }
    } catch (
      error: any
    ) {
      setMessages(
        (prev) => [
          ...prev,
          {
            role:
              "assistant",

            text:
              error.message,
          },
        ]
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleSend() {
    if (
      !input.trim()
    )
      return;

    const value =
      input.trim();

    setInput("");

    await processRefund(
      value
    );
  }

  return (
    <main
      className="
min-h-screen
bg-gradient-to-br
from-slate-950
via-indigo-950
to-black
text-white
p-6
"
    >
      <div className="mx-auto max-w-[1600px] py-8 grid gap-10 lg:grid-cols-[1.45fr_420px]">

        {/* CHAT */}

        <Card
  className="
  min-h-[850px]
  rounded-3xl
  border
  border-white/10
  bg-white/5
  backdrop-blur-2xl
  shadow-[0_0_40px_rgba(59,130,246,.08)]
  p-6
  transition-all
  duration-300
  hover:-translate-y-1
  hover:scale-[1.02]
  "
>

          <div className="border-b border-white/10 p-6">

<h1
  className="
  text-6xl
  font-black
  bg-gradient-to-r
  from-cyan-400
  to-blue-500
  bg-clip-text
  text-transparent
  "
>
            
              AI Refund Assistant
            </h1>

            <p className="mt-3 text-slate-400">
              Smart refund processing powered by AI
            </p>

          </div>

          <div className="h-[720px] overflow-y-auto p-6 space-y-6">

            {messages.map(
              (
                msg,
                index
              ) => (

                <motion.div
                  key={
                    index
                  }

                  initial={{
                    opacity: 0,
                    x: 20,
                  }}

                  animate={{
                    opacity: 1,
                    x: 0,
                  }}

                  transition={{
                    duration:
                      0.3,
                  }}

                  className={`flex ${
                    msg.role ===
                    "user"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >

                  <div
                    className={`max-w-[75%] rounded-3xl whitespace-pre-line px-5 py-4 shadow-xl ${
                      msg.role ===
                      "user"
? "bg-gradient-to-r from-blue-600 to-cyan-500"
: "bg-slate-900/60 border border-white/10 backdrop-blur-xl"
                    }`}
                  >

                    <div className="mb-2 text-xs opacity-70">

                      {msg.role ===
                      "user"
                        ? "Customer"
                        : "Assistant"}

                    </div>

                    {msg.text}

                  </div>

                </motion.div>
              )
            )}

          </div>

          <div className="border-t border-white/10 p-5">

            <div className="mb-4 flex flex-wrap gap-2">

              {[
                "ORD-1001",
                "ORD-1002",
                "ORD-1003",
                "ORD-1004",
              ].map(
                (
                  order
                ) => (
                  <Button
                    key={
                      order
                    }
                    className="
rounded-full
border-white/10
bg-white/5
hover:bg-white/10
"
                    size="sm"
                    onClick={() =>
                      setInput(
                        order
                      )
                    }
                  >
                    {order}
                  </Button>
                )
              )}

            </div>

<div
className="
sticky
bottom-0
rounded-3xl
border
border-white/10
bg-white/10
backdrop-blur-2xl
shadow-[0_10px_60px_rgba(59,130,246,.12)]
p-4
flex
gap-3
"
>

              <Input
                value={
                  input
                }
                placeholder="Enter order number..."
                className="
bg-transparent
border-white/10
h-14
rounded-2xl
"

                onChange={(
                  e
                ) =>
                  setInput(
                    e.target
                      .value
                  )
                }

                onKeyDown={(
                  e
                ) => {
                  if (
                    e.key ===
                    "Enter"
                  )
                    handleSend();
                }}
              />

<VoiceButton
  onResult={(text) => {

    const clean =
      text
        .toUpperCase()
        .replace(
          /\s+/g,
          "-"
        );

    console.log(
      "Sending:",
      clean
    );

    if (
      !clean.startsWith(
        "ORD"
      )
    ) {
      setMessages(
        (prev) => [
          ...prev,
          {
            role:
              "assistant",
            text:
              "Please say a valid order number like ORD 1001",
          },
        ]
      );

      return;
    }

    processRefund(
      clean
    );
  }}
/>

              <Button
                
disabled={loading}
className="
h-14
px-8
rounded-2xl
bg-gradient-to-r
from-cyan-500
to-blue-600
hover:scale-[1.03]
transition-all
"

                onClick={
                  handleSend
                }
              >
                {loading
                  ? "Processing..."
                  : "Send"}
              </Button>

            </div>

          </div>

        </Card>

        {/* SIDE */}

<div className="space-y-8 pt-2">

  <Card
  className="
  rounded-3xl
  border
  border-white/10
  bg-white/5
  backdrop-blur-2xl
  shadow-[0_0_40px_rgba(59,130,246,.08)]
  p-6
  transition-all
  duration-300
  hover:-translate-y-1
  hover:scale-[1.02]
  "
>

<h2
className="
text-2xl
font-black
mb-6
bg-gradient-to-r
from-cyan-400
to-blue-500
bg-clip-text
text-transparent
"
>
      Session Summary
    </h2>

<Badge
  className="
  bg-gradient-to-r
  from-blue-500
  to-cyan-500
  text-white
  border-none
  "
>
      {decision}
    </Badge>

    <div className="mt-8 flex flex-col items-center">

      <p className="text-sm text-slate-400">
        Refund Status
      </p>

      <p 
className="
text-5xl
font-black
mt-3
"
>
        {decision}
      </p>

    </div>

  </Card>

<Card
className="
rounded-3xl
border
border-cyan-500/20
bg-gradient-to-br
from-cyan-500/10
to-blue-600/10
backdrop-blur-2xl
p-8
shadow-[0_0_60px_rgba(6,182,212,.18)]
transition-all
duration-300
hover:-translate-y-2
"
>

    <h2
className="
text-2xl
font-black
mb-6
text-white
"
>
      Admin Panel
    </h2>

    <Link href="/admin">
      <Button
className="
w-full
h-14
rounded-2xl
bg-gradient-to-r
from-blue-600
to-cyan-500
hover:scale-[1.02]
transition-all
"
>
        Open Dashboard
      </Button>
    </Link>

  </Card>

</div>

      </div>
    </main>
  );
}