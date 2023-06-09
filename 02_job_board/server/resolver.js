import { GraphQLError } from 'graphql'
import { getCompany } from './db/companies.js'
import { getJobs as fetchJobs, getJob, getJobByCompanyId, createJob as addJob, deleteJob, updateJob } from './db/jobs.js'

const getGreeting = () => {
    return 'Hello GraphQL World!'
}

const getJobs = async () => {
    // Optimized Code
    return await fetchJobs()

    // const jobs = await fetchJobs()
    // console.log("Jobs: ", jobs)
    // return jobs
    
    /* // STATIC DATA 
        return [
            {
                id: '1',
                title: 'Software Engineer',
                company: 'Google',
                description: 'Help us build stuff!',
                location: 'Mountain View, CA',
            },
            {
                id: '2',
                title: 'Software Engineer 2',
                company: 'Facebook',
                description: 'Help us build comments!',
                location: 'Mountain View, CA',
            }
            ,
            // null  (! should be removed to send nullable element to client)
        ]
    */
}

const toISODate = (date) =>  date.slice(0, "yyyy-mm-dd".length) // date.toISOString().slice(0, "yyyy-mm-dd".length)

const getJobById = async (id) => {
    const job = await getJob(id)
    console.log("Job: ", job)
    if(!job) {
        notFoundError('Job not found with id: ' + id)
    }
    return job
}

const getCompanyById = async (id) => {
    const company = await getCompany(id)
    console.log("Company: ", company)
    if(!company) {
        notFoundError('Company not found with id: ' + id)
    }
    return company
}

const notFoundError = (message) => {
    throw new GraphQLError(message, {
        extensions: {
            code: 'NOT_FOUND',
            statusCode: 404
        }
    })
}

const unauthorizeAccess = () => {
    throw new GraphQLError('Not Authorized', {
        extensions: {
            code: 'UNAUTHORIZED',
            statusCode: 401
        }
    })
}

export const resolvers = {
    Query: {
        greeting: getGreeting,
        jobs: getJobs,
        job: (_root, args) => {
            console.log("[Query.jobs] args: ", args)
            return getJobById(args.id)
        },
        company: (_root, args) => {
            console.log("[Query.company] args: ", args)
            return getCompanyById(args.id)
        }
    },
    Mutation: {
        // auth: Context is passed to all resolvers, so we can access it here
        createJob: async (_root, {input: {title, description}}, { auth, user }) => {
            console.log("[Mutation.createJob] context: ", auth, user)
            if(!auth) {
                unauthorizeAccess()
            }
            
            console.log("[Mutation.createJob] args: ", title, description)            
            const response = await addJob({companyId: user.companyId, title, description})
            console.log("[Mutation.createJob] response: ", response)
            return response
        },
        deleteJobById: async (_root, {id}, {user}) => { 
            if(!user) unauthorizeAccess()
            return deleteJob(id, user.companyId) 
        },
        updateJobById: async (_root, {id, input: {title, description}}, {user}) => {
            if(!user) unauthorizeAccess()
            return updateJob({id, title, description},  user.companyId)
        }
    },
    Job: {
        date: (job) => toISODate(job.createdAt),
        company: (job) => getCompany(job.companyId)
    },
    Company: {
        jobs: (company) => getJobByCompanyId(company.id)
    }
}

