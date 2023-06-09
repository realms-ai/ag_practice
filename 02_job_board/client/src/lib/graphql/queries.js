import {ApolloClient, ApolloLink, concat, createHttpLink, gql, InMemoryCache, useMutation} from '@apollo/client';
import { GraphQLClient } from 'graphql-request';
import { getAccessToken } from '../auth';

const client = new GraphQLClient('http://localhost:9000/graphql', { headers: () => {
	const accessToken = getAccessToken();
	if(accessToken) {
		return { "Authorization": `Bearer ${accessToken}` }
	}
} });

// Apollo Link Overview
// https://www.apollographql.com/docs/react/api/link/introduction/

const httpLink = createHttpLink({ uri: 'http://localhost:9000/graphql' })

const customLink = new ApolloLink((operation, forward) => {
	console.log("[customLink] operation: ", operation)
	return forward(operation)
})

const authLink	= new ApolloLink((operation, forward) => {
	console.log("[authLink] operation: ", operation)
	const accessToken = getAccessToken();
	if(accessToken) {
		operation.setContext({ headers: { 'Authorization': `Bearer ${accessToken}` } })
		// operation.setContext(({headers}) => ({ 
		// 	headers: {
		// 		authorization: `Bearer ${accessToken}`,
		// 		...headers
		// 	}
		// }))
	}
	return forward(operation)
})

const apolloClient = new ApolloClient({
	// uri: 'http://localhost:9000/graphql',
	// link: httpLink,
	link: concat(authLink, httpLink),
	cache: new InMemoryCache(),
	defaultOptions: {
		// query: {
		// 	fetchPolicy: 'cache-first'	
		// },
		// watchQuery: {
		// 	fetchPolicy: 'network-only'
		// }
		
	}
	// headers: () => {
	// 	const accessToken = getAccessToken();
	// 	if(accessToken) {
	// 		return { "Authorization": `Bearer ${accessToken}` }
	// 	}
	// }
})


const basicJobFragments = gql`
	fragment JobBasics on Job {
		id
		date
		title
	}
`

const detailJobFragments = gql`
	fragment JobDetails on Job {
		description
		...JobBasics		
	}
`

const basicCompanyFragments = gql`
	fragment CompanyBasics on Company {
		id
		name
	}

`

const detailCompanyFragments = gql`
	fragment CompanyDetails on Company {		
		description
		...CompanyBasics
	}
`

const getJobByIdQuery = gql`
	${basicJobFragments}
	${detailJobFragments}
	${basicCompanyFragments}
	query GetJobById($id: ID!) {
		job(id: $id) {
			company {
				...CompanyBasics
			}
			...JobDetails
		}
	}
	
`

const getJobs = async() => {
    const query = gql`
        ${basicJobFragments}
				${basicCompanyFragments}
				query GetJobs {
            jobs {
               company {
								...CompanyBasics
							 },
							 ...JobBasics
            }
        }
				
    `
    // const { jobs } = await client.request(query)
		const {data: {jobs}} = await apolloClient.query({query,
			// fetchPolicy: 'cache-first',
			// fetchPolicy: 'network-only',
			// fetchPolicy: 'cache-only',
			// fetchPolicy: 'no-cache',
			// fetchPolicy: 'standby',
			// fetchPolicy: 'cache-and-network',

		})
    console.log("Fetching Jobs: ", jobs)
    return jobs
}

const getJobById = async(id) => {
    console.log("Fetching Job with id: ", id)
    // const { job } = await client.request(query, {id: id})
		const {data: {job}} = await apolloClient.query({query: getJobByIdQuery, variables: {id}})
    console.log("[Queries.JobById]: ", job)
    return job
}

const getCompanyById = async(id) => {
		console.log("Fetching Company with id: ", id)
		const query = gql`
			${basicJobFragments}
			${basicCompanyFragments}
			${detailCompanyFragments}
			query GetCompanyBYId($companyId: ID!) {
				company(id: $companyId) {
					jobs {
						...JobBasics
					}
					...CompanyDetails
					# id
					# name
					# description   
					# jobs {
					# 	id
					# 	title
					# 	date
					# }
				} 
			}
		`
		// const { company } = await client.request(query, {companyId: id})
		const {data: {company}} = await apolloClient.query({query, variables: {companyId: id}})
		console.log("[Queries.CompanyById]: ", company)
		return company
}

const createJob = async(input) => {
	const mutationQuery	= gql`
		mutation AddJob($jobInput: CreateJobInput!) {
			job: createJob (input: $jobInput) {
				company {
				...CompanyBasics
			}
			...JobDetails
			}
		}
	`
	console.log("Log Input: ", input)
	// const { job } = await client.request(mutationQuery, {jobInput: input})
	const {data: {job}} = await apolloClient.mutate({
		mutation: mutationQuery, 
		variables: {
			jobInput: input
		},
		// context: {
		// 	headers: {
		// 		authorization: `Bearer ${getAccessToken()}`
		// 	}
		// },
		update: (cache, {data}) => {
			console.log('[Queries.createJob] cache: ', cache, ' data: ', data)
			cache.writeQuery({
				query: getJobByIdQuery,
				variables: {id: data.job.id},
				data: {job: data.job}
			})
		}
	})

	console.log("[Queries.createJob]: ", job)
	return job
}

export { getJobs, getJobById, getCompanyById, createJob, apolloClient }