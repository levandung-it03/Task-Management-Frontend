'use client'

import { DTO_LLMCompleteion, LLMSentMsgAndRole, UserTaskPageAPIs } from "@/apis/user-task.page.api";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useCallback, useState } from "react";

export interface CreateReportFormProps {
  userTaskId: number;
}

export default function CreateReportForm({ userTaskId }: CreateReportFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const editor = useEditor({
    extensions: [StarterKit],
    content: "<p>Hello world</p>",
    editorProps: {},
    immediatelyRender: false,
  });

  const description = `
1. Create a responsive design for the marketing landing page.
2. Create HTML & CSS Frame as first to be reviewed by customer (refer from Dribbble).
3. Refactor the code into NextJS.
4. Run the code with "npx next build" to ensure there is no error.
5. Push the code on to git branch "ui/page/landing".
  `;

  const reportFormat = `
Dear Mr. Duy,  
Today I've been done:  
  + Created responsive design for landing page  
  + Built initial HTML/CSS frame from Dribbble  
  + Refactored layout into NextJS  
  + Ran code with "npx next build" successfully  
  + Pushed code to git branch "ui/page/landing"  

Tomorrow I'll  
  + Start integrating backend API  

Finally, thank you for supporting me in these lessons.  
Regards,  
Dung
  `;

  const generateReport = useCallback(() => {
    async function complete() {
      if (!editor) return;
      setIsLoading(true);

      // STEP 1: Extract only the current line where the user is typing
      const fullText = editor.getText();
      const selection = editor.state.selection.from;
      const lines = fullText.split("\n");

      let charCount = 0;
      let currentLine = "";
      for (const line of lines) {
        charCount += line.length + 1; // +1 for newline
        if (charCount >= selection) {
          currentLine = line.trim();
          break;
        }
      }

      const prompt = getDefaultPrompt(description, reportFormat, currentLine);
      const request = DTO_LLMCompleteion.withBuilder()
        .bmodel("phi-3.1-mini-4k-instruct")
        .bmessages([
          LLMSentMsgAndRole.withBuilder()
            .brole("user")
            .bcontent(prompt),
        ])
        .bmaxTokens(400);

      try {
        const response = await UserTaskPageAPIs.getCompletion(request) as any;
        const result = response.data?.choices?.[0]?.message?.content ?? "No completion received.";
        editor.commands.insertContent(result.trim());
      } catch (err) {
        alert("Failed to get completion.");
      }
      setIsLoading(false);
    };
    complete()
  }, [editor])

  return (
    <div className="create-report-form">
      <EditorContent editor={editor} className="border p-4 min-h-[150px]" />
      <button
        onClick={generateReport}
        disabled={isLoading}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        {isLoading ? "Generating..." : "AI Complete"}
      </button>
    </div>
  );
}

function getDefaultPrompt(description: string, reportFormat: string, userTypedLine: string): string {
  return `
You are a helpful assistant generating daily software development report lines.

Only complete this sentence fragment. Do not include headers. Do not repeat the "+" sign. Only return the rest of the sentence.

The user's task description:
${description.trim()}

The report format:
${reportFormat.trim()}

Now complete the following partial line:

"${userTypedLine.trim()}"
`.trim();
}