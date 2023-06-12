import { connection } from './connection.js';
import { generateId } from './ids.js';

const getJobTable = () => connection.table('job');

export async function getJobs(limit = 10, offset = 0) {
  const query = getJobTable().select().orderBy("createdAt", "desc")
  const total = await getJobTable().count() || 0;
  console.log("Offset: ", offset)
  const response = await query.limit(limit).offset(offset);
  // console.log("Response: ", response)
  // console.log("Total: ", Object.values(total[0])[0])  
  return { details: response, totalCount: Object.values(total[0])[0] };
  // return response;
}

export async function getTotalJobs() {
  return await getJobTable().count() || 0;
}

export async function getJob(id) {
  return await getJobTable().first().where({ id });
}

export async function getJobByCompanyId(id) {
  return await getJobTable().select().where({ companyId: id });
}

export async function createJob({ companyId, title, description }) {
  const job = {
    id: generateId(),
    companyId,
    title,
    description,
    createdAt: new Date().toISOString(),
  };
  await getJobTable().insert(job);
  return job;
}

export async function deleteJob(id, companyId) {
  console.log("Deleting Job with id: ", id)
  const job = await getJobTable().first().where({ id });
  if (!job || job.companyId !== companyId) {
    throw new Error(`Job not found: ${id}`);
  }
  await getJobTable().delete().where({ id });
  return job;
}

export async function updateJob({ id, title, description}, companyId) {
  const job = await getJobTable().first().where({ id });
  if (!job || job.companyId !== companyId) {
    throw new Error(`Job not found: ${id}`);
  }
  const updatedFields = { title, description };
  await getJobTable().update(updatedFields).where({ id });
  return { ...job, ...updatedFields };
}
