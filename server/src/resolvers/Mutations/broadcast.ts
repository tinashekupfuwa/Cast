import { Context } from "../..";
import { Prisma, Broadcast } from "@prisma/client";

interface broadcastArgs {
	broadcast: {
		title?: string;
		description?: string;
	};
}

interface BroadcastPayload {
	userErrors: {
		message: string;
	}[];
	broadcast:
		| Broadcast
		| Prisma.Prisma__BroadcastClient<Broadcast, never>
		| null;
}

export const broadcastResolvers = {
	//Find broadcast
	broadcastFind: async (
		_: any,
		{ broadcastTitle }: { broadcastTitle: string },
		{ prisma }: Context
	) => {
		//find broadcast using title
		const broadcast = await prisma.broadcast.findUnique({
			where: {
				title: broadcastTitle
			}
		});

		if (!broadcast) {
			return {
				userErrors: [
					{
						message: "broadcast does not exist"
					}
				],
				broadcast: null
			};
		}

		return {
			userErrors: [],
			broadcast
		};
	},
	broadcastCreate: async (
		_: any,
		{ broadcast }: broadcastArgs,
		{ prisma }: Context
	): Promise<BroadcastPayload> => {
		//finding if theres an existing broadcast, that shares the same name
		const { title, description } = broadcast;
		const existingBroadcast = await prisma.broadcast.findUnique({
			where: {
				title: title
			}
		});

		if (existingBroadcast) {
			return {
				userErrors: [
					{
						message:
							"Broadcast name is already taken, please join the existing broadcast or choose a different name for your broadcast"
					}
				],
				broadcast: null
			};
		}

		//making sure the necessary fields are provided.
		if (!title || !description) {
			return {
				userErrors: [
					{
						message:
							"Please provide the title and the description of the broadcast"
					}
				],
				broadcast: null
			};
		}

		return {
			userErrors: [],
			broadcast: prisma.broadcast.create({
				data: {
					title,
					description,
					creatorId: 1
				}
			})
		};
	},
	broadcastUpdate: async (
		_: any,
		{
			broadcastId,
			broadcast
		}: { broadcastId: string; broadcast: broadcastArgs["broadcast"] },
		{ prisma }: Context
	): Promise<BroadcastPayload> => {
		//Updating a broadcast
		const { title, description } = broadcast;
		if (!title && !description) {
			return {
				userErrors: [
					{
						message: "Please provide the field you want to update "
					}
				],
				broadcast: null
			};
		}

		const existingPost = await prisma.broadcast.findUnique({
			where: {
				id: Number(broadcastId)
			}
		});

		if (!existingPost) {
			return {
				userErrors: [
					{
						message: "The Broadcast does not exist"
					}
				],
				broadcast: null
			};
		}

		let payloadToUpdate = {
			title,
			description
		};

		if (!title) delete payloadToUpdate.title;
		if (!description) delete payloadToUpdate.description;

		return {
			userErrors: [],
			broadcast: await prisma.broadcast.update({
				where: {
					id: Number(broadcastId)
				},
				data: {
					...payloadToUpdate
				}
			})
		};
	},
	//Broadcast Delete
	broadcastDelete: async (
		_: any,
		{ broadcastId }: { broadcastId: string },
		{ prisma }: Context
	): Promise<BroadcastPayload> => {
		//check if the broadcast exists

		const broadcast = await prisma.broadcast.findUnique({
			where: {
				id: Number(broadcastId)
			}
		});

		if (!broadcast || null) {
			return {
				userErrors: [
					{
						message: "broadcast does not exist"
					}
				],
				broadcast: null
			};
		}

		await prisma.broadcast.delete({
			where: {
				id: Number(broadcastId)
			}
		});

		return {
			userErrors: [],
			broadcast
		};
	}
};
