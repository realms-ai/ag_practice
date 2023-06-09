import { GraphQLClient, gql } from 'graphql-request';
import { getAccessToken } from '../auth';

const client = new GraphQLClient('http://localhost:9000/graphql', { headers: () => {
	const accessToken = getAccessToken();
	if(accessToken) {
		return { "Authorization": `Bearer ${accessToken}` }
	}
} });

const getJobs = async() => {
    const query = gql`
        query GetJobs {
            jobs {
                id
                date
                title
                company {
                    id
                    name
                }
            }
        }
    `
    const { jobs } = await client.request(query)
    console.log("Fetching Jobs: ", jobs)
    return jobs
}

const getJobById = async(id) => {
    console.log("Fetching Job with id: ", id)
    const query = gql`
       query GetJobById($id: ID!) {
        job(id: $id) {
					id
					date
					title
					description
					company {
						id
						name
					}
        }
      }
    `
    const { job } = await client.request(query, {id: id})
    console.log("[Queries.JobById]: ", job)
    return job
}

const getCompanyById = async(id) => {
		console.log("Fetching Company with id: ", id)
		const query = gql`
			query GetCompanyBYId($companyId: ID!) {
				company(id: $companyId) {
					id
					name
					description   
					jobs {
						id
						title
						date
					}
				} 
			}
		`
		const { company } = await client.request(query, {companyId: id})
		console.log("[Queries.CompanyById]: ", company)
		return company
}

const createJob = async(input) => {
	const mutationQuery	= gql`
		mutation AddJob($jobInput: CreateJobInput!) {
			job: createJob (input: $jobInput) {
				id
				title
				description
				company {
					id
				}
			}
		}
	`
	const { job } = await client.request(mutationQuery, {jobInput: input})
	console.log("[Queries.createJob]: ", job)
	return job
}

export { getJobs, getJobById, getCompanyById, createJob }