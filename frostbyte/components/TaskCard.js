const TaskCard = ({ task }) => {
  return (
    <div className="bg-zinc-800 rounded shadow-lg px-8 py-3 mb-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-2xl text-zinc-200">{task.name}</h3>
        <span className="text-zinc-400 text-sm">ID: {task.id}</span>
      </div>
      <div className="flex justify-between items-center flex-wrap">
        <div className="w-32 text-ellipses text-zinc-300 font-light text-xs mb-2 flex flex-col">
          <p>
            Source
          </p>
          <p className="text-sm text-zinc-200">
            {task.source_bucket}
          </p>
        </div>
        <div className="w-32 text-ellipses text-zinc-300 font-light text-xs mb-2 flex flex-col">
          <p>
            Destination
          </p>
          <p className="text-sm text-zinc-200">
            {task.destination_bucket}
          </p>
        </div>
        <div className="w-32 text-ellipses text-zinc-300 font-light text-xs mb-2 flex flex-col">
          <p>
            Operation
          </p>
          <p className="text-sm text-zinc-200">
            {task.spec.operation.charAt(0).toUpperCase() + task.spec.operation.slice(1)}
          </p>
        </div>
        <div className="w-32 text-ellipses text-zinc-300 font-light text-xs mb-2 flex flex-col">
          <p>
            Output format
          </p>
          <p className="text-sm text-zinc-200">
            {task.spec.format}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
