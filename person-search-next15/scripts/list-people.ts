import 'dotenv/config'
import { prisma } from '../lib/prisma'

async function list() {
  try {
    const people = await prisma.person.findMany({ orderBy: { createdAt: 'desc' } })
    console.log(`Found ${people.length} people:`)
    console.table(people)
  } catch (e) {
    console.error('Error querying people:', e)
  } finally {
    await prisma.$disconnect()
  }
}

list()
