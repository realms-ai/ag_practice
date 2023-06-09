import { useParams } from 'react-router';
import { companies } from '../lib/fake-data';
import { getCompanyById } from '../lib/graphql/queries';
import { useEffect, useState } from 'react';
import JobList from '../components/JobList';

function CompanyPage() {
  const { companyId } = useParams();
  // const [company, setCompany] = useState(null);
  const [state, setState] = useState({
    company: null,
    loading: true,
    error: false,
  });
  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const company = await getCompanyById(companyId);
        setState({ company, loading: false, error: false });
      } catch (error) {
        console.log("Error: ", JSON.stringify(error, null, 2))
        setState({ company: null, loading: false, error: true });
      }
    };
    fetchCompany();
  }, [companyId])
  const { company, loading, error } = state;
  console.log("[CompanyPage] company: ", company, " companyId: ", companyId)
  if(loading) {
    return <div>Loading...</div>
  }
  if(error) {
    return <div class='has-text-danger'>There was an error fetching the company</div>
  }
  // const company = companies.find((company) => company.id === companyId);
  return (
    <div>
      <h1 className="title">
        {company.name}
      </h1>
      <div className="box">
        {company.description}
      </div>
      <h2 className="title is-5">
        Jobs at {company.name}
      </h2>
      <JobList jobs={company.jobs} />
    </div>
  );
}

export default CompanyPage;
