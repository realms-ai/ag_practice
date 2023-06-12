import { useState } from 'react';
import { createJob, createJobQuery, getJobByIdQuery } from '../lib/graphql/queries';
import { useNavigate } from 'react-router';
import { useMutation } from '@apollo/client';
import { useCreateJob } from '../lib/graphql/hooks';


function CreateJobPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // Use of Result
  // 1. To show loading state and disable submit button to avoid multiple clicks
  // const [mutate, result] = useMutation(createJobQuery) 
  //, { 
  //   variables: { input: { title, description } },
  //   onCompleted: (data) => {
  //     console.log("[CreateJobPage] data: ", data)
  //     navigate(`/jobs/${data.job.id}`);
  //   }
  // })

  // Using Hook
  const {createJob, result} = useCreateJob()

  const handleSubmit = async (event) => {
    event.preventDefault();
    // const job = await createJob({ title, description })
    
    // const {data: {job}} = await mutate({
    //   variables: {
    //     jobInput: {title, description}
    //   },
    //   update: (cache, {data}) => {
    //     console.log('[Queries.createJob] cache: ', cache, ' data: ', data)
    //     cache.writeQuery({
    //       query: getJobByIdQuery,
    //       variables: {id: data.job.id},
    //       data: {job: data.job}
    //     })
    //   }
    // })

    const job = await createJob(title, description)

    console.log('Job created: ', job)
    navigate(`/jobs/${job.id}`);
  };

  return (
    <div>
      <h1 className="title">
        New Job
      </h1>
      <div className="box">
        <form>
          <div className="field">
            <label className="label">
              Title
            </label>
            <div className="control">
              <input className="input" type="text" value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
            </div>
          </div>
          <div className="field">
            <label className="label">
              Description
            </label>
            <div className="control">
              <textarea className="textarea" rows={10} value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </div>
          </div>
          <div className="field">
            <div className="control">
              <button className="button is-link" disabled={result.loading} onClick={handleSubmit}>
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateJobPage;
