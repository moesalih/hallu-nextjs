import { fetchUserByUsername, getRandomUserWithPrompt } from '@/lib/services/db'
import { generatePost } from './generate-post'

export async function GET(request: Request) {
  try {
    // Extract username from query params if provided
    const { searchParams } = new URL(request.url)
    const username = searchParams.get('username')

    // Fetch user based on whether username was provided
    const user = username ? await fetchUserByUsername({ username }) : await getRandomUserWithPrompt()

    if (!user) {
      const errorMsg = username ? `User '${username}' not found or has no prompt` : 'No users with prompts found'
      return Response.json({ error: errorMsg }, { status: 404 })
    }

    const result = await generatePost(user)

    if (result.error) {
      return Response.json({ ...result }, { status: 500 })
    }

    return Response.json(result)
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 })
  }
}
