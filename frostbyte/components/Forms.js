import React from "react";
export default function Form() {
  return (
    <form>
      <label for='projectName'>Project Name</label>
      <input type='text' id='projectName' name='project'></input>
      <br />
      <label for='supabaseUrl'>Supabase project URL</label>
      <input type='text' id='supabaseUrl' name='supabaseUrl'></input>
      <br />
      <label for='secretKey'>Supabase Secret Key </label>
      <input type='password' id='secretKey' name='secretKey'></input>
      <br />
      <button class='bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded'>
        Submit
      </button>
    </form>
  );
}
