export default function ProjectDetails({ project }) {
  return (
    <div className="py-5 px-10 flex flex-col sm:flex-row items-start w-full bg-zinc-800 rounded">
      <p className="w-[45%] text-zinc-200 text-sm pb-5 sm:pt-1">
        General settings
      </p>
      <div className="w-full">
        <label className="text-zinc-400 font-light text-sm">Project ID</label>
        <input type='text' 
          className="px-2 py-1 text-sm w-full mt-1 mb-2 w-full rounded bg-zinc-700 font-light text-zinc-300 border border-zinc-600 focus:outline-none"
          value={project.id}
          readOnly
          /> 
        <label className="text-zinc-400 font-light text-sm">Project Name</label>
        <input type='text' 
          className="px-2 py-1 text-sm w-full mt-1 mb-2 w-full rounded bg-zinc-700 font-light text-zinc-300 border border-zinc-600 focus:outline-none"
          value={project.name}
          readOnly
          /> 
        <label className="text-zinc-400 font-light text-sm">Frostbyte API Key</label>
        <input type='text' 
          className="px-2 py-1 text-sm w-full mt-1 mb-2 w-full rounded bg-zinc-700 font-light text-zinc-300 border border-zinc-600 focus:outline-none"
          value={project.api_key}
          readOnly
          /> 
      </div>
    </div>
  );
}
