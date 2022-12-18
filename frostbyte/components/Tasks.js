import NewTask from "./NewTask"
import TaskCard from "./TaskCard";

export default function Tasks({ tasks, buckets }) {
  console.log(tasks)
  return (
    <>
      {tasks.map((task, idx) => (
        <TaskCard key={idx} task={task} />
      ))}
      <NewTask buckets={buckets.map(ob => ob.name)} />
    </>
  );
}

