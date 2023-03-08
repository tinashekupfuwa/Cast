import { broadcastResolvers } from "./broadcast";
import { postResolvers } from "./post";

export const Mutation = {
	...broadcastResolvers,
	...postResolvers
};
