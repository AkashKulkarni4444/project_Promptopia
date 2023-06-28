import Prompt from "@models/prompt";
import { connectToDB } from "@utils/database";

export const GET = async (request, { params }) => {
  try {
    await connectToDB();
    const searchQuery = new RegExp(params.query, "i");
    let q = params.query;
    const prompts = await Prompt.find({
      $or: [{ prompt: searchQuery }, { tags: { $in: q.split(",") } }],
    }).populate("creator");
    if (!prompts) {
      return new Response("Search query not found.", { status: 404 });
    }
    return new Response(JSON.stringify(prompts), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("Failed to search properly.", { status: 500 });
  }
};
