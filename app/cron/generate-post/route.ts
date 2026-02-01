import { generatePost } from './generate-post'

export async function GET(request: Request) {
  try {
    const result = await generatePost()

    if (result.error) {
      return Response.json({ ...result }, { status: 500 })
    }

    return Response.json(result)
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 })
  }
}
