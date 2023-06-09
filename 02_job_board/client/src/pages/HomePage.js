import { useEffect, useState } from 'react';
import JobList from '../components/JobList';
// import { jobs } from '../lib/fake-data';
import { getJobs } from '../lib/graphql/queries';

// getJobs().then((jobs) => console.log("Jobs: ", jobs))

function HomePage() {
  const [jobs, setJobs] = useState([]);
  console.log("[HomePage] jobs: ", jobs)
  useEffect(() => {
    const fetchJobs = async () => {
      const allJobs = await getJobs();
      setJobs(allJobs);
    };
    fetchJobs();
  }, [])
  return (
    <div>
      <h1 className="title">
        Job Board
      </h1>
      <JobList jobs={jobs} />
      {/* <JobList jobs={getJobs().then((jobs) => jobs)} /> */}
    </div>
  );
}

export default HomePage;
