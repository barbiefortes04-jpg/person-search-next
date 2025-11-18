import { prisma } from "../lib/prisma"

async function checkAuthSessions() {
  try {
    console.log("🔍 Checking Auth.js database tables...\n")

    const users = await prisma.user.findMany({
      include: {
        accounts: true,
        sessions: true,
      },
    })

    console.log(`📊 Total Users: ${users.length}`)
    users.forEach((user) => {
      console.log(`\n👤 User: ${user.name} (${user.email})`)
      console.log(`   ID: ${user.id}`)
      console.log(`   Accounts: ${user.accounts.length}`)
      console.log(`   Active Sessions: ${user.sessions.length}`)
    })

    const totalSessions = await prisma.session.count()
    console.log(`\n🔐 Total Active Sessions: ${totalSessions}`)

    if (totalSessions > 0) {
      const recentSessions = await prisma.session.findMany({
        take: 5,
        orderBy: { expires: "desc" },
        include: { user: true },
      })
      console.log("\n📅 Recent Sessions:")
      recentSessions.forEach((session) => {
        console.log(`   - ${session.user.name}: Expires ${session.expires.toLocaleString()}`)
      })
    }
  } catch (error) {
    console.error("❌ Error:", error)
  } finally {
    await prisma.$disconnect()
  }
}

checkAuthSessions()
