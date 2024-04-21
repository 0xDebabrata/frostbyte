import { ClipboardDocumentIcon } from "@heroicons/react/24/outline";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import toast from "react-hot-toast";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";

const query = `create or replace trigger "frostbyte_<JOB_ID>" after insert
on "storage"."objects" for each row
execute function "supabase_functions"."http_request"(
  'https://xxiohiwpymguihmmfcfi.supabase.co/functions/v1/trigger-job?job_id=<JOB_ID>',
  'POST',
  '{"Content-Type":"application/json","x-frostbyte-api-key":"<FROSTBYTE_API_KEY>"}',
  '{}',
  '5000'
); `;

export default function SQLHelp() {
  const copyQuery = () => {
    navigator.clipboard.writeText(query);
    toast.success("Query copied to clipboard");
  };

  return (
    <div className="py-5">
      <p className="text-neutral-400 pb-4">
        From your Supabase dashboard&apos;s SQL Editor, run the following query
        to set up triggers for each job.
      </p>
      <div className="relative">
        <SyntaxHighlighter
          language="sql"
          style={dracula}
          customStyle={{
            borderRadius: "10px",
          }}
        >
          {query}
        </SyntaxHighlighter>
        <div
          onClick={copyQuery}
          className="p-1 rounded cursor-pointer border border-neutral-600 bg-neutral-300 absolute top-2 right-2 flex items-center"
        >
          <ClipboardDocumentIcon
            className="h-6 w-6 text-black"
            aria-hidden="true"
          />
        </div>
      </div>
      <div className="my-4 p-2 px-4 rounded bg-yellow-600/50">
        <p className="text-sm text-neutral-200">
          Replace <code className="mx-2 px-1">FROSTBYTE_API_KEY</code> and{" "}
          <code className="mx-2 px-1">JOB_ID</code> before running this.
        </p>
      </div>
    </div>
  );
}
