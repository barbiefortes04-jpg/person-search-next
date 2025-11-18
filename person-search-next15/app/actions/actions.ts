//app/actions/actions.ts

'use server'

import { revalidatePath } from 'next/cache'
import { User, userSchema } from './schemas'
import { cache } from 'react'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'

async function requireAuth() {
    const session = await auth()
    if (!session?.user) {
        redirect('/auth/signin')
    }
    return session
}

export async function searchUsers(query: string): Promise<User[]> {
    console.log('Searching users with query:', query)
    
    const people = await prisma.person.findMany({
        where: {
            name: {
                startsWith: query,
                mode: 'insensitive',
            },
        },
        orderBy: {
            name: 'asc',
        },
    })

    // Map Person to User format
    const results = people.map(person => ({
        id: person.id,
        name: person.name,
        email: person.email,
        phoneNumber: person.phoneNumber,
    }))
    
    console.log('Search results:', results)
    return results
}

export async function addUser(data: Omit<User, 'id'>): Promise<User> {
    await requireAuth()
    
    const validatedData = userSchema.omit({ id: true }).parse(data)
    
    const newPerson = await prisma.person.create({
        data: {
            name: validatedData.name,
            email: validatedData.email,
            phoneNumber: validatedData.phoneNumber,
        },
    })

    revalidatePath('/')
    
    return {
        id: newPerson.id,
        name: newPerson.name,
        email: newPerson.email,
        phoneNumber: newPerson.phoneNumber,
    }
}

export async function deleteUser(id: string): Promise<void> {
    await requireAuth()
    
    await prisma.person.delete({
        where: { id },
    })
    
    console.log(`User with id ${id} has been deleted.`)
    revalidatePath('/')
}

export async function updateUser(id: string, data: Partial<Omit<User, 'id'>>): Promise<User> {
    await requireAuth()
    
    const updatedPerson = await prisma.person.update({
        where: { id },
        data: {
            ...(data.name && { name: data.name }),
            ...(data.email && { email: data.email }),
            ...(data.phoneNumber && { phoneNumber: data.phoneNumber }),
        },
    })

    console.log(`User with id ${id} has been updated.`)
    revalidatePath('/')

    return {
        id: updatedPerson.id,
        name: updatedPerson.name,
        email: updatedPerson.email,
        phoneNumber: updatedPerson.phoneNumber,
    }
}

export const getUserById = cache(async (id: string) => {
    const person = await prisma.person.findUnique({
        where: { id },
    })
    
    if (!person) return null
    
    return {
        id: person.id,
        name: person.name,
        email: person.email,
        phoneNumber: person.phoneNumber,
    }
})
