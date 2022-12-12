export default function Card({ id, name }) {
  return (
    <div>
      <div className='text-2xl text-center bg-yellow-100'>
        <h1>{ name }</h1>
      </div>
      <div></div>
    </div>
  );
}
