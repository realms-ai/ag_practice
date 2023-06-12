import { useMutation, useQuery } from "@apollo/client"
import { createJobQuery, getCompanyByIdQuery, getJobByIdQuery, getJobsQuery } from "./queries"


const useCompany = (companyId) => {
    const {data, loading, error} = useQuery(getCompanyByIdQuery, {
      variables: { companyId },
    })
    return {company: data?.company, loading, error: Boolean(error)}
}

const useJobs = (limit, offset) => {
    console.log("Fetching Jobs with limit: ", limit, " and offset: ", offset)
    const {data, loading, error} = useQuery(getJobsQuery, {
        fetchPolicy: "network-only",
        variables: { limit, offset },
    })
    return {jobs: data?.jobs?.details, totalCount: data?.jobs?.totalCount ,loading, error: Boolean(error)}
}

const useJob = (id) => {
    console.log("Fetching Job with id: ", id)
    const {data, loading, error} = useQuery(getJobByIdQuery, {
        variables: { id },
    })
    console.log("[Queries.JobById]: ", data?.job)
    return {job: data?.job, loading, error: Boolean(error)}
}

const useCreateJob = () => {
    const [mutate, result] = useMutation(createJobQuery) //, { 
    //   variables: { input: { title, description } },
    //   onCompleted: (data) => {
    //     console.log("[CreateJobPage] data: ", data)
    //     navigate(`/jobs/${data.job.id}`);
    //   }
    // })

    const createJob = async (title, description) => {
        const {data: {job}} = await mutate({
            variables: {
                jobInput: {title, description}
            },
            update: (cache, {data}) => {
                console.log('[Queries.createJob] cache: ', cache, ' data: ', data)
                cache.writeQuery({
                    query: getJobByIdQuery,
                    variables: {id: data.job.id},
                    data: {job: data.job}
                })
            }
        })
        console.log('Job created: ', job)
        return job
    }
        


    return { createJob, result }
}


export {useCompany, useJob, useJobs, useCreateJob}