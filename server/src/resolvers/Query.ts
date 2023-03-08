import { Context } from "../index";

export const Query = {
	broadcasts: (_: any, __: any, { prisma }: Context) => {
		const broadcasts = prisma.broadcast.findMany({
			orderBy: {
				posts: {
					_count: "desc"
				}
			}
		});

		return broadcasts;
	},
	posts: (_: any, __: any, { prisma }: Context) => {
		const posts = prisma.post.findMany({
			orderBy: {
				approve: "desc"
			}
		});

		return posts;
	}
};
