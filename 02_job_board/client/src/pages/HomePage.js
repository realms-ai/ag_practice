import { useEffect, useRef, useState } from 'react';
import JobList from '../components/JobList';
// import { jobs } from '../lib/fake-data';
import { getJobs } from '../lib/graphql/queries';
import { useJobs } from '../lib/graphql/hooks';
import Pagination from '../components/Pagination';

// getJobs().then((jobs) => console.log("Jobs: ", jobs))

function HomePage() {
  const limit = 10
  const [currentPage, setCurrentPage] = useState(1)
  const {jobs, totalCount, loading, error} = useJobs(limit, (currentPage - 1) * 10)
  
  // const [jobs, setJobs] = useState([]);
  // console.log("[HomePage] jobs: ", jobs)

  const onPageChange = (page) => {
    console.log("Page: ", page)
    setCurrentPage(page)
  }

  // useEffect(() => {
    

  // }, [currentPage])


  // useEffect(() => {
  //   const fetchJobs = async () => {
  //     const allJobs = await getJobs();
  //     setJobs(allJobs);
  //   };
  //   fetchJobs();
  // }, [])
  if(loading) {
    return <div>Loading...</div>
  }
  if(error) {
    return <div class='has-text-danger'>There was an error fetching the jobs</div>
  }
  return (
    <div>
      <h1 className="title">
        Job Board
      </h1>
      <JobList jobs={jobs} />
      <Pagination count={totalCount} page={currentPage} limit={limit} onPageChange={onPageChange} />
      {/* <JobList jobs={getJobs().then((jobs) => jobs)} /> */}
    </div>
  );
}

export default HomePage;
