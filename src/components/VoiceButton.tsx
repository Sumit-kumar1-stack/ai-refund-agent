"use client";

import { Button } from "@/components/ui/button";

type Props = {
  onResult: (
    text: string
  ) => void;
};

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export default function VoiceButton({
  onResult,
}: Props) {

  function startVoice() {

    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(
        "Speech recognition not supported"
      );
      return;
    }

    const recognition =
      new SpeechRecognition();

    recognition.lang =
      "en-US";

    recognition.continuous =
      false;

    recognition.interimResults =
      false;

    recognition.start();

    console.log(
      "Listening..."
    );

    recognition.onresult =
      (event: any) => {

        const text =
          event.results?.[0]?.[0]
            ?.transcript || "";

        console.log(
          "Recognized:",
          text
        );

        if (
          text.trim()
        ) {
          onResult(
            text
          );
        }
      };

    recognition.onerror =
      (event: any) => {

        console.log(
          "Speech Error:",
          event.error
        );

        if (
          event.error ===
          "no-speech"
        ) {
          return;
        }

        if (
          event.error ===
          "not-allowed"
        ) {
          alert(
            "Microphone permission denied"
          );
          return;
        }

        alert(
          `Voice Error: ${event.error}`
        );
      };

    recognition.onend =
      () => {
        console.log(
          "Voice ended"
        );
      };
  }

  return (
    <Button
      type="button"
      variant="outline"
      onClick={
        startVoice
      }
    >
      🎤
    </Button>
  );
}