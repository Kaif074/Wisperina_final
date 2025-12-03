import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const ASSEMBLYAI_API_KEY = Deno.env.get("ASSEMBLYAI_API_KEY");
const ASSEMBLYAI_BASE_URL = "https://api.assemblyai.com/v2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, apikey, x-client-info",
};

interface TranscriptionRequest {
  audioUrl?: string;
  audioData?: string;
  enableSpeakerLabels?: boolean;
}

interface AssemblyAIUploadResponse {
  upload_url: string;
}

interface Utterance {
  speaker: string;
  text: string;
  start: number;
  end: number;
  confidence: number;
}

interface AssemblyAITranscriptResponse {
  id: string;
  status: "queued" | "processing" | "completed" | "error";
  text?: string;
  error?: string;
  utterances?: Utterance[];
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
    });
  }

  try {
    const { audioUrl, audioData, enableSpeakerLabels }: TranscriptionRequest = await req.json();

    if (!ASSEMBLYAI_API_KEY) {
      throw new Error("AssemblyAI API key not configured");
    }

    let uploadUrl = audioUrl;

    if (audioData) {
      const base64Data = audioData.split(",")[1];
      const binaryData = Uint8Array.from(atob(base64Data), (c) =>
        c.charCodeAt(0)
      );

      const uploadResponse = await fetch(`${ASSEMBLYAI_BASE_URL}/upload`, {
        method: "POST",
        headers: {
          authorization: ASSEMBLYAI_API_KEY,
          "content-type": "application/octet-stream",
        },
        body: binaryData,
      });

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        throw new Error(`Upload failed: ${errorText}`);
      }

      const uploadResult: AssemblyAIUploadResponse = await uploadResponse.json();
      uploadUrl = uploadResult.upload_url;
    }

    if (!uploadUrl) {
      throw new Error("No audio URL or data provided");
    }

    const transcriptResponse = await fetch(`${ASSEMBLYAI_BASE_URL}/transcript`, {
      method: "POST",
      headers: {
        authorization: ASSEMBLYAI_API_KEY,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        audio_url: uploadUrl,
        speech_model: "universal",
        speaker_labels: enableSpeakerLabels || false,
      }),
    });

    if (!transcriptResponse.ok) {
      const errorText = await transcriptResponse.text();
      throw new Error(`Transcription request failed: ${errorText}`);
    }

    const transcript: AssemblyAITranscriptResponse = await transcriptResponse.json();
    const transcriptId = transcript.id;

    console.log("Transcription started with ID:", transcriptId);

    let status = transcript.status;
    let attempts = 0;
    const maxAttempts = 60;

    while (
      (status === "queued" || status === "processing") &&
      attempts < maxAttempts
    ) {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const statusResponse = await fetch(
        `${ASSEMBLYAI_BASE_URL}/transcript/${transcriptId}`,
        {
          headers: {
            authorization: ASSEMBLYAI_API_KEY,
          },
        }
      );

      if (!statusResponse.ok) {
        const errorText = await statusResponse.text();
        throw new Error(`Status check failed: ${errorText}`);
      }

      const statusData: AssemblyAITranscriptResponse = await statusResponse.json();
      status = statusData.status;

      console.log(`Transcription status (attempt ${attempts + 1}):`, status);

      if (status === "completed") {
        console.log("Transcription completed, text length:", statusData.text?.length || 0);
        
        if (!statusData.text) {
          console.error("Warning: Transcription completed but no text received");
          throw new Error("Transcription completed but no text was generated. The audio may be empty or unclear.");
        }

        const response: {
          success: boolean;
          text: string;
          utterances?: Utterance[];
          speakerCount?: number;
        } = {
          success: true,
          text: statusData.text,
        };

        if (enableSpeakerLabels && statusData.utterances) {
          const normalize = (s: string) => s.trim().toLowerCase().replace(/^speaker\s*/i, "");
          const filtered = statusData.utterances.filter((u) => (u.confidence ?? 0) >= 0.5);
          const originals = Array.from(new Set(filtered.map((u) => normalize(u.speaker))));
          const labelMap = new Map<string, string>();
          for (let i = 0; i < originals.length; i++) {
            const letter = String.fromCharCode(65 + (i % 26));
            labelMap.set(originals[i], `Speaker ${letter}`);
          }

          response.utterances = statusData.utterances.map((u) => {
            const key = normalize(u.speaker);
            return { ...u, speaker: labelMap.get(key) ?? u.speaker };
          });

          response.speakerCount = originals.length || 1;
          console.log("Speaker diarization completed, unique speakers:", response.speakerCount);
        }

        return new Response(
          JSON.stringify(response),
          {
            headers: {
              "Content-Type": "application/json",
              ...corsHeaders,
            },
          }
        );
      }

      if (status === "error") {
        console.error("Transcription error:", statusData.error);
        throw new Error(statusData.error || "Transcription failed");
      }

      attempts++;
    }

    if (attempts >= maxAttempts) {
      throw new Error("Transcription timeout - please try again");
    }

    throw new Error("Unexpected transcription status");
  } catch (error) {
    console.error("Transcription error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  }
});
