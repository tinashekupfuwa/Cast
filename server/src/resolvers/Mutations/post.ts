import { Context } from "../..";
import { Post, Prisma } from "@prisma/client";

interface PostArgs {
	post: {
		title?: string;
		description?: string;
	};
}

interface PostPayload {
	userErrors: {
		message: string;
	}[];
	post: Post | Prisma.Prisma__PostClient<Post, never> | null;
}

export const postResolvers = {
	postCreate: async (
		_: any,
		{ post }: { post: PostArgs["post"] },
		{ prisma }: Context
	): Promise<PostPayload> => {
		//checking if a post with the same title exists
		const { title, description } = post;

		if (!title || !description) {
			return {
				userErrors: [
					{
						message:
							"Please provide the title and the description of the post being created"
					}
				],
				post: null
			};
		}
		const existingTitle = await prisma.post.findUnique({
			where: {
				title: title
			}
		});

		if (existingTitle) {
			return {
				userErrors: [
					{
						message:
							"A post with the same title exists, please look for the existing post or change the title"
					}
				],
				post: null
			};
		}

		//creating post
		return {
			userErrors: [],
			post: await prisma.post.create({
				data: {
					title,
					description,
					authorId: 2,
					broadcastId: 2
				}
			})
		};
	},

	postUpdate: async (
		_: any,
		{ postId, post }: { postId: string; post: PostArgs["post"] },
		{ prisma }: Context
	): Promise<PostPayload> => {
		//check if title and description have been updated
		const { title, description } = post;
		if (!title && !description) {
			return {
				userErrors: [
					{
						message: "Please provide the field you want to update."
					}
				],
				post: null
			};
		}

		//check if post does exist
		const postToBeUpdated = await prisma.post.findUnique({
			where: {
				id: Number(postId)
			}
		});
		if (!postToBeUpdated) {
			return {
				userErrors: [
					{
						message: "Post does not exist"
					}
				],
				post: null
			};
		}

		let toBePayload = {
			title,
			description
		};

		if (!title) delete toBePayload.title;
		if (!description) delete toBePayload.description;

		return {
			userErrors: [],
			post: await prisma.post.update({
				data: {
					...toBePayload
				},
				where: {
					id: Number(postId)
				}
			})
		};
	},

	postDelete: async (
		_: any,
		{ postId, post }: { postId: string; post: PostArgs["post"] },
		{ prisma }: Context
	): Promise<PostPayload> => {
		//check if the post exists
		const existingPost = await prisma.post.findUnique({
			where: {
				id: Number(postId)
			}
		});

		if (!existingPost) {
			return {
				userErrors: [
					{
						message: "Post does not exist"
					}
				],
				post: null
			};
		}

		return {
			userErrors: [],
			post: prisma.post.delete({
				where: {
					id: Number(postId)
				}
			})
		};
	}
};
