import React from "react";
export default function Form() {
  return (
    <form>
      <label htmlFor='projectName'>Project Name</label>
      <input type='text' id='projectName' name='project'></input>
      <br />
      <label htmlFor='supabaseUrl'>Supabase project URL</label>
      <input type='text' id='supabaseUrl' name='supabaseUrl'></input>
      <br />
      <label htmlFor='secretKey'>Supabase Secret Key </label>
      <input type='password' id='secretKey' name='secretKey'></input>
      <br />
      <button className='bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded'>
        Submit
      </button>
    </form>
  );
}
