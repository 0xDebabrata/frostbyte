import SyntaxHighlighter from "react-syntax-highlighter";

const code1 = `create function public.call_edge_function() 
returns trigger
language plpgsql
security definer
as $$
declare
  source_bucket text := '<SOURCE_BUCKET>';
  req_body jsonb;
  req_id int;
  req_headers jsonb;
begin
  if new.bucket_id = source_bucket then
    req_headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Api-Key', '<FROSTBYTE_API_KEY>'
    );
    req_body := jsonb_build_object(
      'bucket_id', new.bucket_id,
      'filename', new.name,
      'task_id', <TASK_ID>
    );

    req_id := net.http_post(
      url:='https://xblahorigatqigmwvzbf.functions.supabase.co/uploaded',
      body:=req_body,
      headers:=req_headers
    );
  end if;

  return new;
end;
$$;`

const code2 = `create trigger on_object_uploaded
after update on storage.objects
for each row execute procedure public.call_edge_function();`

export default function Guide() {
  return (
    <div className="mt-5 py-5 px-10 start bg-zinc-800 rounded">
      <p className="w-[45%] text-zinc-200 text-sm pb-5 sm:pt-1">
        Getting started
      </p>
      <div className="w-full">
        <p className="mb-3 text-zinc-400 font-light text-sm">Add PostgreSQL functions for each of your tasks. Feel free to name the functions accordingly and fill in your project-specific details!</p>
        <SyntaxHighlighter language="sql" className="rounded text-sm" showLineNumbers={true}>
          {code1}
        </SyntaxHighlighter>
        <p className="mt-5 mb-3 text-zinc-400 font-light text-sm">Set up a trigger to call this function whenever a new file is uploaded.</p>
        <SyntaxHighlighter language="sql" className="rounded text-sm" showLineNumbers={true}>
          {code2}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}

