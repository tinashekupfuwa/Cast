import { gql } from "apollo-server";

//typeDefs
export const typeDefs = gql`
	type Query {
		broadcasts: [Broadcast!]!
		posts: [Post!]!
	}

	type Mutation {
		#Broadcast
		broadcastFind(broadcastTitle: String): BroadcastPayload!
		broadcastCreate(broadcast: BroadcastInput): BroadcastPayload!
		broadcastUpdate(
			broadcastId: ID!
			broadcast: BroadcastInput
		): BroadcastPayload!
		broadcastDelete(broadcastId: ID!): BroadcastPayload!
		#Post
		postCreate(
			userId: ID!
			post: PostInput!
			broadcastId: String!
		): PostPayload!
		postUpdate(postId: ID!, post: PostInput!): PostPayload!
		postDelete(postId: ID!): PostPayload!
	}

	type User {
		id: ID!
		firstname: String!
		lastname: String!
		username: String!
		gender: Gender!
		posts: [Post!]!
		broadcasts: [Broadcast!]!
	}

	type Post {
		id: ID!
		title: String!
		description: String!
		user: User
		broadcast: Broadcast!
		approve: Int
		disapprove: Int
	}

	type Broadcast {
		id: ID!
		title: String!
		description: String!
		creator: User!
		user: [User!]!
		posts: [Post!]!
	}

	enum Gender {
		MALE
		FEMALE
	}

	type BroadcastPayload {
		userErrors: [userError!]!
		broadcast: Broadcast
	}

	type userError {
		message: String
	}

	input BroadcastInput {
		title: String!
		description: String!
	}

	type PostPayload {
		userErrors: [userError]
		post: Post
	}

	input PostInput {
		title: String!
		description: String!
	}
`;
